# Generare e firmare consensi informati in PDF

Questa guida descrive come generare bozze di consenso informato strutturate secondo la **legge 219/2017** usando il **Wizard AI di Fibonacci**, validarle sezione per sezione e raccogliere la firma grafometrica del paziente in formato PDF/A-3b a norma. Si rivolge ai medici di medicina estetica e chirurgia plastica che operano in Italia.

Fibonacci non distribuisce modelli di terzi. Il sistema combina due fonti:

1. **Oltre 100 modelli proprietari Fibonacci v0.1 (bozze da validare)** per le procedure più frequenti di medicina estetica iniettiva e non chirurgica, chirurgia plastica del volto e del corpo, e follow-up.
2. **Wizard AI generativo** per consensi su misura per qualsiasi trattamento fuori catalogo, partendo da una library di **72 clausole giuridiche estratte da fonti della Pubblica Amministrazione italiana** (atti regionali, ASL, aziende ospedaliere) che sono di pubblico dominio per la legge 633/1941 art. 5.

Tutti gli output sono validati da tre strati anti-allucinazione (vedi Passo 4) e archiviati con un sigillo elettronico avanzato, e ogni passaggio resta nel registro accessi.

## Prerequisiti

- Account con ruolo `medico` o `admin studio`.
- Anagrafica paziente completa con almeno nome, cognome, codice fiscale e data di nascita.
- Profilo medico dello studio configurato con dati identificativi e numero di iscrizione all'Ordine (verificare in Impostazioni → Dati studio e medico).
- Per la firma grafometrica: un tablet o dispositivo touch su cui il paziente possa apporre la firma, e un documento d'identità del paziente per la verifica preventiva.

## Passo 1, apertura del modulo consensi

Dalla scheda visita del paziente, il tab `Consensi` apre il pannello di gestione. La schermata mostra:

- nella colonna sinistra l'elenco dei consensi già generati per il paziente, con stato `Bozza`, `Inviato`, `Firmato`, `Revocato`;
- nella colonna destra il pulsante `Nuovo consenso` che apre il Wizard AI.

I consensi già firmati restano accessibili in sola lettura. La generazione di un nuovo consenso non sovrascrive né modifica i precedenti: ogni consenso resta un documento a sé, con la propria traccia non modificabile.

In alternativa, dal menu `Consensi → Catalogo` si accede agli oltre 100 modelli proprietari Fibonacci pronti per il download in PDF (compilati automaticamente con i dati di studio e medico). Sono utili come riferimento o per stampe rapide senza paziente in carico.

## Passo 2, Wizard AI in 4 step

Il pulsante `Nuovo consenso` apre il wizard a 4 step.

**Step 1 · Scelta procedura**: il catalogo elenca le procedure disponibili divise per categoria (medicina estetica iniettiva, non chirurgica, follow-up). Puoi cercare per nome o partire da bianco con descrizione libera del trattamento.

**Step 2 · Parametri clinici**: campi pre-impostati per tecnica, materiali (es. tipo di filler, lotto, dispositivo laser), rischi noti specifici della procedura, alternative terapeutiche e note. Più dettagli inserisci, più alto sarà il punteggio di confidenza nel passo successivo.

**Step 3 · Generazione AI**: il sistema invoca il modello linguistico configurato e in 10-15 secondi compone la bozza delle 8 sezioni obbligatorie ai sensi della legge 219/2017:

1. Identificazione paziente e contesto della prestazione
2. Descrizione clinica della procedura
3. Benefici attesi
4. Rischi documentati e probabilità realistiche
5. Alternative terapeutiche (inclusa l'astensione)
6. Conseguenze del rifiuto
7. Dichiarazione di comprensione del paziente
8. Firma e ratifica

Sotto l'output ricevi il pannello `Validazione automatica` (Passo 4).

**Step 4 · Review medica + firma**: nel passo finale spunti ciascuna delle 8 sezioni dopo averla riletta, poi raccogli la firma grafometrica del paziente. Il bottone `Salva e invia` resta disabilitato finché non hai confermato tutte e 8 le sezioni.

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

**Validator #1 · Blacklist termini vietati**: il backend rigetta automaticamente qualsiasi output che contenga:

- nomi di marchi o sigle di società terze del settore (protezione anti-copyright);
- claim ingannevoli del tipo "risultato garantito", "100% sicuro", "guarigione garantita", "nessuna complicanza", "certifico che", "senza alcun rischio".

In caso di hit, l'output non viene mai mostrato e il sistema rigenera con prompt rafforzato.

**Validator #2 · Citation check**: verifica che il testo contenga riferimenti normativi obbligatori (`L. 219/2017`, `Cassazione`, `GDPR`). Se mancano, emette un warning ma non blocca: il medico può comunque procedere consapevolmente.

**Validator #3 · Confidence scoring per sezione**: ogni sezione delle 8 obbligatorie ottiene un punteggio `0.0-1.0` calcolato su:

- lunghezza del testo (sezioni troppo corte = confidenza bassa);
- presenza di citazioni normative inline (`legge 219`, `art.`, `gdpr`, `cassazione`, `fnomceo`, `lazio`);
- numero di clausole PA referenziate dalla library di 72 elementi.

La sezione 5 (Sottoscrizione/firma) richiede sempre review manuale a prescindere dal punteggio, essendo la più critica giuridicamente.

Se `overall_confidence < 0.7` o se sono presenti errori dalla blacklist, il sistema imposta `review_obbligatoria=true` e blocca il salvataggio finché il medico non riformula manualmente le sezioni problematiche.

In più, una frequency check segnala come warning eventuali percentuali sospette (es. "100% di rischio", "0.001% di complicanza") che spesso indicano allucinazioni numeriche dell'LLM.

## Passo 5, firma del paziente e archiviazione

Dopo la review medica (8/8 spunte attive), il pulsante `Salva e invia` diventa attivo. Cliccandolo accadono in sequenza:

1. **Generazione PDF/A-3b**: il modulo `pdf-signer` di Fibonacci converte il Markdown del consenso in PDF/A-3 conforme ISO 19005-3, con file XML embedded per la validazione long-term. Questo è il formato richiesto dal Codice dell'Amministrazione Digitale art. 44 per la conservazione decennale.

2. **Sigillo elettronico avanzato**: il PDF viene sigillato lato server con certificato del titolare studio e marca temporale (TSA conforme eIDAS).

3. **Firma grafometrica del paziente**: il paziente firma su tablet; il sistema cattura, oltre all'immagine della firma, i dati biometrici del tratto (pressione, velocità, tempi), che vengono cifrati e incorporati nel PDF per eventuale perizia grafologica. È una firma elettronica avanzata (FEA), da raccogliere previa verifica dell'identità del paziente tramite documento. La FEA ha l'efficacia probatoria della scrittura privata (art. 2702 c.c.); se disconosciuta, l'onere della prova è di chi la produce. La piena presunzione di riferibilità al firmatario (art. 20 c. 1-bis CAD) si ottiene con la firma qualificata (FEQ), attivabile · insieme alla marca temporale qualificata · tramite QTSP accreditato.

4. **Archiviazione**: il consenso firmato entra nella cartella del paziente, collegato alla visita e al medico che l'ha raccolto. Il PDF resta allegato e scaricabile.

5. **Traccia**: l'operazione entra nel registro accessi immutabile con `action=C` (create), `purposeOfEvent` che descrive la review AI 8/8 sezioni, agent (medico), source (Wizard AI), outcome (success/failure). Ricerca forense da Audit Log con filtri data, paziente, medico.

Il paziente riceve copia del PDF firmato via email. Lo studio mantiene sempre l'originale archiviato.

## Passo 6, revoca, modifica, ristampa

- **Revoca**: il paziente o il medico possono revocare un consenso firmato dal menu contestuale `Revoca`. Lo stato passa a `inactive` (Revocato), viene creato un nuovo `AuditEvent action=U` con motivazione, ma il PDF originale resta archiviato. Una revoca dopo prestazione comporta interruzione del trattamento (legge 219/2017 art. 1 comma 5).

- **Modifica**: i consensi firmati **non sono modificabili**. Se serve un consenso aggiornato (es. cambio di tecnica), si genera un nuovo consenso. Il sistema mostra automaticamente i precedenti nella scheda paziente con la cronologia versioni.

- **Ristampa**: dal consenso firmato si può sempre riscaricare il PDF originale, identico a quello sigillato. Utile per portarlo in cartella cartacea o consegnarlo nuovamente al paziente.

## Note importanti

- Gli oltre 100 modelli proprietari Fibonacci sono in **versione 0.1 (bozza interna)**. Coprono la struttura legale prevista (8 sezioni L. 219/2017 + 5 elementi Cassazione 26104/2022 + GDPR + eIDAS + PDF/A-3b) ma il **contenuto clinico non è stato ancora validato da avvocato sanitario né da medico specialista** della disciplina. Prima dell'uso con pazienti reali devi: (1) far rivedere ogni modello dal legale del tuo studio, (2) verificare rischi/percentuali con le linee guida societarie aggiornate (SICPRE/ISAPS, SIDeMaST, SIME/AIME), (3) personalizzare il consenso sul singolo paziente (allergie, terapie in atto, comorbilità · il wizard ti obbliga a farlo allo Step 2), (4) controfirmare il documento dopo la firma del paziente. Fibonacci fornisce l'infrastruttura tecnica, non sostituisce il parere legale dell'avvocato sanitario né la responsabilità clinica del medico curante.

- Il Wizard AI genera testi che vanno **sempre riletti** dal medico prima dell'invio: l'AI è uno strumento di supporto (conforme requisito RF-5.4), non un dispositivo medico. La review obbligatoria nelle 8 sezioni del Step 4 serve a marcare questa responsabilità.

- I dati trattati per la generazione del consenso non vengono usati per l'addestramento dei modelli (opt-out contrattuale con i provider). L'inferenza avviene tramite il provider LLM configurato: l'elenco aggiornato dei sub-responsabili e delle relative sedi di trattamento è pubblicato in `/sub-responsabili`. Non inserire nel contesto clinico identificativi diretti del paziente oltre quanto strettamente necessario.

## Riferimenti normativi

- **Legge 219/2017 art. 1**: Norme in materia di consenso informato e disposizioni anticipate di trattamento.
- **Cassazione 26104/2022**: Onere della prova del consenso informato a carico del medico.
- **GDPR art. 9 + art. 30**: Trattamento dati sanitari + registro attività di trattamento.
- **Regolamento UE 910/2014 (eIDAS)**: Firma elettronica avanzata.
- **CAD art. 44 + ISO 19005-3**: Conservazione documenti informatici a norma.
- **Legge 633/1941 art. 5**: Atti della Pubblica Amministrazione nel pubblico dominio.

> Documento aggiornato il **{ULTIMA_REVISIONE}**.
