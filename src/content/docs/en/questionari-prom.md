# Patient Questionnaires (PROM)

**PROM** (*Patient-Reported Outcome Measures*) are questionnaires where the patient reports their experience: satisfaction, perception of the result, reported symptoms. They document outcomes from the recipient's perspective, not just the provider's.

⚠️ **This section only appears if the feature has been enabled for your practice.** If you don't see *Questionnaires* in the patient record, it's not an error: the questionnaire engine is behind a toggle, off by default.

## How it works

From the patient record, **Questionnaires** tab:

1. Select the questionnaire from the available list;
2. Fill it out: questions and rules are defined within the questionnaire itself, not hardcoded in the program—adding a new one doesn’t require a new application version;
3. Save it.

After saving, there’s an important step: questions that express a **measurement** are extracted and recorded as measurable data, not just text in a form. This allows comparing two completions over time.

## History

Below the questionnaire, you’ll see previous completions with dates. This is where PROMs add value: a single response means little, two responses over time show a trend.

## Who fills it out, and where

The questionnaire is completed **with the patient** during the visit, or you can hand them the tablet: there’s a dedicated mode that opens just the questionnaire, without the rest of the record around it.

⛔ **This mode is a usage separation, not a security one.** The open session remains the physician’s: it’s fine to hand over the tablet while staying present, **not** okay to leave the device unattended in the waiting room.
