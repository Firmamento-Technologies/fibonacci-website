/**
 * Porta nel sito il catalogo delle procedure, dall'EMR.
 *
 * ⚠️ PERCHÉ UN GENERATORE, e non un copia-incolla come per le aree del viso.
 * Lì erano 23 coordinate che cambiano due volte l'anno, e un generatore da
 * tenere in vita costava più di quello che risolveva. Qui sono **115 voci** che
 * seguono il catalogo clinico: a mano non si riallineano, si lasciano invecchiare.
 *
 * ⚖️ Si porta SOLO ciò che serve alla vetrina — slug, titolo, categoria — e non
 * il resto del file (che contiene conteggi e note di lavorazione). Meno cose si
 * copiano, meno cose possono divergere.
 *
 * 🔒 Il presidio è `scripts/parita-catalogo.mjs`: confronta l'insieme degli slug
 * e il conteggio con la sorgente. Se l'EMR aggiunge o toglie una procedura e
 * nessuno rigenera, il collaudo diventa rosso e dice quali.
 *
 * USO:  node scripts/catalogo.mjs
 * Se il sottomodulo EMR non c'è, lo dice e non tocca niente.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const QUI = dirname(fileURLToPath(import.meta.url))
const SORGENTE = join(QUI, '../../EMR/data/consensi/procedure-catalog.json')
const USCITA = join(QUI, '..', 'src/lib/catalogo-consensi.json')

if (!existsSync(SORGENTE)) {
  console.log(`Sorgente assente (${SORGENTE}): il sottomodulo EMR non è in questo clone.`)
  console.log('Niente da fare — il catalogo già in src/lib resta quello.')
  process.exit(0)
}

const dati = JSON.parse(readFileSync(SORGENTE, 'utf8'))
const procedure = dati.procedures.map((p) => ({
  slug: p.slug,
  titolo: p.title,
  categoria: p.category,
}))

// ⛔ Ordine stabile: senza, ogni rigenerazione produce un diff finto e nessuno
// guarda più i diff di questo file.
procedure.sort((a, b) => a.slug.localeCompare(b.slug, 'it'))

writeFileSync(
  USCITA,
  JSON.stringify({ generato: 'node scripts/catalogo.mjs', procedure }, null, 1) + '\n',
  'utf8',
)

const categorie = new Set(procedure.map((p) => p.categoria))
console.log(`catalogo: ${procedure.length} procedure in ${categorie.size} categorie → src/lib/catalogo-consensi.json`)
