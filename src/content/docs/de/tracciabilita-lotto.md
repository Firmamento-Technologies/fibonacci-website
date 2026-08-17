# Chargenrückverfolgbarkeit

Diese Anleitung beschreibt, wie die Charge der injizierten Produkte erfasst wird und wie du auf die entscheidende Frage antwortest: **Welche Patientinnen und Patienten haben eine bestimmte Charge erhalten?** Sie richtet sich an Ärztinnen, Ärzte und das Praxispersonal, das das Lager verwaltet.

Die Frage ist nicht theoretisch. Wenn ein Hersteller eine Charge zurückruft oder der Verdacht auf eine Reaktion im Zusammenhang mit einem bestimmten Produkt besteht, muss die Antwort innerhalb von Minuten vorliegen und schriftlich erfolgen.

## Voraussetzungen

- Konto mit der Rolle `medico` oder `admin studio`.
- Funktion `Suche nach Charge` in deiner Praxis aktiv. Falls der Menüpunkt nicht angezeigt wird, ist die Funktion nicht freigeschaltet: Wende dich an den Support.

## Schritt 1: Charge während der Sitzung erfassen

Bei der Dokumentation einer Injektionsbehandlung stehen neben Produkt und Menge folgende Felder zur Verfügung:

- **Chargennummer**, wie auf der Verpackung aufgedruckt,
- **Verfallsdatum**,
- **Verdünnung**, falls relevant.

Die Chargennummer muss **genau so eingegeben werden, wie sie aufgedruckt ist**, ohne zusätzliche Leerzeichen oder Bindestriche: Sie ist der Schlüssel, mit dem die Suche die Sitzung findet.

Das System **erfasst** diese Angaben, ohne sie zu berechnen: Die angegebene Verdünnung wird so übernommen, wie sie eingegeben wurde, und nicht neu berechnet oder korrigiert. Falls ein Wert inkonsistent erscheint, warnt das System, blockiert die Speicherung aber nicht. Das ist eine bewusste Entscheidung: Eine Software, die sich weigert, das zu dokumentieren, was tatsächlich durchgeführt wurde, erzeugt Patientenakten, die nicht der Realität entsprechen.

## Schritt 2: Suche nach Charge

Der Menüpunkt `Suche nach Charge` öffnet eine Suche mit einem einzigen Eingabefeld. Durch Eingabe der Chargennummer erhältst du eine Liste aller Sitzungen, in denen diese Charge verwendet wurde, mit:

- Patientin oder Patient,
- Datum der Sitzung,
- verabreichter Menge,
- erfasstem Verfallsdatum.

Die Suche durchsucht alle Patientinnen und Patienten der Praxis in einer einzigen Abfrage. Es ist nicht nötig, im Voraus zu wissen, bei welchen Patientinnen und Patienten gesucht werden soll – genau darum geht es.

## Schritt 3: Was mit der Liste tun

Die Liste ist der Ausgangspunkt für zwei verschiedene Aktivitäten, die man besser trennt:

- **Rückruf des Herstellers.** Die Liste identifiziert die zu kontaktierenden Patientinnen und Patienten. Die Kontaktaufnahme ist eine klinische Kommunikation und sollte von der Praxis aus erfolgen, nicht automatisiert.
- **Meldung eines unerwünschten Ereignisses.** Falls der Verdacht besteht, dass die Charge mit einer Reaktion in Zusammenhang steht, muss die Meldung in der Patientenakte im Abschnitt zu Ergebnissen und Komplikationen erfasst werden, wo es Felder für das Produkt und die Charge gibt.

## Häufige Fehler

- **Charge in unterschiedlichen Formaten in verschiedenen Sitzungen erfasst.** `A1234-B` und `A1234 B` sind für die Suche zwei verschiedene Chargen. Es lohnt sich, in der Praxis eine einheitliche Schreibweise zu vereinbaren.
- **Charge leer gelassen, weil „es ist ja immer dieselbe“.** Gerade in diesem Fall ist die Rückverfolgbarkeit am wichtigsten – und fehlt.
- **Verfallsdatum nicht erfasst.** Ohne dieses Datum lässt sich nicht unterscheiden, ob die Verabreichung innerhalb der Haltbarkeit des Produkts oder danach erfolgte: Es ist ein Datum, das die Ärztin oder den Arzt schützt.

## Häufig gestellte Fragen

**Ist die Charge Pflicht?** Das System erzwingt sie nicht. Sie ist jedoch der einzige Weg, um auf einen Rückruf zu reagieren, und ihr Fehlen fällt erst auf, wenn sie benötigt wird.

**Kann ich nach Produkt statt nach Charge suchen?** Die Suche erfolgt nach Charge. Das Produkt wird in der Ergebnisliste und in der Sitzungsakte angezeigt.

**Werden die Chargendaten in die Sitzungsakte übernommen?** Ja: Produkt, Charge, Verfallsdatum, Menge und Verdünnung erscheinen in der Akte, zusammen mit den Einwilligungen und Zugriffen.
