# Body map 2D per documentare le aree trattate

Questa guida descrive l'uso della body map bidimensionale di Fibonacci per documentare in modo strutturato e visivo le aree del corpo del paziente sottoposte a trattamento. Ogni punto trattato viene rappresentato da un pallino numerato posizionato sulla fotografia del paziente, con i dettagli clinici associati: area corporea, prodotto utilizzato, lotto, quantita ed eventuale uso off-label.

La funzione e attualmente disponibile per la specialita di medicina estetica. Altre specialita verticali sono in fase di sviluppo: dermatologia, ortopedia e fisiatria seguiranno secondo la roadmap pubblica.

## Prerequisiti

- Account con ruolo `medico` e accesso clinico al paziente.
- Visita aperta sul paziente di cui si vuole documentare il trattamento.
- Almeno una fotografia di base del paziente: frontale, laterale destra, laterale sinistra, posteriore. Le foto possono essere state caricate in anagrafica oppure scattate al momento della visita.
- Conoscenza del prodotto somministrato: principio attivo o nome commerciale, lotto, quantita.

## Passo 1, apertura della body map

Dalla scheda visita del paziente, il tab `Body map` apre il pannello dedicato. La schermata mostra a sinistra l'area di lavoro con la fotografia selezionata, a destra la tabella riepilogo dei pallini gia presenti per la visita corrente.

Il selettore in alto a sinistra permette di scegliere la vista: `Frontale`, `Laterale destra`, `Laterale sinistra`, `Posteriore`. Se la vista scelta non ha ancora una foto associata, il pulsante `Scatta foto` apre la fotocamera del dispositivo per acquisirla al momento, oppure `Carica foto` consente di scegliere un file dal disco.

Le foto del paziente sono cifrate a riposo con algoritmo AES-256. L'accesso e tracciato in audit log come per qualsiasi altro dato sanitario.

## Passo 2, creazione di un pallino

Per creare un nuovo pallino esistono due modalita:

- click diretto sulla fotografia nel punto desiderato,
- scorciatoia da tastiera **N** per `Nuovo pallino`, seguito dal click sulla posizione.

Si apre una modale con i seguenti campi:

- **Area corporea**, combobox con autocompletamento dal catalogo aree, ad esempio `Glabella`, `Zigomo destro`, `Solco nasolabiale sinistro`. Le aree seguono la nomenclatura SICPRE per coerenza con i consensi.
- **Prodotto AIFA**, combobox con ricerca testuale sul catalogo italiano dei farmaci AIFA. Mostra principio attivo, nome commerciale, indicazioni autorizzate.
- **Lotto**, campo libero per inserire il numero di lotto stampato sulla confezione del prodotto.
- **Quantita**, valore numerico con selezione dell'unita di misura: millilitri (`ml`), unita (`U`), siringhe (`sg`).
- **Tecnica**, facoltativo, descrive la modalita di iniezione: `Bolo`, `Lineare retrograda`, `Microboli`, `Fanning`, `Cross-hatching`.
- **Note**, campo libero per osservazioni cliniche specifiche del punto trattato.

Il pulsante `Salva pallino` conferma e aggiunge il pallino numerato in sequenza progressiva sulla fotografia.

## Passo 3, flag off-label

L'uso **off-label** designa l'impiego di un farmaco per indicazioni, dosi o vie di somministrazione diverse da quelle autorizzate da AIFA. In medicina estetica e una situazione frequente e legittima, purche documentata e supportata da letteratura clinica e da consenso informato del paziente.

Quando si seleziona un prodotto e l'area corporea o la tecnica non rientrano nelle indicazioni autorizzate, il sistema mostra automaticamente il flag `Off-label` con check abilitato e richiede la compilazione del campo `Motivazione off-label`. Il campo motivazione e obbligatorio: riferimento a linee guida societarie, letteratura, esperienza clinica documentata.

Il flag off-label e visibile nel riepilogo della visita ed e tracciato in audit log. In sede di consenso informato per la procedura, il sistema integra automaticamente l'informativa sull'uso off-label nel PDF generato.

## Passo 4, riepilogo e ordinamento

La tabella riepilogo a destra elenca tutti i pallini della visita corrente con colonne:

- numero progressivo,
- area corporea,
- prodotto,
- lotto,
- quantita,
- off-label,
- azione `Modifica`, `Duplica`, `Elimina`.

I pallini possono essere riordinati trascinandoli nella tabella: il numero visualizzato sulla fotografia si aggiorna in tempo reale. L'ordine ha valore documentale, ad esempio per descrivere la sequenza temporale dei punti trattati.

## Passo 5, copia da visita precedente

Per i pazienti che effettuano trattamenti di ritocco regolari, il pulsante `Importa da visita precedente` apre l'elenco delle visite passate dello stesso paziente con body map.

La selezione di una visita precedente importa tutti i pallini con prodotto, area corporea, lotto e tecnica. Il numero di lotto e marcato per revisione: il prodotto nuovo ha tipicamente un lotto diverso. La quantita viene azzerata e richiede di essere reinserita per la visita corrente.

L'importazione e tracciata in audit log con riferimento alla visita di origine.

## Passo 6, esportazione PDF della visita

Il pulsante `Esporta PDF` genera un documento contenente:

- intestazione studio e dati paziente,
- fotografia annotata con i pallini numerati,
- tabella dettagliata con tutti i campi,
- evidenza dei punti off-label con motivazione,
- firma digitale del medico in PAdES level.

Il PDF e archiviato come allegato della visita ed e inviabile al paziente o ad altri operatori coinvolti. La conservazione segue le regole della cartella clinica: venti anni per documentazione clinica integrale.

## Faccione aggregato

La vista `Faccione aggregato` mostra una rappresentazione cumulativa di tutti i trattamenti del paziente nel tempo. Ogni area corporea trattata e colorata in base alla categoria di prodotto utilizzata:

- **azzurro** per tossina botulinica,
- **rosa** per filler a base di acido ialuronico,
- **arancione** per biostimolanti,
- **viola** per peeling chimici,
- **giallo** per trattamenti laser,
- **grigio** per altre categorie.

L'intensita del colore aumenta con la quantita cumulativa di prodotto somministrato nell'area negli ultimi dodici mesi, dato utile per pianificare ritocchi e per valutare la coerenza del piano terapeutico.

Il selettore temporale in alto permette di restringere la vista agli ultimi tre, sei, dodici o ventiquattro mesi, oppure all'intero storico.

## Catalogo farmaci AIFA

Fibonacci integra il catalogo ufficiale AIFA dei medicinali ad uso umano, aggiornato mensilmente. La ricerca testuale opera su:

- principio attivo,
- nome commerciale,
- AIC (Autorizzazione all'Immissione in Commercio),
- categoria terapeutica.

Per ogni prodotto la scheda mostra le indicazioni autorizzate, la posologia di riferimento, gli effetti indesiderati noti. Le informazioni sono di sintesi: per la scheda tecnica completa il link rimanda all'archivio ufficiale AIFA.

Per prodotti non presenti nel catalogo, ad esempio dispositivi medici di nicchia o galenici magistrali, il pulsante `Inserisci prodotto custom` apre un modulo per registrare un prodotto a livello di studio. Il prodotto custom resta interno allo studio e non viene condiviso con la piattaforma.

## Suggerimenti

- Scorciatoie da tastiera: **N** per nuovo pallino, **D** per duplicare l'ultimo, **E** per modificare, **canc** per eliminare il pallino selezionato.
- Usa la stessa fotografia di base nel tempo per valutare l'evoluzione del paziente. Le foto storiche restano nella anagrafica con timestamp.
- Configura la nomenclatura preferita delle aree corporee in `Impostazioni > Body map > Lessico`: il sistema offre il default SICPRE ma supporta personalizzazioni di studio.
- Per i trattamenti combinati registra il prodotto principale e nel campo `Note` le associazioni: il PDF di consenso integra le combinazioni nel testo.
- Inserisci il lotto sempre completo di lettere e numeri, eventuali zeri iniziali compresi: serve per la rintracciabilita in caso di richiamo del prodotto.

## Risoluzione problemi

**La fotografia non si carica.** Verifica che il file non superi i dieci megabyte e sia in formato JPEG, PNG o HEIC. Per HEIC da iPhone alcuni browser desktop non gestiscono nativamente il formato: usa l'app mobile o converti il file in JPEG.

**Il prodotto cercato non compare nel catalogo AIFA.** Il catalogo segue le autorizzazioni AIFA italiane. Prodotti non autorizzati in Italia o dispositivi medici classificati come tali (non farmaci) non sono nel catalogo. Usa la funzione `Inserisci prodotto custom` oppure richiedi l'inserimento via supporto se ritieni si tratti di una mancanza del catalogo ufficiale.

**Pallino in posizione sbagliata.** Trascina il pallino sulla fotografia per riposizionarlo. La modifica viene tracciata in audit log come `body-map.update`.

**Mancata sincronizzazione del numero progressivo dopo riordino.** Aggiorna la pagina (`F5`). Il riordino e persistito sul server: la vista locale viene allineata al ricaricamento.

**Esportazione PDF lenta o fallita.** I PDF con molte fotografie ad alta risoluzione richiedono qualche secondo di elaborazione. Se la generazione supera i trenta secondi senza completamento, ricarica e riprova. In caso di errore persistente verifica la dimensione cumulativa delle fotografie: oltre i venti megabyte totali la generazione puo timeoutare.

## Vedi anche

- [Compilare l'anamnesi con la dettatura AI](/docs/anamnesi-dettatura/)
- [Generare e firmare consensi SICPRE in PDF](/docs/consensi-sicpre/)
- [Audit log e tracciabilita accessi](/docs/audit-log/)

Ultima revisione: {ULTIMA_REVISIONE}
