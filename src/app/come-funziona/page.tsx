import type { Metadata } from 'next'
import Link from 'next/link'
import { Pagina } from '@/components/chrome/Pagina'
import { Reveal } from '@/components/ui/Reveal'
import { Occhiello, Schermata, Foto, Freccia } from '@/components/ui/elementi'
import { DEMO_URL } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'Come funziona',
  description:
    'Una giornata di studio dentro Fibonacci: dall’appuntamento in agenda al consenso firmato, dalle foto cifrate al registro degli accessi. Schermate vere dell’applicazione.',
  alternates: { canonical: '/come-funziona' },
}

/* La pagina prodotto.
 *
 * È organizzata come una giornata invece che come un elenco di funzioni,
 * perché è così che il medico decide se il software gli serve: non guarda
 * la lista delle voci di menu, guarda se il suo mercoledì funziona meglio.
 * Ogni passo ha una schermata vera: Baymard misura che le rappresentazioni
 * grafiche dell'interfaccia rendono peggio degli screenshot. */

const PASSI = [
  {
    ora: '08:40',
    occhiello: 'Prima che arrivi',
    titolo: 'La giornata è già in ordine',
    testo:
      'L’agenda dello studio mostra chi arriva e per cosa. Ogni appuntamento è legato alla cartella: si apre da lì, senza cercare il cognome.',
    schermata: '/schermate/agenda.png',
    alt: "L'agenda settimanale di Fibonacci con gli appuntamenti distribuiti sui giorni.",
  },
  {
    ora: '09:05',
    occhiello: 'In poltrona',
    titolo: 'L’anamnesi si scrive mentre parli',
    testo:
      'Detti, e i campi si riempiono. Le allergie compaiono in cima alla cartella con un banner che non si può non vedere: è il posto in cui una lidocaina dimenticata smette di essere un rischio.',
    schermata: '/schermate/cartella-paziente.png',
    alt: 'La cartella di una paziente in Fibonacci con il banner rosso delle allergie in evidenza e la cronologia delle sedute.',
  },
  {
    ora: '09:20',
    occhiello: 'Il consenso',
    titolo: 'Il modulo giusto, non il modulo unico',
    testo:
      'Scegli la procedura e il modulo esce con i rischi, le alternative e l’esito atteso di quella procedura. La paziente firma sul tablet, tu controfirmi, e il documento è archiviato prima che si alzi.',
    schermata: '/schermate/catalogo-consensi.png',
    alt: 'Il catalogo dei consensi di Fibonacci, con i modelli raggruppati per categoria.',
  },
  {
    ora: '09:35',
    occhiello: 'La seduta',
    titolo: 'Dove, quanto, con che lotto',
    testo:
      'Le aree si segnano sulla mappa. Prodotto, unità e lotto restano legati alla seduta, e al controllo di due mesi dopo sono ancora lì.',
    schermata: '/schermate/trattamenti.png',
    alt: "L'elenco dei trattamenti di una paziente: prodotto e unità nel titolo di ogni seduta, la data, e la nota tecnica del medico — diluizione, numero di punti, reazioni.",
  },
  {
    ora: '20:15',
    occhiello: 'A studio chiuso',
    titolo: 'Chi ha aperto cosa, e perché',
    testo:
      'Il registro raccoglie ogni accesso. Un controllo automatico segnala le anomalie: letture fuori orario, utenze disattivate, cartelle aperte senza una cura in corso.',
    schermata: '/schermate/registro-accessi.png',
    alt: 'Il registro accessi con tre righe rosse che segnalano accessi anomali.',
  },
] as const

export default function ComeFunziona() {
  return (
    <Pagina
      occhiello="Il prodotto"
      titolo={
        <>
          Un mercoledì qualunque, <span className="accento-corsivo">dentro</span> Fibonacci
        </>
      }
      sommario="Cinque momenti di una giornata di studio. Le immagini sono schermate dell’applicazione, non disegni."
      larga
    >
      <section className="fascia">
        <div className="gabbia">
          <div className="space-y-[var(--s-89)]">
            {PASSI.map((p, i) => (
              <Reveal key={p.ora}>
                <div className={`aurea ${i % 2 === 1 ? 'aurea-inversa' : ''}`}>
                  <div className={i % 2 === 1 ? 'lg:order-2' : ''}>
                    <div className="flex items-baseline gap-[var(--s-13)]">
                      <span
                        className="numero"
                        style={{ color: 'var(--accent)', fontSize: 13, letterSpacing: '0.06em' }}
                      >
                        {p.ora}
                      </span>
                      <Occhiello>{p.occhiello}</Occhiello>
                    </div>
                    <h2 className="mt-[var(--s-13)] text-[length:var(--display-3)]" style={{ maxWidth: '16ch' }}>
                      {p.titolo}
                    </h2>
                    <p className="mt-[var(--s-21)] text-[1.0625rem]" style={{ color: 'var(--fg-muted)' }}>
                      {p.testo}
                    </p>
                  </div>
                  <Schermata file={p.schermata} alt={p.alt} className={i % 2 === 1 ? 'lg:order-1' : ''} />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Le foto cliniche meritano una fermata a parte */}
      <section className="fascia" style={{ background: 'var(--bg-sunk)' }}>
        <div className="gabbia">
          <div className="aurea">
            <Reveal>
              <Foto
                nome="filler-labbra"
                alt="Primo piano di un'iniezione di filler alle labbra eseguita con guanti azzurri."
                proporzione="4 / 3"
              />
            </Reveal>
            <Reveal da="destra">
              <div>
                <Occhiello>Foto cliniche</Occhiello>
                <h2 className="mt-[var(--s-13)] text-[length:var(--display-3)]" style={{ maxWidth: '16ch' }}>
                  Il prima e dopo non sta nel rullino
                </h2>
                <p className="mt-[var(--s-21)] text-[1.0625rem]" style={{ color: 'var(--fg-muted)' }}>
                  Le fotografie si scattano dall&apos;applicazione, restano cifrate e legate alla
                  seduta. Non passano dal telefono e non finiscono in un backup automatico su un
                  servizio che non hai scelto tu.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="fascia">
        <div className="gabbia gabbia-stretta text-center">
          <h2 className="text-[length:var(--display-2)]">
            {DEMO_URL ? 'Provalo, o fattelo mostrare' : 'Fattelo mostrare'}
          </h2>
          {/* ⚠️ Legata a DEMO_URL: senza demo, dire «la demo è aperta e non
              chiede registrazione» è falso — il solo percorso è un modulo che
              la registrazione la chiede. Vedi la nota in Hero.tsx. */}
          <p className="mt-[var(--s-21)] text-[1.0625rem]" style={{ color: 'var(--fg-muted)' }}>
            {DEMO_URL
              ? 'La demo è aperta e non chiede registrazione. Se preferisci vedertelo spiegare sulle tue procedure, mezz’ora basta.'
              : 'Mezz’ora sulle tue procedure, coi tuoi casi. Nessun impegno.'}
          </p>
          <div className="mt-[var(--s-34)] flex flex-wrap justify-center gap-[var(--s-13)]">
            <Link href="/richiedi-una-demo" className="btn btn-primario">
              Richiedi una demo
            </Link>
            {DEMO_URL && (
              <a href={DEMO_URL} className="btn btn-secondario" rel="noopener">
                Entra nella demo
              </a>
            )}
          </div>
          <p className="mt-[var(--s-21)] text-[13px]" style={{ color: 'var(--fg-faint)' }}>
            La demo contiene dati finti. Non inserirci dati di pazienti reali.
          </p>
          <p className="mt-[var(--s-34)]">
            <Link href="/prezzi" className="link-avanti">
              Quanto costa
              <Freccia />
            </Link>
          </p>
        </div>
      </section>
    </Pagina>
  )
}
