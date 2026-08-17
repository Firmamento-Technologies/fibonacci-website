# Foto cliniche e confronto prima/dopo

Questa guida descrive come acquistare, conservare e confrontare le fotografie cliniche in Fibonacci. Si rivolge ai medici e al personale che documenta i trattamenti.

Le fotografie sono la documentazione che regge o non regge quando un risultato viene contestato, e sono dati relativi alla salute ai sensi dell'art. 9 del GDPR: per questo il percorso descritto qui non è uguale a quello di un archivio di immagini qualsiasi.

## Prerequisiti

- Account con ruolo `medico` o `admin studio`.
- Anagrafica del paziente già creata.
- Consenso informato al trattamento fotografico raccolto e archiviato. Il consenso alla cura non copre la fotografia: sono due finalità distinte, e la seconda va documentata a parte.

## Come sono conservate le fotografie

Ogni immagine viene cifrata **prima di lasciare il browser**, con una chiave generata per quella singola fotografia. Quella chiave viene a sua volta protetta con una chiave di progetto che risiede sul server e non entra mai nel codice che gira nel browser.

Tre conseguenze pratiche, che vale la pena conoscere prima di lavorare:

- Chi ottenesse una copia del database o del disco non vedrebbe le fotografie: vedrebbe blocchi cifrati.
- L'apertura di una fotografia è un accesso e viene registrato nel registro accessi, con chi e quando. Non è una limitazione: è ciò che permette di dimostrare, a distanza di anni, chi ha visto che cosa.
- Le fotografie non compaiono nelle anteprime di stampa dei documenti clinici. Vanno consegnate separatamente e consapevolmente.

## Passo 1, acquisire una fotografia

Dalla scheda del paziente, la sezione `Foto` mostra le acquisizioni esistenti raggruppate per data. Il pulsante `Aggiungi foto` apre la finestra di caricamento, che accetta immagini dalla fotocamera del dispositivo o da file.

Prima di salvare, il sistema esegue due operazioni automatiche:

- **rimozione dei metadati EXIF**, compresa la posizione geografica. Una fotografia scattata con il telefono in studio porta con sé le coordinate: consegnarla a un terzo significherebbe consegnare anche l'indirizzo di chi l'ha scattata,
- **rilevamento dei volti**, con possibilità di oscurarli. L'oscuramento è una scelta del medico e non è automatico, perché in medicina estetica il volto è spesso l'oggetto stesso della documentazione.

Al salvataggio si indica l'area trattata e, se pertinente, il trattamento a cui la fotografia si riferisce. Questa associazione è ciò che rende possibile il confronto del passo 3.

### La vista, e la serie standard

Ogni scatto può dichiarare la `Vista`: `Frontale`, `Laterale destra`, `Laterale sinistra`, `Obliqua 45° destra`, `Obliqua 45° sinistra`, `Dinamica (mimica)`. È il protocollo fotografico clinico: la stessa serie di inquadrature, ripetuta uguale a ogni visita, è ciò che rende confrontabili due date.

Tre regole, tutte volute:

- **la vista è facoltativa.** Le fotografie caricate prima di questa funzione non ce l'hanno, e «non indicata» resta diverso da «frontale»: il sistema non riempie mai il campo da solo;
- **la checklist informa e non blocca.** La scheda `Foto` mostra la serie della visita più recente e dice quali viste mancano; scatti fuori serie restano leciti;
- **scattando dalla camera con una vista scelta, lo scatto precedente della stessa vista compare in trasparenza sul mirino** (*«Scatto precedente in trasparenza: sovrapponi per ripetere l'inquadratura»*). Sovrapporre il volto al fantasma è il modo pratico di ripetere inquadratura e distanza, e la camera aiuta anche con l'ovale di posa e il promemoria *«Occhi sulla linea · luce frontale uniforme · sfondo neutro»*.

### A che cosa potrà servire quella foto

Al caricamento si dichiara la finalità: `C1: Clinico:` (necessario per il trattamento), `C2: Didattico:` e `C3: Promozionale:`. Le prime restano sempre in cartella; le altre due dipendono da un consenso separato, revocabile in ogni momento, e per la promozione vale la L. 145/2018. Fuori dalla cura, l'anonimizzazione è obbligatoria.

## Passo 2, organizzare per seduta

Le fotografie associate a un trattamento compaiono nella riga della seduta corrispondente. Le fotografie non associate restano nell'elenco generale, ordinate per data.

Consiglio operativo: acquisire sempre almeno uno scatto prima del trattamento, con la stessa inquadratura e la stessa illuminazione che si userà dopo. Un confronto fra due fotografie scattate in condizioni diverse non documenta il risultato: documenta la differenza di luce.

## Passo 3, confronto prima/dopo

Nella sezione `Foto`, selezionando due immagini della stessa area si apre la vista di confronto affiancato. La vista mostra le due date, l'area e l'eventuale trattamento interposto.

Il confronto ha una **barra centrale trascinabile** (*«Pre a sinistra, Post a destra»*) e un `Rileva il volto e allinea automaticamente le foto`, che sovrappone i due scatti usando i punti del volto quando le inquadrature non coincidono; `Rimuovi allineamento` torna alle immagini come sono state scattate.

⚠️ **L'allineamento è un aiuto alla lettura, non una correzione della fotografia**: le immagini originali non vengono modificate. E allineare due scatti presi da angoli diversi li rende sovrapponibili, non confrontabili: la serie per vista resta il modo giusto.

Il confronto è una vista, non un documento: non modifica le immagini e non ne crea di nuove. Se serve consegnare il confronto al paziente, si esportano le due fotografie originali.

Dal confronto si registra anche il **PGAIS**, il giudizio del medico sul risultato: vedi [Analisi del volto](/manuale/analisi-del-volto).

## Passo 4, consegnare le fotografie al paziente

Il paziente ha diritto a ricevere i propri dati, fotografie comprese, in un formato leggibile. L'esportazione delle immagini le decifra al momento della consegna: escono in chiaro nel pacchetto, mentre la chiave di progetto non viene mai consegnata.

Il motivo è preciso: quella chiave non apre solo le fotografie che si stanno consegnando, apre ogni copia cifrata esistente, comprese quelle nei backup, e non è revocabile. Consegnarla significherebbe dare accesso a materiale che non si sta consegnando.

## Errori frequenti

- **Fotografie senza consenso specifico.** Il consenso al trattamento non è il consenso alla fotografia. Se il secondo manca, l'immagine non andrebbe acquisita.
- **Confronti fra inquadrature diverse.** Sono la causa più comune di contestazioni sul risultato: la differenza percepita può dipendere dall'angolo, non dall'esito.
- **Invio delle fotografie via messaggistica ordinaria.** Sono dati dell'art. 9: il canale va scelto di conseguenza, e una chat non cifrata non è quel canale.

## Domande frequenti

**Posso cancellare una fotografia?** Sì. La cancellazione rimuove l'immagine, ma resta traccia nel registro accessi del fatto che una fotografia è esistita ed è stata cancellata, con chi e quando. È una tutela, non un residuo.

**Le fotografie finiscono nel referto?** No, non automaticamente. Il fascicolo della seduta dichiara che esistono e non le incorpora, perché la loro apertura è un accesso a sé che deve restare tracciato.

**Quanto occupano?** Circa 18 GB per studio all'anno con un uso intenso. È la ragione per cui l'archivio delle immagini è previsto su spazio dedicato e non sullo stesso disco del database.
