# Treated Areas: On the Photo and on the 3D Model

> ⚠️ **Rewritten on 2026-08-17 after reviewing the screen.** The previous version
> described a summary table with drag-and-drop reordering, keyboard shortcuts,
> an `Import from previous visit` button, and an `Insert custom product` option: **none of these exist**, and this is the worst flaw a guide can have, because the reader looks for the button and concludes the product is broken. If you find something here that isn’t on the screen, report it.

Within a session, treated areas are marked on an image instead of being described in words: each point is a **numbered red dot**, and the list of areas is compiled automatically as you place them.

There are **two surfaces**, and they are two ways of indicating the same areas:

| Option | How to mark | What it shows |
|---|---|---|
| `Photo` | a click on the portrait | the frontal portrait, male or female: 76 facial areas |
| `3D` | double-click on the model | the full body, **including the face**, male or female |

⚠️ **Until August 17, 2026, there was also a choice between `face` and `body`, which has been removed**: “it only causes confusion.” The 3D model is **one**, with the facial shell on top: you click where you treated, whether it’s the head or the ankle. The photo remains because the frontal face is faster than any 3D model.

## Prerequisites

- Account with `Physician / Healthcare professional` role and clinical access to the patient.
- An open session: the `Add` treatment module on the `Treatments` tab of the medical record.

## Step 1: Choose the surface

In the treatment module, under `Body map and treated areas`, two buttons: `Photo` and `3D Anatomy`.

The **model gender** (`female` / `male`) is **one only** and applies to both: choosing it on the portrait and finding it again on the 3D model would be asking the same question twice. On the portrait, the gender also changes **where the dots fall**, because the two faces have different proportions.

⚠️ The gender selector only appears if the corresponding model has been delivered to the server. The areas recorded in the medical record **do not depend on which model you are viewing**: the region codes are the same.

## Step 2: Place a point

- **On the portrait**: a single click on the treated point.
- **On the 3D model**: **double-click**. The double-click is used to distinguish marking from rotation: you drag to rotate, use the scroll wheel to zoom in, and a single click should not mark anything by mistake. A second double-click on the same point removes it.
- The `Recenter` button resets the model to its initial position.
- On the portrait, `Open full screen` enlarges the image when the points are dense.

On the 3D model, the dot remains **where you clicked**, not at the center of the area: on a thigh, the center of the area would be twenty centimeters away. The model opens on the full figure: for facial areas, you zoom in with the scroll wheel.

⚠️ **The exact points apply to the model on which you placed them.** The two bodies are not the same: switching from male to female, the exact point does not exist, and the dot positions itself at the center of the area, which is always correct on that model. The recorded areas do not change.

## Step 3: What to write on a point

On the portrait, the dot opens a small window with two main fields:

- **Treatment**, free text (e.g., “hyaluronic acid filler,” “botox”);
- **Quantity**, free text with the unit (e.g., “0.5 ml,” “25 U”).

Below, the **How it was done** section, closed by default and **optional**, with four dropdown menus with a closed vocabulary:

- `Instrument`: needle, cannula, micro-needles or roller, other;
- `Gauge`: from 18G, the thickest, to 34G, the thinnest;
- `Plane`: supraperiosteal, subgaleal, subfascial, subcutaneous, deep dermal, superficial dermal;
- `Technique`: bolus, microbolus, retrograde, anterograde, fanning, linear.

This is not just documentation for its own sake: Regulation (EU) 2022/2346, Annex §3.1 letter j, requires documenting the injection technique, instruments, and the maximum quantity injected based on the site and technique. The four dropdown menus are what allow you to comply.

⛔ **None of the dropdowns suggest the correct value for the area**: they do not propose a plane, nor do they warn if a combination is unusual. Tables by area exist in the literature and remain outside the software, because they would constitute clinical guidance.

⚠️ A point without these four fields remains valid: all annotations made before August 15, 2026, do not have them.

## Step 4: The list of areas is compiled automatically

The dots and the `Treated areas` list below the map are **the same thing seen in two ways**:

- place a dot, the area appears in the list;
- select an area from the list, the dot appears on the map;
- remove one, the other disappears.

This also applies **between surfaces**: an area marked on the 3D model already has its dot when returning to the portrait.

## Step 5: Dictated areas and those written in words

Two tools bring the areas you have written (or dictated) in words onto the map, and **both require your action**: nothing enters the medical record automatically.

- **`Areas detected from text:`** appears below the notes field as you type. It is a keyword-based recognition, without a language model: it suggests labels, and you add the correct ones.
- **`Auto-extract areas from text`** sends the notes text to the extraction service, which responds with areas, product, and quantity already separated, and the areas **are added** to the existing dots instead of replacing them.

⚠️ **Dictation alone does not color the map.** `Dictate the session` fills in product, quantity, lot, and off-label use, but the recognized areas are written at the end of the notes in the form `[dictated areas: …]`, because marking them requires the exact area code. The two tools above transform them into dots: knowing this avoids searching for marks that no one has placed.

## Step 6: Off-label use

`Off-label use` is a checkbox on the treatment form, not on the individual dot, and when active, it requires the `Off-label reason`. The field exists because in aesthetic medicine, off-label use is frequent and legitimate **as long as it is documented**: the reason is what remains recorded.

See the guide [Record a treatment](/manuale/trattamenti) for lot, expiration, device parameters, and recall.

## What the 3D model does not do

- **On the body, areas are not colored green**, and this is not an oversight: the boundaries of the regions come from a partition in bone coordinates and cut straight where the anatomy curves. Filling them with color would show this flaw instead of the session. The mark is the dot.
- **The regions are not all those in the model.** The list contains the areas that aesthetic medicine actually treats, grouped into neck, décolleté, arms, hands, abdomen, back, buttocks, thighs, and legs. Foot, nails, auricle, and intimate areas exist in the anatomical model and **are not in the clinical list**: a list that contains everything is a list where you find nothing.
- **Clicking outside those regions does not assign anything**, and the page states this: it shows the technical name of the point hit, so it is clear that the click was registered but that area is not recorded.
- **The right or left side comes from the click, not the name.** In the anatomical model, “anterior region of the arm” is a single name for two arms: it is the position of the point that determines the side.
- **It is not the atlas.** To show the patient the skeleton, muscles, or vessels, use the [3D Anatomical Atlas](/manuale/anatomia) page, which does not record anything.

## The aggregated map, in the Treatments tab

Outside the session, the `Treatments` tab of the medical record has a `Treatment map` that summarizes **the patient’s entire history**: each area shows **how many times** it has been treated, and the color indicates the **prevailing product category** in that area. The legend is on the page, under `Category legend`.

Clicking an area filters the timeline below to that zone; `Remove filter` returns to all. The page also flags a `Detected left/right imbalance` when the counts between the two sides diverge, and `Open full model` leads to the atlas.

⚠️ **The number is not the quantity of product**: it is the number of treatments recorded on that area. There is no time period selector on this map: it shows the entire history.

## Exporting the data

From the `Treatments` tab: `Export PDF` produces a summary of the treatments, `Export CSV` does the same in a table. The record of the **single session** is downloaded from the session row and is described in [Record a treatment](/manuale/trattamenti).

## Troubleshooting

**The 3D model does not appear.** It downloads on first use and is large: on a slow connection, it may take a few seconds. If it remains blank, reload the page: the models are served without cache, so a reload is enough to retrieve them.

**I double-clicked and nothing happened.** If the point hit is outside the regions we record, a message appears with the technical name of the area: try more toward the center, or select the area from the list.

**The dot is in the wrong place on the portrait.** Drag it: the position updates. On the 3D model, it is removed with a second double-click and placed where needed.

**I changed the model gender and the dots moved.** The two bodies have different coordinates: on the other model, the exact point does not exist, and the dot returns to the center of the area. **The areas in the medical record remain** identical.

## See also

- [Record a treatment](/manuale/trattamenti)
- [3D Anatomical Atlas](/manuale/anatomia)
- [Complete the medical history with AI dictation](/manuale/anamnesi-dettatura)
- [Outcomes and complications](/manuale/esiti-e-complicanze)

Last revision: {ULTIMA_REVISIONE}
