# Primo accesso e configurazione iniziale

Questa guida descrive le operazioni necessarie per iniziare a utilizzare Fibonacci dal primo accesso fino alla configurazione completa dello studio. Si rivolge al medico titolare o al referente amministrativo dello studio che riceve per primo l'email di invito.

Al termine della procedura lo studio dispone di un account amministrativo protetto da autenticazione a due fattori, di un profilo studio completo e dei primi operatori invitati. Il tempo medio richiesto e di circa quindici minuti.

## Prerequisiti

- Email di invito ricevuta all'indirizzo comunicato in fase di onboarding commerciale.
- Browser supportato aggiornato: Chrome, Edge, Safari o Firefox in versione recente.
- Smartphone con installata un'applicazione **authenticator**: `Google Authenticator`, `Authy`, `1Password` o `Microsoft Authenticator`.
- File del logo dello studio in formato PNG, dimensione consigliata 512 x 512 pixel, sfondo trasparente.
- Dati fiscali dello studio: ragione sociale, partita IVA, indirizzo della sede, recapiti pubblici.

## Passo 1, accesso tramite link di invito

L'email di invito proviene dall'indirizzo `noreply@fibonacci.it` con oggetto `Invito a Fibonacci`. Contiene un link unico valido per quarantotto ore.

Apri il link in una scheda nuova del browser. Se il link risulta scaduto, contatta il supporto allo `supporto@fibonacci.it` per ricevere un nuovo invito.

La prima schermata richiede di confermare l'indirizzo email e di impostare una password personale. La password deve rispettare i seguenti requisiti minimi:

- almeno dodici caratteri,
- almeno una lettera maiuscola e una minuscola,
- almeno un numero,
- almeno un carattere speciale tra `! @ # $ % & * ?`.

Le password vengono confrontate con elenchi pubblici di credenziali compromesse. Una password debole o riutilizzata viene rifiutata con messaggio esplicito.

## Passo 2, abilitazione MFA TOTP

MFA, ovvero **Multi-Factor Authentication**, e l'autenticazione a due fattori: oltre alla password viene richiesto un codice temporaneo generato dall'app authenticator sullo smartphone. L'attivazione e obbligatoria per tutti gli account che accedono a dati sanitari.

La procedura guidata mostra un codice QR. Apri l'app authenticator sullo smartphone, seleziona `Aggiungi account` o equivalente, inquadra il codice QR. L'app aggiunge una nuova voce denominata `Fibonacci - email@esempio.it` e inizia a mostrare un codice numerico di sei cifre rinnovato ogni trenta secondi.

Digita il codice corrente nel campo di verifica e conferma. La validazione e immediata: se il codice e corretto, l'app riceve conferma di attivazione MFA.

## Passo 3, codici di recupero

Subito dopo l'attivazione MFA, Fibonacci genera dieci **codici di recupero** monouso. Ogni codice puo essere utilizzato una sola volta al posto del codice TOTP in caso di smarrimento dello smartphone.

Stampa la pagina o scarica il file PDF mostrato. Conserva i codici in un luogo fisico sicuro, separato dallo smartphone. Non salvarli nello stesso dispositivo che genera i codici TOTP.

Quando un codice di recupero viene utilizzato risulta consumato. Quando rimangono meno di tre codici inutilizzati, l'applicazione mostra un avviso per generarne di nuovi.

## Passo 4, profilo dello studio

Dopo il primo accesso completo, l'applicazione apre la schermata `Impostazioni > Studio`. I campi obbligatori sono:

- **Ragione sociale**, denominazione legale dello studio o nome e cognome del professionista.
- **Partita IVA** italiana, undici cifre, validata automaticamente sul formato.
- **Codice fiscale** dello studio o del titolare.
- **Indirizzo della sede**: via, civico, CAP, citta, provincia.
- **Recapiti pubblici**: telefono dello studio, email pubblica, sito web facoltativo.

I campi facoltativi includono il numero di iscrizione all'Ordine dei Medici, la specializzazione principale, l'orario di apertura.

Il logo dello studio si carica con il pulsante `Carica logo`. Il sistema accetta PNG e JPEG fino a due megabyte e ridimensiona automaticamente l'immagine a 512 x 512 pixel mantenendo le proporzioni. Il logo appare nelle ricevute, nei consensi e nei messaggi al paziente.

## Passo 5, invito degli operatori

Dal pannello `Impostazioni > Utenti`, il pulsante `Invita operatore` apre una modale con i seguenti campi:

- nome e cognome dell'operatore,
- email aziendale,
- ruolo,
- specialita facoltativa.

I ruoli disponibili sono:

- **Admin studio**, accesso completo a tutte le aree comprese le impostazioni e l'audit log.
- **Medico**, accesso clinico ai pazienti assegnati o all'intero studio in base alla configurazione, accesso completo a cartelle, visite, dettatura, consensi.
- **Segreteria**, accesso ad agenda e anagrafica paziente, accesso in sola lettura alla parte clinica, nessun accesso ad audit log.

Ogni operatore invitato riceve la propria email di invito con la stessa procedura descritta nei passi da uno a tre. Al primo accesso l'operatore configura la propria password personale e il proprio MFA.

Il numero massimo di operatori dipende dal piano sottoscritto. Il pannello mostra il consumo corrente e il limite del piano.

## Suggerimenti

- Crea da subito un account amministrativo dedicato, separato dall'account medico clinico, per le operazioni di sola gestione.
- Stampa i codici di recupero in due copie e conservane una fuori dallo studio.
- Configura il logo prima di iniziare a generare consensi: i PDF gia generati non vengono aggiornati retroattivamente.
- Verifica i dati fiscali con il commercialista prima del salvataggio: appaiono su ricevute e fatture.

## Risoluzione problemi

**Il codice TOTP risulta non valido.** Verifica che l'ora dello smartphone sia sincronizzata automaticamente con la rete. Una deriva temporale superiore ai trenta secondi invalida i codici TOTP. Su iOS, `Impostazioni > Generali > Data e ora > Automatica`. Su Android, `Impostazioni > Sistema > Data e ora > Automatica`.

**Il link di invito risulta scaduto.** I link sono validi quarantotto ore. Richiedi un nuovo invito al supporto allo `supporto@fibonacci.it` indicando l'email destinataria.

**Codici di recupero smarriti e smartphone non disponibile.** Contatta il supporto. La procedura prevede verifica dell'identita del titolare dello studio tramite documento d'identita e successivo reset MFA. Il reset richiede fino a ventiquattro ore lavorative.

**Errore durante l'upload del logo.** Verifica che il file sia in formato PNG o JPEG e non superi i due megabyte. File con profilo colore CMYK o trasparenze complesse vengono talvolta rifiutati: salva il file in PNG sRGB e ricarica.

## Vedi anche

- [Creazione e gestione anagrafica paziente](anagrafica-paziente)
- [Agenda e gestione appuntamenti](agenda-appuntamenti)
- [Audit log e tracciabilita accessi](audit-log)

Ultima revisione: {ULTIMA_REVISIONE}
