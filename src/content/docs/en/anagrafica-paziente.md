# Patient Record Creation and Management

> ⚠️ **Verified against the application on 2026-08-10.** The items listed here are those that actually exist. If you find one described but don’t see it on screen, it’s a guide defect: please report it.

This guide explains how to register a new patient in Fibonacci, search for them, modify their record, archive it, and export their data to comply with the right to data portability under Article 20 of the GDPR. It is intended for physicians and front-office staff.

The patient record is the foundation of all other clinical functionalities: visits, body map, consents, calendar, and audit log are linked to the patient record via a unique identifier. Correct initial data entry prevents duplicates, reduces clinical errors, and ensures compliance with Italian healthcare regulations.

## Prerequisites

- Fibonacci account with role `Physician`, `AI Receptionist`, or `Organization` admin.
- Patient’s ID document or tax code for verification.
- Patient’s email address or mobile number for automatic contacts and reminders.

## Step 1: Opening the new patient form

From the main navigation bar, under `Patients`, the `Add` button in the top right opens the registration form. The same form can be accessed via the keyboard shortcut **N** from any screen.

The form is divided into four tabs:

- `Profile`, mandatory identification data.
- `Contacts`, details for appointments and notifications.
- `Clinical`, basic health information.
- `Photo`, identification image.

Tabs must be completed in order; the `Save` button is only enabled when all mandatory fields in the `Profile` tab are valid.

## Step 2: Filling in mandatory fields

Mandatory fields are:

- **First name** and **Last name**, in Latin characters without abbreviations.
- Italian **tax code** or document type and number for foreign patients.
- **Date of birth**, format `dd/mm/yyyy`.
- **Gender**, values `M`, `F`, `Other`, or `Not specified`.
- **Primary contact**, at least one between email and phone number.

The Italian tax code is automatically validated. The system calculates the check digit, verifies consistency with date of birth, gender, and place of birth, and flags inconsistencies before saving. For patients without an Italian tax code, the `Document type` field is available: values are those found in the dropdown menu.

Italian phone numbers accept both local format `333 1234567` and international format `+39 333 1234567`. The system normalizes to international format for automatic SMS reminders.

## Step 3: Optional fields

Optional fields in the clinical tab include:

- Full **residence address**.
- **General practitioner**.
- **Known allergies**, free text or autocomplete from SNOMED CT terminology.
- **Blood type**, values `0`, `A`, `B`, `AB` with `Rh+` or `Rh-`.
- **General clinical notes**, free text for relevant unstructured information.

Filling in known allergies and blood type is strongly recommended for patients undergoing invasive procedures: the system displays a warning at the top of every visit record when these fields are empty.

## Step 4: Patient profile photo

The `Photo` tab allows uploading an identification image of the patient, useful for avoiding homonyms and for quick pre-visit checks.

The `Upload` button accepts JPEG and PNG files up to five megabytes. The `Take photo` button opens the device camera with explicit patient consent.

The photo is encrypted at rest using AES-256 and is only accessible to authorized operators viewing the record. Encryption uses keys derived from the practice’s tenant, separate from other practices on the same platform.

## Step 5: Saving and duplicate check

When clicking `Save`, the system checks for patients with the same tax code or matching combination of first name, last name, and date of birth.

If a potential duplicate is found, the system displays a panel with the existing patient and three options:

- `Open existing`, abandons creation and opens the existing record.
- `Merge`, consolidates the two records after explicit operator confirmation.
- `Save anyway`, creates the new record marking it as a potential duplicate for review.

Merging is logged in the audit log as an administrative operation.

## Searching for a patient

The global search bar in the top right performs incremental searches on first name, last name, tax code, and phone number. Results appear after three characters.

Advanced filters are available from the `Patients > Filters` screen:

- date of birth range,
- created by specific operator,
- last visit within a time range,
- presence of known allergies,
- archiving status.

Filters can be combined and produce a sortable list, exportable to CSV.

## Archiving a patient

When a patient is no longer under care, the `Archive` button in the patient record marks them as archived. This operation **does not delete data**: the medical record remains accessible in read-only mode for the retention period required by healthcare regulations.

Archived patients do not appear in standard searches or new appointment suggestions. They remain in the system and can be found via search.

Archiving is the compliant method under Article 17 of the GDPR (right to erasure) in the healthcare context, where this right is balanced with retention obligations under the Code of Medical Ethics and tax regulations.

## Permanent deletion

Permanent data deletion is only allowed in cases provided for by regulations, such as patients registered in error or with consent revoked before the start of treatment.

Permanent deletion is not initiated from the interface: you must contact support, and it is a deliberate process: an irreversible operation on clinical data. Approval from a second operator with the `Organization` admin role is required. Actual deletion occurs after a 30-day cooling-off period, with prior email notification to the requesting operator. All phases of the procedure are logged in the audit log.

## Providing the patient with their data

Article 20 of the GDPR guarantees patients the right to receive their data in a structured, commonly used format.

From the `Export data` button in the patient record, a ZIP archive is generated containing:

- `Patient.json` file with complete profile data in a standard format readable by any other medical record system,
- `Observation.json` file with recorded observations and parameters,
- `Condition.json` file with medical history and conditions,
- `MedicationStatement.json` file with registered drugs,
- `Procedure.json` file with performed procedures,
- `consents/` folder with PDFs of signed consents,
- `attachments/` folder with photos and reports.

The archive is digitally signed to ensure integrity and is available for download for seven days. The download link is sent to the patient via email with a second-factor SMS access code.

## Tips

- Keyboard shortcut **N** anywhere for new patient, **F** to open quick search, **Esc** to close modals.
- Bulk import from CSV available in `Settings`: the template includes one row per patient with standard headers. Import is two-step: preview with validation, then confirmation.
- For minor patients, the parent or guardian’s details are recorded under contacts: consents and receipts refer to the guardian.
- For foreign patients without an Italian tax code, it is recommended to request a copy of their ID and record the number in the `Document type > Number` field.

## Troubleshooting

**Tax code rejected as invalid.** Verify that the sixteen digits match the official document. A typo in the final check digit is the most common error. Alternatively, use the `Calculate tax code` function from the profile tab.

**Email already used by another patient.** The same email address can only be associated with one patient per practice. For families sharing an email, register the address only for the primary contact and leave the email field blank for other members, using the phone as the primary contact.

**Potential duplicate flagged but the patient is new.** Check first name, last name, and date of birth: patients with common names and similar birth dates may trigger false positives. Use `Save anyway`; the record will be marked for later review.

**Photo won’t upload.** The limit is five megabytes, and accepted formats are JPEG and PNG. HEIC files from iPhones need to be converted: most mobile browsers do this automatically during upload, but some models require disabling the `High Efficiency` option in the camera settings.

## See also

- [First access and initial setup](/manuale/installazione)
- [Completing medical history with AI dictation](/manuale/anamnesi-dettatura)
- [Audit log and access traceability](/manuale/audit-log)

Last revision: {ULTIMA_REVISIONE}
