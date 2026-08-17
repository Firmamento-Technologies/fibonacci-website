# Recording a Treatment

This guide explains how to record an aesthetic medicine session: product, batch, areas, quantity, and what the system does afterward. It is intended for physicians.

Recording the session is the clinical act that, months or years later, demonstrates what was done and with which products. It is the document that holds up in case of dispute, and it is also the one no one feels like filling out at the end of a busy day: the screen is designed to ask for the minimum necessary and to automatically fill in everything else.

## Prerequisites

- Account with the `physician` role.
- Existing patient record.
- **Signed** informed consent for the treatment. If consent is missing, the session is still recorded (what was done is not hidden), but it remains marked as lacking consent.

## Step 1, Open the Session

From the patient’s record, go to the `Treatments` section and click the `Add` button. Select the product, and the system automatically recognizes the category and chemical family: hyaluronic acid, hydroxyapatite, poly-L-lactic acid, botulinum toxin.

This recognition serves two purposes: coloring the area map by category, and, where a duration is specified in a consent, suggesting a reminder in Step 5.

## Step 2, Batch, Quantity, Expiry

The batch number must be entered **exactly as printed on the packaging**. It is the key to answering the question "which patients received this batch" on the day of a manufacturer recall. The dedicated guide is `Batch traceability`.

For these fields, the system **records and does not calculate**: the declared dilution is written as is. If a value appears inconsistent, a warning appears, but saving is not blocked. Software that refuses to record what was done produces records that do not match reality, and that is worse than the error it aimed to prevent.

## Step 3, Treated Areas

Under `Body-map and treated areas`, indicate the points with numbered dots, associating each with the quantity. Choose between the frontal portrait (`Photo`) and the three-dimensional model (`3D Anatomy`), which is the full body including the face: a single click is enough on the photo, while the model requires a double click. The coordinates of the portrait differ for men and women because facial proportions vary, and a dot in the wrong place is incorrect documentation.

For each point, you can also record **how** the injection was performed: instrument, gauge, plane, and technique, in four optional dropdowns. The details, along with the two ways to map areas described in words, are in [Treated areas: on the photo and on the 3D model](/manuale/body-map).

⛔ **There is no button that copies the areas from the previous session.** Until August 17, 2026, this guide described one, and it never existed: for a touch-up, areas are reselected, or the session is written in words and `Auto-extract areas from text` is pressed.

## Step 4, If It Is an Energy Device

When the selected product is recognized as a **laser** (or other energy device), the `Delivery parameters` box appears: wavelength, fluence, spot, frequency, pulse duration with its unit, number of passes, density, `Cooling`, and `Observed clinical endpoint`.

Two things to know:

- **These are free-text fields, with no suggested values.** The numbers are read from the machine’s display. A menu of "typical values" would be a clinical proposal disguised as convenience, and a default value is a proposal even when it can be changed.
- **The endpoint is not a side note**: it is what titles the fluence for the next session. Recording it is the difference between continuing a cycle and starting over.

For injectables, the same role is played by `Prepared dilution`, `Batch expiry`, and `UDI of the device (optional)`.

## Step 5, Off-Label Use

If the product is used outside authorized indications, the `off-label` checkbox must be ticked. This is not a formality: off-label use is legal but requires specific information for the patient, and having it recorded is what allows you to prove it.

## Step 6, The Reminder

Upon saving, if the product’s chemical family has an expected duration specified in a consent, the system suggests an internal reminder for the correct date.

Two clarifications that matter more than the function itself:

- **The reminder is for the physician, not the patient.** No automatic message is sent. This is a mandatory choice: Law 145/2018 prohibits registered professionals from sending communications with attractive elements, and an automatic dispatch would expose **the physician** to sanctions, not us.
- **If the duration is unknown, nothing is suggested.** This applies to hydroxyapatite and biostimulators based on bio-remodeling hyaluronic acid: the ranges in circulation come from promotional material, not primary sources. An invented reminder is not an extra reminder; it is an incorrect clinical suggestion that appears to come from the system.

## What You Can Do from a Recorded Session

Each row in the `Treatments` section offers, in addition to editing and deletion, three actions identifiable by their icon:

- **Download the session file (PDF)**: a document containing what is recorded in the medical record for that session (product, batch, expiry, quantity, dilution, areas, technique, consents, photos, and access logs). It declares empty sections instead of omitting them: a file that omits a section is indistinguishable from one where that section did not exist.
- **Record a complication for this session**: see [Outcomes and complications](/manuale/esiti-e-complicanze).
- **Export in CDA format**: the clinical document in exchange format.

⚠️ A session marked as entered in error no longer accepts complications or edits: it remains visible because deleting is not correcting.

## Common Errors

- **Batch left blank.** This is the case where traceability is most needed, and it is missing.
- **Treatment recorded the next day.** The session date is editable, but it must be corrected: incorrect dates are only noticed when someone reads them in a dispute.
- **Areas described in words instead of on the map.** "Cheekbones" is ambiguous; two dots with the quantity are not.

## Frequently Asked Questions

**Can I edit a saved session?** Yes, and the edit remains in the history with who and when. Nothing is silently overwritten.

**Does the treatment appear in the file?** Yes: product, batch, expiry, quantity, dilution, consents, photos, and access logs, in a single document.
