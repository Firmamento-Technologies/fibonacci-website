# Esiti, complicanze ed emergenze

Questa guida copre le tre cose che succedono **dopo** una seduta quando qualcosa
non va come previsto: la modalità `Emergenza`, la registrazione di una
complicanza, e la scheda di segnalazione al Ministero.

⛔ **Nessuna di queste schermate dà indicazioni cliniche.** Non propongono
farmaci, dosi o vie di somministrazione, non formulano un sospetto diagnostico,
non giudicano la gravità e non confrontano il tempo con nessuna soglia. È una
scelta dichiarata nella destinazione d'uso del prodotto, non una funzione
mancante: in un'emergenza qualunque suggerimento renderebbe questo software un
dispositivo medico, e ciò che manca davvero in quel momento non è un consiglio, è
il verbale che nessuno scrive perché ha le mani occupate.

## Prima: preparare lo studio

Due campi in `Impostazioni`, sezione dello studio, che vanno riempiti **prima**
che servano:

- **`Protocollo delle complicanze (per la modalità Emergenza)`**: il protocollo
  dello studio, un passo per riga. È il **tuo** testo: viene mostrato com'è
  scritto, non viene completato né corretto. Senza, la modalità Emergenza tiene
  il tempo e registra le note ma non mostra nessun contenuto clinico.
- **`Farmaco d'emergenza: scadenza`**: mese e anno. Il momento utile per
  accorgersi che è scaduto non è mentre serve. Non si chiede quale sia il
  farmaco: quello lo decide lo studio.

## La modalità Emergenza

Si apre **dalla riga della seduta**, nella scheda `Trattamenti` del paziente:
è il punto in cui la paziente è già davanti, e cercare una voce di menu in quel
momento è tempo perso. Non compare da sola e non è un allarme: si preme.

La schermata è a tutto schermo, senza navigazione, e contiene tre cose:

1. **`Tempo trascorso dall'apertura`**: un cronometro che sale. Non cambia
   colore, non conta alla rovescia, non suona, non avvisa.
2. **Il protocollo dello studio**, un passo per riga, da spuntare mentre lo si
   esegue.
3. **`Che cosa registrare in cartella`**: un campo libero per quello che vuoi
   che resti scritto.

Se la scadenza del farmaco d'emergenza registrata nelle impostazioni è passata,
la pagina lo dice: `La scadenza registrata nelle impostazioni dello studio è
passata`.

⚠️ **La rete può mancare, il verbale no.** L'istante di inizio e i passi spuntati
vengono salvati nel browser **prima** di qualunque chiamata al server:
ricaricare la pagina, o perdere la connessione, non azzera il cronometro e non
perde il verbale. Il salvataggio in cartella avviene alla chiusura, e se
fallisce il verbale resta scaricabile.

Alla chiusura si sceglie la `Gravità`, e il verbale riporta **gli orari del
momento in cui hai marcato ogni passo**, non orari ricostruiti dopo.

`Esci senza chiudere` lascia la sessione aperta: il cronometro continua.

## Registrare una complicanza

Dalla stessa riga della seduta, l'azione `Registra una complicanza su questa
seduta`. La complicanza resta **legata a quel trattamento**, con il suo prodotto
e il suo lotto: è il motivo per cui si registra da lì e non da un elenco a parte.

Il modulo chiede:

- **la complicanza**, da un elenco chiuso di dodici voci: ecchimosi, edema,
  eritema persistente, nodulo, granuloma, infezione, necrosi cutanea, occlusione
  vascolare, ptosi palpebrale, asimmetria, reazione allergica, e `Altro
  (descritto nelle note)`;
- **`Quando l'hai osservata`**. La data **non** si precompila con oggi: una
  complicanza si vede spesso giorni dopo, e un campo già pieno è un campo che
  nessuno corregge;
- **`Gravità`**: lieve, moderata o grave. La sceglie il medico: non esiste nessun
  avviso che dica «questa complicanza è grave»;
- **`Che cosa hai osservato`** e **`Che cosa hai fatto`** (per esempio
  ialuronidasi, impacchi, antibiotico);
- **`Esito (se già noto)`**, che si può lasciare a `Non ancora noto`.

Le complicanze registrate compaiono **dentro la scheda della seduta**, in
evidenza: per sapere com'è andata non bisogna guardare in due posti.

⚠️ **Una seduta marcata come inserita per errore non accetta complicanze.**

## La scheda di segnalazione al Ministero

Accanto a ogni complicanza registrata compare il collegamento **`Scheda di
segnalazione`**, che prepara il testo da ricopiare nel modulo ministeriale.

Perché esiste, e con quali termini:

- il **D.M. Salute 1° luglio 2025**, in vigore dal 18 marzo 2026, attua l'art. 10
  del D.Lgs. 137/2022 e copre espressamente anche i dispositivi dell'allegato XVI
  del regolamento UE 2017/745, cioè i **filler dermici**;
- l'incidente **grave, anche solo sospetto**, va segnalato *«tempestivamente e
  comunque non oltre dieci giorni»* (art. 4 c. 1); l'incidente non grave **può**
  essere segnalato entro trenta giorni (art. 4 c. 3);
- l'obbligo è **dell'operatore sanitario**, e l'omessa segnalazione è sanzionata
  da 26.000 a 120.000 euro.

Registrando una complicanza, il sistema apre un **promemoria** con la scadenza
calcolata da quei termini, che trovi in `Promemoria`.

Tre cose che questa funzione **non** fa, e conviene saperle prima:

- ⛔ **Non trasmette niente.** Il canale è il modulo on-line del Ministero, con
  autenticazione del medico (SPID, CIE o CNS). Qui si prepara il contenuto.
- ⛔ **Non decide se l'incidente è grave**: legge la gravità che hai registrato
  tu e da quella ricava il termine.
- ⛔ **Non mette i dati della paziente**, e non è una dimenticanza: l'art. 2 c. 6
  del decreto impone che la segnalazione *«non contenga dati che consentano
  l'identificazione del soggetto coinvolto»*. Precompilare dalla cartella, che
  sarebbe la cosa ovvia da fare, farebbe commettere la violazione proprio allo
  strumento che dovrebbe aiutare. Il modulo riceve l'evento e il prodotto, mai il
  paziente.

⚠️ **La registrazione di una complicanza non è una segnalazione di
farmacovigilanza**, e il modulo lo scrive: sono due canali diversi, con
destinatari diversi.

## Errori frequenti

- **Aprire l'Emergenza e non chiuderla.** Il verbale si scrive in cartella alla
  chiusura: una sessione lasciata aperta resta un cronometro che gira.
- **Il protocollo mai caricato.** Senza, in emergenza la schermata è un
  cronometro e un campo note. Si compila una volta, in `Impostazioni`.
- **Registrare la complicanza su una seduta qualsiasi.** Va sulla seduta che
  l'ha causata: è quel legame a portarsi dietro prodotto e lotto quando servono.

## Vedi anche

- [Registrare un trattamento](/manuale/trattamenti)
- [Tracciabilità del lotto](/manuale/tracciabilita-lotto)
- [Promemoria e richiami](/manuale/promemoria-e-richiami)
