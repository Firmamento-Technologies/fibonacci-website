# Sub-responsabili del trattamento

**Versione 1.0 — Ultima revisione: {ULTIMA_REVISIONE}**

Il presente documento costituisce l'**Allegato B** dell'Accordo per il Trattamento dei Dati (DPA) ex art. 28 del Regolamento (UE) 2016/679 (di seguito, "GDPR") stipulato tra il Titolare del trattamento (medico cliente) e Fibonacci in qualità di Responsabile del trattamento per la fornitura del software SaaS Fibonacci. Esso elenca in modo nominativo i sub-responsabili autorizzati ai sensi dell'art. 28.2 e 28.4 GDPR ed è soggetto ad aggiornamento continuo.

---

## 1. Premessa e disciplina

1.1. **Definizione di sub-responsabile**. Si definisce sub-responsabile del trattamento (di seguito, "Sub-responsabile") il soggetto terzo, persona fisica o giuridica, di cui il Responsabile si avvale per l'esecuzione di specifiche attività di trattamento per conto del Titolare, ai sensi dell'art. 28, paragrafi 2 e 4, del GDPR.

1.2. **Autorizzazione generale ex art. 28.2 GDPR**. Con la sottoscrizione del DPA il Titolare conferisce al Responsabile autorizzazione scritta generale al ricorso ai Sub-responsabili indicati nel presente Allegato B, riconoscendo che ciascuno di essi è stato selezionato dal Responsabile sulla base di un giudizio di affidabilità e di adeguatezza delle garanzie offerte in termini di sicurezza tecnica e organizzativa del trattamento, conformemente all'art. 28, paragrafo 1, GDPR.

1.3. **Catena contrattuale**. Il Responsabile stipula con ciascun Sub-responsabile un contratto scritto che impone i medesimi obblighi di protezione dei dati previsti nel DPA tra Titolare e Responsabile, in particolare in materia di riservatezza, misure di sicurezza, assistenza al Titolare nell'esercizio dei diritti degli interessati e cooperazione con l'Autorità di controllo. Il Responsabile risponde nei confronti del Titolare dell'inadempimento dei Sub-responsabili agli obblighi di protezione dei dati, ai sensi dell'art. 28, paragrafo 4, GDPR.

1.4. **Obbligo informativo e diritto di obiezione**. Qualsiasi modifica dell'elenco dei Sub-responsabili, ivi inclusa l'aggiunta di un nuovo Sub-responsabile, la sostituzione di un Sub-responsabile esistente o la cessazione del rapporto con un Sub-responsabile, è comunicata dal Responsabile al Titolare con **preavviso di almeno 30 (trenta) giorni** rispetto alla data di efficacia della modifica, mediante comunicazione email all'indirizzo del Titolare risultante dal Contratto di Servizio e contestuale aggiornamento della presente pagina pubblicata all'indirizzo `https://fibonacci.it/sub-responsabili`.

1.5. **Esercizio del diritto di obiezione**. Entro il termine di 30 giorni di cui al punto 1.4, il Titolare ha facoltà di obiettare motivatamente alla modifica proposta. La procedura applicabile in caso di obiezione è disciplinata al paragrafo 3 del presente Allegato.

1.6. **Trasparenza**. Il presente elenco è reso pubblico al fine di consentire al Titolare di verificare, anteriormente alla sottoscrizione del Contratto di Servizio e durante l'intera durata del rapporto, l'identità e la collocazione dei soggetti che intervengono nella filiera del trattamento.

---

## 2. Elenco dei sub-responsabili autorizzati

I sub-responsabili attualmente autorizzati alla data di ultima revisione del presente documento sono i seguenti.

### 2.1. Hetzner Online GmbH

- **Denominazione legale**: Hetzner Online GmbH
- **Sede legale**: Industriestr. 25, 91710 Gunzenhausen, Germania
- **Categoria di servizio**: hosting infrastruttura applicativa, database relazionale PostgreSQL, Object Storage per fotografie cliniche cifrate, esecuzione di backup periodici off-site
- **Tipologia di dati trattati**: categorie particolari di dati ai sensi dell'art. 9 GDPR (dati sanitari, anamnesi, referti, prescrizioni), dati anagrafici dei pazienti, fotografie cliniche. Tutti i dati a riposo sono cifrati con algoritmo AES-256; le chiavi di cifratura sono gestite dal Responsabile e non sono nella disponibilità del fornitore
- **Localizzazione del trattamento**: datacenter di Falkenstein (FSN1), Germania, Unione Europea
- **Base giuridica del trasferimento**: trattamento integralmente svolto all'interno del territorio dell'Unione Europea; non si configura alcun trasferimento di dati verso paesi terzi ai sensi del Capo V del GDPR
- **Privacy policy del fornitore**: [https://www.hetzner.com/legal/privacy-policy](https://www.hetzner.com/legal/privacy-policy)
- **DPA del fornitore**: [https://www.hetzner.com/legal/order-processing/](https://www.hetzner.com/legal/order-processing/)
- **Note operative**: il fornitore opera in qualità di mero infrastructure provider; non ha accesso applicativo né logico ai dati clinici, che risiedono in volumi cifrati la cui chiave è esclusivamente nella disponibilità del Responsabile

### 2.2. Brevo SAS (già Sendinblue)

- **Denominazione legale**: Brevo SAS (denominazione precedente: Sendinblue SAS)
- **Sede legale**: 106 Boulevard Haussmann, 75008 Parigi, Francia
- **Categoria di servizio**: invio di email transazionali, ivi incluse conferme e promemoria di appuntamento, notifiche di sistema, comunicazioni di recupero password e fatturazione
- **Tipologia di dati trattati**: indirizzo email del destinatario, nominativo del destinatario, contenuto testuale del messaggio email, log tecnici di invio e di recapito. **Non riceve dati sanitari di dettaglio clinico**; i messaggi sono limitati a informazioni operative (data, ora, sede dell'appuntamento) e a comunicazioni di servizio
- **Localizzazione del trattamento**: server ubicati nell'Unione Europea (Francia e Germania)
- **Base giuridica del trasferimento**: trattamento integralmente svolto all'interno del territorio dell'Unione Europea
- **Privacy policy del fornitore**: [https://www.brevo.com/legal/privacypolicy/](https://www.brevo.com/legal/privacypolicy/)
- **DPA del fornitore**: [https://www.brevo.com/legal/termsofuse/#dpa](https://www.brevo.com/legal/termsofuse/#dpa)
- **Note operative**: il contenuto dei messaggi è strutturato in modo da non veicolare informazioni cliniche identificative; il riferimento alla prestazione sanitaria è mantenuto generico

### 2.3. Mistral AI SAS

- **Denominazione legale**: Mistral AI SAS
- **Sede legale**: 15 rue des Halles, 75001 Parigi, Francia
- **Categoria di servizio**: trascrizione automatica del parlato (Speech-to-Text) tramite il modello Voxtral per la funzionalità di dettatura medica integrata nel Software
- **Tipologia di dati trattati**: tracce audio temporanee della dettatura del Titolare, che possono contenere riferimenti diretti o indiretti a categorie particolari di dati ai sensi dell'art. 9 GDPR. L'audio è inviato in streaming via API HTTPS e processato in finestra temporanea
- **Localizzazione del trattamento**: server ubicati nell'Unione Europea
- **Base giuridica del trasferimento**: trattamento svolto all'interno del territorio dell'Unione Europea
- **Privacy policy del fornitore**: [https://mistral.ai/terms/#privacy-policy](https://mistral.ai/terms/#privacy-policy)
- **DPA del fornitore**: condizioni enterprise di Mistral AI, sottoscritte dal Responsabile al momento dell'attivazione del servizio; copia disponibile su richiesta scritta del Titolare
- **Note operative**: l'audio non è persistito dal fornitore oltre il tempo strettamente necessario al completamento della trascrizione (retention zero). Il Responsabile ha selezionato la configurazione contrattuale che esclude l'utilizzo dell'input dei clienti API per l'addestramento dei modelli (opt-out training), in assenza di opt-in esplicito. Il testo trascritto restituito dal servizio è immediatamente trasferito nell'infrastruttura del Responsabile presso Hetzner e non resta in carico al fornitore

### 2.4. Stripe Payments Europe Limited

- **Denominazione legale**: Stripe Payments Europe Limited
- **Sede legale**: 1 Grand Canal Street Lower, Grand Canal Dock, Dublino, Irlanda
- **Categoria di servizio**: gestione dell'abbonamento al Servizio Fibonacci, addebito ricorrente su carta di credito o strumento di pagamento equivalente, emissione della fatturazione del Titolare nei confronti del Responsabile
- **Tipologia di dati trattati**: dati anagrafici e dati di pagamento del Titolare medico (intestazione, partita IVA, indirizzo di fatturazione, dati dello strumento di pagamento). **Non riceve in alcun caso dati clinici dei pazienti**, né dati identificativi degli stessi
- **Localizzazione del trattamento**: server primari ubicati nell'Unione Europea (Irlanda); replica di resilienza presso datacenter localizzati negli Stati Uniti d'America e nel Regno Unito
- **Base giuridica del trasferimento**: per la replica negli Stati Uniti, clausole contrattuali tipo della Commissione UE di cui alla Decisione 2021/914 (modulo Responsabile-Sub-responsabile) integrate da misure supplementari; per il Regno Unito, decisione di adeguatezza della Commissione UE del 28 giugno 2021
- **Privacy policy del fornitore**: [https://stripe.com/it/privacy](https://stripe.com/it/privacy)
- **DPA del fornitore**: [https://stripe.com/it/legal/dpa](https://stripe.com/it/legal/dpa)
- **Note operative**: la filiera di pagamento è segregata dalla filiera clinica; il riconciliamento tra abbonamento e tenant Fibonacci avviene per identificativo opaco che non veicola dati clinici

### 2.5. Cloudflare, Inc.

- **Denominazione legale**: Cloudflare, Inc.
- **Sede legale**: 101 Townsend Street, San Francisco, CA 94107, Stati Uniti d'America
- **Categoria di servizio**: DNS autoritativo per il dominio `fibonacci.it` ed i relativi sottodomini, proxy HTTPS, rete di distribuzione di contenuti (CDN) per gli asset statici dell'applicazione, protezione contro attacchi distribuiti (DDoS), Web Application Firewall (WAF)
- **Tipologia di dati trattati**: metadati di traffico (indirizzo IP del visitatore, header HTTP, URL richiesto, user agent, timestamp). **Non riceve dati clinici in chiaro**: il traffico HTTPS è cifrato end-to-end con protocollo TLS 1.3 sino al backend ubicato presso Hetzner in Germania. Cloudflare opera come proxy di rete senza decifrare i contenuti applicativi sensibili
- **Localizzazione del trattamento**: rete globale Cloudflare con punti di presenza (POP) distribuiti su scala mondiale; per il traffico originato da utenti europei è prioritizzato l'utilizzo di POP situati nell'Unione Europea
- **Base giuridica del trasferimento**: clausole contrattuali tipo della Commissione UE di cui alla Decisione 2021/914 (modulo Titolare-Responsabile e, ove applicabile, modulo Responsabile-Sub-responsabile), integrate da misure supplementari di natura tecnica, organizzativa e contrattuale conformi alle Raccomandazioni 01/2020 dell'EDPB. Le misure supplementari includono in particolare la cifratura TLS end-to-end fra client e backend, l'assenza strutturale di esposizione in chiaro dei dati sanitari verso il fornitore e la configurazione del prodotto Cloudflare in modalità "proxy only" per i sottodomini applicativi
- **Privacy policy del fornitore**: [https://www.cloudflare.com/privacypolicy/](https://www.cloudflare.com/privacypolicy/)
- **DPA del fornitore**: [https://www.cloudflare.com/cloudflare-customer-dpa/](https://www.cloudflare.com/cloudflare-customer-dpa/)
- **Note operative**: il fornitore non riceve in nessun caso il contenuto delle cartelle cliniche, delle fotografie, dei referti o di qualsiasi altra informazione sanitaria, in quanto la cifratura TLS rimane integra fra il browser del Titolare ed il backend in Germania; i dati a disposizione del fornitore sono limitati a metadati di rete necessari al routing e alla protezione del traffico

---

## 3. Procedura di modifica dell'elenco e diritto di obiezione

3.1. **Notifica preventiva**. Qualsiasi modifica del presente elenco (aggiunta di un nuovo Sub-responsabile, sostituzione di un Sub-responsabile esistente, cessazione di un rapporto di sub-responsabilità) è notificata dal Responsabile al Titolare con **preavviso di almeno 30 (trenta) giorni** rispetto alla data di efficacia della modifica. La notifica è inviata via email all'indirizzo di contatto del Titolare risultante dal Contratto di Servizio e contestualmente la presente pagina è aggiornata.

3.2. **Contenuto della notifica**. La notifica indica: la denominazione e la sede del Sub-responsabile interessato, la categoria di servizio affidata, la tipologia di dati trattati, la localizzazione del trattamento, la base giuridica del trasferimento ove applicabile, le garanzie adottate, la data di efficacia.

3.3. **Diritto di obiezione**. Entro 30 giorni dalla ricezione della notifica, il Titolare può obiettare per iscritto alla modifica proposta, indicando le ragioni dell'obiezione. L'obiezione è inviata all'indirizzo `privacy@fibonacci.it`, ovvero per posta elettronica certificata o raccomandata con avviso di ricevimento all'indirizzo della sede del Responsabile.

3.4. **Gestione dell'obiezione**. Ricevuta l'obiezione, il Responsabile valuta in buona fede soluzioni alternative idonee a soddisfare l'esigenza tecnica o organizzativa sottesa alla modifica, fermo restando il diritto del Responsabile di adottare la soluzione tecnica ritenuta più adeguata per la prosecuzione del Servizio.

3.5. **Mancato accordo**. In assenza di accordo tra le Parti entro un termine ragionevole successivo all'obiezione, ciascuna Parte ha facoltà di recedere dal Contratto di Servizio con preavviso scritto, ferma restando l'applicazione delle previsioni contrattuali in materia di restituzione e cancellazione dei dati al termine del rapporto.

3.6. **Modifiche urgenti per ragioni di sicurezza**. Qualora la modifica si renda necessaria con carattere d'urgenza per ragioni di sicurezza, continuità del servizio o per ottemperare a un obbligo di legge, il Responsabile può procedere con un preavviso inferiore, comunicandone tempestivamente le ragioni al Titolare. In tale ipotesi, il diritto di obiezione del Titolare e le previsioni dei punti 3.3, 3.4 e 3.5 si applicano comunque, ancorché ex post.

3.7. **Assenza di obiezione**. La mancata obiezione del Titolare entro il termine di 30 giorni equivale ad accettazione della modifica.

---

## 4. Registro versioni

| Versione | Data | Modifica |
| --- | --- | --- |
| 1.0 | {ULTIMA_REVISIONE} | Prima pubblicazione dell'elenco nominativo dei sub-responsabili del trattamento, comprensivo di Hetzner Online GmbH, Brevo SAS, Mistral AI SAS, Stripe Payments Europe Limited e Cloudflare, Inc. |

---

## 5. Contatti

Per qualsiasi richiesta di chiarimento, esercizio del diritto di obiezione o richiesta di documentazione integrativa relativa ai sub-responsabili autorizzati, il Titolare può rivolgersi ai seguenti recapiti:

- **Responsabile della protezione dei dati (DPO)**: `dpo@fibonacci.it`
- **Ufficio privacy**: `privacy@fibonacci.it`
- **Fibonacci** — sede legale: Genova, Italia

---

> Il presente documento è aggiornato alla data indicata in apertura ed è soggetto a revisione continua. Il Titolare può richiedere in qualsiasi momento conferma scritta della versione vigente del presente elenco, scrivendo all'indirizzo `privacy@fibonacci.it`. In caso di discordanza tra la copia stampata e la versione pubblicata all'indirizzo `https://fibonacci.it/sub-responsabili`, prevale la versione pubblicata online.
