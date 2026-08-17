# Behandlung dokumentieren

Diese Anleitung beschreibt, wie eine ästhetisch-medizinische Sitzung dokumentiert wird: Produkt, Charge, behandelte Bereiche, Menge und was das System anschließend tut. Sie richtet sich an Ärztinnen und Ärzte.

Die Dokumentation der Sitzung ist der klinische Akt, der Monate oder Jahre später nachweist, was durchgeführt wurde und mit welchen Produkten. Es ist das Dokument, das im Falle einer Beanstandung Bestand hat, und gleichzeitig dasjenige, das niemand am Ende eines vollen Tages ausfüllen möchte: Der Bildschirm ist so gestaltet, dass er nur das Nötigste abfragt und den Rest automatisch ergänzt.

## Voraussetzungen

- Konto mit der Rolle `medico`.
- Vorhandene Patientendaten.
- **Unterzeichnete** Einwilligungserklärung für die Behandlung. Fehlt die Einwilligung, wird die Sitzung trotzdem dokumentiert (es wird nicht verheimlicht, was durchgeführt wurde), bleibt jedoch als einwilligungslos gekennzeichnet.

## Schritt 1: Sitzung öffnen

Über die Patientenkartei im Abschnitt `Trattamenti` und die Schaltfläche `Nuovo trattamento`. Es wird das Produkt ausgewählt, und das System erkennt automatisch die Kategorie und die chemische Familie: Hyaluronsäure, Hydroxylapatit, Poly-L-Milchsäure, Botulinumtoxin.

Die Erkennung dient zwei Zwecken: Sie färbt die Bereichskarte nach Kategorie ein und schlägt – sofern im Einwilligungsformular eine erwartete Dauer angegeben ist – die Erinnerung in Schritt 5 vor.

## Schritt 2: Charge, Menge, Verfallsdatum

Die Chargennummer muss **genau so eingegeben werden, wie sie auf der Verpackung steht**. Sie ist der Schlüssel, mit dem man am Tag eines Produktrückrufs die Frage beantworten kann: „Welche Patientinnen und Patienten haben diese Charge erhalten?“ Die entsprechende Anleitung lautet `Tracciabilità del lotto`.

Bei diesen Feldern **zeichnet das System auf und rechnet nicht nach**: Die angegebene Verdünnung wird so übernommen, wie sie eingegeben wurde. Erscheint ein Wert inkonsistent, wird eine Warnung angezeigt, aber die Speicherung nicht blockiert. Eine Software, die sich weigert, das zu dokumentieren, was durchgeführt wurde, erzeugt Akten, die nicht der Realität entsprechen – ein größerer Schaden als der Fehler, den sie verhindern wollte.

## Schritt 3: Die behandelten Bereiche

Unter `Body-map e aree trattate` werden die Punkte mit nummerierten Markierungen angegeben, wobei jedem Punkt eine Menge zugeordnet wird. Es kann zwischen der Frontalaufnahme (`Foto`) und dem dreidimensionalen Modell (`3D`) gewählt werden, das den gesamten Körper inklusive Gesicht darstellt: Auf dem Foto genügt ein Klick, beim Modell ist ein Doppelklick erforderlich. Die Koordinaten des Porträts sind nach Geschlecht getrennt, da sich die Gesichtsproportionen unterscheiden und eine Markierung an der falschen Stelle eine falsche Dokumentation bedeutet.

Für jeden Punkt kann auch **wie** die Injektion durchgeführt wurde, dokumentiert werden: Instrument, Kaliber, Ebene und Technik in vier optionalen Dropdown-Menüs. Die Details sowie die beiden Möglichkeiten, die schriftlich beschriebenen Bereiche auf die Karte zu übertragen, finden sich unter [Le aree trattate: sulla foto e sul modello 3D](/manuale/body-map).

⛔ **Es gibt keine Schaltfläche, die die Bereiche der vorherigen Sitzung übernimmt.** Bis zum 17. August 2026 beschrieb diese Anleitung eine solche Funktion, die es jedoch nie gab: Bei einer Nachbehandlung werden die Bereiche neu ausgewählt oder die Sitzung wird schriftlich beschrieben und `Auto-estrai aree dal testo` gedrückt.

## Schritt 4: Wenn es sich um ein Energiegerät handelt

Wird ein Produkt als **Laser** (oder anderes Energiegerät) erkannt, erscheint das Feld `Parametri di erogazione`: Wellenlänge, Fluenz, Spotgröße, Frequenz, Pulsdauer mit Einheit, Anzahl der Durchgänge, Dichte, `Raffreddamento` und `Endpoint clinico osservato`.

Zwei Dinge, die man wissen sollte:

- **Es handelt sich um Freitextfelder ohne vorgeschlagene Werte.** Die Zahlen werden vom Display des Geräts abgelesen. Ein Menü mit „typischen Werten“ wäre eine klinische Empfehlung in Form einer Bequemlichkeitsfunktion, und ein vordefinierter Wert ist eine Empfehlung, selbst wenn er geändert werden kann.
- **Der Endpunkt ist keine Farbnote**: Er ist das, was die Fluenz der nächsten Sitzung bestimmt. Ihn zu dokumentieren, ist der Unterschied zwischen der Fortsetzung eines Zyklus und einem Neubeginn.

Für injizierbare Produkte übernehmen `Diluizione preparata`, `Scadenza del lotto` und `UDI del dispositivo (facoltativo)` dieselbe Rolle.

## Schritt 5: Off-Label-Anwendung

Wird das Produkt außerhalb der zugelassenen Indikationen verwendet, muss das Kästchen `off-label` angekreuzt werden. Es handelt sich nicht um eine Formalität: Die Off-Label-Anwendung ist zulässig, erfordert jedoch eine spezifische Aufklärung der Patientin oder des Patienten, und die Dokumentation ist der Nachweis dafür.

## Schritt 6: Die Erinnerung

Beim Speichern schlägt das System – sofern die chemische Familie des Produkts eine erwartete Dauer in einer Einwilligungserklärung aufweist – eine interne Erinnerung zum richtigen Zeitpunkt vor.

Zwei Präzisierungen, die wichtiger sind als die Funktion selbst:

- **Die Erinnerung richtet sich an die Ärztin oder den Arzt, nicht an die Patientin oder den Patienten.** Es wird keine automatische Nachricht versendet. Dies ist eine zwingende Entscheidung: Das Gesetz 145/2018 verbietet den in den Berufsregistern Eingetragenen werbende Kommunikation, und eine automatische Versendung würde **die Ärztin oder den Arzt** der Sanktion aussetzen, nicht uns.
- **Wenn die Dauer nicht bekannt ist, wird nichts vorgeschlagen.** Dies gilt für Hydroxylapatit und Biostimulatoren auf Basis von bio-remodellierender Hyaluronsäure: Die kursierenden Angaben stammen aus Informationsmaterial, nicht aus Primärquellen. Eine erfundene Erinnerung ist keine zusätzliche Erinnerung, sondern ein falscher klinischer Rat, der vom System zu kommen scheint.

## Was mit einer bereits dokumentierten Sitzung möglich ist

Jeder Eintrag im Abschnitt `Trattamenti` bietet neben der Bearbeitung und Löschung drei Aktionen, die am Symbol erkennbar sind:

- **Sitzungsdokument herunterladen (PDF)**: Ein Dokument mit allen in der Akte vermerkten Angaben zu dieser Sitzung (Produkt, Charge, Verfallsdatum, Menge, Verdünnung, Bereiche, Technik, Einwilligungen, Fotos und Zugriffe). Es deklariert leere Abschnitte selbst, anstatt sie auszulassen: Eine Akte, die einen Abschnitt verschweigt, ist nicht von einer Akte zu unterscheiden, in der dieser Abschnitt nie existiert hat.
- **Komplikation zu dieser Sitzung dokumentieren**: Siehe [Esiti e complicanze](/manuale/esiti-e-complicanze).
- **Als CDA exportieren**: Das klinische Dokument im Austauschformat.

⚠️ Eine als irrtümlich erfasst markierte Sitzung akzeptiert weder Komplikationen noch Änderungen: Sie bleibt sichtbar, da Löschen keine Korrektur ist.

## Häufige Fehler

- **Charge leer gelassen.** Genau in diesem Fall ist die Rückverfolgbarkeit am wichtigsten, und sie fehlt.
- **Behandlung erst am nächsten Tag dokumentiert.** Das Datum der Sitzung ist änderbar, sollte aber korrigiert werden: Falsche Daten fallen erst auf, wenn sie im Rahmen einer Beanstandung gelesen werden.
- **Bereiche nur schriftlich statt auf der Karte angegeben.** „Jochbein“ ist mehrdeutig; zwei Markierungen mit Menge sind es nicht.

## Häufige Fragen

**Kann ich eine gespeicherte Sitzung ändern?** Ja, und die Änderung bleibt mit Angabe von Person und Zeitpunkt im Verlauf erhalten. Nichts wird stillschweigend überschrieben.

**Erscheint die Behandlung im Fascicolo?** Ja: Produkt, Charge, Verfallsdatum, Menge, Verdünnung, Einwilligungen, Fotos und Zugriffe in einem einzigen Dokument.
