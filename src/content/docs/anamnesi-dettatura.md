# Compilare l'anamnesi con la dettatura AI

Questa guida descrive l'uso della dettatura vocale assistita da intelligenza artificiale per compilare l'anamnesi del paziente durante la visita, in tempo reale, senza interrompere il colloquio. Il motore di trascrizione e Voxtral, modello specializzato in italiano clinico, integrato in Fibonacci tramite Mistral AI.

La funzione si rivolge ai medici che vogliono ridurre il tempo dedicato alla digitazione delle anamnesi mantenendo qualita clinica e responsabilita di firma. Il flusso operativo prevede sempre una fase di revisione e accettazione esplicita prima del salvataggio in cartella.

## Prerequisiti

- Account con ruolo `medico` e accesso clinico al paziente.
- Microfono integrato o esterno funzionante. La qualita dell'estrazione cresce con un microfono da scrivania a condensatore o con auricolare con cancellazione del rumore.
- Browser supportato: Chrome, Edge o Safari in versione recente. Firefox non supporta ancora alcune API audio richieste.
- Permesso microfono concesso al dominio `app.fibonacci.it`.
- Sezione paziente gia aperta sulla scheda visita corrente.
- Connessione internet stabile; la dettatura usa streaming WebSocket verso il backend.

## Passo 1, apertura della dettatura

Dalla scheda paziente, apri `Anamnesi` e individua il pulsante `Dettatura` in alto a destra, identificato dall'icona del microfono.

Al primo utilizzo il browser chiede l'autorizzazione di accesso al microfono. Concedi il permesso e seleziona, se richiesto, il dispositivo di input preferito. La selezione viene memorizzata per le sessioni successive.

Se il pulsante `Dettatura` risulta disabilitato, verifica nell'angolo in basso a sinistra il messaggio di stato: `microfono non rilevato`, `permesso negato`, `browser non supportato` indicano le cause piu comuni.

## Passo 2, avvio della trascrizione

Premi `Avvia dettatura`. L'icona del microfono diventa rossa pulsante e appare un indicatore di livello audio che si muove con la voce.

Inizia a parlare a velocita naturale. Il sistema mostra il testo trascritto in due colori:

- **grigio** per le parole **partial**, ancora soggette a revisione automatica nei millisecondi successivi,
- **nero** per le parole **finali**, consolidate e non piu modificabili dal modello.

La latenza media tra parola pronunciata e parola visualizzata e compresa tra ottocento millisecondi e un secondo e mezzo, in funzione della connessione di rete.

## Passo 3, fine della dettatura

La dettatura si interrompe in due modi:

- automaticamente dopo **otto secondi** di silenzio continuo, valore configurabile in `Impostazioni > Dettatura` tra cinque e trenta secondi,
- manualmente cliccando `Ferma` o premendo la barra spaziatrice quando il cursore non e in un campo di testo.

Allo stop, il pannello mostra il testo grezzo trascritto completo. Il pulsante `Riprendi` permette di continuare la stessa sessione aggiungendo testo in coda al precedente.

## Passo 4, apply-to-form e confidence score

Il pulsante `Estrai campi` invia il testo grezzo al motore di **estrazione strutturata**. Il motore analizza la trascrizione e propone una compilazione dei campi anamnestici:

- **Allergie note**, sostanze identificate con livello di certezza,
- **Farmaci in uso**, principio attivo, dose, frequenza, via di somministrazione,
- **Patologie attive e pregresse**, codificate ove possibile su `ICD-10` o `SNOMED CT`,
- **Familiarita**, malattie rilevanti dei familiari di primo grado,
- **Stile di vita**, abitudini relative a fumo, alcol, attivita fisica,
- **Motivo del consulto**, sintesi del problema espresso dal paziente.

Ogni campo proposto e accompagnato da un **confidence score** numerico tra zero e cento, visualizzato con codice colore:

- **verde** sopra l'ottanta per cento, alta affidabilita,
- **giallo** tra cinquanta e ottanta per cento, da rivedere,
- **rosso** sotto il cinquanta per cento, da verificare con attenzione o respingere.

Lo score non sostituisce la valutazione clinica: e un indicatore tecnico che misura quanto il modello ritiene chiaro il riferimento nel testo.

## Passo 5, revisione e conferma

Il pannello di revisione mostra accanto a ogni campo proposto tre pulsanti:

- `Accetta`, il campo viene inserito nel modulo,
- `Modifica`, apre un campo di testo modificabile pre-compilato,
- `Scarta`, il campo proposto viene ignorato.

Al termine della revisione il pulsante `Salva anamnesi` consolida i campi accettati nella cartella clinica del paziente. Il salvataggio e tracciato in audit log con riferimento alla sessione di dettatura.

Il testo grezzo della dettatura puo essere conservato come allegato per riferimento futuro, oppure scartato. La scelta di conservare il grezzo si configura in `Impostazioni > Dettatura > Conservazione trascrizioni`.

## Compliance, responsabilita clinica e RF-5.4

Il requisito funzionale **RF-5.4** del software Fibonacci impone un principio non derogabile: il sistema non scrive nulla in cartella senza approvazione esplicita del medico. Ogni campo estratto e ogni testo grezzo proposto richiedono un'azione affermativa di `Accetta` o `Modifica e accetta` da parte dell'utente.

Questa scelta architetturale risponde alla normativa italiana sulla cartella clinica e al regolamento europeo MDR sui dispositivi medici basati su software. La responsabilita clinica della corretta compilazione resta in capo al medico firmatario.

## Privacy del flusso audio

L'audio acquisito dal microfono viene inviato in streaming al backend Fibonacci, che lo inoltra ai server Mistral AI in Unione Europea per la trascrizione. Una volta restituita la trascrizione, **l'audio non viene salvato** ne su Fibonacci ne su Mistral.

Mistral garantisce contrattualmente che gli audio inviati tramite API enterprise non vengono usati per addestrare modelli ne conservati oltre il tempo strettamente necessario all'elaborazione, tipicamente pochi secondi.

L'utente puo richiedere di non utilizzare la dettatura per una specifica visita: in quel caso si compila l'anamnesi manualmente. La scelta non lascia tracce di audio in alcun sistema.

## Suggerimenti

- Parla a **velocita naturale**, evitando di scandire. Voxtral e ottimizzato per il parlato spontaneo italiano: rallentare innaturalmente o gridare peggiorano i risultati.
- Non usare comandi vocali tipo "punto", "virgola", "a capo": il modello gestisce automaticamente la punteggiatura.
- Cita il **nome del paziente** all'inizio della sessione: aiuta il modello ad associare correttamente le persone menzionate.
- Per i farmaci e utile pronunciare per esteso il principio attivo, ad esempio `Pantoprazolo quaranta milligrammi una compressa al mattino`.
- Lavora in ambiente silenzioso o usa un microfono direzionale. Rumori di sottofondo costanti, come ventole o condizionatori, riducono l'accuratezza.
- Se il paziente parla durante la dettatura, fai pause brevi per riprendere il filo: il modello distingue meglio una sola voce alla volta.

## Risoluzione problemi

**Il microfono non funziona o non viene rilevato.** Verifica nel browser le autorizzazioni: in Chrome, clic sul lucchetto a sinistra dell'URL, sezione `Microfono`, consenti. In Safari, `Safari > Impostazioni > Siti web > Microfono`. In Edge, identico a Chrome. Verifica anche le impostazioni di sistema del dispositivo: un microfono disattivato a livello sistema operativo non e accessibile dal browser.

**Il testo non appare durante la dettatura.** Indica un problema di connessione al backend di trascrizione. Apri la console di rete del browser e verifica la presenza di errori WebSocket sull'endpoint `wss://api.fibonacci.it/voxtral`. Le cause piu comuni sono firewall aziendali che bloccano WebSocket o proxy intermedi che chiudono le connessioni di lunga durata. Contatta il responsabile IT dello studio o passa a connessione mobile per verifica.

**Confidence score sistematicamente bassi.** Avvicinati al microfono o riduci il rumore ambientale. Parla a volume normale ma costante. Se il problema persiste anche in ambiente silenzioso, prova con un microfono esterno: i microfoni integrati di alcuni portatili economici sono di qualita insufficiente per la trascrizione clinica.

**Estrazione campi non propone alcuni elementi citati.** Il modello e tarato sul lessico clinico generale italiano. Termini molto specialistici o brand commerciali poco diffusi possono non essere riconosciuti. Modifica manualmente i campi mancanti dopo l'accettazione di quelli proposti.

**Dettatura interrotta improvvisamente.** Verifica la stabilita della connessione. Una caduta WiFi temporanea interrompe la sessione. Il testo trascritto fino al momento dell'interruzione resta visibile nel pannello e puo essere salvato come bozza con `Salva bozza` prima di riavviare la dettatura.

## Vedi anche

- [Creazione e gestione anagrafica paziente](/docs/anagrafica-paziente/)
- [Body map 2D per documentare le aree trattate](/docs/body-map/)
- [Audit log e tracciabilita accessi](/docs/audit-log/)

Ultima revisione: {ULTIMA_REVISIONE}
