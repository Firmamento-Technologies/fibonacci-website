# `Zugriffsprotokoll`: Wer hat was und wann gemacht

Jede Operation an Patientendaten hinterlässt eine Spur: wer sie durchgeführt hat, wann und an welcher Akte. Das **`Zugriffsprotokoll`** ist der Ort, an dem diese Spuren eingesehen werden können.

Es dient drei konkreten Zwecken: die Beantwortung der Frage eines Patienten, wer seine Akte eingesehen hat, die Rekonstruktion dessen, was passiert ist, wenn etwas nicht stimmt, und der Nachweis gegenüber einer Kontrolle, dass die Praxis nachverfolgt, was sie tut.

## Wer kann es öffnen

Nur Personen mit der Rolle des Praxisadministrators. Wenn der Punkt **`Zugriffsprotokoll`** nicht in der Navigation erscheint, verfügt dein Nutzer nicht über diese Berechtigung: Sie wird vom Administrator in den `Einstellungen` vergeben.

## Was man sieht

Eine Tabelle mit der neuesten Zeile oben. Für jede Zeile:

- **wann** es passiert ist;
- **wer** es gemacht hat: der Name des Bearbeiters oder *System* für automatische Vorgänge;
- **was** gemacht wurde: Erstellung, Lesen, Aktualisierung, Löschung;
- **woran**: die betroffene Akte oder das Dokument;
- **wie es gelaufen ist**: erfolgreich, Warnung, `Fehler`.

## Die Filter

Über der Tabelle kann die Suche eingegrenzt werden.

- **Klinische Aktivität** oder **Systemaktivität**. Erstere umfasst das, was Personen an den Akten vornehmen; letztere das, was das Programm automatisch erledigt: Importe, automatische Prozesse. Die Trennung ist wirklich nützlich, da die Systemaktivitäten zahlreich sind und die klinischen Aktivitäten sonst überdecken würden.
- **Die Aktion**: nur Lesevorgänge, nur Änderungen, nur Löschungen.
- **Das Ergebnis**: nur Warnungen, nur `Fehler`.

## Antwort auf die Frage, wer die Akte eingesehen hat

Dies ist der häufigste Fall und ein Recht des Patienten: Das Gesetz sieht **fünfzehn Tage** für die Antwort vor.

1. Filtere nach diesem Patienten.
2. Wähle den Zeitraum aus.
3. Drücke **Exportieren**.

Es wird eine CSV-Datei (kann mit jeder Tabellenkalkulation geöffnet werden) mit genau den Zeilen erstellt, die auf dem Bildschirm angezeigt werden. Dies ist die Form, in der die Antwort übermittelt wird.

## Die Integrität: Warum das Protokoll nicht korrigiert wird

Das Protokoll ist so aufgebaut, dass eine einmal geschriebene Zeile **weder geändert noch gelöscht werden kann** und dass eine mögliche Manipulation sichtbar wird: Jede Zeile ist mit der vorherigen verknüpft, sodass eine Änderung an einer Zeile die Manipulation in allen folgenden Zeilen offensichtlich macht.

⚠️ **Diese Überprüfung hat keinen Button in der Oberfläche.** Sie wird auf dem Server durchgeführt, und das Ergebnis muss beim Support angefragt werden. Falls eine Manipulation festgestellt wird, handelt es sich nicht um eine gewöhnliche Meldung: Es ist ein Sicherheitsvorfall und muss sofort gemeldet werden.

## Wie lange die Spuren erhalten bleiben

So lange wie die klinische Dokumentation, auf die sie sich beziehen. Sie bleiben **auch nach** der Löschung eines Patienten erhalten: ohne dessen Namen, aber mit der Spur, dass die Operation stattgefunden hat. Dies ist beabsichtigt: Ein Protokoll, das mit den Daten verschwindet, würde nichts mehr beweisen.

## Was es auf dieser Seite NICHT gibt

Damit du nicht nach etwas suchst, das nicht existiert:

- **kein Export in signiertes PDF**: Der Export erfolgt als CSV;
- **kein Button zur Integritätsprüfung** (siehe oben: erfolgt auf dem Server);
- **keine grafische Zeitleiste** der Operationen an einem Patienten;
- **kein speicherbarer Filter unter den Favoriten**, keine Suche nach Netzwerkadresse.
