# Hautparameter

Diese Anleitung beschreibt die Messung der **ästhetischen Hautparameter**: elf Größen, die Fibonacci auf einem von dir gewählten Hautbereich eines bereits in der Akte vorhandenen Fotos berechnet, deren Speicherung und den Vergleich über die Zeit. Es handelt sich um **Fotomessungen**, nicht um Hautmessungen: Sie beschreiben das Bild eines Bereichs und dienen dazu, das zu dokumentieren, was heute nur mit zwei nebeneinanderliegenden Fotos dokumentiert wird.

⚠️ **Die Seite erscheint nur, wenn die Funktion für deine Praxis aktiviert wurde.** Falls du in der Akte-Leiste `Hautparameter` nicht siehst, handelt es sich nicht um einen Fehler: Die Funktion ist standardmäßig deaktiviert.

## Was sie nicht kann, bevor sie erklärt, was sie kann

Dies steht auch oben auf der Seite, mit derselben Sichtbarkeit wie die Zahlen, und ist keine Höflichkeitsfloskel:

> Dieses Tool berechnet fotografische Größen auf dem von dir abgegrenzten Bereich. Es erkennt, meldet oder zählt keine Läsionen, Muttermale oder verdächtige Flecken, ordnet die Werte keiner Ursache zu und ist kein Screening-Tool: Es ersetzt nicht die Hautuntersuchung.

Konkret: Kein Wert wird mit einem Schwellenwert verglichen, es gibt keine Bewertungen der Schwere oder des Grades, keine Zahl ist grün oder rot eingefärbt, und die Seite sagt nie „verbessert“ oder „verschlechtert“. Die Zahlen werden nackt angezeigt, mit ihrer Einheit; die Beurteilung bleibt dir überlassen. Wenn du beim Betrachten des Bereichs etwas bemerkst, hat es dein Auge bemerkt: Das Programm schaut nicht hin, es misst dort, wo du es aufforderst zu messen.

## Voraussetzungen

- Konto mit der Rolle `Ärztin, Arzt oder medizinische Fachkraft` oder `Administration`.
- Mindestens ein Foto in der Akte (siehe Anleitung „Klinische Fotos und Vorher/Nachher-Vergleich“). Jede Ansicht ist geeignet, ein Frontalbild ist nicht erforderlich.

## Wo es sich befindet

Die Schaltfläche `Hautparameter` befindet sich in der oberen Leiste der Patientenakte, neben `Gesichtsanalyse`, und ist von jeder Registerkarte aus sichtbar. Von der Gesichtsanalyse-Seite und der Parameter-Seite gelangst du über einen Link oben rechts von einer zur anderen.

## So wird es verwendet

1. **Wähle das Foto aus.** Unter `Fotografie` befindet sich der Streifen der in der Akte vorhandenen Aufnahmen, beginnend mit der neuesten. Die erste ist bereits ausgewählt.
2. **Zeichne den Bereich ein.** Unter `Zu messender Bereich` ziehst du mit dem Finger oder der Maus über das Foto: Was außerhalb liegt, wird abgedunkelt, sodass auf einen Blick erkennbar ist, was in die Messung einbezogen wird und was nicht. Du kannst den Bereich beliebig oft neu zeichnen, das letzte Rechteck zählt. Unter dem Foto findest du die Pixelgröße des von dir eingezeichneten Bereichs.
3. **Lies die Werte ab.** Sie erscheinen neben dem Foto, sobald du das Ziehen loslässt.

⛔ **Es gibt keinen vordefinierten Bereich, und das ist kein Versehen.** Ein Programm, das selbst entscheidet, wo es hinschaut, beginnt damit, Befunde auszuwählen – das ist etwas anderes als das, was dieses Tool tut. Den Bereich wählst du, immer.

Wenn du das Foto wechselst, wird der Bereich zurückgesetzt: Es war ein Rechteck auf einer anderen Haut, und es würde plausible Zahlen für einen Bereich liefern, den niemand ausgewählt hat.

Die Berechnung erfolgt **im Browser**: Das Foto verlässt das System nicht, und kein externer Dienst erhält es.

## Die elf Punkte

| Punkt | Was er aussagt |
|---|---|
| Fläche mit stärkerer Pigmentierung als der lokale Hintergrund | Wie viel Prozent des Bereichs dunkler sind als der lokale Durchschnittswert der Umgebung |
| Erkannte kreisförmige Öffnungen | Wie viele kleine runde Öffnungen innerhalb des angegebenen Durchmesserbereichs gezählt werden |
| Durchschnittlicher Durchmesser der erkannten Öffnungen | Wie groß sie im Durchschnitt sind, in Prozent der kürzeren Seite des Bereichs |
| Fläche, die von den erkannten Linien eingenommen wird | Wie viel Prozent des Bereichs von den durch Kontrastfilter gefundenen Linien bedeckt sind |
| Gesamtlänge der erkannten Linien | Ihre summierte Länge, in Vielfachen der kürzeren Seite des Bereichs |
| Durchschnittsfarbe, Helligkeit L\* | Die durchschnittliche Helligkeit, von 0 (schwarz) bis 100 (weiß) |
| Durchschnittsfarbe, Achse a\* | Die Rot/Grün-Achse der Durchschnittsfarbe |
| Durchschnittsfarbe, Achse b\* | Die Gelb/Blau-Achse der Durchschnittsfarbe |
| Individueller typologischer Winkel (ITA) | Der aus L\* und b\* berechnete farbmetrische Winkel, in Grad |
| Farbunregelmäßigkeit | Wie stark die Pixel des Bereichs im Durchschnitt von der Durchschnittsfarbe abweichen |
| Fläche mit höherer Rotkomponente als der Median des Bereichs | Wie viel Prozent des Bereichs einen bestimmten Wert über dem Median der Rotkomponente des Bereichs selbst überschreiten |

Die Bezeichnungen geben an, **was auf dem Bild gemessen wurde**, nie, worauf es zurückzuführen sein könnte: Diese Interpretation nimmst du vor dem Patienten vor, und genau deshalb schreibt das Programm sie nicht für dich.

### Der ITA ist nicht der Hauttyp, und Fibonacci wandelt ihn nicht in einen Hauttyp um

Das ist die Frage, die sofort kommt, denn in der Literatur gibt es eine Umrechnungstabelle zwischen individuellem typologischem Winkel und Fitzpatrick-Hauttyp, die aus sechs Zeilen besteht. Fibonacci **wendet sie nicht an** und zeigt nur den Winkel an. Drei Gründe, nach Gewicht geordnet:

1. **Ein Hauttyp ist ein Grad, und diese Seite vergibt keine Grade.** Hier gilt dieselbe Regel wie für den Rest: Das Tool misst, die Klassifizierung nimmt der Arzt vor.
2. **Die Umrechnung, gemessen, funktioniert bei Fitzpatrick nicht gut.** Eine Studie aus dem Jahr 2025, die den ITA automatisch berechnet und auf zwei Skalen abbildet, findet eine gute Übereinstimmung mit der Monk-Skala und eine **weniger konstante** Übereinstimmung mit den Fitzpatrick-Typen. Das überrascht nicht: Fitzpatrick basiert auf der **Reaktion auf die Sonne**, nicht auf der Farbe, und ist daher eine Bewertung, keine Farbmessung.
3. **Eine Person nach der Hautfarbe in einem Foto zu klassifizieren, ist eine biometrische Kategorisierung anhand eines geschützten Merkmals**, und als solche keine technische Entscheidung, sondern eine mit eigenen rechtlichen Konsequenzen.

Der Hauttyp in Fibonacci bleibt dort, wo er immer war: das Feld `Hauttyp (Fitzpatrick)` in der ästhetischen Anamnese, das das System bereits als „Es handelt sich um eine Bewertung des Arztes, nicht um eine Antwort des Patienten“ beschreibt. Der hier gemessene Winkel kann dir helfen, ihn auszufüllen, aber er füllt ihn nicht für dich aus.

Die Schaltfläche `Wie wird gemessen`, unter den Werten, öffnet die genauen Parameter der Methode: Arbeitsbereich, Mindestgröße des Bereichs, Radius des lokalen Hintergrunds, Durchmesserbereich der Öffnungen, Ausrichtungen und Schwellenwerte der Linienfilter, Abweichung der Rotkomponente. Das sind die Parameter des Tools, wie die Blende einer Kamera: Keiner dieser Werte trennt einen „normalen“ von einem „anormalen“ Wert.

## Wie groß muss der Bereich sein

Er muss mindestens **120 Pixel pro Seite** und **40.000 Quadratpixel** Fläche haben. Darunter zeigt die Seite dies an und zeigt keine Zahlen an.

Der Grund ist messbar, nicht vorsorglich: In einem kleinen Bereich sind wenige zu zählende Öffnungen vorhanden, und eine Zählung mit wenigen Elementen schwankt. Bei erneuter Aufnahme derselben Haut ohne Änderungen bewegte sich die Zählung um **33 % bei 21.000 Quadratpixeln** und um **9,8 % bei 78.000**: Das bedeutet, dass sich die Zahl in einem kleinen Bereich um ein Drittel ändert, ohne dass sich an der Haut etwas geändert hat. Eine solche Zahl ist keine Messung, sondern Rauschen mit dem Anschein einer Messung, und dann ist es besser, keine Zahl anzuzeigen.

Aus demselben Grund zeigt die Seite unter den Werten an, wie viele Öffnungen in diesem Bereich gezählt wurden und wie hoch die Genauigkeit der Zählung ist. Das ist die Toleranz des Tools, wie die eines Messschiebers: **kein** Urteil über die Haut. Wenn du eine stabilere Zählung benötigst, vergrößere den Bereich.

## In der Akte speichern

Die Werte werden jedes Mal neu aus dem Foto berechnet, wenn du die Seite öffnest. In der Akte werden sie **nur gespeichert, wenn du sie speicherst**: Wähle unter den Werten die `Gemessene Zone` aus der Liste aus (dasselbe Vokabular von Bereichen, das du für Behandlungen und Fotos verwendest) und drücke `In Akte speichern`.

Die Zone ist obligatorisch: Ohne sie würden im zeitlichen Vergleich eine Wange und eine Stirn in derselben Zeile landen.

Wenn du **denselben Bereich desselben Fotos** erneut speicherst, wird die Messung aktualisiert, anstatt sie zu duplizieren, und die Schaltfläche zeigt dies an: Sie wird zu `In Akte aktualisieren`. Zwei verschiedene Zonen desselben Fotos existieren nebeneinander, ohne sich zu überschreiben.

Was in der Akte landet, bringt mit, woher es stammt: das Ursprungsfoto, das genaue Rechteck (damit dieselbe Messung identisch wiederholt werden kann), die Methode, mit der es erhalten wurde, und wer entschieden hat, es zu speichern. Das Datum der Messung ist das des **Aufnahmezeitpunkts**, nicht das des Speicherns: Die gemessene Haut ist die von damals.

## Im Zeitverlauf

Am Ende der Seite zeigt `Im Zeitverlauf, nach Zone` die gespeicherten Messungen **nach Zonen getrennt** an, mit dem neuesten Wert und der Differenz zum ersten.

Über den Serien steht immer derselbe Satz, und das ist das Wichtigste auf der Seite:

> Bei erneuter Aufnahme derselben Haut ohne Änderungen bewegten sich diese Zahlen in Tests zwischen 1 % und 6 % (bis zu 10 % bei der Zählung der Öffnungen in einem kleinen Bereich). Eine kleinere Differenz ist keine Differenz.

Auch die Diagramme sind auf diese Zahl kalibriert: Eine Differenz, die kleiner ist als die Genauigkeit des Tools, wird **flach** dargestellt, nicht als Anstieg. Ohne diese Maßnahme würde eine Linie zwischen nur zwei Messungen immer eine diagonale Linie in voller Höhe zeichnen, selbst bei einer Differenz von null, und die Grafik würde etwas aussagen, was die Zahl nicht aussagt.

## Die Grenzen, ausführlich

- **Sie messen das Foto, nicht die Haut.** Sie ändern sich mit der Beleuchtung, der Aufnahmeentfernung, dem Objektiv und der Dateikomprimierung. Damit zwei Messungen vergleichbar sind, müssen zwei vergleichbare Aufnahmen gemacht werden: gleicher Standort, gleiche Beleuchtung, gleiche Entfernung. Das gilt hier genauso wie für den Vorher/Nachher-Vergleich.
- **Der Wiederholbarkeitstest wurde mit Studiofotos durchgeführt**, gut beleuchtet und scharf. Er berücksichtigt nicht das Licht in deinem Raum, Rest-Make-up oder die Tageszeit. Die oben genannten Zahlen sind daher ein **Minimum**: An deinem Standort wird die Abweichung größer sein, nicht kleiner.
- **Kein trainiertes Modell.** Die Werte stammen aus einzeln beschreibbaren Berechnungen (lokale Mittelwerte, zusammenhängende Komponenten, gerichtete Filter, Farbraumkonvertierung), nicht aus einem auf klinischen Fällen trainierten System. Das ist eine Entscheidung, keine technische Einschränkung: Ein trainiertes System würde die Frage beantworten „Wem ähnelt das?“, was eine andere Frage ist.
- **Kein Screening-Tool.** Etwas in einem Bereich zu messen bedeutet nicht, dass der Rest betrachtet wurde.

## Verwandte Anleitungen

- „Klinische Fotos und Vorher/Nachher-Vergleich“, für das Aufnahmeprotokoll: Es macht die Messungen vergleichbar.
- „Gesichtsanalyse“, für die Form- und Proportionsmessungen am Frontalbild.
