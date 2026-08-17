> **Courtesy translation.** In case of any discrepancy, the Italian version of this document prevails.

# Privacy Notice

{AVVISO_BOZZA}

This notice describes the methods for processing personal data collected, stored, and processed within the institutional website Fibonacci ({URL_SITO}), the Fibonacci SaaS application accessible at {URL_APP}, and related services. This document is provided pursuant to Articles 13 and 14 of Regulation (EU) 2016/679 (hereinafter "GDPR") and Legislative Decree 30 June 2003, No. 196, as amended by Legislative Decree 10 August 2018, No. 101 (hereinafter "Privacy Code").

Fibonacci is a digital medical record for aesthetic medicine, aimed at Italian physicians and healthcare professionals and distributed as Software as a Service. Features include patient registry management, structured medical history, encrypted clinical photographs, 2D body mapping, AI-assisted dictation for medical histories and reports, generation and archiving of informed consents in PDF format, the AIFA drug catalogue, immutable audit logs in FHIR AuditEvent format, appointment scheduling, two-factor TOTP authentication, and native data exchange in FHIR R4 format.

> Preliminary notice: three distinct roles coexist within the service perimeter. For navigation data on the Fibonacci website and for data of physician clients subscribing to the software, Fibonacci acts as Data Controller. For patient data entered by physician clients into the software, Fibonacci acts as Data Processor pursuant to Article 28 GDPR, while the Data Controller is the physician client who has a professional relationship with the patient. The regulation of patient data processing is governed by the Data Processing Agreement (hereinafter "DPA"), signed concurrently with the service contract by the physician client, and is summarised in Section 3 and Section 8 of this notice.

## 1. Data Controller

The Data Controller for personal data processing is:

Name: {DENOMINAZIONE}
Registered office: {SEDE_LEGALE}
VAT number: {PARTITA_IVA}
REA number: {REA}
Certified email: {PEC}
Privacy contact: {EMAIL_PRIVACY}

For any questions regarding the processing of personal data, including the exercise of rights under Articles 15-22 GDPR, the contact channel is as follows:

Contact channel: {EMAIL_PRIVACY}

## 2. Essential Definitions

For the purposes of this notice, the following terms shall mean:

- "Data Controller": the natural or legal person who, alone or jointly with others, determines the purposes and means of the processing of personal data (Article 4(7) GDPR).
- "Data Processor": the natural or legal person who processes personal data on behalf of the Data Controller (Article 4(8) GDPR).
- "Data Subject": the identified or identifiable natural person to whom the personal data relate (Article 4(1) GDPR).
- "Personal Data": any information relating to an identified or identifiable natural person (Article 4(1) GDPR).
- "Special Categories of Personal Data": data referred to in Article 9 GDPR, including data concerning health, sex life, racial or ethnic origin, religious or philosophical beliefs.
- "Processing": any operation or set of operations performed on personal data, whether or not by automated means (Article 4(2) GDPR).
- "Sub-processor": the third party appointed by the Processor to carry out specific processing activities on behalf of the Data Controller, pursuant to Article 28(2) and (4) GDPR.

## 3. Categories of Processed Data

The Data Controller processes different personal data depending on the data subject segment. Below is the distinction.

### 3.1 Visitors to the Fibonacci Website

For visitors to the institutional website and potential clients filling out contact or demo request forms, the following data are processed:

- Identification and contact data: first name, last name, email address, telephone number, name of the practice or clinic, professional qualification, medical specialty;
- Navigation data: IP address, device identifiers, browser and operating system type, visited pages, date and time of visit, referring website, data collected via technical cookies and, with prior consent, analytical cookies;
- Free content of messages sent via contact forms.

### 3.2 Physician Clients Using the Software

For physicians and healthcare professionals subscribing to the Fibonacci software, the following data are processed:

- Identification and professional data: first name, last name, tax code, date and place of birth, address, registration number with the professional Order, specialisation, VAT number, billing data;
- Access credentials: email address, password hash, TOTP secret for two-factor authentication, access logs;
- Service usage data: account configuration, preferences, activity logs, audit trail of operations performed on the application;
- Payment data: data necessary for managing the subscription (account holder name, payment method reference) are processed by the sub-processor Stripe Payments Europe Ltd, which acts as an independent Data Controller for card data. Fibonacci does not retain full card numbers.

### 3.3 Patients of Physician Clients

Data of patients of client healthcare facilities, entered into the software by the physician client or their authorised collaborators, include identification data, contact details, clinical and medical history data, clinical photographs, reports, prescriptions, informed consents, and any other data necessary for providing healthcare services, including data belonging to the special categories referred to in Article 9 GDPR (particularly health data).

For such data, Fibonacci acts as Data Processor pursuant to Article 28 GDPR. The Data Controller is the physician client or healthcare facility using the software. Details on the categories of processed data, documented instructions, authorised sub-processors, and adopted security measures are governed by the Data Processing Agreement (DPA) signed concurrently with the service contract. The DPA is available upon request at {EMAIL_PRIVACY} and in the documentation section of the physician client’s reserved area.

Patients wishing to exercise their rights are invited to contact their treating physician as Data Controller. Fibonacci, as Data Processor, provides the physician Data Controller with the technical assistance necessary to respond to data subjects' requests.

## 4. Purposes and Legal Basis of Processing

Processing carried out by the Data Controller pursues the purposes indicated below, each based on a specific legal basis.

| Purpose | Data Category | Legal Basis |
| --- | --- | --- |
| Provision of the Fibonacci service to physician clients, account management, delivery of contractual functionalities (medical records, scheduling, document archiving, AI dictation, audit log) | Identification and professional data of the physician client, access credentials, usage logs | Article 6(1)(b) GDPR (performance of a contract to which the data subject is party) |
| Administrative, accounting, and fiscal management of relationships with physician clients (billing, debt collection, tax compliance) | Identification data, fiscal data, payment data | Article 6(1)(c) GDPR (compliance with a legal obligation) |
| IT security, fraud prevention, unauthorised access prevention, service integrity maintenance, security audits | Access logs, IP addresses, device identifiers, technical navigation data | Article 6(1)(f) GDPR (legitimate interest of the Data Controller in protecting the service and users) |
| Responding to requests submitted via contact forms and managing demo requests from potential clients | Contact data, message content | Article 6(1)(b) GDPR (performance of pre-contractual measures at the data subject’s request) |
| Sending promotional communications, newsletters, and informational materials about Fibonacci products | Email address, first name, last name, preferences | Article 6(1)(a) GDPR (specific, separate, and revocable consent) |
| Exercise or defence of a right in judicial proceedings | All relevant categories for the specific dispute | Article 6(1)(f) GDPR (legitimate interest of the Data Controller) and, where applicable, Article 9(2)(f) GDPR |
| Processing of patient data on behalf of the physician client Data Controller (medical record management, service archiving, report dictation) | Patient identification data, health data, clinical photographs, informed consents | For the physician Data Controller: Article 6(1)(b) GDPR and Article 9(2)(h) GDPR (purposes of preventive medicine, diagnosis, healthcare provision or treatment). For Fibonacci: Article 28 GDPR as Processor, according to documented instructions in the DPA |

Providing data for contractual, administrative, and security purposes is necessary for service provision. Refusal makes it impossible to provide the service. Consent to promotional communications is optional and revocable at any time, without prejudice to the contractual relationship and processing already carried out based on previously given consent.

## 5. Processing Methods and Security Measures

Processing is carried out using electronic tools, in compliance with the principle of integrity and confidentiality under Article 5(1)(f) GDPR and by adopting appropriate technical and organisational measures pursuant to Articles 24, 25, and 32 GDPR. Specifically:

- Encryption of clinical data and clinical photographs at rest using AES-256 algorithm;
- Protection of data in transit via TLS 1.3 with modern cipher suites;
- Mandatory two-factor authentication via TOTP for physician users accessing the software;
- Immutable audit log in FHIR AuditEvent format with cryptographic hash chains to ensure integrity and non-repudiation of operations;
- Logical and cryptographic compartmentalisation of data for each client practice or healthcare facility, ensuring each physician Data Controller accesses only data within their own perimeter;
- Strong password policy and progressive account lockout in case of repeated unauthorised access attempts;
- Encrypted daily data backups with a 30-day retention period and disaster recovery procedures;
- Primary infrastructure located within the European Union, at data centres in Germany;
- Periodic security testing, vulnerability analyses, and code reviews by qualified personnel;
- Training of authorised personnel and adoption of confidentiality agreements;
- Records of processing activities pursuant to Article 30 GDPR.

Data are accessible only to authorised Fibonacci personnel instructed as data processors pursuant to Article 29 GDPR and Article 2-quaterdecies of the Privacy Code.

## 6. Sub-processors and Data Recipients

For the execution of specific technical activities, the Data Controller engages the following sub-processors, appointed pursuant to Article 28(4) GDPR with written agreements containing sufficient guarantees regarding personal data protection:

| Sub-processor | Headquarters | Assigned Activity |
| --- | --- | --- |
| Aruba S.p.A. | Italy | Hosting of application and database infrastructure, encrypted backup storage |
| Hostinger International Ltd | Cyprus | Delivery of transactional emails (service notifications, first access, confirmations) and authoritative DNS for the domain |
| Mistral AI SAS | France | Voxtral audio transcription service used for assisted dictation. Audio is transmitted transiently, not persisted or used for model training, according to specific contractual agreements |
| Stripe Payments Europe Ltd | Ireland | Technical management of subscriptions, recurring payments, and billing data. Stripe does not receive health data or patient data |

The updated list of sub-processors is published and maintained in the documentation area reserved for physician clients. Any changes or additions are notified with adequate notice pursuant to the DPA.

Data may also be disclosed to:

- Professional consultants (accountants, lawyers, auditors) appointed as Data Processors or independent Data Controllers, within the scope of their services;
- Judicial, public security, supervisory, or public administration authorities, upon legitimate request and in cases provided by law;
- Third parties in the context of extraordinary operations (mergers, acquisitions, business unit transfers), subject to prior notice to data subjects.

Data are not subject to dissemination in any case.

## 7. Data Transfers Outside the European Union

The application infrastructure and databases are hosted entirely within the European Union, on Aruba S.p.A.’s Italian network infrastructure. Patient health data are not transferred outside the European Union.

**No intermediary is placed between the browser and the backend.** The website and application domains resolve directly to the infrastructure’s address: no content delivery networks, third-party reverse proxies, or third-party managed Web Application Firewalls are used, and there is no point at which a subject other than the Data Controller terminates the encrypted connection. This can be verified externally, without requesting our consent, via a DNS query on the domain.

The only sub-processor in the supply chain with resilience replicas outside the European Union is the payment provider, which **does not process health data or patient data**. For this flow, the transfer is governed by the Standard Contractual Clauses adopted by the European Commission with Implementing Decision (EU) 2021/914 of 4 June 2021, supplemented by additional measures in line with EDPB recommendations.

A copy of the Standard Contractual Clauses and the related Transfer Impact Assessment is available upon request by writing to {EMAIL_PRIVACY}.

## 8. Retention Period

Personal data are retained for the period strictly necessary for the purposes for which they were collected, in compliance with the principle of storage limitation under Article 5(1)(e) GDPR. Specific terms are indicated in the following table.

| Data Category | Retention Period |
| --- | --- |
| Identification and professional data of the physician client | Duration of the contract and subsequent 10 years from termination, for civil, fiscal, and tax compliance purposes (Article 2220 of the Italian Civil Code and Presidential Decree 600/1973) |
| Billing and payment data | 10 years from the issuance of the accounting document, pursuant to fiscal regulations |
| Access logs and security audit logs | 10 years, in line with the Garante’s provisions on system administrators and evidentiary needs in disputes |
| Navigation data and application logs not related to security | 12 months, unless retention is necessary for abuse investigations or defensive purposes |
| Session technical cookies | Duration of the browsing session |
| Analytical cookies (with consent) | Period indicated in the Cookie Policy, in any case not exceeding 12 months |
| Data collected via demo forms from potential clients | 24 months from the last contact; if no contract is concluded within this period, data are deleted. Early deletion upon request by the data subject |
| Newsletter subscription data | Until consent is revoked, in any case no longer than 24 months from the last interaction |
| Customer service communications | 24 months from request closure, unless defensive needs arise |
| Patient data processed on behalf of the physician client Data Controller | Retained according to the physician Data Controller’s instructions documented in the DPA. The general reference term for outpatient medical records is 20 years, unless otherwise specified by the Data Controller and without prejudice to specific regulatory obligations (e.g., longer terms for radiology or hospital records). Upon contract termination, data are returned to the physician Data Controller or deleted as provided in the DPA |

After the indicated terms, data are deleted or irreversibly anonymised, unless retention is required by law or for judicial protection purposes.

## 9. Data Subject Rights

The data subject may exercise at any time the rights recognised under Articles 15-22 GDPR, specifically:

- Right of access (Article 15 GDPR): obtain confirmation of processing and receive a copy of personal data;
- Right to rectification (Article 16 GDPR): obtain correction of inaccurate data or completion of incomplete data;
- Right to erasure (Article 17 GDPR): obtain deletion of data that are no longer necessary, subject to legal limitations, including healthcare and fiscal documentation retention obligations;
- Right to restriction of processing (Article 18 GDPR): in cases provided by law;
- Right to data portability (Article 20 GDPR): receive personal data provided in a structured, commonly used, and machine-readable format, and have them transmitted directly to another controller where technically feasible. For physician clients, an export function in ZIP format with FHIR R4 data is available;
- Right to object (Article 21 GDPR): object at any time to processing based on legitimate interest or direct marketing;
- Right to withdraw consent (Article 7(3) GDPR): withdraw consent at any time, without prejudice to the lawfulness of processing carried out before withdrawal;
- Right not to be subject to automated decision-making (Article 22 GDPR): no decision producing legal or significant effects is made solely on an automated basis. AI dictation and assistance functions support the healthcare professional, who retains full decision-making autonomy.

Requests may be addressed to the Data Controller at the following contacts:

- Data Controller email: {EMAIL_PRIVACY}
- Email: {EMAIL_PRIVACY}

The Data Controller provides a response within 30 days of receiving the request. The term may be extended by a further 60 days in case of particular complexity or a high number of requests, with reasons communicated to the data subject. The response is free of charge; the Data Controller reserves the right to request a cost contribution or refuse the request in case of manifestly unfounded or excessive requests, pursuant to Article 12(5) GDPR.

Patients of physician clients must address their requests to the physician Data Controller, who remains their primary contact. Fibonacci, as Data Processor, promptly assists the physician in responding to such requests, in accordance with Article 28(3)(e) GDPR.

## 10. Data Breach

In the event of a personal data breach, the Data Controller assesses the risk to data subjects' rights and freedoms and adopts necessary measures to contain and remedy the breach. Pursuant to Article 33 GDPR, the breach is notified to the Garante for the protection of personal data within 72 hours of becoming aware, unless the breach is unlikely to result in a risk to the rights and freedoms of natural persons.

Pursuant to Article 34 GDPR, when the breach is likely to result in a high risk to the rights and freedoms of data subjects, the Data Controller communicates the breach directly to the data subjects without undue delay, using clear language and providing useful information to protect themselves from potential consequences.

If the breach involves patient data processed on behalf of the physician client Data Controller, Fibonacci, as Data Processor, notifies the breach to the physician Data Controller without undue delay, providing the information necessary to enable compliance with notification obligations under Articles 33 and 34 GDPR, as governed by the DPA.

## 11. Complaint to the Supervisory Authority

The data subject who believes that the processing of their personal data violates the GDPR has the right to lodge a complaint with the competent supervisory authority, pursuant to Article 77 GDPR. In Italy, the supervisory authority is the Garante per la protezione dei dati personali, with the following contacts:

Garante per la protezione dei dati personali
Piazza Venezia 11, 00187 Rome
Website: www.garanteprivacy.it
Email: protocollo@gpdp.it
PEC: protocollo@pec.gpdp.it

The right to bring legal proceedings pursuant to Article 79 GDPR and Articles 140-bis and following of the Privacy Code remains unaffected.

## 12. Cookies

The Fibonacci website uses technical cookies necessary for the proper functioning of the site and, with the user's express consent, analytical and third-party cookies. For details on the types of cookies used, their purposes, and how to manage preferences, please refer to the Cookie Policy available at /cookie.

## 13. Minors

The Fibonacci service is intended for adult healthcare professionals holding the professional qualifications required by Italian law. The institutional website and software subscription area are not directed at individuals under 18. The Data Controller does not knowingly collect data of minors in relation to its relationships with physician clients.

If a patient of the physician client is a minor, data collection and processing are the responsibility of the physician Data Controller, who obtains parental or legal guardian consent as required by healthcare regulations and Legislative Decree 101/2018. Fibonacci provides the physician Data Controller with the technical tools to manage parental consent.

## 14. Changes to the Notice

This notice may be updated at any time to reflect regulatory changes, service developments, or organisational changes by the Data Controller. The current version is always published on Fibonacci/privacy with the date of the last revision.

Substantial changes, understood as changes significantly affecting processing purposes, legal bases, sub-processors, or data subjects' rights, are notified via email to registered users and highlighted in the reserved area, with adequate notice before the changes take effect.

Use of the service following the publication of changes constitutes acceptance thereof, without prejudice to the right of withdrawal and data subject rights.

## 15. Last Revision

Date of last revision: {ULTIMA_REVISIONE}
Document version: 0.1 (internal draft)

> Final notice: this document is a template adapted to the Fibonacci service context and will undergo legal review before commercial activities commence. The version published here is an internal draft numbered 0.1 and does not replace the advice of a qualified legal consultant. Any comments, corrections, or additions may be sent to {EMAIL_PRIVACY}.
