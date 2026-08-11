/**
 * Ogni classe `prova-*__*` usata nei componenti deve esistere nel CSS.
 *
 * ⚠️ PERCHÉ ESISTE, e perché è nato da un difetto vero.
 * `ProvaComplicanze` usava `prova-catalogo__codice`, una classe che **non è mai
 * stata definita**. Una classe inesistente non dà nessun errore: né il
 * compilatore, né eslint, né il browser dicono niente. Il `<code>` restava
 * semplicemente senza stile — 17px su quattro righe invece di 11 su una — e a
 * occhio sembrava una scelta di design. Misurato il 2026-08-11, e trovato solo
 * perché stavo guardando quel riquadro.
 *
 * È la stessa forma dei difetti che questo progetto insegue: **qualcosa che
 * fallisce senza dirlo**. Qui il rimedio costa dieci righe.
 *
 * ⛔ Copre solo il prefisso `prova-` — i componenti nuovi scritti per il sito.
 * Il resto del CSS usa classi Tailwind e utility, dove questo controllo
 * produrrebbe rumore; e un presidio rumoroso viene spento.
 *
 * Si esegue anche da solo:  node scripts/classi-esistono.mjs
 */
import { readFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const QUI = dirname(fileURLToPath(import.meta.url))

export function classiEsistono(problemi) {
  const css = readFileSync(join(QUI, '..', 'src/app/globals.css'), 'utf8')
  const definite = new Set([...css.matchAll(/\.([a-z][a-z0-9_-]*__[a-z0-9_-]+)/g)].map((m) => m[1]))

  // ⛔ Zero classi definite = il regex non regge più, non «CSS senza classi».
  if (definite.size === 0) {
    problemi.push('classi: non trovo nessuna classe `__` in globals.css — il controllo NON è stato fatto')
    return
  }

  const dir = join(QUI, '..', 'src/components/home')
  for (const nome of readdirSync(dir).filter((f) => f.startsWith('Prova') && f.endsWith('.tsx'))) {
    const usate = new Set(
      [...readFileSync(join(dir, nome), 'utf8').matchAll(/\b(prova-[a-z]+__[a-z0-9_-]+)\b/g)].map((m) => m[1]),
    )
    const inventate = [...usate].filter((c) => !definite.has(c))
    if (inventate.length) {
      problemi.push(
        `classi: ${nome} usa ${inventate.length} classi che non esistono in globals.css ` +
          `(${inventate.join(', ')}) — non danno errore, restano semplicemente senza stile`,
      )
    }
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const problemi = []
  classiEsistono(problemi)
  if (problemi.length) {
    console.log(`\x1b[31m${problemi.length} problemi:\x1b[0m`)
    for (const p of problemi) console.log('  ' + p)
    process.exitCode = 1
  } else {
    console.log('\x1b[32mClassi: ogni `prova-*__*` usata nei componenti esiste nel CSS.\x1b[0m')
  }
}
