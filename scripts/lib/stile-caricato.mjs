/**
 * Il foglio di stile è arrivato davvero?
 *
 * ⚠️ PERCHÉ ESISTE, E PERCHÉ VALE PIÙ DEL CONTROLLO CHE PROTEGGE.
 * L'11 agosto ho misurato l'altezza di tutte le tappe del sito e ho letto
 * «5744px, il 710% della schermata». Il numero era vero e la conclusione
 * sbagliata: il build ha `basePath: /fibonacci-website` (GitHub Pages), `out/`
 * era servito alla radice, il CSS dava **404**, e stavo misurando la pagina
 * nuda. Ogni riga di quella tabella era rumore.
 *
 * ⛔ Il difetto non è «ho sbagliato comando»: è che una pagina senza CSS
 * **risponde 200, ha tutto il testo, e si misura benissimo**. Non c'è niente,
 * nel risultato, che dica che è nuda — anzi, i numeri sembrano più interessanti
 * (tutto è troppo alto). Un controllo che gira su una pagina senza stile non
 * fallisce: dà risposte precise a una domanda diversa.
 *
 * Quindi ogni script che misura il RESO deve chiamare questa funzione subito
 * dopo la prima `goto`, e fermarsi se il foglio non c'è.
 */

/** Lancia se la pagina è senza stile. `dove` compare nel messaggio. */
export async function esigiStile(page, dove = '') {
  const esito = await page.evaluate(() => {
    const fogli = [...document.styleSheets]
    let regole = 0
    for (const f of fogli) {
      try {
        regole += f.cssRules.length
      } catch {
        /* foglio da un'altra origine: non lo si può contare, ma esiste */
        regole += 1
      }
    }
    return {
      regole,
      link: [...document.querySelectorAll('link[rel=stylesheet]')].map((l) => l.href),
      /* Una prova indipendente dal conteggio: il corpo del sito non è mai
         sul bianco puro dei valori predefiniti del browser. */
      fondo: getComputedStyle(document.body).backgroundColor,
    }
  })

  if (esito.regole > 0) return

  const url = page.url()
  throw new Error(
    `Pagina SENZA CSS${dove ? ` (${dove})` : ''}: ${url}\n` +
      `  fogli dichiarati: ${esito.link.join(', ') || '(nessuno)'}\n` +
      `  regole caricate:  ${esito.regole}   fondo: ${esito.fondo}\n` +
      '\n' +
      '  Causa quasi certa: il build ha `basePath: /fibonacci-website` e `out/`\n' +
      '  è servito alla radice, quindi `/fibonacci-website/_next/…` dà 404.\n' +
      '  Costruisci per il collaudo senza prefisso:\n' +
      '\n' +
      '    NEXT_PUBLIC_DOMINIO_SITO=collaudo.local npm run build\n' +
      '\n' +
      '  ⛔ Non aggirare misurando lo stesso: senza stile i numeri sono precisi\n' +
      '     e privi di significato.',
  )
}
