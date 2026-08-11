import Link from 'next/link'
import { Reveal } from '@/components/ui/Reveal'
import { Occhiello, Freccia } from '@/components/ui/elementi'
import { Assistente } from '@/components/Assistente'

/**
 * L'assistente sulla home, come tappa a sé.
 *
 * ── PERCHÉ QUI E NON ALTROVE NELLA PAGINA ──────────────────────────────────
 * Sta **subito dopo `Obiezioni`** e **prima di `Chiusura`**, e la posizione è
 * l'unica cosa che rende utile un widget del genere:
 *
 *  · `Obiezioni` si intitola «Le domande scomode — quelle che faresti tu», cioè
 *    è l'elenco delle domande che **abbiamo previsto noi**. Il posto naturale
 *    per la propria è subito dopo aver letto le altrui;
 *  · `Chiusura` chiede mezz'ora di demo. Chi ha ancora un dubbio non prenota:
 *    se ne va. Una risposta prima del modulo è ciò che separa i due esiti.
 *
 * ⛔ **Non è in cima e non è un riquadro che segue lo scorrimento.** Una
 * finestrella che insegue chi legge è la forma standard di questi strumenti ed
 * è anche il motivo per cui vengono chiusi senza guardarli: interrompe. Qui è
 * una tappa come le altre — chi non gli serve la scorre in un secondo.
 *
 * ⚠️ **L'introduzione non spiega come funziona**: lo dice gia' la riga d'aiuto
 * dentro il widget, due righe piu' sotto. Scritto in entrambi i posti erano due
 * frasi quasi identiche di fila — la seconda faceva sembrare la prima un errore.
 * Qui resta solo cio' che il widget NON dice: che se non sa, lo dice.
 *
 * ⚠️ Il widget porta `data-fuori-corpus`: le sue etichette **non entrano** nella
 * conoscenza dell'assistente. Senza, comparendo su due pagine si sarebbe letto
 * addosso il doppio. Vedi `Assistente.tsx` e `scripts/corpus-assistente.mjs`.
 */
export function Chiedi() {
  return (
    <section id="chiedi" className="fascia" style={{ background: 'var(--bg-sunk)' }}>
      <div className="gabbia gabbia-stretta text-center">
        <Reveal>
          <div>
            <Occhiello>La tua domanda</Occhiello>
            <h2
              className="mt-[var(--s-21)] text-[length:var(--display-2)]"
              style={{ maxWidth: '18ch', marginInline: 'auto' }}
            >
              Quella che non abbiamo previsto
            </h2>
            <p
              className="mt-[var(--s-21)] text-[1.0625rem]"
              style={{ color: 'var(--fg-muted)', maxWidth: '52ch', marginInline: 'auto' }}
            >
              Se la risposta non c&apos;è in queste pagine, lo dice invece di inventarla.
            </p>
          </div>
        </Reveal>

        <div className="mt-[var(--s-34)]">
          <Assistente />
        </div>

        <p className="mt-[var(--s-34)]">
          <Link href="/domande" className="link-avanti">
            Oppure leggi le domande frequenti
            <Freccia />
          </Link>
        </p>
      </div>
    </section>
  )
}
