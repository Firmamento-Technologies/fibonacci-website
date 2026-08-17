> **Übersetzung als Serviceleistung.** Bei Abweichungen ist die italienische Fassung dieses Dokuments maßgeblich.

# Sicherheit und Datenschutz

**Version 0.2 · Letzte Überarbeitung: {ULTIMA_REVISIONE}**

{AVVISO_BOZZA}

Dieses technische Datenblatt beschreibt die von Fibonacci (im Folgenden „Fibonacci“ oder der „Auftragsverarbeiter“) ergriffenen technischen und organisatorischen Sicherheitsmaßnahmen bei der Bereitstellung der digitalen Patientenakten-SaaS-Software Fibonacci (im Folgenden „Dienst“ oder „Fibonacci“). Das Dokument wird gemäß Artikel 32 der Verordnung (EU) 2016/679 (im Folgenden „GDPR“) erstellt und stellt Anlage A der Vereinbarung zur Datenverarbeitung (DPA) dar, die vom Arzt als Verantwortlicher unterzeichnet wird. Die beschriebenen Maßnahmen gelten für die Verarbeitung besonderer Kategorien von Daten gemäß Art. 9 GDPR (Gesundheitsdaten), die im Rahmen des Dienstes im Auftrag des Verantwortlichen durchgeführt wird.

Das Dokument ist unter der Adresse {URL_SITO}/sicherheit veröffentlicht und unterliegt regelmäßigen Aktualisierungen in Abhängigkeit von der technologischen Entwicklung des Dienstes und dem Stand der Technik in der IT-Sicherheit. Wesentliche technische Änderungen werden den Kunden als Verantwortliche in der am Ende dieses Dokuments angegebenen Weise mitgeteilt.

---

## 1. Sicherheitsarchitektur

Die Sicherheitsarchitektur von Fibonacci ist in drei konzentrische Ebenen unterteilt, von denen jede unabhängige und komplementäre Kontrollen umsetzt. Die Verteidigungslogik basiert auf dem Prinzip der Tiefenverteidigung (defense in depth): Das Versagen einer einzelnen Ebene reicht nicht aus, um die Vertraulichkeit, Integrität oder Verfügbarkeit der klinischen Daten zu gefährden.

### 1.1 Netzwerkebene (Perimeter)

Der Netzwerkperimeter ist bei der Infrastruktur von Aruba S.p.A. auf einem italienischen Netzwerk und somit innerhalb der Europäischen Union gehostet. Der eingehende Datenverkehr läuft ausschließlich über einen Caddy-Reverse-Proxy, der TLS 1.3 terminiert und die in Abschnitt 6 beschriebenen HTTP-Sicherheitsheader anwendet. Das Anwendungs-Backend ist nicht direkt dem öffentlichen Internet ausgesetzt: Die Docker-Container kommunizieren über ein privates Netzwerk, und der administrative Zugriff auf die Hosts ist ausschließlich von autorisierten IP-Adressen über SSH-Schlüssel ohne Passwortauthentifizierung gestattet.

**Es gibt keine zwischengeschalteten Netzwerkintermediäre.** Die Domain des Dienstes löst direkt auf die Adresse der oben beschriebenen Infrastruktur auf: Es werden keine Content-Delivery-Netzwerke, Reverse-Proxys von Drittanbietern oder von Dritten verwaltete Web Application Firewalls eingesetzt, und es gibt keinen Punkt, an dem ein anderes Subjekt als der Auftragsverarbeiter die verschlüsselte Verbindung vom Browser terminiert. Dieser Umstand ist von außen durch eine DNS-Abfrage der Domain des Dienstes überprüfbar.

### 1.2 Anwendungsebene

Auf Anwendungsebene implementiert Fibonacci Multi-Faktor-Authentifizierung, gehärtete Sitzungen, rollenbasierte Zugriffskontrolle (RBAC) und FHIR-Compartimentierung pro medizinischem Mandanten. Jede Anfrage wird durch serverseitige Middleware zur Input-Sanitisierung, CSRF-Kontrolle und Ratenbegrenzung pro Benutzer und IP-Adresse validiert. Die Anwendungslogik ist in stark typisierten Sprachen geschrieben und folgt den in Abschnitt 7 beschriebenen sicheren Entwicklungspraktiken.

### 1.3 Datenebene

Auf Datenebene wendet Fibonacci Verschlüsselung auf zwei Achsen an: Volumenverschlüsselung des gesamten PostgreSQL-Dateisystems und anwendungsseitige AES-256-GCM-Verschlüsselung für Spalten mit sensiblen Identifikatoren und für Fotodateien. Die anwendungsseitigen Verschlüsselungsschlüssel (Key Encryption Keys, KEK) werden serverseitig verwaltet und gelangen niemals zum Browser des Arztes. Jede CRUD-Operation an klinischen Ressourcen wird in einem unveränderlichen Audit-Log im FHIR-AuditEvent-Format mit SHA-256-Hash-Chain-Signatur protokolliert (Abschnitt 4).

### 1.4 Vereinfachtes Flussdiagramm

```
                              TLS 1.3, ohne Intermediäre
   [Arzt-Browser]  ----------------------------------->  [Caddy-Reverse-Proxy / Aruba IT]
                       (httpOnly Secure-Cookie)                     |
                                                                    |  privates Netzwerk
                                                                    v
                                                       [Fibonacci-App-Container]
                                                                    |
                                       +----------------------------+----------------------------+
                                       |                            |                            |
                                       v                            v                            v
                              [Verschlüsselte PostgreSQL]  [AES-256-verschlüsselter Foto-Speicher]  [Audit-Log mit Hash-Chain]
                                       |
                                       v
                                  [Tägliches AES-256-verschlüsseltes Backup]
```

---

## 2. Verschlüsselung

Verschlüsselung ist die Hauptmaßnahme zur Risikominderung bei Datenexfiltration und unbefugtem Zugriff. Fibonacci wendet Verschlüsselung während der Übertragung, Verschlüsselung des Dateisystems im Ruhezustand sowie spalten- und binärdatenbezogene anwendungsseitige Verschlüsselung an.

| Komponente | Was es tut (WHAT) | Gemindertes Risiko (WHY) | Technologie und Parameter (HOW) |
| --- | --- | --- | --- |
| Client-Server-Transport | Verschlüsselt die gesamte Kommunikation zwischen Arzt-Browser und Backend | Abhören im Netzwerk, Man-in-the-Middle-Angriffe | TLS 1.3 mit IETF-empfohlenen AEAD-Cipher-Suites, HSTS preload, Forward Secrecy mittels ECDHE |
| Datenbank-Dateisystem | Verschlüsselt das PostgreSQL-Datenbankvolumen auf Blockebene | Physische Exfiltration der Festplatten, unbefugter Zugriff auf das Volume | Volumenverschlüsselung des Dateisystems mit vom Host-System verwalteten Schlüsseln, abgeleitet von einem nicht auf der Instanz residierenden Master-Key |
| Spaltenweise anwendungsseitige Verschlüsselung | Verschlüsselt auf Anwendungsebene die sensibelsten Felder der Akte vor dem Schreiben in die Datenbank | Datenbank-Exfiltration, Zugriff durch Infrastruktur-Betreiber | AES-256 GCM mit durch Auth-Tag garantierter Integrität, eindeutiger Nonce pro Datensatz, serverseitige KEK |
| Verschlüsselung klinischer Fotos | Verschlüsselt die Binärdateien der Fotos vor der Speicherung | Exfiltration des Objektspeichers, unbefugter Zugriff auf Dateien | AES-256 GCM mit vom pdf-signer-Sidecar verwalteter KEK, serverseitige Entschlüsselung on-demand bei autorisierter Bereitstellung |
| Backup | Verschlüsselt das Backup-Paket vor der Offsite-Übertragung | Backup-Exfiltration, Verlust eines Datenträgers | AES-256 auf dem Snapshot-Paket, separater Schlüssel von der anwendungsseitigen KEK |

### 2.1 Schlüsselverwaltung

Die anwendungsseitigen Verschlüsselungsschlüssel (Key Encryption Keys) werden serverseitig verwaltet und niemals dem Browser des Arztes offengelegt. Die Ableitung der Data Encryption Keys (DEK) für einzelne Datensätze erfolgt im Backend-Speicher zum Zeitpunkt der Schreib- oder Leseoperation. Die Schlüssel sind nicht im selben Paket wie die verschlüsselten Daten in den Backups enthalten. Die Rotation der KEK ist ein dokumentiertes Verfahren und verschlüsselt schrittweise bestehende Daten ohne Dienstunterbrechung neu.

### 2.2 Integrität

Der GCM-Modus (Galois/Counter Mode) gewährleistet gleichzeitig Vertraulichkeit und Integrität. Das Auth-Tag überprüft, dass die Nutzlast nicht verändert wurde, und weist jeden Manipulationsversuch des Chiffretexts zurück. Diese Eigenschaft ist besonders relevant für klinische Fotos, bei denen die Änderung eines einzelnen Bits den Beweiswert der Daten ungültig machen würde.

---

## 3. Zugriffskontrolle und Authentifizierung

Die digitale Identität ist die primäre Angriffsfläche einer Cloud-basierten Gesundheitsanwendung. Fibonacci setzt Multi-Faktor-Authentifizierung, robustes Passwort-Hashing, gehärtete Sitzungen und Datenkompartimentierung auf Rollen- und FHIR-Basis ein.

### 3.1 Authentifizierung

| Maßnahme | WAS | WARUM | WIE |
| --- | --- | --- | --- |
| Passwort-Hashing | Speichert nur den nicht umkehrbaren Hash des Passworts | Datenbank-Exfiltration von Benutzerdaten, Offline-Brute-Force | bcrypt mit an die Last angepasstem Cost-Faktor, zufälliger Salt pro Benutzer |
| MFA TOTP | Erfordert zweiten Faktor beim Login | Diebstahl von Anmeldedaten, Wiederverwendung kompromittierter Passwörter, Phishing | RFC 6238 TOTP mit 30 Sekunden, obligatorisch für Admin-Rollen, vom Arzt für das eigene Konto aktivierbar |
| Wiederherstellungscodes | Ermöglicht Konto-Wiederherstellung bei Verlust des TOTP-Geräts | Geräteverlust, Benutzer-Sperre | Einmalige Codes, die bei der MFA-Einrichtung generiert werden, nur als Hash in der Datenbank gespeichert, nach Nutzung ungültig |
| Login-Ratenbegrenzung | Blockiert automatisierte Versuche | Brute-Force, Credential Stuffing | Drosselung pro IP und Benutzer auf Login-, MFA-Verifizierungs- und Diktier-Endpunkten |

### 3.2 Sitzung

Benutzersitzungen werden über httpOnly-, Secure- und SameSite=Strict-Cookies verwaltet. Das httpOnly-Attribut verhindert den Zugriff auf das Cookie durch clientseitiges JavaScript und reduziert so die Auswirkungen möglicher XSS-Schwachstellen. Das Secure-Attribut erzwingt die Übertragung nur über TLS. Das SameSite=Strict-Attribut mindert Angriffe wie Cross-Site Request Forgery und Cross-Site Leaks. Das Sitzungstoken unterliegt der Rotation: Jede Berechtigungserhöhung (Login, Passwortänderung, MFA-Aktivierung) gibt eine neue Kennung aus und macht die vorherige ungültig.

### 3.3 RBAC und Kompartimentierung

Der Zugriff auf klinische Ressourcen wird durch ein RBAC-Modell mit folgenden Mindestrollen geregelt:

| Rolle | Typische Fähigkeiten |
| --- | --- |
| admin | Konfiguration der Organisation, Benutzerverwaltung, Zugriff auf das Audit-Panel, standardmäßig kein klinischer Zugriff |
| medico | Vollständiger Zugriff auf eigene Patienten, Anlegen von Akten, Diktat, Unterzeichnung von Einwilligungen |
| segreteria | Zugriff auf Stammdaten und Terminplanung, eingeschränkter klinischer Zugriff gemäß den Richtlinien des Verantwortlichen |
| utente | Minimales Profil, Self-Service-Zugriff auf die eigene Konfiguration |

Über dem RBAC-Modell arbeitet die FHIR-Kompartimentierung via Medplum AccessPolicy: Jeder Arzt ist auf seine eigenen Patienten isoliert, FHIR-Abfragen werden serverseitig gefiltert, und der Versuch eines mandantenübergreifenden Lesezugriffs führt zu einer Ablehnung, die im Audit-Log protokolliert wird. Die Kompartimentierung ist die Hauptmaßnahme zur Risikominderung von Lateral Movement und unbefugtem Zugriff zwischen verschiedenen Kliniken, die dieselbe Instanz nutzen.

---

## 4. Integrität und Rückverfolgbarkeit

Für Gesundheitsanwendungen ist die Datenintegrität funktional für ihren Beweis- und klinischen Wert. Fibonacci implementiert ein unveränderliches Audit-Log im FHIR-AuditEvent-Format mit kryptografischer Verkettung der Einträge (Hash-Chain).

### 4.1 Audit-Log

Jede CRUD-Operation an FHIR-Ressourcen (Patient, Encounter, Observation, Condition, MedicationStatement, DocumentReference, Consent, ImagingStudy und ähnliche) erzeugt einen AuditEvent-Eintrag mit folgenden Inhalten:

- Identifikator des Akteurs (Arzt, Rolle, Sitzung);
- UTC-Zeitstempel mit hoher Auflösung;
- Aktionstyp (create, read, update, delete, sign);
- Referenz auf die betroffene Ressource;
- Ergebnis (success, failure) und Grund für eine mögliche Ablehnung;
- Ursprungs-IP-Adresse und User-Agent.

### 4.2 Hash-Chain

Jeder Audit-Eintrag enthält den SHA-256-Digest des vorherigen Eintrags und bildet so eine Hash-Kette ähnlich einem Append-only-Register. Jede nachträgliche Manipulation eines Zwischeneintrags würde zum Bruch der Kette führen und wäre durch deterministische Überprüfung des Registers erkennbar. Der Digest des letzten Eintrags kann als periodischer Integritätsnachweis exportiert werden.

### 4.3 Zugriff und Aufbewahrung

Das Audit-Log ist für den Verantwortlichen über den Bereich /audit des geschützten Bereichs zugänglich, mit Filtern nach Akteur, Ressource und Zeitfenster. Die Aufbewahrungsfrist beträgt zehn Jahre ab dem Ereignis, in Übereinstimmung mit der Pflicht zur Aufbewahrung der medizinischen Dokumentation. Nach Ablauf wird der Datensatz sicher gelöscht oder gemäß den Anweisungen des Verantwortlichen anonymisiert.

---

## 5. Verfügbarkeit und Backup

Die Kontinuität des Zugriffs auf klinische Daten ist eine Sicherheitseigenschaft wie Vertraulichkeit und Integrität und ist spezifischer Gegenstand von Art. 32 Abs. 1 lit. b und c GDPR.

| Maßnahme | WAS | WARUM | WIE |
| --- | --- | --- | --- |
| Tägliches Backup | Erstellt täglich einen Snapshot der Datenbank und der Speicher | Datenverlust durch Vorfälle, Ransomware, Betriebsfehler | AES-256-verschlüsselter Snapshot, erstellt in einem Zeitfenster mit geringer Last |
| 30-Tage-Retention | Behält 30 rollierende Versionen des Backups | Langsame Exfiltration, nicht sofort erkennbare Beschädigung | Aufbewahrung der verschlüsselten Pakete mit 30-Tage-Rotation |
| Kontinuierliches Transaktionslog-Archiv | Ermöglicht die Wiederherstellung zu einem genauen Zeitpunkt und nicht nur zum letzten nächtlichen Snapshot | Verlust der Stunden nach dem letzten Backup | Archivierung der Write-Ahead-Logs, geplante Verarbeitung alle 5 Minuten |
| RPO 24h | Definiert den maximalen akzeptablen Datenverlustpunkt | Backup-Planungsvorgabe | Garantiert durch tägliche Backup-Häufigkeit |
| RTO 24h | Definiert die maximale Wiederherstellungszeit des Dienstes | Disaster-Recovery-Planungsvorgabe | Dokumentiertes Wiederherstellungsverfahren, vierteljährlich getestet mit Messung der Wiederherstellungszeit |

### 5.1 Offsite-Kopie: deklarierte Grenze

⚠️ **Zum Zeitpunkt dieser Überarbeitung befindet sich die Sicherheitskopie auf derselben Maschine, die sie schützt.** Das System für die Replikation bei einem Drittanbieter ist installiert und aktiv (der geplante Job läuft, und bei Fehlen eines konfigurierten Ziels wird dies explizit in den eigenen Logs vermerkt), aber das Remote-Ziel wurde noch nicht erworben und konfiguriert. Die Konsequenz muss vollständig dargelegt werden: **Heute würde der Verlust des Hosting-Anbieters den Verlust des Systems und seiner Kopie gleichzeitig bedeuten.**

Diese Grenze wird hier und nicht in einer Fußnote deklariert, weil es genau die Art von Information ist, die ein Verantwortlicher **vor** der Datenüberlassung an einen Auftragsverarbeiter kennen muss, und weil die Offsite-Kopie spezifischer Gegenstand von Art. 32 Abs. 1 lit. c) GDPR ist. Das Remote-Ziel wird ein **anderer** Anbieter als derjenige sein, der die Primärinfrastruktur hostet, und sich in der Europäischen Union befinden: Eine vom selben Anbieter aufbewahrte Kopie ist keine Offsite-Kopie.

Dieser Abschnitt wird durch die Beschreibung der aktiven Maßnahme ersetzt, sobald diese in Betrieb und verifiziert ist.

### 5.2 Wiederherstellungstest

Vierteljährlich wird ein vollständiger Wiederherstellungstest aus dem jüngsten Backup auf einer Nicht-Produktionsinstanz durchgeführt, wobei die Integrität der wiederhergestellten Daten und die tatsächliche Wiederherstellungszeit überprüft werden. Das Testergebnis wird zu Nachweiszwecken gemäß Art. 32 Abs. 1 lit. d GDPR (Verfahren zum regelmäßigen Testen, Überprüfen und Bewerten der Wirksamkeit der technischen und organisatorischen Maßnahmen) aufgezeichnet und aufbewahrt.

---

## 6. Anwendungs-Härtung

Fibonacci setzt eine Härtungskonfiguration für Frontend und Backend ein, die darauf abzielt, die Angriffsfläche der relevantesten OWASP Top 10-Klassen für Webanwendungen zu reduzieren.

| Kontrolle | WAS | WARUM | WIE |
| --- | --- | --- | --- |
| Strikte Content Security Policy | Beschränkt die erlaubten Quellen für Skripte, Stile, Bilder und Verbindungen | Cross-Site-Scripting, Datenexfiltration | Strikte CSP ohne Inline-Skripte, explizite Allowlist nur der notwendigen Ursprünge |
| HSTS preload | Erzwingt, dass der Browser die Domain nur über HTTPS kontaktiert, auch beim ersten Zugriff | Downgrade auf HTTP, Angriffe auf unsicheres WLAN | Strict-Transport-Security-Header mit hohem max-age und preload-Flag, Domain in der Preload-Liste eingetragen |
| X-Frame-Options DENY | Verbietet die Einbettung des Dienstes in externe iframes | Clickjacking, UI Redress | X-Frame-Options: DENY-Header bei jeder Antwort des Anwendungs-Backends |
| X-Content-Type-Options nosniff | Deaktiviert das MIME-Sniffing des Browsers | Ausführung von Inhalten als andere als die deklarierten Typen | X-Content-Type-Options: nosniff-Header |
| Permissions-Policy | Deaktiviert nicht benötigte Browser-APIs (Geolocation, Mikrofon, wo nicht erforderlich, USB, seriell, Zahlung) | Reduzierung der clientseitigen Angriffsfläche | Restriktive Permissions-Policy, explizite Aktivierung nur dort, wo die Funktion es erfordert (z. B. Mikrofon nur auf der Diktierseite) |
| CSRF-Token | Schützt ändernde Anfragen vor ihrer Cross-Origin-Auslösung | Cross-Site Request Forgery | CSRF-Token pro Sitzung, serverseitige Validierung bei jedem POST, PUT, PATCH, DELETE |
| Ratenbegrenzung | Begrenzt die Häufigkeit von Anfragen an sensible Endpunkte | Brute-Force, Scraping, Missbrauch kostenpflichtiger Dienste (Diktat) | Unterschiedliche Limits pro IP und Benutzer auf Login-, MFA-Verifizierungs-, Diktier- und Massendatenexport-Endpunkten |
| Input-Sanitisierung | Validiert und normalisiert jeden Input vor der Verwendung | Injection (SQL, NoSQL, Befehl), reflektiertes XSS, Path Traversal | Schema-gesteuerte serverseitige Validierung, parametrisierte Abfragen an die Datenbank, kontextsensitives Escaping der Ausgabe |

---

## 7. Sichere Entwicklung (Secure SDLC)

Sicherheit ist in den Softwareentwicklungszyklus (Security by Design gemäß Art. 25 GDPR) durch automatische Kontrollen und menschliche Überprüfung bei jeder Codeänderung integriert.

| Phase | Kontrolle | WARUM | WIE |
| --- | --- | --- | --- |
| Pre-Merge | Obligatorische Code-Review | Logische Fehler, Sicherheitsregressionen | Mindestens ein vom Autor verschiedener Reviewer genehmigt jeden Pull Request |
| Pre-Merge | Statische Analyse (SAST) | Musterbasierte Schwachstellen (Injection, Auth Bypass, Secret Leak) | Semgrep und CodeQL bei jedem Pull Request, Merge-Blockade bei High- oder Critical-Findings |
| Pre-Merge | Dependency Scanning | Schwachstellen in Drittbibliotheken, Supply Chain | npm audit und Dependabot aktiv, automatische Alerts für hohe und kritische CVE, zeitnahe Updates |
| Pre-Merge | E2E-Tests | Funktionale Regressionen in kritischen Flüssen | Playwright-Suite für Login-, MFA-, Akte-Erstellungs-, Diktier-, Einwilligungs- und Export-Flüsse |
| Post-Deploy | OWASP ZAP Baseline Pen Test | Laufzeit- und Konfigurations-Schwachstellen | Monatliche Ausführung in der Produktionsumgebung, Triage und Behebung nicht falsch positiver Findings |
| Kontinuierlich | Team-Schulung | Fehler durch Fehlinformation, Abweichung von Praktiken | Jährliche Schulung zu GDPR + Anwendungssicherheit, Teilnahme an der OWASP-Community, benannter Security Champion |

Produktionsgeheimnisse (Schlüssel, Token, Dienstpasswörter) werden über den Secret Manager der Infrastruktur verwaltet, sind niemals im Quellcode enthalten und werden regelmäßig oder bei Verdacht auf Exposition rotiert.

---

## 8. Incident Management und Data Breach

Fibonacci hat ein dokumentiertes Incident-Response-Verfahren, das Rollen, Eskalationsschwellen, Benachrichtigungsfristen und Kommunikationsmodalitäten mit dem Verantwortlichen definiert.

### 8.1 Benachrichtigung des Verantwortlichen

Im Falle einer Verletzung personenbezogener Daten gemäß Art. 4 Nr. 12 GDPR, die Daten betrifft, die im Auftrag des Verantwortlichen verarbeitet werden, benachrichtigt Fibonacci den Verantwortlichen innerhalb von **24 Stunden nach Entdeckung** des Vorfalls. Diese Frist ist strenger als die Mindestfrist „ohne unangemessene Verzögerung“ gemäß Art. 33 Abs. 2 GDPR für den Auftragsverarbeiter und soll dem Verantwortlichen einen ausreichenden Spielraum im Vergleich zu den 72 Stunden gemäß Art. 33 Abs. 1 für seine mögliche Meldung an die Aufsichtsbehörde geben.

Die Benachrichtigung an den Verantwortlichen enthält, soweit zum Zeitpunkt der ersten Mitteilung verfügbar:

- Beschreibung der Art der Verletzung;
- Kategorien und ungefähre Anzahl der betroffenen Personen und Datensätze;
- wahrscheinliche Folgen;
- ergriffene oder vorgeschlagene technische und organisatorische Maßnahmen zur Eindämmung;
- operativer Ansprechpartner innerhalb von Fibonacci.

Fehlende Informationen zum Zeitpunkt der ersten Benachrichtigung werden dem Verantwortlichen schrittweise übermittelt, sobald sie verfügbar sind, in Übereinstimmung mit den EDPB-Leitlinien 9/2022.

### 8.2 Eskalation und Zusammenarbeit

Das interne Verfahren sieht die sofortige Aktivierung eines Incident Managers, die Isolierung des betroffenen Assets, die Sicherung forensischer Beweise und die Eröffnung eines Incident-Logs vor. Fibonacci arbeitet aktiv mit dem Verantwortlichen bei der Risikobewertung für die betroffenen Personen und der Vorbereitung einer möglichen Meldung an die Aufsichtsbehörde oder die betroffenen Personen zusammen. Nach Abschluss des Vorfalls wird ein mit dem Verantwortlichen geteilter Post-Mortem-Bericht erstellt, der die Timeline, die Root Cause, die ergriffenen Abhilfemaßnahmen und die langfristigen Korrekturmaßnahmen (Lessons Learned) enthält.

### 8.3 Register

Alle Vorfälle, unabhängig von ihrer endgültigen Einstufung als meldepflichtige Verletzung, werden im internen Incident-Register erfasst, das zu Audit- und Nachweiszwecken gemäß Art. 33 Abs. 5 GDPR aufbewahrt wird.

---

## 9. Internationale Datenübermittlungen

Für die Verarbeitung der Gesundheitsdaten von Patienten führt Fibonacci **keine Datenübermittlungen außerhalb der Europäischen Union** durch. Der gesamte Anwendungsstack, die Datenbank, der Fotospeicher und die Backups befinden sich bei der Infrastruktur von Aruba S.p.A. auf einem italienischen Netzwerk.

### 9.1 Fehlen europäischer Intermediäre auf dem Datenpfad

Der Pfad, den die klinischen Daten zwischen dem Browser des Arztes und der Datenbank zurücklegen, **durchläuft kein außereuropäisches Subjekt**, und dies nicht aufgrund einer Konfiguration, sondern durch Konstruktion: Es werden keine Content-Delivery-Netzwerke, keine Reverse-Proxys von Drittanbietern oder von Dritten verwaltete Web Application Firewalls eingesetzt. Die Domain des Dienstes löst direkt auf die Adresse der Infrastruktur auf, und die verschlüsselte Verbindung wird ausschließlich vom Reverse-Proxy des Auftragsverarbeiters terminiert.

Der Unterschied zu der im Sektor verbreiteten Architektur wird hier dargelegt, weil er der Grund ist, warum dieser Abschnitt kurz ist: Wenn ein Intermediär vorhanden ist, besteht die außereuropäische Übermittlung von Netzwerkmetadaten und muss mit Standardvertragsklauseln und zusätzlichen Maßnahmen gerechtfertigt werden. Hier **gibt es keine Übermittlung**, daher ist keine Rechtfertigung erforderlich. Dieser Umstand ist für jeden von außen und ohne unsere Zustimmung durch eine DNS-Abfrage der Domain des Dienstes überprüfbar.

### 9.2 Residuale Übermittlungen und ihr Umfang

Der einzige Unterauftragsverarbeiter in der Lieferkette mit Resilienz-Replikaten außerhalb der Europäischen Union ist der in Anlage B genannte Zahlungsdienstleister, der **keine Patientendaten oder klinischen Daten jeglicher Art verarbeitet**: Die Zahlungsabwicklung ist von der klinischen Verarbeitung getrennt, und die Abstimmung erfolgt über eine undurchsichtige Kennung. Für diesen Anbieter gelten die Standardvertragsklauseln gemäß Durchführungsbeschluss (EU) 2021/914.

### 9.3 Weitere außereuropäische Unterauftragsverarbeiter

Weitere außereuropäische Unterauftragsverarbeiter werden ausschließlich mit Zustimmung des Verantwortlichen gemäß den Bestimmungen des DPA autorisiert und unterliegen denselben Garantien (SCC, zusätzliche Maßnahmen, Risikobewertung der Übermittlung).

---

## 10. Betriebskontinuität

⚠️ **Dieser Abschnitt beschrieb eine redundante Architektur, die der Dienst nicht hat.** Die vorherige Version erklärte eine Verteilung auf mehrere Verfügbarkeitszonen, mehrere Reverse-Proxy-Instanzen hinter Health Checks und eine Streaming-Replikation der Datenbank mit automatischer Beförderung. Nichts davon ist in Betrieb: Der Dienst läuft auf **einem einzigen Host**, und die Behauptung einer nicht existierenden Redundanz in einer unterzeichneten technischen Anlage ist genau die Art von Aussage, die der Verantwortliche nicht selbst überprüfen kann und bei der er ein Recht darauf hat, nicht getäuscht zu werden.

Es folgt der tatsächliche Zustand, unterschieden zwischen dem, was aktiv ist, und dem, was geplant ist.

| Komponente | Status | WARUM | WIE |
| --- | --- | --- | --- |
| Standort | **Aktiv** | Bekannte und überprüfbare Gerichtsbarkeit und anwendbares Recht | Einzelner Host bei Aruba S.p.A., italienisches Netzwerk, Europäische Union |
| Netzwerkisolierung | **Aktiv** | Reduzierung der exponierten Oberfläche | Nur der Reverse-Proxy ist vom Internet aus erreichbar; die Anwendungsdienste kommunizieren über ein privates Netzwerk zwischen Containern |
| Tägliches Backup | **Aktiv** | Datenverlust durch Vorfälle, Betriebsfehler, Ransomware | Verschlüsselter nächtlicher Snapshot mit 30-Tage-Rotation |
| Wiederherstellung zu einem bestimmten Zeitpunkt | **Aktiv** | Verlust der Stunden nach dem letzten Snapshot | Kontinuierliche Archivierung der Transaktionsprotokolle, geplante Verarbeitung alle 5 Minuten |
| Wiederherstellungsnachweis | **Aktiv** | Ein nie wiederhergestelltes Backup ist kein Backup | Geplante Wiederherstellungs- und Überprüfungsaufgabe mit protokolliertem Ergebnis |
| Offsite-Kopie | **Geplant** | Verlust des Hosting-Anbieters | Siehe die in Abschnitt 5.1 deklarierte Grenze: System installiert, Remote-Ziel noch nicht aktiviert |
| Host-Redundanz | **Geplant** | Fehlertoleranz der einzelnen Maschine | Nicht in Betrieb. Ein Host-Ausfall führt zur Nichtverfügbarkeit des Dienstes bis zur Wiederherstellung |
| Formalisierter Kontinuitätsplan | **Geplant** | Koordinierung der Wiederherstellungsmaßnahmen | Wiederherstellungsverfahren sind dokumentiert und werden durchgeführt; ihre Formalisierung in einem genehmigten Plan erfolgt nach der Gründung der Gesellschaft |

---

## 11. Schulung und Governance

Technische Sicherheit ist nur wirksam, wenn sie von einer kohärenten organisatorischen Governance begleitet wird. Fibonacci integriert Schulungspflichten und definierte Verantwortlichkeiten in die eigene Struktur.

| Maßnahme | WAS | WARUM | WIE |
| --- | --- | --- | --- |
| Jährliche Schulung | Schulung des technischen Personals zu GDPR und Anwendungssicherheit | Reduzierung menschlicher Fehler, Ausrichtung am Stand der Technik | Jährlicher obligatorischer Kurs für alle Mitarbeiter, die auf Systeme zugreifen, die personenbezogene Daten verarbeiten, Bescheinigung wird aufbewahrt |
| Onboarding | Sicherheits-Checkliste für neue Mitarbeiter | Initiale Ausrichtung an Sicherheitsanforderungen | Formalisiertes Verfahren mit Übergabe der Zugangsdaten, MFA-Aktivierung, Durchsicht der internen Richtlinien, Akzeptanz des Verhaltenskodex |
| Security Champion | Interner Ansprechpartner für Sicherheitsfragen | Schnelle Klärung technischer Fragen, interne Eskalation | Benennung eines Security Champions im technischen Team |
| Code-Zugriff | Prinzip der geringsten Privilegien | Reduzierung des Risikos interner Exfiltration | Zugriff auf Repository und Infrastruktur nach Rolle, regelmäßige Überprüfung der Berechtigungen |
| Asset-Management | Inventar der Informationswerte | Vollständige Kenntnis des zu schützenden Perimeters | Aktualisiertes Inventar von Systemen, Diensten, Abhängigkeiten und Datenflüssen |

---

## 12. Zertifizierungen und Referenzstandards

Fibonacci ist **derzeit nicht nach ISO/IEC 27001 zertifiziert**. Auch ohne Zertifizierung wendet Fibonacci freiwillig die anwendbaren Kontrollen des Anhangs A der Norm ISO/IEC 27001:2022 als Referenzrahmen für die eigene Sicherheitslage an, insbesondere in den Bereichen organisatorische Kontrollen, Personenkontrollen, physische Kontrollen und technologische Kontrollen. Diese Referenz stellt keine Erklärung einer zertifizierten Konformität dar und darf nicht als Zertifizierungsanspruch verstanden werden.

### 12.0 Was zertifiziert ist und von wem: der entscheidende Unterschied

Die Zertifizierungen, die einen Teil des Dienstes abdecken, gehören dem **Infrastrukturanbieter**, nicht Fibonacci. Dieser Unterschied wird hier dargelegt, weil er derjenige ist, den ein weniger gewissenhafter Anbieter verschweigt, indem er das Markenzeichen seines Hosters vorzeigt, als wäre es sein eigenes.

| Ebene | Verantwortlicher | Was zertifiziert oder erklärt ist | Wie es überprüft wird |
| --- | --- | --- | --- |
| Rechenzentrum und Infrastruktur | Aruba S.p.A. | Zertifizierung **ISO/IEC 27001**; Einhaltung des **CISPE Data Protection Code of Conduct**, Verhaltenskodex gemäß **Art. 40 GDPR**, genehmigt von der CNIL im Jahr 2021 | Öffentliches CISPE-Register; vom Anbieter veröffentlichte Erklärungen |
| Anwendung, Daten, Prozesse | Fibonacci | **Keine Zertifizierung durch Dritte.** Selbstdeklarierte GDPR-Konformität auf Basis interner Dokumentation und aufbewahrter Nachweise | Dieses Dokument, der DPA und Anlage B, alle öffentlich und ohne Anfrageformular zugänglich |

⚠️ **Was dies konkret bedeutet**: Die Tatsache, dass das Rechenzentrum nach ISO/IEC 27001 zertifiziert ist, sagt etwas über die physische und organisatorische Sicherheit des Rechenzentrums aus, **aber nichts** über die Qualität des Anwendungscodes von Fibonacci, sein Zugriffskontrollmodell oder sein Schlüsselmanagement. Wer die Zertifizierung seines Hosters als Garantie für seine eigene Software präsentiert, beantwortet eine andere Frage als die, die ihm gestellt wurde.

Die Konformität mit der GDPR, insbesondere mit den Grundsätzen von Security by Design und by Default (Art. 25 GDPR) und angemessenen technischen und organisatorischen Maßnahmen (Art. 32 GDPR), wird vom Auftragsverarbeiter auf Basis interner Dokumentation und aufbewahrter Verfahrensnachweise selbst erklärt.

Zu den weiteren Standards und Leitlinien, die bei der Gestaltung der in diesem Dokument beschriebenen Maßnahmen berücksichtigt wurden, obwohl sie nicht zertifiziert sind, gehören:

- OWASP Top 10 2021 und OWASP Application Security Verification Standard (ASVS) für sichere Entwicklungspraktiken und Anwendungshärtung;
- NIST Special Publication 800-53 für das Vokabular der Sicherheitskontrollen;
- EDPB-Leitlinien 9/2022 zur Meldung von Verletzungen personenbezogener Daten.

### 12.1 Zertifizierungs-Roadmap

Fibonacci hat sich zum Ziel gesetzt, die Bewertung für den Start des ISO/IEC 27001-Zertifizierungsprozesses nach Erreichen der ersten konsolidierten Runde von Pilotkunden des Dienstes durchzuführen. Der Fortschritt der Roadmap wird den Kunden als Verantwortliche durch regelmäßige Aktualisierungen dieses Dokuments und gegebenenfalls durch dedizierte Mitteilungen transparent kommuniziert.

### 12.2 Europäischer Gesundheitsdatenraum: die kommende Pflicht

Die **Verordnung (EU) 2025/327** schafft den Europäischen Gesundheitsdatenraum (EHDS) und legt einen harmonisierten Rahmen für **Systeme elektronischer Patientenakten** fest. Die Verordnung gilt ab dem **26. März 2027**; für Systeme, die für die Verarbeitung der prioritären Kategorien elektronischer personenbezogener Gesundheitsdaten gemäß Art. 14 Abs. 1 Buchstaben a), b) und c) bestimmt sind, gelten die einschlägigen Bestimmungen ab dem **26. März 2029**.

Für ein System elektronischer Patientenakten bedeutet der durch die Verordnung vorgesehene Rahmen: Erstellung der **technischen Dokumentation** (Art. 37), **Informationsblatt**, das das System begleitet (Art. 38), **EU-Konformitätserklärung** in Bezug auf die wesentlichen Anforderungen des **Anhangs II** (Art. 39), Bewertung der harmonisierten Softwarekomponenten in einer **europäischen digitalen Testumgebung** (Art. 40), Anbringung der **CE-Konformitätskennzeichnung** (Art. 41) und Registrierung in der **EU-Datenbank** für Systeme elektronischer Patientenakten (Art. 49).

**Fibonacci ist derzeit kein CE-gekennzeichnetes System gemäß Kapitel III der Verordnung (EU) 2025/327 und erklärt dies auch nicht.** Die Kennzeichnung ist derzeit nicht anbringbar: Die gemeinsamen Spezifikationen der europäischen digitalen Testumgebung und das europäische Format für den Austausch elektronischer Patientenakten werden durch Durchführungsrechtsakte der Kommission festgelegt.

Was heute erklärt werden kann, ist der Stand des Produkts in Bezug auf die Anforderungen des Anhangs II, die **nicht** von diesen Durchführungsrechtsakten abhängen:

| Anforderung (Anhang II) | Status | Nachweis |
| --- | --- | --- |
| 2.6 Fehlen von Merkmalen, die den autorisierten Export von Daten zur Ersetzung des Systems durch ein anderes Produkt erschweren | **Erfüllt** | Der vollständige Export im FHIR R4-Format ist eine Funktion des Produkts, die dem Verantwortlichen jederzeit und ohne Genehmigung des Auftragsverarbeiters zur Verfügung steht |
| 3.1 Zuverlässige Mechanismen zur Identifizierung und Authentifizierung von Angehörigen der Gesundheitsberufe | **Erfüllt** | Abschnitt 3 dieses Dokuments |
| 3.2 und 3.3 Protokollierung der Zugriffe und Werkzeuge zur Prüfung und Analyse der Daten | **Erfüllt** | Abschnitt 4: FHIR AuditEvent-Register mit Hash-Verkettung, für den Verantwortlichen mit Filtern nach Akteur, Ressource und Zeitfenster einsehbar |
| 3.4 Unterstützung unterschiedlicher Aufbewahrungsfristen und Zugriffsrechte nach Herkunft und Kategorie der Daten | **Teilweise** | Differenzierte Aufbewahrung aktiv; die Granularität nach Datenherkunft wird derzeit erweitert |
| 2.1, 2.2, 2.3, 2.4 Interoperabilität im europäischen Austauschformat | **Zum jetzigen Zeitpunkt nicht anwendbar** | Das europäische Austauschformat wird durch noch nicht angenommene Durchführungsrechtsakte festgelegt. Das Produkt verwendet in der Zwischenzeit FHIR R4, das die technische Grundlage bildet, auf der das europäische Format aufgebaut wird |

---

## 13. Operative Kontakte

| Funktion | Kontakt |
| --- | --- |
| IT-Sicherheit und Meldung von Schwachstellen | {EMAIL_SICUREZZA} |
| Ansprechpartner für Datenschutz | {EMAIL_PRIVACY} |
| Datenschutz und Fragen zur Datenverarbeitung | {EMAIL_PRIVACY} |

Meldungen von Schwachstellen sind willkommen und werden im Einklang mit den Praktiken der verantwortungsvollen Offenlegung behandelt. Auf Wunsch des Meldenden kann ein verschlüsselter Kanal mittels PGP-Schlüssel des Sicherheitsteams eingerichtet werden, der auf Anfrage bereitgestellt wird. Fibonacci verpflichtet sich, dem Meldenden innerhalb angemessener Zeit nach Erhalt eine erste Rückmeldung zu geben, Meldungen, die in gutem Glauben und im Rahmen des angegebenen Umfangs erfolgen, nicht rechtlich zu verfolgen und den Beitrag des Meldenden öffentlich anzuerkennen, sofern keine Anonymitätsanfrage vorliegt.

---

## 14. Letzte Überarbeitung

Letzte Überarbeitung dieses Dokuments: {ULTIMA_REVISIONE}.

> Dieses Dokument hat beschreibenden Charakter und ist auf die aktuelle Version der Software Fibonacci aktualisiert. Wesentliche technische Änderungen an den hier beschriebenen Sicherheitsmaßnahmen werden den Kunden als Verantwortliche per E-Mail an die im Dienstvertrag angegebene Kontaktadresse mit angemessener Vorlaufzeit vor ihrem Inkrafttreten mitgeteilt. Version 0.2.
