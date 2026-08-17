# Le aree trattate: sulla foto e sul modello 3D

> ⚠️ **Riscritta il 2026-08-17 guardando la schermata.** La versione precedente
> descriveva una tabella riepilogo con riordino a trascinamento, scorciatoie da
> tastiera, un pulsante «Importa da visita precedente» e un «Inserisci prodotto
> custom»: **nessuna di quelle cose esiste**, ed è il difetto peggiore che una
> guida possa avere, perché chi la legge cerca il pulsante e conclude che il
> prodotto è rotto. Se trovi qui qualcosa che a schermo non c'è, segnalalo.

Dentro una seduta, le aree trattate si segnano su un'immagine invece che
descrivendole a parole: ogni punto è un **pallino rosso numerato**, e l'elenco
delle aree si compila da sé man mano che li posi.

Le superfici sono **due**, e sono due modi di indicare le stesse aree:

| Scelta | Come si segna | Che cosa mostra |
|---|---|---|
| `Foto` | un clic sul ritratto | il ritratto frontale, uomo o donna: 76 aree del viso |
| `3D` | doppio clic sul modello | il corpo intero, **viso compreso**, uomo o donna |

⚠️ **Fino al 17 agosto 2026 c'era anche una scelta fra `viso` e `corpo`, ed è
stata tolta**: «confonde solo». Il modello tridimensionale è **uno**, con il
guscio del viso sopra: si clicca dove si è trattato, testa o caviglia che sia.
La foto resta perché sul viso frontale è più veloce di qualunque 3D.

## Prerequisiti

- Account con ruolo `medico` e accesso clinico al paziente.
- Una seduta aperta: il modulo `Nuovo trattamento` sulla scheda `Trattamenti`
  della cartella.

## Passo 1, scegliere la superficie

Nel modulo del trattamento, alla voce `Body-map e aree trattate`, due pulsanti:
`Foto` e `3D`.

Il **sesso del modello** (`donna` / `uomo`) è **uno solo** e vale per entrambe:
sceglierlo sul ritratto e ritrovare l'altro sul 3D sarebbe la stessa domanda
posta due volte. Sul ritratto il sesso cambia anche **dove cadono i pallini**,
perché i due volti hanno proporzioni diverse.

⚠️ Il selettore del sesso compare solo se il modello corrispondente è stato
consegnato al server. Le aree registrate in cartella **non dipendono da quale
modello stai guardando**: i codici delle regioni sono gli stessi.

## Passo 2, posare un punto

- **Sul ritratto**: un clic nel punto trattato.
- **Sul modello 3D**: **doppio clic**. Il doppio clic serve a distinguere la
  marcatura dalla rotazione: si trascina per ruotare, si usa la rotella per
  avvicinarsi, e il singolo clic non deve segnare niente per sbaglio. Un secondo
  doppio clic sullo stesso punto lo toglie.
- Il pulsante `Ricentra` rimette il modello nella posizione iniziale.
- Sul ritratto, `Apri a schermo intero` allarga l'immagine quando i punti sono
  fitti.

Sul 3D il pallino resta **dove hai cliccato**, non al centro dell'area: su una
coscia il centro dell'area sarebbe venti centimetri più in là. Il modello si
apre sulla figura intera: per le aree del viso ci si avvicina con la rotella.

⚠️ **I punti esatti valgono per il modello su cui li hai posati.** I due corpi
non sono lo stesso corpo: passando da uomo a donna il punto preciso non esiste e
il pallino si posiziona al centro dell'area, che su quel modello è sempre
corretto. Le aree registrate non cambiano.

## Passo 3, che cosa si scrive su un punto

Sul ritratto, il pallino apre una finestrella con due campi principali:

- **Trattamento**, testo libero (per esempio «filler acido ialuronico», «botox»);
- **Quantità**, testo libero con l'unità (per esempio «0.5 ml», «25 U»).

Sotto, la sezione **Come è stata fatta**, chiusa di suo e **facoltativa**, con
quattro tendine a vocabolario chiuso:

- `Strumento`: ago, cannula, microaghi o roller, altro;
- `Calibro`: dal 18G, il più spesso, al 34G, il più sottile;
- `Piano`: sovraperiosteo, sottogaleale, sottofasciale, sottocutaneo, dermico
  profondo, dermico superficiale;
- `Tecnica`: bolo, microbolo, retrogrado, anterogrado, a ventaglio, lineare.

Non è un vezzo documentale: il regolamento (UE) 2022/2346, allegato §3.1
lettera j, chiede di documentare la tecnica di iniezione, gli strumenti e la
quantità massima iniettata in funzione della sede e della tecnica. Le quattro
tendine sono ciò che permette di rispondere.

⛔ **Nessuna delle tendine suggerisce il valore giusto per la zona**: non
propongono un piano, non avvertono se una combinazione è insolita. Le tabelle
per zona esistono in letteratura e restano fuori dal software, perché sarebbero
un'indicazione clinica.

⚠️ Un punto senza questi quattro campi resta valido: tutte le annotazioni
scritte prima del 15 agosto 2026 non li hanno.

## Passo 4, l'elenco delle aree si compila da sé

I pallini e l'elenco `Aree trattate` sotto la mappa sono **la stessa cosa vista
in due modi**:

- posi un pallino, l'area entra nell'elenco;
- scegli un'area dall'elenco, il pallino compare sulla mappa;
- togli l'una, sparisce l'altro.

Vale anche **fra le superfici**: un'area segnata sul modello 3D ha già il suo
pallino tornando al ritratto.

## Passo 5, le aree dettate e quelle scritte a parole

Due strumenti portano sulla mappa le aree che hai scritto (o dettato) a parole,
e **entrambi chiedono un gesto tuo**: nulla entra in cartella da solo.

- **`Aree rilevate dal testo:`** compare sotto il campo delle note mentre
  scrivi. È un riconoscimento per parole chiave, senza modello linguistico:
  propone delle etichette e tu aggiungi quelle giuste.
- **`Auto-estrai aree dal testo`** manda il testo delle note al servizio di
  estrazione, che risponde con aree, prodotto e quantità già separati, e le aree
  **si aggiungono** ai pallini esistenti invece di sostituirli.

⚠️ **La dettatura da sola non colora la mappa.** `Detta la seduta` riempie
prodotto, quantità, lotto e off-label, ma le zone riconosciute le scrive in coda
alle note nella forma `[aree dettate: …]`, perché segnarle richiede il codice
esatto dell'area. Sono i due strumenti qui sopra a trasformarle in pallini:
saperlo evita di cercare segni che nessuno ha posato.

## Passo 6, uso off-label

`Uso off-label` è una spunta della scheda del trattamento, non del singolo
pallino, e quando è attiva chiede la `Motivazione off-label`. Il campo esiste
perché in medicina estetica l'uso fuori indicazione è frequente e legittimo
**purché documentato**: la motivazione è ciò che resta scritto.

Vedi la guida [Registrare un trattamento](/manuale/trattamenti) per lotto,
scadenza, parametri del dispositivo e richiamo.

## Che cosa il modello 3D non fa

- **Sul corpo le aree non si colorano di verde**, e non è una dimenticanza: i
  confini delle regioni nascono da una partizione in coordinate ossee e tagliano
  dritto dove l'anatomia curva. Riempirli di colore mostrava quel difetto invece
  della seduta. Il segno è il pallino.
- **Le regioni non sono tutte quelle del modello.** L'elenco contiene le zone
  che la medicina estetica tratta davvero, raggruppate in collo, décolleté,
  braccia, mani, addome, schiena, glutei, cosce e gambe. Piede, unghie,
  padiglione auricolare e regioni intime esistono nel modello anatomico e **non
  sono nell'elenco clinico**: un elenco che contiene tutto è un elenco in cui non
  si trova niente.
- **Cliccando fuori da quelle regioni non viene assegnato niente**, e la pagina
  lo dice: mostra il nome tecnico del punto colpito, così è chiaro che il clic è
  arrivato ma che quella zona non la registriamo.
- **Il lato destro o sinistro viene dal clic, non dal nome.** Nel modello
  anatomico «regione anteriore del braccio» è un nome solo per due braccia: è la
  posizione del punto a decidere il lato.
- **Non è l'atlante.** Per mostrare al paziente scheletro, muscoli o vasi si usa
  la pagina [Atlante anatomico 3D](/manuale/anatomia), che non registra niente.

## La mappa aggregata, nella scheda Trattamenti

Fuori dalla seduta, la scheda `Trattamenti` della cartella ha una `Mappa
trattamenti` che riassume **tutto lo storico del paziente**: ogni area mostra
**quante volte** è stata trattata, e il colore dice la **categoria prevalente**
di prodotto in quell'area. La legenda è in pagina, sotto `Legenda categorie`.

Cliccando un'area la timeline sotto si filtra su quella zona; `Rimuovi filtro`
torna a tutto. La pagina segnala anche uno `Squilibrio sx/dx rilevato` quando i
conteggi fra i due lati divergono, e `Apri modello completo` porta all'atlante.

⚠️ **Il numero non è la quantità di prodotto**: è il numero di trattamenti
registrati su quell'area. Non esiste un selettore di periodo su questa mappa:
mostra tutto lo storico.

## Portare fuori i dati

Dalla scheda `Trattamenti`: `Esporta PDF` produce il riepilogo dei trattamenti,
`Esporta CSV` la stessa cosa in tabella. Il fascicolo della **singola seduta** si
scarica invece dalla riga della seduta, ed è descritto in
[Registrare un trattamento](/manuale/trattamenti).

## Risoluzione problemi

**Il modello 3D non compare.** Si scarica alla prima apertura ed è pesante: su
connessione lenta ci mette qualche secondo. Se resta vuoto, ricarica la pagina:
i modelli sono serviti senza cache, quindi un ricaricamento basta a riprenderli.

**Ho fatto doppio clic e non è successo niente.** Se il punto colpito è fuori
dalle regioni che registriamo compare il messaggio con il nome tecnico della
zona: prova più al centro, oppure scegli l'area dall'elenco.

**Il pallino è nel punto sbagliato sul ritratto.** Trascinalo: la posizione si
aggiorna. Sul 3D si toglie con un secondo doppio clic e si rimette dove serve.

**Ho cambiato sesso del modello e i pallini si sono spostati.** I due corpi
hanno coordinate diverse: sull'altro modello il punto esatto non esiste e il
pallino torna al centro dell'area. **Le aree in cartella restano** identiche.

## Vedi anche

- [Registrare un trattamento](/manuale/trattamenti)
- [Atlante anatomico 3D](/manuale/anatomia)
- [Compilare l'anamnesi con la dettatura AI](/manuale/anamnesi-dettatura)
- [Esiti e complicanze](/manuale/esiti-e-complicanze)

Ultima revisione: {ULTIMA_REVISIONE}
