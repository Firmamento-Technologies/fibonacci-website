# Enregistrer un traitement

Cette guide décrit comment enregistrer une séance de médecine esthétique : produit, lot, zones, quantité, et ce que le système fait ensuite. Elle s'adresse aux médecins.

L'enregistrement de la séance est l'acte clinique qui, des mois ou des années plus tard, prouve ce qui a été fait et avec quels produits. C'est le document qui tient en cas de contestation, et c'est aussi celui que personne n'a envie de remplir à la fin d'une journée chargée : l'écran est conçu pour demander le strict minimum et pour remplir automatiquement tout le reste.

## Prérequis

- Compte avec le rôle `medico`.
- Fiche du patient existante.
- **Consentement éclairé du traitement signé**. Si le consentement manque, la séance est tout de même enregistrée (on ne cache pas ce qui a été fait), mais elle reste signalée comme dépourvue de consentement.

## Étape 1, ouvrir la séance

Depuis la fiche du patient, la section `Trattamenti` et le bouton `Nuovo trattamento`. On choisit le produit, et le système reconnaît automatiquement la catégorie et la famille chimique : acide hyaluronique, hydroxyapatite, acide poly-L-lactique, toxine botulinique.

La reconnaissance sert à deux choses : colorer la carte des zones par catégorie, et, lorsqu'une durée est indiquée dans un consentement, proposer le rappel de l'étape 5.

## Étape 2, lot, quantité, péremption

Le numéro de lot doit être saisi **tel qu'imprimé sur l'emballage**. C'est la clé qui permet, le jour d'un rappel du fabricant, de répondre à la question « quels patients ont reçu ce lot ». Le guide dédié est `Tracciabilità del lotto`.

Sur ces champs, le système **enregistre et ne calcule pas** : la dilution déclarée est inscrite telle quelle. Si une valeur semble incohérente, un avertissement apparaît, mais l'enregistrement n'est pas bloqué. Un logiciel qui refuse d'enregistrer ce qui a été fait produit des dossiers qui ne correspondent pas à la réalité, et c'est un dommage pire que l'erreur qu'il voulait prévenir.

## Étape 3, les zones traitées

À la rubrique `Body-map e aree trattate`, on indique les points avec des pastilles numérotées, en associant à chacune la quantité. On choisit entre le portrait de face (`Foto`) et le modèle tridimensionnel (`3D`), qui représente le corps entier avec le visage : sur la photo, un simple clic suffit, sur le modèle, il faut double-cliquer. Les coordonnées du portrait sont distinctes pour l'homme et la femme, car les proportions du visage diffèrent et une pastille au mauvais endroit est une documentation erronée.

Pour chaque point, on peut également enregistrer **comment** l'injection a été réalisée : instrument, calibre, plan et technique, dans quatre menus déroulants facultatifs. Le détail, ainsi que les deux méthodes pour reporter sur la carte les zones décrites par écrit, se trouve dans [Les zones traitées : sur la photo et sur le modèle 3D](/manuale/body-map).

⛔ **Il n'existe pas de bouton qui recopie les zones de la séance précédente.** Jusqu'au 17 août 2026, ce guide en décrivait un, et il n'a jamais existé : pour une retouche, les zones sont à resélectionner, ou bien on décrit la séance par écrit et on appuie sur `Auto-estrai aree dal testo`.

## Étape 4, s'il s'agit d'un dispositif à énergie

Lorsque le produit choisi est reconnu comme **laser** (ou autre dispositif à énergie), la section `Parametri di erogazione` apparaît : longueur d'onde, fluence, spot, fréquence, durée d'impulsion avec son unité, nombre de passages, densité, `Raffreddamento` et `Endpoint clinico osservato`.

Deux choses à savoir :

- **Ce sont des champs libres, sans valeurs proposées.** Les chiffres se lisent sur l'écran de la machine. Un menu de « valeurs typiques » serait une proposition clinique déguisée en commodité, et une valeur par défaut est une proposition même lorsqu'on peut la modifier.
- **L'endpoint n'est pas une note de couleur** : c'est ce qui détermine la fluence de la séance suivante. Le noter fait la différence entre poursuivre un cycle et le recommencer à zéro.

Pour les injectables, le même rôle est joué par `Diluizione preparata`, `Scadenza del lotto` et `UDI del dispositivo (facoltativo)`.

## Étape 5, usage hors AMM

Si le produit est utilisé en dehors des indications autorisées, la case `off-label` doit être cochée. Ce n'est pas une formalité : l'usage hors AMM est licite mais nécessite une information spécifique du patient, et l'avoir enregistré permet de le prouver.

## Étape 6, le rappel

À l'enregistrement, si la famille chimique du produit a une durée attendue indiquée dans un consentement, le système propose un rappel interne à la date appropriée.

Deux précisions qui valent plus que la fonction :

- **Le rappel est destiné au médecin, pas au patient.** Aucun message automatique n'est envoyé. C'est un choix obligatoire : la L. 145/2018 interdit aux inscrits aux ordres les communications contenant des éléments attractifs, et un envoi automatique exposerait **le médecin** à la sanction, pas nous.
- **Si la durée n'est pas connue, rien n'est proposé.** Cela vaut pour l'hydroxyapatite et pour les biostimulateurs à base d'acide hyaluronique bio-remodelant : les fourchettes qui circulent proviennent de matériel de vulgarisation, pas de sources primaires. Un rappel inventé n'est pas un rappel supplémentaire, c'est un conseil clinique erroné qui semble venir du système.

## Que peut-on faire à partir d'une séance déjà enregistrée

Chaque ligne de la section `Trattamenti` offre, en plus de la modification et de la suppression, trois actions reconnaissables à leur icône :

- **Télécharger le dossier de la séance (PDF)** : un document contenant ce qui est inscrit dans le dossier médical pour cette séance (produit, lot, péremption, quantité, dilution, zones, technique, consentements, photos et accès). Il déclare lui-même les sections vides au lieu de les omettre : un dossier qui passe sous silence une section est indistinguable d'un dossier où cette section n'existait pas.
- **Enregistrer une complication pour cette séance** : voir [Résultats et complications](/manuale/esiti-e-complicanze).
- **Exporter au format CDA** : le document clinique dans le format d'échange.

⚠️ Une séance marquée comme insérée par erreur n'accepte plus ni complications ni modifications : elle reste visible, car effacer n'est pas corriger.

## Erreurs fréquentes

- **Lot laissé vide.** C'est le cas où la traçabilité est la plus nécessaire, et elle n'existe pas.
- **Traitement enregistré le lendemain.** La date de la séance est modifiable, mais elle doit être corrigée : les dates erronées ne se remarquent que lorsqu'elles sont lues dans le cadre d'une contestation.
- **Zones indiquées par écrit au lieu d'être marquées sur la carte.** « Pommettes » est ambigu ; deux pastilles avec la quantité ne le sont pas.

## Questions fréquentes

**Puis-je modifier une séance enregistrée ?** Oui, et la modification reste dans l'historique avec qui et quand. Rien n'est écrasé en silence.

**Le traitement apparaît-il dans le dossier ?** Oui : produit, lot, péremption, quantité, dilution, consentements, photos et accès, dans un seul document.
