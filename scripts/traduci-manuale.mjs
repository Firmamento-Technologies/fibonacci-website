/**
 * Traduce il manuale (`src/content/docs/*.md`) nelle lingue dell'applicazione.
 *
 * ── PERCHE' UNO SCRIPT E NON UNA TRADUZIONE SCRITTA UNA VOLTA ───────────────
 * Il manuale sono **23 capitoli, 131.668 caratteri, 20.102 parole**. Tradotto a
 * mano una volta sarebbe corretto il giorno stesso e sbagliato al primo
 * capitolo che cambia: resterebbe una versione italiana aggiornata e quattro
 * versioni ferme, ⛔ senza che niente lo segnali. Qui la traduzione è un
 * passaggio **ripetibile**, e `manuale-lingue.mjs` (collaudo) fallisce quando
 * una traduzione è più vecchia del suo originale.
 *
 * ── CHE COSA NON TRADUCE, DI PROPOSITO ──────────────────────────────────────
 *  · i **segnaposto** `{EMAIL_SUPPORTO}` e `{ULTIMA_REVISIONE}`: li risolve la
 *    build (`lib/segnaposto.ts`), e tradurne le graffe li spegnerebbe;
 *  · i **blocchi di codice** e i nomi propri: `AIFA`, `PEC`, `Ordine dei
 *    Medici`, `AGENAS`, `Medplum`, `FHIR`, `Fibonacci`. ⚠️ Sono obblighi e
 *    istituzioni **italiani**: tradurne il nome ne farebbe perdere le tracce a
 *    chi poi deve cercarli. La prosa intorno è tradotta, il nome resta.
 *
 * ── I CONTROLLI, che sono la parte che conta ────────────────────────────────
 * Una traduzione che perde un titolo o un segnaposto rompe l'indice del
 * manuale **senza errori**: la pagina si apre e l'indice laterale è più corto.
 * Quindi ogni capitolo tradotto viene confrontato con l'originale su:
 * numero di titoli per livello, segnaposto presenti, numero di blocchi di
 * codice. ⛔ Se non torna, il file **non viene scritto** e lo script lo dice.
 *
 * USO:
 *   node scripts/traduci-manuale.mjs                 # tutte le lingue
 *   node scripts/traduci-manuale.mjs --lingua=de     # una sola
 *   node scripts/traduci-manuale.mjs --solo=dashboard,trattamenti
 *   node scripts/traduci-manuale.mjs --riprendi      # salta i già tradotti
 *
 * La chiave sta in `LLM_API_KEY` (la stessa del prodotto, Mistral).
 */
import { readFile, writeFile, mkdir, readdir, stat } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const RADICE = join(dirname(fileURLToPath(import.meta.url)), '..')
const SORGENTE = join(RADICE, 'src', 'content', 'docs')

const LINGUE = {
  en: 'inglese',
  es: 'spagnolo',
  fr: 'francese',
  de: 'tedesco',
}

const BASE = process.env.LLM_BASE_URL ?? 'https://api.mistral.ai/v1'
const MODELLO = process.env.LLM_MODEL ?? 'mistral-large-latest'
const CHIAVE = process.env.LLM_API_KEY

/** I nomi che restano come sono, in ogni lingua. */
const INVARIANTI = [
  'Fibonacci', 'Medplum', 'FHIR', 'AIFA', 'AGENAS', 'PEC', 'GDPR', 'eIDAS',
  'Ordine dei Medici', 'Garante', 'FSE', 'PubMed', 'DICOM', 'PGAIS', 'PROM',
]

/**
 * Il glossario delle etichette dell'interfaccia, preso dai dizionari veri
 * dell'app (`EMR/apps/web/src/i18n/*.json`).
 *
 * ⚠️ Senza, il modello traduce i nomi dei pulsanti a modo suo: alla prima prova
 * `Tour AI guidato` è diventato «AI-Guided Tour» mentre l'interfaccia inglese
 * dice «AI guided tour». Un manuale che nomina un pulsante che a schermo si
 * chiama in un altro modo **manda il lettore a cercare**, ed è il difetto
 * tipico dei manuali tradotti a parte dal prodotto.
 * ⛔ Se i dizionari non si trovano si prosegue **senza** glossario: il manuale
 *    tradotto vale comunque più di nessun manuale, e lo script lo dice.
 */
async function glossario(lingua) {
  // ⚠️ Il submodule `EMR/` dell'albero principale può stare su un altro ramo e
  //    non avere ancora tutte le lingue: `DIZIONARI_EMR` permette di puntare al
  //    worktree giusto. Senza, il glossario semplicemente non si trova e lo
  //    script lo DICE invece di far finta di averlo usato.
  const dove = process.env.DIZIONARI_EMR ?? join(RADICE, '..', 'EMR', 'apps', 'web', 'src', 'i18n')
  try {
    const it = JSON.parse(await readFile(join(dove, 'it.json'), 'utf-8'))
    const tr = JSON.parse(await readFile(join(dove, `${lingua}.json`), 'utf-8'))
    const coppie = Object.keys(it)
      .filter((k) => k.startsWith('nav.') || k.startsWith('settings.') || k.startsWith('common.'))
      .filter((k) => tr[k] && it[k] !== tr[k] && it[k].length < 40)
      .map((k) => `«${it[k]}» → «${tr[k]}»`)
    return coppie.length ? [...new Set(coppie)].slice(0, 90) : null
  } catch {
    return null
  }
}

function istruzioni(lingua, voci) {
  const glo = voci
    ? `\n\n9. LE ETICHETTE DELL'INTERFACCIA hanno una traduzione GIA' DECISA nell'applicazione. Usa ESATTAMENTE queste, anche dentro i backtick:\n${voci.join('\n')}`
    : ''
  return `Sei un traduttore tecnico specializzato in software sanitario e medicina estetica.
Traduci in ${lingua} il capitolo di manuale che segue.

REGOLE, in ordine di importanza:
1. Restituisci SOLO il markdown tradotto. Nessun preambolo, nessuna spiegazione, nessun blocco di codice attorno al risultato.
2. Conserva ESATTAMENTE la struttura markdown: stesso numero di titoli e stesso livello (#, ##, ###), stessi elenchi, stesse tabelle, stessi blocchi di codice.
3. NON tradurre e NON alterare i segnaposto fra graffe come {EMAIL_SUPPORTO} e {ULTIMA_REVISIONE}: vanno riprodotti identici.
4. NON tradurre il contenuto dei blocchi di codice recintati (tre backtick): sono comandi e nomi di campi.
   Cio' che sta fra backtick singoli e' un'etichetta dell'interfaccia: va tradotta con la traduzione UFFICIALE del punto 9 se c'e', altrimenti lasciata com'e'.
5. Lascia INVARIATI questi nomi propri, istituzioni e sigle: ${INVARIANTI.join(', ')}.
   Sono enti e obblighi ITALIANI: il lettore straniero deve poterli cercare con quel nome. Traduci la prosa intorno, non il nome.
6. Usa la terminologia clinica corretta della lingua di destinazione (anamnesi, consenso informato, cartella clinica, seduta, filler, tossina botulinica).
7. Dai del tu al lettore, come fa l'originale, e mantieni lo stesso registro: pratico, diretto, senza enfasi commerciale.
8. Non aggiungere note del traduttore, non commentare le scelte, non riassumere.${glo}`
}

async function traduci(testo, lingua, voci, tentativo = 1) {
  const r = await fetch(`${BASE}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${CHIAVE}` },
    body: JSON.stringify({
      model: MODELLO,
      temperature: 0.1,
      messages: [
        { role: 'system', content: istruzioni(lingua, voci) },
        { role: 'user', content: testo },
      ],
    }),
  })
  if (!r.ok) {
    const corpo = await r.text()
    // 429 e 5xx: si riprova, con attesa crescente. ⛔ Il resto no: un 401 non
    // migliora riprovando, e insistere brucia solo tempo.
    if ((r.status === 429 || r.status >= 500) && tentativo <= 5) {
      const attesa = 2000 * tentativo
      console.log(`      ⏳ ${r.status}, riprovo fra ${attesa / 1000}s (${tentativo}/5)`)
      await new Promise((s) => setTimeout(s, attesa))
      return traduci(testo, lingua, voci, tentativo + 1)
    }
    throw new Error(`HTTP ${r.status}: ${corpo.slice(0, 200)}`)
  }
  const d = await r.json()
  let out = d.choices?.[0]?.message?.content ?? ''
  // Certi modelli incartano tutto in un blocco ```markdown nonostante la regola 1.
  out = out.replace(/^\s*```(?:markdown|md)?\s*\n/, '').replace(/\n```\s*$/, '')
  return out.trim() + '\n'
}

/** La firma strutturale di un markdown: se cambia, la traduzione ha perso pezzi. */
function firma(md) {
  const titoli = {}
  for (const m of md.matchAll(/^(#{1,6})\s+/gm)) {
    titoli[m[1].length] = (titoli[m[1].length] ?? 0) + 1
  }
  return {
    titoli,
    segnaposto: [...md.matchAll(/\{[A-Z_]+\}/g)].map((m) => m[0]).sort(),
    blocchi: (md.match(/^```/gm) ?? []).length,
  }
}

function confronta(a, b) {
  const problemi = []
  for (const liv of new Set([...Object.keys(a.titoli), ...Object.keys(b.titoli)])) {
    if ((a.titoli[liv] ?? 0) !== (b.titoli[liv] ?? 0)) {
      problemi.push(`titoli di livello ${liv}: ${a.titoli[liv] ?? 0} → ${b.titoli[liv] ?? 0}`)
    }
  }
  if (a.segnaposto.join('|') !== b.segnaposto.join('|')) {
    problemi.push(`segnaposto: [${a.segnaposto}] → [${b.segnaposto}]`)
  }
  if (a.blocchi !== b.blocchi) problemi.push(`blocchi di codice: ${a.blocchi} → ${b.blocchi}`)
  return problemi
}


/**
 * L'INDICE DEI CAPITOLI, che non sta nel markdown.
 *
 * ⚠️ `title`, `description` e l'ordine vivono in `src/lib/docs-data.ts`, cioè in
 * TypeScript. Tradurre i soli `.md` avrebbe dato un manuale con i **capitoli in
 * tedesco e l'indice laterale in italiano**: metà lavoro, e la metà che si vede
 * per prima. Qui si producono `src/content/docs/<lingua>/_indice.json`, che la
 * rotta del corpus usa al posto dei campi italiani.
 */
async function traduciIndice(lingua, voci) {
  const sorgente = await readFile(join(RADICE, 'src', 'lib', 'docs-data.ts'), 'utf-8')
  const capitoli = []
  const re = /slug:\s*'([^']+)',\s*\n\s*title:\s*'((?:[^'\\]|\\.)*)',\s*\n\s*description:\s*'((?:[^'\\]|\\.)*)'/g
  for (const m of sorgente.matchAll(re)) {
    capitoli.push({ slug: m[1], title: m[2].replace(/\\'/g, "'"), description: m[3].replace(/\\'/g, "'") })
  }
  if (!capitoli.length) throw new Error('indice: nessun capitolo estratto da docs-data.ts')

  const richiesta = capitoli.map((c) => `${c.slug}\nTITOLO: ${c.title}\nDESCRIZIONE: ${c.description}`).join('\n\n')
  const fuori = await traduci(
    `Traduci titolo e descrizione di ogni capitolo. Riproduci ESATTAMENTE lo stesso formato, con lo stesso slug invariato:\n\n${richiesta}`,
    LINGUE[lingua],
    voci,
  )

  const tradotti = {}
  for (const blocco of fuori.split(/\n\s*\n/)) {
    const righe = blocco.trim().split('\n')
    const slug = righe[0]?.trim()
    const t = righe.find((r) => /^TITOLO:/i.test(r))?.replace(/^TITOLO:\s*/i, '').trim()
    const d = righe.find((r) => /^DESCRIZIONE:/i.test(r))?.replace(/^DESCRIZIONE:\s*/i, '').trim()
    if (slug && t && d) tradotti[slug] = { title: t, description: d }
  }

  // ⛔ Parziale = non scritto. Un indice con metà voci tradotte è peggio di uno
  //    tutto italiano: sembra fatto.
  const mancanti = capitoli.filter((c) => !tradotti[c.slug]).map((c) => c.slug)
  if (mancanti.length) throw new Error(`indice incompleto, mancano: ${mancanti.join(', ')}`)
  await writeFile(
    join(SORGENTE, lingua, '_indice.json'),
    JSON.stringify(tradotti, null, 2) + '\n',
  )
  return Object.keys(tradotti).length
}

async function esiste(p) {
  try {
    await stat(p)
    return true
  } catch {
    return false
  }
}

async function main() {
  if (!CHIAVE) {
    console.error('⛔ LLM_API_KEY non impostata. È la stessa chiave del prodotto (Mistral).')
    process.exit(1)
  }
  const arg = (n) => process.argv.find((a) => a.startsWith(`--${n}=`))?.split('=')[1]
  const riprendi = process.argv.includes('--riprendi')
  const lingue = arg('lingua') ? [arg('lingua')] : Object.keys(LINGUE)
  const solo = arg('solo')?.split(',')

  const tutti = (await readdir(SORGENTE)).filter((f) => f.endsWith('.md')).map((f) => f.slice(0, -3))
  const slug = solo ? tutti.filter((s) => solo.includes(s)) : tutti

  console.log(`Manuale: ${slug.length} capitoli × ${lingue.length} lingue (modello ${MODELLO})\n`)
  let fatti = 0
  let saltati = 0
  const falliti = []

  for (const l of lingue) {
    const cartella = join(SORGENTE, l)
    await mkdir(cartella, { recursive: true })
    const voci = await glossario(l)
    console.log(`── ${l.toUpperCase()} (${LINGUE[l]}) — glossario: ${voci ? voci.length + ' etichette' : '⚠️ NON trovato, proseguo senza'}`)
    if (!solo) {
      const dove = join(cartella, '_indice.json')
      if (riprendi && (await esiste(dove))) {
        console.log('   _indice.json … già presente')
      } else {
        process.stdout.write('   _indice.json … ')
        try {
          console.log(`✅ ${await traduciIndice(l, voci)} capitoli`)
        } catch (e) {
          console.log(`⛔ ${e.message}`)
          falliti.push(`${l}/_indice: ${e.message}`)
        }
      }
    }
    for (const s of slug) {
      const destinazione = join(cartella, `${s}.md`)
      if (riprendi && (await esiste(destinazione))) {
        saltati++
        continue
      }
      const originale = await readFile(join(SORGENTE, `${s}.md`), 'utf-8')
      process.stdout.write(`   ${s} … `)
      try {
        const tradotto = await traduci(originale, LINGUE[l], voci)
        const problemi = confronta(firma(originale), firma(tradotto))
        if (problemi.length) {
          // ⛔ Non si scrive un capitolo che ha perso la struttura: l'indice
          //    laterale del manuale si accorcia e nessuno se ne accorge.
          console.log(`⛔ struttura diversa → NON scritto\n      ${problemi.join('\n      ')}`)
          falliti.push(`${l}/${s}: ${problemi.join('; ')}`)
          continue
        }
        await writeFile(destinazione, tradotto)
        console.log(`✅ ${tradotto.length} caratteri`)
        fatti++
      } catch (e) {
        console.log(`⛔ ${e.message}`)
        falliti.push(`${l}/${s}: ${e.message}`)
      }
    }
  }

  console.log(`\ntradotti: ${fatti} · saltati (già presenti): ${saltati} · falliti: ${falliti.length}`)
  for (const f of falliti) console.log(`  ⛔ ${f}`)
  if (falliti.length) process.exitCode = 1
}

await main()
