/**
 * Rigenera i dati della mappa del viso DALL'ORIGINALE dell'applicazione.
 *
 * ── PERCHÉ ESISTE (TD-155) ───────────────────────────────────────────────────
 * `src/lib/aree-viso.ts` era una copia A MANO di tabelle dell'EMR. Il
 * rifacimento della mappa (2026-08-14) le ha spostate in `volto-mappa.ts` e
 * rese CALCOLATE (`faceCoordsForGender(...)`): una regex non può più leggerle,
 * e il presidio `parita-viso` è rimasto a confrontare il blocco sbagliato —
 * denunciava divergenze prive di senso e bloccava ogni push.
 *
 * La copia a mano muore qui: questo script IMPACCHETTA il modulo vero
 * dell'applicazione (esbuild, lo stesso dell'EMR), lo ESEGUE, e scrive
 * `src/lib/aree-viso-dati.json` con dentro:
 *   · le aree (codici + etichette) da `FACE_AREAS`,
 *   · le coordinate calcolate donna/uomo da `FACE_AREA_COORDS_FEMALE/MALE`,
 *   · l'impronta dei due file sorgente (`revisione`), che il presidio
 *     confronta: se l'EMR cambia e il sito non si rigenera, il collaudo è
 *     ROSSO con il comando esatto — questo.
 *
 * Uso:  node scripts/rigenera-aree-viso.mjs
 */
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const QUI = dirname(fileURLToPath(import.meta.url))
const EMR_WEB = join(QUI, '../../EMR/apps/web')
const SORGENTI = [
  join(EMR_WEB, 'src/lib/volto-mappa.ts'),
  join(EMR_WEB, 'src/lib/body-areas.ts'),
]
const ESBUILD = join(EMR_WEB, 'node_modules/.bin/esbuild')
const DESTINAZIONE = join(QUI, '../src/lib/aree-viso-dati.json')

export function improntaSorgenti() {
  const h = createHash('sha256')
  for (const f of SORGENTI) h.update(readFileSync(f))
  return h.digest('hex').slice(0, 16)
}

function rigenera() {
  const tmp = mkdtempSync(join(tmpdir(), 'aree-viso-'))
  try {
    const entry = join(tmp, 'entry.ts')
    writeFileSync(
      entry,
      `import { FACE_AREAS } from '${join(EMR_WEB, 'src/lib/body-areas.ts')}'\n` +
        `import { FACE_AREA_COORDS_FEMALE, FACE_AREA_COORDS_MALE } from '${join(EMR_WEB, 'src/lib/volto-mappa.ts')}'\n` +
        `console.log(JSON.stringify({\n` +
        `  aree: FACE_AREAS.map((a) => ({ code: a.code, label: a.label })),\n` +
        `  coordDonna: FACE_AREA_COORDS_FEMALE,\n` +
        `  coordUomo: FACE_AREA_COORDS_MALE,\n` +
        `}))\n`,
    )
    const bundle = join(tmp, 'bundle.mjs')
    execFileSync(ESBUILD, [entry, '--bundle', '--format=esm', '--platform=node', `--outfile=${bundle}`], {
      stdio: ['ignore', 'inherit', 'inherit'],
    })
    const stdout = execFileSync(process.execPath, [bundle], { encoding: 'utf8' })
    const dati = JSON.parse(stdout.trim().split('\n').at(-1))
    if (!dati.aree?.length || !Object.keys(dati.coordDonna ?? {}).length) {
      throw new Error('rigenera-aree-viso: il modulo ha risposto vuoto — niente scrittura')
    }
    const contenuto = {
      _generato: 'da scripts/rigenera-aree-viso.mjs: ⛔ NON modificare a mano',
      revisione: improntaSorgenti(),
      ...dati,
    }
    writeFileSync(DESTINAZIONE, JSON.stringify(contenuto, null, 2) + '\n')
    console.log(
      `aree-viso-dati.json: ${dati.aree.length} aree, ` +
        `${Object.keys(dati.coordDonna).length} coord donna, ` +
        `${Object.keys(dati.coordUomo).length} coord uomo — revisione ${contenuto.revisione}`,
    )
  } finally {
    rmSync(tmp, { recursive: true, force: true })
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  rigenera()
}
