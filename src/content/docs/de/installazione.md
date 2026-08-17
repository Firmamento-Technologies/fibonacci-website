# Erster Zugriff und initiale Konfiguration

Diese Anleitung beschreibt die notwendigen Schritte, um Fibonacci vom ersten Zugriff bis zur vollständigen Konfiguration der Praxis zu nutzen. Sie richtet sich an den Praxisinhaber oder die administrative Ansprechperson der Praxis, die als Erste die Einladungs-E-Mail erhält.

Am Ende des Verfahrens verfügt die Praxis über ein durch Zwei-Faktor-Authentifizierung geschütztes Administratorkonto, ein vollständiges Praxisprofil und die ersten eingeladenen Mitarbeiter. Die durchschnittlich benötigte Zeit beträgt etwa fünfzehn Minuten.

## Voraussetzungen

- Einladungs-E-Mail, die an die bei der kommerziellen Onboarding-Phase angegebene Adresse gesendet wurde.
- Aktualisierter unterstützter Browser: Chrome, Edge, Safari oder Firefox in einer aktuellen Version.
- Smartphone mit installierter **Authenticator**-App: `Google Authenticator`, `Authy`, `1Password` oder `Microsoft Authenticator`.
- Praxislogo im PNG-Format, empfohlene Größe 512 x 512 Pixel, transparenter Hintergrund.
- Steuerdaten der Praxis: Firmenname, Mehrwertsteuer-Identifikationsnummer, Praxisadresse, öffentliche Kontaktdaten.

## Schritt 1, Zugriff über Einladungslink

Die Einladungs-E-Mail kommt von einer Systemadresse mit dem Betreff `Einladung zu Fibonacci`. Sie enthält einen einmaligen Link, der vierundzwanzig Stunden gültig ist.

Öffne den Link in einem neuen Browser-Tab. Falls der Link abgelaufen ist, fordere eine neue Einladung über {EMAIL_SUPPORTO} an.

Der erste Bildschirm verlangt die Bestätigung der E-Mail-Adresse und die Festlegung eines persönlichen Passworts. Das Passwort muss folgende Mindestanforderungen erfüllen:

- mindestens zwölf Zeichen,
- mindestens ein Groß- und ein Kleinbuchstabe,
- mindestens eine Zahl,
- mindestens ein Sonderzeichen aus `! @ # $ % & * ?`.

Passwörter werden mit öffentlichen Listen kompromittierter Anmeldedaten abgeglichen. Ein schwaches oder wiederverwendetes Passwort wird mit einer klaren Fehlermeldung abgelehnt.

## Schritt 2, Aktivierung der MFA TOTP

MFA, also **Multi-Factor Authentication**, ist die Zwei-Faktor-Authentifizierung: Neben dem Passwort wird ein temporärer Code verlangt, der von der Authenticator-App auf dem Smartphone generiert wird. Die Aktivierung ist für alle Konten, die auf Gesundheitsdaten zugreifen, verpflichtend.

Das geführte Verfahren zeigt einen QR-Code an. Öffne die Authenticator-App auf dem Smartphone, wähle `Hinzufügen` oder eine entsprechende Option und scanne den QR-Code. Die App fügt einen neuen Eintrag mit der Bezeichnung `Fibonacci - email@beispiel.de` hinzu und zeigt alle dreißig Sekunden einen neuen sechsstelligen Zahlencode an.

Gib den aktuellen Code in das Bestätigungsfeld ein und bestätige. Die Validierung erfolgt sofort: Wenn der Code korrekt ist, erhält die App eine Bestätigung über die erfolgreiche MFA-Aktivierung.

## Schritt 3, Wiederherstellungscodes

Unmittelbar nach der MFA-Aktivierung generiert Fibonacci zehn **einmalige Wiederherstellungscodes**. Jeder Code kann einmalig anstelle des TOTP-Codes verwendet werden, falls das Smartphone verloren geht.

Drucke die angezeigte Seite aus oder lade die PDF-Datei herunter. Bewahre die Codes an einem physisch sicheren Ort auf, getrennt vom Smartphone. Speichere sie nicht auf demselben Gerät, das die TOTP-Codes generiert.

Wenn ein Wiederherstellungscode verwendet wird, gilt er als verbraucht. Wenn weniger als drei ungenutzte Codes übrig sind, zeigt die Anwendung eine Warnung an, um neue zu generieren.

## Schritt 4, Praxisprofil

Nach dem ersten vollständigen Zugriff öffnet die Anwendung den Bildschirm `Einstellungen > Organisation`. Die Pflichtfelder sind:

- **Firmenname**, offizielle Bezeichnung der Praxis oder Name und Nachname des Berufsträgers.
- **Italienische Mehrwertsteuer-Identifikationsnummer**, elf Ziffern, automatisch auf das Format überprüft.
- **Steuernummer** der Praxis oder des Inhabers.
- **Praxisadresse**: Straße, Hausnummer, PLZ, Ort, Provinz.
- **Öffentliche Kontaktdaten**: Praxistelefon, öffentliche E-Mail, optionale Website.

Optionale Felder umfassen die Registrierungsnummer beim Ordine dei Medici, die Hauptfachrichtung und die Öffnungszeiten.

Das Praxislogo wird mit der Schaltfläche `Logo hochladen` hochgeladen. Das System akzeptiert PNG- und JPEG-Dateien bis zu zwei Megabyte und passt die Bildgröße automatisch auf 512 x 512 Pixel an, wobei die Proportionen erhalten bleiben. Das Logo erscheint auf Rechnungen, Einwilligungen und Nachrichten an die Patientin oder den Patienten.

## Schritt 5, Einladung der Mitarbeiter

Über das Panel `Einstellungen > Nutzerinnen und Nutzer` öffnet die Schaltfläche `Mitarbeiter einladen` ein Modalfenster mit folgenden Feldern:

- Vor- und Nachname der Mitarbeiterin oder des Mitarbeiters,
- dienstliche E-Mail,
- Rolle,
- optionale Fachrichtung.

Die verfügbaren Rollen sind:

- **Administration**, vollständiger Zugriff auf alle Bereiche, einschließlich Einstellungen und Zugriffsprotokoll.
- **Ärztin, Arzt oder medizinische Fachkraft**, klinischer Zugriff auf zugewiesene oder alle Patientinnen und Patienten der Praxis, je nach Konfiguration, vollständiger Zugriff auf Patientenakten, Besuche, Diktate, Einwilligungen.
- **KI-Empfang**, Zugriff auf Terminplanung und Patientenstammdaten, Lesezugriff auf klinische Daten, kein Zugriff auf das Zugriffsprotokoll.

Jede eingeladene Mitarbeiterin oder jeder eingeladene Mitarbeiter erhält eine eigene Einladungs-E-Mail mit demselben Verfahren wie in den Schritten eins bis drei beschrieben. Beim ersten Zugriff konfiguriert die Mitarbeiterin oder der Mitarbeiter ihr bzw. sein persönliches Passwort und die eigene MFA.

Die maximale Anzahl der Mitarbeiter hängt vom gebuchten Tarif ab. Das Panel zeigt den aktuellen Verbrauch und das Tariflimit an.

## Tipps

- Erstelle sofort ein dediziertes Administratorkonto, getrennt vom klinischen Arztkonto, für reine Verwaltungsaufgaben.
- Drucke die Wiederherstellungscodes in zwei Exemplaren aus und bewahre eines außerhalb der Praxis auf.
- Konfiguriere das Logo, bevor du mit der Erstellung von Einwilligungen beginnst: Bereits generierte PDFs werden nicht rückwirkend aktualisiert.
- Überprüfe die Steuerdaten mit dem Steuerberater vor dem Speichern: Sie erscheinen auf Rechnungen und Quittungen.

## Problembehebung

**Der TOTP-Code wird als ungültig angezeigt.** Stelle sicher, dass die Uhrzeit des Smartphones automatisch mit dem Netzwerk synchronisiert wird. Eine Zeitabweichung von mehr als dreißig Sekunden macht die TOTP-Codes ungültig. Auf iOS: `Einstellungen > Allgemein > Datum & Uhrzeit > Automatisch`. Auf Android: `Einstellungen > System > Datum & Uhrzeit > Automatisch`.

**Der Einladungslink ist abgelaufen.** Die Links sind vierundzwanzig Stunden gültig. Fordere eine neue Einladung über {EMAIL_SUPPORTO} an und gib die Empfänger-E-Mail-Adresse an.

**Wiederherstellungscodes verloren und Smartphone nicht verfügbar.** Kontaktiere den Support. Das Verfahren sieht eine Identitätsprüfung des Praxisinhabers mittels Personalausweis und anschließende MFA-Zurücksetzung vor. Die Zurücksetzung kann bis zu vierundzwanzig Arbeitsstunden dauern.

**Fehler beim Hochladen des Logos.** Überprüfe, ob die Datei im PNG- oder JPEG-Format vorliegt und nicht größer als zwei Megabyte ist. Dateien mit CMYK-Farbprofil oder komplexen Transparenzen werden manchmal abgelehnt: Speichere die Datei als PNG im sRGB-Farbraum und lade sie erneut hoch.

## Siehe auch

- [Erstellung und Verwaltung der Patientenstammdaten](/manuale/anagrafica-paziente)
- [Terminplanung und Verwaltung von Terminen](/manuale/agenda-appuntamenti)
- [Zugriffsprotokoll und Nachverfolgbarkeit der Zugriffe](/manuale/audit-log)

Letzte Aktualisierung: {ULTIMA_REVISIONE}
