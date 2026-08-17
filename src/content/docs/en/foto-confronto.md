# Clinical Photos and Before/After Comparison

This guide explains how to acquire, store, and compare clinical photographs in Fibonacci. It is intended for physicians and staff documenting treatments.

Photographs are the documentation that holds up or doesn’t when a result is contested, and they are health-related data under Article 9 of the GDPR: for this reason, the process described here is not the same as that of a generic image archive.

## Prerequisites

- Account with role `physician` or `practice admin`.
- Patient record already created.
- Informed consent for photographic treatment collected and stored. Consent for treatment does not cover photography: these are two distinct purposes, and the latter must be documented separately.

## How Photographs Are Stored

Each image is encrypted **before leaving the browser**, using a key generated for that single photograph. That key is in turn protected with a project key residing on the server and never entering the browser’s code.

Three practical consequences worth knowing before working:

- Anyone obtaining a copy of the database or disk would not see the photographs: they would see encrypted blocks.
- Opening a photograph is an access and is recorded in the `Audit Log`, with who and when. This is not a limitation: it is what allows demonstrating, years later, who saw what.
- Photographs do not appear in print previews of clinical documents. They must be delivered separately and consciously.

## Step 1: Acquire a Photograph

From the patient’s record, the `Photos` section shows existing acquisitions grouped by date. The `Add` button opens the upload window, which accepts images from the device’s camera or files.

Before saving, the system performs two automatic operations:

- **Removal of EXIF metadata**, including geographic location. A photograph taken with a phone in the practice carries coordinates: delivering it to a third party would also mean delivering the address of who took it.
- **Face detection**, with the option to blur them. Blurring is the physician’s choice and is not automatic, because in aesthetic medicine the face is often the subject of documentation itself.

Upon saving, indicate the treated area and, if relevant, the treatment the photograph refers to. This association is what makes the comparison in step 3 possible.

### The View and the Standard Series

Each shot can declare the `View`: `Frontal`, `Right lateral`, `Left lateral`, `Right 45° oblique`, `Left 45° oblique`, `Dynamic (facial expression)`. This is the clinical photographic protocol: the same series of shots, repeated identically at each visit, is what makes two dates comparable.

Three intentional rules:

- **The view is optional.** Photographs uploaded before this feature do not have it, and “not specified” remains different from “frontal”: the system never fills the field automatically.
- **The checklist informs and does not block.** The `Photos` tab shows the series from the most recent visit and indicates which views are missing; shots outside the series remain allowed.
- **When shooting from the camera with a selected view, the previous shot of the same view appears transparently in the viewfinder** (*“Previous shot in transparency: overlap to repeat the framing”*). Overlapping the face with the ghost is the practical way to repeat framing and distance, and the camera also assists with the pose oval and the reminder *“Eyes on the line · uniform frontal light · neutral background”*.

### What That Photo May Be Used For

Upon upload, declare the purpose: `C1: Clinical:` (necessary for treatment), `C2: Educational:`, and `C3: Promotional:`. The first remain in the record at all times; the other two depend on separate, revocable consent, and for promotion, Law 145/2018 applies. Outside of care, anonymization is mandatory.

## Step 2: Organize by Session

Photographs associated with a treatment appear in the corresponding session row. Unassociated photographs remain in the general list, ordered by date.

Operational tip: Always acquire at least one shot before treatment, with the same framing and lighting used afterward. A comparison between two photographs taken under different conditions does not document the result: it documents the difference in light.

## Step 3: Before/After Comparison

In the `Photos` section, selecting two images of the same area opens the side-by-side comparison view. The view shows the two dates, the area, and any intervening treatment.

The comparison features a **draggable central bar** (*“Pre on left, Post on right”*) and a `Detect face and automatically align photos`, which overlays the two shots using facial landmarks when framings do not match; `Remove alignment` returns to the images as taken.

⚠️ **Alignment is a reading aid, not a photograph correction**: original images are not modified. Aligning two shots taken from different angles makes them overlayable, not comparable: the series by view remains the correct method.

The comparison is a view, not a document: it does not modify images or create new ones. If delivering the comparison to the patient is needed, export the two original photographs.

From the comparison, you can also record the **PGAIS**, the physician’s judgment on the result: see [Facial Analysis](/manuale/analisi-del-volto).

## Step 4: Deliver Photographs to the Patient

The patient has the right to receive their data, including photographs, in a readable format. Image export decrypts them at the time of delivery: they leave in cleartext in the package, while the project key is never delivered.

The reason is precise: that key does not only open the photographs being delivered; it opens every existing encrypted copy, including those in backups, and it is not revocable. Delivering it would mean granting access to material not being delivered.

## Common Mistakes

- **Photographs without specific consent.** Consent for treatment is not consent for photography. If the latter is missing, the image should not be acquired.
- **Comparisons between different framings.** These are the most common cause of result disputes: the perceived difference may depend on the angle, not the outcome.
- **Sending photographs via ordinary messaging.** These are Article 9 data: the channel must be chosen accordingly, and an unencrypted chat is not that channel.

## Frequently Asked Questions

**Can I delete a photograph?** Yes. Deletion removes the image, but a record remains in the `Audit Log` that a photograph existed and was deleted, with who and when. This is a safeguard, not a remnant.

**Do photographs end up in the report?** No, not automatically. The session file states that they exist but does not embed them, because their opening is a separate access that must remain tracked.

**How much space do they take up?** Approximately 18 GB per practice per year with intensive use. This is why the image archive is on dedicated space and not on the same disk as the database.
