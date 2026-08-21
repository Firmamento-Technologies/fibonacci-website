#!/usr/bin/env node
/**
 * L'assistente del sito deve DIRE di essere un'intelligenza artificiale.
 *
 * 🔴 Perché esiste (TD-296, 2026-08-21). Il testo attorno al riquadro descriveva
 * il comportamento — «Risponde leggendo solo le pagine di questo sito» — ma non
 * dichiarava mai che è un sistema di IA: «intelligenza artificiale», «IA», «AI»,
 * «modello linguistico», «bot» erano tutte assenti, in tutte e cinque le lingue.
 * E il servizio è acceso e pubblico, quindi non era un rischio futuro.
 *
 * ⚖️ AI Act art. 50(1): chi interagisce con un sistema di IA va informato, salvo
 * che sia ovvio per una persona ragionevolmente informata e attenta. Se un
 * riquadro di domande su un sito sia «ovvio» è una valutazione, non un fatto:
 * la riga costa nulla, l'incertezza no.
 *
 * ⚠️ Si cerca la LOCUZIONE INTERA e non la sigla. Cercare «IA» dentro il testo
 * italiano trova «sia», «via», «chiaria»: è già successo in questo progetto, e
 * un presidio che grida per niente viene spento.
 */
import { readFileSync } from 'node:fs'

const CHIAVI = [
  'assistente.risponde_leggendo_solo_le_pagine_di',
  'assistentefisso.rispondo_solo_da_queste_pagine_e',
]

const LOCUZIONI = {
  it: ['intelligenza artificiale'],
  en: ['artificial intelligence'],
  de: ['künstlicher intelligenz', 'künstliche intelligenz'],
  fr: ['intelligence artificielle'],
  es: ['inteligencia artificial'],
}

const mancanti = []
let controllate = 0

for (const [lingua, locuzioni] of Object.entries(LOCUZIONI)) {
  const percorso = `src/i18n/sito/${lingua}.json`
  const dati = JSON.parse(readFileSync(percorso, 'utf8'))
  for (const chiave of CHIAVI) {
    const testo = dati[chiave]
    if (typeof testo !== 'string') {
      mancanti.push(`${percorso}: la chiave \`${chiave}\` non c'è`)
      continue
    }
    controllate += 1
    const basso = testo.toLowerCase()
    if (!locuzioni.some((l) => basso.includes(l))) {
      mancanti.push(`${percorso} → ${chiave}\n      «${testo}»`)
    }
  }
}

// Rete contro il presidio vuoto: se domani le chiavi cambiano nome, questo
// controllo passerebbe **senza aver guardato niente**, che è il modo classico
// in cui un cancello diventa decorativo.
const ATTESE = Object.keys(LOCUZIONI).length * CHIAVI.length
if (controllate !== ATTESE) {
  console.error(`⛔ ho controllato ${controllate} testi invece di ${ATTESE}: le chiavi sono cambiate?`)
  process.exit(1)
}

if (mancanti.length) {
  console.error("⛔ L'assistente non dichiara di essere un'intelligenza artificiale (AI Act art. 50):\n")
  for (const m of mancanti) console.error(`   · ${m}`)
  console.error('\n   Aggiungere la dichiarazione in testa al testo, in ogni lingua.')
  process.exit(1)
}

console.log(`✅ l'assistente si dichiara IA in ${Object.keys(LOCUZIONI).length} lingue (${controllate} testi)`)
