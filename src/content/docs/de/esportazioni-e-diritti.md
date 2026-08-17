# Export und Patientenrechte

Diese Anleitung beschreibt, wie du einem Patienten seine Daten aushändigst und wie du auf Anfragen gemäß der DSGVO reagierst. Sie richtet sich an Ärztinnen, Ärzte und Praxisadministratoren.

Verantwortlicher der Datenverarbeitung ist **die Praxis**: Die Anfragen der Patienten gehen an den Arzt, nicht an uns. Diese Anleitung erklärt, welche Möglichkeiten das System bietet, um darauf zu reagieren.

## Mögliche Anfragen

| Anfrage | Referenz | Was benötigt wird |
|---|---|---|
| „Ich möchte eine Kopie meiner Daten“ | Art. 15 (Auskunft) | Export der Patientenakte |
| „Ich möchte meine Daten in einem Format, das ich woanders nutzen kann“ | Art. 20 (Datenübertragbarkeit) | Strukturierter Export |
| „Korrigiert diese Angabe“ | Art. 16 (Berichtigung) | Änderung in der Akte mit Historie |
| „Löscht meine Daten“ | Art. 17 (Löschung) | ⚠️ siehe unten: nicht automatisch |
| „Ich widerrufe meine Einwilligung“ | L. 219/2017 Art. 1 Abs. 5 | ⛔ **nicht Teil dieser Anleitung** → [Einwilligungen](/manuale/consensi-informati) |

⚠️ **„Widerruf“ hat zwei unterschiedliche Bedeutungen, und sie zu verwechseln führt zu Fehlern.**
Der Widerruf der **Einwilligung zu einer Behandlung** (das Dokument, das der Patient vor der Behandlung unterschrieben hat) erfolgt über die Anleitung [Einwilligungen](/manuale/consensi-informati) und hat klinische Konsequenzen: Abbruch der Behandlung. **Es handelt sich nicht** um eine Löschanfrage der Daten, und tatsächlich bleibt das widerrufene PDF **archiviert**: Es dient als Nachweis, dass die Einwilligung zum Zeitpunkt der Behandlung vorlag. Die Anfragen in der obigen Tabelle beziehen sich hingegen auf die Daten, und für die klinische Dokumentation gelten die in Art. 17 genannten Einschränkungen, die weiter unten erläutert werden.

## Schritt 1: Export der Patientenakte

Über die Patientenakte erzeugt der Export-Button ein Dokument mit Stammdaten, Anamnese, Behandlungen, Verordnungen, Untersuchungen, Einwilligungen und Zugriffsprotokoll.

Die **Fotos** sind nicht in diesem Dokument enthalten: Sie sind verschlüsselt, und ihre Öffnung wird separat protokolliert. Sie werden separat exportiert und **erst bei der Aushändigung entschlüsselt**, sodass der Patient Bilder erhält, die er öffnen kann: Eine verschlüsselte Datei, die nicht lesbar ist, erfüllt nicht das Recht auf Datenübertragbarkeit.

## Schritt 2: Die Löschanfrage

⚠️ **Die Löschung ist nicht automatisch und darf es auch nicht sein.** Das Recht auf Vergessenwerden nach Art. 17 hat Ausnahmen, und eine davon betrifft genau diesen Fall: Absatz 3 Buchstabe b) schließt die Löschung aus, wenn die Verarbeitung zur Erfüllung einer rechtlichen Verpflichtung erforderlich ist, und Buchstabe c), wenn sie für Zwecke der präventiven Medizin, Diagnose und Behandlung notwendig ist.

Praktisch bedeutet das: Die klinische Dokumentation muss so lange aufbewahrt werden, wie der Arzt für sein Handeln verantwortlich gemacht werden kann. Eine Löschung auf Anfrage würde bedeuten, sich des Beweismittels zu berauben, mit dem man sich verteidigen kann, und ist keine Verpflichtung, die die DSGVO auferlegt.

⇒ Die korrekte Antwort auf eine Löschanfrage ist begründet, kein pauschales Nein und keine automatische Ausführung. Wenn sich die Anfrage auf nicht-klinische Daten bezieht (eine Kontaktdaten, eine organisatorische Notiz), werden diese gelöscht.

## Schritt 3: Wenn die Praxis schließt oder die Software wechselt

Der Ausstieg folgt einem eigenen Ablauf: Zuerst wird alles exportiert, dann wird bestätigt, dass das Paket empfangen wurde, und **erst danach** wird gelöscht. Die Reihenfolge ist nicht verhandelbar: Sie umzukehren bedeutet, die einzige lesbare Kopie zu zerstören.

Das Paket enthält die strukturierten Daten und die Fotos im Klartext. ⛔ Es enthält nicht den Verschlüsselungsschlüssel, und zwar nicht aus Gründen unserer Vertraulichkeit: Dieser Schlüssel öffnet **alle** vorhandenen verschlüsselten Kopien, einschließlich derer in Backups, die nicht ausgehändigt werden, und er ist nicht widerrufbar.

Nach bestätigter Aushändigung wird der Schlüssel dieses Projekts vernichtet. Das ermöglicht es, wahrheitsgemäß zu erklären, dass die verbleibenden Backups, obwohl sie noch eine Zeit lang existieren, von niemandem mehr lesbar sind.

## Häufige Fehler

- **Fotos über normale Messenger-Dienste übermitteln.** Es handelt sich um Daten nach Art. 9.
- **Eine Löschung durchführen, nur weil sie verlangt wurde.** Sie muss bewertet werden, und die Bewertung muss dokumentiert werden.
- **Löschen, bevor der Empfang des Pakets bestätigt wurde.** Das ist der irreversible Fehler.

## Häufige Fragen

**Kann der Patient die Protokolle seiner Zugriffe anfordern?** Ja, sie sind vorhanden: Jeder Zugriff auf seine Akte wird mit Person und Zeitpunkt protokolliert.

**Wie viel Zeit habe ich, um zu antworten?** Einen Monat ab Anfrage, in komplexen Fällen um zwei Monate verlängerbar, wobei der Betroffene darüber informiert werden muss.

**Wer antwortet, ich oder Fibonacci?** Die Praxis: Sie ist der Verantwortliche. Wir sind Auftragsverarbeiter und stellen die Werkzeuge zur Verfügung.
