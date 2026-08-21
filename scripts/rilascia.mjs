#!/usr/bin/env node
/**
 * L'UNICO modo in cui il sito va online.
 *
 *   node scripts/rilascia.mjs            # rilascia da origin/main
 *   node scripts/rilascia.mjs --prova    # fa tutto tranne l'rsync vero
 *   node scripts/rilascia.mjs --ref HEAD # rilascia da un altro riferimento
 *   node scripts/rilascia.mjs --copia-vecchia  # eccezione dichiarata al passo 1
 *
 * ── PERCHÉ ESISTE (2026-08-16) ──────────────────────────────────────────────
 * Fino a oggi il rilascio era una sequenza **eseguita a mano**: costruisci,
 * controlla sei cose a memoria, copia di sicurezza, `rsync`. L'ho fatta tre
 * volte in un giorno e ogni volta ho ridigitato i controlli ricordandomeli.
 * ⚠️ Il difetto non è la fatica: è che **il giorno in cui uno se ne dimentica
 * non succede niente di visibile**. Il sito parte lo stesso, e pubblica quello
 * che il controllo dimenticato avrebbe fermato — per esempio le schede dei
 * medici, che ⛔ non devono andare online (vincolo dell'utente, 2026-08-16).
 *
 * 🔑 **E qui dentro sta il controllo delle schermate**, spostato dal `pre-push`:
 * una schermata vecchia fa danno **solo quando è pubblicata**, e il push non
 * pubblica niente. Il ragionamento per esteso è in `schermate-fresche.mjs`.
 *
 * ── PERCHÉ COSTRUISCE DA UN WORKTREE ────────────────────────────────────────
 * 🔴 L'albero di lavoro è **condiviso con altre sessioni**: il 2026-08-16 aveva
 * **2.225 file modificati** da altri, e fra questi `src/dati/cliniche/*.json`,
 * che finisce nel corpus del sito. Costruire da lì vuol dire **pubblicare il
 * lavoro in corso di qualcun altro**, a sua insaputa. Si costruisce da un
 * `git worktree` su un riferimento dichiarato, dove quelle modifiche non
 * esistono. `node_modules` si copia con `cp -Rc`: su APFS è copy-on-write,
 * quindi istantaneo. ⛔ Non un symlink: Turbopack lo rifiuta.
 */

import { execFileSync, execSync } from 'node:child_process'
import { existsSync, readFileSync, readdirSync, rmSync, mkdtempSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { tmpdir } from 'node:os'
import { schermateFresche } from './schermate-fresche.mjs'

const QUI = dirname(fileURLToPath(import.meta.url))
const SITO = join(QUI, '..')

const DOMINIO = 'fibonaccimedica.it'
/** ⛔ `ssh fibonacci`, NON `root@188.213.175.26`: l'indirizzo nudo scavalca
 *  `~/.ssh/config`, ricade sulla password e dopo tre tentativi fa bandire l'IP
 *  da fail2ban. */
const MACCHINA = 'fibonacci'
const RADICE_WEB = '/var/www/fibonaccimedica'

const argomenti = process.argv.slice(2)
const PROVA = argomenti.includes('--prova')
/**
 * ⚠️ **L'uscita dichiarata dal cancello delle schermate.** Esiste per un caso
 * solo, ed è questo: il rilascio **non tocca le schermate**, che sono già
 * pubblicate identiche, e rigenerarle in quel momento farebbe più danno che
 * bene — per esempio perché l'albero EMR ha il lavoro in corso di un'altra
 * sessione e finirebbe dentro immagini pubblicate.
 *
 * 🔑 Perché un interruttore e ⛔ non la cancellazione del controllo: un cancello
 * tolto non si rimette, e il prossimo che ha fretta trova la strada già aperta.
 * Così invece l'eccezione **si vede**, va scritta sulla riga di comando, e
 * lascia una traccia a video di che cosa è stato saltato.
 *
 * ⛔ **Non è un'abbreviazione per «ho fretta».** Se il rilascio CAMBIA una
 * schermata, o se il divario contiene commit che toccano davvero le schermate
 * pubblicate, si rigenera: `node scripts/schermate.mjs` con lo stack acceso.
 *
 * Usato il 2026-08-17 su decisione esplicita dell'utente: divario di **un solo
 * commit** (`a05fbd93`, la barra dell'assistente sul telefono), rilascio di
 * **soli testi** più una pagina nuova, e albero EMR con 10 file non committati
 * di un'altra sessione.
 */
const SCHERMATE_VECCHIE = argomenti.includes('--schermate-vecchie')
/**
 * ⚠️ **L'uscita dichiarata dal cancello del passo 1.** Serve quando si sa
 * davvero perché si sta eseguendo una copia vecchia di questo file: per esempio
 * per riprodurre un rilascio andato storto, o per bisezionare un difetto.
 *
 * 🔑 Come `--schermate-vecchie`, e per la stessa ragione: un cancello **tolto**
 * non si rimette, e il prossimo che ha fretta trova la strada già aperta. Così
 * invece l'eccezione va scritta sulla riga di comando, si vede a video, e resta
 * una traccia di che cosa NON è stato controllato.
 *
 * ⛔ **Non è un'abbreviazione per «il cancello mi dà fastidio».** Se è rosso, la
 * risposta giusta è quasi sempre di tre righe: worktree su `origin/main`,
 * `node_modules` copiato, rilancia da lì. Le stampa il messaggio stesso.
 */
const COPIA_VECCHIA = argomenti.includes('--copia-vecchia')
const RIF = argomenti.includes('--ref') ? argomenti[argomenti.indexOf('--ref') + 1] : 'origin/main'

const rosso = (t) => `\x1b[31m${t}\x1b[0m`
const verde = (t) => `\x1b[32m${t}\x1b[0m`
const giallo = (t) => `\x1b[33m${t}\x1b[0m`

let passo = 0
const titolo = (t) => console.log(`\n${++passo}. ${t}`)
const ok = (t) => console.log(`   ${verde('✓')} ${t}`)

function muori(motivo, comeSiRipara) {
  console.error(`\n${rosso('⛔ RILASCIO FERMATO')}\n   ${motivo}`)
  if (comeSiRipara) console.error(`\n   ${comeSiRipara}`)
  process.exit(1)
}

const git = (args, dir = SITO) =>
  execFileSync('git', ['-C', dir, ...args], { encoding: 'utf8' }).trim()

// ── 1. La copia che stai eseguendo ──────────────────────────────────────────
/* 🔴 **Esiste perché il 2026-08-20 ho cancellato 10 pagine dal sito vivo
 * obbedendo a una versione vecchia di questo file** (TD-286).
 *
 * Il punto che lo rende possibile: `rilascia.mjs` **costruisce** da un worktree
 * su `origin/main`, ma **si esegue** dalla cartella da cui è stato lanciato. Le
 * due cose possono divergere, e quella sera divergevano di **43 commit**. Da lì
 * due difetti insieme, tutti e due silenziosi:
 *   1. la copia vecchia non fissava `NEXT_PUBLIC_PRENOTA_API_URL` e le altre due
 *      del canale pazienti (aggiunte il 2026-08-19) ⇒ la costruzione non chiedeva
 *      l'elenco al sidecar, e faceva **210 pagine invece di 220**;
 *   2. il controllo delle schede riconosceva gli esempi dal **nome della
 *      cartella** invece che dal marchio `data-scheda="esempio"`, regola cambiata
 *      il 2026-08-19 su decisione dell'utente.
 * ⇒ la prova a vuoto diceva «l'rsync cancellerebbe 110 cose FUORI da `_next/`»,
 *   che si legge come *«sul sito c'è roba di troppo»* e invece era *«la tua
 *   costruzione è incompleta»*. Ho corretto il sito invece della misura.
 *
 * 🔑 La lezione, più larga di questo file: **un cancello è codice, e il codice
 * invecchia**. La sua diagnosi è credibile proprio quando è falsa, perché
 * descrive con precisione un mondo che non c'è più. ⇒ un rosso che accusa
 * **l'esistente** va sospettato di accusare **la tua misura**.
 *
 * ⚠️ Si misura **dopo un `fetch`**, ⛔ non sul `refs/remotes/origin/main` che sta
 * sul disco: quello si muove solo quando qualcuno lo muove, e un confronto
 * contro un riferimento fermo direbbe «allineato» a chiunque. Verificato il
 * 2026-08-20 che qui il fetch aggiorna davvero il ref (in `EMR` **non** lo fa:
 * per questo la riga è misurata e non data per buona).
 *
 * ⛔ Se il fetch non riesce non si tira a indovinare: senza misura non c'è verde.
 * È la stessa regola del `pre-push` (*«una misura che non c'è ⛔ non è zero
 * problemi»*). E ha un tetto di tempo con il prompt delle credenziali spento,
 * perché un rilascio **appeso** è peggio di un rilascio fermato.
 */
titolo('La copia di questo script è aggiornata?')
{
  try {
    execFileSync('git', ['-C', SITO, 'fetch', 'origin', 'main', '--quiet'], {
      encoding: 'utf8',
      timeout: 60_000,
      env: { ...process.env, GIT_TERMINAL_PROMPT: '0' },
    })
  } catch (e) {
    muori(
      `non riesco a chiedere a origin qual è l'ultimo main: ${String(e.message).split('\n')[0]}`,
      'Senza quella risposta non so se questo script è vecchio, e una misura che non c’è\n' +
        '   ⛔ non è un verde. Riprova quando la rete c’è, oppure dichiara l’eccezione\n' +
        '   con --copia-vecchia.',
    )
  }

  const dietro = Number(git(['rev-list', '--count', 'HEAD..origin/main']))
  const qui = git(['rev-parse', '--short', 'HEAD'])
  const la = git(['rev-parse', '--short', 'origin/main'])

  if (dietro > 0 && COPIA_VECCHIA) {
    console.log(giallo(`   ⚠️  CANCELLO SALTATO con --copia-vecchia: questa copia è ${dietro} commit indietro.`))
    console.log(giallo(`      ${qui} contro ${la}. I controlli dei passi che seguono sono quelli di ALLORA.`))
    console.log(giallo('      ⛔ Se uno di essi diventa rosso, sospetta PRIMA questa copia.'))
  } else if (dietro > 0) {
    muori(
      `questa copia di rilascia.mjs è ${dietro} commit indietro rispetto a origin/main ` +
        `(${qui} contro ${la}).\n` +
        '   Costruirebbe il codice nuovo con i controlli vecchi, e i due possono non essere\n' +
        '   d’accordo: è già successo, ed è costato 10 pagine cancellate dal sito vivo.',
      'Rilascia dalla copia giusta (è la sequenza che ha funzionato il 2026-08-20):\n' +
        '     git worktree add --detach /tmp/rilascio origin/main\n' +
        `     cp -Rc ${JSON.stringify(join(SITO, 'node_modules'))} /tmp/rilascio/node_modules\n` +
        `     cd /tmp/rilascio && node scripts/rilascia.mjs ${argomenti.join(' ')}`.trimEnd() +
        '\n' +
        '     git worktree remove --force /tmp/rilascio   # alla fine\n\n' +
        '   ⛔ Se sai davvero perché ti serve la copia vecchia: --copia-vecchia,\n' +
        '   che lo dichiara a video invece di nasconderlo.',
    )
  } else {
    /* ⚠️ «avanti» ⛔ non è un problema: chi sviluppa questo script ha commit
     * locali sopra `origin/main` e contiene comunque tutto ciò che c'è là.
     * Ma ⛔ non si scrive «allineata», che gli farebbe credere che i suoi commit
     * siano già sul remoto. */
    const avanti = Number(git(['rev-list', '--count', 'origin/main..HEAD']))
    ok(
      avanti === 0
        ? `allineata a origin/main (${la})`
        : `contiene tutto origin/main (${la}), più ${avanti} commit locali ⛔ non spinti`,
    )
  }
}

// ── 2. Le schermate ─────────────────────────────────────────────────────────
// Prima di tutto, perché è il controllo che costa di più riparare: se sono
// vecchie serve accendere l'EMR e ricatturare, e non ha senso scoprirlo dopo
// aver costruito il sito.
titolo('Le schermate vengono dal codice che gira adesso?')
{
  // ⚠️ Col riferimento: si guarda il manifesto di CIO' CHE SI RILASCIA.
  const f = schermateFresche(SITO, RIF)
  if (f.stato === 'vecchie' && SCHERMATE_VECCHIE) {
    console.log(giallo('   ⚠️  CANCELLO SALTATO con --schermate-vecchie. Che cosa non è stato guardato:'))
    console.log(giallo(`      ${f.motivo.split('\n')[0]}`))
    console.log(giallo('      ⇒ le schermate pubblicate restano quelle di prima, invariate.'))
    console.log(giallo('      ⛔ Se questo rilascio doveva CAMBIARLE, fermalo adesso.'))
  } else if (f.stato === 'vecchie') muori(f.motivo)
  if (f.stato === 'non-verificabile') console.log(giallo(`   ⚠️  ${f.motivo}`))
  else ok('fresche')
}

// ── 3. Il worktree ──────────────────────────────────────────────────────────
titolo(`Costruisco da un worktree su ${RIF}`)
const sha = git(['rev-parse', RIF])
const W = mkdtempSync(join(tmpdir(), 'rilascio-fibonacci-'))
rmSync(W, { recursive: true, force: true })

let uscita = 1
try {
  git(['worktree', 'add', '--detach', W, sha])
  ok(`${sha.slice(0, 8)} → ${W}`)

  execSync(`cp -Rc ${JSON.stringify(join(SITO, 'node_modules'))} ${JSON.stringify(join(W, 'node_modules'))}`)
  ok('node_modules copiato (copy-on-write)')

  titolo('Costruisco per il dominio di produzione, in tutte e cinque le lingue')
  /* 🔴 `costruisci-lingue.mjs` e NON `npm run build`, e la differenza e' 1596 file.
   * Il sito e' `output: 'export'`: la lingua si decide **in costruzione**
   * (`NEXT_PUBLIC_LINGUA`), quindi un `next build` solo produce **solo
   * l'italiano**. Le altre quattro vivono in `out/<lingua>/` e si ottengono
   * costruendo cinque volte, che e' cio' che fa `costruisci-lingue.mjs`.
   *
   * ⚠️ Questo passo e' rimasto indietro quando e' arrivato il multilingua, e la
   * conseguenza non era un errore: era che l'`rsync` avrebbe **cancellato dalla
   * macchina gli alberi `en/`, `es/`, `fr/`, `de/`** gia' pubblicati. L'ha fermato
   * il passo 6 («sta sparendo una pagina, non un frammento di build»), ⛔ non
   * questo, che era **verde**. Misurato il 2026-08-17: costruito 41 pagine,
   * macchina 1596 file in piu'.
   * 🔑 Perche' quel controllo conta piu' di quanto sembri: un rilascio che
   * *cancella* non assomiglia a un rilascio rotto, assomiglia a uno andato bene.
   *
   * `costruisci-lingue.mjs` verifica ogni lingua (numero di pagine allineato
   * all'italiano, `<html lang>` giusto, una frase campione diversa dall'italiano)
   * ed esce 1 se non torna: qui non va ricontrollato, va non aggirato. */
  execSync('node scripts/costruisci-lingue.mjs', {
    cwd: W,
    stdio: ['ignore', 'ignore', 'inherit'],
    env: {
      ...process.env,
      NEXT_PUBLIC_DOMINIO_SITO: DOMINIO,
      /* 🔴 **Se manca, il modulo di contatto non esiste, e non lo dice nessuno.**
       * `ModuloContatto` si spegne da solo con l'indirizzo vuoto — ed è giusto
       * così, perché un modulo che spedisce nel vuoto è peggio di un modulo
       * assente (TD-108, costata un contatto vero). Ma vuol dire che
       * dimenticarla qui produce un rilascio **verde** con una funzione
       * **sparita**: nessun errore, nessuna pagina rotta, solo una sezione che
       * non c'è. È «costruito ma non cablato» applicato a una variabile.
       * ⚠️ È un host diverso dal sito: la chiamata è cross-origin e vive solo
       * se `https://fibonaccimedica.it` sta in `ALLOWED_ORIGINS` del sidecar
       * (verificato col preflight il 2026-08-16). */
      NEXT_PUBLIC_CONTATTO_API_URL:
        process.env.NEXT_PUBLIC_CONTATTO_API_URL ?? 'https://app.fibonaccimedica.it',
      /* 🔴 **Le tre del canale pazienti, e senza di esse il rilascio CANCELLA
       * pagine.** Misurato il 2026-08-19: lanciando `rilascia.mjs` senza
       * ambiente, la prova a vuoto dell'rsync ha dichiarato **22 cose in
       * cancellazione fuori da `_next/`**, fra cui l'intera cartella
       * `pazienti/medico/studio-di-collaudo-beta-013634/`. Il motivo: queste
       * variabili non erano fissate qui, si passavano **a mano** sulla riga di
       * comando, e chi rilascia senza saperlo costruisce un sito **senza il
       * canale**: `PRENOTA_API_URL` vuota ⇒ l'elenco non viene chiesto al
       * sidecar (⇒ zero studi veri), `PAZIENTI_ESEMPI` spenta ⇒ spariscono
       * anche i due dimostrativi.
       * ⚠️ I valori di destinazione **non sono difetti dei moduli**: quelli
       * restano spenti di default apposta (un modulo che spedisce nel vuoto è
       * peggio di un modulo assente). È il RILASCIO che deve dire dove sta
       * andando, ed è esattamente ciò che fa la riga qui sopra per il contatto.
       * ⇒ Fissate qui, sovrascrivibili dall'ambiente come le altre. */
      NEXT_PUBLIC_PRENOTA_API_URL:
        process.env.NEXT_PUBLIC_PRENOTA_API_URL ?? 'https://app.fibonaccimedica.it/pdf',
      NEXT_PUBLIC_PREANAMNESI: process.env.NEXT_PUBLIC_PREANAMNESI ?? 'true',
      NEXT_PUBLIC_PAZIENTI_ESEMPI: process.env.NEXT_PUBLIC_PAZIENTI_ESEMPI ?? 'true',
    },
  })
  {
    const lingue = readdirSync(join(W, 'out'), { withFileTypes: true })
      .filter((d) => d.isDirectory() && /^[a-z]{2}$/.test(d.name))
      .map((d) => d.name)
    /* ⚠️ Si CONTANO gli alberi di lingua, invece di fidarsi dell'uscita zero.
       `costruisci-lingue.mjs` verifica ogni lingua che innesta, ma se un giorno
       ne innestasse zero uscirebbe comunque 0, e qui si spedirebbe un sito
       italiano sopra uno multilingua — cioe' il difetto che questo passo ha
       appena causato una volta. */
    if (lingue.length < 4)
      muori(
        `out/ ha solo ${lingue.length} alberi di lingua (${lingue.join(', ') || 'nessuno'}).`,
        "Sulla macchina ce ne sono quattro oltre all'italiano: spedire ora li cancellerebbe.\n" +
          '   Controlla `node scripts/costruisci-lingue.mjs` da solo.',
      )
    ok(`out/ costruito con NEXT_PUBLIC_DOMINIO_SITO=${DOMINIO} · italiano + ${lingue.join(', ')}`)
  }

  const OUT = join(W, 'out')

  // ── 4. I controlli sul costruito ──────────────────────────────────────────
  titolo('Controlli sul costruito, prima di spedire')

  /* 🔴 **Il presidio che vede tutto girava solo quando nessuno lo guardava** (TD-214).
   * Ce ne sono due sulla traduzione, e il difetto era la loro divisione del lavoro:
   * `lingue-sorgenti.mjs` gira a ogni push ⛔ ma legge i **dizionari**, quindi ⛔ non
   * vede una stringa scritta a mano nel codice; `lingue-tradotte.mjs` legge il
   * **testo delle pagine costruite** e le vedrebbe tutte, ⛔ ma pretende un `out/` a
   * cinque lingue (~20 minuti) ⇒ nel `pre-push` stampava «NON eseguito» e passava.
   * 🔑 *Quello che vede ⛔ non girava, quello che gira ⛔ non vede.*
   *
   * ⇒ Qui gira, ed è il posto giusto: i venti minuti si sono **appena spesi** per
   * pubblicare (passo 4), quindi il costruito a cinque lingue **c'è già** e la
   * misura costa un secondo. ⛔ E qui è anche il momento in cui serve davvero: è
   * l'ultimo istante prima che una pagina in italiano finisca su `/fr/`.
   *
   * ⚠️ Lo script si ferma da sé se `out/` manca o è parziale (misura «zero residui»
   * su niente, che è il modo classico in cui questo controllo diventava verde).
   * ⇒ qui ⛔ non si ricontrolla, si lascia parlare. */
  try {
    execSync('node scripts/lingue-tradotte.mjs', { cwd: W, stdio: ['ignore', 'pipe', 'inherit'] })
    ok('nessuna pagina tradotta è rimasta in italiano')
  } catch {
    muori(
      'nel costruito ci sono pagine ancora in italiano sotto /en/, /de/, /es/ o /fr/.',
      'Le frasi le elenca lo script qui sopra: vanno nei dizionari.\n' +
        '   ⛔ Non si pubblica: una pagina italiana su /fr/ è **peggio** di una non tradotta,\n' +
        '      perché l’italiano si riconosce a colpo d’occhio come «scritto per un altro\n' +
        '      paese», mentre una frase sbagliata tradotta male no.',
    )
  }

  /* 🛑 **Le schede dei medici non vanno online** (vincolo esplicito
   * dell'utente, 2026-08-16): sono 4.647 persone reali raccolte senza
   * chiederglielo, e l'informativa art. 14 non è valida finché la società non
   * ha un nome. Devono esserci **solo gli esempi**, e devono essere `noindex`
   * e fuori dalla sitemap. */
  const schede = existsSync(join(OUT, 'pazienti/medico'))
    ? readdirSync(join(OUT, 'pazienti/medico'))
    : []
  /* 🔑 **Come si riconosce un esempio**, e perché la regola è cambiata il
   * 2026-08-19 (decisione dell'utente, chiesta prima di toccare il controllo).
   * Prima bastava il **nome della cartella** (`studio-dimostrativo*`), che
   * copriva i due studi scritti a mano dentro il sito. Poi il canale ha
   * cominciato a servire studi **veri sul VPS di prova** — finti, marcati
   * `esempio: true` dal sidecar, `noindex`, con il riquadro «questo studio non
   * esiste» in cima — e il controllo li ha presi per medici veri: il rilascio
   * si è fermato su `studio-di-collaudo-alfa`/`-beta`.
   * ⇒ Ora vale il **marchio nella pagina** (`data-scheda="esempio"`, scritto da
   * `GuscioPaziente`), che è la stessa cosa che decide `noindex` e i dati
   * strutturati. ⛔ Il nome resta accettato per i due scritti a mano.
   * ⚠️ **Il vincolo non è stato allentato**: le 4.647 schede raccolte NON hanno
   * quel marchio — nessuno lo scrive per loro — quindi restano fuori, ed è
   * proprio ciò che questo controllo difende. */
  const nonEsempi = schede.filter((s) => {
    if (s.startsWith('studio-dimostrativo')) return false
    const html = readFileSync(join(OUT, 'pazienti/medico', s, 'index.html'), 'utf8')
    return !html.includes('data-scheda="esempio"')
  })
  if (nonEsempi.length) {
    muori(
      `nel costruito ci sono ${nonEsempi.length} schede di medici che NON sono esempi: ` +
        nonEsempi.slice(0, 3).join(', '),
      '⛔ Le schede dei medici non vanno online. Vedi il vincolo dell’utente del 2026-08-16.',
    )
  }
  for (const s of schede) {
    const html = readFileSync(join(OUT, 'pazienti/medico', s, 'index.html'), 'utf8')
    if (!html.includes('noindex')) muori(`la scheda «${s}» non è noindex`)
  }
  ok(`${schede.length} schede, tutte esempi e tutte noindex`)

  const sitemap = readFileSync(join(OUT, 'sitemap.xml'), 'utf8')
  if (sitemap.includes('pazienti/medico')) muori('la sitemap annuncia una scheda di medico')
  if (sitemap.includes('/documentazione')) muori('la sitemap annuncia una guida del manuale')
  ok('sitemap: nessuna scheda di medico, nessuna guida')

  /* Il manuale è uscito dal sito il 2026-08-13 su richiesta dell'utente
     («diciamo alla concorrenza tutto quello che abbiamo»). */
  if (existsSync(join(OUT, 'documentazione'))) muori('il manuale è finito nel costruito')
  ok('manuale assente dal costruito')

  /* 🔴 Un URL in sitemap che risponde 404 è peggio di un URL assente: lo
     annunci tu ai motori. Successo davvero il 2026-08-16 con `/elenco-medici`,
     preso solo perché l'ho contato a mano. */
  const urls = [...sitemap.matchAll(new RegExp(`<loc>https://${DOMINIO}([^<]*)</loc>`, 'g'))].map(
    (m) => m[1],
  )
  const senzaPagina = urls.filter(
    (u) => u !== '/' && !existsSync(join(OUT, u.replace(/^\/|\/$/g, ''), 'index.html')),
  )
  if (senzaPagina.length) {
    muori(`la sitemap annuncia ${senzaPagina.length} URL senza pagina costruita: ${senzaPagina[0]}`)
  }
  ok(`${urls.length} URL in sitemap, tutti con una pagina`)

  // ── 5. Copia di sicurezza ─────────────────────────────────────────────────
  titolo('Copia di sicurezza sulla macchina')
  if (PROVA) {
    console.log(giallo('   (--prova: saltata)'))
  } else {
    const nome = `fibonaccimedica-prima-del-rilascio-${sha.slice(0, 8)}.tar.gz`
    execFileSync('ssh', [
      '-o', 'BatchMode=yes', MACCHINA,
      `cd /var/www && tar czf /root/${nome} fibonaccimedica`,
    ])
    ok(`/root/${nome}`)
  }

  // ── 6. La prova a vuoto ───────────────────────────────────────────────────
  /* ⚠️ `--delete` su una radice web è il comando che può svuotare il sito. La
     prova a vuoto non è prudenza generica: si pretende che **ogni cancellazione
     stia dentro `_next/`**, cioè sia un frammento di build vecchio. Una
     cancellazione fuori da lì vuol dire che sta sparendo una pagina. */
  titolo('Prova a vuoto dell’rsync');
  {
    const fuori = execFileSync(
      'rsync',
      ['-az', '--delete', '--dry-run', '--itemize-changes', '-e', 'ssh -o BatchMode=yes',
        `${OUT}/`, `${MACCHINA}:${RADICE_WEB}/`],
      { encoding: 'utf8' },
    )
      .split('\n')
      .filter((r) => r.startsWith('*deleting') && !r.includes('_next/'))
    if (fuori.length) {
      muori(
        `l’rsync cancellerebbe ${fuori.length} cose FUORI da _next/:\n     ` +
          fuori.slice(0, 5).join('\n     '),
        'Sta sparendo una pagina, non un frammento di build. Controlla prima di insistere.',
      )
    }
    ok('nessuna cancellazione fuori da _next/');
  }

  // ── 7. Il rilascio ────────────────────────────────────────────────────────
  titolo('Rilascio');
  if (PROVA) {
    console.log(giallo('   (--prova: non spedisco niente)'))
  } else {
    execFileSync('rsync', [
      '-az', '--delete', '-e', 'ssh -o BatchMode=yes', `${OUT}/`, `${MACCHINA}:${RADICE_WEB}/`,
    ])
    ok('spedito')
  }

  // ── 8. La verifica DA INTERNET ────────────────────────────────────────────
  /* ⛔ Non dal disco e non dalla macchina: dal di fuori, che è da dove lo
     guarda chi compra. Un rilascio che non si verifica da internet è un
     rilascio dichiarato, non misurato. */
  titolo('Verifica da internet');
  if (PROVA) {
    console.log(giallo('   (--prova: saltata)'))
  } else {
    const attese = [
      ['/', 200], ['/conformita-europea/', 200], ['/sicurezza-e-dati/', 200],
      ['/prezzi/', 200], ['/sitemap.xml', 200],
      /* ⛔ Questi DEVONO dare 404: sono le due cose che non vanno online. */
      ['/documentazione/', 404], ['/pazienti/medico/', 404],
    ]
    const rotti = []
    for (const [percorso, atteso] of attese) {
      const codice = Number(
        execFileSync('curl', ['-sS', '-o', '/dev/null', '-w', '%{http_code}', '--max-time', '20',
          `https://${DOMINIO}${percorso}`], { encoding: 'utf8' }),
      )
      if (codice !== atteso) rotti.push(`${percorso} → ${codice} (atteso ${atteso})`)
    }
    if (rotti.length) {
      muori(
        `il sito è stato spedito ma non risponde come deve:\n     ${rotti.join('\n     ')}`,
        `La copia di sicurezza è su ${MACCHINA} in /root/.`,
      )
    }
    ok(`${attese.length} rotte verificate dall’esterno`)
  }

  console.log(verde(`\n✅ Rilasciato ${sha.slice(0, 8)} su https://${DOMINIO}\n`))
  uscita = 0
} finally {
  try {
    git(['worktree', 'remove', '--force', W])
  } catch {
    /* se non si rimuove non è una ragione per far fallire un rilascio riuscito */
  }
  rmSync(W, { recursive: true, force: true })
  git(['worktree', 'prune'])
}
process.exit(uscita)
