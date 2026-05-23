# Generare e firmare consensi informati in PDF

Questa guida descrive come generare consensi informati conformi alla **legge 219/2017** usando il **Wizard AI di Fibonacci**, validarli sezione per sezione e raccogliere la firma OTP del paziente in formato PDF/A-3b a norma. Si rivolge ai medici di medicina estetica e chirurgia plastica che operano in Italia.

Fibonacci non distribuisce modelli di terzi. Il sistema combina due fonti:

1. **5 modelli proprietari Fibonacci v0.1** già pronti per le procedure più frequenti di medicina estetica iniettiva e non chirurgica.
2. **Wizard AI generativo** che compone consensi su misura per altre 25 procedure, partendo da una library di **72 clausole giuridiche estratte da fonti della Pubblica Amministrazione italiana** (atti regionali, ASL, aziende ospedaliere) che sono di pubblico dominio per la legge 633/1941 art. 5.

Tutti gli output sono validati da tre strati anti-allucinazione (vedi Passo 4) e archiviati con sigillo elettronico avanzato e tracciatura FHIR AuditEvent.

## Prerequisiti

- Account con ruolo `medico` o `admin studio`.
- Anagrafica paziente completa con almeno nome, cognome, codice fiscale e data di nascita.
- Profilo medico dello studio configurato con dati identificativi e numero di iscrizione all'Ordine (verificare in Impostazioni → Dati studio e medico).
- Per la firma OTP: numero di cellulare del paziente registrato in anagrafica.

## Passo 1, apertura del modulo consensi

Dalla scheda visita del paziente, il tab `Consensi` apre il pannello di gestione. La schermata mostra:

- nella colonna sinistra l'elenco dei consensi già generati per il paziente, con stato `Bozza`, `Inviato`, `Firmato`, `Revocato`;
- nella colonna destra il pulsante `Nuovo consenso` che apre il Wizard AI.

I consensi già firmati restano accessibili in sola lettura. La generazione di un nuovo consenso non sovrascrive né modifica i precedenti: ogni consenso è un'entità FHIR `Consent` distinta con il suo `AuditEvent` immutabile.

In alternativa, dal menu `Consensi → Catalogo` si accede ai 5 modelli proprietari Fibonacci pronti per il download in PDF (compilati automaticamente con i dati di studio e medico). Sono utili come riferimento o per stampe rapide senza paziente in carico.

## Passo 2, Wizard AI in 4 step

Il pulsante `Nuovo consenso` apre il wizard a 4 step.

**Step 1 — Scelta procedura**: il catalogo elenca le 30 procedure disponibili divise per categoria (medicina estetica iniettiva, non chirurgica, dermatologia, follow-up). Puoi cercare per nome o partire da bianco con descrizione libera del trattamento.

**Step 2 — Parametri clinici**: campi pre-impostati per tecnica, materiali (es. tipo di filler, lotto, dispositivo laser), rischi noti specifici della procedura, alternative terapeutiche e note. Più dettagli inserisci, più alto sarà il punteggio di confidenza nel passo successivo.

**Step 3 — Generazione AI**: il sistema invoca Mistral Small 3.2 24B (ospitato in UE) e in 10-15 secondi compone le 8 sezioni obbligatorie ai sensi della legge 219/2017:

1. Identificazione paziente e contesto della prestazione
2. Descrizione clinica della procedura
3. Benefici attesi
4. Rischi documentati e probabilità realistiche
5. Alternative terapeutiche (inclusa l'astensione)
6. Conseguenze del rifiuto
7. Dichiarazione di comprensione del paziente
8. Firma e ratifica

Sotto l'output ricevi il pannello `Validazione automatica` (Passo 4).

**Step 4 — Review medica + firma**: nel passo finale spunti ciascuna delle 8 sezioni dopo averla riletta, poi invii il PDF al paziente per la firma OTP. Il bottone `Salva e invia` resta disabilitato finché non hai confermato tutte e 8 le sezioni.

## Passo 3, parametri clinici e personalizzazione

L'editor del wizard al Step 2 presenta i seguenti campi compilati o suggeriti:

- **Anagrafica**: nome, cognome, codice fiscale, data di nascita del paziente (compilati automaticamente).
- **Studio**: denominazione, P.IVA, indirizzo, telefono, PEC (compilati automaticamente dalle Impostazioni).
- **Medico esecutore**: nome, ordine professionale, numero iscrizione (compilati automaticamente).
- **Data della prestazione**: tipicamente oggi o la data dell'appuntamento collegato.
- **Tecnica**: descrizione del metodo (es. "iniezione intradermica con cannula 25G in zona vermiglio, paziente seduto, anestesia topica EMLA 30 min").
- **Materiali**: prodotti utilizzati con lotti tracciabili.
- **Rischi noti**: i rischi specifici di questa procedura con probabilità (es. "ecchimosi 5-10%, edema 48h, asimmetria <2%, ischemia rara").
- **Alternative**: opzioni alternative ragionevoli (incluso "astensione dal trattamento").
- **Note libere**: eventuali condizioni cliniche del paziente che modificano il consenso (allergie, terapie anticoagulanti).

Il livello di dettaglio che inserisci qui guida l'AI: input ricco → output ricco con citazioni puntuali. Input scarno → output generico che andrà marcato come `review_obbligatoria`.

## Passo 4, validatori anti-allucinazione

Prima che il consenso venga mostrato al medico, il sistema esegue tre validatori in sequenza:

**Validator #1 — Blacklist termini vietati**: il backend rigetta automaticamente qualsiasi output che contenga:

- nomi di marchi o sigle di società terze del settore (protezione anti-copyright);
- claim ingannevoli del tipo "risultato garantito", "100% sicuro", "guarigione garantita", "nessuna complicanza", "certifico che", "senza alcun rischio".

In caso di hit, l'output non viene mai mostrato e il sistema rigenera con prompt rafforzato.

**Validator #2 — Citation check**: verifica che il testo contenga riferimenti normativi obbligatori (`L. 219/2017`, `Cassazione`, `GDPR`). Se mancano, emette un warning ma non blocca: il medico può comunque procedere consapevolmente.

**Validator #3 — Confidence scoring per sezione**: ogni sezione delle 8 obbligatorie ottiene un punteggio `0.0-1.0` calcolato su:

- lunghezza del testo (sezioni troppo corte = confidenza bassa);
- presenza di citazioni normative inline (`legge 219`, `art.`, `gdpr`, `cassazione`, `fnomceo`, `lazio`);
- numero di clausole PA referenziate dalla library di 72 elementi.

La sezione 5 (Sottoscrizione/firma) richiede sempre review manuale a prescindere dal punteggio, essendo la più critica giuridicamente.

Se `overall_confidence < 0.7` o se sono presenti errori dalla blacklist, il sistema imposta `review_obbligatoria=true` e blocca il salvataggio finché il medico non riformula manualmente le sezioni problematiche.

In più, una frequency check segnala come warning eventuali percentuali sospette (es. "100% di rischio", "0.001% di complicanza") che spesso indicano allucinazioni numeriche dell'LLM.

## Passo 5, firma del paziente e archiviazione

Dopo la review medica (8/8 spunte attive), il pulsante `Salva e invia` diventa attivo. Cliccandolo accadono in sequenza:

1. **Generazione PDF/A-3b**: il modulo `pdf-signer` di Fibonacci converte il Markdown del consenso in PDF/A-3 conforme ISO 19005-3, con file XML embedded per la validazione long-term. Questo è il formato richiesto dal Codice dell'Amministrazione Digitale art. 44 per la conservazione decennale.

2. **Sigillo elettronico avanzato (PAdES)**: il PDF viene sigillato lato server con certificato del titolare studio e marca temporale (TSA conforme eIDAS).

3. **Invio link OTP al paziente**: SMS o email contenente un link sicuro al `pdf-signer` per la firma elettronica avanzata via OTP. La firma generata ha valore legale equiparato all'autografa per Regolamento UE 910/2014 art. 26.

4. **Salvataggio FHIR**: il consenso firmato viene archiviato come risorsa FHIR `Consent` collegata a `Patient`, `Practitioner` e `Encounter`. Il PDF firmato è una `DocumentReference` con `Binary` content.

5. **AuditEvent FHIR**: viene generato un `AuditEvent` immutabile con `action=C` (create), `purposeOfEvent` che descrive la review AI 8/8 sezioni, agent (medico), source (Wizard AI), outcome (success/failure). Ricerca forense da Audit Log con filtri data, paziente, medico.

Il paziente riceve copia del PDF firmato via email. Lo studio mantiene sempre l'originale archiviato.

## Passo 6, revoca, modifica, ristampa

- **Revoca**: il paziente o il medico possono revocare un consenso firmato dal menu contestuale `Revoca`. Lo stato passa a `inactive` (Revocato), viene creato un nuovo `AuditEvent action=U` con motivazione, ma il PDF originale resta archiviato. Una revoca dopo prestazione comporta interruzione del trattamento (legge 219/2017 art. 1 comma 5).

- **Modifica**: i consensi firmati **non sono modificabili**. Se serve un consenso aggiornato (es. cambio di tecnica), si genera un nuovo consenso. Il sistema mostra automaticamente i precedenti nella scheda paziente con la cronologia versioni.

- **Ristampa**: dal consenso firmato si può sempre riscaricare il PDF originale (sigillato, hash identico). Utile per portarlo in cartella cartacea o consegnarlo nuovamente al paziente.

## Note importanti

- I 5 modelli proprietari Fibonacci sono in **versione 0.1 (bozza interna)**: sono redatti sulla base di fonti normative di pubblico dominio (linee guida regionali PA + giurisprudenza pubblica), ma richiedono **validazione legale finale dello studio** prima dell'uso con pazienti reali. Fibonacci fornisce l'infrastruttura tecnica, non sostituisce il parere legale dell'avvocato sanitario.

- Il Wizard AI genera testi che vanno **sempre riletti** dal medico prima dell'invio: l'AI è uno strumento di supporto (conforme requisito RF-5.4), non un dispositivo medico. La review obbligatoria nelle 8 sezioni del Step 4 serve a marcare questa responsabilità.

- I dati clinici trattati per la generazione del consenso non vengono mai usati per training del modello LLM. L'inferenza avviene su Mistral hosted in Francia (UE), con contratto DPA Mistral AI in atto. Vedi `/dpa` per il Data Processing Agreement.

## Riferimenti normativi

- **Legge 219/2017 art. 1**: Norme in materia di consenso informato e disposizioni anticipate di trattamento.
- **Cassazione 26104/2022**: Onere della prova del consenso informato a carico del medico.
- **GDPR art. 9 + art. 30**: Trattamento dati sanitari + registro attività di trattamento.
- **Regolamento UE 910/2014 (eIDAS)**: Firma elettronica avanzata.
- **CAD art. 44 + ISO 19005-3**: Conservazione documenti informatici a norma.
- **Legge 633/1941 art. 5**: Atti della Pubblica Amministrazione nel pubblico dominio.

> Documento aggiornato il **{TODAY}**.
