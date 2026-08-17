# Compilare a voce: la dettatura

> ⚠️ **Riscritta il 2026-08-17 guardando la schermata.** La versione precedente
> descriveva un pannello che non è mai esistito: un pulsante `Estrai campi`, un
> punteggio di affidabilità per ogni campo con i colori verde, giallo e rosso,
> tre pulsanti `Accetta` / `Modifica` / `Scarta` per riga, una sezione
> `Impostazioni > Dettatura` con la soglia di silenzio e la conservazione delle
> trascrizioni. Niente di tutto ciò è nel prodotto. Quello che segue sì.

La dettatura trascrive quello che dici e, dove il modulo lo prevede, propone i
campi già compilati. **Non scrive mai da sola in cartella**: fra la voce e il
dato salvato ci sono sempre una revisione e un pulsante premuto da te.

## Dove si detta

Il pulsante compare in tre punti, con un'etichetta diversa in ognuno perché
«detta cosa» cambia col posto:

- **`Detta l'anamnesi`**, nella scheda `Anamnesi` della cartella;
- **`Detta la seduta`**, nel modulo del trattamento, accanto alle note;
- nella **valutazione clinica**, quando lo studio ha quel modulo attivo.

A riposo è una riga sola: un pulsante e una frase. Il riquadro compare quando
c'è qualcosa dentro.

## Prerequisiti

- Account con ruolo `medico` e accesso clinico al paziente.
- Microfono funzionante e permesso concesso al browser. La qualità della
  trascrizione dipende più dal rumore ambientale che dal microfono.
- Connessione: la trascrizione avviene su un servizio, non nel browser.

## Passo 1, dettare

Premi il pulsante. Compare un pallino rosso e la scritta `Sto ascoltando`, e
sotto, in `Trascrizione`, il testo appare mentre parli: *«Parla pure: il testo
compare qui mentre parli»*.

Due pulsanti: **`Fine`** chiude la dettatura e passa alla revisione,
**`Annulla`** la butta via.

## Passo 2, rivedere

Alla fine il testo trascritto compare in un'area **modificabile**, sotto un
avviso che vale la pena leggere una volta:

> Rivedi prima di usarlo. La trascrizione automatica sbaglia soprattutto su
> farmaci, dosaggi e termini tecnici: correggi qui sotto.

Se il modulo prevede l'estrazione dei campi, accanto all'avviso compare
l'**attendibilità dell'estrazione** in percentuale. È un numero solo per tutta
l'estrazione, non uno per campo, ed è un indicatore tecnico: dice quanto il
modello ha trovato chiaro il testo, non quanto è corretto quello che hai detto.

## Passo 3, che cosa farne

Tre pulsanti, e fanno cose diverse:

- **`Scarta`**: butta via la trascrizione.
- **`Usa testo`**: prende il testo così com'è e lo mette nel campo di
  destinazione (per esempio in coda alle note della seduta). Compare solo dove
  quel testo ha una destinazione: altrove sarebbe un pulsante che cancella e
  basta, ed è stato tolto.
- **il pulsante di applicazione** (`Proponi per la cartella` nell'anamnesi,
  `Compila i campi` nel trattamento): prende i **campi** riconosciuti e li porta
  nel modulo, dove restano modificabili. Compare solo se l'estrazione ha
  prodotto qualcosa.

⚠️ **Anche dopo aver applicato i campi, il salvataggio è un gesto a parte.**
Applicare riempie il modulo; in cartella ci va quello che salvi tu.

## Che cosa la dettatura compila, e che cosa no

Questo è il punto in cui le aspettative si rompono più spesso, quindi vale la
misura invece della promessa.

**Nel trattamento** vengono proposti prodotto, quantità, lotto, uso off-label e
la sua motivazione. **Non** vengono compilati i parametri del dispositivo
(lunghezza d'onda, fluenza, spot, frequenza, durata d'impulso, passaggi,
raffreddamento, endpoint), né la diluizione, l'UDI o la scadenza del lotto:
vanno scritti a mano.

**Le zone dettate non diventano pallini sulla mappa.** Finiscono in coda alle
note nella forma `[aree dettate: …]`, insieme all'eventuale `[categoria
suggerita: …]`, perché segnare un'area richiede il suo codice esatto. Per
portarle sulla mappa c'è il pulsante `Auto-estrai aree dal testo`: vedi
[Le aree trattate](/manuale/body-map).

⚠️ **La dettatura è in italiano.** Anche con l'interfaccia in inglese, il
riconoscimento e l'estrazione lavorano sull'italiano.

## Responsabilità clinica

Il principio non è derogabile: **il sistema non scrive nulla in cartella senza
un'azione esplicita del medico.** Ogni testo trascritto e ogni campo proposto
richiedono una revisione e un gesto affermativo. La responsabilità della
corretta compilazione resta di chi firma la cartella.

## Privacy del flusso audio

L'audio viene inviato al servizio di trascrizione (Mistral, Unione Europea) e
**non viene conservato** né da noi né da loro oltre il tempo dell'elaborazione;
i contenuti inviati tramite API non vengono usati per addestrare modelli.

Se per una visita non vuoi usare la dettatura, si compila a mano: non resta
nessuna traccia audio da nessuna parte.

## Suggerimenti

- **Parla a velocità naturale**, senza scandire: il modello è tarato sul parlato
  spontaneo italiano, e rallentare peggiora il risultato.
- **Niente comandi vocali** tipo «punto» o «a capo»: la punteggiatura la mette
  da sé.
- **I farmaci per esteso**, principio attivo e dose: «pantoprazolo quaranta
  milligrammi una compressa al mattino».
- **Una voce alla volta.** Se il paziente parla insieme a te, la trascrizione
  peggiora.
- **Rileggi sempre i numeri.** Dosaggi e lotti sono esattamente ciò su cui la
  trascrizione sbaglia di più, ed è anche ciò che conta di più.

## Risoluzione problemi

**Il microfono non viene rilevato.** Controlla il permesso nel browser (in
Chrome, il lucchetto a sinistra dell'indirizzo, voce `Microfono`) e le
impostazioni del sistema operativo: un microfono spento a livello di sistema non
è accessibile dal browser.

**Compare un errore rosso sotto il pulsante.** Il messaggio dice la causa: quasi
sempre è il permesso negato o il servizio di trascrizione non raggiungibile.

**La trascrizione arriva ma nessun campo viene proposto.** Il pulsante di
applicazione compare solo se l'estrazione ha riconosciuto qualcosa. Puoi
comunque usare `Usa testo` e correggere a mano.

**Ho dettato le aree e la mappa è vuota.** È il comportamento previsto: vedi
sopra, «Che cosa la dettatura compila, e che cosa no».

## Vedi anche

- [Creazione e gestione anagrafica paziente](/manuale/anagrafica-paziente)
- [Le aree trattate: sulla foto e sul modello 3D](/manuale/body-map)
- [Registrare un trattamento](/manuale/trattamenti)
- [Audit log e tracciabilita accessi](/manuale/audit-log)

Ultima revisione: {ULTIMA_REVISIONE}
