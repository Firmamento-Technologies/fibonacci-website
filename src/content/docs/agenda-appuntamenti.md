# Agenda e gestione appuntamenti

Questa guida descrive come utilizzare l'agenda integrata di Fibonacci per pianificare visite, gestire un calendario condiviso multi-operatore, inviare reminder SMS automatici ai pazienti, esportare e sincronizzare gli appuntamenti con calendari esterni. Si rivolge ai medici e al personale di segreteria.

L'agenda e progettata per studi di piccole e medie dimensioni, da uno a venti operatori. La vista predefinita e settimanale per privilegiare la pianificazione operativa quotidiana, ma sono disponibili viste giornaliera e mensile per esigenze diverse.

## Prerequisiti

- Account con ruolo `medico`, `segreteria` o `admin studio`.
- Anagrafica paziente esistente per la creazione dell'appuntamento; in alternativa il paziente puo essere creato al volo dalla modale appuntamento.
- Per i reminder SMS automatici: piano sottoscritto che includa il modulo `Comunicazioni`, oppure attivazione opzionale a consumo. Il provider e Brevo o MessageBird in funzione della configurazione di tenant.
- Numero di cellulare del paziente in formato `+39 333 1234567` per il corretto invio dei reminder.

## Passo 1, accesso all'agenda

Dalla barra di navigazione principale, l'icona calendario apre la sezione `Agenda`. La schermata mostra:

- in alto a sinistra il selettore di vista: `Giornaliera`, `Settimanale`, `Mensile`,
- in alto a destra il selettore operatore con filtro `Tutti`, `Solo io`, `Multi-operatore`,
- al centro la griglia oraria con gli appuntamenti disposti come blocchi colorati,
- nella sidebar destra il pannello dettagli dell'appuntamento selezionato.

La vista settimanale e il default e mostra cinque o sette giorni in funzione delle preferenze: `Impostazioni > Agenda > Giornate visibili`.

## Passo 2, creazione di un nuovo appuntamento

Click sinistro su una fascia oraria libera apre la modale `Nuovo appuntamento`. I campi sono:

- **Paziente**, combobox con autocompletamento sull'anagrafica esistente. Il pulsante `+` adiacente apre la creazione rapida paziente.
- **Operatore**, selezione tra gli operatori attivi dello studio. Default: utente corrente se ha ruolo medico, altrimenti il primo operatore disponibile.
- **Motivo** o **Tipo visita**, selezione da catalogo configurabile: `Prima visita`, `Visita di controllo`, `Trattamento`, `Procedura`, `Telemedicina`.
- **Durata**, valore in minuti con default trenta, opzioni rapide quindici, trenta, quarantacinque, sessanta, novanta.
- **Stato iniziale**, default `Programmato`, ridefinibile in seguito.
- **Note**, campo libero per memo dell'operatore non visibili al paziente.
- **Note paziente**, campo libero incluso nei reminder automatici.

Il pulsante `Salva` registra l'appuntamento. La fascia oraria appare immediatamente nella griglia con il colore associato all'operatore o al tipo di visita in base alla preferenza configurata.

## Passo 3, gestione dei conflitti di calendario

Il sistema verifica in tempo reale la presenza di sovrapposizioni con appuntamenti esistenti per lo stesso operatore. In caso di conflitto, la modale mostra un avviso giallo con il dettaglio dell'appuntamento in conflitto e tre opzioni:

- `Modifica orario`, torna alla compilazione,
- `Assegna ad altro operatore`, cambia operatore mantenendo l'orario,
- `Salva comunque`, registra la sovrapposizione e la marca con icona di avviso nella griglia.

La sovrapposizione `Salva comunque` e utile in casi specifici, ad esempio doppio appuntamento per accompagnatore e paziente, ma in generale si sconsiglia.

## Passo 4, gestione degli stati appuntamento

Ogni appuntamento ha uno stato corrente, rappresentato graficamente da colore e icona:

- **Programmato**, stato iniziale, blu chiaro.
- **Confermato**, paziente ha confermato a seguito di reminder, blu pieno.
- **Check-in**, paziente arrivato in studio, verde chiaro.
- **In corso**, visita iniziata, verde pieno.
- **Completato**, visita terminata, grigio.
- **No-show**, paziente non presentato, arancione.
- **Annullato**, appuntamento annullato prima dell'inizio, rosso chiaro.

Il cambio stato avviene cliccando sull'appuntamento e selezionando il nuovo stato dalla sidebar destra. Il sistema registra timestamp di ogni cambio in audit log.

Lo stato `Check-in` puo essere attivato automaticamente da un eventuale chiosco di accettazione in studio (modulo opzionale). Lo stato `In corso` puo essere attivato automaticamente all'apertura della scheda visita del paziente.

## Passo 5, reminder SMS automatici

I reminder SMS sono inviati automaticamente al numero di cellulare del paziente registrato in anagrafica. Il messaggio standard segue il formato:

`Gentile [nome], la ricordiamo l'appuntamento del [data ora] presso [nome studio]. Per confermare risponda 1, per annullare 2. [link]`

La configurazione dei reminder e in `Impostazioni > Comunicazioni > Reminder`:

- **T-24h**, reminder ventiquattro ore prima dell'appuntamento, default attivo.
- **T-2h**, reminder due ore prima, default disattivo, attivabile.
- **T-7gg**, reminder sette giorni prima per appuntamenti a lungo termine, default disattivo.

Il provider SMS in uso e visibile nelle impostazioni: Brevo per i piani standard, MessageBird per i piani internazionali. Il costo per SMS dipende dal piano sottoscritto.

I reminder richiedono:

- numero di cellulare in formato internazionale `+39` per i numeri italiani,
- flag `Consenso comunicazioni` attivo nell'anagrafica paziente,
- saldo SMS sufficiente nel piano.

La risposta del paziente ai reminder (`1` per confermare, `2` per annullare) aggiorna automaticamente lo stato dell'appuntamento e notifica l'operatore.

## Passo 6, vista multi-operatore

Per studi con piu medici o operatori contemporanei, la vista multi-operatore mostra:

- colonna verticale per ogni operatore selezionato,
- intestazione con nome e specialita,
- codifica colore distinta per ogni operatore,
- riga delle ore comune.

Il selettore in alto a destra permette di scegliere quali operatori visualizzare. La preferenza viene memorizzata per utente.

Il filtro `Solo io` riduce la vista al calendario personale, utile per la pianificazione individuale del medico. Il filtro `Multi-operatore` aggrega gli operatori configurati nel gruppo di lavoro principale.

## Passo 7, drag and drop e modifiche rapide

L'agenda supporta interazioni dirette per modifiche rapide:

- **Trascinamento** di un appuntamento su un'altra fascia oraria, sposta data o ora mantenendo durata e dettagli,
- **Trascinamento** del bordo inferiore di un appuntamento, modifica la durata,
- **Doppio click** su un appuntamento, apre il pannello dettagliato con tutti i campi,
- **Click destro** su un appuntamento, apre il menu rapido con `Modifica`, `Annulla`, `Duplica`, `Sposta`, `Marca check-in`,
- **Click destro** su una fascia libera, apre il menu rapido con `Nuovo appuntamento`, `Blocca fascia`, `Pausa pranzo`.

Le modifiche per drag and drop generano automaticamente, se l'appuntamento e gia stato confermato, una notifica al paziente con il nuovo orario.

## Passo 8, export e sincronizzazione iCal

Il pulsante `Esporta` apre due opzioni:

- **Export PDF settimanale**, genera un PDF con la griglia settimanale stampabile, utile per archiviazione cartacea o consegna al titolare.
- **Esporta iCal**, scarica un file `.ics` con tutti gli appuntamenti del range selezionato.

La sincronizzazione automatica con calendari esterni e disponibile in `Impostazioni > Integrazioni > Calendari`. Il sistema supporta:

- Google Calendar tramite OAuth,
- Microsoft Outlook tramite OAuth,
- qualsiasi calendario che supporti URL iCal in sola lettura.

La sincronizzazione e bidirezionale per Google e Microsoft (creare un evento nel calendario esterno crea l'appuntamento in Fibonacci e viceversa) e unidirezionale per altri calendari (solo lettura da Fibonacci).

Per privacy, gli appuntamenti sincronizzati esternamente mostrano solo titolo generico (`Visita medica`) e ora, senza dati paziente.

## Suggerimenti

- Configura i tipi di visita ricorrenti dello studio in `Impostazioni > Agenda > Tipi visita` con durata e colore predefiniti: la creazione di nuovi appuntamenti diventa piu rapida.
- Per studi con orari ricorrenti, blocca le fasce di pausa pranzo e riunione tramite `Blocca fascia` ripetuto: gli appuntamenti non potranno essere creati su quelle fasce.
- Imposta i reminder T-24h come default e attiva il T-2h solo per appuntamenti complessi o prima visita: riduce il sovraccarico di notifiche.
- Per appuntamenti telemedicina, il sistema genera automaticamente il link videocall nella conferma e nel reminder se il modulo telemedicina e attivo.
- Doppio click su un giorno della vista mensile apre la vista giornaliera dettagliata di quella data.

## Risoluzione problemi

**Reminder SMS non arrivati al paziente.** Verifica nell'ordine: numero di cellulare in formato internazionale `+39 333 1234567`; flag `Consenso comunicazioni` attivo in anagrafica paziente; saldo SMS sufficiente nel pannello `Impostazioni > Comunicazioni > Saldo`; storico invio del singolo appuntamento nel pannello `Comunicazioni > Storico` che mostra eventuali errori del provider.

**Appuntamento sovrapposto creato per errore.** Apri l'appuntamento e usa `Modifica orario` per spostarlo, oppure `Assegna ad altro operatore` per ridistribuire il carico. In ogni caso il sistema notifica eventuali pazienti gia avvisati con il nuovo orario o cambio operatore.

**Sincronizzazione Google Calendar interrotta.** Spesso causata da scadenza del token OAuth dopo periodi prolungati di inutilizzo. Apri `Impostazioni > Integrazioni > Google Calendar` e ripeti l'autorizzazione. Gli appuntamenti gia sincronizzati restano integri.

**Drag and drop non funziona su tablet o touchscreen.** Su alcuni dispositivi mobili la modalita drag richiede una pressione prolungata (long press) prima di iniziare a trascinare. In alternativa, usa il pannello laterale `Modifica` per cambiare data e ora con tastiera virtuale.

**Stato `No-show` non aggiornato automaticamente.** Lo stato resta `Programmato` o `Confermato` se non viene marcato manualmente. Configura in `Impostazioni > Agenda > Auto no-show` il timeout dopo il quale un appuntamento non avviato viene marcato automaticamente come `No-show`: default disabilitato, valore consigliato sessanta minuti.

## Vedi anche

- [Creazione e gestione anagrafica paziente](anagrafica-paziente)
- [Primo accesso e configurazione iniziale](installazione)
- [Audit log e tracciabilita accessi](audit-log)

Ultima revisione: {ULTIMA_REVISIONE}
