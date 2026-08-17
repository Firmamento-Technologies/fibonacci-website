/**
 * Traduce il dizionario del sito (`src/i18n/sito/it.json`) nelle altre quattro
 * lingue, e i documenti legali di `src/content/legal/`.
 *
 * ── PERCHE' UNA FILIERA E NON UNA TRADUZIONE SCRITTA UNA VOLTA ──────────────
 * È la stessa ragione scritta in `traduci-manuale.mjs`, e vale identica qui:
 * il sito cambia. Tradotto a mano una volta sarebbe corretto il giorno stesso e
 * sbagliato alla prima frase riscritta, ⛔ e resterebbe un italiano aggiornato
 * con quattro lingue ferme **senza che niente lo segnali**.
 * ⇒ qui la traduzione è un passaggio **ripetibile**: `--riprendi` traduce solo
 *   le chiavi nuove o cambiate, e il resto non si tocca.
 *
 * ── I CONTROLLI, che sono la parte che conta ────────────────────────────────
 * Una traduzione che perde un segnaposto `{{euro}}` produce una frase con un
 * buco, e **nessun errore**: la pagina si costruisce e il numero sparisce.
 * Quindi ogni voce tradotta viene confrontata con l'originale su:
 *   · gli stessi segnaposto `{{…}}`, stesso insieme;
 *   · nessuna riga vuota dove l'italiano aveva testo;
 *   · il risultato **diverso** dall'italiano, salvo che sia un nome proprio.
 * ⛔ Se non torna, la voce **non viene scritta** e lo script la elenca.
 *
 * ── LE PAGINE LEGALI ────────────────────────────────────────────────────────
 * Con `--legali` traduce anche `src/content/legal/*.md` (132 KB: privacy, DPA,
 * termini, sicurezza, sub-responsabili). ⚠️ Decisione dell'utente del
 * 2026-08-17: si traducono **con la clausola «prevale l'italiano»**, che lo
 * script antepone da sé a ogni documento tradotto. È prassi standard: il
 * lettore capisce, e il testo che vincola resta uno solo.
 *
 * USO:
 *   node scripts/traduci-sito.mjs                  dizionario, tutte le lingue
 *   node scripts/traduci-sito.mjs --lingua=de      una sola
 *   node scripts/traduci-sito.mjs --riprendi       solo le chiavi mancanti
 *   node scripts/traduci-sito.mjs --legali         anche i documenti legali
 *
 * La chiave sta in `LLM_API_KEY` (la stessa del prodotto, Mistral).
 */
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const RADICE = join(dirname(fileURLToPath(import.meta.url)), '..')
const DIZIONARI = join(RADICE, 'src', 'i18n', 'sito')
const LEGALI = join(RADICE, 'src', 'content', 'legal')

const LINGUE = { en: 'inglese', es: 'spagnolo', fr: 'francese', de: 'tedesco' }

const BASE = process.env.LLM_BASE_URL ?? 'https://api.mistral.ai/v1'
const MODELLO = process.env.LLM_MODEL ?? 'mistral-large-latest'
const CHIAVE = process.env.LLM_API_KEY

/** I nomi che restano come sono, in ogni lingua. Sono enti e obblighi
 *  ITALIANI: il lettore straniero deve poterli cercare con quel nome. */
const INVARIANTI = [
  'Fibonacci', 'Medplum', 'FHIR', 'AIFA', 'AGENAS', 'PEC', 'GDPR', 'eIDAS',
  'Ordine dei Medici', 'Garante', 'FSE', 'REA', 'ISO 27001', 'PDF/A-3b',
  'Sistema Tessera Sanitaria', 'Codice Fiscale',
]

/** La clausola che l'utente ha scelto il 2026-08-17 per le pagine legali. */
const PREVALE_ITALIANO = {
  en: '> **Courtesy translation.** In case of any discrepancy, the Italian version of this document prevails.',
  es: '> **Traducción de cortesía.** En caso de discrepancia, prevalece la versión italiana de este documento.',
  fr: '> **Traduction de courtoisie.** En cas de divergence, la version italienne de ce document fait foi.',
  de: '> **Übersetzung als Serviceleistung.** Bei Abweichungen ist die italienische Fassung dieses Dokuments maßgeblich.',
}

const arg = (nome) => process.argv.find((a) => a.startsWith(`--${nome}=`))?.split('=')[1]
const flag = (nome) => process.argv.includes(`--${nome}`)

function istruzioni(lingua, tipo) {
  const comune = `Sei un traduttore tecnico specializzato in software sanitario e medicina estetica.
Traduci in ${lingua} il testo che segue.

REGOLE, in ordine di importanza:
1. Restituisci SOLO la traduzione. Nessun preambolo, nessuna spiegazione, nessun blocco di codice attorno al risultato.
2. NON tradurre e NON alterare i segnaposto fra doppie graffe come {{euro}} o {{count}}: vanno riprodotti IDENTICI, stesso numero e stesso nome.
3. Lascia INVARIATI questi nomi propri, istituzioni e sigle: ${INVARIANTI.join(', ')}.
   Traduci la prosa intorno, non il nome.
4. Usa la terminologia clinica e giuridica corretta della lingua di destinazione (anamnesi, consenso informato, cartella clinica, seduta, filler, tossina botulinica, titolare del trattamento, responsabile del trattamento).
5. Dai del tu al lettore come fa l'originale, e mantieni lo stesso registro: pratico, diretto, senza enfasi commerciale. Questo sito NON usa il linguaggio da brochure.
6. Non aggiungere note del traduttore, non commentare le scelte, non riassumere.`

  if (tipo === 'dizionario') {
    return `${comune}
7. Ricevi un oggetto JSON {chiave: testo}. Restituisci un oggetto JSON con le STESSE chiavi, nello stesso ordine, e i valori tradotti. Nient'altro.
8. Alcuni valori sono etichette di pulsanti o voci di menu: traducili corti come li scriverebbe un'interfaccia, non come una frase.`
  }
  return `${comune}
7. Conserva ESATTAMENTE la struttura markdown: stesso numero di titoli e stesso livello, stessi elenchi, stesse tabelle.
8. È un documento GIURIDICO: la precisione batte la scorrevolezza. I riferimenti normativi italiani (D.Lgs., L., artt.) restano nella forma italiana, con il nome dell'atto tradotto solo se esiste una resa ufficiale.`
}

async function chiedi(testo, lingua, tipo, tentativo = 1) {
  const r = await fetch(`${BASE}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${CHIAVE}` },
    body: JSON.stringify({
      model: MODELLO,
      temperature: 0.1,
      ...(tipo === 'dizionario' ? { response_format: { type: 'json_object' } } : {}),
      messages: [
        { role: 'system', content: istruzioni(LINGUE[lingua], tipo) },
        { role: 'user', content: testo },
      ],
    }),
  })
  if (!r.ok) {
    if (tentativo < 4 && (r.status === 429 || r.status >= 500)) {
      await new Promise((ok) => setTimeout(ok, 3000 * tentativo))
      return chiedi(testo, lingua, tipo, tentativo + 1)
    }
    throw new Error(`${lingua}: HTTP ${r.status} ${await r.text()}`)
  }
  return (await r.json()).choices[0].message.content.trim()
}

const segnaposto = (s) => [...s.matchAll(/\{\{(\w+)\}\}/g)].map((m) => m[1]).sort().join(',')

/** ⛔ Una voce che non passa non viene scritta: vedi il capoverso in testa. */
function accetta(chiave, originale, tradotto, respinte) {
  if (typeof tradotto !== 'string' || !tradotto.trim()) {
    respinte.push(`${chiave}: vuota`)
    return false
  }
  if (segnaposto(originale) !== segnaposto(tradotto)) {
    respinte.push(`${chiave}: segnaposto diversi ({{${segnaposto(originale)}}} → {{${segnaposto(tradotto)}}})`)
    return false
  }
  return true
}

async function dizionario(lingua, riprendi) {
  const it = JSON.parse(await readFile(join(DIZIONARI, 'it.json'), 'utf-8'))
  const file = join(DIZIONARI, `${lingua}.json`)
  let gia = {}
  try {
    gia = JSON.parse(await readFile(file, 'utf-8'))
  } catch {
    /* prima volta */
  }

  const daFare = Object.keys(it).filter((k) => !riprendi || gia[k] === undefined)
  if (daFare.length === 0) {
    console.log(`   ${lingua}: niente da fare (${Object.keys(gia).length} chiavi)`)
    return
  }

  // A blocchi: un JSON di 500 voci in un colpo solo viene troncato.
  const BLOCCO = 40
  const respinte = []
  let fatte = 0
  for (let i = 0; i < daFare.length; i += BLOCCO) {
    const fetta = daFare.slice(i, i + BLOCCO)
    const invio = Object.fromEntries(fetta.map((k) => [k, it[k]]))
    let risposta
    try {
      risposta = JSON.parse(await chiedi(JSON.stringify(invio, null, 1), lingua, 'dizionario'))
    } catch (e) {
      respinte.push(`blocco ${i}-${i + fetta.length}: ${e.message}`)
      continue
    }
    for (const k of fetta) {
      if (accetta(k, it[k], risposta[k], respinte)) {
        gia[k] = risposta[k]
        fatte += 1
      }
    }
    process.stdout.write(`\r   ${lingua}: ${fatte}/${daFare.length}`)
  }

  const ordinato = Object.fromEntries(Object.keys(gia).sort().map((k) => [k, gia[k]]))
  await writeFile(file, JSON.stringify(ordinato, null, 2) + '\n')
  console.log(`\r   ✅ ${lingua}: ${fatte}/${daFare.length} tradotte, ${Object.keys(gia).length} totali`)
  if (respinte.length) {
    console.log(`   ⚠️ ${respinte.length} respinte (NON scritte):`)
    for (const r of respinte.slice(0, 8)) console.log(`      ${r}`)
  }
}

async function legali(lingua, riprendi) {
  const dentro = await readdir(LEGALI)
  const fuori = join(LEGALI, lingua)
  await mkdir(fuori, { recursive: true })
  for (const nome of dentro.filter((n) => n.endsWith('.md'))) {
    const destinazione = join(fuori, nome)
    if (riprendi) {
      try {
        await readFile(destinazione, 'utf-8')
        continue
      } catch {
        /* da fare */
      }
    }
    const originale = await readFile(join(LEGALI, nome), 'utf-8')
    const tradotto = await chiedi(originale, lingua, 'markdown')
    const titoliOriginali = (originale.match(/^#{1,6} /gm) ?? []).length
    const titoliTradotti = (tradotto.match(/^#{1,6} /gm) ?? []).length
    if (titoliOriginali !== titoliTradotti) {
      console.log(`   ⛔ ${lingua}/${nome}: ${titoliTradotti} titoli contro ${titoliOriginali}, NON scritto`)
      continue
    }
    // ⚠️ La clausola va in TESTA: chi legge deve saperlo prima del testo, non dopo.
    await writeFile(destinazione, `${PREVALE_ITALIANO[lingua]}\n\n${tradotto}\n`)
    console.log(`   ✅ ${lingua}/${nome}`)
  }
}

if (!CHIAVE) {
  console.error('⛔ Manca LLM_API_KEY. È la stessa chiave Mistral del prodotto.')
  process.exit(1)
}

const soloLingua = arg('lingua')
const riprendi = flag('riprendi')
for (const lingua of Object.keys(LINGUE)) {
  if (soloLingua && lingua !== soloLingua) continue
  console.log(`\n── ${LINGUE[lingua]} ${'─'.repeat(50)}`)
  await dizionario(lingua, riprendi)
  if (flag('legali')) await legali(lingua, riprendi)
}
