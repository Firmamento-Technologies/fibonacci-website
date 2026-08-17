'use client'

import { t } from '@/lib/testo'
import Link from 'next/link'
import { Occhiello } from '@/components/ui/elementi'
import { ProvaMappaViso } from '@/components/home/ProvaMappaViso'
import { DEMO_URL } from '@/lib/site-config'

/* Il primo schermo.
 *
 * CXL: la proposta di valore deve rispondere entro ~8 secondi a «cos'è ·
 * cosa posso farci · a cosa mi serve · perché voi». E l'opinione sul sito si
 * forma in 50 millisecondi, quindi questo schermo dev'essere FINITO: niente
 * che sembri in costruzione.
 *
 * REGISTRO DEL TITOLO — deciso dopo due tentativi sbagliati.
 * Le versioni a effetto («La visita è finita. Il documento anche.», «La
 * paziente si rialza. Il consenso è già firmato.») sono state scartate
 * dall'utente per la stessa ragione: su chi compra un gestionale clinico la
 * battuta pubblicitaria suona come fuffa, non come competenza. Il manuale
 * dice che il titolo deve promettere invece di etichettare; qui vince il
 * lettore, che è un medico e legge un fornitore, non una campagna.
 *
 * Quindi: descrittivo e preciso. Il titolo elenca CHE COSA si gestisce, il
 * sottotitolo scende nel concreto (prodotto, lotto, firma, cifratura). Zero
 * giochi di parole, zero contrasti a effetto. L'unica libertà è il corsivo su
 * «medicina estetica», che è il segmento, non uno slogan. */

/* ⚠️ L'ENTRATA DEL PRIMO SCHERMO NON PASSA PIÙ DA framer-motion.
 * Prima ogni pezzo di questo blocco nasceva con `initial: {opacity: 0}`, e su
 * un export statico quello finisce **scritto in linea nell'HTML**. web.dev
 * (tier 1) esclude dai candidati LCP *«elements with an opacity of 0, that are
 * invisible to the user»*, e il First Contentful Paint invece li conta: da qui
 * il divario misurato il 2026-08-09, **FCP 1,4 s contro LCP 5,8 s**, con TBT
 * 50 ms e CLS 0 — cioè nessun costo di JavaScript, solo il titolo tenuto
 * invisibile finché non arrivava il pacchetto delle animazioni.
 * Ora l'entrata è una animazione CSS che muove **solo la trasformazione**
 * (`entra-primo-schermo` in `globals.css`): il contenuto è dipinto e
 * leggibile dal primo fotogramma, quindi è candidato LCP, e sale lo stesso.
 * Nessun JavaScript, quindi nessuna attesa dell'idratazione.
 * `prefers-reduced-motion` è gestito in CSS e vale anche a JavaScript spento.
 * ([[sintesi-analisi-ui-ux-2026-08-09]] §S3) */
/* ⚠️ SPAZIATURA DEL PRIMO SCHERMO — misurata, non a occhio.
 * Era 55 sopra e 89 sotto, più altri 89 di stacco prima delle tre prove in
 * fondo: **233px di solo vuoto**, su una prima schermata che misurava 1.022px
 * contro gli 809 utili di un portatile da 900. Il primo schermo è l'unico che
 * tutti vedono, ed era quello che non ci stava.
 * 13/13 e uno stacco di 34: nessuna parola tolta, 181px recuperati.
 * ⛔ Non rialzarli senza rimisurare `node scripts/altezza-pagine.mjs`. */
export function Hero() {

  return (
    <section style={{ paddingTop: 'var(--s-13)', paddingBottom: 'var(--s-13)' }}>
      <div className="gabbia">
        <div className="grid gap-[var(--s-55)] lg:grid-cols-[1fr_1.1fr] lg:gap-[var(--s-89)] lg:items-center">
          {/* ── Parola ─────────────────────────────────────────────────── */}
          <div className="passo">
            <div className="entra-primo-schermo">
              <Occhiello>{t('home.hero.medicina_estetica_cartella_clinica')}</Occhiello>
            </div>

            <h1 className="entra-primo-schermo ritardo-1 mt-[var(--s-21)] text-[length:var(--display-1)]">
              Cartella clinica, consensi e immagini per la{' '}
              <span className="accento-corsivo">medicina estetica</span>
            </h1>

            <p
              className="entra-primo-schermo ritardo-2 mt-[var(--s-34)] text-[1.0625rem]"
              style={{ color: 'var(--fg-muted)', maxWidth: 'var(--misura-corta)' }}
            >
              {/* 🔑 **Diceva cosa c'è dentro; ora dice a cosa serve.** Misurato il
                  2026-08-12: la posta in gioco — il contenzioso — era **già** sulla home,
                  scritta bene, nella tappa `Sigillo` («Una cartella si contesta dicendo che è
                  stata riscritta», «l'argomento più semplice che un avvocato possa usare»).
                  Ma è la **tappa 7 su 16**: chi leggeva solo il primo schermo non la trovava,
                  e la parola «contenzioso» sulla home compariva **zero volte**.
                  ⚠️ Ogni pezzo di questa frase corrisponde a una funzione che esiste: la
                  versione del consenso al momento della firma, il lotto, le foto, la catena di
                  impronte. ⛔ E si ferma lì — **non si promette un esito legale**, che non
                  dipende da noi. Si dice cosa si riesce a dimostrare, che è quello che il
                  prodotto fa davvero. */}
              Quando una seduta viene contestata, conta cosa riesci a dimostrare: il consenso
              nella versione firmata quel giorno, il lotto, le foto, e un registro che non si può
              riscrivere.
            </p>

            {/* La demo pubblica passa in prima fila.
                Nessuno in questo mercato ti fa entrare senza registrarti: i
                portali danno solo la demo col venditore. Averla e tenerla come
                terzo link in fondo a due pagine era sprecare l'unica cosa che
                un medico può verificare da solo in trenta secondi, di notte,
                senza parlare con nessuno. La demo guidata resta, ma dopo:
                chiedere mezz'ora a uno sconosciuto è un impegno più grande che
                aprire una scheda. */}
            <div className="entra-primo-schermo ritardo-3 mt-[var(--s-34)] flex flex-wrap gap-[var(--s-13)]">
              {/* Senza un host la demo non si promuove: il secondario sale a
                  primario invece di lasciare il primo schermo senza invito. */}
              {DEMO_URL && (
                <a href={DEMO_URL} className="btn btn-primario" rel="noopener">
                  {t('home.hero.entra_nella_demo')}
                </a>
              )}
              {/* Una sola etichetta in tutto il sito. Prima ce n'erano quattro
                  per la stessa azione — «Fattela mostrare», «Richiedi la demo»,
                  «Richiedi una demo guidata», «Richiedi una demo» — e un
                  visitatore che le incontra in sequenza non sa se stia chiedendo
                  quattro cose diverse. */}
              <Link
                href="/richiedi-una-demo"
                className={DEMO_URL ? 'btn btn-secondario' : 'btn btn-primario'}
              >
                {t('home.hero.richiedi_una_demo')}
              </Link>
            </div>

            {/* ⚠️ Questa riga è legata a DEMO_URL come il pulsante sopra, e non
                lo era: fino al 2026-08-11 prometteva «la demo è aperta: nessuna
                registrazione, nessuna email» mentre il bottone — spento
                DEMO_URL — portava a un modulo che chiede esattamente nome ed
                email. Il pulsante era stato cambiato quando la macchina è
                sparita, la frase sotto no.
                ⇒ La promessa vive e muore con la cosa che promette. */}
            <p
              className="entra-primo-schermo ritardo-4 mt-[var(--s-21)] text-[13px]"
              style={{ color: 'var(--fg-faint)' }}
            >
              {DEMO_URL
                ? 'La demo è aperta: nessuna registrazione, nessuna email, nessuna carta di credito. Dentro ci sono pazienti finti in uno spazio separato, e puoi toccare tutto.'
                : 'Mezz’ora, sulle tue procedure e coi tuoi casi. Nessun impegno e nessuna carta di credito.'}
            </p>
          </div>

          {/* ── Prova ───────────────────────────────────────────────────
              Baymard: sulla home servono immagini VERE dell'interfaccia, in
              alto. Il mockup disegnato rende peggio, perché chi valuta vuole
              vedere com'è fatto e non l'interpretazione che un designer ne dà.

              🔄 **Dal 2026-08-11 non è più un'immagine: è il componente.**
              Qui c'era `cartella-paziente.png`, la cartella INTERA — barra
              laterale, seconda colonna, elenco sedute — rimpicciolita in questa
              metà di schermo, dove non si legge un carattere. NN/G (tier 1)
              divide le visuali in *informative* e *decorative*, e le seconde
              non vengono guardate poco: vengono **ignorate**. Una schermata
              illeggibile è decorativa, cioè perde esattamente il vantaggio che
              la giustificava e si tiene solo la freddezza.
              ([[sintesi-hero-schermata-vs-foto-2026-08-07]], che raccomandava
              «una cosa sola e leggibile» — questo va un passo oltre: la cosa
              sola non è una figura, si tocca.)

              🔑 E si è scelta la mappa del viso, non un'altra: è l'unico pezzo
              del prodotto su cui un medico si è espresso — «meglio del 3D per
              uso quotidiano», call del 2026-05-17 — ed è l'unico che si porta
              qui senza backend, perché nell'applicazione è CSS puro.

              ⚠️ Quella schermata mostrava anche un difetto già corretto
              nell'EMR (`643bd10`): la stessa allergia in due banner attaccati.
              Restava in vetrina perché le immagini invecchiano da sole; un
              componente vero no, e `parita-viso.mjs` lo tiene agganciato. */}
          <div className="passo entra-primo-schermo-figura">
            <ProvaMappaViso />
          </div>
        </div>

        {/* ── Fascia di verità ───────────────────────────────────────────
            Tre fatti verificabili, non tre numeri gonfiati. CXL/Stanford: se
            urli «fidati di me» fai nascere il sospetto; contano invece i
            fatti controllabili. Il terzo dichiara lo stadio del prodotto,
            che è più credibile di una piazza di loghi finti. */}
        <div
          className="passo entra-primo-schermo ritardo-4 mt-[var(--s-34)] grid gap-[var(--s-21)] md:grid-cols-3"
          style={{ borderTop: '1px solid var(--rule)', paddingTop: 'var(--s-34)' }}
        >
          {[
            {
              t: 'I dati restano in Europa',
              d: 'Server in Germania. Niente cartelle cliniche oltreoceano.',
            },
            {
              t: 'Il registro non si riscrive',
              d: 'Ogni modifica entra in una catena di impronte. Ritoccarla la spezza, e si vede.',
            },
            {
              t: 'Siamo in avvio',
              d: 'In pilota presso uno studio. Meglio dirlo che esibire loghi di clienti che non abbiamo.',
            },
          ].map((f) => (
            <div key={f.t}>
              <p className="text-[15px] font-medium" style={{ color: 'var(--fg)' }}>
                {f.t}
              </p>
              <p className="mt-[var(--s-8)] text-[13px]" style={{ color: 'var(--fg-muted)' }}>
                {f.d}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
