/**
 * Scoperta via **Browser API** di Bright Data — la via che ⛔ non richiede il
 * Bearer token dell'account.
 *
 * 🔑 **Perché esiste accanto a `scoperta-brightdata.py`.** Quello parla con
 * `api.brightdata.com/request` (la SERP API), che vuole la **chiave
 * dell'account**; qui bastano le credenziali della **zona**, che sono quelle
 * che abbiamo. ⚠️ Costa di più — la SERP API si paga a richiesta (~$0,00128),
 * il browser **a GB** — e per questo qui si **bloccano immagini, font e
 * media**: su una pagina di risultati sono la maggior parte dei byte e ⛔ non
 * servono a niente, visto che di quella pagina leggiamo **solo i link**.
 *
 * 🔴 **Il tetto è in RICERCHE, ⛔ non in dollari, e ⛔ non è una scelta di
 * stile.** Il contatore vero (`/zone/cost`) vuole lo stesso Bearer che ⛔ non
 * abbiamo ⇒ da qui la spesa ⛔ **non è leggibile**. Fingere un tetto in dollari
 * calcolato da una stima di byte sarebbe **un numero inventato con l'aria di
 * una misura**. ⇒ si contano le ricerche, e la spesa si guarda sul cruscotto.
 *
 * ⚠️ **Stato separato** (`stato-scoperta-bd.json`), come la corsa a pagamento
 * precedente: due processi che scrivono lo stesso JSON lo corrompono, e il
 * danno si vede solo quando ⛔ non si rilegge più. La fusione la fa già
 * `leggi_dallo_stato()` in `raccolta-cliniche.py`, **in memoria**.
 *
 * Uso:
 *   set -a && . ./.env.brightdata && set +a
 *   node scripts/scoperta-browser.mjs [--tetto=8000] [--paralleli=3]
 */
import { chromium } from 'playwright-core';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const QUI = path.dirname(fileURLToPath(import.meta.url));
const STATO = path.join(QUI, 'stato-scoperta-bd.json');
const STATO_GRATIS = path.join(QUI, 'stato-scoperta.json');
const WSS = process.env.BD_WSS;
if (!WSS) throw new Error('⛔ manca BD_WSS: carica .env.brightdata');

const arg = process.argv.slice(2);
const num = (n, d) => { const m = arg.find(a => a.startsWith(`--${n}=`)); return m ? +m.split('=')[1] : d; };
const TETTO = num('tetto', 8000);
const PARALLELI = num('paralleli', 3);
// 🔑 Finestra di resa **per località**, identica alla scoperta gratuita: una
// città si chiude quando le ultime 8 ricerche rendono in media meno di 1
// dominio nuovo. ⛔ Non è un numero scelto qui: è quello già misurato.
const FINESTRA = 8, SOGLIA = 1.0;

const leggiJson = (p, d) => { try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return d; } };

// 🔑 **I modelli e la lista di esclusione si CHIEDONO a Python, ⛔ non si
// rileggono col regex e ⛔ non si copiano qui.** Due elenchi paralleli
// divergono al primo che qualcuno aggiorna e ⛔ nessuno se ne accorge; e il
// regex si era già rotto su `ESCLUSI`, che ⛔ non è una lista letterale ma il
// **risultato di una funzione** (`domini_esclusi()`, che legge anche il
// registro delle opposizioni). ⇒ importare il modulo vero è l'unica lettura
// che ⛔ non può divergere né scadere.
const daPython = JSON.parse(execFileSync('python3', ['-c', `
import importlib.util, json, os
s = importlib.util.spec_from_file_location('r', os.path.join(${JSON.stringify(QUI)}, 'raccolta-cliniche.py'))
r = importlib.util.module_from_spec(s); s.loader.exec_module(r)
print(json.dumps({
    "modelli": r.MODELLI + r.MODELLI_PROFESSIONISTI + r.MODELLI_TRATTAMENTO + r.MODELLI_PROFONDI,
    "modelli_comune": r.MODELLI_COMUNE,
    "esclusi": sorted(r.ESCLUSI),
}))`], { encoding: 'utf8', maxBuffer: 8 << 20 }));
const MODELLI = daPython.modelli;
const ESCLUSI = new Set(daPython.esclusi.map(s => s.toLowerCase()));

const province = leggiJson(path.join(QUI, 'province.json'), []);
const comuni = leggiJson(path.join(QUI, 'comuni.json'), []);
const gratis = leggiJson(STATO_GRATIS, { fatte: [], domini: {} });
const st = leggiJson(STATO, { fatte: [], domini: {}, scartati: {}, chiuse: [], resa: {} });
for (const k of ['fatte', 'domini', 'scartati', 'chiuse', 'resa']) st[k] ??= (k === 'fatte' || k === 'chiuse' ? [] : {});

const fatte = new Set([...st.fatte, ...gratis.fatte]);
const chiuse = new Set(st.chiuse);
// ⚠️ I domini già noti vengono da **entrambe** le corse: contarli come nuovi
// gonfierebbe la resa e terrebbe aperte località in realtà esaurite.
const noti = new Set([...Object.keys(st.domini), ...Object.keys(gratis.domini || {})]);

// 🔑 **Le località in coda per prime.** La corsa gratuita è partita dalla testa
// e si è fermata a ~3/4: partire dalla coda fa incontrare i due lavori nel
// mezzo invece di ripetere lo stesso tratto.
const bersagli = [...province.map(([c, s]) => [c, s]), ...comuni.map(c => [c, c])].reverse();
const lavoro = [];
for (const [citta, sigla] of bersagli)
  for (const m of MODELLI)
    if (!fatte.has(`${sigla}|${m}`)) lavoro.push([citta, sigla, m]);

console.log(`━━━ Browser API · ${MODELLI.length} modelli · ${bersagli.length} località · ` +
            `${lavoro.length} ricerche possibili · tetto ${TETTO} · ${PARALLELI} in parallelo ━━━`);
console.log(`    ${fatte.size} già fatte (gratis+BD) · ${noti.size} domini già noti · ` +
            `${chiuse.size} località già chiuse qui`);

const host_di = (u) => { try { return new URL(u).hostname.replace(/^www\./, '').toLowerCase(); } catch { return ''; } };
const daEscludere = (h) => !h || ESCLUSI.has(h) || [...ESCLUSI].some(e => h === e || h.endsWith('.' + e));

let fatteOra = 0, nuoviTot = 0, errori = 0, salvaOgni = 0;
const salva = () => fs.writeFileSync(STATO, JSON.stringify(st, null, 1));

/** ⚠️ **Un guasto dell'account ⛔ non è un errore di rete, e ⛔ non va ritentato.**
 * Il 2026-08-15 la corsa è morta dopo 82 ricerche con *«Account is suspended»*
 * sepolto in uno **stack trace di WebSocket**: illeggibile, e indistinguibile
 * da un timeout qualsiasi. ⇒ si riconosce e si esce **dicendo cosa fare**,
 * perché ⛔ nessuna riconnessione lo risolve — il rimedio è **fuori dal codice**. */
function fermaSeAccountGuasto(e) {
  const m = String(e && e.message || e);
  for (const segno of ['Account is suspended', 'suspended', 'Forbidden', 'auth failed',
                       'Invalid credentials', 'unauthorized']) {
    if (m.toLowerCase().includes(segno.toLowerCase())) {
      console.error(`\n⛔ FERMO — Bright Data rifiuta la connessione: «${segno}».\n` +
                    `   ⛔ Non è un guasto di rete e ritentare ⛔ non serve.\n` +
                    `   Guarda il cruscotto Bright Data: credito, stato dell'account, zona.\n` +
                    `   ✅ Lo stato è salvato: al prossimo avvio riprende da dove si è fermato.`);
      salva();
      process.exit(2);
    }
  }
}

async function nuovoBrowser() {
  const b = await chromium.connectOverCDP(WSS, { timeout: 90000 }).catch(e => {
    fermaSeAccountGuasto(e); throw e;
  });
  const ctx = await b.newContext();
  // ⛔ Immagini, font e media **non si scaricano**: si paga a GB e di questa
  // pagina servono **solo i link**. È la sola leva sul costo che abbiamo qui.
  // 🔴 **⛔ I FOGLI DI STILE NO, e ⛔ non è prudenza: è misurato.** Bloccandoli
  // anche loro, la prima corsa vera ha dato **3 timeout su 16 tentativi** e
  // 2m19s per 13 ricerche — contro i **4,8 s** a ricerca del test senza blocco.
  // Abortire i CSS impedisce a `domcontentloaded` di arrivare come previsto, e
  // ogni timeout brucia **60 secondi** più una riconnessione. ⇒ risparmiare
  // quei byte costava **dieci volte** quello che faceva risparmiare.
  await ctx.route('**/*', (route) => {
    const t = route.request().resourceType();
    return (t === 'image' || t === 'font' || t === 'media') ? route.abort() : route.continue();
  });
  return { b, ctx };
}

const linkNellaPagina = () => {
  const out = new Set();
  for (const a of document.querySelectorAll('a[href]')) {
    let h = a.getAttribute('href') || '';
    if (h.startsWith('/url?')) h = new URLSearchParams(h.slice(5)).get('q') || '';
    if (h.startsWith('http')) out.add(h);
  }
  return [...out];
};

/**
 * 🔴 **`domcontentloaded` era la causa del 40% di timeout, ⛔ non il
 * parallelismo e ⛔ non le query.** Le due ipotesi precedenti sono state
 * **misurate e smentite**: riconnettere ogni 8 navigazioni invece di 40 ⛔ non
 * ha cambiato niente (40%), e con **un solo** lavoratore il tasso è rimasto
 * **identico** (40%) — se fosse stata contesa di sessioni sarebbe crollato.
 * ⇒ la diagnosi vera è venuta **guardando la pagina** invece di cambiare
 * manopole: con `waitUntil:'commit'` la stessa ricerca che andava in timeout a
 * 30 s **arriva in 1,7 s** con 87 link. Google tiene aperte richieste in
 * sottofondo che ⛔ non completano mai `domcontentloaded`, mentre **i risultati
 * sono già nel DOM**.
 * ⇒ si aspetta **ciò che serve** — che i link ci siano — ⛔ non un evento del
 * browser che ⛔ non riguarda i risultati.
 */
async function cerca(page, q) {
  const url = 'https://www.google.com/search?q=' + encodeURIComponent(q) + '&num=30&gl=it&hl=it';
  await page.goto(url, { waitUntil: 'commit', timeout: 25000 });
  // 🔴 **La soglia è 12, e ⛔ non 30: a 30 il ritmo crollava a 30 s a ricerca.**
  // Misurato mettendo il cronometro sulle fasi: su query **generiche** la
  // pagina ha 37-51 ancore e l'attesa dura ~1 s, ⛔ ma i modelli di questa
  // pipeline sono **specifici** («medicina estetica Conegliano biostimolazione
  // viso») e rendono pagine **magre**, sotto le 30 ancore ⇒ la condizione ⛔ non
  // si avverava **mai** e si pagavano i 15 s di timeout **per intero, ad ogni
  // ricerca**. ⚠️ La lezione: una soglia tarata sul caso facile diventa
  // **un'attesa fissa** sul caso vero, e ⛔ non dà errore — solo lentezza, che
  // ⛔ non si vede nei log.
  await page.waitForFunction(() => document.querySelectorAll('a[href]').length > 12,
                             { timeout: 6000 }).catch(() => {});
  return await page.evaluate(linkNellaPagina);
}

/** Un lavoratore consuma dalla coda condivisa finché c'è lavoro o tetto. */
async function lavoratore(id, coda) {
  let sess = await nuovoBrowser();
  let page = await sess.ctx.newPage();
  let daRiconnettere = 0;
  while (coda.length && fatteOra < TETTO) {
    const [citta, sigla, modello] = coda.shift();
    if (chiuse.has(sigla)) continue;
    const q = modello.replace('{c}', citta);
    // ⚠️ **Un ritentativo, ⛔ non zero.** Una ricerca abbandonata al primo
    // errore ⛔ non è persa per sempre (⛔ non entra in `fatte`), ⛔ ma il giro
    // successivo la ripaga per intero: ritentare subito, su sessione fresca,
    // costa **una riconnessione** invece di un'altra pagina intera.
    let url = null;
    for (let tentativo = 1; tentativo <= 2 && url === null; tentativo++) {
      try {
        url = await cerca(page, q);
      } catch (e) {
        // ⚠️ Una sessione che ha sbagliato ⛔ non si riusa: si ricrea. Insistere
        // sulla stessa pagina fa cadere tutte le ricerche successive.
        try { await sess.b.close(); } catch {}
        sess = await nuovoBrowser(); page = await sess.ctx.newPage();
        daRiconnettere = 0;
        if (tentativo === 2) {
          errori++;
          console.log(`  ✗ [${id}] ${sigla} «${q.slice(0, 34)}» ${String(e.message).slice(0, 40)}`);
        }
      }
    }
    if (url === null) continue;
    let nuovi = 0;
    for (const u of url) {
      const h = host_di(u);
      if (!h || h.includes('google.') || h.includes('gstatic')) continue;
      if (daEscludere(h)) st.scartati[h] = (st.scartati[h] || 0) + 1;
      else if (!noti.has(h)) { st.domini[h] = sigla; noti.add(h); nuovi++; }
    }
    st.fatte.push(`${sigla}|${modello}`);
    fatteOra++; nuoviTot += nuovi;
    const f = (st.resa[sigla] ??= []);
    f.push(nuovi);
    const chiusa = f.length >= FINESTRA &&
                   f.slice(-FINESTRA).reduce((a, b) => a + b, 0) / FINESTRA < SOGLIA;
    if (chiusa) { st.chiuse.push(sigla); chiuse.add(sigla); }
    if (++salvaOgni % 5 === 0 || nuovi || chiusa) salva();
    console.log(`  [${fatteOra}/${TETTO}] ${sigla} «${q.slice(0, 36)}» +${nuovi} → ` +
                `${Object.keys(st.domini).length} BD · ${noti.size} tot` +
                (chiusa ? ` · ⛔ ${sigla} esaurita dopo ${f.length}` : ''));
    // 🔑 **Si riconnette ogni 8 ricerche, e il numero è misurato ⛔ non scelto.**
    // Con 40 il log mostrava **8 timeout su 23** (35%) con un motivo leggibile:
    // dopo l'errore il lavoratore riconnetteva e **la ricerca successiva
    // riusciva sempre**. ⇒ ⛔ non è Google che ci blocca, è **la sessione che si
    // degrada** dopo poche navigazioni. Una riconnessione costa ~4 s, un
    // timeout ne costa 30 **e consuma banda a vuoto** — cioè denaro, visto che
    // qui si paga a GB.
    if (++daRiconnettere >= 8) {
      daRiconnettere = 0;
      try { await sess.b.close(); } catch {}
      sess = await nuovoBrowser(); page = await sess.ctx.newPage();
    }
  }
  try { await sess.b.close(); } catch {}
}

const coda = lavoro;
await Promise.all([...Array(PARALLELI)].map((_, i) => lavoratore(i + 1, coda)));
salva();
console.log(`\n═══ ${fatteOra} ricerche · +${nuoviTot} domini nuovi · ` +
            `${Object.keys(st.domini).length} nello stato BD · ${errori} errori ═══`);
console.log('    ⚠️ la spesa reale si legge sul cruscotto Bright Data: da qui ⛔ non è leggibile.');
