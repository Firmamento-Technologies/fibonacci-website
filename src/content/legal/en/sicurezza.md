> **Courtesy translation.** In case of any discrepancy, the Italian version of this document prevails.

# Security and Data Protection

**Version 0.2 · Last revision: {ULTIMA_REVISIONE}**

{AVVISO_BOZZA}

This technical sheet describes the security, technical, and organizational measures adopted by Fibonacci (hereinafter, "Fibonacci" or the "Processor") in providing the Fibonacci digital medical record SaaS software (hereinafter, the "Service" or "Fibonacci"). The document is issued pursuant to Article 32 of Regulation (EU) 2016/679 (hereinafter, "GDPR") and constitutes Annex A of the Data Processing Agreement (DPA) signed by the physician customer as Data Controller. The measures described apply to the processing of special categories of data pursuant to Article 9 GDPR (health-related data) carried out on behalf of the Controller within the scope of the Service.

The document is published at {URL_SITO}/sicurezza and is subject to periodic updates based on the technological evolution of the Service and the state of the art in cybersecurity. Significant technical changes are notified to customer Controllers as indicated at the end of this document.

---

## 1. Security Architecture

Fibonacci’s security architecture is structured on three concentric levels, each implementing independent and complementary controls. The defense logic follows a defense-in-depth approach: the failure of a single level is not sufficient to compromise the confidentiality, integrity, or availability of clinical data.

### 1.1 Network Level (Perimeter)

The network perimeter is hosted on Aruba S.p.A.’s infrastructure, on an Italian network and therefore within the European Union. Inbound traffic passes exclusively through a Caddy reverse proxy that terminates TLS 1.3 and applies the HTTP security headers described in Section 6. The application backend is not directly exposed to the public Internet: Docker containers communicate over a private network, and administrative access to hosts is permitted exclusively from authorized IP addresses via SSH key, without password authentication.

**No network intermediaries are interposed.** The Service domain resolves directly to the address of the infrastructure described above: no content delivery networks, third-party reverse proxies, or third-party managed Web Application Firewalls are used, and there is no point at which an entity other than the Processor terminates the encrypted connection from the browser. This can be verified externally via a DNS query on the Service domain.

### 1.2 Application Level

At the application level, Fibonacci implements multi-factor authentication, hardened sessions, role-based access control (RBAC), and FHIR-based compartmentalization per medical tenant. Each request is validated by server-side input sanitization middleware, CSRF control, and rate limiting per user and per IP address. The application logic is written in strongly typed languages and follows secure development practices described in Section 7.

### 1.3 Data Level

At the data level, Fibonacci applies encryption on two axes: volume-level filesystem encryption for the entire PostgreSQL instance and AES-256 GCM application-level encryption for columns containing sensitive identifiers and photo files. Application encryption keys (Key Encryption Keys, KEK) are managed server-side and never transmitted to the physician user’s browser. Every CRUD operation on clinical resources is logged in an immutable audit log in FHIR AuditEvent format, signed in a SHA-256 hash chain (Section 4).

### 1.4 Simplified Flow Diagram

```
                              TLS 1.3, no intermediaries
   [Physician’s browser]  ----------------------------------->  [Caddy reverse proxy / Aruba IT]
                       (httpOnly Secure cookie)                     |
                                                                    |  private network
                                                                    v
                                                       [Fibonacci app container]
                                                                    |
                                       +----------------------------+----------------------------+
                                       |                            |                            |
                                       v                            v                            v
                              [Encrypted PostgreSQL]      [AES-256 encrypted photo storage]   [Hash-chain audit log]
                                       |
                                       v
                                  [Daily AES-256 encrypted backup]
```

---

## 2. Encryption

Encryption is the primary measure to mitigate the risk of data exfiltration and unauthorized access. Fibonacci applies encryption in transit, at-rest filesystem encryption, and application-level columnar and binary payload encryption.

| Component | What it does (WHAT) | Risk mitigated (WHY) | Technology and parameters (HOW) |
| --- | --- | --- | --- |
| Client-server transport | Encrypts all communication between the physician’s browser and backend | Network interception, man-in-the-middle attacks | TLS 1.3 with IETF-recommended AEAD cipher suites, HSTS preload, Forward Secrecy via ECDHE |
| Database filesystem | Encrypts the PostgreSQL database volume at the block level | Physical disk exfiltration, unauthorized volume access | Volume-level filesystem encryption with host-managed keys, derived from a non-resident master key |
| Application-level columnar encryption | Encrypts the most sensitive medical record fields at the application level before database write | Database exfiltration, access by infrastructure operators | AES-256 GCM with integrity guaranteed by auth-tag, unique nonce per record, server-side KEK |
| Clinical photo encryption | Encrypts binary photo files before storage | Object storage exfiltration, unauthorized file access | AES-256 GCM with KEK managed by the pdf-signer sidecar, server-side on-demand decryption upon authorized delivery |
| Backup | Encrypts the backup package before off-site transfer | Backup exfiltration, media loss | AES-256 on the snapshot package, key separate from the application KEK |

### 2.1 Key Management

Application encryption keys (Key Encryption Keys) are held server-side and are never exposed to the physician user’s browser. Data Encryption Keys (DEK) for individual records are derived in memory on the backend at the time of write or read operations. Keys are not included in backups within the same package as encrypted data. KEK rotation is a documented procedure and incrementally re-encrypts existing data without service interruption.

### 2.2 Integrity

GCM (Galois/Counter Mode) ensures both confidentiality and integrity. The auth-tag verifies that the payload has not been altered and rejects any attempt to manipulate the ciphertext. This property is particularly relevant for clinical photos, where the modification of a single bit would invalidate the evidentiary value of the data.

---

## 3. Access Control and Authentication

Digital identity is the primary attack surface of a cloud-based healthcare application. Fibonacci adopts multi-factor authentication, robust password hashing, hardened sessions, and data domain compartmentalization based on role and FHIR.

### 3.1 Authentication

| Measure | WHAT | WHY | HOW |
| --- | --- | --- | --- |
| Password hashing | Stores only the non-reversible digest of the password | User database exfiltration, offline brute force | bcrypt with cost factor calibrated based on load, random salt per user |
| MFA TOTP | Requires a second factor at login | Credential theft, compromised password reuse, phishing | RFC 6238 TOTP with 30-second intervals, mandatory for admin roles, recommended and activatable by the physician for their own account |
| Recovery codes | Allows account recovery in the absence of the TOTP device | Device loss, user lock-out | One-time codes generated at MFA setup, hash-only in database, invalidated after use |
| Login rate limiting | Blocks automated attempts | Brute force, credential stuffing | Throttling per IP and per user on login, MFA verify, and dictation endpoints |

### 3.2 Session

User sessions are managed via httpOnly, Secure, and SameSite=Strict cookies. The httpOnly attribute prevents client-side JavaScript access to the cookie, reducing the impact of potential XSS vulnerabilities. The Secure attribute enforces transmission only over TLS. The SameSite=Strict attribute mitigates cross-site request forgery and cross-site leak attack classes. The session token is subject to rotation: every privilege elevation (login, password change, MFA activation) issues a new identifier and invalidates the previous one.

### 3.3 RBAC and Compartmentalization

Access to clinical resources is governed by an RBAC model with the following minimum roles:

| Role | Typical capabilities |
| --- | --- |
| admin | Organization configuration, user management, audit panel access, no default clinical access |
| physician | Full access to own patients, record creation, dictation, consent signing |
| secretary | Access to registry and schedule, limited clinical access according to Controller’s policy |
| user | Minimum profile, self-service access to own configuration |

Above the RBAC model, FHIR compartmentalization operates via Medplum AccessPolicy: each physician is isolated to their own patients, FHIR queries are filtered at the server level, and any cross-tenant read attempt returns a denial, logged in the audit log. Compartmentalization is the primary measure to mitigate lateral movement risk and unauthorized access between distinct clinics sharing the same instance.

---

## 4. Integrity and Traceability

For healthcare applications, data integrity is essential for its evidentiary and clinical value. Fibonacci implements an immutable audit log in FHIR AuditEvent format with cryptographic chaining of entries (hash-chain).

### 4.1 Audit Log

Every CRUD operation on FHIR resources (Patient, Encounter, Observation, Condition, MedicationStatement, DocumentReference, Consent, ImagingStudy, and similar) generates an AuditEvent entry containing:

- actor identifier (physician, role, session);
- high-resolution UTC timestamp;
- action type (create, read, update, delete, sign);
- reference to the involved resource;
- outcome (success, failure) and reason for any denial;
- source IP address and user agent.

### 4.2 Hash-Chain

Each audit entry incorporates the SHA-256 digest of the previous entry, constructing a hash chain analogous to an append-only ledger. Any retroactive manipulation of an intermediate entry would break the chain and be detectable via deterministic verification of the log. The digest of the last entry can be exported as periodic integrity proof.

### 4.3 Access and Retention

The audit log is accessible to the Controller via the /audit section of the reserved area, with filters for actor, resource, and time window. Retention is ten years from the event, consistent with the obligation to retain medical documentation. Upon expiration, the record is securely deleted or anonymized according to the Controller’s instructions.

---

## 5. Availability and Backup

Continuous access to clinical data is a security property equal to confidentiality and integrity, and is specifically addressed by Article 32(1)(b) and (c) GDPR.

| Measure | WHAT | WHY | HOW |
| --- | --- | --- | --- |
| Daily backup | Saves a daily snapshot of the database and storage | Data loss due to incident, ransomware, operational error | AES-256 encrypted snapshot, generated during low-traffic nighttime window |
| 30-day retention | Maintains 30 rolling backup versions | Slow exfiltration, undetected corruption | Retention of encrypted packages with 30-day rotation |
| Continuous transaction log archiving | Enables point-in-time recovery, not just the last nightly snapshot | Loss of hours after the last backup | Write-Ahead Log archiving, scheduled job every 5 minutes |
| RPO 24h | Defines the maximum acceptable data loss point | Backup planning constraint | Guaranteed by daily backup frequency |
| RTO 24h | Defines the maximum service recovery time | Disaster recovery planning constraint | Documented recovery procedure, tested quarterly with recovery time measurement |

### 5.1 Off-Site Copy: Declared Limitation

⚠️ **As of this revision, the backup copy resides on the same machine it protects.** The system for replication to a third-party provider is installed and active (the scheduled job runs, and in the absence of a configured destination, it explicitly logs this), but the remote destination has not yet been purchased and configured. The consequence must be stated in full: **today, the loss of the hosting provider would result in the loss of both the system and its backup.**

This limitation is declared here, and not in a footnote, because it is precisely the kind of information a Controller must know **before** entrusting data to a Processor, and because the off-site copy is specifically addressed by Article 32(1)(c) GDPR. The remote destination will be a provider **different** from the one hosting the primary infrastructure, and located within the European Union: a copy retained by the same provider is not an off-site copy.

This paragraph will be replaced by the description of the active measure once it is operational and verified.

### 5.2 Recovery Testing

Quarterly, a full recovery test is performed from the most recent backup, on a non-production instance, verifying the integrity of the restored data and the actual recovery time. The test outcome is recorded and retained as evidence pursuant to Article 32(1)(d) GDPR (procedure for regularly testing, assessing, and evaluating the effectiveness of technical and organizational measures).

---

## 6. Application Hardening

Fibonacci adopts a front-end and back-end hardening configuration aimed at reducing the attack surface of the most relevant OWASP Top 10 classes for web applications.

| Control | WHAT | WHY | HOW |
| --- | --- | --- | --- |
| Strict Content Security Policy | Limits permitted sources for scripts, styles, images, and connections | Cross-site scripting, data exfiltration | Strict CSP without inline scripts, explicit allowlist of only necessary origins |
| HSTS preload | Forces the browser to contact the domain only via HTTPS, even on first access | HTTP downgrade, attacks on untrusted Wi-Fi | Strict-Transport-Security header with high max-age and preload flag, domain included in the preload list |
| X-Frame-Options DENY | Prohibits embedding the Service in external iframes | Clickjacking, UI redress | X-Frame-Options: DENY header on every application backend response |
| X-Content-Type-Options nosniff | Disables browser MIME sniffing | Execution of content as types other than declared | X-Content-Type-Options: nosniff header |
| Permissions-Policy | Disables unnecessary browser APIs (geolocation, microphone where not required, USB, serial, payment) | Reduces client-side attack surface | Restrictive Permissions-Policy, explicit activation only where required (e.g., microphone only on the dictation page) |
| CSRF token | Protects state-changing requests from cross-origin issuance | Cross-site request forgery | Per-session CSRF token, server-side validation on every POST, PUT, PATCH, DELETE |
| Rate limiting | Limits request frequency on sensitive endpoints | Brute force, scraping, abuse of paid services (dictation) | Differentiated limits per IP and per user on login, MFA verify, dictation, and bulk export endpoints |
| Input sanitization | Validates and normalizes every input before use | Injection (SQL, NoSQL, command), reflected XSS, path traversal | Schema-driven server-side validation, parameterized database queries, context-aware output escaping |

---

## 7. Secure Development (Secure SDLC)

Security is integrated into the software development lifecycle (Security by Design pursuant to Article 25 GDPR) through automated controls and human review at every code change.

| Phase | Control | WHY | HOW |
| --- | --- | --- | --- |
| Pre-merge | Mandatory code review | Logical defects, security regressions | At least one reviewer distinct from the author approves each pull request |
| Pre-merge | Static analysis SAST | Pattern vulnerabilities (injection, auth bypass, secret leak) | Semgrep and CodeQL run on every pull request, merge blocked for High or Critical findings |
| Pre-merge | Dependency scanning | Third-party library vulnerabilities, supply chain | npm audit and Dependabot active, automatic alerts for High and Critical CVEs, timely upgrades |
| Pre-merge | E2E testing | Functional regressions on critical flows | Playwright suite on login, MFA, record creation, dictation, consent, and export flows |
| Post-deploy | OWASP ZAP baseline pen test | Runtime and configuration vulnerabilities | Monthly execution on production environment, triage and remediation of non-false-positive findings |
| Continuous | Team training | Errors from misinformation, practice drift | Annual GDPR + application security training, OWASP community participation, designated security champion |

Production secrets (keys, tokens, service passwords) are managed via the infrastructure’s secret manager, are never present in the source code, and are rotated periodically or following any suspected exposure.

---

## 8. Incident Management and Data Breach

Fibonacci adopts a documented incident response procedure defining roles, escalation thresholds, notification timelines, and communication methods with the Controller.

### 8.1 Notification to the Controller

In the event of a personal data breach pursuant to Article 4(12) GDPR involving data processed on behalf of the Controller, Fibonacci notifies the Controller of the event within **24 hours of discovery**. This term is stricter than the minimum "without undue delay" term provided by Article 33(2) GDPR for the Processor, and aims to provide the Controller with ample margin relative to the 72 hours under Article 33(1) for their potential notification to the Supervisory Authority.

The notification to the Controller includes, to the extent available at the time of the initial communication:

- description of the nature of the breach;
- categories and approximate number of data subjects and records involved;
- likely consequences;
- technical and organizational measures taken or proposed for containment;
- operational contact point within Fibonacci.

Any missing information at the time of the first notification is transmitted to the Controller incrementally as soon as available, in line with EDPB Guidelines 9/2022.

### 8.2 Escalation and Cooperation

The internal procedure provides for the immediate activation of an incident manager, isolation of the involved asset, preservation of forensic evidence, and opening of an incident log. Fibonacci actively cooperates with the Controller in assessing the risk to data subjects and in preparing any notification to the Authority or data subjects. Upon incident closure, a post-mortem is drafted and shared with the Controller, containing the timeline, root cause, remediation actions taken, and long-term corrective actions (lessons learned).

### 8.3 Register

All incidents, regardless of their final qualification as notifiable breaches, are recorded in the internal incident register, retained for audit and evidence purposes pursuant to Article 33(5) GDPR.

---

## 9. International Transfers

For the processing of patients' health data, Fibonacci does not carry out any transfer outside the European Union. The entire application stack, database, photo storage, and backups reside on Aruba S.p.A.’s infrastructure, on an Italian network.

### 9.1 Absence of Extra-EU Intermediaries on the Data Path

The path that clinical data travels between the physician’s browser and the database **does not pass through any extra-EU entity**, and this is by design, not configuration: no content delivery networks, third-party reverse proxies, or third-party managed Web Application Firewalls are used. The Service domain resolves directly to the infrastructure’s address, and the encrypted connection is terminated solely by the Processor’s reverse proxy.

The difference from the common setup in the sector must be stated because it is why this section is brief: when an intermediary is present, the extra-EU transfer of network metadata exists and must be justified with Standard Contractual Clauses and supplementary measures. Here, **no transfer exists**, so no justification is needed. This can be verified by anyone, externally and without our consent, via a DNS query on the Service domain.

### 9.2 Residual Transfers and Their Scope

The only sub-processor in the chain with resilience replicas outside the European Union is the payment provider listed in Annex B, which **does not process patient data** or any clinical data: the payment chain is segregated from the clinical chain, and reconciliation occurs via opaque identifiers. For this provider, the Standard Contractual Clauses under Implementing Decision (EU) 2021/914 apply.

### 9.3 Other Extra-EU Sub-Processors

Any other extra-EU sub-processors are authorized only with the Controller’s consent as governed by the DPA and are subject to the same guarantees (SCCs, supplementary measures, transfer risk assessment).

---

## 10. Business Continuity

⚠️ **This section previously described a redundant architecture that the Service does not have.** The earlier version claimed deployment across multiple availability zones, multiple reverse proxy instances behind health checks, and streaming database replication with automatic promotion. None of this is operational: the Service runs on **a single host**, and declaring non-existent redundancy in a signed technical annex is precisely the kind of statement the Controller cannot verify independently and has the right not to be misled about.

Below is the actual state, distinguishing between what is active and what is planned.

| Component | Status | WHY | HOW |
| --- | --- | --- | --- |
| Location | **Active** | Jurisdiction and applicable law are known and verifiable | Single host at Aruba S.p.A., Italian network, European Union |
| Network isolation | **Active** | Reduces exposed surface | Only the reverse proxy is reachable from the Internet; application services communicate over a private network between containers |
| Daily backup | **Active** | Data loss due to incident, operational error, ransomware | Nightly encrypted snapshot, 30-day rotation |
| Point-in-time recovery | **Active** | Loss of hours after the last snapshot | Continuous transaction log archiving, scheduled job every 5 minutes |
| Recovery test | **Active** | A backup never restored is not a backup | Scheduled recovery and verification job, outcome recorded |
| Off-site copy | **Planned** | Loss of hosting provider | See the declared limitation in Section 5.1: system installed, remote destination not yet activated |
| Host redundancy | **Planned** | Fault tolerance of a single machine | Not operational. A host failure results in Service unavailability until recovery |
| Formalized continuity plan | **Planned** | Coordination of recovery actions | Recovery procedures are documented and executed; their formalization in an approved plan follows the company’s establishment |

---

## 11. Training and Governance

Technical security is effective only if accompanied by coherent organizational governance. Fibonacci integrates training obligations and defined responsibilities within its structure.

| Measure | WHAT | WHY | HOW |
| --- | --- | --- | --- |
| Annual training | Technical staff training on GDPR and application security | Reduces human error, aligns with the state of the art | Mandatory annual course for all personnel accessing systems processing personal data, certificates retained |
| Onboarding | Security checklist for new hires | Initial alignment with security requirements | Formalized procedure with credential delivery, MFA activation, internal policy review, code of conduct acceptance |
| Security champion | Internal point of contact for security issues | Rapid resolution of technical questions, internal escalation | Designation of a security champion within the technical team |
| Code access | Principle of least privilege | Reduces internal exfiltration risk | Repository and infrastructure access granted by role, periodic review of permissions |
| Asset management | Information asset inventory | Complete knowledge of the perimeter to protect | Updated inventory of systems, services, dependencies, and data flows |

---

## 12. Certifications and Reference Standards

At present, Fibonacci **is not ISO/IEC 27001 certified**. Despite the lack of certification, Fibonacci voluntarily adopts the applicable controls from Annex A of ISO/IEC 27001:2022 as a reference framework for its security posture, particularly in the areas of organizational, people, physical, and technological controls. This reference does not constitute a certified compliance declaration and should not be interpreted as a certification claim.

### 12.0 What is Certified, and by Whom: The Critical Distinction

Certifications covering part of the Service belong to the **infrastructure provider**, not Fibonacci. This distinction is stated here because it is the one a less scrupulous provider might omit, displaying their host’s certification as if it were their own.

| Level | Who is responsible | What is certified or declared | How to verify |
| --- | --- | --- | --- |
| Data center and infrastructure | Aruba S.p.A. | **ISO/IEC 27001 certification**; adherence to the **CISPE Data Protection Code of Conduct**, a code of conduct under **Article 40 GDPR** approved by the CNIL in 2021 | Public CISPE register; declarations published by the provider |
| Application, data, processes | Fibonacci | **No third-party certification.** Self-declared GDPR compliance based on internal documentation and retained evidence | This document, the DPA, and Annex B, all public and without request forms |

⚠️ **What this means in practice**: The fact that the data center is ISO/IEC 27001 certified says something about the physical and organizational security of the server room, and **nothing** about the quality of Fibonacci’s application code, its access control model, or its key management. Presenting the host’s certification as a guarantee of one’s own software answers a different question than the one asked.

GDPR compliance, particularly the principles of security by design and by default (Article 25 GDPR) and appropriate technical and organizational measures (Article 32 GDPR), is self-certified by the Processor based on internal documentation and retained process evidence.

Among the additional standards and guidelines considered in designing the measures described in this document, though not subject to certification, are:

- OWASP Top 10 2021 and OWASP Application Security Verification Standard (ASVS) for secure development and application hardening practices;
- NIST Special Publication 800-53 for the security control vocabulary;
- EDPB Guidelines 9/2022 on the notification of personal data breaches.

### 12.1 Certification Roadmap

Fibonacci has set the initiation of the ISO/IEC 27001 certification process as a goal upon reaching the first consolidated round of pilot Service customers. The roadmap’s progress is communicated transparently to customer Controllers through periodic updates of this document and, where appropriate, dedicated communications.

### 12.2 European Health Data Space: The Upcoming Obligation

**Regulation (EU) 2025/327** establishes the European Health Data Space (EHDS) and sets a harmonized framework for **electronic health record systems**. The regulation applies from **26 March 2027**; for systems intended to process the priority categories of personal electronic health data under Article 14(1)(a), (b), and (c), the relevant provisions apply from **26 March 2029**.

For an electronic health record system, the setup required by the regulation entails: drafting **technical documentation** (Article 37), a **product information sheet** accompanying the system (Article 38), a **EU declaration of conformity** with the essential requirements of **Annex II** (Article 39), assessment of harmonized software components in a **European digital testing environment** (Article 40), affixing the **CE conformity marking** (Article 41), and registration in the **EU database** of electronic health record systems (Article 49).

**Fibonacci is not currently a CE-marked system under Chapter III of Regulation (EU) 2025/327, and does not claim to be.** The marking cannot currently be affixed: the common specifications of the European digital testing environment and the European format for electronic health record exchange are delegated to Commission implementing acts.

What can be declared today is the product’s status relative to the requirements of Annex II that **do not depend** on such implementing acts:

| Requirement (Annex II) | Status | Evidence |
| --- | --- | --- |
| 2.6 absence of features that make authorized data export burdensome to replace the system with another product | **Satisfied** | Full export in FHIR R4 format is a product feature, available to the Controller at any time without Processor authorization |
| 3.1 reliable mechanisms for identifying and authenticating healthcare professionals | **Satisfied** | Section 3 of this document |
| 3.2 and 3.3 access logging and tools to examine and analyze log data | **Satisfied** | Section 4: FHIR AuditEvent log with hash chaining, accessible to the Controller with filters for actor, resource, and time window |
| 3.4 support for differentiated retention periods and access rights based on data origin and category | **Partial** | Differentiated retention active; granularity by data origin is under extension |
| 2.1, 2.2, 2.3, 2.4 interoperability in the European exchange format | **Not applicable at present** | The European exchange format is delegated to implementing acts not yet adopted. The product currently uses FHIR R4, which is the technical basis for the European format |

---

## 13. Operational Contacts

| Function | Contact |
| --- | --- |
| IT Security and Vulnerability Reporting | {EMAIL_SICUREZZA} |
| Data Protection Contact | {EMAIL_PRIVACY} |
| Privacy and Data Processing Issues | {EMAIL_PRIVACY} |

Vulnerability reports are welcome and managed in line with responsible disclosure practices. Upon request, a secure channel can be established using the security team’s PGP key. Fibonacci commits to providing an initial response to the reporter within a reasonable time from receipt, not to pursue legal action for reports made in good faith and within the indicated scope, and to publicly acknowledge the reporter’s contribution unless anonymity is requested.

---

## 14. Last Revision

Last revision of this document: {ULTIMA_REVISIONE}.

> This document is descriptive and updated to the current version of Fibonacci software. Significant technical changes to the security measures described herein are notified to customer Controllers via email at the contact address provided in the Service Agreement, with reasonable notice prior to their entry into force. Version 0.2.
