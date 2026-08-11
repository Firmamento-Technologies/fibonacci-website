/**
 * Il vocabolario dei farmaci in vetrina: parità coi dati, e soprattutto
 * **nessun nome commerciale**.
 *
 * ⛔ QUI IL CONTROLLO CHE CONTA NON È LA PARITÀ, È IL DIVIETO.
 * La sorgente AIFA contiene marchi e ditte di medicinali **soggetti a
 * prescrizione**, e la Direttiva 2001/83/CE artt. 86-100 vieta la pubblicità al
 * pubblico di quei medicinali. `scripts/farmaci.mjs` porta di proposito solo
 * principio attivo, ATC, regime di fornitura e conteggio.
 *
 * Ma un generatore si modifica: basta che qualcuno aggiunga `DENOMINAZIONE`
 * all'elenco delle colonne ammesse — magari per «rendere la lista più utile» —
 * e il sito comincia a pubblicare marchi di farmaci con obbligo di ricetta,
 * senza che niente si lamenti. Questo presidio legge i **marchi veri dal CSV** e
 * verifica che **nessuno** compaia nel file pubblicato.
 *
 * Si esegue anche da solo:  node scripts/parita-farmaci.mjs
 */
import { readFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const QUI = dirname(fileURLToPath(import.meta.url))

export function paritaFarmaci(problemi, avvisa = console.log) {
  const copiaPath = join(QUI, '..', 'src/lib/farmaci-aifa.json')
  if (!existsSync(copiaPath)) {
    problemi.push('farmaci: manca `src/lib/farmaci-aifa.json` — esegui `node scripts/farmaci.mjs`')
    return
  }
  const testoCopia = readFileSync(copiaPath, 'utf8')
  const copia = JSON.parse(testoCopia)

  if (!Array.isArray(copia.principi) || copia.principi.length === 0) {
    problemi.push('farmaci: la copia nel sito è vuota o malformata — il confronto NON è stato fatto')
    return
  }

  const sorgente = join(QUI, '../../EMR/data/aifa/sample-aifa.csv')
  if (!existsSync(sorgente)) {
    avvisa(`Farmaci AIFA: non verificati contro l’EMR (il sottomodulo non è in questo clone). ${copia.principi.length} principi attivi nella copia.`)
    return
  }

  const righe = readFileSync(sorgente, 'utf8').trim().split('\n')
  const cols = righe[0].split(';')
  const iDen = cols.indexOf('DENOMINAZIONE')
  const iDitta = cols.indexOf('RAGIONE_SOCIALE')
  const iAic = cols.indexOf('CODICE_AIC')
  const iPa = cols.indexOf('PA_ASSOCIATI')
  const iAtc = cols.indexOf('CODICE_ATC')
  if ([iDen, iDitta, iAic, iPa, iAtc].some((i) => i < 0)) {
    problemi.push('farmaci: lo schema del CSV AIFA è cambiato — il controllo NON è stato fatto')
    return
  }

  // ── (1) IL DIVIETO ────────────────────────────────────────────────────────
  // Marchi, ditte e AIC non devono comparire nel file pubblicato. Si cerca la
  // PRIMA PAROLA del marchio (i nomi commerciali sono composti: «VISTABEX 100 U
  // IM/INTRADERMICO»), che è quella che identifica il prodotto.
  /* ⚠️ Si cerca SOLO nei valori che finiscono in pagina, non nel testo del file:
   * la prima versione scandiva tutto il JSON e trovava «FARMA» dentro
   * `"generato": "node scripts/farmaci.mjs"`. Un presidio che si accusa da solo
   * è rumore, e il rumore fa spegnere i presidi. */
  const pubblicato = copia.principi
    .map((p) => `${p.principio} ${p.atc} ${p.fornitura}`)
    .join(' | ')
    .toUpperCase()

  /* ⚠️ E i GENERICI si chiamano come la molecola: «DESLORATADINA …»,
   * «METFORMINA …». Il loro marchio coincide col principio attivo, che è
   * esattamente la cosa che è LECITO pubblicare. Senza questa esclusione il
   * presidio bocciava il file corretto — misurato, quattro falsi positivi. */
  const principiAttivi = new Set()
  for (const r of righe.slice(1)) {
    const pa = (r.split(';')[iPa] ?? '').trim().toUpperCase()
    for (const parola of pa.split(/[\s+,]+/)) if (parola.length >= 5) principiAttivi.add(parola)
  }

  const trapelati = new Set()
  for (const r of righe.slice(1)) {
    const c = r.split(';')
    const marchio = (c[iDen] ?? '').trim().split(/[\s,]/)[0]
    const ditta = (c[iDitta] ?? '').trim().split(/[\s,]/)[0]
    const aic = (c[iAic] ?? '').trim()
    for (const v of [marchio, ditta]) {
      // ≥5 caratteri: sotto, si incrocerebbero sillabe comuni.
      if (!v || v.length < 5) continue
      if (principiAttivi.has(v.toUpperCase())) continue // è la molecola, non il marchio
      if (pubblicato.includes(v.toUpperCase())) trapelati.add(v)
    }
    if (aic && pubblicato.includes(aic)) trapelati.add(`AIC ${aic}`)
  }
  if (trapelati.size) {
    problemi.push(
      `🔴 farmaci: nel file pubblicato compaiono NOMI COMMERCIALI o codici AIC ` +
        `(${[...trapelati].slice(0, 4).join(', ')}). La pubblicità al pubblico di medicinali ` +
        `soggetti a prescrizione è VIETATA (Dir. 2001/83/CE artt. 86-100): ` +
        `rigenera con \`node scripts/farmaci.mjs\`, che porta solo principio attivo e ATC`,
    )
  }

  // ── (2) La parità dei principi attivi ────────────────────────────────────
  const veri = new Set()
  for (const r of righe.slice(1)) {
    const c = r.split(';')
    const pa = (c[iPa] ?? '').trim()
    if (pa) veri.add(`${pa.toUpperCase()}|${(c[iAtc] ?? '').trim()}`)
  }
  const nostri = new Set(copia.principi.map((p) => `${p.principio.toUpperCase()}|${p.atc}`))
  const mancanti = [...veri].filter((v) => !nostri.has(v))
  const inPiu = [...nostri].filter((v) => !veri.has(v))
  if (mancanti.length || inPiu.length) {
    problemi.push(
      `farmaci: i principi attivi divergono — ` +
        (mancanti.length ? `${mancanti.length} nell'EMR e non nel sito` : '') +
        (mancanti.length && inPiu.length ? ' | ' : '') +
        (inPiu.length ? `${inPiu.length} nel sito e non nell'EMR (${inPiu.slice(0, 2).join(', ')})` : '') +
        ' — rigenera con `node scripts/farmaci.mjs`',
    )
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const problemi = []
  paritaFarmaci(problemi, (m) => console.log(`\x1b[33m${m}\x1b[0m`))
  if (problemi.length) {
    console.log(`\x1b[31m${problemi.length} problemi:\x1b[0m`)
    for (const p of problemi) console.log('  ' + p)
    process.exitCode = 1
  } else {
    console.log('\x1b[32mFarmaci AIFA: principi attivi allineati, e nessun nome commerciale in vetrina.\x1b[0m')
  }
}
