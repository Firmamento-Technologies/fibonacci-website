# Atlas anatomique 3D

Le visualiseur 3D sert à montrer au patient où l'intervention a lieu, et à expliquer un risque lié à une relation anatomique plutôt qu'avec des mots.

⚠️ **Cette option n'apparaît que dans les cabinets de médecine esthétique.** Elle est liée au vertical spécifique : si tu ne vois pas `Anatomie 3D` dans la navigation, ton cabinet n'a pas ce vertical activé.

⚠️ **Ce n'est pas la carte sur laquelle on enregistre une séance.** Cette page est un atlas : on le consulte et on le fait pivoter, mais il n'enregistre rien. Les zones traitées sont indiquées dans la séance, sur le portrait ou sur le modèle 3D du corps : voir le guide [Les zones traitées : sur la photo et sur le modèle 3D](/manuale/body-map). Les deux utilisent le même modèle anatomique mais servent à des fins différentes.

## Comment l'utiliser

Le modèle s'ouvre sur le corps entier. Depuis le panneau latéral, on active les **systèmes** anatomiques. Ils sont au nombre de neuf :

- `Squelette` et `Articulations`,
- `Système musculaire` et `Insertions musculaires`,
- `Système cardiovasculaire`,
- `Système lymphatique`,
- `Système nerveux et sens`,
- `Viscères`,
- `Régions et peau`, c'est-à-dire les régions topographiques de la surface corporelle.

- **Plusieurs systèmes en même temps.** On peut les activer simultanément, par exemple le squelette et la musculature, lorsqu'il faut montrer une relation entre les plans.
- **Le détail.** Lorsqu'**exactement un** système est activé, le panneau affiche en plus le drill-down des sous-structures : on isole un district spécifique au lieu de naviguer dans l'ensemble de l'appareil. Tous les systèmes n'en disposent pas : le squelette se décompose en douze parties, les viscères et la musculature en six, le système lymphatique en aucune.

Le modèle se fait pivoter en le glissant, et on zoome avec la molette ou deux doigts.

## À quoi ça sert en pratique

- **Avant le consentement**, pour montrer au patient la zone dont on parle. Une image partagée réduit les malentendus qui réapparaissent ensuite dans les contentieux.
- **Pendant l'explication d'un risque**, lorsque celui-ci dépend d'une relation anatomique : un vaisseau, un nerf, un plan de décollement.

## Limites déclarées

- **Ce n'est pas un modèle du patient individuel** : c'est un atlas de référence. Il ne tient pas compte des variantes individuelles et ne doit pas être utilisé comme base pour une mesure.
- **C'est un seul corps.** L'atlas n'a pas de variante féminine : le modèle féminin existe, mais il se trouve dans la carte des zones traitées, pas ici.
- **Il n'entre pas seul dans le dossier.** Ce qui est documenté, c'est le site écrit dans la fiche du traitement et, si nécessaire, la carte des points : le visualiseur accompagne l'explication, il ne la remplace pas.
- **Le modèle 3D est lourd.** Il se charge la première fois que l'on ouvre la page, et sur les connexions lentes, cela peut prendre quelques secondes : c'est un chargement à la demande, pour ne pas ralentir les autres pages.

## La source du modèle

Les géométries proviennent de **Z-Anatomy / BodyParts3D** (The Database Center for Life Science), distribuées sous licence CC BY-SA : l'attribution apparaît sous le visualiseur, ici comme dans la carte des zones traitées. Les noms des structures sont ceux de la *Terminologia Anatomica* (TA2), en anglais, car ils sont la clé du modèle ; les étiquettes italiennes des régions cutanées utilisées dans les traitements sont en revanche rédigées par nos soins, une par une.

## Voir aussi

- [Les zones traitées : sur la photo et sur le modèle 3D](/manuale/body-map)
- [Enregistrer un traitement](/manuale/trattamenti)
