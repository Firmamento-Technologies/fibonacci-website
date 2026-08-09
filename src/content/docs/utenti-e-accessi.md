# Utenti dello studio e revoca degli accessi

Questa guida descrive come invitare un collaboratore, che cosa può fare, e soprattutto **come togliergli l'accesso quando se ne va**. Si rivolge a chi amministra lo studio.

L'ultima operazione è quella che si rimanda sempre e che conta di più: un collaboratore uscito che conserva le credenziali continua a poter aprire cartelle cliniche, e nessun registro lo segnala come anomalia perché formalmente è ancora autorizzato.

## Prerequisiti

- Account con ruolo `admin studio`.
- Per l'invito: configurazione della posta sul server. Senza, l'account dell'invitato viene creato ma **non riceve il messaggio con il link per impostare la password**, e la richiesta risulta comunque riuscita. Se un invitato dice di non aver ricevuto nulla, è la prima cosa da verificare.

## Passo 1, invitare un collaboratore

In `Impostazioni`, la sezione `Membri studio` elenca chi ha accesso. Il pulsante `Invita utente` chiede nome, cognome, indirizzo email, ruolo e politica di accesso.

Ogni invitato riceve l'**autenticazione a due fattori obbligatoria**: al primo accesso gli viene chiesto di configurarla. Non è disattivabile, e la ragione è che questi account aprono dati relativi alla salute.

La politica di accesso decide che cosa vede: la politica per medico limita la visibilità ai propri pazienti; le politiche di studio estendono la visibilità a tutti i pazienti dello studio. La scelta va fatta consapevolmente, perché è la differenza fra un collega che vede i suoi pazienti e uno che li vede tutti.

## Passo 2, togliere l'accesso a chi se ne va

Nella stessa tabella, la colonna `Accesso` porta il pulsante `Rimuovi accesso`.

Prima di confermare, la finestra dice esattamente che cosa succede, ed è bene leggerlo:

- **l'accesso cessa subito**, comprese le sessioni già aperte: chi stesse lavorando in quel momento viene disconnesso alla prima operazione,
- **i dati clinici restano**. Visite, consensi e firme continuano a essere attribuiti a quel medico. Non è un dettaglio tecnico: un referto non può cambiare autore perché chi l'ha scritto ha cambiato studio,
- **non è reversibile dall'interfaccia**: per far rientrare qualcuno lo si invita di nuovo.

L'operazione viene registrata nel registro accessi: chi l'ha eseguita, su chi, e quando.

### Perché non esiste una «sospensione temporanea»

È la domanda che si pone chiunque cerchi il pulsante e non lo trovi. La risposta è che su questo impianto il campo che sembrerebbe servire, «utente non attivo», **non impedisce l'accesso**: è descrittivo. Un pulsante «sospendi» costruito su quel campo direbbe all'amministratore di aver tolto l'accesso senza averlo tolto, ed è peggio dell'assenza del pulsante.

Se l'assenza è temporanea e si vuole comunque chiudere la porta, la strada è rimuovere l'accesso e reinvitare al rientro.

## Passo 3, i casi in cui il pulsante non compare

Al posto del pulsante si trova un trattino, e passandoci sopra si legge il motivo:

- **il proprio account**: nessuno si toglie l'accesso da solo. Se fosse un errore non resterebbe nessuno a rimediare dall'interfaccia,
- **l'ultimo amministratore**: rimuoverlo chiuderebbe lo studio fuori dal proprio progetto,
- **le identità di servizio** (integrazioni e automazioni): si spengono dove sono configurate, non dalla schermata dei colleghi.

## Errori frequenti

- **Rimandare la revoca a «quando ci sarà tempo».** È l'unica operazione di questa guida che ha una finestra: il rischio esiste fra l'uscita e la revoca.
- **Invitare con una politica di studio «per comodità».** Estende la visibilità a tutti i pazienti, e non si torna indietro da sé.
- **Dare per riuscito un invito senza conferma dell'invitato.** Se la posta non è configurata, la richiesta riesce e il messaggio non parte.

## Domande frequenti

**Che cosa succede alle cartelle che aveva in carico?** Restano dove sono. Cambia chi può aprirle, non a chi sono attribuite.

**Posso vedere chi ha rimosso chi?** Sì, nel registro accessi: l'operazione è tracciata come evento di sicurezza, distinta da una cancellazione clinica.

**Un collaboratore rimosso può ancora usare un'app aperta?** No. La sessione in corso smette di funzionare alla prima operazione: la revoca non aspetta la scadenza del token.
