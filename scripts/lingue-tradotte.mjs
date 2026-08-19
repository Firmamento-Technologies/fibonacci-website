/**
 * Il presidio della traduzione: quanto del TESTO VISIBILE di ogni pagina è
 * davvero nella lingua di quella pagina.
 *
 * ── 🔴 PERCHE' ESISTE, ED E' LA PARTE CHE CONTA ─────────────────────────────
 * Prima il controllo stava dentro `costruisci-lingue.mjs` e confrontava i
 * **byte** della pagina con quelli dell'italiano:
 *
 *     if (testo === campioneItaliano) throw new Error(…)
 *
 * ⛔ **E' passato mentre la prosa ERA italiana.** Le due pagine differivano per
 * l'attributo `lang` e per i percorsi degli asset (`/de/_next/…` contro
 * `/_next/…`), quindi non erano byte-identiche: il controllo diceva «diverse»
 * e si fermava lì. Nel frattempo un visitatore tedesco leggeva titoli,
 * sommari, domande frequenti e bollini normativi in italiano.
 *
 * 🔑 E' la ragione per cui **sei difetti** dell'estrattore sono stati trovati a
 * mano, guardando le pagine, e non da questo presidio: un controllo che guarda
 * i byte non può vedere la lingua. La domanda giusta era *«se il difetto
 * entrasse dal verso opposto, questo controllo lo vedrebbe?»*, e la risposta
 * era no.
 *
 * ── COME MISURA ─────────────────────────────────────────────────────────────
 * Per ogni pagina e ogni lingua estrae il testo visibile (via gli script, via
 * i tag) e conta due cose sulle chiavi il cui valore in quella lingua **è
 * diverso** dall'italiano — le altre sono nomi propri e non dicono niente:
 *   · **tradotte**: quante di quelle frasi compaiono nella lingua giusta;
 *   · **residui**: quante compaiono ANCORA in italiano.
 *
 * ⚠️ Servono entrambe, e il perché è una lezione presa sbagliando: durante
 * questo lavoro la misura ha detto **«zero residui»** mentre `out/` **non
 * esisteva** — la costruzione era fallita e stavo contando zero pagine. Quasi
 * ogni modo di sbagliare una misura produce «zero». ⇒ un conteggio di
 * **tradotte** troppo basso è un guasto della misura, non un successo.
 *
 * ── LE TRE CONDIZIONI DI FALLIMENTO ─────────────────────────────────────────
 * 1. **Nessuna pagina** con testo visibile identico all'italiano. Fallimento
 *    secco, ⛔ non a soglia: è il difetto che il vecchio controllo doveva
 *    prendere e non prendeva.
 * 2. **I residui possono solo scendere** dal numero misurato oggi. Stessa forma
 *    di `testo-estratto.test.ts` nell'app e di `lint-produzione.py` nel
 *    knowledge, e per la stessa ragione: una regola scritta non è un presidio,
 *    un numero che non può salire sì.
 * 3. **Le tradotte non possono scendere** sotto una soglia. Senza questa,
 *    cancellare `out/` renderebbe il presidio verde.
 *
 * ⛔ Non alzare MASSIMO_RESIDUI e non abbassare MINIMO_TRADOTTE per far tornare
 *    il conto: è il gesto con cui si perdono i presidi, ed è già successo due
 *    volte in questo progetto (su `STATE.md`, e sui due presidi visivi).
 *
 * USO:  node scripts/lingue-tradotte.mjs           (dopo costruisci-lingue)
 *       node scripts/lingue-tradotte.mjs --dettaglio
 */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const RADICE = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(RADICE, 'out')
const DIZIONARI = join(RADICE, 'src', 'i18n', 'sito')

const LINGUE = ['en', 'es', 'fr', 'de']

/**
 * Misurato il 2026-08-17 sul costruito, con 1.146 chiavi × 5 lingue:
 *   en 6 · es 6 · fr 5 · de 5 residui.
 * Sono le frasi che compaiono ancora in italiano, e restano perché sono **dati
 * dei due studi dimostrativi** (i trattamenti che quel medico finto dichiara),
 * ⛔ non testo dell'interfaccia. Verificato aprendo le pagine: la pastiglia
 * tedesca dice «Botulinumtoxin», non «Tossina botulinica».
 * ⛔ Da qui può solo scendere.
 */
/**
 * ⛔ **ZERO, e non è severità: è che i residui legittimi ora hanno un nome.**
 *
 * 🔴 La soglia valeva **8**, e il 2026-08-19 si è misurato che cosa proteggeva
 * davvero: dopo aver marcato i dati del medico la linea di base era scesa a
 * **3 · 8 · 4 · 3**, cioè restavano **cinque posti liberi**. Provato: rimessa a
 * mano la stringa «Tutti gli studi», il presidio la elencava su tutte e quattro
 * le schede **restando VERDE**, perché 3+4 ≤ 8. Un margine numerico non
 * distingue un residuo che va bene da un difetto: li conta insieme.
 *
 * ⇒ Ora i residui accettati sono **elencati per nome** in `AMMESSI`, ognuno con
 * il perché, e tutto il resto è rosso al primo. ⚠️ Aggiungere una voce ad
 * `AMMESSI` è una decisione che si scrive; alzare un numero non lo era.
 */
const MASSIMO_RESIDUI = 0

/**
 * Le frasi che restano in italiano **a ragione**, con il motivo scritto.
 * ⛔ Non è una lista in cui parcheggiare ciò che non si ha voglia di tradurre:
 * ogni voce è stata **guardata nella pagina** prima di entrare qui, e quelle
 * che si sono rivelate difetti veri (i titoli delle sezioni nel riquadro della
 * cartella, i nomi delle categorie in quello dei richiami) sono state
 * **corrette**, non ammesse.
 */
const AMMESSI = {
  // Identificativi fiscali italiani: nominano strumenti dell'ordinamento
  // italiano e restano tali anche in un documento spagnolo o tedesco, accanto
  // al valore che li segue. Tradurli direbbe una cosa falsa.
  'chrome.footer.partita_iva': 'nome di un identificativo fiscale italiano',
  // I due documenti del sito si chiamano così anche nelle altre lingue: è il
  // loro titolo, e il rimando deve poterci arrivare.
  'lib.legaldocs.privacy_policy': 'titolo proprio del documento',
  'lib.legaldocs.cookie_policy': 'titolo proprio del documento',
}

/**
 * E quante frasi tradotte ci si aspetta di TROVARE. Misurate lo stesso giorno:
 * en 3.058 · es 2.877 · fr 2.882 · de 3.079.
 * ⚠️ La soglia è larga di proposito (2.000): serve a prendere il caso in cui la
 * misura non stia guardando niente — `out/` mancante, pagine vuote, dizionario
 * non letto — ⛔ non a inseguire il numero esatto, che cambia a ogni frase
 * aggiunta al sito.
 */
const MINIMO_TRADOTTE = 2000

const dettaglio = process.argv.includes('--dettaglio')

function pagine(dir) {
  const fuori = []
  for (const v of readdirSync(dir)) {
    const p = join(dir, v)
    if (statSync(p).isDirectory()) fuori.push(...pagine(p))
    else if (p.endsWith('.html')) fuori.push(p)
  }
  return fuori
}

const ENTITA = {
  '&nbsp;': ' ', '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"',
  '&#39;': "'", '&apos;': "'", '&laquo;': '«', '&raquo;': '»',
  '&egrave;': 'è', '&eacute;': 'é', '&agrave;': 'à', '&ugrave;': 'ù',
  '&ograve;': 'ò', '&igrave;': 'ì', '&hellip;': '…', '&middot;': '·',
}

/** Il testo che un visitatore legge: via gli script, via i tag, spazi uniformati. */
function visibile(file) {
  let s = readFileSync(file, 'utf8')
  s = s.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/g, ' ')
  /* 🔴 **Via il testo che è DATO del medico, non interfaccia** (2026-08-19).
   * Quando il canale pazienti ha cominciato a pubblicare studi veri, la pagina
   * inglese di uno studio di Milano conteneva «Tossina botulinica» e «Medico
   * chirurgo»: parole italiane dal dizionario, quindi contate come residui —
   * da ≤8 a **15-20**, con il rilascio bloccato. ⛔ Ma tradurle sarebbe
   * SBAGLIATO, non difficile: è il medico che dichiara che cosa fa, e
   * riscriverglielo in un'altra lingua vuol dire pubblicare una prestazione
   * che non ha dichiarato.
   * ⇒ Il dato si marca alla sorgente (`components/pazienti/Dato.tsx`) e qui si
   * salta. ⚠️ **Non è un allentamento**: è la stessa distinzione già fatta per
   * i nomi propri qualche riga più giù (`tr[k] !== it[k]`), applicata a ciò che
   * il dizionario non può conoscere perché arriva da un'altra macchina.
   * 🔑 Provato rimettendo un difetto e pretendendo il rosso: le etichette
   * dell'interfaccia sulle stesse pagine continuano a essere misurate. */
  s = s.replace(/<span data-dato=""[^>]*>[\s\S]*?<\/span>/g, ' ')
  s = s.replace(/<[^>]+>/g, ' ')
  s = s.replace(/&#?\w+;/g, (m) => ENTITA[m] ?? (/^&#\d+;$/.test(m) ? String.fromCharCode(+m.slice(2, -1)) : m))
  return s.replace(/\s+/g, ' ').trim()
}

const dizionario = (l) => JSON.parse(readFileSync(join(DIZIONARI, `${l}.json`), 'utf8'))

/**
 * La frase è nel testo, **a confine di parola**.
 *
 * ⚠️ `String.includes` da solo dà falsi positivi che sembrano difetti veri:
 * l'italiano «Alternative» risultava presente nella pagina tedesca perché sta
 * **dentro** «Alternativen». Il presidio segnalava un residuo che non c'era, e
 * un presidio che grida al lupo viene spento.
 * ⛔ Non è un allentamento: è la differenza fra misurare la lingua e misurare
 *    una sottostringa.
 */
function contiene(testo, frase) {
  const i = testo.indexOf(frase)
  if (i < 0) return false
  const prima = testo[i - 1] ?? ' '
  const dopo = testo[i + frase.length] ?? ' '
  const parola = /[\p{L}\p{N}]/u
  return !(parola.test(prima) && parola.test(frase[0])) && !(parola.test(dopo) && parola.test(frase.at(-1)))
}

let uscita = 0
const it = dizionario('it')

// ── 0. La misura sta guardando qualcosa? ────────────────────────────────────
// ⛔ Prima di ogni altra cosa: senza questo, `out/` mancante darebbe «zero
//    residui» e il presidio si dichiarerebbe soddisfatto. E' successo.
let tutte
try {
  tutte = pagine(OUT)
} catch {
  console.error(`⛔ out/ non esiste. ⇒ questo presidio non ha niente da misurare, e`)
  console.error(`   «zero residui» sarebbe una risposta FALSA. Costruisci prima:`)
  console.error(`   node scripts/costruisci-lingue.mjs`)
  process.exit(1)
}
if (tutte.length < 100) {
  console.error(`⛔ solo ${tutte.length} pagine in out/: il costruito è parziale.`)
  process.exit(1)
}

for (const l of LINGUE) {
  const tr = dizionario(l)
  // Solo le chiavi che in questa lingua DICONO qualcosa di diverso: sui nomi
  // propri («Fibonacci», «Filler») la coincidenza non è un difetto.
  const confrontabili = Object.keys(it).filter((k) => it[k].length > 8 && tr[k] !== it[k])

  let tradotte = 0
  const residui = []
  let identiche = []

  for (const f of pagine(join(OUT, l))) {
    const t = visibile(f)
    const neutro = relative(join(OUT, l), f)

    // 1. Testo visibile identico all'italiano ⇒ la lingua non è arrivata.
    try {
      if (t === visibile(join(OUT, neutro))) identiche.push(neutro)
    } catch {
      /* la pagina non esiste in italiano: legittimo */
    }

    for (const k of confrontabili) {
      if (contiene(t, tr[k])) tradotte += 1
      if (contiene(t, it[k]) && !(k in AMMESSI)) {
        residui.push({ pagina: neutro, chiave: k, testo: it[k] })
      }
    }
  }

  const esito = identiche.length === 0 && residui.length <= MASSIMO_RESIDUI && tradotte >= MINIMO_TRADOTTE
  console.log(
    `${esito ? '✅' : '⛔'} ${l}: tradotte ${tradotte} · residui ${residui.length}` +
      ` · ${Object.keys(AMMESSI).length} frasi ammesse per nome` +
      (identiche.length ? ` · ${identiche.length} pagine IDENTICHE all'italiano` : ''),
  )

  if (identiche.length) {
    uscita = 1
    console.log(`   ⛔ testo visibile identico all'italiano: ${identiche.slice(0, 5).join(', ')}`)
    console.log(`      ⇒ il dizionario ${l}.json non è stato letto, o è una copia.`)
  }
  if (tradotte < MINIMO_TRADOTTE) {
    uscita = 1
    console.log(`   ⛔ solo ${tradotte} frasi tradotte trovate (minimo ${MINIMO_TRADOTTE}).`)
    console.log(`      ⚠️ Non è «poco tradotto»: è la MISURA che non sta guardando.`)
  }
  if (residui.length > MASSIMO_RESIDUI) {
    uscita = 1
    console.log(`   ⛔ ${residui.length} frasi ancora in italiano (massimo ${MASSIMO_RESIDUI}):`)
    for (const r of residui.slice(0, 10)) {
      console.log(`      ${r.pagina}  ${r.chiave}\n         «${r.testo.slice(0, 66)}»`)
    }
    console.log(`      ⇒ mettile nel dizionario. ⛔ NON alzare MASSIMO_RESIDUI.`)
  } else if (dettaglio && residui.length) {
    for (const r of residui) console.log(`      · ${r.pagina}  ${r.chiave}`)
  }
}

if (uscita) {
  console.log(`\n⛔ Il presidio della traduzione è ROSSO.`)
} else {
  console.log(`\n✅ Le quattro lingue sono tradotte nel testo visibile, non solo nei byte.`)
}
process.exit(uscita)
