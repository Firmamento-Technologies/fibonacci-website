# Prescrizioni e terapie

Questa guida descrive come compilare una prescrizione, come il sistema controlla le allergie e che cosa fa quando il controllo non può essere eseguito. Si rivolge ai medici.

## Prerequisiti

- Account con ruolo `medico`, con i dati di iscrizione all'Ordine compilati: compaiono sulla ricetta stampata.
- Anagrafica del paziente con anamnesi, se si vuole che il controllo delle allergie abbia qualcosa su cui lavorare.

## Passo 1, scegliere il farmaco

Il campo del farmaco cerca nel catalogo AIFA, che contiene sia i nomi commerciali sia i **principi attivi**: digitando `ialuronico` o `botulinica` compaiono i prodotti corrispondenti, anche quando il nome commerciale è diverso.

⚠️ **I filler non sono nel catalogo, ed è corretto**: sono dispositivi medici marcati CE, non medicinali, e non compaiono in un archivio di farmaci. Si registrano come trattamento (vedi la guida `Registrare un trattamento`), non come prescrizione.

## Passo 2, il controllo delle allergie

Al momento della scelta, il sistema confronta il farmaco con le allergie registrate in anamnesi e mostra un avviso se trova una corrispondenza.

🔑 **Il controllo è fail-open, e va saputo**: se l'anamnesi è vuota, o se il farmaco non è riconosciuto, **non compare nessun avviso**. L'assenza di un avviso non significa «nessuna allergia»: significa «nessuna corrispondenza trovata». È una distinzione che conta, ed è il motivo per cui il controllo non sostituisce l'anamnesi fatta bene.

## Passo 3, dose, frequenza, durata

I campi seguono la struttura della ricetta: dose, frequenza, periodicità, durata in giorni, note al paziente. Le note vengono stampate: sono il posto per le indicazioni d'uso e le controindicazioni da ricordare.

## Passo 4, stampa

La ricetta stampata riporta i dati dello studio e del medico — denominazione, sede, iscrizione all'Ordine con numero — presi dalla configurazione dello studio. Se quei campi sono vuoti, la ricetta li stampa come spazi da riempire a mano: il sistema non inventa dati identificativi.

## Errori frequenti

- **Contare sull'avviso delle allergie come se fosse una garanzia.** È un aiuto, non un presidio: senza anamnesi non ha nulla da confrontare.
- **Registrare un filler come prescrizione.** È un dispositivo: va nella seduta, con lotto e quantità.
- **Dati dell'Ordine non compilati.** Compaiono vuoti sulla ricetta e sui consensi, e si notano solo quando il documento è già in mano al paziente.

## Domande frequenti

**Posso prescrivere farmaci a carico del Servizio sanitario?** No: la ricetta prodotta qui è una prescrizione privata. Le funzioni per il canale telematico esistono nel prodotto ma sono spente e richiedono accreditamenti regionali.

**Le prescrizioni finiscono nell'export del paziente?** Sì, insieme al resto della cartella.
