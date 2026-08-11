/**
 * Porta nel sito due piccoli vocabolari del prodotto:
 *   · le DURATE per categoria, con la frase di consenso da cui vengono;
 *   · le SEZIONI della cartella, con i tab che ci finiscono dentro.
 *
 * ⚖️ PERCHÉ INSIEME e non due script. Sono due tabelle di poche righe che
 * vivono nello stesso posto (`EMR/apps/web/src/lib/`) e cambiano per le stesse
 * ragioni: un nuovo modulo del prodotto tocca entrambe. Due script separati
 * sarebbero due cose da ricordare invece di una.
 *
 * 🔒 Presidio: `scripts/parita-prodotto.mjs`.
 *
 * USO:  node scripts/prodotto.mjs
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const QUI = dirname(fileURLToPath(import.meta.url))
const LIB = join(QUI, '../../EMR/apps/web/src/lib')
const USCITA = join(QUI, '..', 'src/lib/prodotto.json')

if (!existsSync(LIB)) {
  console.log(`Sorgente assente (${LIB}): il sottomodulo EMR non è in questo clone.`)
  process.exit(0)
}

/* ── Le durate ─────────────────────────────────────────────────────────────
 * ⚠️ Si porta anche `fonte`, ed è la parte che conta: è la frase ESATTA del
 * consenso da cui escono i due numeri. Senza, «4-6 mesi» sarebbe un numero
 * come un altro; con, è una cosa verificabile. Il prodotto la mostra per lo
 * stesso motivo. */
const durateSrc = readFileSync(join(LIB, 'durata-trattamento.ts'), 'utf8')
const blocco = durateSrc.slice(durateSrc.indexOf('export const DURATE'))
const durate = [...blocco.matchAll(
  /codice:\s*'([^']+)',[\s\S]*?nome:\s*'([^']+)',[\s\S]*?meseMin:\s*(\d+),[\s\S]*?meseMax:\s*(\d+),[\s\S]*?fonte:\s*\n?\s*['"]([^'"]+)['"]/g,
)].map((m) => ({
  codice: m[1],
  nome: m[2],
  meseMin: Number(m[3]),
  meseMax: Number(m[4]),
  fonte: m[5],
}))

/* ── Le sezioni della cartella ──────────────────────────────────────────── */
const sezSrc = readFileSync(join(LIB, 'sezioni-cartella.ts'), 'utf8')
const titoli = Object.fromEntries(
  [...sezSrc.slice(sezSrc.indexOf('const TITOLI')).matchAll(/(\w+):\s*'([^']+)'/g)].map((m) => [m[1], m[2]]),
)
const dentro = {}
for (const m of sezSrc.slice(sezSrc.indexOf('const SEZIONE_DI')).matchAll(/^\s{2}(\w+):\s*'(\w+)',/gm)) {
  ;(dentro[m[2]] ??= []).push(m[1])
}
const ordine = (sezSrc.match(/const ORDINE:[^=]*=\s*\[([^\]]+)\]/)?.[1] ?? '')
  .split(',')
  .map((s) => s.trim().replace(/'/g, ''))
  .filter(Boolean)

const sezioni = ordine
  .filter((id) => titoli[id] && dentro[id]?.length)
  .map((id) => ({ id, titolo: titoli[id], dentro: dentro[id] }))

/* ── Esiti e complicanze ────────────────────────────────────────────────────
 * ⚠️ L'elenco è **chiuso** nel prodotto, e il commento del modulo dice perché:
 * «proprio perché nessuno lo inferisca: si sceglie». Portarlo qui aperto o
 * abbreviato tradirebbe la cosa che lo rende difendibile. Si prendono tutti e
 * tre gli assi — complicanza, gravità, esito — perché è la terna che compone
 * l'`AdverseEvent`, e mostrarne due su tre darebbe l'idea di un campo libero. */
const compSrc = readFileSync(join(LIB, 'complicanze.ts'), 'utf8')
const listaDa = (nome) => {
  const i = compSrc.indexOf(`export const ${nome}`)
  if (i < 0) return []
  const blocco = compSrc.slice(i, compSrc.indexOf('] as const', i))
  return [...blocco.matchAll(/codice:\s*'([^']+)',\s*etichetta:\s*'([^']+)'/g)].map((m) => ({
    codice: m[1],
    etichetta: m[2],
  }))
}
const complicanze = listaDa('COMPLICANZE')
const gravita = listaDa('GRAVITA')
const esiti = listaDa('ESITI')

if (!durate.length || !sezioni.length || !complicanze.length || !gravita.length || !esiti.length) {
  console.error(
    `✗ lettura fallita (durate ${durate.length}, sezioni ${sezioni.length}, ` +
      `complicanze ${complicanze.length}, gravità ${gravita.length}, esiti ${esiti.length}): i sorgenti sono cambiati`,
  )
  process.exit(1)
}

writeFileSync(
  USCITA,
  JSON.stringify(
    { generato: 'node scripts/prodotto.mjs', durate, sezioni, complicanze, gravita, esiti },
    null,
    1,
  ) + '\n',
  'utf8',
)
console.log(
  `prodotto: ${durate.length} durate (con la frase di consenso) · ` +
    `${sezioni.length} sezioni della cartella, ${sezioni.reduce((n, s) => n + s.dentro.length, 0)} tab · ` +
    `${complicanze.length} complicanze, ${gravita.length} gravità, ${esiti.length} esiti → src/lib/prodotto.json`,
)
