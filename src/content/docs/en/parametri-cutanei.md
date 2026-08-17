# Skin Parameters

This guide describes the measurement of **aesthetic skin parameters**: eleven values that Fibonacci calculates on a skin region you select on a photograph already in the patient record, their saving, and comparison over time. These are **photographic measurements**, not skin measurements: they describe the image of an area and are used to document with numbers what is currently documented only with two side-by-side photos.

⚠️ **This page only appears if the function has been enabled for your practice.** If you don’t see `Skin parameters` in the patient record toolbar, it’s not an error: the function is behind a switch that is off by default.

## What it doesn’t do, before what it does

This is also stated at the top of the page, with the same prominence as the numbers, and it’s not just a courtesy:

> This tool calculates photographic values on the region you define. It does not detect, flag, or count lesions, moles, or suspicious spots, does not attribute values to a cause, and is not a screening tool: it does not replace skin examination.

In practice: no value is compared to a threshold, there are no severity or grading judgments, no number is colored green or red, and the page never says “improved” or “worsened.” The numbers are displayed raw, with their unit; the judgment remains yours. If you notice something while looking at the region, it was your eye that noticed it: the program doesn’t look, it measures where you tell it to measure.

## Prerequisites

- Account with role `physician` or `admin practice`.
- At least one photograph in the patient record (see the guide “Clinical photos and before/after comparison”). Any view is fine, a frontal shot is not required.

## Where to find it

The `Skin parameters` button is in the top bar of the patient record, next to `Facial analysis`, and is visible from any tab. You can switch between the facial analysis page and the parameters page via a link in the top right corner.

## How to use it

1. **Choose the photograph.** Under `Photograph`, there is a strip of shots in the record, from the most recent. The first one is already selected.
2. **Trace the region.** Under `Region to measure`, drag your finger or mouse over the photograph: what remains outside darkens, so you can immediately see what is included in the calculation and what is not. You can redraw it as many times as you want; the last rectangle wins. Below the photograph, you’ll find the pixel measurement of the region you traced.
3. **Read the values.** They appear next to the photograph as soon as you release the drag.

⛔ **There is no predefined region, and this is not an oversight.** A program that chooses where to look on its own starts selecting findings, which is different from what this tool does. You always choose the area.

Changing the photograph resets the region: it was a rectangle on a different skin area, and keeping it would yield plausible numbers on a region no one selected.

The calculation happens **in the browser**: the photograph does not leave the system, and no external service receives it.

## The eleven items

| Item | What it indicates |
|---|---|
| Area with pigmentation darker than the local background | How much of the region is darker than the local average surrounding it, in percentage |
| Detected circular openings | How many small round openings are counted, within the declared diameter range |
| Average diameter of detected openings | How large they are on average, as a percentage of the short side of the region |
| Area occupied by detected lines | How much of the region is covered by lines that contrast filters detect |
| Total length of detected lines | Their summed length, in multiples of the short side of the region |
| Average color, lightness L* | The average lightness, from 0 (black) to 100 (white) |
| Average color, a* axis | The red/green axis of the average color |
| Average color, b* axis | The yellow/blue axis of the average color |
| Individual typology angle (ITA) | The colorimetric angle calculated from L* and b*, in degrees |
| Color inhomogeneity | How much the pixels in the region deviate on average from the average color |
| Area with red component higher than the region’s median | How much of the region exceeds the median red value of the region itself by a declared amount |

The labels indicate **what was measured on the image**, never what it might be due to: that interpretation is yours to make in front of the patient, and that’s why the program doesn’t write it for you.

### ITA is not phototype, and Fibonacci does not convert it to phototype

This is the first question that comes up, because in the literature, a conversion table between individual typology angle and Fitzpatrick phototype exists, and it’s six rows long. Fibonacci **does not apply it** and only shows the angle. Three reasons, in order of importance:

1. **A phototype is a grade, and this page does not assign grades.** The same rule applies here as for everything else: the tool measures, the physician classifies.
2. **The conversion, when measured, does not hold well for Fitzpatrick.** A 2025 study that automatically calculates ITA and maps it to two scales finds good agreement with the Monk scale and **less consistent** agreement with Fitzpatrick types. This is not surprising: Fitzpatrick is based on **reaction to the sun**, not color, and is an assessment, not a color measurement.
3. **Classifying a person by skin color from a photograph is biometric categorization based on a protected characteristic**, and as such, it is not a technical choice but a decision with its own regulatory consequences.

The phototype in Fibonacci remains where it has always been: the `Phototype (Fitzpatrick)` field in the aesthetic medical history, which the system already describes as “It is a physician’s assessment, not a patient’s response.” The angle measured here can help you fill it out, but it doesn’t fill it out for you.

The `How it is measured` button, below the values, opens the exact parameters of the method: working area, minimum region, local background radius, diameter range of openings, line filter orientations and thresholds, red component deviation. These are the tool’s parameters, like a camera’s aperture: none of them separates a “normal” value from an “abnormal” one.

## How large the region should be

It must be at least **120 pixels on each side** and **40,000 square pixels** in area. Below that, the page indicates this and does not display numbers.

The reason is measured, not precautionary: on a small region, the openings to count are few, and a count based on few elements fluctuates. Re-measuring the same skin without changing anything, the count varied by **33% on 21,000 square pixels** and by **9.8% on 78,000**: on a small region, the number changes by a third without anything happening to the skin. A number like that is not a measurement; it’s noise masquerading as a measurement, and it’s better to have no number at all.

For the same reason, below the values, the page states how many openings were counted in that region and the precision of the count. This is the tool’s tolerance, like that of a caliper: **it is not a judgment on the skin**. If you need a more stable count, enlarge the region.

## Saving to the patient record

The values are recalculated from the photograph every time you open the page. They are only saved to the patient record **if you save them**: below the values, select the `Measured area` from the list (the same area vocabulary you use for treatments and photos) and press `Save to record`.

The area is mandatory: without it, in the over-time comparison, a cheek and a forehead would end up in the same row.

Saving the **same region of the same photograph** again updates the measurement instead of duplicating it, and the button indicates this: it changes to `Update in record`. Two different areas on the same photograph coexist without overwriting each other.

What ends up in the patient record carries with it where it came from: the source photograph, the exact rectangle (so the same measurement can be replicated identically), the method used to obtain it, and who decided to save it. The date of the measurement is that of the **shot**, not the saving: the skin measured is that from then.

## Over time

At the bottom of the page, `Over time, by area` lists the saved measurements, **separated by area**, with the most recent value and the difference from the first.

Above the series, the same sentence always appears, and it’s the most important thing on the page:

> Re-measuring the same skin without changing anything, in testing, these numbers varied between 1% and 6% (up to 10% for the opening count, on a small region). A difference smaller than this is not a difference.

The graphs are also calibrated to that number: a difference smaller than the tool’s precision appears **flat**, not rising. Without this adjustment, a line between just two measurements would always draw a full-height diagonal, even for a zero difference, and the graph would say something the numbers do not.

## The limits, in full

- **They measure the photograph, not the skin.** They change with lighting, shooting distance, lens, and file compression. For two measurements to be comparable, two comparable shots are needed: same setup, same lighting, same distance. This applies exactly as it does for before/after comparison.
- **The repeatability test was done on studio photographs**, well-lit and in focus. It does not account for your room’s lighting, residual makeup, or time of day. The numbers above are therefore a **minimum**: on your setup, the deviation will be larger, not smaller.
- **No trained model.** The values come from calculations that can be described one by one (local averages, connected components, oriented filters, color space conversion), not from a system trained on clinical cases. This is a choice, not a technical limitation: a trained system would answer the question “what does it resemble,” which is a different question.
- **Not a screening tool.** Measuring something in a region does not mean the rest has been examined.

## Related guides

- “Clinical photos and before/after comparison,” for the shooting protocol: this is what makes measurements comparable.
- “Facial analysis,” for shape and proportion measurements on the frontal shot.
