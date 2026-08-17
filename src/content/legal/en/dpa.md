> **Courtesy translation.** In case of any discrepancy, the Italian version of this document prevails.

# Data Processing Agreement (DPA)

**Version 0.1 (internal draft) · Last revised: {ULTIMA_REVISIONE}**

{AVVISO_BOZZA}

This Data Processing Agreement (hereinafter, the "DPA" or "Agreement") is entered into pursuant to and for the purposes of Article 28 of Regulation (EU) 2016/679 (hereinafter, "GDPR") and Legislative Decree 196/2003 as amended by Legislative Decree 101/2018 (hereinafter, the "Privacy Code"), and governs the relationship between the Parties with regard to the processing of personal data carried out by the Processor on behalf of the Controller within the scope of the Fibonacci Service.

This DPA constitutes an integral and substantial part of the Fibonacci Service Agreement entered into between the Parties (hereinafter, the "Service Agreement") and shall remain in force for the same duration as the latter.

---

## Art. 1 · Recitals

1.1. The Controller has entered into a Service Agreement with the Processor for the provision of the Fibonacci software, a SaaS digital medical record application for aesthetic medicine, delivered by the Processor to the Controller in cloud mode, accessible at `{URL_APP}`.

1.2. The performance of the Service Agreement entails the processing, by the Processor on behalf of the Controller, of personal data and special categories of data pursuant to Article 9 GDPR, relating to the Controller’s patients.

1.3. The Parties acknowledge that this DPA is necessary to regulate their mutual obligations and rights under Article 28 GDPR and to ensure compliance of the processing with the applicable data protection legislation.

1.4. This DPA shall prevail, with respect to the matters governed herein, over any conflicting provisions contained in the Service Agreement or in other agreements between the Parties.

1.5. The duration of this DPA coincides with that of the Service Agreement. Obligations that by their nature are intended to survive the termination of the relationship (confidentiality, data return and deletion obligations, cooperation with the supervisory authority) shall remain effective even after the termination of the Service Agreement.

---

## Art. 2 · Identification of the Parties

### 2.1. Controller

| Field | Value |
| --- | --- |
| Company name or professional title | {TITOLARE_RAGIONE_SOCIALE} |
| Registered office or professional practice | {TITOLARE_SEDE} |
| VAT number | {TITOLARE_PIVA} |
| Tax Code | {TITOLARE_CF} |
| Contact email | {TITOLARE_EMAIL} |
| Telephone | {TITOLARE_TELEFONO} |
| Legal representative | {TITOLARE_LEGALE_RAPPRESENTANTE} |
| Data Protection Officer (DPO), if appointed | {TITOLARE_DPO} |

### 2.2. Processor

| Field | Value |
| --- | --- |
| Company name | {DENOMINAZIONE} |
| Registered office | {SEDE_LEGALE} |
| VAT number | {PARTITA_IVA} |
| REA number | {REA} |
| Certified email (PEC) | {PEC} |
| Contact channel | {EMAIL_PRIVACY} |
| Data protection contact | {EMAIL_PRIVACY} |

Hereinafter, the Controller and the Processor shall be collectively referred to as the "Parties" and individually as a "Party".

---

## Art. 3 · Definitions

For the purposes of this DPA, terms beginning with a capital letter shall have the meaning set out below. For terms not expressly defined herein, the definitions provided in Article 4 GDPR shall apply.

- **Controller**: the entity identified in Article 2.1, which determines the purposes and means of the processing of patients' personal data, pursuant to Article 4(7) GDPR.
- **Processor**: Fibonacci, as identified in Article 2.2, which processes personal data on behalf of the Controller pursuant to Article 4(8) GDPR.
- **Sub-processor**: any other entity appointed by the Processor to carry out specific processing activities on behalf of the Controller, pursuant to Article 28(2) and (4) GDPR.
- **Personal data**: any information relating to an identified or identifiable natural person (the Data Subject), processed within the scope of the Service, pursuant to Article 4(1) GDPR.
- **Special categories of data**: personal data referred to in Article 9 GDPR, with particular reference to health data processed within the scope of the Service.
- **Processing**: any operation or set of operations performed on personal data, pursuant to Article 4(2) GDPR.
- **Data Subject**: the natural person to whom the personal data relate. For the purposes of this DPA, Data Subjects are the Controller’s patients and, where relevant, their guardians or next of kin.
- **Personal data breach**: a breach of security leading to the accidental or unlawful destruction, loss, alteration, unauthorised disclosure of, or access to, personal data, pursuant to Article 4(12) GDPR.
- **Software**: the Fibonacci SaaS digital medical record application, delivered by the Processor to the Controller in cloud mode.
- **Service**: the set of services provided by the Processor to the Controller under the Service Agreement, including the provision of the Software, its maintenance, technical support, and ancillary functionalities.

---

## Art. 4 · Subject matter, nature, purposes, and duration of processing

4.1. **Subject matter**. The Processor shall process personal data on behalf of the Controller only to the extent strictly necessary for the provision of the Fibonacci Service, as defined in the Service Agreement.

4.2. **Nature of processing**. The processing is of an IT and automated nature and includes, by way of example and without limitation: collection, recording, organisation, structuring, storage, adaptation, alteration, retrieval, consultation, use, disclosure by transmission, alignment, erasure, and destruction of personal data.

4.3. **Purposes of processing**. The processing is carried out solely for the purpose of providing the Controller with the functionalities of the Fibonacci Service, and in particular:

- a) storage and management of the digital medical records of the Controller’s patients;
- b) generation and archiving of informed consent forms in PDF format;
- c) automatic transcription of the Controller’s audio dictations via artificial intelligence service;
- d) encrypted storage of patients’ clinical photographs;
- e) recording of operations performed on the account for audit purposes;
- f) provision of ancillary functionalities set out in the Service Agreement (notifications, appointment scheduling, client invoicing if enabled).

4.4. **Duration**. The processing shall last for the duration of the Service Agreement. Upon termination of the Service Agreement, the provisions of Article 12 of this DPA shall apply.

---

## Art. 5 · Categories of Data Subjects and types of personal data

5.1. **Categories of Data Subjects**. The following are Data Subjects:

- a) the Controller’s patients, whose clinical and administrative information is entered into the Software;
- b) legal guardians, holders of parental responsibility, or next of kin of minor or incapacitated patients, limited to contact and relationship data.

5.2. **Types of personal data processed**. The following categories of personal data relating to Data Subjects shall be processed:

- a) **Identification data**: first name, surname, tax code, date of birth, gender, place of birth.
- b) **Contact data**: postal address, email address, telephone number.
- c) **Health data (special category under Article 9 GDPR)**: medical history (allergies, past and current conditions, medications taken, family history, lifestyle), test results, diagnoses, treatments performed (date, product, batch, quantity, body area), prescriptions, clinical photographs.
- d) **Temporary dictation audio**: audio recordings of the Controller’s voice, sent to the sub-processor Mistral AI for automatic transcription and not retained beyond the processing session.
- e) **Informed consent forms**: PDF documents signed by Data Subjects, including informed consent forms for aesthetic medicine and general consent forms for other specialties.
- f) **Audit log**: recording of creation, reading, modification, and deletion operations performed on the Controller’s clinical resources.
- g) **Patients’ payment data** (optional, where the Controller enables the client invoicing functionality via the Software, currently not released): invoiced amounts, patients’ tax details.

5.3. The Controller warrants that it has obtained all necessary consent from Data Subjects or has another valid legal basis for the processing of personal data, including data referred to in Article 9 GDPR, and has provided Data Subjects with the privacy notice pursuant to Articles 13 and 14 GDPR.

---

## Art. 6 · Processor’s obligations

In accordance with Article 28(3) GDPR, the Processor undertakes to:

6.1. **a) Documented instructions**. Process personal data only on the basis of documented instructions from the Controller, including in the case of a transfer of personal data to a third country or an international organisation, unless required to do so by Union or Member State law to which the Processor is subject; in such a case, the Processor shall inform the Controller of that legal requirement before processing, unless that law prohibits such information on important grounds of public interest. The following shall constitute documented instructions from the Controller: the Service Agreement, this DPA, the Software configurations made by the Controller via the application interface, and written communications addressed to the Processor’s technical support.

6.2. **b) Confidentiality of personnel**. Ensure that persons authorised to process personal data have committed themselves to confidentiality or are under an appropriate statutory obligation of confidentiality, and are trained on data protection.

6.3. **c) Technical and organisational measures**. Implement appropriate technical and organisational measures, pursuant to Article 32 GDPR, as detailed in Article 9 of this DPA, to ensure a level of security appropriate to the risk.

6.4. **d) Sub-processors**. Engage sub-processors only with the Controller’s prior authorisation, in accordance with Article 7 of this DPA, ensuring that the same data protection obligations as set out in this DPA are imposed on sub-processors by way of a contract or other legal act.

6.5. **e) Assistance with Data Subjects’ rights**. Taking into account the nature of the processing, assist the Controller by appropriate technical and organisational measures, insofar as this is possible, for the fulfilment of the Controller’s obligation to respond to requests for exercising the Data Subject’s rights laid down in Articles 12-23 GDPR (access, rectification, erasure, restriction, portability, objection). The Software provides the Controller with specific functionalities to extract, rectify, and erase Data Subjects’ data.

6.6. **f) Assistance with security, data breaches, DPIAs, and prior consultation**. Assist the Controller in ensuring compliance with the obligations pursuant to Articles 32-36 GDPR, taking into account the nature of the processing and the information available to the Processor.

6.7. **g) Return or erasure of data**. At the Controller’s choice, return or erase all personal data after the end of the provision of services relating to processing, and erase existing copies, unless Union or Member State law requires storage of the data, in accordance with Article 12 of this DPA.

6.8. **h) Audits and information**. Make available to the Controller all information necessary to demonstrate compliance with the obligations laid down in Article 28 GDPR and allow and contribute to audits, including inspections, conducted by the Controller or another auditor appointed by it, in accordance with Article 11 of this DPA.

6.9. **i) Notification of unlawful instructions**. Immediately inform the Controller if, in its opinion, an instruction given by the Controller infringes the GDPR, the Privacy Code, or other Union or Member State data protection provisions.

6.10. **j) Record of processing activities**. Maintain a record of all categories of processing activities carried out on behalf of the Controller, pursuant to Article 30(2) GDPR, and make it available to the Controller and the supervisory authority upon request.

6.11. **k) Cooperation with the supervisory authority**. Cooperate, on request, with the supervisory authority in the performance of its tasks.

6.12. **l) Appointment of the DPO**. Appoint a Data Protection Officer where required under Article 37 GDPR and communicate the relevant contact details to the Controller. The Processor’s DPO contact details are set out in Annex C to this DPA.

---

## Art. 7 · Authorised sub-processors

7.1. The Controller grants the Processor, pursuant to Article 28(2) GDPR, **general authorisation** to engage the sub-processors listed in paragraph 7.2 below for the provision of the Service, with the obligation for the Processor to inform the Controller of any changes to the list in accordance with paragraph 7.3.

7.2. **List of authorised sub-processors as of the date of signing**:

- a) **Aruba S.p.A.**, with registered office at Via San Clemente 53, 24036 Ponte San Pietro (BG), Italy. Activity: hosting of the Software’s application infrastructure and databases. Infrastructure on the Italian network, under European Union jurisdiction. No extra-EU transfers.
- b) **Hostinger International Ltd**, with registered office at 61 Lordou Vironos str., 6023 Larnaca, Cyprus. Activity: delivery of transactional emails via authenticated SMTP server (appointment confirmations, system notifications, first access) and authoritative DNS for the domain `{URL_SITO}` and its subdomains. Data processed: recipients’ email addresses and message content. No detailed clinical data are included in the message body.
- c) **Mistral AI SAS**, with registered office at 15 rue des Halles, 75001 Paris, France. Activity: transcription of the Controller’s audio dictations into text via artificial intelligence service. Audio is streamed via API and not retained by Mistral beyond the processing window. No extra-EU transfers; where applicable, EU Commission’s standard contractual clauses.
- d) **Stripe Payments Europe Ltd**, with registered office at 1 Grand Canal Street Lower, Dublin, Ireland. Activity: management of the Controller’s subscription and invoicing towards the Processor. Does not receive patients’ clinical data. Processes only payment data relating to the medical Controller.

⚠️ **Correction compared to previous versions of this DPA.** The list previously included at letter a) a German hosting provider and at letter e) a US-based DNS, proxy, and content delivery network provider. The former has been replaced by the actual provider, and the latter has been removed because the Service **does not use any network intermediary**: the domain resolves directly to the infrastructure referred to in letter a). Both circumstances can be verified externally through a DNS query on the Service’s domain and a `whois` query on the resulting address. Details of the correction are included in the version log of Annex B.

7.3. **Changes to the list**. The Processor shall inform the Controller of any changes to the list of sub-processors, whether by addition or substitution, with **at least 30 days’ prior notice** before the effective date of the change. The notice shall be provided by publishing the updated sheet at the address set out in Annex B and by email to the Controller’s address as per Article 2.1.

7.4. **Right to object**. Within the 30-day prior notice period, the Controller may object in writing and with reasoned grounds to the appointment of a new sub-processor. In such case, the Parties shall cooperate in good faith to identify alternative solutions. In the absence of an agreement, either Party may terminate the Service Agreement with 30 days’ notice, without penalties for the Controller and with a pro-rata refund of any prepaid fees for the unused period.

7.5. **Contractual obligations towards sub-processors**. The Processor warrants that it has contractually imposed on sub-processors data protection obligations equivalent to those set out in this DPA. The Processor shall be liable to the Controller for any failure by sub-processors to comply with their data protection obligations.

---

## Art. 8 · Transfers outside the EU/EEA

8.1. Personal data, and in particular health data under Article 9 GDPR, are not transferred outside the European Union. The production database, backups, and clinical photographs are physically located in Italy.

8.2. **No entity based in the United States of America is included in the supply chain processing patients’ data.** No intermediary is placed between the Controller’s browser and the backend: no content delivery networks, third-party reverse proxies, or third-party managed Web Application Firewalls are used, and the encrypted connection is terminated solely by the Processor’s reverse proxy.

8.3. The only sub-processor with resilience replicas outside the European Union is the one referred to in Article 7.2(d), which **does not process patients’ data** and operates on a supply chain segregated from the clinical one. For this provider, the Parties acknowledge that the transfer is based on the standard contractual clauses under EU Decision 2021/914, supplemented by additional measures in line with EDPB Recommendations 01/2020.

8.4. Should the Processor in the future engage other sub-processors based outside the EU/EEA, the provisions of Article 7 of this DPA shall apply, and the transfer mechanisms provided for in Chapter V of the GDPR shall be adopted.

---

## Art. 9 · Technical and organisational measures (Article 32 GDPR)

The Processor shall implement and maintain for the duration of the DPA the following technical and organisational measures, proportionate to the risk associated with the processing of special categories of data under Article 9 GDPR.

9.1. **Encryption**.

- a) Encryption at rest of production databases and backups using AES-256 algorithm.
- b) Encryption at rest of clinical photographs using AES-256 algorithm.
- c) Encryption of data in transit using TLS 1.3.
- d) Server-side management of the Key Encryption Key (KEK), stored exclusively by the signing sidecar, separate from the main application.

9.2. **Access control**.

- a) Mandatory authentication for all Software users.
- b) Mandatory multi-factor authentication (MFA TOTP) for administrative roles and strongly recommended for medical users.
- c) FHIR compartmentalisation by medical practice: a Controller has no visibility over another Controller’s patients.
- d) Granular role and permission management (RBAC) within the Controller’s practice.

9.3. **Integrity**.

- a) Immutable audit log with hash-chain of all CRUD operations performed on FHIR resources.
- b) Retention of the audit log for 10 years.
- c) Accessibility of the audit log to the Controller via the `/audit` interface of the application.

9.4. **Availability**.

- a) Daily encrypted backups of production databases.
- b) 30-day retention of backups in continuous rotation.
- c) Periodically tested recovery procedures.

9.5. **Secure development**.

- a) Annual OWASP ZAP baseline penetration testing and continuous dynamic analysis (rolling DAST).
- b) Mandatory code review for every change to the Software’s source code.
- c) Automated dependency monitoring and management of known vulnerabilities.

9.6. **Pseudonymisation**. Adoption of pseudonymisation techniques, where possible, for clinical photographs and the generation of aggregated statistical data.

9.7. **Training**. Periodic training of the Processor’s personnel on GDPR, cybersecurity, and the handling of health data.

9.8. **Business continuity**. Disaster recovery plan with Recovery Time Objective (RTO) of 24 hours and Recovery Point Objective (RPO) of 24 hours.

9.9. The detailed technical description of the security measures is available and constantly updated at the address indicated in Annex A.

---

## Art. 10 · Personal data breach

10.1. **Processor’s obligation to notify the Controller**. The Processor shall notify the Controller of any personal data breach of which it becomes aware, **within 24 hours of discovery**, by written communication to the Controller’s email address as per Article 2.1, containing:

- a) a description of the nature of the breach, including, where possible, the categories and approximate number of Data Subjects concerned, and the categories and approximate number of personal data records concerned;
- b) the name and contact details of the DPO or another contact point for further information;
- c) a description of the likely consequences of the breach;
- d) a description of the measures taken or proposed to be taken to address the breach and mitigate its possible adverse effects.

10.2. **Updates**. Where it is not possible to provide all the information referred to in paragraph 10.1 at the same time, the Processor shall provide the Controller with initial partial information and subsequently supplement it with timely updates as soon as the information becomes available.

10.3. **Controller’s residual obligations**. The obligation to notify the competent supervisory authority of the breach within 72 hours pursuant to Article 33 GDPR and to communicate it to Data Subjects pursuant to Article 34 GDPR, where applicable, shall remain with the Controller.

10.4. **Cooperation**. The Processor shall actively cooperate with the Controller in managing the breach, providing the information and technical and organisational assistance necessary to comply with the obligations set out in the preceding paragraphs.

---

## Art. 11 · Audits and inspections

11.1. The Controller shall have the right to request from the Processor information useful to demonstrate compliance with the obligations under Article 28 GDPR and this DPA, as well as to conduct compliance audits.

11.2. Audits may be conducted **no more than once per year**, except in cases of justified urgency (e.g., serious personal data breach or order from the supervisory authority), with **at least 30 days’ written notice**.

11.3. The audit may be carried out directly by the Controller or by an independent third-party auditor, accepted by both Parties and bound by confidentiality obligations equivalent to those of this DPA.

11.4. The Processor may fulfil its audit obligation by presenting a **valid security certification** accepted by the Controller (e.g., ISO/IEC 27001, SOC 2 Type II or equivalent), together with a summary compliance report.

11.5. The **costs** of the audit shall be borne by the Controller, unless the audit reveals significant breaches of this DPA or the GDPR by the Processor, in which case the costs shall be borne by the Processor.

11.6. The audit shall not entail access to other clients’ data, trade secrets, proprietary source code, or information whose disclosure would compromise the security of the Service for other clients.

---

## Art. 12 · Termination of processing

12.1. **Data return**. Upon termination of the Service Agreement, at the Controller’s written request made within **30 days** of the termination date, the Processor shall return to the Controller all personal data processed on its behalf in a **ZIP file structured according to the FHIR R4 standard**.

12.2. **Erasure of production data**. Thirty days after the termination of the Service Agreement, or, if the Controller has not requested the return of the data, **90 days** after termination, the Processor shall erase all the Controller’s clinical data from production systems.

12.3. **Erasure of backups**. Backups containing the Controller’s personal data shall be erased within **an additional 30 days** from the date of erasure from production systems, in accordance with the natural backup retention cycle (30 days).

12.4. **Exceptions**. The only copies excluded from the erasure obligation are those retained for legal obligations, in particular the audit log retained for 10 years where required by sector-specific regulations. Such copies shall remain protected by the security measures set out in Article 9 and shall not be subject to any further processing beyond compliance with the legal obligation.

12.5. **Certification**. Upon completion of the erasure operations, the Processor shall provide the Controller, upon request, with written certification of the activities performed.

---

## Art. 13 · Liability

13.1. Each Party shall be liable for damage caused to third parties within the limits provided for in Article 82 GDPR and according to its own sphere of responsibility. The Controller shall be liable for the lawfulness of the processing and the correctness of the instructions given to the Processor; the Processor shall be liable for compliance with the obligations specifically imposed on it by this DPA, Article 28 GDPR, and Article 32 GDPR.

13.2. In internal relations between the Parties, any recourse for damages caused to Data Subjects or fines imposed by the supervisory authority shall be governed by the principle of proportional liability, based on each Party’s causal contribution to the harmful event.

13.3. The Processor’s overall liability towards the Controller for breaches of the obligations under this DPA shall be governed, to the extent not provided for by mandatory law, by the liability limitation provisions contained in the Service Agreement.

13.4. The provisions of this Article shall not limit in any way the rights of Data Subjects under the GDPR.

---

## Art. 14 · Applicable law and jurisdiction

14.1. This DPA shall be governed by Italian law.

14.2. Any dispute between the Parties concerning the interpretation, performance, or termination of this DPA shall be subject to the exclusive jurisdiction of the Court of Genoa.

---

## Art. 15 · Annexes

The following Annexes, always updated to the latest version published by the Processor, shall form an integral part of this DPA:

- **Annex A · Technical description of processing and security measures**: detailed technical sheet published at `{URL_SITO}/sicurezza`.
- **Annex B · Sub-processors sheet**: always updated list of authorised sub-processors, published at `{URL_SITO}/sub-responsabili`.
- **Annex C · Operational contacts**: data protection contact for the Processor: {EMAIL_PRIVACY}.

---

## Art. 16 · Execution

This Data Processing Agreement is executed by the Parties as follows. Execution may be carried out by handwritten signature on paper or by advanced or qualified electronic signature, with full equivalent legal effect.

### For the Controller

| Field | Value |
| --- | --- |
| Date | {DATA_FIRMA_TITOLARE} |
| Place | {LUOGO_FIRMA_TITOLARE} |
| Company name or professional title | {TITOLARE_RAGIONE_SOCIALE} |
| Legal representative | {TITOLARE_LEGALE_RAPPRESENTANTE} |
| Signature | _____________________________ |

### For the Processor

| Field | Value |
| --- | --- |
| Date | {DATA_FIRMA_RESPONSABILE} |
| Place | {LUOGO_FIRMA_RESPONSABILE} |
| Company name | {DENOMINAZIONE} |
| Legal representative | {RESPONSABILE_LEGALE_RAPPRESENTANTE} |
| Signature | _____________________________ |

---

## Art. 17 · Last revision

Last revision of this document: **{ULTIMA_REVISIONE}**.

---

> **Disclaimer**. This document is a template adapted to the context of the Fibonacci Service and the current technical configuration in operation. It **requires legal review prior to signing with clients** and possible adjustments to the specific circumstances of each Controller. This version 0.1 is an internal draft and is subject to further revisions.
