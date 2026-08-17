# Reminders and Recalls

This guide describes clinical reminders: those created manually, those generated from a treatment cycle, and those derived from the expected duration of a product. It is aimed at physicians and administrative staff.

## The three types, and why they are in the same list

| Origin | Example | Created by |
|---|---|---|
| Manual | "Recall Mrs. Rossi for the results" | The physician or administrative staff |
| Treatment cycle | "3rd session of 4, in 4 weeks" | The treatment plan |
| Product duration | "Result expected in 4-6 months: recontact" | The recorded session |

They all end up in the same `Reminders` section, and this is not laziness: for those working, "what do I need to remember" is **a single question**. Three separate lists for three different origins would be our distinction, not theirs. The source remains readable in each entry.

## Step 1: Creating a reminder

From the `Reminders` section, the `Add` button asks for a title, patient, assignee, priority, and due date. The assignee can be yourself or a colleague.

## Step 2: Recalls that generate automatically

When saving a session whose product has an expected duration **written in a consent**, the system suggests a recall at the appropriate date.

Two declared choices:

- **Recall at the lower end** of the expected duration: for botulinum toxin at 4 months, not 6. The reason is clinical before being commercial: the effect begins to wane at the start of the range, and a patient contacted when the effect has already faded in the meantime has gone elsewhere.
- **If the duration is unknown, nothing is suggested.** No estimation is made. An invented recall seems like medical advice.

Each entry states **where it comes from**, quoting the consent phrase: a reminder that cannot explain why it exists is a reminder the physician will dismiss.

## Step 3: What it does NOT do

⚠️ **No message is sent automatically to the patient.** The reminder is internal.

This is not a missing feature: it is a deliberate limit. Law 145/2018, Article 1, paragraph 525, prohibits registered professionals from sending healthcare communications with "attractive and suggestive elements," and the sanction targets **the physician**. An automatic message created by us would expose the client, not us.

When the recall needs to be communicated, it is done from the practice, with words chosen by those responsible for them.

## Common mistakes

- **Using reminders as an agenda.** Appointments belong in the `Appointments` section; here are things to remember.
- **Assigning everything to yourself in a practice with multiple operators.** The assignee is what makes the list useful to someone else.
- **Expecting the patient to receive something.** They do not, and the reason is above.

## Frequently asked questions

**Does an overdue reminder stay in the list for months?** No: beyond the maximum expected duration, the right moment has passed, and showing it as "to do today" would be noise.

**Do I get two recalls if I save the same session twice?** No: the recall is identified deterministically from the session, and the second save does not duplicate it.
