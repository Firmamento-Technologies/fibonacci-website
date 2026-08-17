# Dicter à voix haute : la dictée

> ⚠️ **Réécrit le 2026-08-17 en consultant l'écran.** La version précédente
> décrivait un panneau qui n'a jamais existé : un bouton `Estrai campi`, un
> score de fiabilité pour chaque champ avec les couleurs vert, jaune et rouge,
> trois boutons `Accetta` / `Modifica` / `Scarta` par ligne, une section
> `Impostazioni > Dettatura` avec le seuil de silence et la conservation des
> transcriptions. Rien de tout cela n'est dans le produit. Ce qui suit, si.

La dictée transcrit ce que tu dis et, lorsque le formulaire le prévoit, propose les
champs déjà remplis. **Elle n'écrit jamais seule dans le dossier** : entre la voix et la
donnée enregistrée, il y a toujours une révision et un bouton pressé par toi.

## Où dicter

Le bouton apparaît à trois endroits, avec une étiquette différente à chaque fois car
« dicter quoi » change selon l'endroit :

- **`Dicter l'anamnèse`**, dans l'onglet `Anamnèse` du dossier ;
- **`Dicter la séance`**, dans le module du traitement, à côté des notes ;
- dans **l'évaluation clinique**, lorsque le cabinet a activé ce module.

Au repos, c'est une seule ligne : un bouton et une phrase. Le cadre apparaît lorsqu'il y a quelque chose à l'intérieur.

## Prérequis

- Compte avec le rôle `médecin` et accès clinique au patient.
- Microphone fonctionnel et autorisation accordée au navigateur. La qualité de
  la transcription dépend plus du bruit ambiant que du microphone.
- Connexion : la transcription se fait sur un service, pas dans le navigateur.

## Étape 1, dicter

Appuie sur le bouton. Un point rouge apparaît avec l'inscription `J'écoute`, et
en dessous, dans `Transcription`, le texte s'affiche pendant que tu parles : *« Parle librement : le texte apparaît ici pendant que tu parles »*.

Deux boutons : **`Terminer`** ferme la dictée et passe à la révision,
**`Annuler`** l'annule.

## Étape 2, réviser

À la fin, le texte transcrit apparaît dans une zone **modifiable**, sous un
avertissement qu'il vaut la peine de lire une fois :

> Relis avant de l'utiliser. La transcription automatique se trompe surtout sur
> les médicaments, les dosages et les termes techniques : corrige ci-dessous.

Si le module prévoit l'extraction des champs, à côté de l'avertissement apparaît
la **fiabilité de l'extraction** en pourcentage. C'est un nombre unique pour toute
l'extraction, pas un par champ, et c'est un indicateur technique : il indique à quel point le
modèle a trouvé le texte clair, pas à quel point ce que tu as dit est correct.

## Étape 3, que faire ensuite

Trois boutons, et ils font des choses différentes :

- **`Supprimer`** : jette la transcription.
- **`Utiliser le texte`** : prend le texte tel quel et le place dans le champ de
  destination (par exemple à la suite des notes de la séance). N'apparaît que là où
  ce texte a une destination : ailleurs, ce serait un bouton qui efface et
  rien d'autre, et il a été retiré.
- **le bouton d'application** (`Proposer pour le dossier` dans l'anamnèse,
  `Remplir les champs` dans le traitement) : prend les **champs** reconnus et les transfère
  dans le formulaire, où ils restent modifiables. N'apparaît que si l'extraction a
  produit quelque chose.

⚠️ **Même après avoir appliqué les champs, l'enregistrement est une action distincte.**
Appliquer remplit le formulaire ; dans le dossier, ce que tu enregistres toi-même y est consigné.

## Ce que la dictée remplit, et ce qu'elle ne remplit pas

C'est le point où les attentes sont le plus souvent déçues, donc mieux vaut la mesure que la promesse.

**Dans le traitement**, sont proposés le produit, la quantité, le lot, l'utilisation hors AMM et
sa justification. **Ne sont pas** remplis les paramètres du dispositif
(longueur d'onde, fluence, spot, fréquence, durée d'impulsion, passages,
refroidissement, endpoint), ni la dilution, l'UDI ou la date de péremption du lot :
ils doivent être saisis manuellement.

**Les zones dictées ne deviennent pas des points sur la carte.** Elles sont ajoutées à la fin des notes sous la forme `[zones dictées : …]`, avec l'éventuelle `[catégorie suggérée : …]`, car indiquer une zone nécessite son code exact. Pour les reporter sur la carte, utilise le bouton `Auto-extraire les zones du texte` : voir
[Les zones traitées](/manuale/body-map).

⚠️ **La dictée est en italien.** Même avec l'interface en anglais, la reconnaissance et l'extraction fonctionnent en italien.

## Responsabilité clinique

Le principe est intangible : **le système n'écrit rien dans le dossier sans
une action explicite du médecin.** Chaque texte transcrit et chaque champ proposé
nécessitent une révision et un geste affirmatif. La responsabilité de la
bonne compilation reste celle de celui qui signe le dossier.

## Confidentialité du flux audio

L'audio est envoyé au service de transcription (Mistral, Union européenne) et
**n'est pas conservé** ni par nous ni par eux au-delà du temps de traitement ;
les contenus envoyés via API ne sont pas utilisés pour entraîner des modèles.

Si pour une visite tu ne veux pas utiliser la dictée, on remplit à la main : il ne reste
aucune trace audio nulle part.

## Suggestions

- **Parle à vitesse naturelle**, sans articuler : le modèle est calibré sur l'italien parlé spontané, et ralentir détériore le résultat.
- **Pas de commandes vocales** comme « point » ou « à la ligne » : la ponctuation est ajoutée automatiquement.
- **Les médicaments en toutes lettres**, principe actif et dose : « pantoprazole quarante
  milligrammes un comprimé le matin ».
- **Une voix à la fois.** Si le patient parle en même temps que toi, la transcription se dégrade.
- **Relis toujours les chiffres.** Les dosages et les lots sont exactement ce sur quoi la
  transcription se trompe le plus, et c'est aussi ce qui compte le plus.

## Résolution des problèmes

**Le microphone n'est pas détecté.** Vérifie l'autorisation dans le navigateur (dans
Chrome, le cadenas à gauche de l'adresse, option `Microphone`) et les
paramètres du système d'exploitation : un microphone désactivé au niveau du système n'est pas accessible par le navigateur.

**Un message d'erreur rouge apparaît sous le bouton.** Le message indique la cause : presque
toujours, c'est l'autorisation refusée ou le service de transcription inaccessible.

**La transcription arrive mais aucun champ n'est proposé.** Le bouton d'application n'apparaît que si l'extraction a reconnu quelque chose. Tu peux
toujours utiliser `Utiliser le texte` et corriger manuellement.

**J'ai dicté les zones et la carte est vide.** C'est le comportement prévu : voir
ci-dessus, « Ce que la dictée remplit, et ce qu'elle ne remplit pas ».

## Voir aussi

- [Création et gestion de l'anagrafique patient](/manuale/anagrafica-paziente)
- [Les zones traitées : sur la photo et sur le modèle 3D](/manuale/body-map)
- [Enregistrer un traitement](/manuale/trattamenti)
- [Journal d'audit et traçabilité des accès](/manuale/audit-log)

Dernière révision : {ULTIMA_REVISIONE}
