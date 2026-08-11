/**
 * Porta nel sito il vocabolario dei farmaci — SENZA nomi commerciali.
 *
 * ⛔ IL VINCOLO CHE DECIDE LA FORMA DI QUESTO FILE.
 * La sorgente (`EMR/data/aifa/sample-aifa.csv`) contiene marchi e ditte:
 * VISTABEX, BOCOUTURE, ALLERGAN… e **tutte** le 46 confezioni sono soggette a
 * prescrizione (39 `RR`, 7 `OSP - USO OSPEDALIERO`). La Direttiva 2001/83/CE
 * artt. 86-100 — come richiamata dalla Comunicazione della Commissione sulle
 * pratiche commerciali sleali, tier 1 — è esplicita:
 *
 *     «Advertisement of prescription-only medicines and products containing
 *      psychotropic or narcotic substances is prohibited.»
 *
 * Un sito che vende un gestionale non è un prontuario: elencare lì i marchi di
 * medicinali con obbligo di ricetta è pubblicità di un medicinale al pubblico,
 * e **è vietata**. ⇒ Qui si portano solo **principio attivo**, **codice ATC**,
 * **regime di fornitura** e il **conteggio delle confezioni**. Nessun marchio,
 * nessuna ditta, nessun codice AIC.
 *
 * 🔑 E non è una rinuncia: il differenziante del prodotto **è** la prescrizione
 * per principio attivo, non il marchio. Ciò che resta è esattamente ciò che
 * conta.
 *
 * ⚠️ Il campione è un CAMPIONE: 46 confezioni del sottoinsieme estetico, non le
 * ~159.000 righe che `import_aifa.py` scarica da AIFA ogni giorno. Il
 * componente lo dice; ⛔ non far dire al sito «abbiamo tutto l'AIFA» partendo
 * da questo file.
 *
 * USO:  node scripts/farmaci.mjs
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const QUI = dirname(fileURLToPath(import.meta.url))
const SORGENTE = join(QUI, '../../EMR/data/aifa/sample-aifa.csv')
const USCITA = join(QUI, '..', 'src/lib/farmaci-aifa.json')

/** Le colonne che si possono portare in vetrina. ⛔ Tutte le altre no. */
const AMMESSE = ['CODICE_ATC', 'PA_ASSOCIATI', 'FORNITURA']

if (!existsSync(SORGENTE)) {
  console.log(`Sorgente assente (${SORGENTE}): il sottomodulo EMR non è in questo clone.`)
  process.exit(0)
}

const righe = readFileSync(SORGENTE, 'utf8').trim().split('\n')
const intestazione = righe[0].split(';')
const idx = Object.fromEntries(AMMESSE.map((c) => [c, intestazione.indexOf(c)]))
for (const [c, i] of Object.entries(idx)) {
  if (i < 0) {
    console.error(`✗ colonna «${c}» assente nel CSV: lo schema AIFA è cambiato`)
    process.exit(1)
  }
}

/** «TOSSINA BOTULINICA DI TIPO A» → «Tossina botulinica di tipo A».
 *  ⚠️ Le parole di UNA lettera restano maiuscole: la prima versione produceva
 *  «di tipo a», e su un termine clinico il tipo del sierotipo non è un
 *  dettaglio tipografico — è parte del nome. */
const capitalizza = (s) =>
  (s.charAt(0) + s.slice(1).toLowerCase()).replace(/\b([a-z])\b/g, (m) => m.toUpperCase())

const perPrincipio = new Map()
for (const r of righe.slice(1)) {
  const col = r.split(';')
  const pa = col[idx.PA_ASSOCIATI].trim()
  const atc = col[idx.CODICE_ATC].trim()
  const fornitura = col[idx.FORNITURA].split(' - ')[0].trim()
  if (!pa) continue
  const chiave = `${pa}|${atc}`
  const v = perPrincipio.get(chiave) ?? { principio: capitalizza(pa), atc, fornitura, confezioni: 0 }
  v.confezioni += 1
  perPrincipio.set(chiave, v)
}

const principi = [...perPrincipio.values()].sort((a, b) =>
  a.principio.localeCompare(b.principio, 'it'),
)

writeFileSync(
  USCITA,
  JSON.stringify(
    { generato: 'node scripts/farmaci.mjs', confezioniNelCampione: righe.length - 1, principi },
    null,
    1,
  ) + '\n',
  'utf8',
)

console.log(
  `farmaci: ${principi.length} principi attivi da ${righe.length - 1} confezioni ` +
    `(nessun marchio, nessuna ditta, nessun AIC) → src/lib/farmaci-aifa.json`,
)
