# Traçabilité du lot

Ce guide décrit comment enregistrer le lot des produits injectés et comment répondre, lors d'une recherche, à la question qui compte vraiment : **quels patients ont reçu un lot déterminé**. Elle s'adresse aux médecins et à ceux qui gèrent le stock du cabinet.

La question n'est pas théorique. Lorsqu'un fabricant rappelle un lot, ou lorsqu'on suspecte une réaction liée à un produit spécifique, la réponse doit être donnée en quelques minutes et par écrit.

## Prérequis

- Compte avec le rôle `médecin` ou `admin studio`.
- Fonction `Recherche par lot` active sur son cabinet. Si la mention n'apparaît pas dans le menu, la fonction n'a pas été activée : il faut contacter l'assistance.

## Étape 1, enregistrer le lot pendant la séance

Lors de l'enregistrement d'un traitement injectable, en plus du produit et de la quantité, les champs suivants sont disponibles :

- **Numéro de lot**, tel qu'imprimé sur l'emballage,
- **Date de péremption**,
- **Dilution**, lorsque pertinent.

Le numéro de lot doit être saisi **tel qu'imprimé**, sans ajouter d'espaces ou de tirets pour plus de commodité : c'est la clé avec laquelle la recherche retrouvera la séance.

Pour ces champs, le système **enregistre**, il ne calcule pas : la dilution déclarée est inscrite telle quelle, elle n'est ni recalculée ni corrigée. Et si une donnée semble incohérente, le système avertit, mais n'empêche pas l'enregistrement. C'est un choix : un logiciel qui refuse d'enregistrer ce qui a été fait produit des dossiers qui ne correspondent pas à la réalité.

## Étape 2, rechercher par lot

La mention `Recherche par lot` dans le menu principal ouvre une recherche à champ unique. En saisissant le numéro de lot, on obtient la liste des séances où ce lot a été utilisé, avec :

- le patient,
- la date de la séance,
- la quantité administrée,
- la date de péremption enregistrée.

La recherche parcourt tous les patients du cabinet en une seule interrogation. Il n'est pas nécessaire de savoir à l'avance sur quels patients chercher, ce qui est précisément l'objectif.

## Étape 3, que faire avec la liste

La liste est le point de départ de deux activités différentes, et il convient de les distinguer :

- **Rappel du fabricant.** La liste identifie les patients à contacter. Le contact est une communication clinique et doit être effectué par le cabinet, sans automatisation.
- **Signalement d'un événement indésirable.** Si le lot est suspecté en relation avec une réaction, le signalement doit être enregistré dans la fiche du patient, dans la section des résultats et des complications, où il existe un champ pour le produit et pour le lot.

## Erreurs fréquentes

- **Lot saisi avec des formats différents dans différentes séances.** `A1234-B` et `A1234 B` sont deux lots pour une recherche. Il vaut la peine de convenir en cabinet d'une manière unique de le transcrire.
- **Lot laissé vide parce que « c'est toujours le même ».** C'est le cas où la traçabilité est la plus nécessaire et où elle n'existe pas.
- **Date de péremption non enregistrée.** Sans elle, il n'est pas possible de distinguer une administration effectuée dans la validité du produit d'une administration effectuée après : c'est une donnée qui protège le médecin.

## Questions fréquentes

**Le lot est-il obligatoire ?** Le système ne l'impose pas. C'est cependant la donnée qui permet de répondre à un rappel, et son absence ne se remarque que lorsqu'elle est nécessaire.

**Puis-je rechercher par produit au lieu du lot ?** La recherche se fait par lot. Le produit apparaît dans la liste des résultats et dans la fiche de la séance.

**Les données du lot figurent-elles dans le dossier de la séance ?** Oui : produit, lot, péremption, quantité et dilution apparaissent dans le dossier, avec les consentements et les accès.
