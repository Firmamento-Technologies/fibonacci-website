# Verordnungen und Therapien

Diese Anleitung beschreibt, wie eine Verordnung ausgefüllt wird, wie das System Allergien überprüft und was passiert, wenn die Überprüfung nicht durchgeführt werden kann. Sie richtet sich an Ärztinnen und Ärzte.

## Voraussetzungen

- Konto mit der Rolle `medico`, mit den bei der Ärztekammer registrierten Daten: Diese erscheinen auf dem ausgedruckten Rezept.
- Patientenstammdaten mit Anamnese, wenn die Allergieprüfung durchgeführt werden soll.

## Schritt 1: Medikament auswählen

Das Feld für das Medikament durchsucht den AIFA-Katalog, der sowohl Handelsnamen als auch **Wirkstoffe** enthält: Bei der Eingabe von `Hyaluronsäure` oder `Botulinumtoxin` werden die entsprechenden Produkte angezeigt, auch wenn der Handelsname abweicht.

⚠️ **Filler sind nicht im Katalog enthalten, und das ist korrekt**: Es handelt sich um CE-gekennzeichnete Medizinprodukte, keine Arzneimittel, und sie erscheinen nicht in einem Arzneimittelverzeichnis. Sie werden als Behandlung erfasst (siehe Anleitung `Behandlung erfassen`), nicht als Verordnung.

## Schritt 2: Allergieprüfung

Bei der Auswahl vergleicht das System das Medikament mit den in der Anamnese erfassten Allergien und zeigt eine Warnung an, wenn eine Übereinstimmung gefunden wird.

🔑 **Die Prüfung ist fail-open, und das muss bekannt sein**: Wenn die Anamnese leer ist oder das Medikament nicht erkannt wird, **erscheint keine Warnung**. Das Fehlen einer Warnung bedeutet nicht „keine Allergie“, sondern „keine Übereinstimmung gefunden“. Das ist ein wichtiger Unterschied, und deshalb ersetzt die Prüfung keine sorgfältig durchgeführte Anamnese.

## Schritt 3: Dosierung, Häufigkeit, Dauer

Die Felder folgen der Struktur des Rezepts: Dosierung, Häufigkeit, Periodizität, Dauer in Tagen, Notizen für die Patientin oder den Patienten. Die Notizen werden ausgedruckt: Hier können Anwendungshinweise und zu beachtende Kontraindikationen eingetragen werden.

## Schritt 4: Drucken

Das ausgedruckte Rezept enthält die Daten der Praxis und der Ärztin oder des Arztes (Bezeichnung, Sitz, Registrierung bei der Ärztekammer mit Nummer), die aus der Praxiskonfiguration übernommen werden. Wenn diese Felder leer sind, werden sie auf dem Rezept als manuell auszufüllende Leerstellen gedruckt: Das System erfindet keine Identifikationsdaten.

## Häufige Fehler

- **Sich auf die Allergiewarnung als Garantie verlassen.** Sie ist eine Hilfe, kein Sicherheitsmechanismus: Ohne Anamnese gibt es nichts zum Abgleichen.
- **Einen Filler als Verordnung erfassen.** Es handelt sich um ein Medizinprodukt: Es gehört in die Behandlungssitzung, mit Charge und Menge.
- **Daten der Ärztekammer nicht ausgefüllt.** Sie erscheinen leer auf dem Rezept und den Einwilligungen und fallen erst auf, wenn das Dokument bereits in den Händen der Patientin oder des Patienten ist.

## Häufig gestellte Fragen

**Kann ich Medikamente auf Kosten des Gesundheitsdienstes verordnen?** Nein: Das hier erstellte Rezept ist eine Privatverordnung. Die Funktionen für den telematischen Kanal sind im Produkt vorhanden, aber deaktiviert und erfordern regionale Akkreditierungen.

**Werden die Verordnungen in den Export der Patientin oder des Patienten übernommen?** Ja, zusammen mit dem Rest der Patientenakte.
