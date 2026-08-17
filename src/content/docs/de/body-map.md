# Die behandelten Bereiche: auf dem Foto und im 3D-Modell

> ⚠️ **Am 17.08.2026 anhand des Bildschirms überarbeitet.** Die vorherige Version
> beschrieb eine Zusammenfassungstabelle mit Drag-and-Drop-Neuanordnung, Tastaturkürzeln,
> einer Schaltfläche **«Importiere von vorherigem Besuch»** und **«Füge benutzerdefiniertes Produkt ein»**:
> **keine dieser Funktionen existiert**, und das ist der schlimmste Fehler, den ein Handbuch haben kann,
> denn wer es liest, sucht den Knopf und kommt zu dem Schluss, dass das Produkt defekt ist.
> Wenn du hier etwas findest, das auf dem Bildschirm nicht vorhanden ist, melde es.

Innerhalb einer Sitzung werden die behandelten Bereiche auf einem Bild markiert, statt sie
textuell zu beschreiben: Jeder Punkt ist ein **nummerierter roter Punkt**, und die Liste der Bereiche
wird automatisch erstellt, während du sie setzt.

Es gibt **zwei Oberflächen**, die zwei Möglichkeiten darstellen, dieselben Bereiche zu kennzeichnen:

| Auswahl | Wie markiert wird | Was angezeigt wird |
|---|---|---|
| `Foto` | Ein Klick auf das Porträt | Frontalporträt, Mann oder Frau: 76 Gesichtsbereiche |
| `3D` | Doppelklick auf das Modell | Der gesamte Körper, **Gesicht eingeschlossen**, Mann oder Frau |

⚠️ **Bis zum 17. August 2026 gab es auch eine Auswahl zwischen `Gesicht` und `Körper`, die entfernt wurde**:
«verwirrt nur». Das dreidimensionale Modell ist **eines**, mit der Gesichtshülle darüber:
Man klickt dort, wo behandelt wurde, ob Kopf oder Knöchel.
Das Foto bleibt, weil es im Frontalgesicht schneller ist als jedes 3D.

## Voraussetzungen

- Konto mit der Rolle `Ärztin, Arzt oder medizinische Fachkraft` und klinischem Zugriff auf die Patientin oder den Patienten.
- Eine geöffnete Sitzung: Das Modul `Neue Behandlung` auf der Registerkarte `Behandlungen`
  der Akte.

## Schritt 1: Oberfläche auswählen

Im Behandlungsmodul unter dem Punkt `Body-Map und behandelte Bereiche` zwei Schaltflächen:
`Foto` und `3D`.

Das **Geschlecht des Modells** (`Frau` / `Mann`) ist **nur eines** und gilt für beide:
Es auf dem Porträt auszuwählen und es dann im 3D wiederzufinden, wäre dieselbe Frage zweimal gestellt.
Auf dem Porträt ändert das Geschlecht auch **die Position der Punkte**, weil die beiden Gesichter
unterschiedliche Proportionen haben.

⚠️ Der Geschlechtsselektor erscheint nur, wenn das entsprechende Modell auf dem Server verfügbar ist.
Die in der Akte registrierten Bereiche **hängen nicht davon ab, welches Modell du gerade betrachtest**:
Die Codes der Regionen sind dieselben.

## Schritt 2: Einen Punkt setzen

- **Auf dem Porträt**: Ein Klick auf die behandelte Stelle.
- **Auf dem 3D-Modell**: **Doppelklick**. Der Doppelklick dient dazu, die Markierung von der Drehung zu unterscheiden:
  Man zieht, um zu drehen, nutzt das Mausrad, um heranzuzoomen, und ein einfacher Klick darf nicht versehentlich etwas markieren.
  Ein zweiter Doppelklick auf denselben Punkt entfernt ihn.
- Die Schaltfläche `Zentrieren` setzt das Modell in die Ausgangsposition zurück.
- Auf dem Porträt vergrößert `Vollbild öffnen` das Bild, wenn die Punkte dicht beieinander liegen.

Im 3D bleibt der Punkt **dort, wo du geklickt hast**, nicht in der Mitte des Bereichs:
Auf einem Oberschenkel läge die Mitte des Bereichs zwanzig Zentimeter weiter weg.
Das Modell öffnet sich mit der gesamten Figur: Für Gesichtsbereiche zoomt man mit dem Mausrad heran.

⚠️ **Die genauen Punkte gelten für das Modell, auf dem du sie gesetzt hast.**
Die beiden Körper sind nicht derselbe Körper: Beim Wechsel von Mann zu Frau existiert der genaue Punkt nicht,
und der Punkt wird in die Mitte des Bereichs gesetzt, was bei diesem Modell immer korrekt ist.
Die registrierten Bereiche ändern sich nicht.

## Schritt 3: Was auf einen Punkt geschrieben wird

Auf dem Porträt öffnet der Punkt ein kleines Fenster mit zwei Hauptfeldern:

- **Behandlung**, Freitext (z. B. «Hyaluronsäure-Filler», «Botox»);
- **Menge**, Freitext mit Einheit (z. B. «0,5 ml», «25 U»).

Darunter der Abschnitt **Wie durchgeführt**, standardmäßig geschlossen und **fakultativ**, mit vier Dropdown-Menüs mit geschlossenem Vokabular:

- `Instrument`: Nadel, Kanüle, Mikronadeln oder Roller, anderes;
- `Kaliber`: von 18G, dem dicksten, bis 34G, dem dünnsten;
- `Ebene`: supraperiostal, subgaleal, subfaszial, subkutan, tief dermal, oberflächlich dermal;
- `Technik`: Bolus, Mikrobolus, retrograd, anterograd, fächerförmig, linear.

Dies ist kein dokumentarischer Luxus: Die Verordnung (EU) 2022/2346, Anhang §3.1 Buchstabe j,
verlangt die Dokumentation der Injektionstechnik, der Instrumente und der maximalen injizierten Menge
in Abhängigkeit von Sitz und Technik. Die vier Dropdown-Menüs ermöglichen die Beantwortung.

⛔ **Keines der Dropdown-Menüs schlägt den richtigen Wert für die Zone vor**: Sie empfehlen keine Ebene,
warnen nicht, wenn eine Kombination ungewöhnlich ist. Die Tabellen pro Zone existieren in der Literatur
und bleiben außerhalb der Software, da sie eine klinische Empfehlung wären.

⚠️ Ein Punkt ohne diese vier Felder bleibt gültig: Alle vor dem 15. August 2026 vorgenommenen Anmerkungen
enthalten sie nicht.

## Schritt 4: Die Liste der Bereiche wird automatisch erstellt

Die Punkte und die Liste `Behandelte Bereiche` unter der Karte sind **dasselbe in zwei Ansichten**:

- Setzt du einen Punkt, wird der Bereich in die Liste aufgenommen;
- Wählst du einen Bereich aus der Liste, erscheint der Punkt auf der Karte;
- Entfernst du den einen, verschwindet der andere.

Dies gilt auch **zwischen den Oberflächen**: Ein auf dem 3D-Modell markierter Bereich hat bereits seinen Punkt,
wenn du zum Porträt zurückkehrst.

## Schritt 5: Die diktierten und die textuell erfassten Bereiche

Zwei Tools übertragen die Bereiche, die du textuell (oder per Diktat) erfasst hast, auf die Karte,
und **beide erfordern eine Handlung von dir**: Nichts wird automatisch in die Akte übernommen.

- **`Aus dem Text erkannte Bereiche:`** erscheint unter dem Notizfeld während des Schreibens.
  Es handelt sich um eine Schlüsselworterkennung ohne Sprachmodell: Es werden Etiketten vorgeschlagen,
  und du fügst die richtigen hinzu.
- **`Bereiche automatisch aus Text extrahieren`** sendet den Notiztext an den Extraktionsdienst,
  der mit bereits getrennten Bereichen, Produkt und Menge antwortet, und die Bereiche **werden zu den vorhandenen Punkten hinzugefügt**,
  statt sie zu ersetzen.

⚠️ **Die Diktierfunktion allein färbt die Karte nicht ein.** `Sitzung diktieren` füllt Produkt, Menge, Charge und Off-Label,
aber die erkannten Zonen werden am Ende der Notizen in der Form `[diktierte Bereiche: …]` geschrieben,
weil ihre Markierung den genauen Code des Bereichs erfordert. Die beiden oben genannten Tools verwandeln sie in Punkte:
Das zu wissen, verhindert, dass man nach Markierungen sucht, die niemand gesetzt hat.

## Schritt 6: Off-Label-Anwendung

`Off-Label-Anwendung` ist ein Häkchen auf der Behandlungsseite, nicht beim einzelnen Punkt,
und wenn es aktiviert ist, wird nach der `Begründung für Off-Label` gefragt.
Das Feld existiert, weil in der ästhetischen Medizin die Anwendung außerhalb der Zulassung häufig und legitim ist,
**sofern dokumentiert**: Die Begründung ist das, was schriftlich bleibt.

Siehe die Anleitung [Eine Behandlung registrieren](/manuale/trattamenti) für Charge,
Verfallsdatum, Geräteparameter und Rückruf.

## Was das 3D-Modell nicht kann

- **Am Körper färben sich die Bereiche nicht grün**, und das ist kein Versehen:
  Die Grenzen der Regionen entstehen durch eine Aufteilung in knöcherne Koordinaten und schneiden gerade dort,
  wo die Anatomie gekrümmt ist. Sie mit Farbe zu füllen, hätte diesen Fehler statt der Sitzung gezeigt.
  Das Zeichen ist der Punkt.
- **Die Regionen sind nicht alle die des Modells.** Die Liste enthält die Zonen,
  die in der ästhetischen Medizin tatsächlich behandelt werden, gruppiert in Hals, Dekolleté,
  Arme, Hände, Bauch, Rücken, Gesäß, Oberschenkel und Beine. Fuß, Nägel,
  Ohrmuschel und Intimbereiche existieren im anatomischen Modell und **sind nicht in der klinischen Liste enthalten**:
  Eine Liste, die alles enthält, ist eine Liste, in der man nichts findet.
- **Durch Klicken außerhalb dieser Regionen wird nichts zugewiesen**, und die Seite zeigt es an:
  Sie zeigt den technischen Namen des getroffenen Punkts an, sodass klar ist, dass der Klick angekommen ist,
  aber diese Zone nicht registriert wird.
- **Die rechte oder linke Seite ergibt sich aus dem Klick, nicht aus dem Namen.**
  Im anatomischen Modell ist «vorderer Armbereich» ein einziger Name für zwei Arme:
  Die Position des Punkts entscheidet über die Seite.
- **Es ist nicht der Atlas.** Um dem Patienten Knochen, Muskeln oder Gefäße zu zeigen,
  wird die Seite [3D-Anatomie-Atlas](/manuale/anatomia) verwendet, die nichts registriert.

## Die aggregierte Karte in der Registerkarte Behandlungen

Außerhalb der Sitzung enthält die Registerkarte `Behandlungen` der Akte eine `Behandlungskarte`,
die **die gesamte Historie der Patientin oder des Patienten** zusammenfasst:
Jeder Bereich zeigt **wie oft** er behandelt wurde, und die Farbe gibt die **vorherrschende Produktkategorie**
in diesem Bereich an. Die Legende befindet sich auf der Seite unter `Legende Kategorien`.

Durch Klicken auf einen Bereich wird die Zeitleiste darunter auf diese Zone gefiltert;
`Filter entfernen` zeigt wieder alles an. Die Seite weist auch auf ein `Erkanntes Ungleichgewicht links/rechts` hin,
wenn die Zählungen zwischen den beiden Seiten abweichen, und `Vollständiges Modell öffnen` führt zum Atlas.

⚠️ **Die Zahl ist nicht die Produktmenge**: Es ist die Anzahl der auf diesem Bereich registrierten Behandlungen.
Auf dieser Karte gibt es keinen Zeitraumselektor: Sie zeigt die gesamte Historie.

## Daten exportieren

Von der Registerkarte `Behandlungen`: `PDF exportieren` erstellt die Zusammenfassung der Behandlungen,
`CSV exportieren` dasselbe in Tabellenform. Die Unterlagen der **einzelnen Sitzung** werden dagegen
aus der Sitzungszeile heruntergeladen und sind in [Eine Behandlung registrieren](/manuale/trattamenti) beschrieben.

## Problembehebung

**Das 3D-Modell wird nicht angezeigt.** Es wird beim ersten Öffnen heruntergeladen und ist schwer:
Bei langsamer Verbindung dauert es einige Sekunden. Bleibt es leer, lade die Seite neu:
Die Modelle werden ohne Cache bereitgestellt, daher reicht ein Neuladen aus, um sie erneut zu laden.

**Ich habe doppelt geklickt und nichts ist passiert.** Wenn der getroffene Punkt außerhalb der von uns registrierten
Regionen liegt, erscheint die Meldung mit dem technischen Namen der Zone: Versuche es mehr zur Mitte,
oder wähle den Bereich aus der Liste.

**Der Punkt liegt auf dem Porträt an der falschen Stelle.** Ziehe ihn: Die Position wird aktualisiert.
Im 3D wird er mit einem zweiten Doppelklick entfernt und dort wieder gesetzt, wo er benötigt wird.

**Ich habe das Geschlecht des Modells geändert und die Punkte haben sich verschoben.**
Die beiden Körper haben unterschiedliche Koordinaten: Auf dem anderen Modell existiert der genaue Punkt nicht,
und der Punkt kehrt in die Mitte des Bereichs zurück. **Die Bereiche in der Akte bleiben** identisch.

## Siehe auch

- [Eine Behandlung registrieren](/manuale/trattamenti)
- [3D-Anatomie-Atlas](/manuale/anatomia)
- [Anamnese mit KI-Diktat ausfüllen](/manuale/anamnesi-dettatura)
- [Ergebnisse und Komplikationen](/manuale/esiti-e-complicanze)

Letzte Aktualisierung: {ULTIMA_REVISIONE}
