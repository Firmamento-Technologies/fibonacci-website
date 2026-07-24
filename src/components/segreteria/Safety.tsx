import { Siren, ShieldCheck, FolderLock, PhoneForwarded, Power, FileSearch } from 'lucide-react'
import { PhoneMockup, type ChatMessage } from './PhoneMockup'

// Esempio di risposta a un'emergenza: la REGOLA-118 è un controllo
// deterministico PRE-LLM (wiki: decisione-regola-118) — l'AI non viene
// interpellata e la risposta parte comunque, anche a servizio degradato.
const EMERGENCY_CHAT: ChatMessage[] = [
  { from: 'patient', text: 'Ho un forte dolore al petto e faccio fatica a respirare' },
  {
    from: 'ai',
    text: 'Chiama subito il 118 o il 112. Non aspettare e non guidare tu. Ho segnalato questa conversazione allo studio.',
  },
]

const POINTS = [
  {
    icon: Siren,
    title: 'L\u2019emergenza non passa mai dall\u2019AI',
    text: 'Ogni messaggio attraversa prima un controllo deterministico anti-emergenza: se rileva un rischio, il paziente riceve subito le indicazioni del 118/112 e lo studio viene avvisato. Funziona anche se l\u2019intelligenza artificiale è irraggiungibile, perché non dipende da lei.',
  },
  {
    icon: ShieldCheck,
    title: 'Mai consigli clinici',
    text: 'Niente diagnosi, dosaggi o interpretazioni di sintomi: il divieto è scritto nel sistema, non nel galateo. Se la domanda è medica, la risposta è il rinvio al medico.',
  },
  {
    icon: FolderLock,
    title: 'Nessun accesso alle cartelle cliniche',
    text: 'L\u2019agente è anonimo e separato: vede agenda e conversazioni, mai i dati clinici dei pazienti. Il collegamento telefono-paziente avviene solo nella revisione umana.',
  },
  {
    icon: PhoneForwarded,
    title: 'Handoff garantito',
    text: 'In caso di dubbio, errore o richiesta esplicita, la conversazione passa a una persona dello studio. Mai un vicolo cieco, mai un silenzio.',
  },
  {
    icon: Power,
    title: 'Kill-switch nelle tue mani',
    text: 'Puoi sospenderla in qualsiasi momento: i pazienti ricevono automaticamente i recapiti diretti dello studio.',
  },
  {
    icon: FileSearch,
    title: 'Audit completo',
    text: 'Ogni conversazione e ogni azione sull\u2019agenda sono registrate e verificabili. Sai sempre cosa ha detto e cosa ha fatto.',
  },
]

export function Safety() {
  return (
    <section className="py-24" style={{ background: 'var(--fg)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-[1fr_auto] gap-14 items-start">
          <div>
            <p
              className="text-sm font-semibold uppercase tracking-wider mb-3"
              style={{ color: 'var(--accent-light)' }}
            >
              Sicurezza prima di tutto
            </p>
            <h2
              className="font-[family-name:var(--font-geist)] tracking-[-0.025em] text-3xl md:text-4xl font-semibold text-white mb-5"
            >
              Se un paziente sta male, non è l&apos;AI a decidere cosa dire.
            </h2>
            <p className="text-base leading-relaxed mb-10" style={{ color: 'rgba(255,255,255,0.65)' }}>
              Un paziente può scrivere qualsiasi cosa, anche un&apos;emergenza. Per questo il
              primo livello di risposta non è intelligenza artificiale: è una regola
              deterministica, testata e firma-bile dal tuo referente clinico, che scatta
              prima di ogni elaborazione.
            </p>

            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-8">
              {POINTS.map((p) => (
                <div key={p.title} className="flex gap-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: 'rgba(230,242,251,0.10)', border: '1px solid rgba(230,242,251,0.18)' }}
                  >
                    <p.icon className="w-5 h-5" style={{ color: 'var(--accent-light)' }} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-1.5">{p.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
                      {p.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mockup emergenza */}
          <div className="mx-auto lg:sticky lg:top-24">
            <PhoneMockup
              messages={EMERGENCY_CHAT}
              caption="Qualunque giorno · qualunque ora"
              variant="emergency"
              status="controllo emergenze attivo"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
