# Facial Analysis

This guide describes the morphological analysis of the face: the measurements that Fibonacci derives from a frontal photograph, the comparison with neoclassical canons, the three-dimensional view, the photographic series by view, saving to the medical record, and recording the clinical judgment (PGAIS) on the before/after comparison. The analysis produces measurements (angles, ratios, deviations) and tracks them over time; the judgment remains the physician's.

## Prerequisites

- Account with the role `Physician` or `Practice admin`.
- At least one frontal photograph of the face already in the medical record (see the guide «Clinical photos and before/after comparison»).

## Where to find it

The `Facial analysis` button is located in the top bar of the patient's medical record, next to `Data and contacts` and the `Export` menu, and is visible from any tab.

## What it measures, and on which photo

Detection occurs **in the browser**: the photograph does not leave the system, and no external service receives it. From a frontal shot, the analysis derives:

- the **facial midline** and the **parallelism of planes** (interpupillary, external canthi, and labial commissures), as deviation in degrees from the perpendicular to the midline;
- the **thirds** (ratio of middle third to lower third). The upper third is not calculable: it requires the hairline, which the model does not identify, and the page states this instead of estimating it;
- **which side is wider** at the zygomatic arches, external canthi, and commissures. It indicates which side, not "how asymmetric the face is": the model's source excludes this second use;
- the **quality of the shot** (head rotations), which marks non-frontal shots instead of hiding their numbers.

Measurements are dimensionless (angles, ratios, percentages) because from a photograph without a metric reference, millimeters cannot be honestly derived.

## Comparison with the neoclassical canon

Each item shows the measured value, the reference canon value, and the deviation between the two. The comparison with the canon and the before/after comparison remain separate: merging them would yield a number that answers neither "how much it deviates from the reference" nor "what the treatment achieved."

## The 3D view

The `Photo | 3D` toggle shows the face mesh reconstructed from landmark points, navigable (*«Drag to rotate, scroll to zoom»*), in surface, wireframe, or **`Relief`** mode, which colors the surface by depth instead of mimicking skin: this is how volume asymmetries are visually apparent. All 468 landmark points are also visible.

**This is not a scan**: depth is estimated from a single photograph and is relative: it serves to rotate around the shape, not to measure protrusions or volumes. For volumes and surface maps, stereophotogrammetry hardware is required, which this page does not claim to replace.

## Profile angles, manually placed

On lateral views, the model does not provide the necessary points, so the physician places them: the `Profile angles (points placed manually)` section asks for **six points** and, when all are present, measures the angles (*«Six points placed: angles measured»*). `Restart` resets them.

This is the only part of the page where the measurement depends on where you click: two different sets of clicks yield two different results, and repeatability is yours.

## Measurements in millimeters

`Calibrate with a marker` converts ratios into millimeters: declare the `Actual size (mm)` of an object present in the shot and click on its two ends. From there, the page displays the `Absolute measurements (calibrated)`; `Redo clicks` and `Recalibrate` repeat the operation.

⚠️ **Calibration applies only on-screen**: millimeters are not saved to the medical record because they depend on a marker and two clicks at that moment. What is saved are the ratios and angles, which do not require scaling.

## The live mirror

`Live mirror` activates the camera and shows the patient their face in real time, with the prompt to `Frame the face`. **It does not measure or record anything**, and the camera *«is off. It turns on only when you request it»*: it is used during the consultation to discuss an area while looking at it together.

## The photographic series by view

The clinical photographic protocol is a series of shots from defined views (frontal, lateral, 45° oblique, plus dynamic shots for facial expressions) repeated identically at each visit. For this reason, upon upload, each photo can specify the **view**; the `Photos` tab shows the series from the most recent visit and indicates which views are missing.

Three rules of the series:

- the view is **optional**: photographs uploaded before this feature do not have it, and "not specified" remains different from "frontal." The system never fills in the field automatically;
- the checklist **informs but does not block**: shots outside the series are allowed;
- when taking a photo from the camera with a selected view, the **previous shot of the same view appears transparently in the viewfinder**: overlaying the face on the ghost image is the practical way to repeat framing and distance.

The analysis works on frontal shots (and those without a specified view); if other shots are excluded, the page indicates how many.

## Saving measurements to the medical record, and reading them over time

Measurements are recalculated from the photograph each time the page is opened; **they are only saved to the medical record if the physician saves them**, using the `Save to medical record` button below the numbers. This is an explicit action by design: a number generated by a model enters clinical documentation only by the physician's decision, and the record itself declares who measured (the model, in the browser), from which photograph, and who decided to save.

Three rules for saving:

- the clinical date of the measurement is that **of the shot**, not the day it is saved;
- re-saving the same photograph **updates** the existing record, it does not create a second one;
- a shot marked "to be repeated" (rotated head) **cannot be saved**: its numbers are not comparable and would harm a historical series.

From the second save onward, the page displays the **Over time** section: a small series for each measurement, on the actual dates of the shots, with the most recent value and the difference from the first. This is the comparison of the face with itself (which this page centers) extended beyond the pair of photographs.

## Recording the PGAIS from the comparison

After selecting two photographs (the first is the shot under examination, the second is the comparison), the "What has changed" section shows the differences and the `Record PGAIS` button. The PGAIS is the physician's judgment on the result, given **by comparing the pre- and post-treatment photographs**: recording it here means also recording which two shots were being viewed, without copying dates.

The response is a label («Much improved», «Improved», …), never a number: the GAIS numbering is used in literature in opposite directions, and a number saved without the direction would no longer be interpretable over time.

## Common errors

- **Comparing shots from different views.** A frontal and a 45° shot from the same day only resemble each other in name: the comparison is valid between homologous views.
- **Photographing the "after" too soon.** With unabsorbed edema, the comparison documents swelling, not the result.
- **Reading the canon as a report card.** It is a historical geometric reference: the deviation is a difference between two numbers, not a treatment indication.

## Frequently asked questions

**Are measurements saved to the medical record?** Only if the physician saves them, using the dedicated button: they are recalculated from the photograph each time the page is opened, and the copy in the medical record declares who measured and from which shot. See «Saving measurements to the medical record».

**Does the analysis send the photo to an external service?** No. The landmark model runs in the browser; the photograph remains encrypted in the system and is decrypted only for those with the right to view it, as with any other clinical photo.

**Why is there no overall harmony score?** Product choice: the page provides all measurements; synthesis and judgment remain with the physician.
