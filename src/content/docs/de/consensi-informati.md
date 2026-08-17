# Erstellung und Unterzeichnung von Einwilligungserklärungen im PDF-Format

Diese Anleitung beschreibt, wie du mit dem **KI-Assistenten von Fibonacci** strukturierte Entwürfe für Einwilligungserklärungen gemäß **Gesetz 219/2017** erstellst, Abschnitt für Abschnitt validierst und die grafometrische Unterschrift der Patientin oder des Patienten im normgerechten PDF/A-3b-Format sammelst. Sie richtet sich an Ärztinnen und Ärzte der ästhetischen Medizin und plastischen Chirurgie, die in Italien tätig sind.

Fibonacci verteilt keine Modelle von Drittanbietern. Das System kombiniert zwei Quellen:

1. **Über 100 proprietäre Fibonacci-Modelle v0.1 (zu validierende Entwürfe)** für die häufigsten Verfahren der injektiven und nicht-chirurgischen ästhetischen Medizin, plastischen Gesichtschirurgie und Körperchirurgie sowie Follow-ups.
2. **Generativer KI-Assistent** für maßgeschneiderte Einwilligungen zu jedem Behandlungstyp außerhalb des Katalogs, basierend auf einer Bibliothek von **72 juristischen Klauseln, die aus Quellen der italienischen öffentlichen Verwaltung** (regionale Akte, ASL, Krankenhausunternehmen) extrahiert wurden und gemäß Gesetz 633/1941 Art. 5 öffentlich zugänglich sind.

Alle Ausgaben werden durch drei Anti-Halluzinations-Schichten validiert (siehe Schritt 4) und mit einem fortgeschrittenen elektronischen Siegel archiviert. Jeder Schritt bleibt im `Zugriffsprotokoll` dokumentiert.

## Voraussetzungen

- Konto mit der Rolle `Ärztin, Arzt oder medizinische Fachkraft` oder `Administration`.
- Vollständige Patientendaten mit mindestens Vorname, Nachname, Steuercode und Geburtsdatum.
- Ärztliches Praxisprofil mit Identifikationsdaten und Ordnungsnummer (überprüfen unter `Einstellungen` → `Daten der Praxis und des Arztes`).
- Für die grafometrische Unterschrift: ein Tablet oder Touch-Gerät, auf dem die Patientin oder der Patient unterschreiben kann, sowie ein Ausweisdokument der Patientin oder des Patienten zur vorherigen Überprüfung.

## Schritt 1, Öffnen des Einwilligungsmoduls

Über die Visitenkarte der Patientin oder des Patienten öffnet der Tab `Einwilligungen` das Verwaltungsfenster. Der Bildschirm zeigt:

- in der linken Spalte die Liste der bereits für die Patientin oder den Patienten generierten Einwilligungen mit den Status `Entwurf`, `Gesendet`, `Unterzeichnet`, `Widerrufen`;
- in der rechten Spalte die Schaltfläche `Neue Einwilligung`, die den KI-Assistenten öffnet.

Bereits unterzeichnete Einwilligungen bleiben nur lesbar. Die Erstellung einer neuen Einwilligung überschreibt oder ändert keine vorherigen: Jede Einwilligung bleibt ein eigenständiges Dokument mit einer eigenen, nicht veränderbaren Spur.

Alternativ gelangst du über das Menü `Einwilligungen` → `Katalog` zu den über 100 proprietären Fibonacci-Modellen, die zum Download als PDF bereitstehen (automatisch mit den Praxis- und Arztdaten ausgefüllt). Sie sind nützlich als Referenz oder für schnelle Ausdrucke ohne aktive Patientin oder aktiven Patienten.

## Schritt 2, KI-Assistent in 4 Schritten

Die Schaltfläche `Neue Einwilligung` öffnet den Assistenten in 4 Schritten.

**Schritt 1 · Auswahl des Verfahrens**: Der Katalog listet die verfügbaren Verfahren nach Kategorie auf (injektive ästhetische Medizin, nicht-chirurgische Verfahren, Follow-up). Du kannst nach Namen suchen oder mit einer freien Beschreibung der Behandlung beginnen.

**Schritt 2 · Klinische Parameter**: Voreingestellte Felder für Technik, Materialien (z. B. Filler-Typ, Charge, Lasergerät), spezifische bekannte Risiken des Verfahrens, therapeutische Alternativen und Anmerkungen. Je mehr Details du eingibst, desto höher ist der Vertrauenswert im nächsten Schritt.

**Schritt 3 · KI-Generierung**: Das System ruft das konfigurierte Sprachmodell auf und erstellt in 10–15 Sekunden den Entwurf der 8 Pflichtabschnitte gemäß Gesetz 219/2017:

1. Identifikation der Patientin oder des Patienten und Kontext der Leistung
2. Klinische Beschreibung des Verfahrens
3. Erwartete Vorteile
4. Dokumentierte Risiken und realistische Wahrscheinlichkeiten
5. Therapeutische Alternativen (einschließlich Verzicht)
6. Folgen der Ablehnung
7. Erklärung des Verständnisses durch die Patientin oder den Patienten
8. Unterschrift und Bestätigung

Unter der Ausgabe erhältst du das Feld `Automatische Validierung` (Schritt 4).

**Schritt 4 · Ärztliche Überprüfung + Unterschrift**: Im letzten Schritt prüfst du jeden der 8 Abschnitte nach dem Durchlesen und sammelst die grafometrische Unterschrift der Patientin oder des Patienten. Die Schaltfläche `Speichern und senden` bleibt deaktiviert, bis du alle 8 Abschnitte bestätigt hast.

## Schritt 3, Klinische Parameter und Anpassung

Der Editor des Assistenten in Schritt 2 zeigt folgende ausgefüllte oder vorgeschlagene Felder:

- **Stammdaten**: Vorname, Nachname, Steuercode, Geburtsdatum der Patientin oder des Patienten (automatisch ausgefüllt).
- **Praxis**: Bezeichnung, MwSt.-Nr., Adresse, Telefon, PEC (automatisch aus den `Einstellungen` übernommen).
- **Ausführende Ärztin oder ausführender Arzt**: Name, Berufsordnung, Registrierungsnummer (automatisch ausgefüllt).
- **Datum der Leistung**: Typischerweise heute oder das Datum des verbundenen Termins.
- **Technik**: Beschreibung der Methode (z. B. "intradermale Injektion mit 25G-Kanüle im Lippenrotbereich, Patientin oder Patient sitzend, topische Anästhesie EMLA 30 min").
- **Materialien**: Verwendete Produkte mit rückverfolgbaren Chargen.
- **Bekannte Risiken**: Spezifische Risiken dieses Verfahrens mit Wahrscheinlichkeiten (z. B. "Hämatome 5–10 %, Ödem 48 h, Asymmetrie <2 %, Ischämie selten").
- **Alternativen**: Vernünftige alternative Optionen (einschließlich "Verzicht auf Behandlung").
- **Freie Anmerkungen**: Eventuelle klinische Bedingungen der Patientin oder des Patienten, die die Einwilligung beeinflussen (Allergien, gerinnungshemmende Therapien).

Der Detailgrad, den du hier eingibst, steuert die KI: reichhaltige Eingabe → reichhaltige Ausgabe mit präzisen Zitaten. Knappe Eingabe → generische Ausgabe, die als `review_obbligatoria` markiert werden muss.

## Schritt 4, Anti-Halluzinations-Validierer

Bevor die Einwilligung der Ärztin oder dem Arzt angezeigt wird, führt das System drei Validierer nacheinander aus:

**Validierer #1 · Blacklist verbotener Begriffe**: Das Backend lehnt automatisch jede Ausgabe ab, die Folgendes enthält:

- Namen von Marken oder Abkürzungen von Drittunternehmen des Sektors (Urheberrechtsschutz);
- irreführende Aussagen wie "garantiertes Ergebnis", "100 % sicher", "garantierte Heilung", "keine Komplikationen", "ich bestätige, dass", "ohne jegliches Risiko".

Bei einem Treffer wird die Ausgabe nie angezeigt und das System generiert mit einem verstärkten Prompt neu.

**Validierer #2 · Zitierprüfung**: Überprüft, ob der Text die erforderlichen normativen Verweise enthält (`L. 219/2017`, `Kassationsgericht`, `GDPR`). Fehlen diese, wird eine Warnung ausgegeben, aber nicht blockiert: Die Ärztin oder der Arzt kann bewusst fortfahren.

**Validierer #3 · Vertrauensbewertung pro Abschnitt**: Jeder der 8 Pflichtabschnitte erhält eine Bewertung `0.0–1.0`, berechnet nach:

- Textlänge (zu kurze Abschnitte = niedriges Vertrauen);
- Vorhandensein von normativen Inline-Zitaten (`Gesetz 219`, `Art.`, `gdpr`, `Kassationsgericht`, `fnomceo`, `Lazio`);
- Anzahl der referenzierten PA-Klauseln aus der Bibliothek mit 72 Elementen.

Abschnitt 5 (Unterschrift) erfordert immer eine manuelle Überprüfung, unabhängig von der Bewertung, da er juristisch am kritischsten ist.

Wenn `overall_confidence < 0.7` oder Fehler aus der Blacklist vorliegen, setzt das System `review_obbligatoria=true` und blockiert das Speichern, bis die Ärztin oder der Arzt die problematischen Abschnitte manuell überarbeitet.

Zusätzlich weist eine Häufigkeitsprüfung auf verdächtige Prozentangaben hin (z. B. "100 % Risiko", "0,001 % Komplikation"), die oft auf numerische Halluzinationen des LLM hindeuten.

## Schritt 5, Unterschrift der Patientin oder des Patienten und Archivierung

Nach der ärztlichen Überprüfung (8/8 aktivierte Häkchen) wird die Schaltfläche `Speichern und senden` aktiv. Durch Klicken darauf geschehen nacheinander folgende Schritte:

1. **Generierung PDF/A-3b**: Das Modul `pdf-signer` von Fibonacci konvertiert die Markdown-Einwilligung in ein PDF/A-3 gemäß ISO 19005-3 mit eingebetteter XML-Datei für die Langzeitvalidierung. Dies ist das vom Codice dell’Amministrazione Digitale Art. 44 für die zehnjährige Aufbewahrung geforderte Format.

2. **Fortgeschrittenes elektronisches Siegel**: Das PDF wird serverseitig mit dem Zertifikat der Praxisinhaberin oder des Praxisinhabers und einem Zeitstempel (TSA gemäß eIDAS) versiegelt.

3. **Grafometrische Unterschrift der Patientin oder des Patienten**: Die Patientin oder der Patient unterschreibt auf dem Tablet; das System erfasst neben dem Bild der Unterschrift auch die biometrischen Daten des Schriftzugs (Druck, Geschwindigkeit, Zeiten), die verschlüsselt und in das PDF eingebettet werden für eine mögliche grafologische Begutachtung. Es handelt sich um eine fortgeschrittene elektronische Signatur (FEA), die nach vorheriger Identitätsprüfung der Patientin oder des Patienten durch ein Dokument gesammelt wird. Die FEA hat die Beweiskraft einer Privaturkunde (Art. 2702 c.c.); wird sie bestritten, liegt die Beweislast bei der Person, die sie vorlegt. Die volle Vermutung der Zuordnung zur Unterzeichnerin oder zum Unterzeichner (Art. 20 Abs. 1-bis CAD) wird mit der qualifizierten Signatur (FEQ) erreicht – aktivierbar zusammen mit dem qualifizierten Zeitstempel über einen akkreditierten QTSP.

4. **Archivierung**: Die unterzeichnete Einwilligung wird in der Akte der Patientin oder des Patienten gespeichert, verknüpft mit der Visite und der Ärztin oder dem Arzt, die oder der sie eingeholt hat. Das PDF bleibt als Anlage verfügbar und herunterladbar.

5. **Protokollierung**: Der Vorgang wird im unveränderlichen `Zugriffsprotokoll` mit `action=C` (create), `purposeOfEvent` (Beschreibung der KI-Überprüfung 8/8 Abschnitte), agent (Ärztin oder Arzt), source (KI-Assistent), outcome (Erfolg/Misserfolg) erfasst. Forensische Suche über Audit-Log mit Filtern nach Datum, Patientin oder Patient, Ärztin oder Arzt.

Die Patientin oder der Patient erhält eine Kopie des unterzeichneten PDF per E-Mail. Die Praxis behält stets das archivierte Original.

## Schritt 6, Widerruf, Änderung, Neuausdruck

- **Widerruf**: Die Patientin oder der Patient oder die Ärztin oder der Arzt können eine unterzeichnete Einwilligung über das Kontextmenü `Widerrufen` widerrufen. Der Status ändert sich zu `inactive` (Widerrufen), es wird ein neuer `AuditEvent action=U` mit Begründung erstellt, aber das ursprüngliche PDF bleibt archiviert. Ein Widerruf nach der Leistung führt zur Unterbrechung der Behandlung (Gesetz 219/2017 Art. 1 Abs. 5).

- **Änderung**: Unterzeichnete Einwilligungen **können nicht geändert werden**. Bei Bedarf einer aktualisierten Einwilligung (z. B. Technikwechsel) wird eine neue Einwilligung erstellt. Das System zeigt automatisch die vorherigen in der Patientenakte mit der Versionshistorie an.

- **Neuausdruck**: Von der unterzeichneten Einwilligung kann das ursprüngliche PDF immer wieder heruntergeladen werden, identisch mit dem versiegelten Dokument. Nützlich, um es in die Papierakte zu übernehmen oder der Patientin oder dem Patienten erneut auszuhändigen.

⚠️ **Einen Widerruf einer Einwilligung zu erklären, bedeutet nicht, Daten zu löschen.** Das widerrufene PDF bleibt archiviert: Es beweist, dass die Einwilligung zum Zeitpunkt der Leistung vorlag, und der Widerruf berührt nicht die Akte. Falls die Patientin oder der Patient jedoch den Zugang, die Portabilität oder die Löschung ihrer oder seiner Daten verlangt, gilt eine andere Anleitung: [Export und Patientenrechte](/manuale/esportazioni-e-diritti).

## Wichtige Hinweise

- Die über 100 proprietären Fibonacci-Modelle befinden sich in **Version 0.1 (interner Entwurf)**. Sie decken die gesetzlich vorgesehene Struktur ab (8 Abschnitte L. 219/2017 + 5 Elemente Kassationsgericht 26104/2022 + GDPR + eIDAS + PDF/A-3b), aber der **klinische Inhalt wurde noch nicht von einem Fachanwalt für Medizinrecht oder einer Fachärztin oder einem Facharzt des Fachgebiets validiert**. Vor der Verwendung mit echten Patientinnen und Patienten musst du: (1) jedes Modell von der Rechtsberatung deiner Praxis prüfen lassen, (2) Risiken/Prozentsätze mit den aktuellen Leitlinien der Fachgesellschaften (SICPRE/ISAPS, SIDeMaST, SIME/AIME) abgleichen, (3) die Einwilligung auf die einzelne Patientin oder den einzelnen Patienten anpassen (Allergien, laufende Therapien, Komorbiditäten – der Assistent zwingt dich dazu in Schritt 2), (4) das Dokument nach der Unterschrift der Patientin oder des Patienten gegenzeichnen. Fibonacci stellt die technische Infrastruktur bereit, ersetzt aber nicht die rechtliche Beratung durch einen Fachanwalt für Medizinrecht oder die klinische Verantwortung der behandelnden Ärztin oder des behandelnden Arztes.

- Der KI-Assistent generiert Texte, die **immer von der Ärztin oder dem Arzt vor dem Versand noch einmal gelesen werden müssen**: Die KI ist ein Hilfsmittel (konform Anforderung RF-5.4), kein Medizinprodukt. Die Pflichtüberprüfung der 8 Abschnitte in Schritt 4 dient dazu, diese Verantwortung zu verdeutlichen.

- Die für die Erstellung der Einwilligung verarbeiteten Daten werden nicht für das Training der Modelle verwendet (vertraglicher Opt-out mit den Anbietern). Die Inferenz erfolgt über den konfigurierten LLM-Anbieter: Die aktualisierte Liste der Unterverantwortlichen und ihrer Verarbeitungsstandorte ist unter `/sub-responsabili` veröffentlicht. Gib im klinischen Kontext keine direkten Identifikatoren der Patientin oder des Patienten ein, die über das unbedingt Notwendige hinausgehen.

## Rechtliche Referenzen

- **Gesetz 219/2017 Art. 1**: Normen zum informed consent und zu Patientenverfügungen.
- **Kassationsgericht 26104/2022**: Beweislast für den informed consent liegt bei der Ärztin oder dem Arzt.
- **GDPR Art. 9 + Art. 30**: Verarbeitung von Gesundheitsdaten + Verzeichnis der Verarbeitungstätigkeiten.
- **Verordnung (EU) 910/2014 (eIDAS)**: Fortgeschrittene elektronische Signatur.
- **CAD Art. 44 + ISO 19005-3**: Normgerechte Aufbewahrung elektronischer Dokumente.
- **Gesetz 633/1941 Art. 5**: Akten der öffentlichen Verwaltung im öffentlichen Bereich.

> Dokument aktualisiert am **{ULTIMA_REVISIONE}**.
