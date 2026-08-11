import type { Metadata } from 'next'
import Link from 'next/link'
import { GuscioPaziente } from '@/components/pazienti/GuscioPaziente'
import { TestoPaziente, Sezione, COLLEGAMENTO } from '@/components/pazienti/TestoPaziente'

export const metadata: Metadata = {
  title: 'Il consenso informato: che cos’è, e che cosa non è',
  description:
    'Nessun trattamento sanitario può iniziare senza il tuo consenso libero e informato. Hai diritto a sapere benefici, rischi, alternative e cosa succede se rifiuti, e puoi cambiare idea in qualsiasi momento. Legge 219/2017.',
  alternates: { canonical: '/pazienti/consenso-informato' },
}

/* Fonte primaria: L. 219/2017 art. 1, letta nel testo
 * (`UniversalCorpus 20_diritto-impresa-italia/13-sanita-e-professioni-sanitarie/
 * legge-219-2017-consenso-informato.md`). ⛔ Nessuna riga qui è scritta a
 * memoria: dove la pagina afferma un diritto, quel diritto sta in un comma.
 *
 * ⚠️ Attribuzione giurisprudenziale: in medicina estetica l'obbligo
 * informativo rafforzato è **Cass. 29827/2019**, non 26104/2022 — il progetto
 * ha già corretto questa citazione in 232 file il 2026-08-07, e ⛔ non va
 * reintrodotta sbagliata qui. */
export default function Page() {
  return (
    <GuscioPaziente>
      <TestoPaziente
        occhiello="Prima di decidere"
        titolo="Il consenso informato: che cos’è, e che cosa non è"
        sommario={
          <>
            Non è un modulo da firmare in fretta in sala d’attesa. È il momento in cui ti
            viene spiegato cosa ti stanno per fare, e in cui decidi tu.
          </>
        }
      >
        <Sezione id="regola" titolo="La regola, in una riga">
          <p>
            <strong>
              Nessun trattamento sanitario può essere iniziato o proseguito senza il tuo
              consenso libero e informato.
            </strong>{' '}
            Lo dice la legge 219 del 2017, all’articolo 1. Vale per un intervento e vale per
            una puntura di acido ialuronico.
          </p>
        </Sezione>

        <Sezione id="diritto" titolo="Che cosa hai il diritto di sapere">
          <p>
            La stessa legge elenca le informazioni che ti spettano, e le vuole{' '}
            <strong>complete, aggiornate e comprensibili per te</strong>, non corrette in
            astratto:
          </p>
          <ul className="mt-[var(--s-13)]">
            {[
              'la diagnosi e la prognosi;',
              'i benefici e i rischi del trattamento proposto;',
              'le possibili alternative;',
              'che cosa succede se rifiuti, o se ci rinunci dopo.',
            ].map((v) => (
              <li key={v} style={{ padding: 'var(--s-5) 0' }}>
                {v}
              </li>
            ))}
          </ul>
          <p className="mt-[var(--s-13)]">
            Le ultime due righe sono quelle che quasi nessuno chiede, e sono le più utili:{' '}
            <strong>l’alternativa</strong> e <strong>il non farlo</strong> sono due opzioni
            vere, e devono esserti presentate come tali.
          </p>
          <p className="mt-[var(--s-13)]" style={{ color: 'var(--fg-muted)' }}>
            Puoi anche scegliere il contrario: <em>non</em> ricevere le informazioni, o
            indicare una persona di fiducia che le riceva al posto tuo. Anche questo è un
            tuo diritto, e va messo per iscritto in cartella.
          </p>
        </Sezione>

        <Sezione id="forma" titolo="Come deve essere raccolto">
          <p>
            <strong>In forma scritta</strong> (o con una videoregistrazione, o con
            strumenti adatti a chi ha una disabilità), e <strong>finisce in cartella</strong>{' '}
            clinica. Se ti viene chiesto un consenso solo a voce, e nient’altro resta scritto
            da nessuna parte, manca un pezzo.
          </p>
        </Sezione>

        <Sezione id="revoca" titolo="Puoi cambiare idea. Sempre">
          <p>
            Hai il diritto di <strong>rifiutare</strong> in tutto o in parte, e di{' '}
            <strong>revocare il consenso in qualsiasi momento</strong>: anche dopo averlo
            dato, anche quando revocarlo interrompe il trattamento. Non devi giustificarti.
          </p>
        </Sezione>

        <Sezione id="estetica" titolo="Perché in medicina estetica è più severo">
          <p>
            Un trattamento estetico si fa su una persona <strong>sana</strong>, e{' '}
            <strong>non è necessario</strong>: nessuno sta curando una malattia. Per questo
            i giudici chiedono al medico estetico un’informazione{' '}
            <strong>più rigorosa</strong> che altrove: deve mettere in conto anche il
            risultato che non ti piacerà, non solo la complicanza clinica.
          </p>
        </Sezione>

        <Sezione id="non-e" titolo="E che cosa NON è">
          <p>
            <strong>Non è una liberatoria.</strong> Firmare non toglie responsabilità al
            medico e non ti fa rinunciare a niente. Anzi: un consenso raccolto male è di per
            sé un problema del medico, indipendentemente da come è andato il trattamento.
          </p>
          <p className="mt-[var(--s-13)]">
            <strong>Non è un foglio uguale per tutti.</strong> Un modulo che potrebbe essere
            firmato da chiunque per qualunque cosa non ti ha informato di niente.
          </p>
        </Sezione>

        <Sezione id="poi" titolo="Da qui">
          <p>
            <Link href="/pazienti/prima-di-un-trattamento" style={COLLEGAMENTO}>
              Le domande da fare prima di un trattamento
            </Link>:
             le stesse cose, girate in domande che puoi porre in visita.
          </p>
        </Sezione>
      </TestoPaziente>
    </GuscioPaziente>
  )
}
