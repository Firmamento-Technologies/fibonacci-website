import type { Metadata } from 'next'
import Link from 'next/link'
import { Pagina } from '@/components/chrome/Pagina'
import { Reveal } from '@/components/ui/Reveal'
import { Bollini } from '@/components/Bollini'
import { Occhiello, Freccia } from '@/components/ui/elementi'
import { BOLLINI } from '@/lib/bollini'

export const metadata: Metadata = {
  title: 'Conformità europea',
  description:
    'Dove stanno i dati, chi ne è titolare, che cosa dice il regolamento europeo sui dati sanitari e da quando. Nove garanzie con la prova accanto, comprese le due che ci mancano.',
  alternates: { canonical: '/conformita-europea' },
}

/* La pagina del valore legale europeo.
 *
 * ⚠️ REGOLA DI SCRITTURA, ereditata da `/sicurezza-e-dati` e qui più stretta:
 * ogni riga deve essere **verificabile o contestabile da un terzo**. Su una
 * pagina che parla di conformità la tentazione è la formula vuota («pienamente
 * conforme al GDPR», «massimi standard europei»): sono affermazioni che non si
 * possono né provare né smentire, e un consulente le legge come rumore.
 *
 * 🔑 E la parte che rende credibile il resto sono le **due garanzie che non
 * abbiamo**, dichiarate qui con lo stesso rilievo delle altre sette. Un
 * elenco di sole vittorie si legge come pubblicità; un elenco che contiene i
 * propri buchi si legge come un documento.
 *
 * ⛔ Nessun marchio, sigillo o logo di ente terzo è disegnato in questa
 * pagina. La marcatura CE prevista dal regolamento EHDS **non è oggi
 * apponibile da nessuno**, e disegnarne una somiglianza sarebbe l'esatto
 * illecito che la pagina rimprovera ai concorrenti.
 */

/* Il regolamento EHDS: le date e gli articoli, presi dal testo pubblicato in
 * Gazzetta e non da una sintesi.
 * Reg. (UE) 2025/327 — artt. 37, 38, 39, 40, 41, 49 e art. 105 per le date. */
const PASSAGGI_EHDS = [
  {
    a: 'Art. 37',
    t: 'Documentazione tecnica',
    d: 'Il fabbricante la redige prima di immettere il sistema sul mercato e la tiene aggiornata. Dimostra la conformità alle prescrizioni essenziali dell’Allegato II.',
  },
  {
    a: 'Art. 39',
    t: 'Dichiarazione di conformità UE',
    d: 'Attesta il rispetto delle prescrizioni essenziali. Resta accessibile per almeno dieci anni dall’immissione sul mercato.',
  },
  {
    a: 'Art. 40',
    t: 'Ambiente digitale europeo di prova',
    d: 'I componenti software armonizzati vanno valutati lì prima dell’immissione sul mercato. Le specifiche comuni sono demandate ad atti di esecuzione della Commissione.',
  },
  {
    a: 'Art. 41',
    t: 'Marcatura CE di conformità',
    d: 'Apposta in modo visibile, leggibile e indelebile sui documenti che accompagnano il sistema, prima dell’immissione sul mercato.',
  },
] as const

/* Le prescrizioni dell'Allegato II che NON dipendono dagli atti di esecuzione:
 * su queste una risposta oggi è possibile, e quindi dovuta. */
const ALLEGATO_II = [
  {
    n: '2.6',
    t: 'Uscire non deve essere gravoso',
    d: 'Niente caratteristiche che rendano gravosa l’esportazione autorizzata per sostituire il sistema con un altro prodotto.',
    stato: 'Soddisfatta',
    come: 'l’export integrale in FHIR R4 è una funzione, disponibile senza chiedere il permesso a noi.',
  },
  {
    n: '3.1',
    t: 'Identificare chi entra',
    d: 'Meccanismi affidabili di identificazione e autenticazione dei professionisti sanitari.',
    stato: 'Soddisfatta',
    come: 'secondo fattore, sessione irrigidita, ruoli separati, compartimenti per studio.',
  },
  {
    n: '3.2 e 3.3',
    t: 'Registrare gli accessi, e poterli esaminare',
    d: 'Registrazione di ogni evento di accesso, e strumenti per analizzarne i dati.',
    stato: 'Soddisfatta',
    come: 'registro FHIR AuditEvent legato da una catena di impronte, che consulti tu.',
  },
  {
    n: '3.4',
    t: 'Conservazioni e accessi differenziati',
    d: 'Periodi di conservazione e diritti di accesso diversi secondo origine e categoria del dato.',
    stato: 'Parziale',
    come: 'la conservazione differenziata è attiva, la granularità per origine no. Lo diciamo adesso, non quando ce lo chiederanno.',
  },
] as const

export default function ConformitaEuropea() {
  return (
    <Pagina
      href="/conformita-europea"
      occhiello="Conformità europea"
      titolo={
        <>
          Nove garanzie, e accanto a ognuna <span className="accento-corsivo">come</span> si controlla
        </>
      }
      sommario="Due riguardano cose che non abbiamo. Sono le prime che leggerebbe il tuo consulente, quindi le scriviamo noi."
    >
      {/* ── I bollini, tre per schermata ─────────────────────────────────
          ⚠️ Tre e non nove: nove riquadri impilati su un telefono fanno
          quattro schermate, e il cancello `scripts/altezza-pagine.mjs`
          boccia le tappe fuori misura. Il taglio è per argomento, non per
          conteggio: dove sta il dato · che cosa puoi farci · che cosa ci
          manca. */}
      <section style={{ paddingBlock: 'var(--s-21)' }}>
        <div className="gabbia">
          <Reveal>
            <Occhiello>Dove sta il dato, e chi comanda</Occhiello>
          </Reveal>
          <div className="mt-[var(--s-21)]">
            <Bollini ids={BOLLINI.slice(0, 3).map((b) => b.id)} />
          </div>
        </div>
      </section>

      <section className="fascia" style={{ background: 'var(--bg-sunk)' }}>
        <div className="gabbia">
          <Reveal>
            <Occhiello>Che cosa puoi farci</Occhiello>
          </Reveal>
          <div className="mt-[var(--s-21)]">
            <Bollini ids={BOLLINI.slice(3, 6).map((b) => b.id)} />
          </div>
        </div>
      </section>

      <section style={{ paddingBlock: 'var(--s-21)' }}>
        <div className="gabbia">
          {/* `passo` sull'intestazione, come in «Come si controlla»: senza,
              il cancello misurava 154px fuori dai passi e su telefono il
              ritmo slittava di un quinto di schermata. Questa intestazione
              regge da sola, che è la condizione per marcarla. */}
          <Reveal className="passo">
            <Occhiello>Quello che non facciamo, e quello che non abbiamo</Occhiello>
            <h2 className="mt-[var(--s-13)] text-[length:var(--display-3)]" style={{ maxWidth: '40ch' }}>
              Un elenco di sole vittorie non è un documento, è un manifesto pubblicitario
            </h2>
          </Reveal>
          <div className="mt-[var(--s-21)]">
            <Bollini ids={BOLLINI.slice(6).map((b) => b.id)} />
          </div>
        </div>
      </section>

      {/* ── EHDS: l'obbligo che arriva ──────────────────────────────────── */}
      <section className="scuro fascia">
        <div className="gabbia">
          <div className="aurea">
            <Reveal className="passo">
              <div>
                <Occhiello chiaro>Il regolamento che cambia le carte</Occhiello>
                <h2
                  className="mt-[var(--s-13)] text-[length:var(--display-2)]"
                  style={{ maxWidth: '18ch' }}
                >
                  Dal 2029 una cartella clinica dovrà essere{' '}
                  <span className="accento-corsivo">marcata CE</span>
                </h2>
                <div
                  className="mt-[var(--s-21)] space-y-[var(--s-13)] text-[1.0625rem]"
                  style={{ color: 'var(--on-ink-muted)', maxWidth: '46ch' }}
                >
                  <p>
                    Il Regolamento (UE) 2025/327 istituisce lo spazio europeo dei dati sanitari e
                    detta un quadro armonizzato per i sistemi di cartelle cliniche elettroniche. Si
                    applica dal <strong style={{ color: 'var(--on-ink)' }}>26 marzo 2027</strong>, e
                    dal <strong style={{ color: 'var(--on-ink)' }}>26 marzo 2029</strong> per i
                    sistemi destinati alle categorie prioritarie di dati sanitari.
                  </p>
                  <p>
                    Non è una formalità da ufficio acquisti: è un requisito di prodotto. Chi vende
                    una cartella clinica dovrà dimostrare che fa certe cose, e chi non le fa uscirà
                    dal mercato europeo.
                  </p>
                  <p style={{ color: 'var(--on-ink)' }}>
                    Oggi la marcatura <strong>non è apponibile da nessuno</strong>: mancano gli atti
                    di esecuzione della Commissione sull’ambiente di prova e sul formato europeo di
                    scambio. Se un fornitore te la dichiara adesso, ti sta dicendo qualcosa su di sé.
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal da="destra" className="passo">
              <div className="foglio">
                <p className="numero">REG. (UE) 2025/327 · CAPO III</p>
                <dl className="mt-[var(--s-21)]">
                  {PASSAGGI_EHDS.map((p) => (
                    <div
                      key={p.a}
                      className="grid gap-[var(--s-8)] py-[var(--s-13)] sm:grid-cols-[5.5rem_1fr]"
                      style={{ borderTop: '1px solid var(--rule-ink)' }}
                    >
                      <dt className="numero" style={{ paddingTop: 3, color: 'var(--accent-onink)' }}>
                        {p.a}
                      </dt>
                      <dd>
                        <span className="text-[15px]" style={{ color: 'var(--on-ink)' }}>
                          {p.t}
                        </span>
                        <span
                          className="mt-[3px] block text-[13px]"
                          style={{ color: 'var(--on-ink-muted)' }}
                        >
                          {p.d}
                        </span>
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Allegato II: dove siamo già, voce per voce ──────────────────── */}
      <section className="fascia" style={{ background: 'var(--bg-sunk)' }}>
        <div className="gabbia gabbia-stretta">
          <Reveal className="passo">
            <Occhiello>Misurato, non promesso</Occhiello>
            <h2 className="mt-[var(--s-13)] text-[length:var(--display-2)]" style={{ maxWidth: '22ch' }}>
              Le prescrizioni su cui una risposta è già possibile
            </h2>
            <p className="mt-[var(--s-13)] text-[1.0625rem]" style={{ color: 'var(--fg-muted)', maxWidth: 'var(--measure)' }}>
              Quattro requisiti dell’Allegato II non dipendono dagli atti di esecuzione che mancano.
              Su quelli una risposta si può dare adesso, compreso il punto in cui siamo a metà.
            </p>
          </Reveal>

          <dl className="mt-[var(--s-21)]">
            {/* ⚠️ `Reveal` È la cella della lista, ⛔ non un involucro attorno
                a un altro `<div>`: con due div annidati i `<dt>`/`<dd>`
                diventano nipoti del `<dl>`, e la specifica ne ammette **uno**
                solo. Il collaudo l'ha preso come difetto «serious» su 8 nodi
                (4 righe × dt+dd), e non si vedeva a video: una lista di
                definizioni malformata è rotta per chi la legge con uno
                screen reader e identica per tutti gli altri. */}
            {ALLEGATO_II.map((r) => (
              <Reveal
                key={r.n}
                className="passo grid gap-[var(--s-8)] py-[var(--s-13)] sm:grid-cols-[4.5rem_1fr] border-t border-[var(--rule)]"
              >
                  <dt className="numero" style={{ paddingTop: 4 }}>
                    {r.n}
                  </dt>
                  <dd>
                    <div className="flex flex-wrap items-baseline justify-between gap-[var(--s-8)]">
                      <span className="text-[1.0625rem]" style={{ fontFamily: 'var(--font-display)' }}>
                        {r.t}
                      </span>
                      <span
                        className="numero"
                        style={{ color: r.stato === 'Soddisfatta' ? 'var(--accent)' : 'var(--fg-muted)' }}
                      >
                        {r.stato}
                      </span>
                    </div>
                    <p className="mt-[var(--s-5)] text-[15px]" style={{ color: 'var(--fg-muted)' }}>
                      {r.d}{' '}
                      <span style={{ color: 'var(--accent)' }}>Come</span> {r.come}
                    </p>
                  </dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      {/* ── L'uscita come dovere deontologico ───────────────────────────── */}
      <section className="fascia">
        <div className="gabbia gabbia-stretta">
          <Reveal className="passo">
            <Occhiello>Non è una nostra gentilezza</Occhiello>
            <h2 className="mt-[var(--s-13)] text-[length:var(--display-2)]" style={{ maxWidth: '24ch' }}>
              Poter portare via i dati è un tuo <span className="accento-corsivo">dovere</span>, non
              una nostra concessione
            </h2>
            <div
              className="mt-[var(--s-21)] space-y-[var(--s-13)] text-[1.0625rem]"
              style={{ color: 'var(--fg-muted)', maxWidth: 'var(--measure)' }}
            >
              <p>
                Gli indirizzi applicativi allegati all’art. 78 del codice di deontologia medica
                chiedono al medico di usare sistemi affidabili e di{' '}
                <strong style={{ color: 'var(--fg)' }}>
                  privilegiare i servizi che consentano la creazione di un formato indipendente
                  rispetto alla piattaforma
                </strong>
                , senza che sia impedito il riuso dell’informazione, assicurandone disponibilità,
                riservatezza e modalità di conservazione.
              </p>
              <p>
                Detto altrimenti: scegliere un gestionale da cui non si esce non è soltanto un
                rischio commerciale, è un problema deontologico tuo. La stessa cosa la chiedono
                l’art. 20 del GDPR sulla portabilità e la prescrizione 2.6 dell’Allegato II del
                regolamento europeo.
              </p>
              <p>
                Per questo l’esportazione qui è una funzione, non una pratica da aprire: FHIR R4,
                integrale, quando vuoi, senza passare da noi. È anche il motivo per cui non ci
                conviene trattenerti con un formato chiuso, e preferiamo dirlo prima che dopo.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── I documenti ─────────────────────────────────────────────────── */}
      <section className="fascia" style={{ background: 'var(--bg-sunk)' }}>
        <div className="gabbia gabbia-stretta">
          <Reveal className="passo">
            <Occhiello>Da girare al consulente</Occhiello>
            <h2 className="mt-[var(--s-13)] text-[length:var(--display-2)]" style={{ maxWidth: '20ch' }}>
              Tutto pubblico, senza un modulo da compilare
            </h2>
            <p className="mt-[var(--s-21)] text-[1.0625rem]" style={{ color: 'var(--fg-muted)', maxWidth: 'var(--measure)' }}>
              Un fornitore che nasconde il contratto dietro un modulo di richiesta ti sta già
              dicendo qualcosa. Questi si leggono adesso, anche prima di parlarci.
            </p>
            <ul className="mt-[var(--s-34)]">
              {[
                {
                  href: '/dpa',
                  t: 'Accordo sul trattamento dei dati',
                  d: 'L’art. 28 fra te, titolare, e noi, responsabili.',
                },
                {
                  href: '/sub-responsabili',
                  t: 'Sub-responsabili',
                  d: 'Chi tocca i dati oltre a noi, con sede, servizio e base giuridica.',
                },
                {
                  href: '/sicurezza',
                  t: 'Misure di sicurezza',
                  d: 'La scheda ex art. 32, compresi i limiti dichiarati.',
                },
                {
                  href: '/sicurezza-e-dati',
                  t: 'Le otto domande',
                  d: 'Le risposte brevi, senza rassicurazioni generiche.',
                },
              ].map((d) => (
                <li key={d.href} style={{ borderTop: '1px solid var(--rule)' }}>
                  <Link href={d.href} className="block py-[var(--s-13)] group">
                    <span className="flex items-baseline justify-between gap-[var(--s-13)]">
                      <span className="text-[1.0625rem]" style={{ fontFamily: 'var(--font-display)' }}>
                        {d.t}
                      </span>
                      <span style={{ color: 'var(--accent)' }}>
                        <Freccia />
                      </span>
                    </span>
                    <span className="mt-[2px] block text-[13px]" style={{ color: 'var(--fg-muted)' }}>
                      {d.d}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>
    </Pagina>
  )
}
