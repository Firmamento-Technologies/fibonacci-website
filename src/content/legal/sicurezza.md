# Sicurezza e protezione dei dati

**Versione 0.1 · Ultima revisione: {ULTIMA_REVISIONE}**

{AVVISO_BOZZA}

La presente scheda tecnica descrive le misure di sicurezza, tecniche e organizzative, adottate da Fibonacci (di seguito, "Fibonacci" o il "Responsabile") nell'erogazione del software SaaS di cartella clinica digitale Fibonacci (di seguito, il "Servizio" o "Fibonacci"). Il documento è reso ai sensi dell'articolo 32 del Regolamento (UE) 2016/679 (di seguito, "GDPR") e costituisce l'Allegato A dell'Accordo per il Trattamento dei Dati (DPA) sottoscritto dal medico cliente in qualità di Titolare del trattamento. Le misure descritte si applicano al trattamento di categorie particolari di dati ai sensi dell'art. 9 GDPR (dati relativi alla salute) effettuato per conto del Titolare nell'ambito del Servizio.

Il documento è pubblicato all'indirizzo {URL_SITO}/sicurezza ed è soggetto ad aggiornamenti periodici in funzione dell'evoluzione tecnologica del Servizio e dello stato dell'arte in materia di sicurezza informatica. Le modifiche tecniche significative sono notificate ai Titolari clienti con le modalità indicate in calce al presente documento.

---

## 1. Architettura della sicurezza

L'architettura di sicurezza di Fibonacci è strutturata su tre livelli concentrici, ciascuno dei quali realizza controlli indipendenti e complementari. La logica di difesa è quella della profondità (defense in depth): il fallimento di un singolo livello non è sufficiente a compromettere la riservatezza, l'integrità o la disponibilità dei dati clinici.

### 1.1 Livello di rete (perimetro)

Il perimetro di rete è ospitato presso l'infrastruttura di Aruba S.p.A., su rete italiana e quindi all'interno dell'Unione Europea. Il traffico in ingresso transita esclusivamente attraverso un reverse proxy Caddy che termina TLS 1.3 e applica i header di sicurezza HTTP descritti alla sezione 6. Il backend applicativo non è esposto direttamente all'Internet pubblico: i container Docker comunicano su una rete privata, e l'accesso amministrativo agli host è consentito esclusivamente da indirizzi IP autorizzati tramite chiave SSH, senza autenticazione a password.

**Non è interposto alcun intermediario di rete.** Il dominio del Servizio risolve direttamente sull'indirizzo dell'infrastruttura sopra descritta: non sono impiegati reti di distribuzione di contenuti, proxy inversi di terze parti o Web Application Firewall gestiti da terzi, e non esiste alcun punto in cui un soggetto diverso dal Responsabile termini la connessione cifrata proveniente dal browser. La circostanza è verificabile dall'esterno con una interrogazione DNS sul dominio del Servizio.

### 1.2 Livello applicativo

A livello applicativo Fibonacci implementa autenticazione multi-fattore, sessione hardened, controllo degli accessi basato su ruoli (RBAC) e compartimentazione FHIR per tenant medico. Ogni richiesta è validata da middleware di sanitizzazione dell'input lato server, controllo CSRF e rate limiting per utente e per indirizzo IP. La logica applicativa è scritta in linguaggi a tipizzazione forte e segue le pratiche di sviluppo sicuro descritte alla sezione 7.

### 1.3 Livello del dato

A livello del dato Fibonacci applica cifratura su due assi: cifratura del filesystem a livello volume per l'intera istanza PostgreSQL e cifratura applicativa AES-256 GCM per le colonne contenenti identificativi sensibili e per i file foto. Le chiavi di cifratura applicative (Key Encryption Keys, KEK) sono gestite server-side e non transitano mai verso il browser del medico utente. Ogni operazione CRUD sulle risorse cliniche è tracciata in un audit log immutabile in formato FHIR AuditEvent firmato in hash-chain SHA-256 (sezione 4).

### 1.4 Diagramma di flusso semplificato

```
                              TLS 1.3, senza intermediari
   [Browser medico]  ----------------------------------->  [Caddy reverse proxy / Aruba IT]
                       (cookie httpOnly Secure)                     |
                                                                    |  rete privata
                                                                    v
                                                       [Container app Fibonacci]
                                                                    |
                                       +----------------------------+----------------------------+
                                       |                            |                            |
                                       v                            v                            v
                              [PostgreSQL cifrato]      [Storage foto AES-256]         [Audit log hash-chain]
                                       |
                                       v
                                  [Backup giornaliero cifrato AES-256]
```

---

## 2. Cifratura

La cifratura è la misura principale di mitigazione del rischio di esfiltrazione e di accesso non autorizzato ai dati. Fibonacci applica cifratura in transito, cifratura a riposo del filesystem e cifratura applicativa colonnare e di payload binari.

| Componente | Cosa fa (WHAT) | Rischio mitigato (WHY) | Tecnologia e parametri (HOW) |
| --- | --- | --- | --- |
| Trasporto client-server | Cifra l'intera comunicazione tra browser del medico e backend | Intercettazione su rete, attacchi man-in-the-middle | TLS 1.3 con cipher suite AEAD raccomandate IETF, HSTS preload, Forward Secrecy mediante ECDHE |
| Filesystem database | Cifra a livello blocco il volume del database PostgreSQL | Esfiltrazione fisica dei dischi, accesso non autorizzato al volume | Cifratura del filesystem a livello volume con chiavi gestite dal sistema host, derivate da master key non residente sull'istanza |
| Cifratura applicativa colonnare | Cifra a livello applicazione i campi più sensibili della cartella prima della scrittura su database | Esfiltrazione del database, accesso da parte di operatori dell'infrastruttura | AES-256 GCM con integrità garantita dall'auth-tag, nonce univoco per record, KEK server-side |
| Cifratura foto cliniche | Cifra i file binari delle foto prima dello storage | Esfiltrazione dello storage oggetti, accesso non autorizzato ai file | AES-256 GCM con KEK gestita dal sidecar pdf-signer, decifratura on-demand server-side al momento della consegna autorizzata |
| Backup | Cifra il pacchetto di backup prima del trasferimento off-site | Esfiltrazione del backup, perdita di un supporto | AES-256 sul pacchetto di snapshot, chiave separata dalla KEK applicativa |

### 2.1 Gestione delle chiavi

Le chiavi di cifratura applicative (Key Encryption Keys) sono detenute server-side e non sono mai esposte al browser del medico utente. La derivazione delle Data Encryption Keys (DEK) per singolo record avviene in memoria sul backend al momento dell'operazione di scrittura o lettura. Le chiavi non sono incluse nei backup nello stesso pacchetto dei dati cifrati. La rotazione delle KEK è una procedura documentata e re-cifra incrementalmente i dati esistenti senza interruzione del servizio.

### 2.2 Integrità

La modalità GCM (Galois/Counter Mode) garantisce simultaneamente confidenzialità e integrità. L'auth-tag verifica che il payload non sia stato alterato e respinge ogni tentativo di manipolazione del ciphertext. Tale proprietà è particolarmente rilevante per le foto cliniche, dove la modifica di un singolo bit invaliderebbe il valore probatorio del dato.

---

## 3. Controllo accessi e autenticazione

L'identità digitale è la primaria superficie di attacco di un applicativo sanitario in cloud. Fibonacci adotta autenticazione multi-fattore, hashing robusto delle password, sessione hardened e compartimentazione del dominio dati su base ruolo e su base FHIR.

### 3.1 Autenticazione

| Misura | WHAT | WHY | HOW |
| --- | --- | --- | --- |
| Hashing password | Memorizza solo il digest non reversibile della password | Esfiltrazione del database utenti, brute force offline | bcrypt con cost factor calibrato in funzione del carico, salt random per utente |
| MFA TOTP | Richiede secondo fattore al login | Furto credenziali, riuso password compromesse, phishing | RFC 6238 TOTP a 30 secondi, obbligatorio per ruoli admin, raccomandato e attivabile dal medico per il proprio account |
| Recovery codes | Consente recupero account in assenza del dispositivo TOTP | Smarrimento dispositivo, lock-out utente | Codici monouso generati al setup MFA, hash-only su database, invalidati dopo utilizzo |
| Rate limiting login | Blocca tentativi automatizzati | Brute force, credential stuffing | Throttling per IP e per utente sulle endpoint login, MFA verify e dettatura |

### 3.2 Sessione

Le sessioni utente sono gestite mediante cookie httpOnly, Secure e SameSite=Strict. L'attributo httpOnly impedisce l'accesso al cookie da JavaScript lato client, riducendo l'impatto di eventuali vulnerabilità XSS. L'attributo Secure forza la trasmissione solo su TLS. L'attributo SameSite=Strict mitiga le classi di attacco di tipo cross-site request forgery e cross-site leak. Il token di sessione è soggetto a rotazione: ogni elevazione di privilegio (login, cambio password, attivazione MFA) emette un nuovo identificativo e invalida il precedente.

### 3.3 RBAC e compartimentazione

L'accesso alle risorse cliniche è regolato da un modello RBAC con i seguenti ruoli minimi:

| Ruolo | Capacità tipiche |
| --- | --- |
| admin | Configurazione dell'organizzazione, gestione utenti, accesso al pannello audit, nessun accesso clinico di default |
| medico | Accesso completo ai propri pazienti, creazione cartelle, dettatura, firma consensi |
| segreteria | Accesso anagrafica e agenda, accesso clinico limitato secondo policy del Titolare |
| utente | Profilo minimo, accesso self-service alla propria configurazione |

Sopra il modello RBAC opera la compartimentazione FHIR via AccessPolicy Medplum: ogni medico è isolato sui propri pazienti, le query FHIR sono filtrate a livello server e il tentativo di lettura cross-tenant restituisce una negazione, registrata sull'audit log. La compartimentazione è la misura principale di mitigazione del rischio di lateral movement e di accesso non autorizzato tra studi clinici distinti che condividono la stessa istanza.

---

## 4. Integrità e tracciabilità

Per le applicazioni sanitarie l'integrità del dato è funzionale alla sua valenza probatoria e clinica. Fibonacci implementa un audit log immutabile in formato FHIR AuditEvent con concatenazione crittografica delle voci (hash-chain).

### 4.1 Audit log

Ogni operazione CRUD sulle risorse FHIR (Patient, Encounter, Observation, Condition, MedicationStatement, DocumentReference, Consent, ImagingStudy e analoghe) genera una voce AuditEvent contenente:

- identificativo dell'attore (medico, ruolo, sessione);
- timestamp UTC ad alta risoluzione;
- tipo di azione (create, read, update, delete, sign);
- riferimento alla risorsa coinvolta;
- esito (success, failure) e ragione dell'eventuale negazione;
- indirizzo IP di origine e user agent.

### 4.2 Hash-chain

Ogni voce di audit incorpora il digest SHA-256 della voce precedente, costruendo una catena di hash analoga a un registro append-only. Qualunque manipolazione retroattiva di una voce intermedia provocherebbe la rottura della catena e sarebbe rilevabile mediante verifica deterministica del registro. Il digest dell'ultima voce è esportabile come prova di integrità periodica.

### 4.3 Accesso e retention

L'audit log è accessibile al Titolare attraverso la sezione /audit dell'area riservata, con filtri per attore, risorsa e finestra temporale. La conservazione è di dieci anni dall'evento, in coerenza con l'obbligo di conservazione della documentazione sanitaria. Allo scadere il record è cancellato in modo sicuro o anonimizzato secondo le istruzioni del Titolare.

---

## 5. Disponibilità e backup

La continuità di accesso ai dati clinici è una proprietà di sicurezza al pari di riservatezza e integrità, ed è oggetto specifico dell'art. 32 par. 1 lett. b e c GDPR.

| Misura | WHAT | WHY | HOW |
| --- | --- | --- | --- |
| Backup giornaliero | Salva uno snapshot quotidiano del database e degli storage | Perdita dati per incidente, ransomware, errore operativo | Snapshot crittografato AES-256, generato in finestra notturna a basso carico |
| Retention 30 giorni | Mantiene 30 versioni rolling del backup | Esfiltrazione lenta, corruzione non immediatamente rilevata | Conservazione dei pacchetti cifrati con rotazione a 30 giorni |
| Archivio continuo dei log di transazione | Consente il ripristino a un istante preciso e non solo all'ultimo snapshot notturno | Perdita delle ore successive all'ultimo backup | Archiviazione dei Write-Ahead Log, con lavoro pianificato ogni 5 minuti |
| RPO 24h | Definisce il punto massimo di perdita dati accettabile | Vincolo di pianificazione del backup | Garantito dalla frequenza di backup giornaliera |
| RTO 24h | Definisce il tempo massimo di ripristino del servizio | Vincolo di pianificazione del disaster recovery | Procedura di ripristino documentata, testata trimestralmente con misurazione del tempo di ricovero |

### 5.1 Copia fuori sede: limite dichiarato

⚠️ **Alla data di questa revisione la copia di sicurezza risiede sulla stessa macchina che protegge.** L'impianto per la replica presso un fornitore terzo è installato e attivo (il lavoro pianificato gira, e in assenza di una destinazione configurata lo registra esplicitamente nei propri log), ma la destinazione remota non è ancora stata acquistata e configurata. La conseguenza va detta per intero: **oggi la perdita del fornitore di hosting comporterebbe la perdita del sistema e della sua copia insieme.**

Il limite è dichiarato qui, e non in una nota a piè di pagina, perché è precisamente il genere di informazione che un Titolare deve conoscere **prima** di affidare dati a un Responsabile, e perché la copia fuori sede è oggetto specifico dell'art. 32 par. 1 lett. c) GDPR. La destinazione remota sarà un fornitore **diverso** da quello che ospita l'infrastruttura primaria, e situato nell'Unione Europea: una copia conservata dallo stesso fornitore non è una copia fuori sede.

Il presente paragrafo sarà sostituito dalla descrizione della misura attiva quando questa sarà in esercizio e verificata.

### 5.2 Test di ripristino

Su base trimestrale viene eseguito un test di ripristino completo a partire dal backup più recente, su istanza non di produzione, verificando l'integrità del dato ripristinato e il tempo effettivo di recupero. L'esito del test è registrato e conservato a fini di evidenza ex art. 32 par. 1 lett. d GDPR (procedura per testare, verificare e valutare regolarmente l'efficacia delle misure tecniche e organizzative).

---

## 6. Hardening applicativo

Fibonacci adotta una configurazione di hardening del front-end e del back-end finalizzata a ridurre la superficie di attacco delle classi OWASP Top 10 più rilevanti per applicazioni web.

| Controllo | WHAT | WHY | HOW |
| --- | --- | --- | --- |
| Content Security Policy strict | Limita le sorgenti consentite per script, stili, immagini e connessioni | Cross-site scripting, data exfiltration | CSP strict senza inline script, allowlist esplicita delle sole origini necessarie |
| HSTS preload | Forza il browser a contattare il dominio solo via HTTPS, anche al primo accesso | Strip-down a HTTP, attacchi su Wi-Fi non fidato | Header Strict-Transport-Security con max-age elevato e flag preload, dominio iscritto alla preload list |
| X-Frame-Options DENY | Vieta l'inclusione del Servizio in iframe esterni | Clickjacking, UI redress | Header X-Frame-Options: DENY su ogni risposta del back-end applicativo |
| X-Content-Type-Options nosniff | Disabilita il MIME sniffing del browser | Esecuzione di contenuti come tipi diversi dal dichiarato | Header X-Content-Type-Options: nosniff |
| Permissions-Policy | Disattiva API browser non necessarie (geolocation, microfono dove non richiesto, USB, serial, payment) | Riduzione della superficie di attacco lato client | Permissions-Policy restrittiva, attivazione esplicita solo dove la funzione lo richiede (es. microfono nella sola pagina di dettatura) |
| CSRF token | Protegge le richieste mutanti dalla loro emissione cross-origin | Cross-site request forgery | Token CSRF per sessione, validazione server-side su ogni POST, PUT, PATCH, DELETE |
| Rate limiting | Limita la frequenza delle richieste su endpoint sensibili | Brute force, scraping, abuso di servizi a costo (dettatura) | Limiti differenziati per IP e per utente sulle endpoint login, MFA verify, dettatura, esportazione massiva |
| Sanitizzazione input | Valida e normalizza ogni input prima dell'uso | Injection (SQL, NoSQL, comando), XSS riflesso, path traversal | Validazione schema-driven a livello server, parameterized queries verso il database, escaping output context-aware |

---

## 7. Sviluppo sicuro (Secure SDLC)

La sicurezza è integrata nel ciclo di sviluppo del software (Security by Design ex art. 25 GDPR) attraverso controlli automatici e revisione umana ad ogni modifica del codice.

| Fase | Controllo | WHY | HOW |
| --- | --- | --- | --- |
| Pre-merge | Code review obbligatoria | Difetti logici, regressioni di sicurezza | Almeno un revisore distinto dall'autore approva ogni pull request |
| Pre-merge | Static analysis SAST | Vulnerabilità di pattern (injection, auth bypass, secret leak) | Semgrep e CodeQL eseguiti su ogni pull request, blocco del merge in caso di finding High o Critical |
| Pre-merge | Dependency scanning | Vulnerabilità di librerie terze, supply chain | npm audit e Dependabot attivi, alert automatici per CVE alte e critiche, upgrade tempestivo |
| Pre-merge | Test E2E | Regressioni funzionali su flussi critici | Suite Playwright sui flussi di login, MFA, creazione cartella, dettatura, consenso, export |
| Post-deploy | Pen test OWASP ZAP baseline | Vulnerabilità di runtime e di configurazione | Esecuzione mensile su ambiente di produzione, triage e remediation dei finding non falsi positivi |
| Continuo | Training del team | Errori da disinformazione, deriva delle pratiche | Formazione annuale GDPR + sicurezza applicativa, partecipazione a OWASP community, security champion designato |

I segreti di produzione (chiavi, token, password di servizio) sono gestiti tramite secret manager dell'infrastruttura, non sono mai presenti nel codice sorgente e sono rotati periodicamente o a seguito di qualunque sospetta esposizione.

---

## 8. Gestione incidenti e data breach

Fibonacci adotta una procedura documentata di incident response che definisce ruoli, soglie di escalation, tempistiche di notifica e modalità di comunicazione con il Titolare.

### 8.1 Notifica al Titolare

In caso di violazione dei dati personali ai sensi dell'art. 4 n. 12 GDPR che coinvolga dati trattati per conto del Titolare, Fibonacci notifica al Titolare l'evento entro **24 ore dalla scoperta**. Tale termine è più stringente del termine minimo di "senza ingiustificato ritardo" previsto dall'art. 33 par. 2 GDPR per il Responsabile, e mira a fornire al Titolare un margine ampio rispetto alle 72 ore di cui all'art. 33 par. 1 per la sua eventuale notifica all'Autorità di controllo.

La notifica al Titolare include, nella misura disponibile al momento della comunicazione iniziale:

- descrizione della natura della violazione;
- categorie e numero approssimativo di interessati e di record coinvolti;
- conseguenze probabili;
- misure tecniche e organizzative adottate o proposte per il contenimento;
- punto di contatto operativo all'interno di Fibonacci.

Le informazioni mancanti al momento della prima notifica sono trasmesse al Titolare in modo incrementale appena disponibili, in coerenza con le Linee guida EDPB 9/2022.

### 8.2 Escalation e cooperazione

La procedura interna prevede l'attivazione immediata di un incident manager, l'isolamento dell'asset coinvolto, la conservazione delle evidenze forensi e l'apertura di un registro di incidente. Fibonacci coopera attivamente con il Titolare nella valutazione della rischiosità per gli interessati e nella predisposizione dell'eventuale notifica all'Autorità o agli interessati. A chiusura dell'incidente è redatto un post-mortem condiviso con il Titolare, contenente la timeline, la root cause, le azioni di rimedio attuate e le azioni correttive di lungo periodo (lessons learned).

### 8.3 Registro

Tutti gli incidenti, indipendentemente dalla loro qualificazione finale come violazione notificabile, sono registrati nel registro interno degli incidenti, conservato a fini di audit e di evidenza ex art. 33 par. 5 GDPR.

---

## 9. Trasferimenti internazionali

Per il trattamento dei dati sanitari dei pazienti, Fibonacci non effettua alcun trasferimento al di fuori dell'Unione Europea. L'intero stack applicativo, il database, lo storage delle foto e i backup risiedono presso l'infrastruttura di Aruba S.p.A., su rete italiana.

### 9.1 Assenza di intermediari extra-europei sul percorso del dato

Il percorso che il dato clinico compie fra il browser del medico e la base di dati **non attraversa alcun soggetto extra-europeo**, e non lo attraversa per costruzione e non per configurazione: non è impiegata alcuna rete di distribuzione di contenuti, alcun proxy inverso di terze parti o alcun Web Application Firewall gestito da terzi. Il dominio del Servizio risolve direttamente sull'indirizzo dell'infrastruttura, e la connessione cifrata è terminata unicamente dal reverse proxy del Responsabile.

La differenza rispetto all'assetto diffuso nel settore va detta perché è la ragione per cui questo paragrafo è breve: quando un intermediario è presente, il trasferimento extra-UE dei metadati di rete esiste e va giustificato con Clausole Contrattuali Standard e misure supplementari. Qui **non esiste il trasferimento**, quindi non serve giustificarlo. La circostanza è verificabile da chiunque, dall'esterno e senza il nostro consenso, con una interrogazione DNS sul dominio del Servizio.

### 9.2 Trasferimenti residui e loro perimetro

L'unico sub-responsabile della filiera con repliche di resilienza al di fuori dell'Unione Europea è il fornitore dei pagamenti indicato nell'Allegato B, che **non tratta dati dei pazienti** né dati clinici di alcun genere: la filiera dei pagamenti è segregata da quella clinica e la riconciliazione avviene per identificativo opaco. Per tale fornitore valgono le Clausole Contrattuali Standard di cui alla Decisione di esecuzione (UE) 2021/914.

### 9.3 Altri sub-responsabili extra-UE

Eventuali altri sub-responsabili extra-UE sono autorizzati esclusivamente con il consenso del Titolare secondo quanto disciplinato dal DPA e sono sottoposti alle medesime garanzie (SCC, misure supplementari, valutazione del rischio di trasferimento).

---

## 10. Continuità operativa

⚠️ **Questa sezione descriveva un'architettura ridondata che il Servizio non ha.** La versione precedente dichiarava distribuzione su zone di disponibilità multiple, più istanze di reverse proxy dietro health check e una replica in streaming del database con promozione automatica. Nulla di tutto ciò è in esercizio: il Servizio gira su **un solo host**, e dichiarare una ridondanza inesistente in un allegato tecnico sottoscritto è esattamente il genere di affermazione che il Titolare non può verificare da solo e su cui ha diritto di non essere ingannato.

Segue lo stato reale, distinto fra ciò che è attivo e ciò che è previsto.

| Componente | Stato | WHY | HOW |
| --- | --- | --- | --- |
| Ubicazione | **Attivo** | Giurisdizione e legge applicabile note e verificabili | Host unico presso Aruba S.p.A., rete italiana, Unione Europea |
| Isolamento di rete | **Attivo** | Riduzione della superficie esposta | Solo il reverse proxy è raggiungibile da Internet; i servizi applicativi comunicano su rete privata fra container |
| Backup giornaliero | **Attivo** | Perdita dati per incidente, errore operativo, ransomware | Snapshot cifrato notturno, con rotazione a 30 giorni |
| Ripristino a un istante preciso | **Attivo** | Perdita delle ore successive all'ultimo snapshot | Archiviazione continua dei log di transazione, lavoro pianificato ogni 5 minuti |
| Prova di ripristino | **Attivo** | Un backup mai ripristinato non è un backup | Lavoro pianificato di ripristino e verifica, con esito registrato |
| Copia fuori sede | **Previsto** | Perdita del fornitore di hosting | Vedi il limite dichiarato al paragrafo 5.1: impianto installato, destinazione remota non ancora attivata |
| Ridondanza dell'host | **Previsto** | Tolleranza al guasto della singola macchina | Non in esercizio. Un guasto dell'host comporta indisponibilità del Servizio fino al ripristino |
| Piano di continuità formalizzato | **Previsto** | Coordinamento delle azioni di ripristino | Le procedure di ripristino sono documentate ed eseguite; la loro formalizzazione in un piano approvato è successiva alla costituzione della società |

---

## 11. Formazione e governance

La sicurezza tecnica è efficace solo se accompagnata da una governance organizzativa coerente. Fibonacci integra obblighi formativi e responsabilità definite all'interno della propria struttura.

| Misura | WHAT | WHY | HOW |
| --- | --- | --- | --- |
| Training annuale | Formazione del personale tecnico su GDPR e sicurezza applicativa | Riduzione dell'errore umano, allineamento con lo stato dell'arte | Corso annuale obbligatorio per tutto il personale che accede a sistemi che trattano dati personali, attestazione conservata |
| Onboarding | Security check-list per nuovi assunti | Allineamento iniziale ai requisiti di sicurezza | Procedura formalizzata con consegna delle credenziali, attivazione MFA, lettura delle policy interne, accettazione del codice di condotta |
| Security champion | Punto di riferimento interno per le questioni di sicurezza | Sgancio rapido di domande tecniche, escalation interna | Designazione di un security champion all'interno del team tecnico |
| Accesso al codice | Principio del minimo privilegio | Riduzione del rischio di esfiltrazione interna | Accessi al repository e all'infrastruttura concessi per ruolo, revisione periodica delle abilitazioni |
| Asset management | Inventario degli asset informativi | Conoscenza completa del perimetro da proteggere | Inventario aggiornato di sistemi, servizi, dipendenze e flussi di dato |

---

## 12. Certificazioni e standard di riferimento

Allo stato attuale Fibonacci **non è certificata ISO/IEC 27001**. Pur in assenza della certificazione, Fibonacci adotta volontariamente i controlli applicabili dell'Annex A della norma ISO/IEC 27001:2022 come quadro di riferimento per la propria postura di sicurezza, in particolare nelle aree dei controlli organizzativi, dei controlli delle persone, dei controlli fisici e dei controlli tecnologici. Tale riferimento non costituisce dichiarazione di conformità certificata e non deve essere inteso come claim di certificazione.

### 12.0 Che cosa è certificato, e da chi: la distinzione che conta

Le certificazioni che coprono una parte del Servizio appartengono al **fornitore dell'infrastruttura**, non a Fibonacci. La distinzione è dichiarata qui perché è quella che un fornitore poco scrupoloso omette, esibendo il marchio del proprio ospitante come se fosse il proprio.

| Livello | Chi risponde | Che cosa è certificato o dichiarato | Come si verifica |
| --- | --- | --- | --- |
| Data center e infrastruttura | Aruba S.p.A. | Certificazione **ISO/IEC 27001**; adesione al **CISPE Data Protection Code of Conduct**, codice di condotta ex **art. 40 GDPR** approvato dalla CNIL nel 2021 | Registro pubblico CISPE; dichiarazioni pubblicate dal fornitore |
| Applicazione, dati, processi | Fibonacci | **Nessuna certificazione di terza parte.** Conformità al GDPR autodichiarata sulla base della documentazione interna e delle evidenze conservate | Il presente documento, il DPA e l'Allegato B, tutti pubblici e senza modulo di richiesta |

⚠️ **Che cosa questo significa in concreto**: il fatto che il data center sia certificato ISO/IEC 27001 dice qualcosa sulla sicurezza fisica e organizzativa della sala macchine, e **nulla** sulla qualità del codice applicativo di Fibonacci, sul suo modello di controllo accessi o sulla sua gestione delle chiavi. Chi presenta la certificazione del proprio ospitante come garanzia sul proprio software sta rispondendo a una domanda diversa da quella che gli è stata posta.

La conformità al GDPR, e in particolare ai principi di sicurezza by design e by default (art. 25 GDPR) e alle misure tecniche e organizzative adeguate (art. 32 GDPR), è autocertificata dal Responsabile sulla base della documentazione interna e delle evidenze di processo conservate.

Tra gli ulteriori standard e linee guida considerati nella progettazione delle misure descritte nel presente documento, sebbene non oggetto di certificazione, rientrano:

- OWASP Top 10 2021 e OWASP Application Security Verification Standard (ASVS) per le pratiche di sviluppo sicuro e di hardening applicativo;
- NIST Special Publication 800-53 per il vocabolario dei controlli di sicurezza;
- Linee guida EDPB 9/2022 sulla notifica delle violazioni dei dati personali.

### 12.1 Roadmap di certificazione

Fibonacci ha posto come obiettivo la valutazione di avvio del percorso di certificazione ISO/IEC 27001 al raggiungimento del primo round consolidato di clienti pilot del Servizio. Lo stato di avanzamento della roadmap è comunicato in modo trasparente ai Titolari clienti attraverso aggiornamenti periodici del presente documento e, ove opportuno, attraverso comunicazioni dedicate.

### 12.2 Spazio europeo dei dati sanitari: l'obbligo che arriva

Il **Regolamento (UE) 2025/327** istituisce lo Spazio europeo dei dati sanitari (EHDS) e stabilisce un quadro armonizzato per i **sistemi di cartelle cliniche elettroniche**. Il regolamento si applica a decorrere dal **26 marzo 2027**; per i sistemi destinati al trattamento delle categorie prioritarie di dati sanitari elettronici personali di cui all'art. 14, par. 1, lettere a), b) e c), le disposizioni pertinenti si applicano dal **26 marzo 2029**.

Per un sistema di cartelle cliniche elettroniche l'assetto previsto dal regolamento comporta: redazione della **documentazione tecnica** (art. 37), **scheda informativa** che accompagna il sistema (art. 38), **dichiarazione di conformità UE** rispetto alle prescrizioni essenziali dell'**Allegato II** (art. 39), valutazione dei componenti software armonizzati in un **ambiente digitale europeo di prova** (art. 40), apposizione della **marcatura CE di conformità** (art. 41) e registrazione nella **banca dati UE** dei sistemi di cartelle cliniche elettroniche (art. 49).

**Fibonacci non è ad oggi un sistema marcato CE ai sensi del Capo III del Regolamento (UE) 2025/327, e non lo dichiara.** La marcatura non è oggi apponibile: le specifiche comuni dell'ambiente digitale europeo di prova e il formato europeo di scambio delle cartelle cliniche elettroniche sono demandati ad atti di esecuzione della Commissione.

Ciò che è possibile dichiarare oggi è lo stato del prodotto rispetto alle prescrizioni dell'Allegato II che **non dipendono** da tali atti di esecuzione:

| Prescrizione (Allegato II) | Stato | Evidenza |
| --- | --- | --- |
| 2.6 assenza di caratteristiche che rendano gravosa l'esportazione autorizzata dei dati per sostituire il sistema con un altro prodotto | **Soddisfatta** | L'esportazione integrale in formato FHIR R4 è una funzione del prodotto, disponibile al Titolare in ogni momento e senza autorizzazione del Responsabile |
| 3.1 meccanismi affidabili di identificazione e autenticazione dei professionisti sanitari | **Soddisfatta** | Sezione 3 del presente documento |
| 3.2 e 3.3 registrazione degli accessi e strumenti per esaminarne e analizzarne i dati | **Soddisfatta** | Sezione 4: registro FHIR AuditEvent con concatenazione di impronte, consultabile dal Titolare con filtri per attore, risorsa e finestra temporale |
| 3.4 supporto a periodi di conservazione e diritti di accesso differenziati per origine e categoria del dato | **Parziale** | Conservazione differenziata attiva; la granularità per origine del dato è in corso di estensione |
| 2.1, 2.2, 2.3, 2.4 interoperabilità nel formato europeo di scambio | **Non applicabile allo stato** | Il formato europeo di scambio è demandato ad atti di esecuzione non ancora adottati. Il prodotto adotta nel frattempo FHIR R4, che è la base tecnica su cui il formato europeo è costruito |

---

## 13. Contatti operativi

| Funzione | Contatto |
| --- | --- |
| Sicurezza informatica e segnalazione vulnerabilità | {EMAIL_SICUREZZA} |
| Contatto per la protezione dei dati | {EMAIL_PRIVACY} |
| Privacy e questioni di trattamento dati | {EMAIL_PRIVACY} |

Le segnalazioni di vulnerabilità sono benvenute e gestite in coerenza con le pratiche di responsible disclosure. È possibile, su richiesta del segnalante, instaurare un canale cifrato mediante chiave PGP del team di sicurezza, fornita su richiesta. Fibonacci si impegna a fornire un riscontro iniziale al segnalante entro un tempo ragionevole dalla ricezione, a non perseguire legalmente segnalazioni effettuate in buona fede e nel rispetto del perimetro indicato, e a riconoscere pubblicamente il contributo del segnalante salvo richiesta di anonimato.

---

## 14. Ultima revisione

Ultima revisione del presente documento: {ULTIMA_REVISIONE}.

> Il presente documento ha natura descrittiva ed è aggiornato alla versione attuale del software Fibonacci. Le modifiche tecniche significative alle misure di sicurezza qui descritte sono notificate ai Titolari clienti via email all'indirizzo di contatto indicato nel Contratto di Servizio, con preavviso ragionevole rispetto alla loro entrata in vigore. Versione 0.1.
