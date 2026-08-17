# Arzneimittelkatalog: Aktualisierungsstatus

Der Arzneimittelkatalog von Fibonacci stammt von der **AIFA** und umfasst etwa 159.000 Einträge.
Er wird nicht manuell erstellt: Ein automatischer Prozess importiert und hält ihn synchron.

Die Seite **`Arzneimittelkatalog (Status)`** im Administrationsbereich zeigt den Verlauf
des letzten Imports an. Sie ist der Rolle des Administrators vorbehalten.

## Was die Seite anzeigt

- **Status der letzten Ausführung**: abgeschlossen, in Bearbeitung oder fehlgeschlagen.
- **Zeitpunkt** und **Dauer** der Ausführung.
- **Anzahl der Einträge**, die gelesen, hinzugefügt oder aktualisiert wurden.
- **Fehler**, falls aufgetreten, mit Angabe der Ursache.

Wenn ein Import **in Bearbeitung** ist, aktualisiert sich die Seite automatisch alle dreißig
Sekunden: Ein manuelles Neuladen ist nicht erforderlich. Ein vollständiger Import dauert etwa vierzig Minuten,
daher ist es normal, wenn der Status längere Zeit „in Bearbeitung“ anzeigt.

## „`Jetzt synchronisieren erzwingen`“ ist deaktiviert – und so gewollt

Der Button ist vorhanden, aber nicht anklickbar. Ein Import benötigt viele Ressourcen und dauert
mehrere zehn Minuten: Würde er über die Weboberfläche gestartet – möglicherweise versehentlich zweimal –
würde dies die Patientenakte während der Praxiszeiten verlangsamen. Die Synchronisation ist geplant
und wird nur bei Bedarf vom Server aus erzwungen.

## Was tun, wenn der Import fehlschlägt

Der Katalog **bleibt der der letzten erfolgreichen Aktualisierung**: Kein Arzneimittel
verschwindet, und die Verordnung funktioniert weiterhin. Ein Fehlschlag ist kein Notfall:
Er bedeutet, dass der Katalog veraltet, nicht dass er geleert wird.

Falls der Status mehrere Tage lang „fehlgeschlagen“ bleibt, melde es: Die Ursache liegt fast immer
beim Quellsystem (die AIFA-Datenquelle ist nicht erreichbar), was im angegebenen Grund auf der Seite ersichtlich ist.
