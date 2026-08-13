import type { Metadata } from 'next'
import Link from 'next/link'
import { GuscioPaziente } from '@/components/pazienti/GuscioPaziente'
import { TestoPaziente, Sezione, COLLEGAMENTO } from '@/components/pazienti/TestoPaziente'
import { SOCIETA, PRIVACY_EMAIL } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'I tuoi dati su queste pagine',
  description:
    'Nessun cookie di tracciamento, nessun account, nessuna profilazione. Quando chiedi un appuntamento i dati vanno allo studio che hai scelto, che è il titolare del trattamento.',
  alternates: { canonical: '/pazienti/privacy' },
}

/* ⚠️ **Pagina informativa, NON l'informativa dell'art. 13 GDPR.** L'informativa
 * la deve dare **lo studio**, che è il titolare: qui si spiega al paziente come
 * stanno le cose, e si dichiara che il documento formale è suo.
 *
 * 🔑 **La riga che regge tutto**: chiedendo un appuntamento il paziente scrive
 * nome, telefono e il motivo — e «nome + telefono + un trattamento estetico» è
 * un dato dell'**art. 9** (CGUE C-184/20 §§ 124 e 127: sono dati sulla salute
 * anche quelli che la rivelano *indirettamente*, «compresa la prestazione di
 * servizi di assistenza sanitaria»). Perché il titolare resti **lo studio** e
 * non noi, questo sito deve restare **muto**: ⛔ nessun account, ⛔ nessuna
 * statistica, ⛔ nessun cookie.
 *
 * ⚠️ **«Nessuna chiamata a terzi» non è più vero alla lettera** (2026-08-13,
 * TD-122): la scheda del medico incorpora una mappa di OpenStreetMap, per
 * decisione dell'utente. La riga sopra regge lo stesso, e la distinzione va
 * capita invece che nascosta: la mappa **non ci rende titolari di dati
 * sanitari** — non riceve nome, telefono né motivo della visita, non lascia
 * cookie, e con `no-referrer` ⛔ non sa nemmeno quale pagina la stia mostrando.
 * Riceve **l'IP**, come qualunque server a cui il browser si collega. ⇒ va
 * **dichiarata**, ⛔ non fatta sparire dal testo.
 * 🔴 **Quello che invece romperebbe davvero questa pagina** resta quello di
 * prima: un contatore di visite, uno strumento di statistica, un carattere
 * remoto — qualcosa che osserva **il comportamento** del visitatore. Lì il
 * titolare diventiamo noi, con DPIA e responsabile della protezione dei dati al
 * seguito. Vedi [[sintesi-canale-paziente-2026-08-11]] §5.1. */
export default function Page() {
  return (
    <GuscioPaziente>
      <TestoPaziente
        occhiello="Trasparenza"
        titolo="I tuoi dati su queste pagine"
        sommario={
          <>
            La versione breve: finché leggi, non prendiamo niente. Quando chiedi un
            appuntamento, quello che scrivi va allo studio che hai scelto.
          </>
        }
      >
        {/* 🔴 **TD-122 — questa sezione diceva una cosa che dal 2026-08-13 non
            è più vera**: *«in queste pagine non ci sono mappe incorporate»*. La
            scheda del medico adesso ne ha una (richiesta dell'utente: la mappa
            dentro la UI, non come collegamento).
            🔑 **Il rischio non era il banner, era la frase falsa**: *«non
            contattiamo nessuno»* è il primo argomento di fiducia di questo
            canale, e una promessa smentita dai fatti vale meno di una promessa
            non fatta. Si scrive l'eccezione, ⛔ non si toglie la promessa.
            🔎 Misurato prima di scrivere: il riquadro di OpenStreetMap ⛔ non
            manda `Set-Cookie`, e la pagina gli passa `referrerPolicy` a
            `no-referrer` così ⛔ non riceve l'indirizzo della pagina — cioè
            *quale medico* stavi guardando. Resta vero che **il tuo indirizzo IP
            arriva a loro**, ed è esattamente ciò che va detto. */}
        <Sezione id="mentre-leggi" titolo="Mentre leggi">
          <p>
            <strong>Nessun cookie di tracciamento, nessun account, nessuna profilazione.</strong>{' '}
            Non c’è un banner dei cookie perché non c’è niente da farti accettare: i caratteri
            tipografici sono ospitati qui, non su un servizio esterno, e in queste pagine non
            ci sono video incorporati né contatori di visite.
          </p>
          <p className="mt-[var(--s-13)]">
            <strong>Con un’eccezione, ed è la mappa.</strong> Sulla pagina di uno studio c’è
            una mappa di <em>OpenStreetMap</em> che mostra dove si trova: quando apri quella
            pagina, il tuo browser si collega a loro e il tuo indirizzo IP arriva lì. Non
            lasciano cookie, e abbiamo fatto in modo che <strong>non ricevano l’indirizzo
            della pagina</strong>: non possono sapere quale medico stavi guardando.
            È l’unico collegamento a un servizio esterno in tutto questo sito.
          </p>
          <p className="mt-[var(--s-13)]" style={{ color: 'var(--fg-muted)' }}>
            Se apri un collegamento verso un sito esterno (il registro degli Ordini, una
            mappa), da quel momento vale la privacy di quel sito, non la nostra.
          </p>
        </Sezione>

        <Sezione id="quando-prenoti" titolo="Quando chiedi un appuntamento">
          <p>
            Quello che scrivi (nome, telefono, e il motivo se lo indichi) serve allo studio
            per richiamarti, e <strong>va allo studio</strong>. È lui il titolare del
            trattamento: la pagina è sua, l’appuntamento è suo, e l’informativa completa la dà
            lui.
          </p>
          <p className="mt-[var(--s-13)]">
            Noi facciamo da fornitore tecnico: teniamo in piedi la pagina e il collegamento
            con la sua agenda. ⛔ Non usiamo quei dati per altro, non li rivendiamo e non li
            usiamo per profilarti.
          </p>
          <p className="mt-[var(--s-13)]">
            Una richiesta di appuntamento <strong>non è una prenotazione confermata</strong>:
            è lo studio a confermarla.
          </p>
        </Sezione>

        <Sezione id="delicati" titolo="Perché ci teniamo tanto">
          <p>
            «Nome, telefono e un trattamento estetico» non è un dato qualunque: messo insieme
            racconta qualcosa della tua salute, e la legge europea lo protegge come tale anche
            quando lo fa <em>indirettamente</em>. È il motivo per cui questo sito è
            deliberatamente povero di funzioni: meno raccoglie, meno c’è da proteggere.
          </p>
        </Sezione>

        <Sezione id="diritti" titolo="I tuoi diritti">
          <p>
            Accesso, rettifica, cancellazione, limitazione, opposizione e portabilità si
            esercitano <strong>verso lo studio</strong>, che è il titolare. Se ci scrivi a noi
            per errore, ti indirizziamo a lui: non possiamo rispondere al posto suo.
          </p>
          {/* ⚠️ Recapito e anagrafica si accendono da soli il giorno
              dell'iscrizione al registro imprese: `SOCIETA.costituita` è
              l'unico interruttore. Finché è spento si dichiara il vuoto. */}
          <p className="mt-[var(--s-13)]">
            Per la parte tecnica di queste pagine puoi scrivere a{' '}
            <a href={`mailto:${PRIVACY_EMAIL}`} style={COLLEGAMENTO}>
              {PRIVACY_EMAIL}
            </a>
            .
          </p>
          {!SOCIETA.costituita && (
            <p className="mt-[var(--s-13)]" style={{ color: 'var(--fg-muted)' }}>
              La società che gestisce il servizio è in costituzione: i suoi dati compariranno
              qui appena sarà iscritta al registro delle imprese.
            </p>
          )}
        </Sezione>

        <Sezione id="poi" titolo="Da qui">
          <p>
            <Link href="/pazienti" style={COLLEGAMENTO}>
              Torna all’inizio
            </Link>
          </p>
        </Sezione>
      </TestoPaziente>
    </GuscioPaziente>
  )
}
