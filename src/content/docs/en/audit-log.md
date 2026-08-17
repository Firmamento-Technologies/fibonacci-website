# Audit Log: who did what, and when

Every operation on patient data leaves a trace: who did it, when, and on which record. The **Audit Log** is where those traces can be read.

It serves three practical purposes: responding to a patient who asks who has viewed their medical record, reconstructing what happened when something doesn’t add up, and demonstrating to an inspection that the practice keeps track of its activities.

## Who can access it

Only users with the practice administrator role. If the **Audit Log** option doesn’t appear in the navigation, your user doesn’t have that permission: the administrator grants it in the `Settings`.

## What you see

A table, with the most recent row at the top. For each entry:

- **when** it happened;
- **who** did it: the operator’s name, or *System* for automated operations;
- **what** was done: creation, read, update, deletion;
- **on what**: the record or document affected;
- **outcome**: success, warning, error.

## The filters

Above the table, you can narrow down the search.

- **Clinical activity** or **system activity**. The first is what people do on medical records; the second is what the program does automatically: imports, automated processes. Keeping them separate is useful because the latter are numerous and would obscure the former.
- **The action**: only reads, only modifications, only deletions.
- **The outcome**: only warnings, only errors.

## Responding to a patient who asks who has viewed their medical record

This is the most common case, and it’s the patient’s right: the law allows **fifteen days** to respond.

1. Filter by that patient.
2. Select the date range.
3. Press **Export**.

You’ll get a CSV file (which opens in any spreadsheet) containing exactly the rows displayed on screen. This is the format in which the response should be provided.

## Integrity: why the log cannot be altered

The log is designed so that once a row is written, **it cannot be modified or deleted**, and any tampering would be visible: each row is linked to the previous one, so altering one would make the change evident in all subsequent rows.

⚠️ **This verification doesn’t have a button in the interface.** It’s a check performed on the server, and the result must be requested from support. If tampering were detected, it wouldn’t be a routine report: it’s a security incident and must be reported immediately.

## How long traces are kept

For as long as the clinical documentation they refer to. They remain **even after** a patient is deleted: without their name, but with a trace that the operation occurred. This is intentional: a log that disappears with the data would no longer prove anything.

## What is NOT on this page

To avoid searching for what doesn’t exist:

- **no signed PDF export**: the export is in CSV;
- **no integrity verification button** (see above: it’s done on the server);
- **no graphical timeline** of operations on a patient;
- **no saveable filters among favorites**, nor search by network address.
