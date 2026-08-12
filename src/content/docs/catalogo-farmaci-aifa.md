# Catalogo farmaci: com'è aggiornato

Il catalogo dei farmaci di Fibonacci viene dall'**AIFA** e conta circa 159.000 voci.
Non si compila a mano: un processo automatico lo importa e lo tiene allineato.

La pagina **Catalogo farmaci (stato)** in area amministrativa mostra com'è andata
l'ultima importazione. È riservata al ruolo di amministratore.

## Cosa dice la pagina

- **Stato dell'ultima esecuzione**: conclusa, in corso, oppure fallita.
- **Quando è avvenuta** e **quanto è durata**.
- **Quante voci** sono state lette, aggiunte o aggiornate.
- **L'errore**, se c'è stato, con il motivo.

Quando un'importazione è **in corso**, la pagina si aggiorna da sola ogni trenta
secondi: non serve ricaricarla. Un'importazione completa dura circa quaranta minuti,
quindi vederla «in corso» a lungo è normale.

## «Forza sync ora» è disabilitato, ed è voluto

Il pulsante c'è ma non è cliccabile. Un'importazione richiede parecchie risorse e
dura decine di minuti: farla partire da un'interfaccia web, magari due volte per
errore, significherebbe rallentare la cartella durante l'orario di studio. La
sincronizzazione è programmata, e si forza dal server quando serve davvero.

## Cosa fare se l'importazione fallisce

Il catalogo **resta quello dell'ultima importazione riuscita**: nessun farmaco
sparisce e la prescrizione continua a funzionare. Un fallimento non è un'emergenza:
significa che il catalogo invecchia, non che si svuota.

Se lo stato resta fallito per più giorni, segnalalo: la causa è quasi sempre a monte
(la sorgente AIFA irraggiungibile), e si vede nel motivo riportato in pagina.
