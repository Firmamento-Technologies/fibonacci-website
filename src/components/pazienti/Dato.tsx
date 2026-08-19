/**
 * Un valore che è **del medico**, non nostro: nome dello studio, indirizzo,
 * titolo, numero d'albo, nomi delle prestazioni.
 *
 * ── 🔴 PERCHÉ ESISTE (2026-08-19) ───────────────────────────────────────────
 * Il presidio della traduzione (`scripts/lingue-tradotte.mjs`) conta quante
 * frasi italiane del dizionario compaiono ancora nelle pagine tradotte. È il
 * controllo giusto, ⛔ ma **non sa distinguere il testo dell'interfaccia dal
 * dato**: quando il canale pazienti ha cominciato a pubblicare studi veri, la
 * pagina inglese di uno studio di Milano conteneva «Tossina botulinica» e
 * «Medico chirurgo» — che sono ciò che il medico ha scritto di sé — e il
 * presidio le ha contate come traduzioni mancanti. Misurato: da ≤8 residui a
 * **15-20**, con il rilascio bloccato.
 *
 * 🔑 Tradurre quei valori sarebbe **sbagliato**, non difficile: è il medico che
 * dichiara che cosa fa, e riscriverglielo in un'altra lingua vuol dire
 * pubblicare una prestazione che non ha dichiarato. ⇒ il dato resta com'è, e
 * qui lo si **marca** perché il presidio lo salti.
 *
 * ⛔ Non è un modo per far tacere il controllo: quello che resta fuori dai
 * marcatori — etichette, titoli di sezione, frasi nostre — continua a essere
 * misurato, ed è stato provato rimettendo un difetto e pretendendo il rosso.
 * ⚠️ Marcare testo NOSTRO con questo componente è l'unico modo di romperlo: se
 * un giorno una frase dell'interfaccia sparisce dal conteggio, cercala qui.
 */
export function Dato({ children }: { children: React.ReactNode }) {
  return <span data-dato="">{children}</span>
}
