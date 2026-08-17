# Nutzer der Praxis und Entzug von Zugriffen

Diese Anleitung beschreibt, wie man eine Mitarbeiterin oder einen Mitarbeiter einlädt, was diese Person tun kann, und vor allem **wie man ihr oder ihm den Zugriff entzieht, wenn sie oder er die Praxis verlässt**. Sie richtet sich an diejenigen, die die Praxis verwalten.

Der letzte Schritt ist derjenige, der am häufigsten aufgeschoben wird und der wichtigste ist: Eine ehemalige Mitarbeiterin oder ein ehemaliger Mitarbeiter, die oder der die Zugangsdaten behält, kann weiterhin auf Patientenakten zugreifen, und kein Protokoll meldet dies als Anomalie, da die Person formal noch autorisiert ist.

## Voraussetzungen

- Konto mit der Rolle `admin studio`.
- Für die Einladung: E-Mail-Konfiguration auf dem Server. Ohne diese wird das Konto der eingeladenen Person zwar erstellt, **aber sie erhält keine Nachricht mit dem Link zur Passworteinrichtung**, und die Anfrage gilt dennoch als erfolgreich. Wenn eine eingeladene Person sagt, nichts erhalten zu haben, ist dies der erste Punkt, der zu überprüfen ist.

## Schritt 1, eine Mitarbeiterin oder einen Mitarbeiter einladen

Unter `Einstellungen` listet der Abschnitt `Mitglieder der Praxis` auf, wer Zugriff hat. Die Schaltfläche `Nutzerin oder Nutzer einladen` fragt nach Vorname, Nachname, E-Mail-Adresse, Rolle und Zugriffsrichtlinie.

Jede eingeladene Person erhält die **verpflichtende Zwei-Faktor-Authentifizierung**: Beim ersten Zugriff wird sie aufgefordert, diese einzurichten. Sie ist nicht deaktivierbar, und der Grund dafür ist, dass diese Konten auf Gesundheitsdaten zugreifen.

Die Zugriffsrichtlinie entscheidet, was die Person sieht: Die Richtlinie für Ärztinnen und Ärzte begrenzt die Sichtbarkeit auf die eigenen Patientinnen und Patienten; die Praxisrichtlinien erweitern die Sichtbarkeit auf alle Patientinnen und Patienten der Praxis. Die Wahl sollte bewusst getroffen werden, da sie den Unterschied zwischen einer Kollegin oder einem Kollegen, die oder der nur die eigenen Patientinnen und Patienten sieht, und einer Person, die alle sieht, ausmacht.

## Schritt 2, den Zugriff für Personen entziehen, die die Praxis verlassen

In derselben Tabelle führt die Spalte `Zugriff` zur Schaltfläche `Zugang entziehen`.

Vor der Bestätigung zeigt das Fenster genau an, was passiert, und es ist ratsam, dies zu lesen:

- **der Zugriff wird sofort beendet**, einschließlich bereits geöffneter Sitzungen: Wer in diesem Moment arbeitet, wird bei der nächsten Aktion abgemeldet,
- **die klinischen Daten bleiben erhalten**. Besuche, Einwilligungen und Unterschriften werden weiterhin dieser Ärztin oder diesem Arzt zugeordnet. Dies ist kein technisches Detail: Ein Befund kann den Autor nicht wechseln, nur weil die Person die Praxis gewechselt hat,
- **dies ist über die Oberfläche nicht rückgängig zu machen**: Um jemandem den Zugriff wieder zu gewähren, muss die Person erneut eingeladen werden.

Die Operation wird im Zugriffsprotokoll registriert: wer sie durchgeführt hat, bei wem und wann.

### Warum es keine „vorübergehende Sperrung“ gibt

Das ist die Frage, die sich stellt, wenn man nach der Schaltfläche sucht und sie nicht findet. Die Antwort lautet, dass in diesem System das Feld, das scheinbar nützlich wäre, „inaktiver Nutzer“, **den Zugriff nicht verhindert**: Es ist beschreibend. Eine Schaltfläche „Sperren“, die auf diesem Feld basiert, würde der Administratorin oder dem Administrator vorgaukeln, den Zugriff entzogen zu haben, ohne dies tatsächlich getan zu haben, und das ist schlimmer als das Fehlen der Schaltfläche.

Wenn die Abwesenheit vorübergehend ist und man trotzdem die Tür schließen möchte, besteht die Lösung darin, den Zugriff zu entziehen und die Person bei der Rückkehr erneut einzuladen.

## Schritt 3, Fälle, in denen die Schaltfläche nicht erscheint

Anstelle der Schaltfläche erscheint ein Strich, und wenn man mit der Maus darüberfährt, wird der Grund angezeigt:

- **das eigene Konto**: Niemand kann sich selbst den Zugriff entziehen. Falls es ein Fehler wäre, bliebe niemand übrig, der dies über die Oberfläche korrigieren könnte,
- **die letzte Administratorin oder der letzte Administrator**: Ihn oder sie zu entfernen, würde die Praxis von ihrem eigenen Projekt ausschließen,
- **Dienstidentitäten** (Integrationen und Automatisierungen): Sie werden dort deaktiviert, wo sie konfiguriert sind, nicht im Kollegenbereich.

## Häufige Fehler

- **Den Entzug des Zugriffs auf „wenn Zeit ist“ verschieben.** Dies ist die einzige Operation in dieser Anleitung, die ein Zeitfenster hat: Das Risiko besteht zwischen dem Ausscheiden und dem Entzug des Zugriffs.
- **Mit einer Praxisrichtlinie „aus Bequemlichkeit“ einladen.** Dies erweitert die Sichtbarkeit auf alle Patientinnen und Patienten, und man kommt nicht von allein zurück.
- **Eine Einladung ohne Bestätigung der eingeladenen Person als erfolgreich betrachten.** Wenn die E-Mail nicht konfiguriert ist, wird die Anfrage erfolgreich durchgeführt, aber die Nachricht wird nicht versendet.

## Häufig gestellte Fragen

**Was passiert mit den Akten, die die Person betreut hat?** Sie bleiben, wo sie sind. Es ändert sich, wer sie öffnen kann, nicht wem sie zugeordnet sind.

**Kann ich sehen, wer wem den Zugriff entzogen hat?** Ja, im Zugriffsprotokoll: Die Operation wird als Sicherheitsereignis protokolliert, getrennt von einer klinischen Löschung.

**Kann eine entfernte Mitarbeiterin oder ein entfernter Mitarbeiter weiterhin eine geöffnete App nutzen?** Nein. Die aktuelle Sitzung funktioniert bei der nächsten Aktion nicht mehr: Der Entzug wartet nicht auf das Ablaufen des Tokens.
