# Facial Analysis

This guide describes the **Facial Analysis** page: the **direct comparison between two photographs** (before and after), the **three-dimensional view** of the face, the **live mirror**, and the recording of the **clinical judgment (PGAIS)** on the comparison.

The page **does not measure**. It does not calculate angles, ratios, deviations, or scores, does not save them in the medical record, and does not compare them with any reference: it displays the photographs and the shape of the face, and the judgment remains the physician’s.

## Prerequisites

- Account with role `medico` or `admin studio`.
- At least one frontal photograph of the face already in the medical record (see the guide "Clinical Photos and Before/After Comparison").

## Where to find it

The `Analisi del volto` button is located in the top bar of the patient’s medical record, next to `Dati e persone` and the `Esporta` menu, and is visible from any tab.

## Before/After Comparison

The first click selects the shot under examination, the second on another photograph adds the comparison: the two cards are placed side by side and viewed together. This is the central action of the page.

Above each photograph, the page indicates when the **shot is not comparable**: a different pose (chin raised, head rotated) changes what is visible, and two different poses cannot be compared. The warning does not block anything: it informs before someone draws a conclusion.

## The 3D View

The `Foto | 3D` switch displays the shape of the face reconstructed from landmark points, navigable (*"Drag to rotate, scroll to zoom"*), in surface, mesh, or **`Rilievo`** mode, which colors the surface by depth instead of mimicking the skin: this is how volume asymmetries are visible to the eye. All 468 landmark points are also visible.

**This is not a scan**: depth is estimated from a single photograph and is relative. It is used to rotate around the shape and show it to the patient, **not** to measure protrusions or volumes. For volumes and surface maps, stereophotogrammetry hardware is required, which this page does not claim to replace.

## The Mesh Overlay on the Photograph

The `Maglia` button overlays the landmark point mesh on the photograph: it shows **how the software sees the shape of the face**. It is not a measurement or a judgment; it remains active between photos because those who use it do so consistently.

## The Live Mirror

`Specchio dal vivo` activates the camera and shows the patient their face in real time, with the prompt to `Inquadra il viso`. **It does not measure or record anything**, and the camera *"is off. It only turns on when you request it"*: it is used during the consultation to discuss an area while looking at it together.

## The Photographic Series by View

The clinical photographic protocol is a series of shots taken from defined views (frontal, lateral, 45° oblique, plus dynamic shots for facial expressions) repeated identically at each visit. For this reason, upon upload, each photo can indicate the **view**; the `Foto` tab displays the series from the most recent visit and indicates which views are missing.

Three rules of the series:

- The view is **optional**: photographs uploaded before this feature was available do not have it, and "not indicated" remains different from "frontal". The system never fills in the field automatically;
- The checklist **informs but does not block**: shots outside the series are allowed;
- When taking a photo from the camera with a selected view, the **previous shot of the same view appears transparently in the viewfinder**: overlaying the face on the ghost image is the practical way to repeat framing and distance.

The page works on frontal shots (and those without a specified view); if other shots are excluded, it indicates how many.

## Recording PGAIS from the Comparison

After selecting two photographs, the `Registra PGAIS` button appears. PGAIS is the physician’s judgment on the result, given **by comparing the pre- and post-treatment photographs**: recording it here means also recording which two shots were being viewed, without copying dates.

The response is a label ("Much improved," "Improved," etc.), never a number: the GAIS numbering is used in opposite directions in the literature, and a number saved without its direction would no longer be interpretable over time.

## Common Errors

- **Comparing shots of different views.** A frontal and a 45° shot from the same day only resemble each other in name: the comparison is valid between homologous views.
- **Photographing the "after" too soon.** Before edema has subsided, the comparison documents swelling, not the result.
- **Reading the 3D as a measurement.** It is a representation of the shape derived from a single photograph: it is used to observe and show, not to quantify.

## Frequently Asked Questions

**Does the page save anything in the medical record?** Only the PGAIS, which is the physician’s judgment, along with the two shots it refers to. The 3D shape and the mesh are recalculated from the photograph each time the page is opened and are not stored.

**Does the analysis send the photo to an external service?** No. The landmark point model runs in the browser; the photograph remains encrypted in the system and is decrypted only for those with the right to view it, as with any other clinical photo.

**Why are there no facial measurements?** A product choice. A clinical number only makes sense with its declared accuracy and with someone accountable for that accuracy: until that exists, the page displays the photographs and the shape, leaving measurement and judgment to the physician.
