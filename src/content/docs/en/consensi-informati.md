# Generating and Signing Informed Consents in PDF

This guide explains how to generate structured informed consent drafts in compliance with **Law 219/2017** using **Fibonacci’s AI Wizard**, validate them section by section, and collect the patient’s graphometric signature in PDF/A-3b format. It is intended for aesthetic medicine and plastic surgery physicians practicing in Italy.

Fibonacci does not distribute third-party templates. The system combines two sources:

1. **Over 100 proprietary Fibonacci v0.1 templates (drafts to be validated)** for the most common injective and non-surgical aesthetic medicine procedures, facial and body plastic surgery, and follow-ups.
2. **Generative AI Wizard** for custom consents for any off-catalog treatment, starting from a library of **72 legal clauses extracted from Italian Public Administration sources** (regional acts, Local Health Authorities, hospital companies) that are in the public domain under Law 633/1941, Art. 5.

All outputs are validated by three anti-hallucination layers (see Step 4) and archived with an advanced electronic seal, with every step recorded in the `Audit Log`.

## Prerequisites

- Account with role `physician` or `practice admin`.
- Complete patient record with at least first name, last name, tax code, and date of birth.
- Practice physician profile configured with identification details and registration number with the `Order of Physicians` (verify under `Settings` → `Organization`).
- For graphometric signature: a tablet or touch device for the patient to sign, and a patient ID for prior verification.

## Step 1: Opening the Consent Form

From the patient’s visit record, the `Consents` tab opens the management panel. The screen displays:

- In the left column, a list of consents already generated for the patient, with statuses `Draft`, `Sent`, `Signed`, `Revoked`;
- In the right column, the `Add` button that opens the AI Wizard.

Signed consents remain accessible in read-only mode. Generating a new consent does not overwrite or modify previous ones: each consent remains a standalone document with its own immutable trace.

Alternatively, from the `Consents` → `Literature` menu, you can access over 100 proprietary Fibonacci templates ready for PDF download (automatically populated with practice and physician data). These are useful as references or for quick prints without an active patient.

## Step 2: AI Wizard in 4 Steps

The `Add` button opens the 4-step wizard.

**Step 1 · Procedure Selection**: The catalog lists available procedures divided by category (injective aesthetic medicine, non-surgical, follow-up). You can search by name or start from scratch with a free-text description of the treatment.

**Step 2 · Clinical Parameters**: Pre-set fields for technique, materials (e.g., filler type, lot, laser device), specific known risks of the procedure, therapeutic alternatives, and notes. The more details you provide, the higher the confidence score in the next step.

**Step 3 · AI Generation**: The system invokes the configured language model and, in 10-15 seconds, composes a draft of the 8 mandatory sections under Law 219/2017:

1. Patient identification and context of the service
2. Clinical description of the procedure
3. Expected benefits
4. Documented risks and realistic probabilities
5. Therapeutic alternatives (including abstention)
6. Consequences of refusal
7. Patient’s declaration of understanding
8. Signature and ratification

Below the output, you receive the `Automatic validation` panel (Step 4).

**Step 4 · Medical Review + Signature**: In the final step, review each of the 8 sections after rereading them, then collect the patient’s graphometric signature. The `Save and send` button remains disabled until you confirm all 8 sections.

## Step 3: Clinical Parameters and Customization

The wizard editor in Step 2 presents the following pre-filled or suggested fields:

- **Patient Data**: First name, last name, tax code, date of birth (automatically populated).
- **Practice**: Name, VAT number, address, phone, PEC (automatically populated from `Settings`).
- **Executing Physician**: Name, professional order, registration number (automatically populated).
- **Service Date**: Typically today or the date of the linked appointment.
- **Technique**: Description of the method (e.g., "intradermal injection with 25G cannula in the vermilion zone, seated patient, topical anesthesia EMLA 30 min").
- **Materials**: Products used with traceable lots.
- **Known Risks**: Specific risks of this procedure with probabilities (e.g., "bruising 5-10%, edema 48h, asymmetry <2%, rare ischemia").
- **Alternatives**: Reasonable alternative options (including "abstention from treatment").
- **Free Notes**: Any patient clinical conditions affecting consent (allergies, anticoagulant therapies).

The level of detail you provide here guides the AI: rich input → rich output with precise citations. Sparse input → generic output that will be marked as `review_required`.

## Step 4: Anti-Hallucination Validators

Before the consent is shown to the physician, the system runs three validators in sequence:

**Validator #1 · Blacklist of Prohibited Terms**: The backend automatically rejects any output containing:

- Names of third-party brands or company acronyms in the sector (anti-copyright protection);
- Misleading claims such as "guaranteed result," "100% safe," "guaranteed healing," "no complications," "I certify that," "no risk."

If a hit occurs, the output is never shown, and the system regenerates with a reinforced prompt.

**Validator #2 · Citation Check**: Verifies that the text includes mandatory regulatory references (`L. 219/2017`, `Cassazione`, `GDPR`). If missing, it issues a warning but does not block: the physician can proceed knowingly.

**Validator #3 · Confidence Scoring per Section**: Each of the 8 mandatory sections receives a score `0.0-1.0` calculated based on:

- Text length (sections too short = low confidence);
- Presence of inline regulatory citations (`law 219`, `art.`, `gdpr`, `cassazione`, `fnomceo`, `lazio`);
- Number of PA clauses referenced from the 72-element library.

Section 5 (Subscription/signature) always requires manual review regardless of the score, as it is the most legally critical.

If `overall_confidence < 0.7` or if errors from the blacklist are present, the system sets `review_required=true` and blocks saving until the physician manually reformulates the problematic sections.

Additionally, a frequency check flags suspicious percentages (e.g., "100% risk," "0.001% complication") that often indicate numerical hallucinations by the LLM.

## Step 5: Patient Signature and Archiving

After medical review (8/8 checks active), the `Save and send` button becomes active. Clicking it triggers the following sequence:

1. **PDF/A-3b Generation**: Fibonacci’s `pdf-signer` module converts the consent Markdown into PDF/A-3 compliant with ISO 19005-3, with embedded XML for long-term validation. This is the format required by the Digital Administration Code, Art. 44, for ten-year preservation.

2. **Advanced Electronic Seal**: The PDF is sealed server-side with the practice owner’s certificate and timestamp (eIDAS-compliant TSA).

3. **Patient’s Graphometric Signature**: The patient signs on a tablet; the system captures, in addition to the signature image, biometric data of the stroke (pressure, speed, timing), which are encrypted and embedded in the PDF for potential graphological analysis. This is an advanced electronic signature (AES), to be collected after verifying the patient’s identity with an ID. The AES has the evidentiary value of a private document (Art. 2702 of the Italian Civil Code); if disputed, the burden of proof lies with the party producing it. Full presumption of attribution to the signatory (Art. 20, para. 1-bis of the CAD) is achieved with a qualified signature (QES), which can be activated (along with a qualified timestamp) via an accredited QTSP.

4. **Archiving**: The signed consent is added to the patient’s folder, linked to the visit and the physician who collected it. The PDF remains attached and downloadable.

5. **Audit Trail**: The operation is recorded in the immutable `Audit Log` with `action=C` (create), `purposeOfEvent` describing the AI review of 8/8 sections, agent (physician), source (AI Wizard), outcome (success/failure). Forensic search from the `Audit Log` using filters by date, patient, physician.

The patient receives a copy of the signed PDF via email. The practice always retains the archived original.

## Step 6: Revocation, Modification, Reprinting

- **Revocation**: The patient or physician can revoke a signed consent from the contextual menu `Revoke`. The status changes to `inactive` (Revoked), a new `AuditEvent action=U` is created with a reason, but the original PDF remains archived. Revocation after a procedure implies treatment interruption (Law 219/2017, Art. 1, para. 5).

- **Modification**: Signed consents **cannot be modified**. If an updated consent is needed (e.g., change in technique), a new consent is generated. The system automatically displays previous versions in the patient’s record with version history.

- **Reprinting**: From the signed consent, you can always re-download the original PDF, identical to the sealed one. Useful for including in paper records or reissuing to the patient.

⚠️ **Revoking a consent is not the same as deleting data.** The revoked PDF remains archived: it proves that consent existed at the time the procedure was performed, and revocation does not affect the medical record. If the patient requests access, portability, or deletion of their data, refer to the separate guide: [Exports and Patient Rights](/manuale/esportazioni-e-diritti).

## Important Notes

- The over 100 proprietary Fibonacci templates are in **version 0.1 (internal draft)**. They cover the required legal structure (8 sections under Law 219/2017 + 5 elements from Cassazione 26104/2022 + GDPR + eIDAS + PDF/A-3b) but **the clinical content has not yet been validated by a healthcare lawyer or specialist physician** in the discipline. Before using them with real patients, you must: (1) have each template reviewed by your practice’s legal counsel, (2) verify risks/percentages against updated society guidelines (SICPRE/ISAPS, SIDeMaST, SIME/AIME), (3) customize the consent for the individual patient (allergies, ongoing therapies, comorbidities: the wizard requires this in Step 2), (4) countersign the document after the patient’s signature. Fibonacci provides the technical infrastructure but does not replace the legal advice of a healthcare lawyer or the clinical responsibility of the treating physician.

- The AI Wizard generates texts that **must always be reviewed** by the physician before sending: the AI is a support tool (compliant with requirement RF-5.4), not a medical device. The mandatory review of the 8 sections in Step 4 serves to underscore this responsibility.

- Data processed for consent generation is not used for model training (contractual opt-out with providers). Inference occurs via the configured LLM provider: the updated list of sub-processors and their processing locations is published at `/sub-responsabili`. Do not include direct patient identifiers in the clinical context beyond what is strictly necessary.

## Regulatory References

- **Law 219/2017, Art. 1**: Rules on informed consent and advance treatment directives.
- **Cassazione 26104/2022**: Burden of proof for informed consent lies with the physician.
- **GDPR Art. 9 + Art. 30**: Processing of health data + record of processing activities.
- **EU Regulation 910/2014 (eIDAS)**: Advanced electronic signature.
- **CAD Art. 44 + ISO 19005-3**: Preservation of compliant digital documents.
- **Law 633/1941, Art. 5**: Public Administration acts in the public domain.

> Document updated on **{ULTIMA_REVISIONE}**.
