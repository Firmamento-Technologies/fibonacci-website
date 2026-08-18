# Analisi del volto

Questa guida descrive la pagina «Analisi del volto»: il **confronto diretto fra due fotografie**, prima e dopo, la **vista tridimensionale** del viso, lo **specchio dal vivo** e la registrazione del **giudizio clinico (PGAIS)** sul confronto.

La pagina **non misura**. Non calcola angoli, rapporti, scarti né punteggi, non li salva in cartella e non li confronta con nessun riferimento: mostra le fotografie e la forma del viso, e il giudizio resta del medico.

## Prerequisiti

- Account con ruolo `medico` o `admin studio`.
- Almeno una fotografia frontale del viso già in cartella (vedi la guida «Foto cliniche e confronto prima/dopo»).

## Dove si trova

Il pulsante `Analisi del volto` sta nella barra in alto della cartella del paziente, accanto a `Dati e persone` e al menu `Esporta`, ed è visibile da qualunque scheda.

## Il confronto prima/dopo

Il primo clic sceglie lo scatto in esame, il secondo su un'altra fotografia aggiunge il confronto: le due schede si affiancano e si guardano insieme. È il gesto centrale della pagina.

Sopra ogni fotografia la pagina segnala quando lo **scatto non è confrontabile**: una posa diversa (mento alzato, testa ruotata) cambia quello che si vede, e due pose diverse non si paragonano. L'avviso non blocca niente: informa prima che qualcuno tragga una conclusione.

## La vista 3D

L'interruttore `Foto | 3D` mostra la forma del volto ricostruita dai punti di repere, navigabile (*«Trascina per girare, rotella per avvicinare»*), in superficie, reticolo o **`Rilievo`**, che colora la superficie per profondità invece di imitare la pelle: è il modo in cui le asimmetrie di volume si vedono a occhio. Sono visibili anche i punti di repere, tutti e 468.

**Non è una scansione**: la profondità è stimata da una sola fotografia ed è relativa. Serve a girare attorno alla forma e a mostrarla al paziente, **non** a misurare sporgenze o volumi. Per volumi e mappe di superficie serve hardware di stereofotogrammetria, che questa pagina non pretende di sostituire.

## Il reticolo sopra la fotografia

Il pulsante `Maglia` sovrappone alla fotografia il reticolo dei punti di repere: mostra **come il software vede la forma del viso**. Non è una misura e non è un giudizio; resta acceso fra una foto e l'altra perché chi lo usa lo usa sempre.

## Lo specchio dal vivo

`Specchio dal vivo` accende la fotocamera e mostra al paziente il proprio viso in tempo reale, con l'invito a `Inquadra il viso`. **Non misura e non registra niente**, e la fotocamera *«è spenta. Si accende solo quando lo chiedi»*: serve durante il colloquio, per parlare di una zona guardandola insieme.

## La serie fotografica per vista

Il protocollo fotografico clinico è una serie di scatti su viste definite (frontale, laterali, oblique a 45°, più le dinamiche per la mimica) ripetuta uguale a ogni visita. Per questo, al caricamento, ogni foto può indicare la **vista**; la scheda `Foto` mostra la serie della visita più recente e dice quali viste mancano.

Tre regole della serie:

- la vista è **facoltativa**: le fotografie caricate prima di questa funzione non ce l'hanno, e «non indicata» resta diverso da «frontale». Il sistema non riempie mai il campo da solo;
- la checklist **informa e non blocca**: scatti fuori serie sono leciti;
- scattando dalla camera con una vista scelta, lo **scatto precedente della stessa vista appare in trasparenza** sul mirino: sovrapporre il volto al fantasma è il modo pratico di ripetere inquadratura e distanza.

La pagina lavora sugli scatti frontali (e su quelli senza vista indicata); se altri scatti sono esclusi, dice quanti.

## Registrare il PGAIS dal confronto

Scelte due fotografie, compare il pulsante `Registra PGAIS`. Il PGAIS è il giudizio del medico sul risultato, dato **confrontando le fotografie pre e post**: registrarlo da qui significa registrare anche quali due scatti si stavano guardando, senza ricopiare date.

La risposta è un'etichetta («Molto migliorato», «Migliorato», …), mai un numero: la numerazione del GAIS è usata in letteratura in direzioni opposte, e un numero salvato senza la direzione non sarebbe più interpretabile a distanza di tempo.

## Errori frequenti

- **Confrontare scatti di viste diverse.** Un frontale e un 45° dello stesso giorno si somigliano solo nel nome: il confronto vale fra viste omologhe.
- **Fotografare il «dopo» troppo presto.** A edema non riassorbito il confronto documenta il gonfiore, non il risultato.
- **Leggere il 3D come una misura.** È una rappresentazione della forma ricavata da una fotografia: serve a guardare e a mostrare, non a quantificare.

## Domande frequenti

**La pagina salva qualcosa in cartella?** Solo il PGAIS, che è il giudizio del medico, con i due scatti a cui si riferisce. La forma 3D e il reticolo si ricalcolano dalla fotografia a ogni apertura e non vengono conservati.

**L'analisi manda la foto a un servizio esterno?** No. Il modello di punti di repere gira nel browser; la fotografia resta cifrata nel sistema e viene decifrata solo per chi ha diritto di vederla, come per ogni altra foto clinica.

**Perché non ci sono misure del viso?** Scelta di prodotto. Un numero clinico ha senso solo con la sua accuratezza dichiarata e con qualcuno che risponda di quella accuratezza: finché non c'è, la pagina mostra le fotografie e la forma, e lascia al medico la misura e il giudizio.
