# Analisi del volto

Questa guida descrive l'analisi morfologica del volto: le misure che Fibonacci ricava da una fotografia frontale, il confronto con i canoni neoclassici, la vista tridimensionale, la serie fotografica per vista e la registrazione del giudizio clinico (PGAIS) sul confronto prima/dopo.

Un chiarimento prima di tutto: l'analisi non produce un punteggio di bellezza, e non è una scelta di prudenza ma di letteratura. Sulle finaliste di Miss Universe le proporzioni reali differiscono in modo significativo dai canoni; su modelle nere non è emersa alcuna associazione con la sezione aurea, e gli autori raccomandano una valutazione individualizzata. Il confronto clinicamente più solido resta quello del volto **con sé stesso nel tempo** — ed è quello che questa pagina mette al centro.

## Prerequisiti

- Account con ruolo `medico` o `admin studio`.
- Almeno una fotografia frontale del viso già in cartella (vedi la guida «Foto cliniche e confronto prima/dopo»).

## Dove si trova

Il pulsante `Analisi del volto` sta nella barra in alto della cartella del paziente, accanto a `Dati e persone` e al menu `Esporta`, ed è visibile da qualunque scheda.

## Che cosa misura, e su quale foto

Il rilevamento avviene **nel browser**: la fotografia non lascia il sistema e nessun servizio esterno la riceve. Su uno scatto frontale l'analisi ricava:

- la **mediana del volto** e il **parallelismo dei piani** interpupillare, dei canti esterni e delle commissure labiali, come scarto in gradi dalla perpendicolare alla mediana;
- i **terzi** (rapporto terzo medio / terzo inferiore). Il terzo superiore non è calcolabile: richiede l'attaccatura dei capelli, che il modello non individua — la pagina lo dichiara invece di stimarlo;
- **quale lato è più largo** a zigomi, canti esterni e commissure. Dice quale lato, non «quanto il volto è asimmetrico»: è la fonte del modello a escludere quel secondo uso;
- la **qualità dello scatto** (rotazioni del capo), che marca gli scatti non frontali invece di nasconderne i numeri.

Le misure sono adimensionali — angoli, rapporti, percentuali — perché da una fotografia senza riferimento metrico i millimetri non si ricavano onestamente.

## Il confronto col canone neoclassico

Ogni voce mostra il valore misurato, il valore che il canone prescrive e lo scarto, mai un voto complessivo. L'avvertenza sui limiti dei canoni sta scritta **prima** dei numeri, con le fonti. Il confronto col canone e il confronto prima/dopo restano separati: fonderli darebbe un numero che non risponde né a «quanto si scosta dal riferimento» né a «cosa ha fatto il trattamento».

## La vista 3D

L'interruttore `Foto | 3D` mostra la mesh del volto ricostruita dai punti di repere, navigabile (trascina per ruotare, rotella per avvicinare), in superficie o reticolo. **Non è una scansione**: la profondità è stimata da una sola fotografia ed è relativa — serve a girare attorno alla forma, non a misurare sporgenze o volumi. Per volumi e mappe di superficie serve hardware di stereofotogrammetria, che questa pagina non pretende di sostituire.

## La serie fotografica per vista

Il protocollo fotografico clinico è una serie di scatti su viste definite — frontale, laterali, oblique a 45°, più le dinamiche per la mimica — ripetuta uguale a ogni visita. Per questo, al caricamento, ogni foto può indicare la **vista**; la scheda `Foto` mostra la serie della visita più recente e dice quali viste mancano.

Tre regole della serie:

- la vista è **facoltativa**: le fotografie caricate prima di questa funzione non ce l'hanno, e «non indicata» resta diverso da «frontale». Il sistema non riempie mai il campo da solo;
- la checklist **informa e non blocca**: scatti fuori serie sono leciti;
- scattando dalla camera con una vista scelta, lo **scatto precedente della stessa vista appare in trasparenza** sul mirino: sovrapporre il volto al fantasma è il modo pratico di ripetere inquadratura e distanza.

L'analisi lavora sugli scatti frontali (e su quelli senza vista indicata); se altri scatti sono esclusi, la pagina dice quanti.

## Salvare le misure in cartella, e leggerle nel tempo

Le misure si ricalcolano dalla fotografia a ogni apertura; **in cartella entrano solo se il medico le salva**, con il pulsante `Salva in cartella` sotto i numeri. È un gesto esplicito di proposito: un numero prodotto da un modello entra nella documentazione clinica solo per decisione del medico, e la registrazione dichiara da sé chi ha misurato (il modello, nel browser), da quale fotografia e chi ha deciso di salvare.

Tre regole del salvataggio:

- la data clinica della misura è quella **dello scatto**, non del giorno in cui si salva;
- ri-salvare la stessa fotografia **aggiorna** la registrazione esistente, non ne crea una seconda;
- uno scatto marcato «da ripetere» (capo ruotato) **non si può salvare**: i suoi numeri non sono confrontabili e in una serie storica farebbero danno.

Dal secondo salvataggio in poi la pagina mostra la sezione **Nel tempo**: una piccola serie per ogni misura, sulle date reali degli scatti, con il valore più recente e la differenza dal primo. È il confronto del volto con sé stesso — quello che questa pagina mette al centro — esteso oltre la coppia di fotografie.

## Registrare il PGAIS dal confronto

Scelte due fotografie (la prima scelta è lo scatto in esame, la seconda il confronto), la sezione «Che cosa è cambiato» mostra le differenze — e il pulsante `Registra PGAIS`. Il PGAIS è il giudizio del medico sul risultato, dato **confrontando le fotografie pre e post**: registrarlo da qui significa registrare anche quali due scatti si stavano guardando, senza ricopiare date.

La risposta è un'etichetta («Molto migliorato», «Migliorato», …), mai un numero: la numerazione del GAIS è usata in letteratura in direzioni opposte, e un numero salvato senza la direzione non sarebbe più interpretabile a distanza di tempo.

## Errori frequenti

- **Confrontare scatti di viste diverse.** Un frontale e un 45° dello stesso giorno si somigliano solo nel nome: il confronto vale fra viste omologhe.
- **Fotografare il «dopo» troppo presto.** A edema non riassorbito il confronto documenta il gonfiore, non il risultato.
- **Leggere il canone come una pagella.** È un riferimento storico dichiarato; lo scarto da esso non è un difetto del paziente né un obiettivo di trattamento.

## Domande frequenti

**Le misure vengono salvate in cartella?** Solo se il medico le salva, con il pulsante dedicato: si ricalcolano dalla fotografia a ogni apertura, e la copia in cartella dichiara chi ha misurato e da quale scatto. Vedi «Salvare le misure in cartella».

**L'analisi manda la foto a un servizio esterno?** No. Il modello di punti di repere gira nel browser; la fotografia resta cifrata nel sistema e viene decifrata solo per chi ha diritto di vederla, come per ogni altra foto clinica.

**Perché non c'è un punteggio complessivo di armonia?** Perché nessuna fonte lo sostiene: i canoni non descrivono la normalità e le proporzioni «ideali» non coincidono con quelle dei volti reali giudicati attraenti. I numeri ci sono tutti; il giudizio resta clinico.
