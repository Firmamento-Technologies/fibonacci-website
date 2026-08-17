# Klinische Fotos und Vorher/Nachher-Vergleich

Diese Anleitung beschreibt, wie klinische Fotos in Fibonacci erfasst, gespeichert und verglichen werden. Sie richtet sich an Ärztinnen, Ärzte und medizinisches Personal, das Behandlungen dokumentiert.

Fotos sind die Dokumentation, die im Streitfall über den Erfolg einer Behandlung entscheidet, und sie gelten gemäß Art. 9 der GDPR als Gesundheitsdaten: Deshalb unterscheidet sich der hier beschriebene Ablauf von einem gewöhnlichen Bildarchiv.

## Voraussetzungen

- Konto mit der Rolle `medico` oder `admin studio`.
- Patientenstammdaten bereits angelegt.
- Einwilligung zur fotografischen Dokumentation eingeholt und archiviert. Die Einwilligung zur Behandlung deckt nicht die Fotografie ab: Es handelt sich um zwei unterschiedliche Zwecke, die separat dokumentiert werden müssen.

## Wie Fotos gespeichert werden

Jedes Bild wird **bevor es den Browser verlässt** mit einem Schlüssel verschlüsselt, der für dieses einzelne Foto generiert wird. Dieser Schlüssel wird wiederum mit einem Projektschlüssel geschützt, der auf dem Server liegt und nie in den im Browser ausgeführten Code gelangt.

Drei praktische Konsequenzen, die man kennen sollte, bevor man arbeitet:

- Wer eine Kopie der Datenbank oder der Festplatte erhält, sieht keine Fotos: Es werden nur verschlüsselte Blöcke angezeigt.
- Das Öffnen eines Fotos gilt als Zugriff und wird im `Zugriffsprotokoll` mit Angabe von Person und Zeitpunkt registriert. Dies ist keine Einschränkung, sondern ermöglicht es, auch Jahre später nachzuweisen, wer was gesehen hat.
- Fotos erscheinen nicht in den Druckvorschauen klinischer Dokumente. Sie müssen separat und bewusst übermittelt werden.

## Schritt 1: Ein Foto aufnehmen

Auf der Patientenkarte zeigt der Abschnitt `Foto` die vorhandenen Aufnahmen, gruppiert nach Datum. Die Schaltfläche `Hinzufügen` öffnet das Upload-Fenster, das Bilder von der Gerätekamera oder aus Dateien akzeptiert.

Vor dem Speichern führt das System zwei automatische Vorgänge durch:

- **Entfernung der EXIF-Metadaten**, einschließlich des Standorts. Ein mit dem Handy in der Praxis aufgenommenes Foto enthält Koordinaten: Die Weitergabe an Dritte würde auch die Adresse des Aufnahmestandorts preisgeben.
- **Gesichtserkennung** mit der Möglichkeit, Gesichter unkenntlich zu machen. Die Unkenntlichmachung ist eine Entscheidung der Ärztin oder des Arztes und erfolgt nicht automatisch, da in der ästhetischen Medizin das Gesicht oft selbst Gegenstand der Dokumentation ist.

Beim Speichern wird der behandelte Bereich angegeben und, falls relevant, die Behandlung, auf die sich das Foto bezieht. Diese Zuordnung ermöglicht den Vergleich in Schritt 3.

### Die Ansicht und die Standardserie

Jede Aufnahme kann die `Ansicht` angeben: `Frontal`, `Seitlich rechts`, `Seitlich links`, `Schräg 45° rechts`, `Schräg 45° links`, `Dynamisch (Mimik)`. Dies ist das klinische Fotoprotokoll: Dieselbe Serie von Aufnahmen, bei jedem Besuch gleich wiederholt, macht zwei Zeitpunkte vergleichbar.

Drei Regeln, alle beabsichtigt:

- **Die Ansicht ist optional.** Fotos, die vor dieser Funktion hochgeladen wurden, haben keine Ansicht, und „nicht angegeben“ bleibt anders als „frontal“: Das System füllt das Feld nie selbst aus.
- **Die Checkliste informiert, blockiert aber nicht.** Die Karte `Foto` zeigt die Serie des letzten Besuchs und gibt an, welche Ansichten fehlen; Aufnahmen außerhalb der Serie bleiben zulässig.
- **Beim Fotografieren mit der Kamera und einer gewählten Ansicht erscheint die vorherige Aufnahme derselben Ansicht transparent im Sucher** (*„Vorherige Aufnahme transparent: Überlagere, um den Bildausschnitt zu wiederholen“*). Das Gesicht über das „Geisterbild“ zu legen, ist die praktische Methode, um Bildausschnitt und Entfernung zu wiederholen. Die Kamera unterstützt auch mit der Positionsmarkierung und der Erinnerung *„Augen auf der Linie · gleichmäßiges Frontallicht · neutraler Hintergrund“*.

### Wofür das Foto verwendet werden kann

Beim Hochladen wird der Zweck angegeben: `C1: Klinisch:` (für die Behandlung erforderlich), `C2: Lehrzwecke:` und `C3: Werbezwecke:`. Die ersten bleiben immer in der Akte; die anderen beiden hängen von einer separaten, jederzeit widerruflichen Einwilligung ab, und für Werbung gilt das Gesetz 145/2018. Außerhalb der Behandlung ist die Anonymisierung Pflicht.

## Schritt 2: Nach Sitzung organisieren

Fotos, die einer Behandlung zugeordnet sind, erscheinen in der Zeile der entsprechenden Sitzung. Nicht zugeordnete Fotos bleiben in der allgemeinen Liste, nach Datum sortiert.

Praktischer Tipp: Immer mindestens eine Aufnahme vor der Behandlung machen, mit demselben Bildausschnitt und derselben Beleuchtung wie danach. Ein Vergleich zwischen zwei Fotos, die unter unterschiedlichen Bedingungen aufgenommen wurden, dokumentiert nicht das Ergebnis, sondern den Lichtunterschied.

## Schritt 3: Vorher/Nachher-Vergleich

Im Abschnitt `Foto` öffnet sich durch Auswahl zweier Bilder desselben Bereichs die Vergleichsansicht nebeneinander. Die Ansicht zeigt die beiden Daten, den Bereich und die eventuell dazwischenliegende Behandlung.

Der Vergleich verfügt über eine **zentrale, verschiebbare Leiste** (*„Vorher links, Nachher rechts“*) und eine Funktion `Gesicht erkennen und Fotos automatisch ausrichten`, die die beiden Aufnahmen anhand der Gesichtspunkte überlagert, wenn die Bildausschnitte nicht übereinstimmen; `Ausrichtung entfernen` kehrt zu den Originalaufnahmen zurück.

⚠️ **Die Ausrichtung ist eine Lesehilfe, keine Korrektur des Fotos**: Die Originalbilder werden nicht verändert. Und das Ausrichten zweier Aufnahmen aus unterschiedlichen Winkeln macht sie überlagerbar, aber nicht vergleichbar: Die Serie nach Ansicht bleibt die richtige Methode.

Der Vergleich ist eine Ansicht, kein Dokument: Er verändert die Bilder nicht und erstellt keine neuen. Falls der Vergleich an die Patientin oder den Patienten übergeben werden soll, werden die beiden Originalfotos exportiert.

Im Vergleich kann auch der **PGAIS** erfasst werden, die ärztliche Bewertung des Ergebnisses: siehe [Gesichtsanalyse](/manuale/analisi-del-volto).

## Schritt 4: Fotos an die Patientin oder den Patienten übergeben

Die Patientin oder der Patient hat das Recht, die eigenen Daten, einschließlich Fotos, in einem lesbaren Format zu erhalten. Beim Export werden die Bilder zum Zeitpunkt der Übergabe entschlüsselt: Sie liegen im Paket im Klartext vor, während der Projektschlüssel nie übergeben wird.

Der Grund ist präzise: Dieser Schlüssel öffnet nicht nur die Fotos, die übergeben werden, sondern alle vorhandenen verschlüsselten Kopien, einschließlich derer in Backups, und er ist nicht widerrufbar. Ihn zu übergeben, würde bedeuten, Zugang zu Material zu gewähren, das nicht übergeben wird.

## Häufige Fehler

- **Fotos ohne spezifische Einwilligung.** Die Einwilligung zur Behandlung ist nicht die Einwilligung zur Fotografie. Fehlt letztere, sollte das Bild nicht aufgenommen werden.
- **Vergleiche zwischen unterschiedlichen Bildausschnitten.** Sie sind die häufigste Ursache für Streitigkeiten über das Ergebnis: Der wahrgenommene Unterschied kann vom Winkel abhängen, nicht vom Behandlungsergebnis.
- **Versand von Fotos über normale Messenger-Dienste.** Es handelt sich um Daten nach Art. 9: Der Übertragungskanal muss entsprechend gewählt werden, und ein unverschlüsselter Chat ist nicht der richtige Kanal.

## Häufig gestellte Fragen

**Kann ich ein Foto löschen?** Ja. Durch das Löschen wird das Bild entfernt, aber im `Zugriffsprotokoll` bleibt ein Eintrag darüber, dass ein Foto existiert hat und gelöscht wurde, mit Angabe von Person und Zeitpunkt. Dies ist ein Schutz, kein Überbleibsel.

**Werden die Fotos in den Befund aufgenommen?** Nein, nicht automatisch. Die Akte der Sitzung gibt an, dass Fotos existieren, bindet sie aber nicht ein, da ihre Öffnung ein separater Zugriff ist, der protokolliert werden muss.

**Wie viel Speicherplatz beanspruchen sie?** Etwa 18 GB pro Praxis und Jahr bei intensiver Nutzung. Deshalb ist das Bildarchiv auf einem dedizierten Speicherplatz vorgesehen und nicht auf derselben Festplatte wie die Datenbank.
