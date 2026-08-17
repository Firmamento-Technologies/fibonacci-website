# Patient Data Exports and Rights

This guide explains how to provide a patient with their data and how to respond to requests under the GDPR. It is aimed at physicians and practice administrators.

The **data controller is the practice**: patient requests are directed to the physician, not to us. This guide explains what the system provides to help you respond.

## Possible Requests

| Request | Reference | What is needed |
|---|---|---|
| "I want a copy of my data" | Art. 15 (access) | Patient record export |
| "I want my data in a format I can take elsewhere" | Art. 20 (portability) | Structured export |
| "Correct this data" | Art. 16 (rectification) | Edit in the record, with history |
| "Delete my data" | Art. 17 (erasure) | ⚠️ See below: not automatic |
| "I revoke my consent" | Law 219/2017, Art. 1(5) | ⛔ **Not covered here** → [Informed Consents](/manuale/consensi-informati) |

⚠️ **"Revocation" has two different meanings, and confusing them leads to mistakes.**
Revoking **consent for a procedure** (the document the patient signed before treatment) is done in the [Informed Consents](/manuale/consensi-informati) guide, and the consequence is clinical: discontinuation of treatment. **This is not** a request to delete data, and in fact, the revoked PDF **remains archived**: it is needed to prove that consent existed when the procedure was performed. The requests in the table above concern data, and for clinical documentation, the limits of Art. 17 apply, as explained below.

## Step 1: Exporting a Patient Record

From the patient record, the export button generates a document containing personal details, medical history, treatments, prescriptions, tests, consents, and access logs.

**Photographs** are not included in this document: they are encrypted, and their access is tracked separately. They are exported separately and **decrypted at the time of delivery**, so the patient receives images they can open: a file that cannot be read does not satisfy the right to portability.

## Step 2: Request for Erasure

⚠️ **Erasure is not automatic, nor should it be.** The right to erasure under Art. 17 has exceptions, one of which applies precisely here: paragraph 3(b) excludes erasure when processing is necessary to comply with a legal obligation, and paragraph 3(c) when it is needed for preventive medicine, diagnosis, or treatment.

In practice: clinical records must be retained for as long as the physician may be required to account for their actions. Deleting them upon request would mean depriving oneself of the evidence needed for defense, and this is not an obligation imposed by the GDPR.

⇒ The correct response to a request for erasure is reasoned, not a refusal nor an automatic execution. If the request concerns non-clinical data (a contact detail, an organizational note), those can be deleted.

## Step 3: If the Practice Closes or Changes Software

There is a specific process for data migration: export everything, verify receipt of the package, and **only then** proceed with deletion. The order is non-negotiable: reversing it means destroying the only readable copy.

The package contains structured data and photographs in clear text. ⛔ It does not include the encryption key, and not for our confidentiality: that key unlocks **every** existing encrypted copy, including those in backups not being delivered, and it is not revocable.

Upon confirmed delivery, the key for that project is destroyed. This allows truthfully stating that residual backups, though still existing for a period, are no longer readable by anyone.

## Common Mistakes

- **Sending photographs via standard messaging.** These are Art. 9 data.
- **Executing erasure because it was requested.** It must be assessed, and the assessment must be documented.
- **Deleting before confirming receipt of the delivery.** This is the irreversible mistake.

## Frequently Asked Questions

**Can the patient request access logs for their record?** Yes, they are available: every access to their record is logged with who and when.

**How long do I have to respond?** One month from the request, extendable by two months in complex cases, with notice to the data subject.

**Who responds, me or Fibonacci?** The practice: it is the data controller. We are the data processor and provide the tools to respond.
