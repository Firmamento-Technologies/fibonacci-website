# Outcomes, Complications, and Emergencies

This guide covers the three things that happen **after** a session when something doesn’t go as planned: the `Emergency` mode, recording a complication, and the reporting form for the Ministry.

⛔ **None of these screens provide clinical guidance.** They do not suggest drugs, dosages, or administration routes, do not formulate a diagnostic suspicion, do not assess severity, and do not compare time against any threshold. This is a deliberate choice in the product’s intended use, not a missing feature: in an emergency, any suggestion would turn this software into a medical device, and what’s truly missing in that moment isn’t advice—it’s the report that no one writes because their hands are full.

## First: Prepare the Practice

Two fields in `Settings`, practice section, that must be filled **before** they’re needed:

- **`Complication protocol (for Emergency mode)`**: The practice’s protocol, one step per line. It’s **your** text: it’s displayed as written, not completed or corrected. Without it, Emergency mode keeps time and records notes but doesn’t show any clinical content.
- **`Emergency drug: expiration`**: Month and year. The right time to notice it’s expired isn’t when you need it. The system doesn’t ask which drug it is—that’s the practice’s decision.

## Emergency Mode

It opens **from the session row**, in the patient’s `Treatments` tab: this is where the patient is already in front of you, and searching for a menu item at that moment is wasted time. It doesn’t appear on its own and isn’t an alarm—you press it.

The screen is full-screen, with no navigation, and contains three things:

1. **`Time elapsed since opening`**: A running stopwatch. It doesn’t change color, count down, beep, or alert.
2. **The practice’s protocol**, one step per line, to check off as you perform it.
3. **`What to record in the medical record`**: A free-text field for what you want documented.

If the expiration date of the emergency drug recorded in settings has passed, the page states: `The expiration date recorded in the practice settings has passed`.

⚠️ **The network may fail, but the report won’t.** The start time and checked steps are saved in the browser **before** any server call: reloading the page or losing the connection doesn’t reset the stopwatch or lose the report. The save to the medical record happens on closing, and if it fails, the report remains downloadable.

On closing, you select the `Severity`, and the report records **the times when you marked each step**, not times reconstructed afterward.

`Exit without closing` leaves the session open: the stopwatch continues.

## Recording a Complication

From the same session row, the action `Record a complication for this session`. The complication remains **linked to that treatment**, with its product and lot: that’s why it’s recorded from there and not from a separate list.

The form asks for:

- **the complication**, from a closed list of twelve options: ecchymosis, edema, persistent erythema, nodule, granuloma, infection, skin necrosis, vascular occlusion, palpebral ptosis, asymmetry, allergic reaction, and `Other (described in notes)`;
- **`When you observed it`**. The date **does not** default to today: complications are often noticed days later, and a pre-filled field is one no one corrects;
- **`Severity`**: mild, moderate, or severe. The physician chooses: there’s no alert saying “this complication is severe”;
- **`What you observed`** and **`What you did`** (e.g., hyaluronidase, compresses, antibiotic);
- **`Outcome (if already known)`**, which can be left as `Not yet known`.

Recorded complications appear **within the session’s tab**, highlighted: to know how it went, you don’t have to look in two places.

⚠️ **A session marked as entered in error does not accept complications.**

## The Ministry Reporting Form

Next to each recorded complication, the link **`Reporting form`** appears, which prepares the text to copy into the Ministry’s online form.

Why it exists, and under what terms:

- **Ministry of Health Decree of July 1, 2025**, in force from March 18, 2026, implements Article 10 of Legislative Decree 137/2022 and expressly covers devices in Annex XVI of EU Regulation 2017/745, i.e., **dermal fillers**;
- A **serious incident, even suspected**, must be reported *«promptly and in any case no later than ten days»* (Article 4(1)); a non-serious incident **may** be reported within thirty days (Article 4(3));
- The obligation lies with the **healthcare professional**, and failure to report is punishable by a fine of €26,000 to €120,000.

When recording a complication, the system creates a **reminder** with the deadline calculated from those terms, which you’ll find in `Reminders`.

Three things this feature **does not** do, and it’s best to know them upfront:

- ⛔ **It doesn’t transmit anything.** The channel is the Ministry’s online form, with physician authentication (SPID, CIE, or CNS). Here, the content is prepared.
- ⛔ **It doesn’t decide if the incident is serious**: it reads the severity you recorded and derives the deadline from that.
- ⛔ **It doesn’t include patient data**, and this isn’t an oversight: Article 2(6) of the decree requires that the report *«shall not contain data allowing the identification of the subject involved»*. Pre-filling from the medical record—which would be the obvious thing to do—would cause the tool meant to help to commit the violation. The form receives the event and the product, never the patient.

⚠️ **Recording a complication is not a pharmacovigilance report**, and the form states this: they are two different channels, with different recipients.

## Common Mistakes

- **Opening Emergency mode and not closing it.** The report is written to the medical record on closing: a session left open remains a running stopwatch.
- **The protocol never uploaded.** Without it, in an emergency, the screen is just a stopwatch and a notes field. It’s filled once, in `Settings`.
- **Recording the complication on any session.** It belongs to the session that caused it: that link carries over the product and lot when needed.

## See Also

- [Recording a Treatment](/manuale/trattamenti)
- [Lot Traceability](/manuale/tracciabilita-lotto)
- [Reminders and Recalls](/manuale/promemoria-e-richiami)
