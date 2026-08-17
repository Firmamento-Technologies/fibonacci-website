# Prescriptions et thérapies

Ce guide décrit comment rédiger une prescription, comment le système vérifie les allergies et ce qu'il fait lorsque ce contrôle ne peut pas être effectué. Elle s'adresse aux médecins.

## Prérequis

- Compte avec le rôle `médecin`, avec les données d'inscription à l'Ordre complétées : elles apparaissent sur l'ordonnance imprimée.
- Fiche du patient avec anamnèse, si l'on souhaite que le contrôle des allergies ait des éléments sur lesquels travailler.

## Étape 1, choisir le médicament

Le champ du médicament recherche dans le catalogue AIFA, qui contient à la fois les noms commerciaux et les **principes actifs** : en tapant `ialuronique` ou `botulinique`, les produits correspondants apparaissent, même lorsque le nom commercial est différent.

⚠️ **Les fillers ne figurent pas dans le catalogue, et c'est normal** : ce sont des dispositifs médicaux marqués CE, pas des médicaments, et ils n'apparaissent pas dans un registre de médicaments. Ils sont enregistrés comme traitement (voir le guide `Registrare un trattamento`), pas comme prescription.

## Étape 2, le contrôle des allergies

Au moment de la sélection, le système compare le médicament avec les allergies enregistrées dans l'anamnèse et affiche un avertissement s'il trouve une correspondance.

🔑 **Le contrôle est en mode fail-open, et il faut le savoir** : si l'anamnèse est vide, ou si le médicament n'est pas reconnu, **aucun avertissement n'apparaît**. L'absence d'avertissement ne signifie pas « aucune allergie » : cela signifie « aucune correspondance trouvée ». C'est une distinction importante, et c'est la raison pour laquelle ce contrôle ne remplace pas une anamnèse bien faite.

## Étape 3, dose, fréquence, durée

Les champs suivent la structure de l'ordonnance : dose, fréquence, périodicité, durée en jours, notes pour le patient. Les notes sont imprimées : c'est l'endroit pour les indications d'utilisation et les contre-indications à retenir.

## Étape 4, impression

L'ordonnance imprimée reprend les données du cabinet et du médecin (dénomination, siège, inscription à l'Ordre avec numéro), prises depuis la configuration du cabinet. Si ces champs sont vides, l'ordonnance les imprime sous forme d'espaces à remplir à la main : le système n'invente pas de données identificatives.

## Erreurs fréquentes

- **Compter sur l'avertissement des allergies comme s'il s'agissait d'une garantie.** C'est une aide, pas une mesure de sécurité : sans anamnèse, il n'a rien à comparer.
- **Enregistrer un filler comme prescription.** C'est un dispositif : il doit figurer dans la séance, avec le lot et la quantité.
- **Données de l'Ordre non complétées.** Elles apparaissent vides sur l'ordonnance et les consentements, et on ne les remarque que lorsque le document est déjà entre les mains du patient.

## Questions fréquentes

**Puis-je prescrire des médicaments à la charge du Service sanitaire ?** Non : l'ordonnance produite ici est une prescription privée. Les fonctions pour le canal télématique existent dans le produit mais sont désactivées et nécessitent des accréditations régionales.

**Les prescriptions figurent-elles dans l'export du patient ?** Oui, avec le reste du dossier médical.
