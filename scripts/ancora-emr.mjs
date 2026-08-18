/**
 * UNA sola definizione di «qual è l'ultimo commit che può aver cambiato una
 * schermata».
 *
 * ⚠️ PERCHÉ ESISTE COME MODULO A SÉ, e non come funzione copiata due volte.
 * Questa regola vive in due posti che devono essere d'accordo: `schermate.mjs`
 * la **scrive** nel manifesto, `collaudo.mjs` la **ricalcola** per dire se le
 * immagini sono invecchiate. Finché erano due copie, si sono scostate — ed è
 * successo davvero, due volte:
 *
 *   1. il generatore registrava `HEAD`: quattro commit sul `pdf-signer` e il
 *      collaudo diventava rosso su schermate identiche;
 *   2. il 2026-08-10 il collaudo ha escluso i file di test (un `.test.ts` non
 *      può cambiare un'immagine) e il generatore no ⇒ i due valori non
 *      potevano più coincidere, e il presidio è rimasto rosso **a immagini
 *      appena rigenerate**.
 *
 * Il secondo caso è la forma esatta del difetto che questo progetto insegue da
 * giorni: *due copie di una regola divergono, e la seconda diverge in
 * silenzio*. Un presidio in due metà non è un presidio: è due presidi che
 * prima o poi si contraddicono.
 */

import { execFileSync } from 'node:child_process'
import { existsSync } from 'node:fs'

/** I percorsi che possono cambiare come APPARE l'applicazione.
 *  ⛔ I test sono esclusi: non disegnano niente. */
export const PERCORSI_CHE_CAMBIANO_LA_RESA = [
  'apps/web/src',
  ':(exclude)apps/web/src/**/*.test.ts',
  ':(exclude)apps/web/src/**/*.test.tsx',
]

/** L'ultimo commit dell'EMR che ha toccato la resa. `null` se il repo non c'è. */
export function commitFrontendEmr(candidati) {
  // ⚠️ **Un candidato ESPLICITO batte quelli indovinati** (2026-08-18).
  // 🔴 Il difetto: il primo candidato è `../EMR`, cioè l'albero **condiviso**,
  // che sta sul ramo di chi ci ha lavorato per ultimo. Chi rigenera le
  // schermate da un `git worktree` su `origin/main` — l'unico modo corretto,
  // perché l'albero condiviso ha il lavoro in corso di altri — si vedeva
  // timbrare il manifesto col commit **di un altro ramo**: un manifesto che
  // dichiara una provenienza che le immagini ⛔ non hanno.
  // ⇒ se qualcuno ha detto da dove costruisce, gli si crede.
  const espliciti = candidati.filter((d) => d === process.env.EMR_REPO && d)
  for (const dir of [...espliciti, ...candidati.filter((d) => !espliciti.includes(d))]) {
    if (!dir || !existsSync(dir)) continue
    try {
      return execFileSync(
        'git',
        ['-C', dir, 'log', '-1', '--format=%H', '--', ...PERCORSI_CHE_CAMBIANO_LA_RESA],
        { encoding: 'utf8' },
      ).trim()
    } catch {
      /* non è un repo: si tira avanti senza */
    }
  }
  return null
}
