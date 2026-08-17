> **Courtesy translation.** In case of any discrepancy, the Italian version of this document prevails.

# Sub-Processors

**Version 2.0 · Last updated: {ULTIMA_REVISIONE}**

{AVVISO_BOZZA}

This document constitutes **Annex B** to the Data Processing Agreement (DPA) pursuant to Article 28 of Regulation (EU) 2016/679 (hereinafter, "GDPR"), entered into between the Data Controller (client physician) and Fibonacci as Data Processor for the provision of the Fibonacci SaaS software. It lists by name the sub-processors authorised under Articles 28.2 and 28.4 GDPR and is subject to continuous updates.

---

## 1. Introduction and regulatory framework

1.1. **Definition of sub-processor**. A sub-processor (hereinafter, "Sub-processor") is defined as a third-party entity, whether a natural or legal person, engaged by the Processor to carry out specific processing activities on behalf of the Controller, pursuant to Article 28, paragraphs 2 and 4, of the GDPR.

1.2. **General authorisation under Article 28.2 GDPR**. By signing the DPA, the Controller grants the Processor general written authorisation to engage the Sub-processors listed in this Annex B, acknowledging that each has been selected by the Processor based on an assessment of reliability and adequacy of the guarantees offered in terms of technical and organisational security of processing, in accordance with Article 28, paragraph 1, GDPR.

1.3. **Contractual chain**. The Processor enters into a written contract with each Sub-processor imposing the same data protection obligations set out in the DPA between the Controller and the Processor, particularly regarding confidentiality, security measures, assistance to the Controller in exercising data subjects' rights, and cooperation with the Supervisory Authority. The Processor is liable to the Controller for any failure by Sub-processors to comply with data protection obligations, pursuant to Article 28, paragraph 4, GDPR.

1.4. **Information obligation and right to object**. Any changes to the list of Sub-processors, including the addition of a new Sub-processor, the replacement of an existing Sub-processor, or the termination of a relationship with a Sub-processor, will be communicated by the Processor to the Controller with **at least 30 (thirty) days' prior notice** before the effective date of the change, via email to the Controller’s address as recorded in the Service Agreement and by updating this page published at `{URL_SITO}/sub-responsabili`.

1.5. **Exercise of the right to object**. Within the 30-day period referred to in point 1.4, the Controller may object to the proposed change with justification. The procedure applicable in case of objection is set out in paragraph 3 of this Annex.

1.6. **Transparency**. This list is made public to allow the Controller to verify, prior to signing the Service Agreement and throughout the duration of the relationship, the identity and location of the entities involved in the processing chain.

---

## 2. List of authorised sub-processors

The sub-processors currently authorised as of the last update of this document are as follows.

### 2.1. Aruba S.p.A.

- **Legal name**: Aruba S.p.A.
- **Registered office**: Via San Clemente 53, 24036 Ponte San Pietro (BG), Italy
- **Service category**: hosting of the application infrastructure, PostgreSQL relational database, storage of encrypted clinical photographs, execution of periodic backups
- **Type of data processed**: special categories of data under Article 9 GDPR (health data, medical history, reports, prescriptions), patients' personal data, clinical photographs. All data at rest are encrypted using AES-256; encryption keys are managed by the Processor and are not accessible to the provider
- **Processing location**: provider’s infrastructure on the Italian network. The IP block hosting the Service is registered in the RIPE database as `ARUBA-NET`, Aruba S.p.A., country **IT**; this can be verified by anyone via a `whois` query on the Service’s public IP address
- **Legal basis for transfer**: processing is entirely carried out within the territory of the European Union; no data transfer to third countries under Chapter V of the GDPR occurs
- **Guarantees declared by the provider**: **ISO/IEC 27001** certification and adherence to the **CISPE Data Protection Code of Conduct for Cloud Infrastructure Service Providers**, a code of conduct under **Article 40 GDPR** approved by the French CNIL in 2021, acting as the designated supervisory authority for the code. The provider’s registration can be verified in the public CISPE register
- **Provider’s privacy policy**: [https://www.aruba.it/documents/tc-files/it/11_it_privacy_policy_aruba_spa.aspx](https://www.aruba.it/documents/tc-files/it/11_it_privacy_policy_aruba_spa.aspx)
- **Provider’s GDPR information**: [https://www.aruba.it/gdpr-regolamento-europeo-privacy.aspx](https://www.aruba.it/gdpr-regolamento-europeo-privacy.aspx)
- **CISPE public register**: [https://cispe.cloud/publicregister/](https://cispe.cloud/publicregister/)
- **Operational notes**: the provider acts solely as an infrastructure provider; it has no application or logical access to clinical data, which reside in encrypted volumes whose keys are exclusively under the Processor’s control
- ⚠️ **To be completed**: the written appointment as sub-processor under Article 28.3 GDPR with this provider is being formalised alongside the establishment of the company owning the Service. Until then, this entry describes the verified technical setup, not an already perfected contractual relationship

### 2.2. Hostinger International Ltd

- **Legal name**: Hostinger International Ltd
- **Registered office**: 61 Lordou Vironos str., 6023 Larnaca, Cyprus
- **Service category**: delivery of transactional emails via authenticated SMTP server, including appointment confirmations and reminders, system notifications, document attachments, and first-access communications; **authoritative DNS** for the Service domain and its subdomains
- **Type of data processed**: recipient’s email address, recipient’s name, message text, any attached documents, technical sending logs. **No detailed clinical health data are included in the message body**; texts are limited to operational information (date, time, appointment location) and service communications
- **Processing location**: provider established in the European Union (Cyprus). The location of mail servers depends on the subscribed plan and should be verified in the provider’s panel
- **Legal basis for transfer**: for any processing outside the European Economic Area, the Standard Contractual Clauses referenced in the provider’s Data Processing Addendum, which forms an integral part of the accepted terms of service, apply
- **Provider’s privacy policy**: [https://www.hostinger.com/legal/privacy-policy](https://www.hostinger.com/legal/privacy-policy)
- **Provider’s DPA**: [https://www.hostinger.com/legal/dpa](https://www.hostinger.com/legal/dpa)
- **Operational notes**: message content is structured to avoid conveying identifiable clinical information; references to medical procedures are kept generic. ⚠️ An exception applies to document attachments (informed consents, visit sheets), explicitly requested by the service user: in such cases, the attachment transits through the provider’s mail server

### 2.3. Mistral AI SAS

- **Legal name**: Mistral AI SAS
- **Registered office**: 15 rue des Halles, 75001 Paris, France
- **Service category**: automatic speech-to-text transcription (Speech-to-Text) via the Voxtral model for the integrated medical dictation feature in the Software
- **Type of data processed**: temporary audio recordings of the Controller’s dictation, which may contain direct or indirect references to special categories of data under Article 9 GDPR. Audio is streamed via HTTPS API and processed in a temporary window
- **Processing location**: servers located in the European Union
- **Legal basis for transfer**: processing carried out within the territory of the European Union
- **Provider’s privacy policy**: [https://mistral.ai/terms/#privacy-policy](https://mistral.ai/terms/#privacy-policy)
- **Provider’s DPA**: Mistral AI’s enterprise terms, signed by the Processor upon service activation; a copy is available upon written request from the Controller
- **Operational notes**: audio is not retained by the provider beyond the time strictly necessary to complete transcription (zero retention). The Processor has selected the contractual configuration that excludes the use of API client input for model training (opt-out training), in the absence of explicit opt-in. The transcribed text returned by the service is immediately transferred to the Processor’s infrastructure as described in point 2.1 and is not retained by the provider

### 2.4. Stripe Payments Europe Limited

- **Legal name**: Stripe Payments Europe Limited
- **Registered office**: 1 Grand Canal Street Lower, Grand Canal Dock, Dublin, Ireland
- **Service category**: management of the Fibonacci Service subscription, recurring credit card or equivalent payment instrument charges, issuance of invoices from the Controller to the Processor
- **Type of data processed**: Controller’s personal and payment data (name, VAT number, billing address, payment instrument details). **No patient clinical data or identifying information is ever received**
- **Processing location**: primary servers located in the European Union (Ireland); resilience replication at data centres in the United States of America and the United Kingdom
- **Legal basis for transfer**: for replication in the United States, Standard Contractual Clauses of the EU Commission under Decision 2021/914 (Controller-Processor module) supplemented by additional measures; for the United Kingdom, adequacy decision of the EU Commission dated 28 June 2021
- **Provider’s privacy policy**: [https://stripe.com/it/privacy](https://stripe.com/it/privacy)
- **Provider’s DPA**: [https://stripe.com/it/legal/dpa](https://stripe.com/it/legal/dpa)
- **Operational notes**: the payment chain is segregated from the clinical chain; reconciliation between subscription and Fibonacci tenant occurs via an opaque identifier that does not convey clinical data

---

## 2-bis. Entities NOT involved in the processing chain

This section lists what is **not** present. It exists because the absence of an intermediary is itself a guarantee, and because a previous version of this Annex listed a sub-processor that the Service does not use.

**No content delivery network (CDN), no third-party reverse proxy, no third-party managed Web Application Firewall.** The Service domain resolves **directly** to the infrastructure address described in point 2.1: no additional entity stands between the user’s browser and the backend, and there is no point where a third party terminates the encrypted connection. This can be externally verified via a DNS query on the Service domain.

**Consequence under Chapter V of the GDPR**: the processing chain for clinical data does not include any provider subject to non-European jurisdiction. The only remaining transfers to third countries relate to the payment chain described in point 2.4, which **does not process patient data**.

---

## 3. Procedure for modifying the list and right to object

3.1. **Prior notification**. Any modification to this list (addition of a new Sub-processor, replacement of an existing Sub-processor, termination of a sub-processing relationship) will be notified by the Processor to the Controller with **at least 30 (thirty) days' prior notice** before the effective date of the change. The notification will be sent via email to the Controller’s contact address as recorded in the Service Agreement, and this page will be updated simultaneously.

3.2. **Notification content**. The notification will specify: the name and registered office of the Sub-processor concerned, the service category assigned, the type of data processed, the processing location, the legal basis for transfer where applicable, the guarantees adopted, and the effective date.

3.3. **Right to object**. Within 30 days of receiving the notification, the Controller may object in writing to the proposed change, stating the reasons for the objection. The objection should be sent to {EMAIL_PRIVACY}, or via certified email (PEC) or registered mail with return receipt to the Processor’s registered office.

3.4. **Handling of objections**. Upon receiving the objection, the Processor will in good faith evaluate alternative solutions to meet the technical or organisational need underlying the change, without prejudice to the Processor’s right to adopt the technical solution deemed most appropriate for the continuation of the Service.

3.5. **Failure to reach agreement**. If no agreement is reached between the Parties within a reasonable period following the objection, either Party may terminate the Service Agreement with written notice, without prejudice to the contractual provisions on data return and deletion at the end of the relationship.

3.6. **Urgent changes for security reasons**. If the change is urgently required for security reasons, service continuity, or compliance with a legal obligation, the Processor may proceed with shorter notice, promptly communicating the reasons to the Controller. In such cases, the Controller’s right to object and the provisions of points 3.3, 3.4, and 3.5 shall still apply, albeit ex post.

3.7. **Absence of objection**. Failure by the Controller to object within the 30-day period shall be deemed as acceptance of the change.

---

## 4. Version history

| Version | Date | Change |
| --- | --- | --- |
| 1.0 | {ULTIMA_REVISIONE} | First publication of the named list of sub-processors, including Hetzner Online GmbH, Hostinger International Ltd, Mistral AI SAS, Stripe Payments Europe Limited, and Cloudflare, Inc. |
| 1.1 | {ULTIMA_REVISIONE} | Replacement of Brevo SAS with Hostinger International Ltd as sub-processor for transactional email delivery: the Service no longer uses an external email marketing platform and delivers via the provider’s authenticated SMTP server. |
| 2.0 | {ULTIMA_REVISIONE} | **Correction of the hosting provider and removal of an unused sub-processor.** (a) Hetzner Online GmbH (Falkenstein, Germany) is replaced by **Aruba S.p.A.** (Italy), where the infrastructure is actually hosted: this was verified by resolving the Service domain and querying the RIPE register for the resulting IP address. (b) **Cloudflare, Inc. is removed**: the Service does not use any content delivery network or third-party proxy, and the domain resolves directly to the infrastructure described in point 2.1. Consequently, the processing chain for patient data no longer includes any transfers to third countries. (c) The authoritative DNS is attributed to Hostinger International Ltd, which provides it de facto. |

---

## 5. Contacts

For any clarification requests, exercise of the right to object, or requests for additional documentation regarding authorised sub-processors, the Controller may contact the following:

- **Data protection contact**: {EMAIL_PRIVACY}
- **Privacy office**: {EMAIL_PRIVACY}
- **Data Processor**: {DENOMINAZIONE} · registered office: {SEDE_LEGALE}

---

> This document is updated as of the date indicated at the top and is subject to continuous review. The Controller may request written confirmation of the current version of this list at any time by writing to {EMAIL_PRIVACY}. In case of discrepancy between a printed copy and the version published at `{URL_SITO}/sub-responsabili`, the online version shall prevail.
