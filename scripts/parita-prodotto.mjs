/**
 * Durate e sezioni della cartella: la copia nel sito contro l'applicazione.
 *
 * ⚠️ Le durate hanno un rischio particolare, diverso da quello dei cataloghi.
 * Non sono un elenco: sono **numeri clinici** — «ripetibile ogni 4-6 mesi» — e
 * il sito li mostra insieme alla frase di consenso da cui vengono. Se il
 * prodotto corregge un intervallo e la vetrina no, il sito continua a citare la
 * fonte giusta accanto al numero sbagliato: la prova a sostegno resta lì, e
 * rende la bugia più credibile. Per questo si confrontano **numeri e frase**.
 *
 * Si esegue anche da solo:  node scripts/parita-prodotto.mjs
 */
import { readFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const QUI = dirname(fileURLToPath(import.meta.url))

export function paritaProdotto(problemi, avvisa = console.log) {
  const copiaPath = join(QUI, '..', 'src/lib/prodotto.json')
  if (!existsSync(copiaPath)) {
    problemi.push('prodotto: manca `src/lib/prodotto.json` — esegui `node scripts/prodotto.mjs`')
    return
  }
  const copia = JSON.parse(readFileSync(copiaPath, 'utf8'))
  if (!copia.durate?.length || !copia.sezioni?.length) {
    problemi.push('prodotto: la copia nel sito è vuota — il confronto NON è stato fatto')
    return
  }

  const LIB = join(QUI, '../../EMR/apps/web/src/lib')
  if (!existsSync(LIB)) {
    avvisa(`Durate e sezioni: non verificate contro l’EMR (il sottomodulo non è in questo clone). ${copia.durate.length} durate, ${copia.sezioni.length} sezioni nella copia.`)
    return
  }

  // ── Le durate: codice, estremi E la frase di consenso ────────────────────
  const src = readFileSync(join(LIB, 'durata-trattamento.ts'), 'utf8')
  const blocco = src.slice(src.indexOf('export const DURATE'))
  const vere = [...blocco.matchAll(
    /codice:\s*'([^']+)',[\s\S]*?meseMin:\s*(\d+),[\s\S]*?meseMax:\s*(\d+),[\s\S]*?fonte:\s*\n?\s*['"]([^'"]+)['"]/g,
  )].map((m) => ({ codice: m[1], min: Number(m[2]), max: Number(m[3]), fonte: m[4] }))

  // ⛔ Lettura fallita ≠ «tutto uguale».
  if (!vere.length) {
    problemi.push('prodotto: non riesco a leggere `DURATE` dall’EMR — il confronto NON è stato fatto')
    return
  }

  for (const v of vere) {
    const n = copia.durate.find((d) => d.codice === v.codice)
    if (!n) {
      problemi.push(`prodotto: la durata «${v.codice}» c'è nell'applicazione e non nel sito — rigenera`)
      continue
    }
    if (n.meseMin !== v.min || n.meseMax !== v.max) {
      problemi.push(
        `🔴 prodotto: la durata di «${v.codice}» diverge — applicazione ${v.min}-${v.max} mesi, ` +
          `sito ${n.meseMin}-${n.meseMax}. Il sito mostra il numero accanto alla frase di consenso: ` +
          `un numero sbagliato con la fonte giusta è peggio di nessun numero`,
      )
    }
    if (n.fonte !== v.fonte) {
      problemi.push(
        `prodotto: la frase di consenso di «${v.codice}» non è più quella dell'applicazione — rigenera`,
      )
    }
  }
  const inPiu = copia.durate.filter((d) => !vere.some((v) => v.codice === d.codice))
  if (inPiu.length) {
    problemi.push(
      `prodotto: il sito mostra ${inPiu.length} durate che l'applicazione non ha ` +
        `(${inPiu.map((d) => d.codice).join(', ')}) — sono numeri clinici inventati, rigenera`,
    )
  }

  /* ── Esiti e complicanze ─────────────────────────────────────────────────
   * ⚠️ Qui il rischio è di OMISSIONE, non di divergenza. L'elenco è chiuso nel
   * prodotto proprio perché nessuno inferisca una complicanza; se la vetrina ne
   * mostrasse dieci su dodici, chi guarda dedurrebbe un elenco più corto di
   * quello vero — e per un medico «la mia complicanza non c'è» è una ragione
   * per non comprare. Si confronta l'insieme INTERO, in ordine. */
  const compSrc = readFileSync(join(LIB, 'complicanze.ts'), 'utf8')
  const listaDa = (nome) => {
    const i = compSrc.indexOf(`export const ${nome}`)
    if (i < 0) return []
    const blocco = compSrc.slice(i, compSrc.indexOf('] as const', i))
    return [...blocco.matchAll(/codice:\s*'([^']+)',\s*etichetta:\s*'([^']+)'/g)].map(
      (m) => `${m[1]}=${m[2]}`,
    )
  }
  for (const [nome, chiave] of [['COMPLICANZE', 'complicanze'], ['GRAVITA', 'gravita'], ['ESITI', 'esiti']]) {
    const vere = listaDa(nome)
    if (!vere.length) {
      problemi.push(`prodotto: non riesco a leggere \`${nome}\` dall’EMR — il confronto NON è stato fatto`)
      continue
    }
    const nostre = (copia[chiave] ?? []).map((x) => `${x.codice}=${x.etichetta}`)
    if (vere.join('|') !== nostre.join('|')) {
      const manca = vere.filter((v) => !nostre.includes(v))
      const extra = nostre.filter((v) => !vere.includes(v))
      problemi.push(
        `prodotto: ${chiave} divergono — ` +
          (manca.length ? `mancano nel sito: ${manca.slice(0, 3).join(', ')}` : 'stesso insieme, ORDINE diverso') +
          (extra.length ? ` | in più nel sito: ${extra.slice(0, 3).join(', ')}` : '') +
          ' — rigenera con `node scripts/prodotto.mjs`',
      )
    }
  }

  // ── Le sezioni della cartella ────────────────────────────────────────────
  const sezSrc = readFileSync(join(LIB, 'sezioni-cartella.ts'), 'utf8')
  const veri = new Map()
  for (const m of sezSrc.slice(sezSrc.indexOf('const SEZIONE_DI')).matchAll(/^\s{2}(\w+):\s*'(\w+)',/gm)) {
    if (!veri.has(m[2])) veri.set(m[2], [])
    veri.get(m[2]).push(m[1])
  }
  if (!veri.size) {
    problemi.push('prodotto: non riesco a leggere `SEZIONE_DI` dall’EMR — il confronto NON è stato fatto')
    return
  }
  for (const s of copia.sezioni) {
    const attesi = veri.get(s.id)
    if (!attesi) {
      problemi.push(`prodotto: la sezione «${s.id}» non esiste più nell'applicazione — rigenera`)
      continue
    }
    if (attesi.join(',') !== s.dentro.join(',')) {
      problemi.push(
        `prodotto: la sezione «${s.titolo}» contiene cose diverse — applicazione [${attesi}], sito [${s.dentro}]`,
      )
    }
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const problemi = []
  paritaProdotto(problemi, (m) => console.log(`\x1b[33m${m}\x1b[0m`))
  if (problemi.length) {
    console.log(`\x1b[31m${problemi.length} problemi:\x1b[0m`)
    for (const p of problemi) console.log('  ' + p)
    process.exitCode = 1
  } else {
    console.log('\x1b[32mDurate e sezioni: la copia nel sito è identica a quella dell’applicazione.\x1b[0m')
  }
}
