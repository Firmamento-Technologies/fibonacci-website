# Erstellung und Verwaltung der Patient:innen-Stammdaten

> ⚠️ **Überprüft anhand der Anwendung am 2026-08-10.** Die hier aufgeführten Punkte
> sind tatsächlich vorhanden. Falls du einen beschriebenen Punkt nicht auf dem Bildschirm siehst,
> handelt es sich um einen Fehler in der Anleitung: Bitte melde ihn.

Diese Anleitung beschreibt, wie du eine:n neue:n Patient:in in Fibonacci registrierst, suchst, bearbeitest, archivierst und wie du ihre:seine Daten exportierst, um das in Artikel 20 der DSGVO vorgesehene Recht auf Datenübertragbarkeit zu erfüllen. Sie richtet sich an Ärzt:innen und Verwaltungspersonal.

Die Patient:innen-Stammdaten sind die Grundlage jeder weiteren klinischen Funktion: Besuche, Body-Map, Einwilligungen, Terminplanung und Audit-Log sind über eine eindeutige Kennung mit der Stammdatendatei verknüpft. Die korrekte anfängliche Erfassung vermeidet Dubletten, reduziert klinische Fehler und gewährleistet die Einhaltung der italienischen Gesundheitsvorschriften.

## Voraussetzungen

- Fibonacci-Konto mit der Rolle `Ärztin, Arzt oder medizinische Fachkraft`, `KI-Empfang` oder `Administration`.
- Personalausweis oder Steueridentifikationsnummer der:des Patient:in zur Überprüfung.
- E-Mail-Adresse oder Handynummer der:des Patient:in für automatische Kontakte und Erinnerungen.

## Schritt 1: Öffnen des Formulars für neue:n Patient:in

Über die Hauptnavigationsleiste im Abschnitt `Patientinnen und Patienten` öffnet die Schaltfläche `Neue Patientin oder neuer Patient` oben rechts das Registrierungsformular. Dasselbe Formular ist über die Tastenkombination **N** von jedem Bildschirm aus erreichbar.

Das Formular ist in vier Registerkarten unterteilt:

- `Anagrafica` (Stammdaten), obligatorische Identifikationsdaten.
- `Contatti` (Kontakte), Kontaktdaten für Termine und Benachrichtigungen.
- `Clinico` (Klinische Daten), grundlegende Gesundheitsinformationen.
- `Foto` (Foto), Erkennungsbild.

Die Registerkarten müssen in der angegebenen Reihenfolge ausgefüllt werden; die Schaltfläche `Speichern` wird erst aktiv, wenn alle Pflichtfelder der Registerkarte `Anagrafica` gültig sind.

## Schritt 2: Ausfüllen der Pflichtfelder

Die Pflichtfelder sind:

- **Vorname** und **Nachname**, in lateinischen Buchstaben ohne Abkürzungen.
- **Steueridentifikationsnummer** (italienisch) oder Dokumententyp und -nummer für ausländische Patient:innen.
- **Geburtsdatum**, Format `TT/MM/JJJJ`.
- **Geschlecht**, Werte `M`, `F`, `Andere` oder `Nicht angegeben`.
- **Hauptkontakt**, mindestens eine E-Mail-Adresse oder Telefonnummer.

Die italienische Steueridentifikationsnummer wird automatisch validiert. Das System berechnet die Prüfziffer, überprüft die Konsistenz mit Geburtsdatum, Geschlecht und Geburtsort und weist vor dem Speichern auf Unstimmigkeiten hin. Für Patient:innen ohne italienische Steueridentifikationsnummer steht das Feld `Dokumententyp` zur Verfügung: Die Werte findest du im Dropdown-Menü.

Die italienische Telefonnummer akzeptiert sowohl das lokale Format `333 1234567` als auch das internationale Format `+39 333 1234567`. Das System normalisiert immer auf das internationale Format für automatische SMS-Erinnerungen.

## Schritt 3: Optionale Felder

Die optionalen Felder der Registerkarte `Clinico` umfassen:

- **Vollständige Wohnadresse**.
- **Hausärzt:in**.
- **Bekannte Allergien**, Freitextfeld oder Autovervollständigung aus der SNOMED-CT-Terminologie.
- **Blutgruppe**, Werte `0`, `A`, `B`, `AB` mit `Rh+` oder `Rh-`.
- **Allgemeine klinische Notizen**, Freitextfeld für relevante unstrukturierte Informationen.

Die Erfassung von bekannten Allergien und Blutgruppe wird für Patient:innen, die invasiven Eingriffen unterzogen werden, dringend empfohlen: Das System zeigt eine Warnung oben auf jeder Besuchskarte an, wenn diese Felder leer sind.

## Schritt 4: Profilfoto der:des Patient:in

Die Registerkarte `Foto` ermöglicht das Hochladen eines Erkennungsbildes der:des Patient:in, das hilfreich ist, um Verwechslungen zu vermeiden und eine schnelle Vorab-Kontrolle zu ermöglichen.

Die Schaltfläche `Hinzufügen` akzeptiert JPEG- und PNG-Dateien bis zu fünf Megabyte. Die Schaltfläche `Aufnehmen` öffnet die Kamera des Geräts mit ausdrücklicher Zustimmung der:des Patient:in.

Das Foto wird im Ruhezustand mit dem AES-256-Algorithmus verschlüsselt und ist nur für autorisierte Mitarbeiter:innen zugänglich, die die Akte einsehen dürfen. Die Verschlüsselung verwendet vom Tenant der Praxis abgeleitete Schlüssel, die von den Schlüsseln anderer Praxen auf derselben Plattform getrennt sind.

## Schritt 5: Speichern und Dublettenprüfung

Beim Klick auf `Speichern` überprüft das System, ob Patient:innen mit identischer Steueridentifikationsnummer oder mit übereinstimmender Kombination aus Vorname, Nachname und Geburtsdatum vorhanden sind.

Bei einem möglichen Dubletten zeigt das System ein Panel mit der bereits vorhandenen Patient:in und drei Optionen an:

- `Vorhandene:n öffnen`, bricht die Erstellung ab und öffnet die bereits vorhandene Akte.
- `Zusammenführen`, vereinigt die beiden Datensätze nach ausdrücklicher Bestätigung durch die:den Mitarbeiter:in.
- `Trotzdem speichern`, erstellt den neuen Datensatz und markiert ihn als mögliche Dublette zur späteren Überprüfung.

Die Zusammenführung wird im Audit-Log als administrative Operation protokolliert.

## Suche nach der:dem Patient:in

Die globale Suchleiste oben rechts führt eine inkrementelle Suche nach Vorname, Nachname, Steueridentifikationsnummer und Telefonnummer durch. Die Ergebnisse erscheinen nach drei Zeichen.

Erweiterte Filter sind über den Bildschirm `Patientinnen und Patienten > Filter` verfügbar:

- Geburtsdatum-Bereich,
- erstellt von einer bestimmten Mitarbeiter:in,
- letzter Besuch innerhalb eines Zeitraums,
- Vorhandensein bekannter Allergien,
- Archivierungsstatus.

Die Filter lassen sich kombinieren und erzeugen eine sortierbare Liste, die als CSV exportiert werden kann.

## Archivierung der:des Patient:in

Wenn eine:r Patient:in nicht mehr in Behandlung ist, markiert die Schaltfläche `Archivieren` in der Patient:innen-Akte sie:ihn als archiviert. Die Operation **löscht die Daten nicht**: Die Krankenakte bleibt für den gesetzlich vorgeschriebenen Aufbewahrungszeitraum nur lesbar zugänglich.

Die archivierte:r Patient:in erscheint nicht in der Standard-Suche und nicht in den Vorschlägen für neue Termine. Sie:Er bleibt jedoch in der Akte und kann über die Suche wiedergefunden werden.

Die Archivierung ist die mit Artikel 17 der DSGVO (Recht auf Vergessenwerden) konforme Vorgehensweise im Gesundheitskontext, wo dieses Recht mit den gesetzlichen Aufbewahrungspflichten gemäß dem ärztlichen Berufsrecht und den steuerlichen Vorschriften abgewogen wird.

## Endgültige Löschung

Die physische Löschung von Daten ist nur in den von der Gesetzgebung vorgesehenen Fällen zulässig, z. B. bei fälschlicherweise registrierten Patient:innen oder bei widerrufener Einwilligung vor Beginn der Leistung.

Die endgültige Löschung wird nicht über die Benutzeroberfläche eingeleitet: Du musst den Support kontaktieren, und sie ist eine bewusste Entscheidung: Es handelt sich um eine irreversible Operation bei klinischen Daten. Genehmigung durch eine:n zweite:n Mitarbeiter:in mit der Rolle `Administration` erforderlich. Die tatsächliche Löschung erfolgt nach einer 30-tägigen Bedenkzeit mit vorheriger Benachrichtigung per E-Mail an die:den anfragende:n Mitarbeiter:in. Alle Phasen des Verfahrens werden im Audit-Log protokolliert.

## Übermittlung der Daten an die:den Patient:in

Artikel 20 der DSGVO garantiert der:dem Patient:in das Recht, ihre:seine Daten in einem strukturierten, gängigen und maschinenlesbaren Format zu erhalten.

Über die Schaltfläche `Daten exportieren` in der Patient:innen-Akte wird ein ZIP-Archiv generiert, das Folgendes enthält:

- Datei `Patient.json` mit den vollständigen Stammdaten in einem Standardformat, das jede andere Krankenakte lesen kann,
- Datei `Observation.json` mit Beobachtungen und erfassten Parametern,
- Datei `Condition.json` mit Anamnese und Erkrankungen,
- Datei `MedicationStatement.json` mit den registrierten Arzneimitteln,
- Datei `Procedure.json` mit den durchgeführten Eingriffen,
- Ordner `consents/` mit den PDFs der unterzeichneten Einwilligungen,
- Ordner `attachments/` mit Fotos und Befunden.

Das Archiv ist digital signiert, um seine Integrität zu gewährleisten, und steht sieben Tage lang zum Download bereit. Der Download-Link wird per E-Mail an die:den Patient:in gesendet, mit einem zweiten Zugriffsfaktor per SMS.

## Tipps

- Tastenkombination **N** überall für neue:n Patient:in, **F** zum Öffnen der Schnellsuche, **Esc** zum Schließen von Modalen.
- Massenimport aus CSV verfügbar unter `die Einstellungen der Praxis`: Die Vorlage sieht eine Zeile pro Patient:in mit Standardüberschriften vor. Der Import erfolgt in zwei Phasen: Vorschau mit Validierung, dann Bestätigung.
- Für minderjährige Patient:innen wird die Kontaktperson der Eltern oder des Vormunds unter den Kontakten erfasst: Einwilligungen und Belege beziehen sich auf die:n Vormund:in.
- Für ausländische Patient:innen ohne italienische Steueridentifikationsnummer wird empfohlen, eine Kopie des Dokuments anzufordern und die Nummer im Feld `Dokumententyp > Nummer` zu erfassen.

## Problembehebung

**Steueridentifikationsnummer wird als ungültig abgelehnt.** Überprüfe, ob die sechzehn Zeichen mit dem offiziellen Dokument übereinstimmen. Ein falsch eingegebenes Kontrollzeichen am Ende ist der häufigste Fehler. Alternativ kannst du die Funktion `Steueridentifikationsnummer berechnen` in der Registerkarte `Anagrafica` verwenden.

**E-Mail-Adresse wird bereits von einer:m anderen Patient:in genutzt.** Dieselbe E-Mail-Adresse kann pro Praxis nur einer:m Patient:in zugeordnet werden. Für Familien, die eine E-Mail-Adresse teilen, erfasse die Adresse nur bei der Hauptperson und lasse das E-Mail-Feld bei den anderen Mitgliedern leer, indem du das Telefon als Hauptkontakt verwendest.

**Mögliche Dublette gemeldet, aber die:der Patient:in ist neu.** Überprüfe Vorname, Nachname und Geburtsdatum: Patient:innen mit häufigen Namen und ähnlichen Geburtsdaten können einen Fehlalarm auslösen. Verwende `Trotzdem speichern`; der Datensatz wird zur späteren Überprüfung markiert.

**Foto wird nicht hochgeladen.** Die Grenze liegt bei fünf Megabyte und die zulässigen Formate sind JPEG und PNG. HEIC-Dateien von iPhones müssen konvertiert werden: Die meisten mobilen Browser erledigen dies automatisch beim Hochladen, einige Modelle erfordern jedoch, dass du die Option `Hohe Effizienz` in den Kameraeinstellungen deaktivierst.

## Siehe auch

- [Erster Zugriff und initiale Konfiguration](/manuale/installazione)
- [Anamnese mit KI-Diktat ausfüllen](/manuale/anamnesi-dettatura)
- [Audit-Log und Zugriffsnachverfolgbarkeit](/manuale/audit-log)

Letzte Überarbeitung: {ULTIMA_REVISIONE}
