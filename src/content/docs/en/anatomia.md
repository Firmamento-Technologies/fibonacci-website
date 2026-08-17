# 3D Anatomical Atlas

The 3D viewer is used to show the patient where the procedure will take place and to explain a risk that depends on an anatomical relationship rather than using words.

⚠️ **This feature only appears in aesthetic medicine practices.** It is tied to the vertical: if you don’t see `3D Anatomy` in the navigation, your practice does not have that vertical active.

⚠️ **This is not the map used to record a session.** This page is an atlas: you can view and rotate it, but it doesn’t record anything. Treated areas are marked within the session, on the portrait or on the 3D body model: see the guide [Treated areas: on the photo and on the 3D model](/manuale/body-map). The two features use the same anatomical model but serve different purposes.

## How to use it

The model opens on the full body. From the side panel, you can enable the anatomical **systems**. There are nine:

- `Skeleton` and `Joints`,
- `Muscular system` and `Muscle insertions`,
- `Cardiovascular system`,
- `Lymphatic system`,
- `Nervous system and senses`,
- `Viscera`,
- `Regions and skin`, meaning the topographic regions of the body surface.

- **Multiple systems at once.** You can keep several systems enabled simultaneously, for example, skeleton and musculature, when you need to show a relationship between layers.
- **Detail level.** When **exactly one** system is enabled, the panel also shows a drill-down of substructures: you can isolate a single district instead of navigating the entire system. Not all systems have this: the skeleton breaks down into twelve parts, the viscera and musculature into six, and the lymphatic system into none.

You can rotate the model by dragging and zoom in using the scroll wheel or two fingers.

## Practical uses

- **Before obtaining consent**, to show the patient the area being discussed. A shared image reduces misunderstandings that may later resurface in disputes.
- **During risk explanation**, when the risk depends on an anatomical relationship: a vessel, a nerve, or a dissection plane.

## Declared limitations

- **Not a patient-specific model**: this is a reference atlas. It does not account for individual variations and should not be used as a basis for measurement.
- **Single body model.** The atlas does not include a female variant: the female model exists but is part of the treated areas map, not here.
- **Does not automatically enter the medical record.** What is documented is the written site in the treatment form and, if necessary, the map of points: the viewer supports the explanation but does not replace it.
- **The 3D model is heavy.** It loads the first time you open the page, and on slow connections, it may take a few seconds: it is loaded on demand to avoid slowing down other pages.

## Model source

The geometries come from **Z-Anatomy / BodyParts3D** (The Database Center for Life Science), distributed under a CC BY-SA license: attribution appears below the viewer, both here and in the treated areas map. The names of the structures follow the *Terminologia Anatomica* (TA2), in English, as they are the model’s key; the Italian labels for skin regions used in treatments were written by us, one by one.

## See also

- [Treated areas: on the photo and on the 3D model](/manuale/body-map)
- [Recording a treatment](/manuale/trattamenti)
