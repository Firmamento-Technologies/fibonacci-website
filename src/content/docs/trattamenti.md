# Registrare un trattamento

Questa guida descrive come registrare una seduta di medicina estetica: prodotto, lotto, aree, quantità, e che cosa il sistema fa dopo. Si rivolge ai medici.

La registrazione della seduta è l'atto clinico che, mesi o anni dopo, dimostra che cosa è stato fatto e con quali prodotti. È il documento che regge in caso di contestazione, ed è anche quello che nessuno ha voglia di compilare al termine di una giornata piena: la schermata è costruita per chiedere il minimo indispensabile e per riempire da sola tutto il resto.

## Prerequisiti

- Account con ruolo `medico`.
- Anagrafica del paziente esistente.
- Consenso informato del trattamento **firmato**. Se il consenso manca, la seduta si registra comunque (non si nasconde ciò che è stato fatto), ma resta segnalata come priva di consenso.

## Passo 1, aprire la seduta

Dalla scheda del paziente, la sezione `Trattamenti` e il pulsante `Nuovo trattamento`. Si sceglie il prodotto, e il sistema riconosce da solo la categoria e la famiglia chimica: acido ialuronico, idrossiapatite, acido poli-L-lattico, tossina botulinica.

Il riconoscimento serve a due cose: colorare la mappa delle aree per categoria, e, dove esiste una durata scritta in un consenso, proporre il richiamo del passo 5.

## Passo 2, lotto, quantità, scadenza

Il numero di lotto va inserito **come stampato sulla confezione**. È la chiave con cui, il giorno di un richiamo del produttore, si risponde alla domanda «quali pazienti hanno ricevuto questo lotto». La guida dedicata è `Tracciabilità del lotto`.

Su questi campi il sistema **registra e non calcola**: la diluizione dichiarata viene scritta com'è. Se un valore appare incoerente compare un avviso, ma il salvataggio non viene bloccato. Un software che rifiuta di registrare ciò che è stato fatto produce cartelle che non corrispondono alla realtà, ed è un danno peggiore dell'errore che voleva prevenire.

## Passo 3, le aree trattate

Alla voce `Body-map e aree trattate` si indicano i punti con pallini numerati, associando a ciascuno la quantità. Si sceglie fra il ritratto frontale (`Foto`) e il modello tridimensionale (`3D`), che è il corpo intero col viso compreso: sulla foto basta un clic, sul modello serve il doppio clic. Le coordinate del ritratto sono distinte per uomo e donna, perché le proporzioni del volto differiscono e un pallino nel punto sbagliato è documentazione sbagliata.

Su ogni punto si può registrare anche **come** è stata fatta l'iniezione: strumento, calibro, piano e tecnica, in quattro tendine facoltative. Il dettaglio, insieme ai due modi per portare sulla mappa le aree scritte a parole, sta in [Le aree trattate: sulla foto e sul modello 3D](/manuale/body-map).

⛔ **Non esiste un pulsante che ricopia le aree della seduta precedente.** Fino al 17 agosto 2026 questa guida ne descriveva uno, e non è mai esistito: per un ritocco le aree si riscelgono, oppure si scrive la seduta a parole e si preme `Auto-estrai aree dal testo`.

## Passo 4, se è un dispositivo a energia

Quando il prodotto scelto è riconosciuto come **laser** (o altro dispositivo a energia), compare il riquadro `Parametri di erogazione`: lunghezza d'onda, fluenza, spot, frequenza, durata d'impulso con la sua unità, numero di passaggi, densità, `Raffreddamento` e `Endpoint clinico osservato`.

Due cose da sapere:

- **Sono campi liberi, senza valori proposti.** I numeri si leggono dal display della macchina. Un menù di «valori tipici» sarebbe una proposta clinica travestita da comodità, e un valore predefinito è una proposta anche quando si può cambiare.
- **L'endpoint non è una nota di colore**: è ciò che titola la fluenza della seduta successiva. Registrarlo è la differenza fra proseguire un ciclo e ricominciarlo da zero.

Per gli iniettivi lo stesso ruolo lo hanno `Diluizione preparata`, `Scadenza del lotto` e `UDI del dispositivo (facoltativo)`.

## Passo 5, uso off-label

Se il prodotto viene usato fuori dalle indicazioni autorizzate, la casella `off-label` va spuntata. Non è una formalità: l'uso off-label è lecito ma richiede un'informazione specifica al paziente, e averlo registrato è ciò che permette di dimostrarla.

## Passo 6, il richiamo

Al salvataggio, se la famiglia chimica del prodotto ha una durata attesa scritta in un consenso, il sistema propone un promemoria interno alla data giusta.

Due precisazioni che valgono più della funzione:

- **Il promemoria è per il medico, non per il paziente.** Non parte nessun messaggio automatico. È una scelta obbligata: la L. 145/2018 vieta agli iscritti agli albi le comunicazioni con elementi attrattivi, e un invio automatico esporrebbe **il medico** alla sanzione, non noi.
- **Se la durata non è nota, non si propone niente.** Vale per l'idrossiapatite e per i biostimolatori a base di acido ialuronico bio-rimodellante: le forbici che circolano vengono da materiale divulgativo, non da fonti primarie. Un richiamo inventato non è un richiamo in più, è un consiglio clinico sbagliato che sembra venire dal sistema.

## Che cosa si può fare da una seduta già registrata

Ogni riga della sezione `Trattamenti` porta, oltre alla modifica e all'eliminazione, tre azioni che si riconoscono dall'icona:

- **Scarica il fascicolo della seduta (PDF)**: un documento con quello che di quella seduta è scritto in cartella (prodotto, lotto, scadenza, quantità, diluizione, aree, tecnica, consensi, foto e accessi). Dichiara da sé le sezioni vuote invece di ometterle: un fascicolo che tace su una sezione è indistinguibile da uno in cui quella sezione non esisteva.
- **Registra una complicanza su questa seduta**: vedi [Esiti e complicanze](/manuale/esiti-e-complicanze).
- **Esporta in formato CDA**: il documento clinico nel formato di scambio.

⚠️ Una seduta marcata come inserita per errore non accetta più né complicanze né modifiche: resta visibile, perché cancellare non è correggere.

## Errori frequenti

- **Lotto lasciato vuoto.** È il caso in cui la tracciabilità serve di più, e non c'è.
- **Trattamento registrato il giorno dopo.** La data della seduta è modificabile, ma va corretta: le date sbagliate si notano solo quando qualcuno le legge in sede di contestazione.
- **Aree indicate a parole invece che sulla mappa.** «Zigomi» è ambiguo; due pallini con la quantità no.

## Domande frequenti

**Posso modificare una seduta salvata?** Sì, e la modifica resta nello storico con chi e quando. Non si sovrascrive niente in silenzio.

**Il trattamento compare nel fascicolo?** Sì: prodotto, lotto, scadenza, quantità, diluizione, consensi, foto e accessi, in un unico documento.
