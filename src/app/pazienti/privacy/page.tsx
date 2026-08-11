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
 * statistica, ⛔ nessun cookie, ⛔ nessuna chiamata a terzi.
 * Se un giorno qualcuno aggiunge un contatore di visite, questa pagina diventa
 * falsa e il titolare diventiamo noi — con DPIA e responsabile della protezione
 * dei dati al seguito. Vedi [[sintesi-canale-paziente-2026-08-11]] §5.1. */
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
        <Sezione id="mentre-leggi" titolo="Mentre leggi">
          <p>
            <strong>Nessun cookie di tracciamento, nessun account, nessuna profilazione.</strong>{' '}
            Non c’è un banner dei cookie perché non c’è niente da farti accettare: i caratteri
            tipografici sono ospitati qui, non su un servizio esterno, e in queste pagine non
            ci sono mappe incorporate, video incorporati o contatori di visite.
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
