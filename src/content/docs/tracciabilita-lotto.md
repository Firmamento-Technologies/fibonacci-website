# Tracciabilità del lotto

Questa guida descrive come registrare il lotto dei prodotti iniettati e come rispondere, in una ricerca, alla domanda che conta davvero: **quali pazienti hanno ricevuto un determinato lotto**. Si rivolge ai medici e a chi gestisce il magazzino dello studio.

La domanda non è teorica. Quando un produttore richiama un lotto, o quando si sospetta una reazione legata a un prodotto specifico, la risposta va data in minuti e va data per iscritto.

## Prerequisiti

- Account con ruolo `medico` o `admin studio`.
- Funzione `Ricerca per lotto` attiva sul proprio studio. Se la voce non compare nel menu, la funzione non è stata abilitata: si richiede all'assistenza.

## Passo 1, registrare il lotto durante la seduta

Nella registrazione di un trattamento iniettivo, oltre al prodotto e alla quantità, sono disponibili i campi:

- **Numero di lotto**, come stampato sulla confezione,
- **Data di scadenza**,
- **Diluizione**, quando pertinente.

Il numero di lotto va inserito **come stampato**, senza aggiungere spazi o trattini di comodo: è la chiave con cui la ricerca troverà la seduta.

Su questi campi il sistema **registra**, non calcola: la diluizione dichiarata viene scritta così com'è, non viene ricalcolata né corretta. E se un dato appare incoerente il sistema avvisa, ma non blocca il salvataggio. È una scelta: un software che rifiuta di registrare ciò che è stato fatto produce cartelle che non corrispondono alla realtà.

## Passo 2, cercare per lotto

La voce `Ricerca per lotto` nel menu principale apre una ricerca a campo singolo. Inserendo il numero di lotto si ottiene l'elenco delle sedute in cui quel lotto è stato usato, con:

- paziente,
- data della seduta,
- quantità somministrata,
- data di scadenza registrata.

La ricerca attraversa tutti i pazienti dello studio in una sola interrogazione. Non è necessario sapere in anticipo su quali pazienti cercare, che è precisamente il punto.

## Passo 3, cosa fare con l'elenco

L'elenco è il punto di partenza di due attività diverse, e conviene tenerle distinte:

- **Richiamo del produttore.** L'elenco individua i pazienti da contattare. Il contatto è una comunicazione clinica e va fatto dallo studio, non automatizzato.
- **Segnalazione di un evento avverso.** Se il lotto è sospettato in relazione a una reazione, la segnalazione va registrata nella scheda del paziente, nella sezione degli esiti e delle complicanze, dove esiste un campo per il prodotto e per il lotto.

## Errori frequenti

- **Lotto inserito con formattazioni diverse in sedute diverse.** `A1234-B` e `A1234 B` sono due lotti per una ricerca. Vale la pena concordare in studio un modo unico di trascriverlo.
- **Lotto lasciato vuoto perché «tanto è sempre lo stesso».** È il caso in cui la tracciabilità serve di più e non c'è.
- **Scadenza non registrata.** Senza, non è possibile distinguere una somministrazione avvenuta entro la validità del prodotto da una avvenuta dopo: è un dato che protegge il medico.

## Domande frequenti

**Il lotto è obbligatorio?** Il sistema non lo impone. È però il dato che permette di rispondere a un richiamo, e la sua assenza si nota solo quando serve.

**Posso cercare per prodotto invece che per lotto?** La ricerca è per lotto. Il prodotto compare nell'elenco dei risultati e nella scheda della seduta.

**I dati del lotto finiscono nel fascicolo della seduta?** Sì: prodotto, lotto, scadenza, quantità e diluizione compaiono nel fascicolo, insieme ai consensi e agli accessi.
