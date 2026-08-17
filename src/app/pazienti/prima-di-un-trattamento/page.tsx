import { t } from '@/lib/testo'
import type { Metadata } from 'next'
import Link from 'next/link'
import { GuscioPaziente } from '@/components/pazienti/GuscioPaziente'
import { TestoPaziente, Sezione, COLLEGAMENTO } from '@/components/pazienti/TestoPaziente'

export const metadata: Metadata = {
  title: t('pazienti.primadiuntrattamento.meta_titolo_nove_domande_da_fare_prima_di'),
  description:
    t('pazienti.primadiuntrattamento.meta_descrizione_che_prodotto_mi_mettete_quanto'),
  alternates: { canonical: '/pazienti/prima-di-un-trattamento' },
}

/* Le domande non sono inventate: sono l'articolo 1 comma 3 della L. 219/2017
 * girato in seconda persona. Dove la legge dice «ha il diritto di essere
 * informata riguardo a X», qui c'è la domanda che ottiene X.
 *
 * ⛔ Nessun consiglio clinico, nessuna soglia, nessun «se ti dicono così
 * scappa»: sarebbe informazione sanitaria che non ci compete e che non
 * potremmo sostenere. Qui si dice **cosa chiedere**, non cosa sia giusto
 * sentirsi rispondere. */
const DOMANDE = [
  {
    d: 'Che cosa mi mettete, esattamente?',
    p: 'Nome del prodotto, non solo la categoria. «Filler» non è una risposta: l’acido ialuronico ha decine di prodotti diversi, con densità e durate diverse.',
  },
  {
    d: 'Quanto dura, e poi che succede?',
    p: 'Un trattamento che si riassorbe ha bisogno di essere rifatto. Sapere ogni quanto cambia il conto, e cambia la decisione.',
  },
  {
    d: 'Quali sono le alternative?',
    p: 'La legge dice che le alternative vanno presentate. Se ce n’è una sola, chiedi perché: è una risposta legittima, ma deve esserci.',
  },
  {
    d: 'E se non lo faccio?',
    p: 'È la domanda che quasi nessuno pone, ed è un diritto esplicito: ti devono dire le conseguenze del rifiuto. Spesso la risposta onesta è «niente», e va bene così.',
  },
  {
    d: 'Quali rischi ha, non in generale, ma per me?',
    p: 'Con la tua storia clinica, i tuoi farmaci, le tue allergie. Un elenco di rischi valido per chiunque non ti ha informato di niente.',
  },
  {
    d: 'Chi lo esegue materialmente?',
    p: 'Non è scontato che sia la persona con cui stai parlando.',
  },
  {
    d: 'Che cosa si fa se qualcosa va storto, e chi lo fa?',
    p: 'Chiedi il percorso concreto: chi chiami, in quanto tempo rispondono, dove si interviene. Una risposta vaga è già un’informazione.',
  },
  {
    d: 'Mi fate firmare un consenso? Posso leggerlo con calma?',
    p: 'Il consenso va raccolto per iscritto e finisce in cartella. Puoi chiederlo prima, e portartelo a casa a leggere.',
  },
  {
    d: 'Quanto costa, tutto compreso?',
    p: 'Compresi i controlli e le sedute successive, se ne servono. Gli onorari li indica lo studio: qui non li pubblichiamo, e nella pagina sotto c’è il perché.',
  },
] as const

export default function Page() {
  return (
    <GuscioPaziente>
      <TestoPaziente
        occhiello="Prima di decidere"
        titolo="Nove domande da fare prima di un trattamento"
        sommario={
          <>
            {t('pazienti.primadiuntrattamento.non_sono_domande_scomode_sono_quelle')}
          </>
        }
      >
        <ol style={{ marginTop: 'var(--s-21)' }}>
          {DOMANDE.map((q, i) => (
            <li
              key={q.d}
              style={{
                marginTop: i === 0 ? 0 : 'var(--s-21)',
                paddingTop: i === 0 ? 0 : 'var(--s-21)',
                borderTop: i === 0 ? 'none' : '1px solid var(--rule)',
              }}
            >
              <p style={{ fontWeight: 500 }}>
                {i + 1}. {q.d}
              </p>
              <p className="mt-[var(--s-8)]" style={{ color: 'var(--fg-muted)' }}>
                {q.p}
              </p>
            </li>
          ))}
        </ol>

        <Sezione id="portale" titolo="Una cosa da sapere su questo sito">
          <p>
            Qui non trovi <strong>prezzi, sconti né classifiche</strong>, e non è una
            dimenticanza: la legge italiana vieta ai medici e alle strutture sanitarie le
            comunicazioni con «elementi di carattere attrattivo e suggestivo», comprese
            offerte e promozioni. Un portale che mette i medici in fila per prezzo mette
            **loro** nei guai, non noi.
          </p>
          <p className="mt-[var(--s-13)]">
            Non trovi nemmeno <strong>recensioni</strong>. Per verificarle davvero
            dovremmo collegare chi scrive alla sua cartella clinica, cioè dichiarare che
            quella persona è stata paziente di quel medico. Non lo facciamo.
          </p>
        </Sezione>

        <Sezione id="poi" titolo="Da qui">
          <p>
            <Link href="/pazienti/consenso-informato" style={COLLEGAMENTO}>
              {t('pazienti.primadiuntrattamento.che_cos_e_il_consenso_informato')}
            </Link>{' '}
            ·{' '}
            <Link href="/pazienti/verificare-un-medico" style={COLLEGAMENTO}>
              {t('pazienti.primadiuntrattamento.come_verificare_che_un_medico_e')}
            </Link>
          </p>
        </Sezione>
      </TestoPaziente>
    </GuscioPaziente>
  )
}
