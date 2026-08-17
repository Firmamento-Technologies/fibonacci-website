# Gesichtsanalyse

Diese Anleitung beschreibt die morphologische Gesichtsanalyse: die Messungen, die Fibonacci aus einem frontalen Foto ableitet, den Vergleich mit den neoklassischen Kanons, die dreidimensionale Ansicht, die Fotoserie nach Ansicht, das Speichern in der Patientenakte und die Dokumentation des klinischen Urteils (PGAIS) zum Vorher/Nachher-Vergleich. Die Analyse liefert Messwerte (Winkel, Verhältnisse, Abweichungen) und reiht sie zeitlich ein; das Urteil bleibt beim Arzt.

## Voraussetzungen

- Konto mit der Rolle `Ärztin, Arzt oder medizinische Fachkraft` oder `Administration`.
- Mindestens ein frontales Gesichtsbild in der Patientenakte (siehe Anleitung „Klinische Fotos und Vorher/Nachher-Vergleich“).

## Wo es sich befindet

Die Schaltfläche `Gesichtsanalyse` befindet sich in der oberen Leiste der Patientenakte, neben `Daten und Personen` und dem Menü `Exportieren`, und ist von jedem Tab aus sichtbar.

## Was gemessen wird und auf welchem Foto

Die Erfassung erfolgt **im Browser**: Das Foto verlässt das System nicht und kein externer Dienst erhält es. Aus einer frontalen Aufnahme werden folgende Daten ermittelt:

- die **Gesichtsmedianlinie** und der **Parallelismus der Ebenen** (Pupillenabstand, äußere Augenwinkel und Mundwinkel) als Abweichung in Grad von der Senkrechten zur Medianlinie;
- die **Drittel** (Verhältnis mittleres Drittel / unteres Drittel). Das obere Drittel ist nicht berechenbar: Es erfordert den Haaransatz, den das Modell nicht erkennt, und die Seite gibt stattdessen an, dass es nicht geschätzt wird;
- **welche Seite breiter ist** an den Wangenknochen, äußeren Augenwinkeln und Mundwinkeln. Es wird angegeben, welche Seite breiter ist, nicht „wie asymmetrisch das Gesicht ist“: Die Quelle des Modells schließt diese zweite Verwendung aus;
- die **Qualität der Aufnahme** (Kopfrotation), die nicht frontale Aufnahmen kennzeichnet, anstatt deren Zahlen zu verbergen.

Die Messungen sind dimensionslos (Winkel, Verhältnisse, Prozente), da aus einem Foto ohne metrischen Bezug Millimeter nicht ehrlich abgeleitet werden können.

## Der Vergleich mit dem neoklassischen Kanon

Jeder Eintrag zeigt den gemessenen Wert, den Referenzwert des Kanons und die Abweichung zwischen beiden. Der Vergleich mit dem Kanon und der Vorher/Nachher-Vergleich bleiben getrennt: Eine Zusammenführung würde eine Zahl ergeben, die weder auf „wie stark weicht es vom Referenzwert ab“ noch auf „was hat die Behandlung bewirkt“ antwortet.

## Die 3D-Ansicht

Der Schalter `Foto | 3D` zeigt das aus den Referenzpunkten rekonstruierte Gesichtsnetz, das navigierbar ist (*„Ziehen, um zu drehen, Scrollrad, um zu zoomen“*), als Oberfläche, Gitter oder **`Relief`**, das die Oberfläche nach Tiefe einfärbt, anstatt die Haut zu imitieren: So sind Volumenasymmetrien mit bloßem Auge erkennbar. Auch die Referenzpunkte sind sichtbar, alle 468.

**Es handelt sich nicht um einen Scan**: Die Tiefe wird aus einem einzigen Foto geschätzt und ist relativ: Sie dient dazu, die Form zu betrachten, nicht um Vorsprünge oder Volumina zu messen. Für Volumina und Oberflächenkarten ist Stereofotogrammetrie-Hardware erforderlich, die diese Seite nicht ersetzen soll.

## Die Profilwinkel, manuell gesetzt

Bei seitlichen Ansichten liefert das Modell nicht die benötigten Punkte, daher setzt sie der Arzt: Der Abschnitt `Profilwinkel (manuell gesetzte Punkte)` fordert **sechs Punkte** und misst, sobald alle vorhanden sind, die Winkel (*„Sechs Punkte gesetzt: Winkel gemessen“*). `Neu beginnen` setzt sie zurück.

Dies ist der einzige Punkt der Seite, an dem die Messung davon abhängt, wo geklickt wird: Zwei verschiedene Klickserien ergeben zwei verschiedene Ergebnisse, und die Wiederholbarkeit liegt bei dir.

## Die Messungen in Millimetern

`Mit einem Marker kalibrieren` wandelt die Verhältnisse in Millimeter um: Es wird die `Reale Größe (mm)` eines im Bild vorhandenen Objekts angegeben und an dessen beiden Enden geklickt. Ab diesem Zeitpunkt zeigt die Seite die `Absoluten Messungen (kalibriert)` an; `Klicks wiederholen` und `Neu kalibrieren` führen den Vorgang erneut durch.

⚠️ **Die Kalibrierung gilt nur am Bildschirm**: Die Millimeter werden nicht in der Akte gespeichert, da sie von einem Marker und zwei Klicks in diesem Moment abhängen. Was gespeichert wird, sind die Verhältnisse und Winkel, die keine Skalierung benötigen.

## Der Live-Spiegel

`Live-Spiegel` aktiviert die Kamera und zeigt dem Patienten sein Gesicht in Echtzeit mit der Aufforderung `Gesicht einrahmen`. **Es wird nichts gemessen oder aufgezeichnet**, und die Kamera *„ist ausgeschaltet. Sie wird nur aktiviert, wenn du es verlangst“*: Sie dient während des Gesprächs, um über eine Zone zu sprechen, während man sie gemeinsam betrachtet.

## Die Fotoserie nach Ansicht

Das klinische Fotoprotokoll besteht aus einer Reihe von Aufnahmen aus definierten Ansichten (frontal, seitlich, schräg 45°, plus dynamische Aufnahmen für die Mimik), die bei jedem Besuch gleich wiederholt werden. Daher kann jede Foto beim Hochladen die **Ansicht** angeben; der Tab `Fotos` zeigt die Serie des letzten Besuchs und gibt an, welche Ansichten fehlen.

Drei Regeln der Serie:

- Die Ansicht ist **fakultativ**: Fotos, die vor dieser Funktion hochgeladen wurden, haben sie nicht, und „nicht angegeben“ bleibt anders als „frontal“. Das System füllt das Feld niemals selbst aus;
- Die Checkliste **informiert und blockiert nicht**: Aufnahmen außerhalb der Serie sind zulässig;
- Wenn mit der Kamera eine Ansicht gewählt wird, **erscheint die vorherige Aufnahme derselben Ansicht transparent im Sucher**: Das Gesicht mit dem Geisterbild zu überlagern, ist die praktische Methode, um Bildausschnitt und Entfernung zu wiederholen.

Die Analyse arbeitet mit frontalen Aufnahmen (und solchen ohne angegebene Ansicht); wenn andere Aufnahmen ausgeschlossen sind, gibt die Seite an, wie viele.

## Messungen in der Akte speichern und im Zeitverlauf lesen

Die Messungen werden bei jedem Öffnen aus dem Foto neu berechnet; **in der Akte werden sie nur gespeichert, wenn der Arzt sie speichert**, mit der Schaltfläche `In Akte speichern` unter den Zahlen. Dies ist absichtlich eine explizite Handlung: Eine vom Modell erzeugte Zahl wird nur durch die Entscheidung des Arztes in die klinische Dokumentation aufgenommen, und die Speicherung gibt an, wer gemessen hat (das Modell im Browser), von welchem Foto und wer entschieden hat, zu speichern.

Drei Regeln zum Speichern:

- Das klinische Datum der Messung ist das **Datum der Aufnahme**, nicht der Tag, an dem gespeichert wird;
- Das erneute Speichern desselben Fotos **aktualisiert** den vorhandenen Eintrag, es wird kein zweiter erstellt;
- Eine als „zu wiederholen“ markierte Aufnahme (Kopf gedreht) **kann nicht gespeichert werden**: Ihre Zahlen sind nicht vergleichbar und würden in einer historischen Serie Schaden anrichten.

Ab dem zweiten Speichern zeigt die Seite den Abschnitt **Im Zeitverlauf**: Eine kleine Serie für jede Messung, mit den tatsächlichen Aufnahmedaten, dem neuesten Wert und der Differenz zum ersten. Dies ist der Vergleich des Gesichts mit sich selbst (was diese Seite in den Mittelpunkt stellt), erweitert über das Paar von Fotos hinaus.

## PGAIS aus dem Vergleich dokumentieren

Nach Auswahl zweier Fotos (die erste Auswahl ist die zu untersuchende Aufnahme, die zweite der Vergleich) zeigt der Abschnitt „Was sich verändert hat“ die Unterschiede und die Schaltfläche `PGAIS dokumentieren`. Der PGAIS ist das Urteil des Arztes über das Ergebnis, basierend auf dem **Vergleich der Vorher/Nachher-Fotos**: Die Dokumentation von hier aus bedeutet, auch festzuhalten, welche beiden Aufnahmen betrachtet wurden, ohne Daten zu kopieren.

Die Antwort ist ein Label („Sehr verbessert“, „Verbessert“, …), niemals eine Zahl: Die Nummerierung des GAIS wird in der Literatur in entgegengesetzte Richtungen verwendet, und eine ohne Richtung gespeicherte Zahl wäre später nicht mehr interpretierbar.

## Häufige Fehler

- **Vergleich von Aufnahmen unterschiedlicher Ansichten.** Ein Frontal- und ein 45°-Bild desselben Tages ähneln sich nur dem Namen nach: Der Vergleich gilt nur zwischen homologen Ansichten.
- **Das „Nachher“-Foto zu früh aufnehmen.** Bei nicht resorbiertem Ödem dokumentiert der Vergleich die Schwellung, nicht das Ergebnis.
- **Den Kanon wie ein Zeugnis lesen.** Es handelt sich um einen historischen geometrischen Referenzwert: Die Abweichung ist ein Unterschied zwischen zwei Zahlen, keine Behandlungsempfehlung.

## Häufige Fragen

**Werden die Messungen in der Akte gespeichert?** Nur wenn der Arzt sie speichert, mit der dafür vorgesehenen Schaltfläche: Sie werden bei jedem Öffnen aus dem Foto neu berechnet, und die Kopie in der Akte gibt an, wer gemessen hat und von welchem Foto. Siehe „Messungen in der Akte speichern“.

**Wird das Foto zur Analyse an einen externen Dienst gesendet?** Nein. Das Modell der Referenzpunkte läuft im Browser; das Foto bleibt verschlüsselt im System und wird nur für diejenigen entschlüsselt, die das Recht haben, es zu sehen, wie bei jedem anderen klinischen Foto.

**Warum gibt es keine Gesamtbewertung der Harmonie?** Produktentscheidung: Die Seite liefert alle Messungen; die Synthese und das Urteil bleiben beim Arzt.
