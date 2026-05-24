'use client'

import { useState, useRef } from 'react'
import { Upload, CheckCircle2, AlertCircle, FileText, X } from 'lucide-react'

interface PdfAnalysis {
  fileName: string
  fileSize: number
  isPdf: boolean
  isPdfA: boolean
  hasSignature: boolean
  hasXmp: boolean
  pdfVersion: string | null
  signatures: { name: string; date: string }[]
  metadata: Record<string, string>
  warnings: string[]
  bytesAnalyzed: number
}

/**
 * Analisi PDF best-effort lato browser.
 *
 * Limitazioni del verifier client-side (onesto):
 * - NO validazione crittografica firma vs trust list eIDAS EU
 * - NO confronto hash con audit chain Fibonacci
 *
 * Quello che FA: parser bytes per riconoscere struttura PDF, signature
 * dictionary, XMP metadata. Sufficiente come prima screening; per
 * verifica legale formale serve Aruba Sign / Adobe Reader Pro / DigiSign.
 */
async function analyzePdf(file: File): Promise<PdfAnalysis> {
  const buffer = await file.arrayBuffer()
  const bytes = new Uint8Array(buffer)
  const decoder = new TextDecoder('latin1')
  const text = decoder.decode(bytes.slice(0, Math.min(bytes.length, 500_000)))

  const warnings: string[] = []
  const analysis: PdfAnalysis = {
    fileName: file.name,
    fileSize: file.size,
    isPdf: false,
    isPdfA: false,
    hasSignature: false,
    hasXmp: false,
    pdfVersion: null,
    signatures: [],
    metadata: {},
    warnings,
    bytesAnalyzed: Math.min(bytes.length, 500_000),
  }

  if (!text.startsWith('%PDF-')) {
    warnings.push('File non riconosciuto come PDF (manca header %PDF-)')
    return analysis
  }
  analysis.isPdf = true
  const versionMatch = text.match(/^%PDF-(\d+\.\d+)/)
  if (versionMatch) analysis.pdfVersion = versionMatch[1]

  // PDF/A-3b detection (cerca part="3" + conformance="B" nel XMP)
  analysis.isPdfA = /pdfaid:part="3"/.test(text) && /pdfaid:conformance="B"/.test(text)
  if (!analysis.isPdfA) {
    warnings.push('Documento NON sembra PDF/A-3b (conservazione decennale CAD art. 44 non garantita)')
  }

  // XMP metadata block
  const xmpMatch = text.match(/<x:xmpmeta[^>]*>([\s\S]*?)<\/x:xmpmeta>/)
  if (xmpMatch) {
    analysis.hasXmp = true
    const xmp = xmpMatch[1]
    const titleMatch = xmp.match(/<dc:title>[\s\S]*?<rdf:li[^>]*>([\s\S]*?)<\/rdf:li>/)
    if (titleMatch) analysis.metadata.title = titleMatch[1].trim()
    const creatorMatch = xmp.match(/<dc:creator>[\s\S]*?<rdf:li[^>]*>([\s\S]*?)<\/rdf:li>/)
    if (creatorMatch) analysis.metadata.creator = creatorMatch[1].trim()
    const producerMatch = xmp.match(/<pdf:Producer[^>]*>([^<]+)<\/pdf:Producer>/)
    if (producerMatch) analysis.metadata.producer = producerMatch[1].trim()
    const createDateMatch = xmp.match(/<xmp:CreateDate>([^<]+)<\/xmp:CreateDate>/)
    if (createDateMatch) analysis.metadata.createDate = createDateMatch[1].trim()
  }

  // Signature dictionary detection (/Sig + /ByteRange + /Contents)
  const sigDicts = text.match(/\/Type\s*\/Sig[^\/]*?\/ByteRange/g)
  if (sigDicts && sigDicts.length > 0) {
    analysis.hasSignature = true
    const nameMatches = text.matchAll(/\/Name\s*\(([^)]+)\)/g)
    const dateMatches = text.matchAll(/\/M\s*\(([^)]+)\)/g)
    const names = Array.from(nameMatches).map((m) => m[1])
    const dates = Array.from(dateMatches).map((m) => m[1])
    const count = Math.max(names.length, dates.length, sigDicts.length)
    for (let i = 0; i < count; i++) {
      analysis.signatures.push({
        name: names[i] || `Firma #${i + 1}`,
        date: dates[i] || 'data non disponibile',
      })
    }
  } else {
    warnings.push('Nessuna firma elettronica rilevata. Documento potrebbe essere non firmato o firmato esternamente.')
  }

  if (analysis.metadata.producer && !/(weasyprint|fibonacci)/i.test(analysis.metadata.producer)) {
    warnings.push(
      `Producer "${analysis.metadata.producer}" non riconosciuto come Fibonacci. Verifica autenticità del file.`,
    )
  }

  return analysis
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1_048_576) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1_048_576).toFixed(1)} MB`
}

export function VerifierUpload() {
  const [analysis, setAnalysis] = useState<PdfAnalysis | null>(null)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File) {
    setLoading(true)
    setAnalysis(null)
    try {
      const result = await analyzePdf(file)
      setAnalysis(result)
    } catch (e) {
      setAnalysis({
        fileName: file.name,
        fileSize: file.size,
        isPdf: false,
        isPdfA: false,
        hasSignature: false,
        hasXmp: false,
        pdfVersion: null,
        signatures: [],
        metadata: {},
        warnings: [`Errore analisi: ${e instanceof Error ? e.message : String(e)}`],
        bytesAnalyzed: 0,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {!analysis && (
        <div
          className="rounded-2xl border-2 border-dashed p-12 text-center cursor-pointer transition-colors hover:bg-[var(--card)]"
          style={{ borderColor: 'var(--accent)', background: 'var(--card)' }}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault()
            const file = e.dataTransfer.files?.[0]
            if (file) handleFile(file)
          }}
        >
          <Upload className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--accent)' }} />
          <p className="font-semibold mb-1" style={{ color: 'var(--fg)' }}>
            {loading ? 'Analisi in corso…' : 'Trascina il PDF qui o clicca per selezionare'}
          </p>
          <p className="text-xs" style={{ color: 'var(--muted)' }}>
            File rimane sul tuo browser. Nessun upload a server esterni.
          </p>
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf,.pdf"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleFile(file)
            }}
          />
        </div>
      )}

      {analysis && (
        <div
          className="rounded-2xl p-6 space-y-5"
          style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0 flex-1">
              <FileText className="w-7 h-7 shrink-0" style={{ color: 'var(--accent)' }} />
              <div className="min-w-0">
                <p className="font-semibold truncate" style={{ color: 'var(--fg)' }}>
                  {analysis.fileName}
                </p>
                <p className="text-xs" style={{ color: 'var(--muted)' }}>
                  {formatSize(analysis.fileSize)} · PDF v{analysis.pdfVersion ?? '?'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setAnalysis(null)}
              className="text-sm transition-opacity hover:opacity-70"
              style={{ color: 'var(--muted)' }}
              title="Chiudi"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Check label="PDF valido" ok={analysis.isPdf} />
            <Check label="PDF/A-3b" ok={analysis.isPdfA} />
            <Check label="Metadati XMP" ok={analysis.hasXmp} />
            <Check label="Firma elettronica" ok={analysis.hasSignature} />
          </div>

          {analysis.signatures.length > 0 && (
            <div className="pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
              <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--muted)' }}>
                Firme rilevate ({analysis.signatures.length})
              </p>
              <ul className="space-y-1.5">
                {analysis.signatures.map((s, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm" style={{ color: 'var(--fg)' }}>
                    <CheckCircle2 className="w-4 h-4" style={{ color: '#16a34a' }} />
                    <span className="font-medium">{s.name}</span>
                    <span style={{ color: 'var(--muted)' }}>·</span>
                    <span style={{ color: 'var(--muted)' }}>{s.date}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {Object.keys(analysis.metadata).length > 0 && (
            <div className="pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
              <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--muted)' }}>
                Metadati documento
              </p>
              <dl className="space-y-1 text-xs">
                {analysis.metadata.title && (
                  <Row label="Titolo" value={analysis.metadata.title} />
                )}
                {analysis.metadata.creator && (
                  <Row label="Creator" value={analysis.metadata.creator} />
                )}
                {analysis.metadata.producer && (
                  <Row label="Producer" value={analysis.metadata.producer} />
                )}
                {analysis.metadata.createDate && (
                  <Row label="Data creazione" value={analysis.metadata.createDate} />
                )}
              </dl>
            </div>
          )}

          {analysis.warnings.length > 0 && (
            <div
              className="rounded-xl p-4 space-y-2"
              style={{ background: '#fef3c7', border: '1px solid #f59e0b' }}
            >
              <p className="text-xs font-semibold flex items-center gap-1.5" style={{ color: '#92400e' }}>
                <AlertCircle className="w-4 h-4" />
                Avvertenze
              </p>
              {analysis.warnings.map((w, i) => (
                <p key={i} className="text-xs" style={{ color: '#92400e' }}>
                  · {w}
                </p>
              ))}
            </div>
          )}

          <p className="text-[10px] pt-2 border-t" style={{ color: 'var(--muted)', borderColor: 'var(--border)' }}>
            Analisi client-side best-effort sui primi {formatSize(analysis.bytesAnalyzed)}. Per
            verifica legale formale di validità della firma elettronica avanzata eIDAS, usare Aruba
            Sign / Adobe Reader Pro / InfoCert DigiSign che validano contro la EU Trust List ufficiale.
          </p>
        </div>
      )}
    </div>
  )
}

function Check({ label, ok }: { label: string; ok: boolean }) {
  return (
    <div
      className="flex items-center gap-2 px-3 py-2.5 rounded-lg"
      style={{
        background: ok ? '#dcfce7' : '#fee2e2',
        border: `1px solid ${ok ? '#86efac' : '#fca5a5'}`,
      }}
    >
      {ok ? (
        <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: '#16a34a' }} />
      ) : (
        <X className="w-4 h-4 shrink-0" style={{ color: '#dc2626' }} />
      )}
      <span className="text-xs font-medium" style={{ color: ok ? '#15803d' : '#991b1b' }}>
        {label}
      </span>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <dt className="font-semibold shrink-0 min-w-[100px]" style={{ color: 'var(--muted)' }}>
        {label}:
      </dt>
      <dd className="break-all" style={{ color: 'var(--fg)' }}>
        {value}
      </dd>
    </div>
  )
}
