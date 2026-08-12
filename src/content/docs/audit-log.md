# Registro accessi: chi ha fatto cosa, e quando

Ogni operazione sui dati dei pazienti lascia una traccia: chi l'ha fatta, quando, su
quale scheda. Il **registro accessi** è dove quelle tracce si leggono.

Serve per tre cose concrete: rispondere a un paziente che chiede chi ha visto la sua
cartella, ricostruire cosa è successo quando qualcosa non torna, e dimostrare a un
controllo che lo studio tiene traccia di quello che fa.

## Chi può aprirlo

Solo chi ha il ruolo di amministratore dello studio. Se la voce **Registro accessi** non
compare in navigazione, il tuo utente non ha quel permesso: lo concede l'amministratore
dalle impostazioni.

## Cosa si vede

Una tabella, con la riga più recente in alto. Per ognuna:

- **quando** è successo;
- **chi** l'ha fatto: il nome dell'operatore, oppure *Sistema* per le operazioni
  automatiche;
- **che cosa** è stato fatto: creazione, lettura, aggiornamento, cancellazione;
- **su cosa**: la scheda o il documento toccato;
- **com'è andata**: riuscita, avviso, errore.

## I filtri

Sopra la tabella si restringe la ricerca.

- **Attività clinica** oppure **attività di sistema.** La prima è quello che fanno le
  persone sulle cartelle; la seconda è quello che il programma fa da solo: importazioni,
  processi automatici. Tenerle separate serve davvero, perché le seconde sono tante e
  coprirebbero le prime.
- **L'azione**: solo le letture, solo le modifiche, solo le cancellazioni.
- **L'esito**: solo gli avvisi, solo gli errori.

## Rispondere a chi chiede chi ha visto la sua cartella

È il caso più frequente, ed è un diritto del paziente: la legge dà **quindici giorni**
per rispondere.

1. Filtra per quel paziente.
2. Scegli l'intervallo di date.
3. Premi **Esporta**.

Si ottiene un file CSV (si apre con qualunque foglio di calcolo) con esattamente le
righe che hai a schermo. È la forma in cui la risposta si consegna.

## L'integrità: perché il registro non si corregge

Il registro è costruito in modo che una riga, una volta scritta, **non si possa
modificare né cancellare**, e che un'eventuale manomissione si veda: ogni riga è legata
alla precedente, quindi toccarne una rende evidente l'alterazione su tutte quelle che
seguono.

⚠️ **Questa verifica non ha un pulsante nell'interfaccia.** È un controllo che si esegue
sul server, e il risultato si chiede all'assistenza. Se risultasse alterato non sarebbe
una segnalazione ordinaria: è un incidente di sicurezza, e va comunicato subito.

## Per quanto tempo restano le tracce

Quanto la documentazione clinica a cui si riferiscono. Restano **anche dopo** che un
paziente è stato cancellato: senza più il suo nome, ma con la traccia che l'operazione è
avvenuta. È voluto: un registro che sparisce insieme ai dati non dimostrerebbe più
niente.

## Cosa NON c'è in questa pagina

Detto per non farti cercare quello che non esiste:

- **nessuna esportazione in PDF firmato**: l'esportazione è in CSV;
- **nessun pulsante di verifica dell'integrità** (vedi sopra: si fa sul server);
- **nessuna linea del tempo grafica** delle operazioni su un paziente;
- **nessun filtro salvabile fra i preferiti**, né ricerca per indirizzo di rete.
