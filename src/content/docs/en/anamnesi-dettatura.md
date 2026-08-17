# Voice Input: Dictation

> ⚠️ **Rewritten on 2026-08-17 based on the actual screen.** The previous version described a panel that never existed: a `Extract fields` button, a reliability score for each field with green, yellow, and red colors, three buttons per row (`Accept` / `Edit` / `Discard`), and a `Settings > Dictation` section with silence threshold and transcription retention. None of this is in the product. What follows is.

Dictation transcribes what you say and, where the form allows it, suggests pre-filled fields. **It never writes directly to the medical record**: between your voice and the saved data, there is always a review and a button pressed by you.

## Where to dictate

The button appears in three places, with a different label in each because "dictate what" changes depending on the location:

- **`Dictate medical history`**, in the `Medical History` tab of the record;
- **`Dictate the session`**, in the treatment module, next to the notes;
- in the **clinical assessment**, when the practice has that module active.

At rest, it is a single line: a button and a phrase. The box appears when there is content inside.

## Prerequisites

- Account with `physician` role and clinical access to the patient.
- Working microphone with browser permission granted. Transcription quality depends more on ambient noise than on the microphone.
- Connection: transcription occurs on a service, not in the browser.

## Step 1: Dictate

Press the button. A red dot appears with the text `Listening`, and below, in `Transcription`, the text appears as you speak: *«Speak freely: the text appears here as you speak»*.

Two buttons: **`Done`** closes the dictation and moves to review, **`Cancel`** discards it.

## Step 2: Review

At the end, the transcribed text appears in an **editable** area, under a notice worth reading once:

> Review before using it. Automatic transcription is most likely to make mistakes with drugs, dosages, and technical terms: correct them below.

If the form allows field extraction, next to the notice appears the **extraction reliability** as a percentage. This is a single number for the entire extraction, not per field, and it is a technical indicator: it shows how clear the model found the text, not how correct what you said is.

## Step 3: What to do with it

Three buttons, each doing different things:

- **`Discard`**: deletes the transcription.
- **`Use text`**: takes the text as is and places it in the target field (for example, at the end of the session notes). It only appears where that text has a destination: elsewhere, it would be a button that deletes for no reason, and it has been removed.
- **the application button** (`Suggest for the record` in medical history, `Fill fields` in treatment): takes the **recognized fields** and transfers them to the form, where they remain editable. It only appears if the extraction produced something.

⚠️ **Even after applying the fields, saving is a separate action.** Applying fills the form; what goes into the record is what you save.

## What dictation fills in, and what it doesn’t

This is where expectations most often break, so it’s better to measure than to promise.

**In treatment**, product, quantity, lot, off-label use, and its justification are suggested. **Not** filled in are device parameters (wavelength, fluence, spot, frequency, pulse duration, passes, cooling, endpoint), nor dilution, UDI, or lot expiration: these must be entered manually.

**Dictated areas do not become dots on the map.** They are added at the end of the notes in the form `[dictated areas: …]`, along with any `[suggested category: …]`, because marking an area requires its exact code. To transfer them to the map, use the `Auto-extract areas from text` button: see [Treated Areas](/manuale/body-map).

⚠️ **Dictation is in Italian.** Even with the interface in English, recognition and extraction work in Italian.

## Clinical responsibility

The principle is non-negotiable: **the system does not write anything to the record without an explicit action by the physician.** Every transcribed text and every suggested field require review and an affirmative action. Responsibility for correct completion remains with the person who signs the record.

## Audio flow privacy

Audio is sent to the transcription service (Mistral, European Union) and **is not retained** by us or them beyond processing time; content sent via API is not used to train models.

If you prefer not to use dictation for a visit, complete the form manually: no audio trace remains anywhere.

## Tips

- **Speak at a natural pace**, without over-enunciating: the model is calibrated for spontaneous Italian speech, and slowing down worsens the result.
- **No voice commands** like «period» or «new line»: punctuation is added automatically.
- **Drugs in full**, active ingredient and dose: «pantoprazole forty milligrams one tablet in the morning».
- **One voice at a time.** If the patient speaks at the same time as you, transcription quality drops.
- **Always double-check numbers.** Dosages and lots are exactly what transcription gets wrong most often, and they are also what matters most.

## Troubleshooting

**The microphone is not detected.** Check browser permissions (in Chrome, the padlock to the left of the address, `Microphone` entry) and operating system settings: a microphone turned off at the system level is not accessible to the browser.

**A red error appears below the button.** The message states the cause: usually, it’s denied permission or the transcription service being unreachable.

**The transcription arrives, but no fields are suggested.** The application button only appears if the extraction recognized something. You can still use `Use text` and correct manually.

**I dictated the areas, but the map is empty.** This is the expected behavior: see above, «What dictation fills in, and what it doesn’t».

## See also

- [Patient record creation and management](/manuale/anagrafica-paziente)
- [Treated areas: on the photo and 3D model](/manuale/body-map)
- [Recording a treatment](/manuale/trattamenti)
- [Audit log and access traceability](/manuale/audit-log)

Last revision: {ULTIMA_REVISIONE}
