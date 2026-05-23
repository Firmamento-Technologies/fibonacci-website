# Audit log e tracciabilita accessi

Questa guida descrive il funzionamento dell'audit log di Fibonacci, la registrazione immutabile di tutte le operazioni effettuate sui dati clinici e amministrativi. L'audit log e lo strumento principale per dimostrare la compliance al GDPR (in particolare articoli 30 e 32), per soddisfare le richieste delle autorita garanti, per verificare l'integrita dei dati sanitari e per indagare eventuali incidenti di sicurezza.

L'accesso all'audit log e limitato per default ai ruoli `admin studio` e `admin sistema`. Il medico responsabile dello studio puo concedere accesso in sola lettura ad altri ruoli specifici, ad esempio per audit interni o consulenza legale.

## Prerequisiti

- Account con ruolo `admin studio` o `admin sistema`.
- Conoscenza dei concetti FHIR R4 di base: `Patient`, `Encounter`, `Observation`, `Procedure` sono le risorse piu frequenti nei log clinici.
- Per la verifica integrita avanzata: conoscenza dei concetti di hash-chain e di firma elettronica.

## Accesso all'audit log

Dalla barra di navigazione principale, l'icona `Audit` apre la sezione dedicata. La schermata predefinita mostra:

- in alto i filtri rapidi: range date, operatore, azione, paziente, esito,
- al centro la tabella degli ultimi duecento eventi ordinati per timestamp decrescente,
- a destra il pannello dettagli dell'evento selezionato,
- in basso la barra azioni: `Esporta PDF`, `Verifica integrita`, `Export FHIR AuditEvent`.

Se la voce `Audit` non e visibile nella barra di navigazione, il ruolo dell'utente corrente non include il permesso `audit:read`. Verifica con l'amministratore dello studio.

## Struttura di un evento audit

Ogni riga della tabella rappresenta un singolo evento e mostra le seguenti colonne:

- **Timestamp**, data e ora dell'operazione con precisione al millisecondo, in fuso orario locale.
- **Operatore**, nome e cognome dell'utente che ha eseguito l'operazione. In caso di operazioni automatiche, valore `Sistema` o nome del processo.
- **Azione**, codice di tipo `C` (create), `R` (read), `U` (update), `D` (delete), `E` (execute) per operazioni custom.
- **Risorsa FHIR**, tipo della risorsa toccata: `Patient`, `Encounter`, `Observation`, `Procedure`, `Consent`, `DocumentReference`, `AuditEvent` stesso.
- **Identificativo risorsa**, UUID univoco della risorsa.
- **Paziente coinvolto**, nome del paziente associato all'operazione, se applicabile.
- **Esito**, codice numerico `0` successo, `4` warning, `8` error, `12` fatal.
- **IP**, indirizzo IP dell'origine della richiesta.

Il pannello dettagli mostra in aggiunta:

- user agent completo del browser o client API,
- payload completo della richiesta in formato JSON, escludendo i dati cifrati,
- diff esatto in caso di azione `U` (update): valori `before` e `after`,
- correlation ID per tracciare la richiesta lungo i microservizi backend.

## Filtri di ricerca

Il pannello filtri permette di restringere la ricerca con i seguenti criteri combinabili:

- **Range date**, default ultimi sette giorni, esteso fino a dieci anni.
- **Operatore**, dropdown con l'elenco degli operatori attivi e disattivati.
- **Azione**, selezione multipla tra `C`, `R`, `U`, `D`, `E`.
- **Risorsa FHIR**, dropdown con i tipi risorsa supportati.
- **Paziente**, autocompletamento sul nome paziente.
- **Esito**, selezione multipla tra `0`, `4`, `8`, `12`.
- **IP origine**, ricerca per indirizzo IP esatto o subnet CIDR.

I filtri si combinano in AND logico. Il pulsante `Salva filtro` memorizza la combinazione corrente come preset accessibile dal menu rapido.

## Esempi di lifecycle eventi

Una visita tipica genera la seguente sequenza di eventi audit:

- `Patient.create` quando il paziente viene registrato la prima volta,
- `Patient.read` ogni volta che la scheda viene aperta,
- `Encounter.create` all'apertura di una nuova visita,
- `Observation.create` per ogni dato clinico registrato,
- `BodyMap.update` per ogni pallino aggiunto o modificato,
- `Consent.create` alla generazione del consenso,
- `Consent.update` alla firma del consenso, con campo `status` aggiornato a `signed`,
- `DocumentReference.create` per l'archiviazione del PDF firmato,
- `Encounter.update` alla chiusura della visita,
- `AuditEvent.create` viene generato automaticamente per ognuno degli eventi precedenti.

Il pulsante `Visualizza lifecycle` nel pannello dettagli mostra graficamente la sequenza degli eventi correlati al paziente o alla visita selezionata, con timeline verticale e timestamp.

## Hash-chain e verifica integrita

Ogni evento audit include il campo `previousHash` con il valore SHA-256 dell'evento immediatamente precedente nella catena. Questa struttura, denominata **hash-chain**, garantisce che qualsiasi alterazione retroattiva di un evento alteri tutti gli hash successivi, rendendola immediatamente rilevabile.

Il pulsante `Verifica integrita` apre la procedura di verifica:

- ricalcola gli hash di tutti gli eventi nell'intervallo selezionato,
- confronta i valori ricalcolati con quelli memorizzati,
- segnala eventuali discrepanze con dettaglio evento per evento.

La verifica completa di dieci anni di eventi puo richiedere alcuni minuti. Per grandi volumi, il sistema esegue la verifica in background e notifica via email il risultato.

Risultati possibili:

- **Catena integra**, nessuna alterazione rilevata, il sigillo di integrita e valido.
- **Catena alterata**, una o piu discrepanze rilevate. Il dettaglio indica l'evento o gli eventi alterati. Questo risultato e un **incidente di sicurezza grave** che richiede notifica immediata al supporto Fibonacci all'indirizzo `security@fibonacci.it` e valutazione di obbligo di notifica al Garante entro settantadue ore secondo articolo 33 GDPR.

## Esportazione

### Esportazione PDF degli eventi filtrati

Il pulsante `Esporta PDF` genera un documento contenente:

- intestazione con dati studio, range date, filtri applicati,
- tabella eventi con tutte le colonne visibili,
- per ogni evento il riferimento univoco e l'hash,
- pagina finale con il risultato della verifica integrita,
- firma elettronica del PDF in formato PAdES per garantire l'integrita del report.

Il PDF e utile per richieste delle autorita, ispezioni, audit interni o richieste di accesso da parte del paziente ai propri dati di trattamento (articolo 15 GDPR).

### Esportazione FHIR AuditEvent

Il pulsante `Export FHIR AuditEvent` produce un bundle FHIR R4 con tutti gli eventi filtrati in formato JSON, conforme allo standard `AuditEvent` di FHIR. Utile per integrazione con sistemi di SIEM aziendali (Security Information and Event Management) o per analisi forensi esterne.

## Retention

Gli eventi audit sono conservati per almeno **dieci anni** dalla data di registrazione, in coerenza con i tempi di conservazione della cartella clinica e con le buone pratiche di sicurezza ISO 27001.

La conservazione e indipendente dalla cancellazione del paziente: anche dopo cancellazione definitiva di un paziente, gli eventi audit relativi alle operazioni eseguite restano in archivio per finalita di accountability, con i dati personali del paziente pseudonimizzati e mantenuti solo l'identificativo tecnico.

La pseudonimizzazione post-cancellazione e tracciata come ulteriore evento audit, garantendo continuita della catena.

## Privacy e accessi tracciati

Ogni operazione di accesso ai dati paziente eseguita da un operatore viene registrata come evento `Patient.read` o `Encounter.read` con il dettaglio dell'operatore e del paziente coinvolto.

Questo permette al paziente di richiedere il **report degli accessi alla propria cartella** ai sensi dell'articolo 15 GDPR. La richiesta si soddisfa filtrando l'audit log per il paziente specifico ed esportando il PDF dei soli eventi a lui collegati.

L'export per il paziente esclude i dati di accesso che riguardano altri pazienti o operazioni amministrative non pertinenti.

## Suggerimenti

- Configura una verifica integrita programmata mensile in `Impostazioni > Audit > Verifica automatica` con notifica al titolare dello studio: garantisce rilevazione precoce di eventuali manomissioni.
- Salva come preset i filtri ricorrenti, ad esempio `eventi error degli ultimi sette giorni` per il monitoraggio operativo o `accessi a paziente X` per le richieste GDPR.
- L'audit log e la fonte autoritaria in caso di contestazione clinica. Esporta in PDF i log relativi a una specifica visita contestata e conservali con la documentazione della pratica.
- Gli eventi `AuditEvent.read`, ovvero gli accessi all'audit log stesso, sono tracciati ricorsivamente: anche chi guarda l'audit lascia traccia. Questo previene insider access non documentato.
- Per ispezioni programmate, l'export FHIR AuditEvent in formato JSON e generalmente preferito da consulenti tecnici esterni rispetto al PDF.

## Risoluzione problemi

**Pannello audit vuoto.** Verifica nei filtri il range date: il default e gli ultimi sette giorni e potrebbe non includere il periodo cercato. Estendi il range. Se il problema persiste, verifica con l'amministratore di sistema che il proprio ruolo abbia il permesso `audit:read`.

**Verifica integrita riporta `Catena alterata`.** Si tratta di un incidente di sicurezza potenzialmente grave. Procedi nell'ordine: non chiudere la pagina e non eseguire altre operazioni; esegui screenshot del risultato; contatta immediatamente il supporto Fibonacci all'indirizzo `security@fibonacci.it` con oggetto `URGENTE - Audit chain integrity broken` allegando lo screenshot e indicando il tuo identificativo studio; mantieni traccia dell'orario in cui hai rilevato l'anomalia. Il supporto attiva la procedura di analisi forense entro due ore. In funzione delle conclusioni potrebbe essere necessaria notifica al Garante per la protezione dei dati personali entro settantadue ore.

**Esportazione PDF molto lenta o fallita.** Esportazioni di intervalli ampi (oltre dodici mesi) possono richiedere alcuni minuti. Il sistema esegue automaticamente le esportazioni grandi in background e notifica via email quando il PDF e pronto al download. Verifica nella sezione `Esportazioni > Cronologia` lo stato della richiesta.

**Operatore disattivato non compare nei filtri.** Il filtro `Operatore` mostra di default solo gli operatori attivi. Attiva la spunta `Includi operatori disattivati` per vedere anche gli account dismessi. Gli eventi storici degli operatori disattivati restano comunque visibili nella tabella generale.

**Differenze di fuso orario nei timestamp esportati.** I timestamp sono sempre memorizzati in UTC nel backend. La visualizzazione in app e nei PDF usa il fuso orario configurato in `Impostazioni > Studio > Fuso orario`. Per audit forensi interni e raccomandato esportare anche la versione UTC tramite l'export FHIR AuditEvent JSON.

## Vedi anche

- [Generare e firmare consensi SICPRE in PDF](consensi-sicpre)
- [Creazione e gestione anagrafica paziente](anagrafica-paziente)
- [Primo accesso e configurazione iniziale](installazione)

Ultima revisione: {ULTIMA_REVISIONE}
