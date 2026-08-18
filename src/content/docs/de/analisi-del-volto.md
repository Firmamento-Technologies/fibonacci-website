# Gesichtsanalyse

Diese Anleitung beschreibt die Seite **„Gesichtsanalyse“**: den **direkten Vergleich zwischen zwei Fotos** (vorher/nachher), die **dreidimensionale Ansicht** des Gesichts, den **Live-Spiegel** und die Erfassung des **klinischen Urteils (PGAIS)** zum Vergleich.

Die Seite **misst nicht**. Sie berechnet keine Winkel, Verhältnisse, Abweichungen oder Punktwerte, speichert diese nicht in der Akte und vergleicht sie mit keinen Referenzwerten: Sie zeigt die Fotos und die Gesichtsform, und das Urteil bleibt beim Arzt.

## Voraussetzungen

- Konto mit Rolle `medico` oder `admin studio`.
- Mindestens ein frontales Gesichtsbild in der Akte (siehe Anleitung „Klinische Fotos und Vorher/Nachher-Vergleich“).

## Wo finde ich die Funktion

Die Schaltfläche `Gesichtsanalyse` befindet sich in der oberen Leiste der Patientenakte, neben `Daten und Personen` und dem Menü `Exportieren`, und ist von jeder Registerkarte aus sichtbar.

## Der Vorher/Nachher-Vergleich

Der erste Klick wählt das zu prüfende Foto aus, der zweite auf ein anderes Foto fügt den Vergleich hinzu: Die beiden Karten werden nebeneinander angezeigt und gemeinsam betrachtet. Dies ist die zentrale Funktion der Seite.

Über jedem Foto weist die Seite darauf hin, wenn die **Aufnahme nicht vergleichbar ist**: Eine andere Haltung (angehobenes Kinn, gedrehter Kopf) verändert, was zu sehen ist, und zwei unterschiedliche Haltungen lassen sich nicht vergleichen. Die Warnung blockiert nichts: Sie informiert, bevor jemand eine Schlussfolgerung zieht.

## Die 3D-Ansicht

Der Schalter `Foto | 3D` zeigt die aus den Referenzpunkten rekonstruierte Gesichtsform, die navigierbar ist (*„Ziehen, um zu drehen, Scrollrad, um zu zoomen“*), als Oberfläche, Gitter oder **`Relief`**, das die Oberfläche nach Tiefe einfärbt, statt die Haut nachzuahmen: So lassen sich Volumenasymmetrien mit bloßem Auge erkennen. Auch die Referenzpunkte sind sichtbar, alle 468.

**Es handelt sich nicht um einen Scan**: Die Tiefe wird aus einem einzigen Foto geschätzt und ist relativ. Sie dient dazu, die Form zu betrachten und dem Patienten zu zeigen, **nicht** zur Messung von Vorsprüngen oder Volumina. Für Volumina und Oberflächenkarten ist Stereofotogrammetrie-Hardware erforderlich, die diese Seite nicht ersetzen soll.

## Das Gitter über dem Foto

Die Schaltfläche `Gitter` überlagert dem Foto das Gitter der Referenzpunkte: Es zeigt, **wie die Software die Gesichtsform erkennt**. Es handelt sich nicht um eine Messung oder ein Urteil; es bleibt zwischen den Fotos aktiviert, weil diejenigen, die es nutzen, es immer verwenden.

## Der Live-Spiegel

`Live-Spiegel` aktiviert die Kamera und zeigt dem Patienten sein Gesicht in Echtzeit mit der Aufforderung `Gesicht einrahmen`. **Es wird nichts gemessen oder aufgezeichnet**, und die Kamera *„ist ausgeschaltet. Sie wird nur aktiviert, wenn du es verlangst“*: Sie dient während des Gesprächs, um über eine Zone zu sprechen, während man sie gemeinsam betrachtet.

## Die Fotoserie nach Ansicht

Das klinische Fotoprotokoll besteht aus einer Reihe von Aufnahmen aus definierten Ansichten (frontal, lateral, schräg bei 45°, plus dynamische Aufnahmen für die Mimik), die bei jedem Besuch gleich wiederholt werden. Daher kann jedes Foto beim Hochladen die **Ansicht** angeben; die Registerkarte `Fotos` zeigt die Serie des letzten Besuchs und gibt an, welche Ansichten fehlen.

Drei Regeln zur Serie:

- Die Ansicht ist **fakultativ**: Fotos, die vor dieser Funktion hochgeladen wurden, haben keine Angabe, und „nicht angegeben“ bleibt anders als „frontal“. Das System füllt das Feld nie automatisch aus;
- Die Checkliste **informiert und blockiert nicht**: Aufnahmen außerhalb der Serie sind zulässig;
- Wenn mit der Kamera eine Ansicht ausgewählt wird, erscheint die **vorherige Aufnahme derselben Ansicht transparent im Sucher**: Das Gesicht mit dem „Geistbild“ zu überlagern, ist die praktische Methode, um Ausrichtung und Abstand zu wiederholen.

Die Seite arbeitet mit frontalen Aufnahmen (und solchen ohne angegebene Ansicht); wenn andere Aufnahmen ausgeschlossen sind, wird angegeben, wie viele.

## PGAIS aus dem Vergleich erfassen

Nach Auswahl zweier Fotos erscheint die Schaltfläche `PGAIS erfassen`. Der PGAIS ist das Urteil des Arztes über das Ergebnis, basierend auf dem **Vergleich der Vorher/Nachher-Fotos**: Die Erfassung hier bedeutet, dass auch festgehalten wird, welche beiden Aufnahmen betrachtet wurden, ohne Daten erneut einzutragen.

Die Antwort ist ein Label („Sehr verbessert“, „Verbessert“, …), nie eine Zahl: Die Nummerierung des GAIS wird in der Literatur in entgegengesetzte Richtungen verwendet, und eine gespeicherte Zahl wäre ohne Angabe der Richtung später nicht mehr interpretierbar.

## Häufige Fehler

- **Vergleich von Aufnahmen unterschiedlicher Ansichten.** Ein Frontal- und ein 45°-Foto desselben Tages ähneln sich nur dem Namen nach: Der Vergleich ist nur zwischen homologen Ansichten gültig.
- **Das „Nachher“-Foto zu früh aufnehmen.** Bei noch nicht resorbierter Schwellung dokumentiert der Vergleich die Schwellung, nicht das Ergebnis.
- **Die 3D-Ansicht als Messung interpretieren.** Es handelt sich um eine Darstellung der Form, die aus einem Foto abgeleitet wird: Sie dient zum Betrachten und Zeigen, nicht zur Quantifizierung.

## Häufige Fragen

**Speichert die Seite etwas in der Akte?** Nur den PGAIS, also das Urteil des Arztes, zusammen mit den beiden Aufnahmen, auf die es sich bezieht. Die 3D-Form und das Gitter werden bei jedem Öffnen neu aus dem Foto berechnet und nicht gespeichert.

**Wird die Analyse an einen externen Dienst gesendet?** Nein. Das Modell der Referenzpunkte läuft im Browser; das Foto bleibt verschlüsselt im System und wird nur für Berechtigte entschlüsselt, wie jedes andere klinische Foto.

**Warum gibt es keine Gesichtsmaße?** Produktentscheidung. Eine klinische Zahl ist nur mit ihrer deklarierten Genauigkeit und jemandem, der für diese Genauigkeit verantwortlich ist, sinnvoll: Solange das nicht gegeben ist, zeigt die Seite die Fotos und die Form und überlässt dem Arzt die Messung und das Urteil.
