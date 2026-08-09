# Registrare un trattamento

Questa guida descrive come registrare una seduta di medicina estetica: prodotto, lotto, aree, quantità, e che cosa il sistema fa dopo. Si rivolge ai medici.

La registrazione della seduta è l'atto clinico che, mesi o anni dopo, dimostra che cosa è stato fatto e con quali prodotti. È il documento che regge in caso di contestazione, ed è anche quello che nessuno ha voglia di compilare al termine di una giornata piena: la schermata è costruita per chiedere il minimo indispensabile e per riempire da sola tutto il resto.

## Prerequisiti

- Account con ruolo `medico`.
- Anagrafica del paziente esistente.
- Consenso informato del trattamento **firmato**. Se il consenso manca, la seduta si registra comunque — non si nasconde ciò che è stato fatto — ma resta segnalata come priva di consenso.

## Passo 1, aprire la seduta

Dalla scheda del paziente, la sezione `Trattamenti` e il pulsante `Nuovo trattamento`. Si sceglie il prodotto, e il sistema riconosce da solo la categoria e la famiglia chimica: acido ialuronico, idrossiapatite, acido poli-L-lattico, tossina botulinica.

Il riconoscimento serve a due cose: colorare la mappa delle aree per categoria, e — dove esiste una durata scritta in un consenso — proporre il richiamo del passo 5.

## Passo 2, lotto, quantità, scadenza

Il numero di lotto va inserito **come stampato sulla confezione**. È la chiave con cui, il giorno di un richiamo del produttore, si risponde alla domanda «quali pazienti hanno ricevuto questo lotto». La guida dedicata è `Tracciabilità del lotto`.

Su questi campi il sistema **registra e non calcola**: la diluizione dichiarata viene scritta com'è. Se un valore appare incoerente compare un avviso, ma il salvataggio non viene bloccato. Un software che rifiuta di registrare ciò che è stato fatto produce cartelle che non corrispondono alla realtà, ed è un danno peggiore dell'errore che voleva prevenire.

## Passo 3, le aree trattate

La mappa del viso e del corpo permette di indicare i punti con pallini numerati, associando a ciascuno la quantità. Le coordinate sono distinte per uomo e donna, perché le proporzioni del volto differiscono e un pallino nel punto sbagliato è documentazione sbagliata.

## Passo 4, uso off-label

Se il prodotto viene usato fuori dalle indicazioni autorizzate, la casella `off-label` va spuntata. Non è una formalità: l'uso off-label è lecito ma richiede un'informazione specifica al paziente, e averlo registrato è ciò che permette di dimostrarla.

## Passo 5, il richiamo

Al salvataggio, se la famiglia chimica del prodotto ha una durata attesa scritta in un consenso, il sistema propone un promemoria interno alla data giusta.

Due precisazioni che valgono più della funzione:

- **Il promemoria è per il medico, non per il paziente.** Non parte nessun messaggio automatico. È una scelta obbligata: la L. 145/2018 vieta agli iscritti agli albi le comunicazioni con elementi attrattivi, e un invio automatico esporrebbe **il medico** alla sanzione, non noi.
- **Se la durata non è nota, non si propone niente.** Vale per l'idrossiapatite e per i biostimolatori a base di acido ialuronico bio-rimodellante: le forbici che circolano vengono da materiale divulgativo, non da fonti primarie. Un richiamo inventato non è un richiamo in più, è un consiglio clinico sbagliato che sembra venire dal sistema.

## Errori frequenti

- **Lotto lasciato vuoto.** È il caso in cui la tracciabilità serve di più, e non c'è.
- **Trattamento registrato il giorno dopo.** La data della seduta è modificabile, ma va corretta: le date sbagliate si notano solo quando qualcuno le legge in sede di contestazione.
- **Aree indicate a parole invece che sulla mappa.** «Zigomi» è ambiguo; due pallini con la quantità no.

## Domande frequenti

**Posso modificare una seduta salvata?** Sì, e la modifica resta nello storico con chi e quando. Non si sovrascrive niente in silenzio.

**Il trattamento compare nel fascicolo?** Sì: prodotto, lotto, scadenza, quantità, diluizione, consensi, foto e accessi, in un unico documento.
