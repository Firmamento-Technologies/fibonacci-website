# Prescriptions and Therapies

This guide explains how to complete a prescription, how the system checks for allergies, and what happens when the check cannot be performed. It is intended for physicians.

## Prerequisites

- Account with the `Physician / Healthcare professional` role, with Order registration details completed: these appear on the printed prescription.
- Patient record with medical history, if you want the allergy check to have data to work with.

## Step 1: Select the drug

The drug field searches the AIFA catalog, which includes both brand names and **active ingredients**: typing `hyaluronic` or `botulinum` will display the corresponding products, even if the brand name differs.

⚠️ **Fillers are not in the catalog, and this is correct**: they are CE-marked medical devices, not medications, and do not appear in a drug archive. They are recorded as a treatment (see the guide `Register a treatment`), not as a prescription.

## Step 2: Allergy check

When selecting the drug, the system compares it with the allergies recorded in the medical history and displays a warning if a match is found.

🔑 **The check is fail-open, and this must be understood**: if the medical history is empty or the drug is not recognized, **no warning appears**. The absence of a warning does not mean "no allergy"; it means "no match found." This is an important distinction, and it is why the check does not replace a properly conducted medical history.

## Step 3: Dosage, frequency, duration

The fields follow the prescription structure: dosage, frequency, periodicity, duration in days, and patient notes. Notes are printed: this is where usage instructions and contraindications to remember should be entered.

## Step 4: Print

The printed prescription includes the practice and physician details (name, address, Order registration number), taken from the practice configuration. If these fields are empty, the prescription prints them as blank spaces to be filled in by hand: the system does not invent identifying data.

## Common mistakes

- **Relying on the allergy warning as if it were a guarantee.** It is a helpful tool, not a safeguard: without a medical history, it has nothing to compare against.
- **Recording a filler as a prescription.** It is a device: it belongs in the session, with batch number and quantity.
- **Order details not completed.** These appear blank on the prescription and consents and are only noticed when the document is already in the patient’s hands.

## Frequently asked questions

**Can I prescribe drugs covered by the National Health Service?** No: the prescription generated here is a private prescription. Features for the electronic channel exist in the product but are disabled and require regional accreditations.

**Are prescriptions included in the patient export?** Yes, along with the rest of the medical record.
