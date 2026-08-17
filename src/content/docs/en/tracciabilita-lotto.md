# Lot Traceability

This guide explains how to record the lot number of injected products and how to answer the question that truly matters: **which patients received a specific lot**. It is intended for physicians and those managing the practice’s inventory.

This question is not theoretical. When a manufacturer recalls a lot or when a reaction linked to a specific product is suspected, the answer must be provided within minutes and in writing.

## Prerequisites

- Account with the role `Physician` or `Practice admin`.
- `Lot search` function active for your practice. If the option does not appear in the menu, the function has not been enabled: contact support.

## Step 1: Record the Lot During the Session

When recording an injectable treatment, in addition to the product and quantity, the following fields are available:

- **Lot number**, as printed on the packaging,
- **Expiration date**,
- **Dilution**, when relevant.

The lot number must be entered **exactly as printed**, without adding spaces or hyphens for convenience: it is the key the search will use to find the session.

The system **records** these fields, it does not calculate: the declared dilution is written as-is, without recalculation or correction. If a value appears inconsistent, the system warns but does not block saving. This is a deliberate choice: software that refuses to record what was done produces records that do not reflect reality.

## Step 2: Search by Lot

The `Lot search` option in the main menu opens a single-field search. Entering the lot number returns a list of sessions where that lot was used, including:

- Patient,
- Session date,
- Administered quantity,
- Recorded expiration date.

The search scans all patients in the practice in a single query. There is no need to know in advance which patients to search: this is precisely the point.

## Step 3: What to Do with the List

The list is the starting point for two distinct activities, and it is best to keep them separate:

- **Manufacturer recall.** The list identifies patients to contact. The contact is a clinical communication and must be handled by the practice, not automated.
- **Adverse event reporting.** If the lot is suspected in relation to a reaction, the report must be recorded in the patient’s file, under outcomes and complications, where there is a field for the product and lot number.

## Common Mistakes

- **Lot entered with different formatting in different sessions.** `A1234-B` and `A1234 B` are two different lots for a search. It is worth agreeing on a single way to transcribe it in the practice.
- **Lot left blank because “it’s always the same.”** This is the case where traceability is most needed, and missing.
- **Expiration date not recorded.** Without it, it is impossible to distinguish between an administration within the product’s validity and one after expiration: this is data that protects the physician.

## Frequently Asked Questions

**Is the lot number mandatory?** The system does not enforce it. However, it is the data that allows responding to a recall, and its absence is only noticed when needed.

**Can I search by product instead of lot?** The search is by lot. The product appears in the results list and in the session record.

**Do lot details appear in the session file?** Yes: product, lot number, expiration date, quantity, and dilution appear in the file, along with consents and access logs.
