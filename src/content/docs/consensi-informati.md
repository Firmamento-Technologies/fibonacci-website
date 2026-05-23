# Generare e firmare consensi informati in PDF

Questa guida descrive come generare e gestire i consensi informati standardizzati dalla **** (Societa Italiana di Chirurgia Plastica Ricostruttiva ed Estetica) e come acquisire la firma del paziente in modalita cartacea o digitale. Si rivolge ai medici di medicina estetica e chirurgia plastica che operano in Italia, con riferimento al quadro normativo della legge sul consenso informato (legge 219/2017) e alle linee guida societarie .

Fibonacci include una libreria di modelli di consenso aggiornata periodicamente, che copre i trattamenti piu comuni. Il sistema genera dinamicamente il PDF compilando i campi dell'anagrafica paziente, del medico esecutore, della data e del trattamento programmato. Il PDF e archiviato con sigillo elettronico avanzato (PAdES), garantendo integrita e marcatura temporale.

## Prerequisiti

- Account con ruolo `medico` o `admin studio`.
- Anagrafica paziente completa con almeno nome, cognome, codice fiscale e data di nascita.
- Profilo medico dello studio configurato con dati identificativi e numero di iscrizione all'Ordine.
- Per la firma grafometrica: tablet con stilo capacitivo, oppure dispositivo touchscreen con stilo passivo, oppure firma su carta seguita da upload del PDF firmato.

## Passo 1, apertura del modulo consensi

Dalla scheda visita del paziente, il tab `Consensi` apre il pannello di gestione. La schermata mostra:

- nella colonna sinistra l'elenco dei consensi gia generati per il paziente, con stato `Bozza`, `Inviato`, `Firmato`, `Annullato`,
- nella colonna destra il pulsante `Nuovo consenso` e il filtro per categoria di trattamento.

I consensi gia firmati restano accessibili in sola lettura. La generazione di un nuovo consenso non sovrascrive ne modifica i precedenti.

## Passo 2, scelta del modello 

Il pulsante `Nuovo consenso` apre il catalogo dei modelli disponibili, raggruppati per categoria:

- **Tossina botulinica**: trattamento estetico del terzo superiore, trattamento dell'iperidrosi, bruxismo,
- **Filler**: acido ialuronico volumizzante, riempitivo lineare, biostimolanti,
- **Peeling chimici**: superficiale, medio, profondo,
- **Laser e luce pulsata**: epilazione, fotoringiovanimento, lesioni vascolari, lesioni pigmentate,
- **Trattamenti combinati**: armonizzazione facciale, full face,
- **Altri**: mesoterapia, fili di trazione, biorivitalizzazione.

Ogni modello mostra una breve descrizione, l'elenco dei rischi specifici, le alternative terapeutiche standard e l'aggiornamento piu recente del testo . I modelli vengono revisionati dalla societa scientifica con cadenza annuale; Fibonacci aggiorna automaticamente la libreria al rilascio delle nuove versioni.

La selezione di un modello apre l'editor di consenso pre-compilato.

## Passo 3, personalizzazione del consenso

L'editor presenta il consenso pre-compilato con i seguenti campi compilati automaticamente:

- **Dati anagrafici del paziente**: nome, cognome, codice fiscale, data di nascita, residenza.
- **Dati del medico esecutore**: nome, cognome, codice fiscale, numero di iscrizione all'Ordine, specializzazione.
- **Dati dello studio**: ragione sociale, partita IVA, indirizzo della sede.
- **Data della prestazione** programmata.
- **Descrizione del trattamento** dal modello .
- **Rischi e complicanze** specifici, secondo l'aggiornamento corrente del modello.
- **Alternative terapeutiche** indicate dal modello.
- **Costi** della prestazione, opzionale, importabile dal catalogo prezzi dello studio.

Campi facoltativi personalizzabili dal medico:

- **Note specifiche** per il singolo paziente, ad esempio condizioni cliniche particolari, controindicazioni relative discusse, accorgimenti specifici concordati.
- **Combinazione di trattamenti**: se la visita prevede piu prodotti contemporanei, l'editor permette di unire piu modelli in un unico consenso multi-trattamento.

L'anteprima in tempo reale a destra mostra il PDF aggiornato a ogni modifica.

## Passo 4, generazione e anteprima PDF

Il pulsante `Genera PDF` produce il documento finale. L'anteprima full screen mostra il PDF impaginato a colori con:

- intestazione con logo studio,
- titolo `Consenso informato per trattamento di [tipo]`,
- testo completo del consenso,
- sezione firma con riquadri per data, firma paziente, firma medico,
- pie di pagina con identificativo univoco del documento e versione del modello .

Il pulsante `Salva come bozza` permette di interrompere la procedura conservando lo stato per modifiche successive. Le bozze non sono valide come consenso.

## Passo 5, firma del paziente

Sono disponibili tre modalita di firma, equivalenti dal punto di vista probatorio:

### Firma grafometrica con stilo

Il pulsante `Firma con tablet` apre la modalita firma su un dispositivo con stilo capacitivo, tipicamente un tablet iPad con Apple Pencil o un Wacom con stilo. Il paziente firma direttamente nel riquadro a schermo. La firma cattura:

- traccia bidimensionale della firma in alta risoluzione,
- timestamp di inizio e fine,
- pressione esercitata se il dispositivo la espone,
- velocita media del tratto.

I dati biometrici della firma sono cifrati con chiave separata dal documento e usati come prova di autenticita in caso di contestazione. La firma e applicata sul PDF in posizione preimpostata.

### Firma su touchscreen

Modalita equivalente alla grafometrica ma senza stilo dedicato: il paziente firma con il dito su touchscreen. Le proprieta biometriche catturate sono ridotte (tipicamente niente pressione), pertanto la modalita e accettabile ma meno difensibile in caso di contestazione.

### Firma su carta e upload

Il pulsante `Stampa per firma su carta` invia il PDF alla stampante. Il paziente firma a penna sul foglio. Il foglio firmato viene scansionato o fotografato, quindi caricato con `Upload PDF firmato` o `Upload foto firmata`. Il sistema verifica visivamente la presenza di una firma nel riquadro previsto e archivia il documento.

Questa modalita e indispensabile per pazienti che preferiscono la modalita tradizionale o quando il dispositivo grafometrico non e disponibile.

## Passo 6, sigillo elettronico avanzato e archiviazione

Tutte le modalita di firma producono un PDF finale **sigillato elettronicamente** secondo standard PAdES, con i seguenti requisiti:

- hash SHA-256 del documento prima della firma,
- timestamp da Time Stamping Authority esterna,
- catena di certificati verificabile,
- inclusione della firma del paziente come allegato cifrato.

Il sistema garantisce che ogni modifica successiva al PDF firmato sia immediatamente rilevabile.

Il sigillo elettronico avanzato e tecnicamente conforme alla qualifica di firma elettronica avanzata. L'evoluzione verso firma elettronica qualificata, che richiede TSA accreditata AgID, e in roadmap per i piani sanitari avanzati.

I PDF firmati sono archiviati con cifratura AES-256 a riposo e conservati per venti anni come previsto dalla normativa sulla cartella clinica.

## Passo 7, invio al paziente

Dopo la firma, il pulsante `Invia copia al paziente` invia il PDF firmato all'email registrata in anagrafica. L'email contiene:

- copia del PDF in allegato,
- link diretto alla scheda paziente nell'area riservata (se attivata),
- testo di accompagnamento personalizzabile dallo studio.

L'invio e tracciato in audit log e fa parte della cronologia consensi del paziente.

## Verifica integrita del consenso firmato

Dalla scheda del consenso, il pulsante `Verifica integrita` ricalcola l'hash del PDF e lo confronta con il valore registrato in fase di firma. Risultato `Integro` conferma che il documento non e stato alterato, `Alterato` segnala una manomissione e dovrebbe innescare un'indagine immediata.

La verifica e disponibile anche al di fuori della piattaforma utilizzando lettori PDF compatibili con PAdES: il PDF mostra la firma elettronica nella sezione `Firme` del lettore.

## Suggerimenti

- Genera il consenso al momento del **colloquio pre-trattamento** e non al momento dell'esecuzione: la legge richiede tempo congruo per riflessione e domande.
- Per pazienti minori il consenso e firmato dal **tutore legale** registrato in anagrafica; il sistema compila automaticamente il nome del tutore nella sezione firma.
- I costi del trattamento, se inseriti, devono coincidere con il preventivo eventualmente firmato in precedenza: incongruenze possono invalidare il consenso informato.
- Conserva nello studio un **registro cartaceo** dei consensi su carta firmati anche dopo l'upload, per due anni: pratica raccomandata da molti ordini professionali.
- Verifica annualmente che i modelli in uso siano ancora la versione corrente: la pagina `Impostazioni > Consensi > Modelli` mostra le versioni installate e l'ultima versione disponibile.

## Risoluzione problemi

**Il paziente non ha un indirizzo email.** Stampa il PDF firmato in copia e consegnalo direttamente al paziente. La consegna fisica e equivalente all'invio email ai fini documentali; tracciala con il pulsante `Marca come consegnato a mano`.

**Firma grafometrica rifiutata dal lettore PDF esterno.** Alcuni lettori PDF non aggiornati non riconoscono la firma PAdES. Apri il PDF con Adobe Acrobat Reader aggiornato per verificare correttamente la firma. La firma resta valida indipendentemente dal lettore usato per la verifica esterna.

**Modello mancante per un trattamento non presente in catalogo.** Apri una richiesta dal pulsante `Suggerisci modello` indicando il trattamento. Le richieste sono valutate insieme a per inserimento nelle release periodiche. Nel frattempo usa il modello generico `Consenso per trattamento medico-estetico` personalizzandolo con le specifiche del trattamento.

**Il PDF generato mostra dati anagrafici incompleti.** Verifica nella scheda anagrafica paziente che i campi obbligatori siano tutti compilati. Mancanza di codice fiscale o data di nascita sono le cause piu frequenti.

**Firma in posizione sbagliata sul PDF caricato da scansione.** Il sistema verifica visivamente la presenza di una firma nel riquadro previsto. Se la firma e fuori riquadro, il sistema chiede conferma manuale dell'operatore. Conferma se la firma e comunque presente e leggibile; archivia in caso contrario richiedendo nuova firma.

## Vedi anche

- [Body map 2D per documentare le aree trattate](/docs/body-map/)
- [Creazione e gestione anagrafica paziente](/docs/anagrafica-paziente/)
- [Audit log e tracciabilita accessi](/docs/audit-log/)

Ultima revisione: {ULTIMA_REVISIONE}
