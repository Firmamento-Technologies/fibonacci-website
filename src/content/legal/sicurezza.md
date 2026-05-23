# Sicurezza e protezione dei dati

**Versione 0.1 — Ultima revisione: {ULTIMA_REVISIONE}**

La presente scheda tecnica descrive le misure di sicurezza, tecniche e organizzative, adottate da Fibonacci (di seguito, "Fibonacci" o il "Responsabile") nell'erogazione del software SaaS di cartella clinica digitale Fibonacci (di seguito, il "Servizio" o "Fibonacci"). Il documento è reso ai sensi dell'articolo 32 del Regolamento (UE) 2016/679 (di seguito, "GDPR") e costituisce l'Allegato A dell'Accordo per il Trattamento dei Dati (DPA) sottoscritto dal medico cliente in qualità di Titolare del trattamento. Le misure descritte si applicano al trattamento di categorie particolari di dati ai sensi dell'art. 9 GDPR (dati relativi alla salute) effettuato per conto del Titolare nell'ambito del Servizio.

Il documento è pubblicato all'indirizzo https://fibonacci.it/sicurezza ed è soggetto ad aggiornamenti periodici in funzione dell'evoluzione tecnologica del Servizio e dello stato dell'arte in materia di sicurezza informatica. Le modifiche tecniche significative sono notificate ai Titolari clienti con le modalità indicate in calce al presente documento.

---

## 1. Architettura della sicurezza

L'architettura di sicurezza di Fibonacci è strutturata su tre livelli concentrici, ciascuno dei quali realizza controlli indipendenti e complementari. La logica di difesa è quella della profondità (defense in depth): il fallimento di un singolo livello non è sufficiente a compromettere la riservatezza, l'integrità o la disponibilità dei dati clinici.

### 1.1 Livello di rete (perimetro)

Il perimetro di rete è ospitato presso il datacenter Hetzner Online GmbH di Falkenstein (Germania, FSN1), all'interno dello Spazio Economico Europeo. Il traffico in ingresso transita esclusivamente attraverso un reverse proxy Caddy che termina TLS 1.3 e applica i header di sicurezza HTTP descritti alla sezione 6. Il backend applicativo non è esposto direttamente all'Internet pubblico: i container Docker comunicano su una rete privata, e l'accesso amministrativo agli host è consentito esclusivamente da indirizzi IP autorizzati tramite chiave SSH, senza autenticazione a password.

Cloudflare interviene unicamente a monte come fornitore di DNS, proxy e CDN per il front-end statico e per la mitigazione di attacchi volumetrici (DDoS, rate flooding, bot abuse). Il traffico clinico applicativo viaggia in TLS 1.3 end-to-end fino al backend Hetzner: Cloudflare non dispone delle chiavi private del backend, non terminale TLS applicativo e non vede i dati sanitari in chiaro.

### 1.2 Livello applicativo

A livello applicativo Fibonacci implementa autenticazione multi-fattore, sessione hardened, controllo degli accessi basato su ruoli (RBAC) e compartimentazione FHIR per tenant medico. Ogni richiesta è validata da middleware di sanitizzazione dell'input lato server, controllo CSRF e rate limiting per utente e per indirizzo IP. La logica applicativa è scritta in linguaggi a tipizzazione forte e segue le pratiche di sviluppo sicuro descritte alla sezione 7.

### 1.3 Livello del dato

A livello del dato Fibonacci applica cifratura su due assi: cifratura del filesystem a livello volume per l'intera istanza PostgreSQL e cifratura applicativa AES-256 GCM per le colonne contenenti identificativi sensibili e per i file foto. Le chiavi di cifratura applicative (Key Encryption Keys, KEK) sono gestite server-side e non transitano mai verso il browser del medico utente. Ogni operazione CRUD sulle risorse cliniche è tracciata in un audit log immutabile in formato FHIR AuditEvent firmato in hash-chain SHA-256 (sezione 4).

### 1.4 Diagramma di flusso semplificato

```
                                  TLS 1.3
   [Browser medico]  ----------------------------------->  [Cloudflare DNS / CDN]
                       (cookie httpOnly Secure)                     |
                                                                    |  TLS 1.3 end-to-end
                                                                    v
                                                       [Caddy reverse proxy / Hetzner DE]
                                                                    |
                                                                    |  rete privata
                                                                    v
                                                       [Container app Fibonacci]
                                                                    |
                                       +----------------------------+----------------------------+
                                       |                            |                            |
                                       v                            v                            v
                              [PostgreSQL cifrato]     [Object Storage foto AES-256]    [Audit log hash-chain]
                                       |
                                       v
                                  [Backup giornaliero AES-256 -> Hetzner Object Storage EU]
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
| Retention 30 giorni | Mantiene 30 versioni rolling del backup | Esfiltrazione lenta, corruzione non immediatamente rilevata | Conservazione su Object Storage Hetzner, replicazione su zona separata |
| Off-site EU | Replica i backup in posizione geograficamente separata, sempre in UE | Disastro al sito primario, perdita totale dello storage primario | Trasferimento cifrato verso Hetzner Object Storage in datacenter EU diverso dal primario |
| RPO 24h | Definisce il punto massimo di perdita dati accettabile | Vincolo di pianificazione del backup | Garantito dalla frequenza di backup giornaliera |
| RTO 24h | Definisce il tempo massimo di ripristino del servizio | Vincolo di pianificazione del disaster recovery | Procedura di ripristino documentata, testata trimestralmente con misurazione del tempo di ricovero |

### 5.1 Test di ripristino

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

Per il trattamento dei dati sanitari dei pazienti, Fibonacci non effettua alcun trasferimento al di fuori dell'Unione Europea o dello Spazio Economico Europeo. L'intero stack applicativo, il database, lo storage delle foto e i backup risiedono presso datacenter Hetzner Online GmbH in Germania (UE).

### 9.1 Cloudflare

Fibonacci utilizza Cloudflare, Inc. (Stati Uniti) come fornitore di DNS, proxy e CDN per il dominio fibonacci.it e per il dominio applicativo. La base giuridica del trasferimento extra-UE per i dati tecnici di routing (indirizzo IP, header di richiesta, metadati di rete) è costituita dalle Clausole Contrattuali Standard adottate con Decisione di esecuzione (UE) 2021/914 della Commissione Europea, nonché dalle misure supplementari indicate nelle Raccomandazioni 01/2020 EDPB. In particolare:

- il traffico applicativo viaggia in TLS 1.3 end-to-end fino al backend Hetzner in Germania;
- Cloudflare non termina TLS applicativo e non dispone delle chiavi private del backend;
- i dati sanitari clinici non transitano in chiaro attraverso Cloudflare in nessuna fase;
- Cloudflare aderisce al Data Privacy Framework UE-USA per la quota di trasferimenti soggetti a tale meccanismo.

### 9.2 Altri sub-responsabili extra-UE

Eventuali altri sub-responsabili extra-UE sono autorizzati esclusivamente con il consenso del Titolare secondo quanto disciplinato dal DPA e sono sottoposti alle medesime garanzie (SCC, misure supplementari, valutazione del rischio di trasferimento).

---

## 10. Continuità operativa

La continuità operativa di Fibonacci è progettata per assorbire guasti hardware e degrado di singoli componenti senza interruzione del servizio percepita dall'utente.

| Componente | Misura | WHY | HOW |
| --- | --- | --- | --- |
| Datacenter | Multiple availability zone Falkenstein | Tolleranza a guasti di sala o di rete locale | Distribuzione delle istanze su zone separate del campus Hetzner FSN1 |
| Reverse proxy | Failover Caddy | Tolleranza a guasti di nodo proxy | Più istanze Caddy attive dietro health check, traffico instradato verso istanze sane |
| Database | Replica streaming WAL | Tolleranza a guasti di nodo database, RPO ridotto in caso di failover | Replica streaming Write-Ahead Log su istanza secondaria, promozione automatica su failure rilevata |
| Storage foto | Object Storage ridondante | Tolleranza a guasti di disco e di volume | Replicazione interna a livello storage |
| Backup | Off-site Object Storage EU | Tolleranza a disastro del sito primario | Trasferimento cifrato verso Object Storage in zona separata |
| Pianificazione | Business Continuity Management | Coordinamento delle azioni di ripristino | Piano BCM documentato, ruoli e responsabilità, criteri di attivazione, comunicazioni verso Titolari clienti |

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

La conformità al GDPR, e in particolare ai principi di sicurezza by design e by default (art. 25 GDPR) e alle misure tecniche e organizzative adeguate (art. 32 GDPR), è autocertificata dal Responsabile sulla base della documentazione interna e delle evidenze di processo conservate.

Tra gli ulteriori standard e linee guida considerati nella progettazione delle misure descritte nel presente documento, sebbene non oggetto di certificazione, rientrano:

- OWASP Top 10 2021 e OWASP Application Security Verification Standard (ASVS) per le pratiche di sviluppo sicuro e di hardening applicativo;
- NIST Special Publication 800-53 per il vocabolario dei controlli di sicurezza;
- Linee guida EDPB 9/2022 sulla notifica delle violazioni dei dati personali.

### 12.1 Roadmap di certificazione

Fibonacci ha posto come obiettivo la valutazione di avvio del percorso di certificazione ISO/IEC 27001 al raggiungimento del primo round consolidato di clienti pilot del Servizio. Lo stato di avanzamento della roadmap è comunicato in modo trasparente ai Titolari clienti attraverso aggiornamenti periodici del presente documento e, ove opportuno, attraverso comunicazioni dedicate.

---

## 13. Contatti operativi

| Funzione | Contatto |
| --- | --- |
| Sicurezza informatica e segnalazione vulnerabilità | `security@fibonacci.it` |
| Data Protection Officer | `dpo@fibonacci.it` |
| Privacy e questioni di trattamento dati | `privacy@fibonacci.it` |

Le segnalazioni di vulnerabilità sono benvenute e gestite in coerenza con le pratiche di responsible disclosure. È possibile, su richiesta del segnalante, instaurare un canale cifrato mediante chiave PGP del team di sicurezza, fornita su richiesta. Fibonacci si impegna a fornire un riscontro iniziale al segnalante entro un tempo ragionevole dalla ricezione, a non perseguire legalmente segnalazioni effettuate in buona fede e nel rispetto del perimetro indicato, e a riconoscere pubblicamente il contributo del segnalante salvo richiesta di anonimato.

---

## 14. Ultima revisione

Ultima revisione del presente documento: {ULTIMA_REVISIONE}.

> Il presente documento ha natura descrittiva ed è aggiornato alla versione attuale del software Fibonacci. Le modifiche tecniche significative alle misure di sicurezza qui descritte sono notificate ai Titolari clienti via email all'indirizzo di contatto indicato nel Contratto di Servizio, con preavviso ragionevole rispetto alla loro entrata in vigore. Versione 0.1.
