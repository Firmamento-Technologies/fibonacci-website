# Creazione e gestione anagrafica paziente

Questa guida descrive come registrare un nuovo paziente in Fibonacci, come ricercarlo, modificarlo, archiviarlo e come esportare i suoi dati per soddisfare il diritto di portabilita previsto dall'articolo 20 del GDPR. Si rivolge a medici e personale di segreteria.

L'anagrafica paziente e la base di ogni altra funzionalita clinica: visite, body map, consensi, agenda e audit log si agganciano alla scheda anagrafica tramite identificativo univoco. La corretta compilazione iniziale evita duplicati, riduce gli errori clinici e garantisce la conformita alle norme sanitarie italiane.

## Prerequisiti

- Account Fibonacci con ruolo `medico`, `segreteria` o `admin studio`.
- Documento d'identita o codice fiscale del paziente per la verifica.
- Indirizzo email o numero di cellulare del paziente per i contatti automatici e i reminder.

## Passo 1, apertura del modulo nuovo paziente

Dalla barra di navigazione principale, sezione `Pazienti`, il pulsante `Nuovo paziente` in alto a destra apre il modulo di registrazione. Lo stesso modulo si raggiunge dalla scorciatoia da tastiera **N** disponibile su qualsiasi schermata.

Il modulo e diviso in quattro schede:

- `Anagrafica`, dati identificativi obbligatori.
- `Contatti`, recapiti per appuntamenti e notifiche.
- `Clinico`, informazioni sanitarie di base.
- `Foto`, immagine di riconoscimento.

Le schede vanno compilate in ordine; il pulsante `Salva` si attiva solo quando tutti i campi obbligatori della scheda anagrafica sono validi.

## Passo 2, compilazione dei campi obbligatori

I campi obbligatori sono:

- **Nome** e **Cognome**, in caratteri latini senza abbreviazioni.
- **Codice fiscale** italiano oppure tipo e numero di documento per pazienti stranieri.
- **Data di nascita**, formato `gg/mm/aaaa`.
- **Sesso**, valori `M`, `F`, `Altro` o `Non specificato` come previsto da FHIR R4.
- **Contatto principale**, almeno uno tra email e numero di telefono.

Il codice fiscale italiano viene validato automaticamente. Il sistema calcola il codice di controllo, verifica la coerenza con data di nascita, sesso e luogo di nascita, segnala incongruenze prima del salvataggio. Per i pazienti senza codice fiscale italiano e disponibile il campo `Tipo documento` con valori `Passaporto`, `Carta d'identita estera`, `Permesso di soggiorno`, `Tessera sanitaria europea`.

Il numero di telefono italiano accetta sia il formato locale `333 1234567` sia il formato internazionale `+39 333 1234567`. Il sistema normalizza sempre al formato internazionale per i reminder SMS automatici.

## Passo 3, campi opzionali

I campi facoltativi della scheda clinica includono:

- **Indirizzo di residenza** completo.
- **Medico di medicina generale**.
- **Allergie note**, campo libero o autocompletamento da terminologia SNOMED CT.
- **Gruppo sanguigno**, valori `0`, `A`, `B`, `AB` con `Rh+` o `Rh-`.
- **Note cliniche generali**, campo libero per informazioni rilevanti non strutturate.

La compilazione di allergie note e gruppo sanguigno e fortemente consigliata per i pazienti sottoposti a procedure invasive: il sistema mostra un avviso in cima a ogni scheda visita quando questi campi sono vuoti.

## Passo 4, foto profilo del paziente

La scheda `Foto` consente di caricare un'immagine di riconoscimento del paziente, utile per evitare omonimie e per la pre-visita rapida.

Il pulsante `Carica` accetta file JPEG e PNG fino a cinque megabyte. Il pulsante `Scatta` apre la fotocamera del dispositivo con consenso esplicito del paziente.

La foto viene cifrata a riposo con algoritmo AES-256 e accessibile solo agli operatori autorizzati a vedere la scheda. La cifratura usa chiavi derivate dal tenant dello studio, separate dalle chiavi degli altri studi sulla stessa piattaforma.

## Passo 5, salvataggio e verifica anti-duplicati

Al click su `Salva`, il sistema verifica la presenza di pazienti con codice fiscale identico oppure con combinazione di nome, cognome e data di nascita coincidente.

In caso di possibile duplicato il sistema mostra un pannello con il paziente preesistente e tre opzioni:

- `Apri esistente`, abbandona la creazione e apre la scheda gia presente.
- `Unisci`, unifica i due record dopo conferma esplicita dell'operatore.
- `Salva comunque`, crea il nuovo record marcandolo come possibile duplicato da rivedere.

L'unione e tracciata in audit log come operazione amministrativa.

## Ricerca del paziente

La barra di ricerca globale in alto a destra esegue una ricerca incrementale su nome, cognome, codice fiscale e numero di telefono. I risultati appaiono dopo tre caratteri.

Filtri avanzati sono disponibili dalla schermata `Pazienti > Filtri`:

- range di data di nascita,
- creato da operatore specifico,
- ultima visita entro un range temporale,
- presenza di allergie note,
- stato archiviazione.

I filtri si combinano e producono un elenco ordinabile, esportabile in CSV.

## Archiviazione del paziente

Quando un paziente non e piu in cura, il pulsante `Archivia` nella scheda paziente lo marca come archiviato. L'operazione **non cancella i dati**: la cartella clinica resta accessibile in sola lettura per il periodo di conservazione previsto dalla normativa sanitaria.

Il paziente archiviato non compare nella ricerca standard ne nelle proposte di nuovo appuntamento. Resta visibile attivando il filtro `Includi archiviati`.

L'archiviazione e la modalita conforme all'articolo 17 del GDPR (diritto all'oblio) nel contesto sanitario, dove il diritto e bilanciato con gli obblighi di conservazione previsti dal Codice di deontologia medica e dalla normativa fiscale.

## Cancellazione definitiva

La cancellazione fisica dei dati e ammessa solo nei casi previsti dalla normativa, ad esempio per pazienti registrati per errore o con consenso revocato prima dell'inizio della prestazione.

Il pulsante `Richiedi cancellazione definitiva` apre una richiesta che richiede approvazione di un secondo operatore con ruolo `admin studio`. La cancellazione effettiva avviene dopo trenta giorni di periodo di ripensamento, con avviso preventivo via email all'operatore richiedente. Tutte le fasi della procedura sono registrate in audit log.

## Export dati paziente in formato FHIR R4

L'articolo 20 del GDPR garantisce al paziente il diritto di ricevere i propri dati in un formato strutturato e di uso comune.

Dal pulsante `Esporta dati` nella scheda paziente si genera un archivio ZIP contenente:

- file `Patient.json` con l'anagrafica completa in formato FHIR R4,
- file `Observation.json` con osservazioni e parametri rilevati,
- file `Condition.json` con anamnesi e patologie,
- file `MedicationStatement.json` con i farmaci registrati,
- file `Procedure.json` con le procedure eseguite,
- cartella `consents/` con i PDF dei consensi firmati,
- cartella `attachments/` con foto e referti.

L'archivio e firmato digitalmente per garantirne l'integrita ed e disponibile per il download per sette giorni. Il link di download e inviato per email al paziente con secondo fattore di accesso via SMS.

## Suggerimenti

- Scorciatoia da tastiera **N** ovunque per nuovo paziente, **F** per aprire la ricerca rapida, **Esc** per chiudere le modali.
- Importazione bulk da CSV disponibile in `Impostazioni > Importazione dati`: il template prevede una riga per paziente con intestazioni standard. L'importazione e in due fasi: anteprima con validazione, poi conferma.
- Per pazienti minori il campo `Tutore legale` permette di registrare il riferimento contrattuale: i consensi e le ricevute fanno riferimento al tutore.
- Per pazienti stranieri privi di codice fiscale italiano si raccomanda di richiedere copia del documento e di registrarne il numero nel campo `Tipo documento > Numero`.

## Risoluzione problemi

**Codice fiscale rifiutato come non valido.** Verifica che le sedici cifre corrispondano al documento ufficiale. Una digitazione errata della lettera di controllo finale e l'errore piu frequente. In alternativa, usa la funzione `Calcola codice fiscale` dalla scheda anagrafica.

**Email gia utilizzata da un altro paziente.** Lo stesso indirizzo email puo essere associato a un solo paziente per studio. Per nuclei familiari che condividono un'email, registra l'indirizzo solo sul referente e lascia vuoto il campo email negli altri membri usando il telefono come contatto principale.

**Possibile duplicato segnalato ma il paziente e nuovo.** Verifica nome, cognome, data di nascita: pazienti con nomi comuni e date vicine possono attivare il falso positivo. Usa `Salva comunque`; il record viene marcato per revisione successiva.

**Foto non si carica.** Il limite e cinque megabyte e i formati ammessi sono JPEG e PNG. File HEIC da iPhone vanno convertiti: la maggior parte dei browser mobili lo fa automaticamente al momento dell'upload, alcuni modelli richiedono di disabilitare l'opzione `Alta efficienza` nelle impostazioni della fotocamera.

## Vedi anche

- [Primo accesso e configurazione iniziale](/docs/installazione/)
- [Compilare l'anamnesi con la dettatura AI](/docs/anamnesi-dettatura/)
- [Audit log e tracciabilita accessi](/docs/audit-log/)

Ultima revisione: {ULTIMA_REVISIONE}
