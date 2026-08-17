# Diktieren per Spracheingabe: die Spracherfassung

> ⚠️ **Neu verfasst am 17.08.2026 anhand des Bildschirms.** Die vorherige Version
> beschrieb ein Panel, das nie existiert hat: eine Schaltfläche `Felder extrahieren`, eine
> Zuverlässigkeitsbewertung für jedes Feld mit den Farben grün, gelb und rot,
> drei Schaltflächen `Akzeptieren` / `Bearbeiten` / `Verwerfen` pro Zeile, ein
> Abschnitt `Einstellungen > Diktat` mit der Stille-Schwelle und der Speicherung der
> Transkriptionen. Nichts davon ist im Produkt enthalten. Das Folgende schon.

Die Spracherfassung transkribiert, was du sagst, und schlägt – wo das Formular es vorsieht – bereits ausgefüllte Felder vor. **Sie trägt niemals selbstständig in die Akte ein**: Zwischen der Stimme und dem gespeicherten Datum stehen immer eine Überprüfung und eine von dir gedrückte Schaltfläche.

## Wo man diktiert

Die Schaltfläche erscheint an drei Stellen, jeweils mit einem anderen Label, weil *„was diktiert wird“* vom Ort abhängt:

- **`Anamnese diktieren`**, im Tab `Anamnese` der Akte;
- **`Sitzung diktieren`**, im Behandlungsmodul neben den Notizen;
- in der **klinischen Bewertung**, wenn die Praxis dieses Modul aktiviert hat.

Im Ruhezustand ist es eine einzelne Zeile: eine Schaltfläche und ein Satz. Das Feld erscheint, wenn etwas darin steht.

## Voraussetzungen

- Konto mit der Rolle `Ärztin, Arzt oder medizinische Fachkraft` und klinischem Zugriff auf die Patientin oder den Patienten.
- Funktionierendes Mikrofon und vom Browser erteilte Berechtigung. Die Qualität der
  Transkription hängt mehr vom Umgebungslärm ab als vom Mikrofon.
- Internetverbindung: Die Transkription erfolgt über einen Dienst, nicht im Browser.

## Schritt 1: Diktieren

Drücke die Schaltfläche. Es erscheint ein roter Punkt und die Meldung `Ich höre zu`, und darunter, in `Transkription`, erscheint der Text, während du sprichst: *„Sprich einfach: Der Text erscheint hier, während du sprichst.“*

Zwei Schaltflächen: **`Fertig`** beendet die Spracherfassung und wechselt zur Überprüfung,
**`Abbrechen`** verwirft sie.

## Schritt 2: Überprüfen

Am Ende erscheint der transkribierte Text in einem **bearbeitbaren** Bereich, unter einem Hinweis, den es sich lohnt, einmal zu lesen:

> Überprüfe vor der Verwendung. Die automatische Transkription macht vor allem bei
> Arzneimitteln, Dosierungen und Fachbegriffen Fehler: korrigiere hier unten.

Wenn das Formular die Extraktion von Feldern vorsieht, erscheint neben dem Hinweis die
**Zuverlässigkeit der Extraktion** in Prozent. Es handelt sich um eine einzige Zahl für die gesamte Extraktion, nicht um eine pro Feld, und sie ist ein technischer Indikator: Sie gibt an, wie klar das Modell den Text gefunden hat, nicht wie korrekt das ist, was du gesagt hast.

## Schritt 3: Was damit tun

Drei Schaltflächen, die unterschiedliche Dinge bewirken:

- **`Verwerfen`**: verwirft die Transkription.
- **`Text verwenden`**: übernimmt den Text so, wie er ist, und fügt ihn in das Zielfeld ein
  (z. B. am Ende der Sitzungsnotizen). Erscheint nur dort, wo dieser Text ein Ziel hat:
  ansonsten wäre es eine Schaltfläche, die nur löscht, und sie wurde entfernt.
- **die Anwendungsschaltfläche** (`Für die Akte vorschlagen` in der Anamnese,
  `Felder ausfüllen` in der Behandlung): übernimmt die **erkannten Felder** und fügt sie
  in das Formular ein, wo sie bearbeitbar bleiben. Erscheint nur, wenn die Extraktion
  etwas ergeben hat.

⚠️ **Auch nach dem Anwenden der Felder ist das Speichern eine separate Handlung.**
Anwenden füllt das Formular aus; in die Akte gelangt das, was du speicherst.

## Was die Spracherfassung ausfüllt und was nicht

Hier scheitern die Erwartungen am häufigsten, daher ist die Realität wichtiger als das Versprechen.

**In der Behandlung** werden Produkt, Menge, Charge, Off-Label-Anwendung und deren Begründung vorgeschlagen. **Nicht** ausgefüllt werden die Geräteparameter
(Wellenlänge, Fluenz, Spot, Frequenz, Impulsdauer, Durchgänge, Kühlung, Endpunkt), noch die Verdünnung, die UDI oder das Verfallsdatum der Charge:
diese müssen von Hand eingetragen werden.

**Die diktierten Zonen werden nicht als Punkte auf der Karte markiert.** Sie landen am Ende der Notizen in der Form `[diktierte Bereiche: …]`, zusammen mit dem eventuellen `[vorgeschlagene Kategorie: …]`, weil das Markieren eines Bereichs dessen exakten Code erfordert. Um sie auf die Karte zu übertragen, gibt es die Schaltfläche `Bereiche automatisch aus dem Text extrahieren`: siehe
[Die behandelten Bereiche](/manuale/body-map).

⚠️ **Die Spracherfassung funktioniert auf Italienisch.** Selbst bei englischer Oberfläche arbeiten Spracherkennung und Extraktion auf Italienisch.

## Klinische Verantwortung

Das Prinzip ist nicht verhandelbar: **Das System trägt nichts in die Akte ein, ohne eine ausdrückliche Handlung des Arztes.** Jeder transkribierte Text und jedes vorgeschlagene Feld erfordern eine Überprüfung und eine bestätigende Handlung. Die Verantwortung für die korrekte Ausfüllung bleibt bei der Person, die die Akte unterzeichnet.

## Datenschutz des Audioflusses

Die Audiodaten werden an den Transkriptionsdienst (Mistral, Europäische Union) gesendet und **weder von uns noch von ihnen über die Verarbeitungszeit hinaus gespeichert**; die über die API gesendeten Inhalte werden nicht zum Trainieren von Modellen verwendet.

Wenn du für eine Visite die Spracherfassung nicht nutzen möchtest, wird die Akte von Hand ausgefüllt: Es bleibt keine Audiospur irgendwo erhalten.

## Tipps

- **Sprich in natürlichem Tempo**, ohne zu betonen: Das Modell ist auf spontanes italienisches Sprechen kalibriert, und langsameres Sprechen verschlechtert das Ergebnis.
- **Keine Sprachbefehle** wie „Punkt“ oder „neue Zeile“: Die Zeichensetzung wird automatisch eingefügt.
- **Arzneimittel vollständig angeben**, Wirkstoff und Dosis: „Pantoprazol vierzig Milligramm eine Tablette morgens“.
- **Eine Stimme nach der anderen.** Wenn die Patientin oder der Patient gleichzeitig mit dir spricht, verschlechtert sich die Transkription.
- **Lies Zahlen immer noch einmal.** Dosierungen und Chargen sind genau das, woran die Transkription am häufigsten scheitert, und es ist auch das, was am meisten zählt.

## Problembehebung

**Das Mikrofon wird nicht erkannt.** Überprüfe die Berechtigung im Browser (in
Chrome das Schloss links neben der Adresse, Punkt `Mikrofon`) und die
Systemeinstellungen: Ein auf Systemebene deaktiviertes Mikrofon ist für den Browser nicht zugänglich.

**Unter der Schaltfläche erscheint eine rote Fehlermeldung.** Die Meldung gibt die Ursache an: Meistens handelt es sich um eine verweigerte Berechtigung oder den nicht erreichbaren Transkriptionsdienst.

**Die Transkription kommt an, aber es werden keine Felder vorgeschlagen.** Die Anwendungsschaltfläche erscheint nur, wenn die Extraktion etwas erkannt hat. Du kannst trotzdem `Text verwenden` nutzen und von Hand korrigieren.

**Ich habe die Bereiche diktiert und die Karte ist leer.** Das ist das vorgesehene Verhalten: siehe oben, „Was die Spracherfassung ausfüllt und was nicht“.

## Siehe auch

- [Erstellung und Verwaltung der Patientenanamnese](/manuale/anagrafica-paziente)
- [Die behandelten Bereiche: auf dem Foto und im 3D-Modell](/manuale/body-map)
- [Eine Behandlung erfassen](/manuale/trattamenti)
- [Zugriffsprotokoll und Rückverfolgbarkeit der Zugriffe](/manuale/audit-log)

Letzte Aktualisierung: {ULTIMA_REVISIONE}
