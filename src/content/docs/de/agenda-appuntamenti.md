# Terminplanung und Verwaltung von Terminen

> ⚠️ **Gegen die Anwendung am 2026-08-10 geprüft.** Die hier aufgeführten Punkte sind diejenigen,
> die tatsächlich existieren. Falls du einen beschriebenen Punkt nicht auf dem Bildschirm siehst, handelt es sich um einen Fehler
> in der Anleitung: bitte melde ihn.

Diese Anleitung beschreibt, wie du den integrierten Terminplaner von Fibonacci nutzt, um Besuche zu planen, einen gemeinsamen Kalender mit mehreren Behandelnden zu verwalten, automatische SMS-Erinnerungen an Patientinnen und Patienten zu senden, Termine zu exportieren und mit externen Kalendern zu synchronisieren. Sie richtet sich an Ärztinnen, Ärzte und das Praxispersonal.

Der Terminplaner ist für kleine und mittelgroße Praxen mit ein bis zwanzig Behandelnden konzipiert. Die Standardansicht ist wochenweise, um die tägliche operative Planung zu erleichtern, aber Tages- und Monatsansichten sind für unterschiedliche Bedürfnisse verfügbar.

## Voraussetzungen

- Konto mit der Rolle `Ärztin, Arzt oder medizinische Fachkraft`, `KI-Empfang` oder `Administration`.
- Bestehende Patientinnen- und Patientenstammdaten für die Terminbuchung; alternativ kann die Patientin oder der Patient direkt aus dem Terminmodal erstellt werden.
- Für automatische SMS-Erinnerungen: ein abonnierter Tarif, der das Modul `Kommunikation` beinhaltet, oder eine optionale Aktivierung auf Verbrauchsbasis. Der Anbieter ist Brevo oder MessageBird, abhängig von der Tenant-Konfiguration.
- Mobiltelefonnummer der Patientin oder des Patienten im Format `+39 333 1234567` für den korrekten Versand der Erinnerungen.

## Schritt 1, Zugriff auf den Terminplaner

Über das Hauptnavigationsmenü öffnet das Kalendersymbol den Bereich `Termine`. Der Bildschirm zeigt:

- oben links den Ansichtsselektor: `Täglich`, `Woche`, `Monat`,
- oben rechts den Behandelnden-Selektor mit den Filtern `Alle`, `Nur ich`, `Mehrere Behandelnde`,
- in der Mitte das Zeitraster mit den Terminen als farbige Blöcke,
- in der rechten Seitenleiste das Detailfenster des ausgewählten Termins.

Die Wochenansicht ist die Standardansicht und zeigt fünf oder sieben Tage, abhängig von den Einstellungen: `Einstellungen > Termine > Sichtbare Tage`.

## Schritt 2, Erstellung eines neuen Termins

Linksklick auf einen freien Zeitbereich öffnet das Modal `Neuer Termin`. Die Felder sind:

- **Patientin oder Patient**, Kombinationsfeld mit Autovervollständigung auf den bestehenden Stammdaten. Die Schaltfläche `+` daneben öffnet die schnelle Patientenerstellung.
- **Behandelnde/r**, Auswahl aus den aktiven Behandelnden der Praxis. Standard: aktueller Nutzer, wenn die Rolle Ärztin, Arzt oder medizinische Fachkraft hat, ansonsten der erste verfügbare Behandelnde.
- **Grund** oder **Art der Behandlung**, Auswahl aus dem von der Praxis konfigurierbaren Katalog: Die verfügbaren Einträge sind diejenigen, die du im Menü findest, kein fester Katalog.
- **Dauer**, Wert in Minuten mit Standard dreißig, Schnelloptionen fünfzehn, dreißig, fünfundvierzig, sechzig, neunzig.
- **Status**, später aus dem Terminblatt änderbar.
- **Notizen**, Freitextfeld für Memos der Behandelnden, nicht für die Patientin oder den Patienten sichtbar.
- **Notizen für Patientin oder Patient**, Freitextfeld, das in den automatischen Erinnerungen enthalten ist.

Die Schaltfläche `Speichern` registriert den Termin. Der Zeitbereich erscheint sofort im Raster mit der Farbe, die der Behandelnden oder der Art der Behandlung zugeordnet ist, je nach konfigurierter Präferenz.

## Schritt 3, Verwaltung von Kalenderkonflikten

Das System prüft in Echtzeit, ob es Überschneidungen mit bestehenden Terminen für dieselbe Behandelnde oder denselben Behandelnden gibt. Im Konfliktfall zeigt das Modal eine gelbe Warnung mit den Details des kollidierenden Termins und drei Optionen:

- `Uhrzeit ändern`, kehrt zur Eingabe zurück,
- `Anderer Behandelnder zuweisen`, ändert die Behandelnde oder den Behandelnden bei gleicher Uhrzeit,
- `Trotzdem speichern`, registriert die Überschneidung und markiert sie mit einem Warnsymbol im Raster.

Die Überschneidung `Trotzdem speichern` ist in bestimmten Fällen nützlich, z. B. bei Doppelterminen für Begleitperson und Patientin oder Patient, wird aber generell nicht empfohlen.

## Schritt 4, Verwaltung der Terminstatus

Jeder Termin hat einen aktuellen Status, der grafisch durch Farbe und Symbol dargestellt wird:

- **Geplant**, Anfangsstatus, hellblau.
- **Bestätigt**, Patientin oder Patient hat nach Erinnerung bestätigt, dunkelblau.
- **Check-in**, Patientin oder Patient ist in der Praxis eingetroffen, hellgrün.
- **Läuft**, Behandlung hat begonnen, dunkelgrün.
- **Abgeschlossen**, Behandlung beendet, grau.
- **Nicht erschienen**, Patientin oder Patient ist nicht erschienen, orange.
- **Abgesagt**, Termin vor Beginn abgesagt, hellrot.

Die Statusänderung erfolgt durch Klicken auf den Termin und Auswahl des neuen Status in der rechten Seitenleiste. Das System protokolliert jeden Statuswechsel mit Zeitstempel im Audit-Log.

Der Status `Check-in` kann automatisch durch eine eventuelle Check-in-Station in der Praxis aktiviert werden (optionaler Modul). Der Status `Läuft` kann automatisch aktiviert werden, wenn die Behandlungsakte der Patientin oder des Patienten geöffnet wird.

## Schritt 5, Automatische SMS-Erinnerungen

SMS-Erinnerungen werden automatisch an die in den Stammdaten hinterlegte Mobiltelefonnummer der Patientin oder des Patienten gesendet. Die Standardnachricht folgt dem Format:

`Sehr geehrte/r [Name], wir erinnern Sie an Ihren Termin am [Datum Uhrzeit] in der Praxis [Praxisname]. Zur Bestätigung antworten Sie mit 1, zur Absage mit 2. [Link]`

Die Konfiguration der Erinnerungen erfolgt unter `Einstellungen > Kommunikation > Erinnerungen`:

- **T-24h**, Erinnerung vierundzwanzig Stunden vor dem Termin, standardmäßig aktiv.
- **T-2h**, Erinnerung zwei Stunden vor dem Termin, standardmäßig deaktiviert, aktivierbar.
- **T-7d**, Erinnerung sieben Tage vor langfristigen Terminen, standardmäßig deaktiviert.

Der verwendete SMS-Anbieter ist in den Einstellungen sichtbar: Brevo für Standardtarife, MessageBird für internationale Tarife. Die Kosten pro SMS hängen vom abonnierten Tarif ab.

Erinnerungen erfordern:

- Mobiltelefonnummer im internationalen Format `+39` für italienische Nummern,
- aktiviertes Häkchen `Einwilligung für Kommunikation` in den Stammdaten der Patientin oder des Patienten,
- ausreichendes SMS-Guthaben im Tarif.

Die Antwort der Patientin oder des Patienten auf die Erinnerungen (`1` zur Bestätigung, `2` zur Absage) aktualisiert automatisch den Terminstatus und benachrichtigt die Behandelnde oder den Behandelnden.

## Schritt 6, Mehrere Behandelnde-Ansicht

Für Praxen mit mehreren Ärztinnen, Ärzten oder Behandelnden gleichzeitig zeigt die Mehrere Behandelnde-Ansicht:

- eine vertikale Spalte für jede ausgewählte Behandelnde oder jeden ausgewählten Behandelnden,
- Kopfzeile mit Name und Fachgebiet,
- unterschiedliche Farbkodierung für jede Behandelnde oder jeden Behandelnden,
- gemeinsame Stundenzeile.

Der Selektor oben rechts ermöglicht die Auswahl der anzuzeigenden Behandelnden. Die Präferenz wird nutzerspezifisch gespeichert.

Der Filter `Nur ich` reduziert die Ansicht auf den persönlichen Kalender, nützlich für die individuelle Planung der Ärztin oder des Arztes. Der Filter `Mehrere Behandelnde` fasst die im Hauptarbeitsteam konfigurierten Behandelnden zusammen.

## Schritt 7, Drag & Drop und schnelle Änderungen

Der Terminplaner unterstützt direkte Interaktionen für schnelle Änderungen:

- **Ziehen** eines Termins auf einen anderen Zeitbereich verschiebt Datum oder Uhrzeit unter Beibehaltung von Dauer und Details,
- **Ziehen** des unteren Randes eines Termins ändert die Dauer,
- **Doppelklick** auf einen Termin öffnet das detaillierte Fenster mit allen Feldern,
- **Rechtsklick** auf einen Termin öffnet das Schnellmenü mit `Bearbeiten`, `Abbrechen`, `Duplizieren`, `Verschieben`, `Check-in markieren`,
- **Rechtsklick** auf einen freien Bereich öffnet das Schnellmenü zur Erstellung eines Termins in diesem Bereich.

Änderungen per Drag & Drop generieren automatisch, wenn der Termin bereits bestätigt wurde, eine Benachrichtigung an die Patientin oder den Patienten mit der neuen Uhrzeit.

## Schritt 8, Export und iCal-Synchronisation

Die Schaltfläche `Exportieren` bietet zwei Optionen:

- **Wochen-PDF exportieren**, generiert ein druckbares PDF mit dem Wochenraster, nützlich für die Papierarchivierung oder Übergabe an die Praxisleitung.
- **iCal exportieren**, lädt eine `.ics`-Datei mit allen Terminen des ausgewählten Bereichs herunter.

Die automatische Synchronisation mit externen Kalendern ist unter `Einstellungen > Integrationen > Kalender` verfügbar. Das System unterstützt:

- Google Calendar über OAuth,
- Microsoft Outlook über OAuth,
- jeden Kalender, der iCal-URLs im Nur-Lese-Modus unterstützt.

Die Synchronisation ist für Google und Microsoft bidirektional (das Erstellen eines Ereignisses im externen Kalender erstellt den Termin in Fibonacci und umgekehrt) und für andere Kalender unidirektional (nur Lesen aus Fibonacci).

Aus Datenschutzgründen zeigen extern synchronisierte Termine nur einen generischen Titel (`Arzttermin`) und die Uhrzeit an, ohne Patientendaten.

## Tipps

- Konfiguriere die wiederkehrenden Behandlungsarten deiner Praxis unter `Einstellungen > Termine > Behandlungsarten` mit vordefinierter Dauer und Farbe: Die Erstellung neuer Termine wird dadurch schneller.
- Für Praxen mit wiederkehrenden Zeiten sperre die Pausen- und Besprechungszeiten über `Zeitbereich sperren` wiederholt: Termine können in diesen Bereichen nicht erstellt werden.
- Setze die T-24h-Erinnerungen als Standard und aktiviere die T-2h-Erinnerung nur für komplexe Termine oder Erstbesuche: Das reduziert die Anzahl der Benachrichtigungen.
- Für Telemedizin-Termine generiert das System automatisch den Videocall-Link in der Bestätigung und Erinnerung, wenn das Telemedizin-Modul aktiv ist.
- Doppelklick auf einen Tag in der Monatsansicht öffnet die detaillierte Tagesansicht dieses Datums.

## Fehlerbehebung

**SMS-Erinnerungen sind nicht bei der Patientin oder dem Patienten angekommen.** Überprüfe in dieser Reihenfolge: Mobiltelefonnummer im internationalen Format `+39 333 1234567`; aktiviertes Häkchen `Einwilligung für Kommunikation` in den Stammdaten der Patientin oder des Patienten; ausreichendes SMS-Guthaben im Bereich `Einstellungen der Kommunikation`; Versandhistorie des einzelnen Termins im Bereich `Kommunikation > Verlauf`, die eventuelle Fehler des Anbieters anzeigt.

**Termin wurde versehentlich mit Überschneidung erstellt.** Öffne den Termin und nutze `Uhrzeit ändern`, um ihn zu verschieben, oder `Anderer Behandelnder zuweisen`, um die Auslastung umzuverteilen. In jedem Fall benachrichtigt das System betroffene Patientinnen und Patienten automatisch über die neue Uhrzeit oder den Wechsel der Behandelnden.

**Synchronisation mit Google Calendar unterbrochen.** Häufig verursacht durch abgelaufene OAuth-Tokens nach längerer Nichtnutzung. Öffne `Einstellungen > Integrationen > Google Calendar` und wiederhole die Autorisierung. Bereits synchronisierte Termine bleiben erhalten.

**Drag & Drop funktioniert nicht auf Tablet oder Touchscreen.** Auf einigen Mobilgeräten erfordert der Drag-Modus eine längere Berührung (Long Press), bevor das Ziehen beginnt. Alternativ nutze das seitliche Fenster `Bearbeiten`, um Datum und Uhrzeit mit der virtuellen Tastatur zu ändern.

**Status `Nicht erschienen` wird nicht automatisch aktualisiert.** Der Status bleibt der initiale oder `Bestätigt`, wenn er nicht manuell markiert wird. Konfiguriere unter `Einstellungen > Termine > Auto-Nicht-Erschienen` das Timeout, nach dem ein nicht begonnener Termin automatisch als `Nicht erschienen` markiert wird: standardmäßig deaktiviert, empfohlener Wert sechzig Minuten.

## Siehe auch

- [Erstellung und Verwaltung von Patientinnen- und Patientenstammdaten](/manuale/anagrafica-paziente)
- [Erster Zugriff und Erstkonfiguration](/manuale/installazione)
- [Audit-Log und Zugriffsnachverfolgbarkeit](/manuale/audit-log)

Letzte Aktualisierung: {ULTIMA_REVISIONE}
