# Ergebnisse, Komplikationen und Notfälle

Diese Anleitung behandelt die drei Dinge, die **nach** einer Sitzung passieren, wenn etwas nicht wie geplant verläuft: den `Notfall`-Modus, die Erfassung einer Komplikation und das Meldeformular für das Ministerium.

⛔ **Keine dieser Bildschirme gibt klinische Hinweise.** Sie schlagen keine Medikamente, Dosierungen oder Verabreichungswege vor, stellen keine diagnostischen Verdachtsmomente auf, bewerten nicht den Schweregrad und vergleichen die Zeit mit keiner Schwelle. Dies ist eine bewusste Entscheidung in der Zweckbestimmung des Produkts, keine fehlende Funktion: In einem Notfall macht jeder Vorschlag diese Software zu einem Medizinprodukt, und was in diesem Moment wirklich fehlt, ist nicht ein Rat, sondern das Protokoll, das niemand schreibt, weil die Hände beschäftigt sind.

## Zuerst: Die Praxis vorbereiten

Zwei Felder in `Einstellungen`, Abschnitt der Praxis, die **vorher** ausgefüllt werden müssen:

- **`Protokoll für Komplikationen (für den Notfallmodus)`**: Das Protokoll der Praxis, ein Schritt pro Zeile. Es ist **dein** Text: Er wird so angezeigt, wie er geschrieben ist, und nicht ergänzt oder korrigiert. Ohne dieses Protokoll zeigt der Notfallmodus die Zeit an und erfasst Notizen, aber keinen klinischen Inhalt.
- **`Notfallmedikament: Verfallsdatum`**: Monat und Jahr. Der richtige Zeitpunkt, um zu bemerken, dass es abgelaufen ist, ist nicht, wenn es benötigt wird. Es wird nicht gefragt, welches Medikament es ist: Das entscheidet die Praxis.

## Der Notfallmodus

Er wird **aus der Zeile der Sitzung** geöffnet, im Tab `Behandlungen` der Patientin oder des Patienten: Dies ist der Moment, in dem die Patientin bereits anwesend ist, und das Suchen eines Menüpunkts in diesem Moment ist Zeitverschwendung. Er erscheint nicht von allein und ist kein Alarm: Man drückt ihn.

Der Bildschirm ist vollflächig, ohne Navigation, und enthält drei Dinge:

1. **`Verstrichene Zeit seit dem Öffnen`**: Eine Stoppuhr, die läuft. Sie ändert nicht die Farbe, zählt nicht rückwärts, ertönt nicht und warnt nicht.
2. **Das Protokoll der Praxis**, ein Schritt pro Zeile, der abgehakt wird, während er ausgeführt wird.
3. **`Was in der Patientenakte festgehalten werden soll`**: Ein freies Feld für das, was dokumentiert bleiben soll.

Wenn das Verfallsdatum des in den Einstellungen registrierten Notfallmedikaments überschritten ist, wird dies auf der Seite angezeigt: `Das in den Praxiseinstellungen registrierte Verfallsdatum ist überschritten`.

⚠️ **Das Netz kann ausfallen, das Protokoll nicht.** Der Startzeitpunkt und die abgehakten Schritte werden im Browser **vor** jedem Serveraufruf gespeichert: Das Neuladen der Seite oder der Verlust der Verbindung setzt die Stoppuhr nicht zurück und verliert das Protokoll nicht. Die Speicherung in der Akte erfolgt beim Schließen, und wenn dies fehlschlägt, bleibt das Protokoll herunterladbar.

Beim Schließen wird der `Schweregrad` ausgewählt, und das Protokoll enthält **die Zeitpunkte, zu denen jeder Schritt markiert wurde**, nicht nachträglich rekonstruierte Zeiten.

`Beenden ohne Schließen` lässt die Sitzung offen: Die Stoppuhr läuft weiter.

## Eine Komplikation erfassen

Aus derselben Zeile der Sitzung heraus die Aktion `Komplikation bei dieser Sitzung erfassen`. Die Komplikation bleibt **mit dieser Behandlung verknüpft**, mit ihrem Produkt und ihrer Charge: Deshalb wird sie von dort aus erfasst und nicht aus einer separaten Liste.

Das Formular fragt nach:

- **der Komplikation**, aus einer geschlossenen Liste von zwölf Punkten: Ekchymose, Ödem, persistierendes Erythem, Knötchen, Granulom, Infektion, Hautnekrose, Gefäßverschluss, Ptosis palpebralis, Asymmetrie, allergische Reaktion und `Sonstiges (in den Notizen beschrieben)`;
- **`Wann du sie beobachtet hast`**. Das Datum **wird nicht** mit heute vorausgefüllt: Eine Komplikation wird oft Tage später bemerkt, und ein bereits ausgefülltes Feld wird von niemandem korrigiert;
- **`Schweregrad`**: leicht, mittel oder schwer. Die Wahl trifft die Ärztin oder der Arzt: Es gibt keine Warnung, die sagt „diese Komplikation ist schwer“;
- **`Was du beobachtet hast`** und **`Was du unternommen hast`** (z. B. Hyaluronidase, Umschläge, Antibiotikum);
- **`Ausgang (falls bereits bekannt)`**, der auf `Noch nicht bekannt` belassen werden kann.

Die erfassten Komplikationen erscheinen **innerhalb der Sitzungsakte**, hervorgehoben: Um zu wissen, wie es ausgegangen ist, muss man nicht an zwei Stellen nachschauen.

⚠️ **Eine als irrtümlich erfasste Sitzung akzeptiert keine Komplikationen.**

## Das Meldeformular für das Ministerium

Neben jeder erfassten Komplikation erscheint der Link **`Meldeformular`**, der den Text für das ministerielle Formular vorbereitet.

Warum es existiert und unter welchen Bedingungen:

- Das **D.M. Gesundheit 1. Juli 2025**, in Kraft seit dem 18. März 2026, setzt Art. 10 des D.Lgs. 137/2022 um und deckt ausdrücklich auch die Geräte des Anhangs XVI der Verordnung (EU) 2017/745 ab, d. h. **dermale Filler**;
- Der **schwere, auch nur vermutete Vorfall** muss *„unverzüglich und spätestens innerhalb von zehn Tagen“* gemeldet werden (Art. 4 Abs. 1); der nicht schwere Vorfall **kann** innerhalb von dreißig Tagen gemeldet werden (Art. 4 Abs. 3);
- Die Pflicht liegt **bei der medizinischen Fachkraft**, und die unterlassene Meldung wird mit 26.000 bis 120.000 Euro sanktioniert.

Bei der Erfassung einer Komplikation erstellt das System eine **Erinnerung** mit der aus diesen Fristen berechneten Fälligkeit, die du unter `Erinnerungen` findest.

Drei Dinge, die diese Funktion **nicht** tut und die man besser vorher weiß:

- ⛔ **Sie übermittelt nichts.** Der Kanal ist das Online-Formular des Ministeriums mit Authentifizierung der Ärztin oder des Arztes (SPID, CIE oder CNS). Hier wird der Inhalt vorbereitet.
- ⛔ **Sie entscheidet nicht, ob der Vorfall schwerwiegend ist**: Sie liest den von dir erfassten Schweregrad und leitet daraus die Frist ab.
- ⛔ **Sie trägt keine Patientendaten ein**, und das ist kein Versehen: Art. 2 Abs. 6 des Dekrets schreibt vor, dass die Meldung *„keine Daten enthalten darf, die die Identifizierung der betroffenen Person ermöglichen“*. Das Vorabausfüllen aus der Akte, was die naheliegende Lösung wäre, würde genau durch das Instrument, das helfen soll, einen Verstoß begehen. Das Formular erhält das Ereignis und das Produkt, nie die Patientin oder den Patienten.

⚠️ **Die Erfassung einer Komplikation ist keine Meldung zur Pharmakovigilanz**, und das Formular weist darauf hin: Es handelt sich um zwei verschiedene Kanäle mit unterschiedlichen Empfängern.

## Häufige Fehler

- **Den Notfallmodus öffnen und nicht schließen.** Das Protokoll wird erst beim Schließen in die Akte geschrieben: Eine offengelassene Sitzung bleibt eine laufende Stoppuhr.
- **Das Protokoll nie hochgeladen.** Ohne dieses ist der Notfallbildschirm eine Stoppuhr und ein Notizfeld. Es wird einmal unter `Einstellungen` ausgefüllt.
- **Die Komplikation bei einer beliebigen Sitzung erfassen.** Sie gehört zur Sitzung, die sie verursacht hat: Diese Verknüpfung bringt Produkt und Charge mit, wenn sie benötigt werden.

## Siehe auch

- [Eine Behandlung erfassen](/manuale/trattamenti)
- [Chargentraceability](/manuale/tracciabilita-lotto)
- [Erinnerungen und Rückrufe](/manuale/promemoria-e-richiami)
