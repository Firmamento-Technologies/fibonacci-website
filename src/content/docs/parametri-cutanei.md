# Parametri cutanei

Questa guida descrive la misura dei **parametri cutanei estetici**: undici grandezze che Fibonacci calcola su una regione di pelle che scegli tu su una fotografia già in cartella, il loro salvataggio e il confronto nel tempo. Sono misure **della fotografia**, non della cute: descrivono l'immagine di una zona, e servono a documentare con dei numeri quello che oggi si documenta solo con due foto affiancate.

⚠️ **La pagina compare solo se la funzione è stata abilitata sul tuo studio.** Se nella barra della cartella non vedi `Parametri cutanei`, non è un difetto: la funzione è dietro un interruttore, spento di suo.

## Che cosa non fa, prima di che cosa fa

Sta scritto anche in testa alla pagina, con la stessa evidenza dei numeri, e non è una formula di cortesia:

> Questo strumento calcola grandezze fotografiche sulla regione che delimiti. Non rileva, non segnala e non conta lesioni, nei o macchie sospette, non attribuisce i valori a una causa e non è uno strumento di screening: non sostituisce l'esame della cute.

In concreto: nessun valore viene confrontato con una soglia, non esistono giudizi di gravità o di grado, nessun numero è colorato di verde o di rosso, e la pagina non dice mai «migliorato» o «peggiorato». I numeri si mostrano nudi, con la loro unità; il giudizio resta tuo. Se guardando la regione noti qualcosa, l'ha notato il tuo occhio: il programma non guarda, misura dove gli dici di misurare.

## Prerequisiti

- Account con ruolo `medico` o `admin studio`.
- Almeno una fotografia in cartella (vedi la guida «Foto cliniche e confronto prima/dopo»). Va bene qualunque vista, non serve il frontale.

## Dove si trova

Il pulsante `Parametri cutanei` sta nella barra in alto della cartella del paziente, accanto a `Analisi del volto`, ed è visibile da qualunque scheda. Dalla pagina dell'analisi del volto e da quella dei parametri si passa dall'una all'altra con un collegamento in alto a destra.

## Come si usa

1. **Scegli la fotografia.** Sotto `Fotografia` c'è la striscia degli scatti in cartella, dal più recente. Il primo è già selezionato.
2. **Traccia la regione.** Sotto `Regione da misurare` trascina il dito o il mouse sulla fotografia: quello che resta fuori si scurisce, così si vede a colpo d'occhio che cosa entra nel conto e che cosa no. Puoi ridisegnarla quante volte vuoi, l'ultimo rettangolo vince. Sotto la fotografia trovi la misura in pixel della regione che hai tracciato.
3. **Leggi i valori.** Compaiono accanto alla fotografia appena rilasci il trascinamento.

⛔ **Non c'è una regione predefinita, e non è una dimenticanza.** Un programma che sceglie da sé dove guardare comincia a selezionare reperti, che è un'altra cosa da quella che fa questo. La zona la scegli tu, sempre.

Cambiando fotografia la regione si azzera: era un rettangolo su un'altra pelle, e tenerla darebbe numeri plausibili su una zona che non ha scelto nessuno.

Il calcolo avviene **nel browser**: la fotografia non lascia il sistema e nessun servizio esterno la riceve.

## Le undici voci

| voce | che cosa dice |
|---|---|
| Area con pigmentazione più scura del fondo locale | quanta parte della regione è più scura della media locale che la circonda, in percentuale |
| Aperture circolari rilevate | quante piccole aperture tonde si contano, entro l'intervallo di diametro dichiarato |
| Diametro medio delle aperture rilevate | quanto sono grandi in media, in percentuale del lato corto della regione |
| Area occupata dalle linee rilevate | quanta parte della regione è coperta dalle linee che i filtri di contrasto trovano |
| Lunghezza complessiva delle linee rilevate | la loro lunghezza sommata, in multipli del lato corto della regione |
| Colore medio, chiarezza L\* | la chiarezza media, da 0 (nero) a 100 (bianco) |
| Colore medio, asse a\* | l'asse rosso/verde del colore medio |
| Colore medio, asse b\* | l'asse giallo/blu del colore medio |
| Angolo tipologico individuale (ITA) | l'angolo colorimetrico calcolato da L\* e b\*, in gradi |
| Disomogeneità del colore | quanto i pixel della regione si allontanano in media dal colore medio |
| Area con componente rossa più alta della mediana della regione | quanta parte della regione supera di una quantità dichiarata la mediana del rosso della regione stessa |

Le etichette dicono **che cosa è stato misurato sull'immagine**, mai a che cosa potrebbe essere dovuto: quella lettura la fai tu davanti al paziente, ed è il motivo per cui il programma non la scrive al posto tuo.

### L'ITA non è il fototipo, e Fibonacci non lo trasforma in fototipo

È la domanda che viene subito, perché in letteratura una tabella di conversione fra angolo tipologico individuale e fototipo di Fitzpatrick esiste, ed è di sei righe. Fibonacci **non la applica**, e mostra l'angolo e basta. Tre ragioni, in ordine di peso:

1. **Un fototipo è un grado, e questa pagina non assegna gradi.** Vale qui la stessa regola di tutto il resto: lo strumento misura, la classificazione la fa il medico.
2. **La conversione, misurata, non tiene bene proprio su Fitzpatrick.** Uno studio del 2025 che calcola l'ITA in automatico e lo mappa su due scale trova buon accordo con la scala di Monk e un accordo **meno costante** con i tipi di Fitzpatrick. Non sorprende: Fitzpatrick nasce dalla **reazione al sole**, non dal colore, e infatti è una valutazione, non una misura di colore.
3. **Classificare una persona per il colore della pelle a partire da una fotografia è categorizzazione biometrica su una caratteristica protetta**, e come tale non è una scelta tecnica ma una decisione con conseguenze normative proprie.

Il fototipo in Fibonacci resta dove è sempre stato: il campo `Fototipo (Fitzpatrick)` nell'anamnesi estetica, che il sistema descrive già come «È una valutazione del medico, non una risposta del paziente». L'angolo misurato qui può aiutarti a compilarlo, non lo compila al posto tuo.

Il pulsante `Come è misurato`, sotto i valori, apre i parametri esatti del metodo: area di lavoro, regione minima, raggio del fondo locale, intervallo di diametro delle aperture, orientamenti e soglia dei filtri delle linee, scarto della componente rossa. Sono i parametri dello strumento, come il diaframma di una macchina fotografica: nessuno di questi separa un valore «normale» da uno «anomalo».

## Quanto deve essere grande la regione

Deve avere almeno **120 pixel di lato** e **40 mila pixel quadrati** di area. Sotto, la pagina lo dice e non mostra numeri.

Il motivo è misurato, non prudenziale: su una regione piccola le aperture da contare sono poche, e un conteggio su pochi elementi balla. Riscattando la stessa pelle senza cambiare niente, il conteggio si è mosso del **33% su ventunomila pixel quadrati** e del **9,8% su settantottomila**: cioè su una regione piccola il numero cambia di un terzo senza che sulla pelle sia successo nulla. Un numero del genere non è una misura, è rumore con l'aria di una misura, e allora è meglio nessun numero.

Per la stessa ragione, sotto i valori la pagina scrive quante aperture ha contato in quella regione e quanto vale la precisione del conteggio. È la tolleranza dello strumento, come quella di un calibro: **non** è un giudizio sulla pelle. Se ti serve un conteggio più stabile, allarga la regione.

## Salvare in cartella

I valori si ricalcolano dalla fotografia ogni volta che apri la pagina. In cartella entrano **solo se li salvi**: sotto i valori scegli la `Zona misurata` dall'elenco (lo stesso vocabolario di aree che usi per i trattamenti e per le foto) e premi `Salva in cartella`.

La zona è obbligatoria: senza, nel confronto nel tempo una guancia e una fronte finirebbero nella stessa riga.

Salvare di nuovo la **stessa regione della stessa fotografia** aggiorna la misura invece di duplicarla, e il pulsante lo dice: diventa `Aggiorna in cartella`. Due zone diverse sulla stessa fotografia convivono senza sovrascriversi.

Quello che finisce in cartella porta con sé da dove viene: la fotografia di origine, il rettangolo esatto (così la stessa misura si può rifare identica), il metodo con cui è stata ottenuta e chi ha deciso di salvarla. La data della misura è quella dello **scatto**, non quella del salvataggio: la pelle misurata è quella di allora.

## Nel tempo

In fondo alla pagina, `Nel tempo, per zona` mette in fila le misure salvate, **separate per zona**, con il valore più recente e la differenza dalla prima.

Sopra le serie c'è sempre la stessa frase, ed è la cosa più importante della pagina:

> Riscattando la stessa pelle senza cambiare niente, in prova questi numeri si sono mossi fra l'1% e il 6% (fino al 10% il conteggio delle aperture, su una regione piccola). Una differenza più piccola di così non è una differenza.

Anche i grafici sono tarati su quel numero: una differenza più piccola della precisione dello strumento si vede **piatta**, non in salita. Senza questo accorgimento una spezzata fra due sole misure disegnerebbe sempre una diagonale a tutta altezza, anche per una differenza di zero, e il disegno direbbe una cosa che il numero non dice.

## I limiti, per esteso

- **Misurano la fotografia, non la pelle.** Cambiano con la luce, con la distanza di ripresa, con l'obiettivo e con la compressione del file. Perché due misure siano confrontabili servono due scatti confrontabili: stessa postazione, stessa luce, stessa distanza. Vale qui esattamente come per il confronto prima/dopo.
- **La prova di ripetibilità è stata fatta su fotografie di studio**, ben illuminate e a fuoco. Non tiene conto della luce della tua stanza, del trucco residuo, dell'ora del giorno. I numeri qui sopra sono quindi un **minimo**: sulla tua postazione lo scostamento sarà più grande, non più piccolo.
- **Nessun modello addestrato.** I valori escono da calcoli descrivibili uno per uno (medie locali, componenti connesse, filtri orientati, conversione di spazio colore), non da un sistema addestrato su casi clinici. È una scelta, non un limite tecnico: un sistema addestrato risponderebbe alla domanda «a che cosa somiglia», che è un'altra domanda.
- **Non è uno strumento di screening.** Misurare qualcosa in una regione non significa che il resto sia stato guardato.

## Guide collegate

- «Foto cliniche e confronto prima/dopo», per il protocollo di scatto: è quello che rende confrontabili le misure.
- «Analisi del volto», per le misure di forma e proporzione sul frontale.
