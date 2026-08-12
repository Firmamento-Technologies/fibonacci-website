/* Anagrafica e indirizzi: un posto solo.
 *
 * ⚠️ INTESTAZIONE SOCIETARIA — DA COMPLETARE ALLA COSTITUZIONE.
 * Fibonacci non è più intestato a Firmamento Technologies Soc. Coop.: sarà
 * una S.r.l. nuova, che alla data di questa revisione NON è ancora costituita.
 * Finché non lo è, questo file NON contiene ragione sociale, partita IVA, REA
 * né PEC, perché non esistono ancora e inventarli sarebbe peggio che ometterli.
 *
 * CONSEGUENZA DA CONOSCERE, non un dettaglio: l'art. 7 c. 1 del D.Lgs.
 * 70/2003 impone al prestatore di rendere «facilmente accessibili, in modo
 * diretto e permanente» denominazione, sede legale, contatti, numero REA e
 * partita IVA. Finché i campi qui sotto restano vuoti il sito è fuori da quel
 * requisito. Va colmato il giorno stesso dell'iscrizione al registro imprese,
 * e da quel momento il piè di pagina si popola da solo.
 */
export const SOCIETA = {
  /** Ragione sociale completa, es. «Fibonacci S.r.l.». */
  ragioneSociale: '',
  /** Nome breve per il testo corrente. */
  nomeBreve: '',
  partitaIva: '',
  rea: '',
  pec: '',
  sede: {
    via: '',
    cap: '',
    comune: '',
    provincia: '',
  },
  /** true quando l'anagrafica è completa: il piè di pagina la mostra solo allora. */
  get costituita() {
    return Boolean(this.ragioneSociale && this.partitaIva && this.rea && this.sede.via)
  },
} as const

/* ── Contatti ──────────────────────────────────────────────────────────
 * ⚠️ VUOTI FINCHÉ LA S.R.L. NON HA LE PROPRIE CASELLE.
 * Le vecchie caselle appartenevano a un'altra società e sono state tolte:
 * pubblicare l'indirizzo di posta di un soggetto diverso dal prestatore del
 * servizio confonde chi deve esercitare un diritto e chi deve notificare
 * qualcosa. Finché questi campi restano vuoti l'unico canale è il modulo di
 * contatto, e l'interfaccia si adegua da sola: nessuna riga mostra una
 * casella inesistente e il ripiego su `mailto:` del modulo resta spento.
 *
 * ⚠️ L'art. 7 c. 1 lett. c) D.Lgs. 70/2003 impone un recapito di posta
 * elettronica fra le informazioni obbligatorie. Vanno riempiti insieme
 * all'anagrafica societaria, non dopo. */
/* 2026-08-11: dominio `fibonaccimedica.it` registrato e casella creata.
 *
 * ⚠️ Esiste UNA casella sola, `info@`, e tutti e tre i campi puntano lì. Non è
 * una svista ed è meglio dell'alternativa: lasciandoli vuoti, il ripiego
 * scriveva dentro la privacy policy la frase «Il DPA è disponibile su richiesta
 * all'indirizzo il modulo di contatto del sito» — grammatica rotta in un
 * documento legale, e nessun canale per esercitare un diritto.
 *
 * Per una società di una persona una casella unica è la norma. ⛔ Ma quando
 * `privacy@` e `supporto@` esisteranno davvero, questi campi vanno separati:
 * una richiesta ex artt. 15-22 GDPR e una domanda commerciale non hanno né gli
 * stessi tempi né gli stessi obblighi. */
export const CONTACT_EMAIL = 'info@fibonaccimedica.it'
export const SUPPORT_EMAIL = 'info@fibonaccimedica.it'
export const PRIVACY_EMAIL = 'info@fibonaccimedica.it'

/* ── Indirizzi del prodotto ────────────────────────────────────────────
 * ⚠️ Il dominio `fibonacci.it` è di terzi dal 2003 e non si può usare.
 * Finché non se ne registra uno proprio, l'applicazione risponde sul VPS via
 * nip.io con certificato valido. Da cambiare in `https://app.<dominio>`. */
/* ⛔ VUOTI DI PROPOSITO dal 2026-08-09 — la macchina non esiste più.
 * `/opt/emr` è sparito e i due indirizzi rispondevano **HTTP 502**, mentre la
 * home li promuoveva come pulsante principale e come «Accedi». Un invito che
 * porta a una pagina d'errore non consegna il differenziatore: consegna
 * l'opposto — chi clicca «l'unica cosa che puoi verificare da solo in trenta
 * secondi» trova un errore.
 * Qui vale la stessa regola dei recapiti (vedi `segnaposto.ts`): il dato che
 * non esiste resta un **vuoto dichiarato**, mai un indirizzo inventato. Ogni
 * componente che li usa non disegna il pulsante quando sono vuoti.
 * ✅ PER RIMETTERLI: si riscrive l'URL qui, e basta — nient'altro da toccare. */
export const APP_URL: string = ''
export const DEMO_URL: string = ''

/* Dove risponde il servizio dei pagamenti, per aprire il checkout dal listino.
 * Serve da quando il self-service è la strada scelta (D5, utente 2026-08-10).
 *
 * ⛔ **VUOTO DICHIARATO**, stessa regola dei due di sopra, e qui per tre motivi
 * che vanno sciolti nell'ordine:
 *   1. **il sito è `output: 'export'`**, cioè statico: la chiamata parte dal
 *      browser, quindi il servizio dev'essere raggiungibile **da internet** e
 *      con la nostra origine in `ALLOWED_ORIGINS`. Oggi sta dietro un profilo
 *      compose e non ha nessuna route pubblica;
 *   2. `create_checkout_session` risponde **503** finché `APP_BASE_URL` e
 *      `SITE_BASE_URL` non hanno un valore, e non ce l'hanno finché il dominio
 *      non è comprato (TD-20);
 *   3. servono i Price ID veri, che vengono con l'account Stripe (TD-25).
 *
 * Finché è vuoto le schede **non disegnano il pulsante d'acquisto** e restano
 * sull'invito alla demo: un «Attiva ora» che porta a un errore è peggio di un
 * «Attiva ora» che non c'è — è la lezione già pagata con `DEMO_URL`.
 * ✅ PER ACCENDERLO: si scrive l'URL qui, e basta. */
export const BILLING_URL: string = ''

/* Raccolta dei contatti dal modulo.
 *
 * ⛔ **VUOTO DICHIARATO dal 2026-08-11**, e non per prudenza: misurato con
 * `curl`, quell'indirizzo risponde **HTTP 502** — è la stessa macchina sparita
 * che aveva già reso morti `APP_URL` e `DEMO_URL`. Nel giro del 2026-08-09
 * quei due furono svuotati e **questo fu saltato**, quindi il modulo ha
 * continuato a spedire verso il nulla: il medico compilava quattro campi,
 * aspettava la richiesta fallita, e vedeva un errore.
 *
 * Con questo vuoto il modulo **non finge**: se non c'è né endpoint né casella,
 * dice che il canale non è attivo invece di far perdere tempo a chi scrive.
 * ✅ PER RIACCENDERLO: basta **una riga** — o questo indirizzo, o `CONTACT_EMAIL`
 * qui sopra. Il modulo torna da sé, senza toccare nessun componente. */
export const LEAD_API_URL: string = ''

/* La base del sidecar che riceve le richieste di appuntamento dal lato
 * paziente (`POST /pubblico/prenota`).
 *
 * ⚠️ **Vuota per difetto, e non è una dimenticanza**: è la stessa postura di
 * `LEAD_API_URL`, `APP_URL` e `DEMO_URL` — un indirizzo che non risponde è
 * peggio di un indirizzo assente, perché il modulo *sembra* funzionare. Con
 * questa vuota il modulo di prenotazione **si dichiara spento**, non fallisce.
 *
 * ⛔ **Non riempirla prima di TD-92**: il CAPTCHA all'edge è il requisito
 * dichiarato *hard* prima di aprire il canale pubblico, e il tetto per numero
 * di telefono nel sidecar ferma l'abuso ripetuto, **non mille numeri diversi**. */
export const PRENOTA_API_URL: string = ''

/** Dove è pubblicata la vetrina. Da spostare sul dominio proprio. */
/* L'indirizzo canonico del sito. Segue `NEXT_PUBLIC_DOMINIO_SITO` — la STESSA
 * variabile che in `next.config.ts` toglie il prefisso `/fibonacci-website` e
 * che fa scrivere `out/CNAME`. Un solo interruttore per tre effetti, perché tre
 * interruttori separati sarebbero divergiti al primo rilascio.
 * Vuota ⇒ si resta su github.io e non cambia niente. */
const dominio = (process.env.NEXT_PUBLIC_DOMINIO_SITO ?? '').trim()
export const SITE_URL = dominio
  ? `https://${dominio}`
  : 'https://firmamento-technologies.github.io/fibonacci-website'

/** Dove stanno fisicamente i dati clinici. Detto per esteso perché è una
 *  delle prime tre domande di ogni medico prudente, e perché scrivere
 *  «in Italia» sarebbe falso. */
export const OSPITALITA = {
  fornitore: 'Hetzner Online GmbH',
  luogo: 'Falkenstein, Germania',
  area: 'Spazio economico europeo',
} as const
