import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ShieldCheck, Sparkles, Heart, ArrowRight } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { PHOTOS } from '@/lib/asset-path'

export const metadata: Metadata = {
  title: 'Chi siamo',
  description:
    'Fibonacci nasce per restituire al medico italiano il tempo che oggi spende dietro a carta, Excel e WhatsApp. Una cartella clinica costruita con i workflow reali della pratica.',
  alternates: { canonical: '/chi-siamo' },
}

const VALORI = [
  {
    icon: Heart,
    title: 'Chiarezza per il medico',
    body:
      'Ogni schermata è progettata partendo dal flusso reale di una visita, non da uno schema database. Se una funzione richiede un manuale, è una funzione sbagliata.',
  },
  {
    icon: ShieldCheck,
    title: 'Sicurezza dei pazienti',
    body:
      'Cifratura AES-256, audit log immutabile, conformità GDPR fin dal primo commit. La compliance non è un layer applicato sopra, è il modo in cui il software è costruito.',
  },
  {
    icon: Sparkles,
    title: 'Intelligenza artificiale responsabile',
    body:
      'L\'AI scrive il primo draft, il medico decide cosa diventa cartella. Confidence score visibili, output sempre rivedibili, mai persistenza automatica. La responsabilità clinica resta del professionista.',
  },
] as const

export default function ChiSiamoPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16" style={{ background: 'var(--bg)' }}>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse 70% 50% at 50% 0%, var(--accent-light) 0%, transparent 70%)',
            }}
          />
          <div className="relative max-w-3xl mx-auto px-6 py-20 lg:py-28 text-center">
            <div
              className="flex items-center gap-2 text-xs font-medium mb-3 justify-center"
              style={{ color: 'var(--muted)' }}
            >
              <Link href="/" className="hover:underline">Home</Link>
              <span>/</span>
              <span style={{ color: 'var(--fg)' }}>Chi siamo</span>
            </div>
            <p
              className="text-sm font-semibold uppercase tracking-wider mb-4"
              style={{ color: 'var(--accent)' }}
            >
              Chi siamo
            </p>
            <h1
              className="font-[var(--font-playfair)] text-4xl md:text-5xl lg:text-[3.5rem] font-bold leading-[1.05] mb-6"
              style={{ color: 'var(--fg)' }}
            >
              Restituiamo al medico il tempo che gli serve per fare il medico
            </h1>
            <p
              className="text-lg leading-relaxed"
              style={{ color: 'var(--muted)' }}
            >
              Fibonacci nasce dalla frustrazione di vedere troppi specialisti italiani spendere
              venti minuti a visita dietro a carta, Excel e WhatsApp. Una cartella clinica
              digitale costruita partendo dai workflow reali, non da uno schema dati.
            </p>
          </div>
        </section>

        {/* Foto scene clinica - tra Hero e Missione */}
        <section className="py-12" style={{ background: 'var(--bg)' }}>
          <div className="max-w-4xl mx-auto px-6">
            <div
              className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-xl"
              style={{ border: '1px solid var(--border)' }}
            >
              <Image
                src={PHOTOS.doctorFemaleCoat}
                alt="Dottoresse in studio clinico - scene contemporanea di consulto fra colleghe"
                fill
                unoptimized
                priority
                className="object-cover"
              />
            </div>
            <p className="text-xs mt-3 italic text-center" style={{ color: 'var(--muted)' }}>
              Immagine illustrativa. Fibonacci nasce dall&apos;osservazione del lavoro
              reale dei medici italiani.
            </p>
          </div>
        </section>

        {/* Missione narrative */}
        <section className="py-20" style={{ background: 'var(--card)' }}>
          <div className="max-w-3xl mx-auto px-6">
            <div className="prose prose-lg max-w-none">
              <h2
                className="font-[var(--font-playfair)] text-2xl md:text-3xl font-bold mb-6"
                style={{ color: 'var(--fg)' }}
              >
                Perché Fibonacci
              </h2>
              <p className="text-base leading-relaxed mb-5" style={{ color: 'var(--fg)' }}>
                Il software medico italiano è spesso una scelta fra due alternative scomode.
                Da un lato gestionali storici dal design fermo agli anni Duemila, costruiti
                per la burocrazia amministrativa più che per la clinica. Dall&apos;altro
                soluzioni internazionali che parlano la lingua del database e non quella del
                medico, prive di consensi informati, di catalogo farmaci AIFA e di sensibilità
                ai regolamenti italiani.
              </p>
              <p className="text-base leading-relaxed mb-5" style={{ color: 'var(--fg)' }}>
                Fibonacci sta nel mezzo. È costruita in Italia per medici italiani, con
                attenzione al dettaglio normativo e alla pratica clinica reale. Ma adotta
                gli standard internazionali (FHIR R4 nativo, OAuth, audit log immutabile) e
                le tecnologie moderne (intelligenza artificiale per la dettatura, body map
                2D, cifratura a riposo) che il software medico italiano ha tardato a portare
                al medico professionista.
              </p>
              <p className="text-base leading-relaxed" style={{ color: 'var(--fg)' }}>
                Il nome è un riferimento alla sequenza di Fibonacci e al rapporto aureo:
                proporzioni naturali, crescita armoniosa, ordine matematico. Tre concetti
                che ci guidano nel disegno del software e nel modo in cui scegliamo cosa
                aggiungere, cosa togliere e cosa lasciare semplice.
              </p>
            </div>
          </div>
        </section>

        {/* Valori */}
        <section className="py-20" style={{ background: 'var(--bg)' }}>
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-12">
              <p
                className="text-sm font-semibold uppercase tracking-wider mb-3"
                style={{ color: 'var(--accent)' }}
              >
                Valori
              </p>
              <h2
                className="font-[var(--font-playfair)] text-3xl md:text-4xl font-bold"
                style={{ color: 'var(--fg)' }}
              >
                Tre cose a cui non transigiamo
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {VALORI.map((v) => (
                <div
                  key={v.title}
                  className="p-6 rounded-2xl"
                  style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: 'var(--accent-light)' }}
                  >
                    <v.icon className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                  </div>
                  <h3
                    className="font-[var(--font-playfair)] text-xl font-bold mb-3"
                    style={{ color: 'var(--fg)' }}
                  >
                    {v.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
                    {v.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Foto team diversity tra Valori e Approccio */}
        <section className="py-12" style={{ background: 'var(--bg)' }}>
          <div className="max-w-4xl mx-auto px-6">
            <div className="grid md:grid-cols-[1fr_1fr] gap-8 items-center">
              <div
                className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-lg"
                style={{ border: '1px solid var(--border)' }}
              >
                <Image
                  src={PHOTOS.fourFemaleDoctors}
                  alt="Gruppo di dottoresse sorridenti in camice bianco con stetoscopi"
                  fill
                  unoptimized
                  className="object-cover"
                  loading="lazy"
                />
              </div>
              <div>
                <p
                  className="text-sm font-semibold uppercase tracking-wider mb-3"
                  style={{ color: 'var(--accent)' }}
                >
                  Per chi facciamo
                </p>
                <h2
                  className="font-[var(--font-playfair)] text-2xl md:text-3xl font-bold mb-4 leading-tight"
                  style={{ color: 'var(--fg)' }}
                >
                  Per ogni medico, in ogni studio
                </h2>
                <p className="text-base leading-relaxed mb-4" style={{ color: 'var(--fg)' }}>
                  Fibonacci è disegnato per la varietà reale dei professionisti italiani:
                  studi singoli, studi associati, cliniche multi-operatore. Dal medico estetico
                  di provincia che fa quindici visite al giorno alla clinica metropolitana
                  con dieci operatori in agenda condivisa.
                </p>
                <p className="text-base leading-relaxed" style={{ color: 'var(--fg)' }}>
                  Stessa interfaccia, stessa compliance, stessa promessa: il tempo che oggi
                  spendi su carta torna alla cura del paziente.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Approccio prodotto */}
        <section className="py-20" style={{ background: 'var(--card)' }}>
          <div className="max-w-3xl mx-auto px-6">
            <h2
              className="font-[var(--font-playfair)] text-2xl md:text-3xl font-bold mb-6"
              style={{ color: 'var(--fg)' }}
            >
              Come costruiamo Fibonacci
            </h2>
            <div className="flex flex-col gap-5 text-base leading-relaxed" style={{ color: 'var(--fg)' }}>
              <p>
                Sviluppiamo con medici reali in feedback continuo. Ogni specialità è il
                risultato di iterazioni con specialisti italiani che usano il prodotto
                quotidianamente, non di sondaggi astratti.
              </p>
              <p>
                Manteniamo il codice sorgente verificabile su standard noti. FHIR R4
                garantisce che i dati siano portabili in qualsiasi momento, in formato
                aperto e comprensibile da qualunque altro sistema sanitario.
              </p>
              <p>
                Non vendiamo i tuoi dati. Non li monetizziamo. Non li usiamo per addestrare
                modelli senza consenso esplicito. L&apos;unica relazione economica fra
                Fibonacci e il medico è il canone mensile.
              </p>
              <p>
                Scegliamo la trasparenza sulle limitazioni. Non rivendichiamo certificazioni
                che non abbiamo. Non promettiamo funzionalità che non esistono. Quando
                l&apos;AI sbaglia, lo segnaliamo nel confidence score: la decisione clinica
                è sempre del medico.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20" style={{ background: 'var(--fg)' }}>
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2
              className="font-[var(--font-playfair)] text-3xl md:text-4xl font-bold text-white mb-4"
            >
              Provaci per 14 giorni
            </h2>
            <p className="text-base mb-8" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Nessuna carta di credito, nessun vincolo. Una demo personalizzata di 30 minuti
              per capire se Fibonacci è il software giusto per il tuo studio.
            </p>
            <Link
              href="/#demo"
              className="inline-flex items-center gap-2 px-6 py-4 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90"
              style={{ background: 'var(--accent)', color: 'white' }}
            >
              Richiedi demo gratuita
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
