# Résultats, complications et urgences

Cette guide couvre les trois choses qui surviennent **après** une séance lorsque quelque chose ne se passe pas comme prévu : le mode `Urgence`, l'enregistrement d'une complication, et la fiche de signalement au Ministère.

⛔ **Aucun de ces écrans ne fournit d'indications cliniques.** Ils ne proposent pas de médicaments, de doses ou de voies d'administration, ne formulent pas de suspicion diagnostique, ne jugent pas de la gravité et ne comparent pas le temps avec un quelconque seuil. C'est un choix délibéré dans l'usage prévu du produit, et non une fonction manquante : en cas d'urgence, tout conseil ferait de ce logiciel un dispositif médical, et ce qui manque vraiment à ce moment-là n'est pas un avis, mais le compte-rendu que personne n'écrit parce qu'il a les mains occupées.

## D'abord : préparer le cabinet

Deux champs dans `Réglages`, section du cabinet, qui doivent être remplis **avant** d'en avoir besoin :

- **`Protocole des complications (pour le mode Urgence)`** : le protocole du cabinet, une étape par ligne. C'est **ton** texte : il est affiché tel qu'il est écrit, sans être complété ni corrigé. Sans cela, le mode Urgence chronomètre et enregistre les notes, mais n'affiche aucun contenu clinique.
- **`Médicament d'urgence : péremption`** : mois et année. Le moment utile pour s'apercevoir qu'il est périmé n'est pas lorsqu'il est nécessaire. On ne demande pas quel est le médicament : c'est le cabinet qui le décide.

## Le mode Urgence

Il s'ouvre **depuis la ligne de la séance**, dans l'onglet `Traitements` du patient : c'est le moment où la patiente est déjà devant, et chercher une option de menu à ce moment-là est une perte de temps. Il n'apparaît pas seul et n'est pas une alarme : on appuie dessus.

L'écran est en plein écran, sans navigation, et contient trois éléments :

1. **`Temps écoulé depuis l'ouverture`** : un chronomètre qui défile. Il ne change pas de couleur, ne compte pas à rebours, ne sonne pas, n'avertit pas.
2. **Le protocole du cabinet**, une étape par ligne, à cocher au fur et à mesure de son exécution.
3. **`Que noter dans le dossier`** : un champ libre pour ce que tu veux voir consigné.

Si la date de péremption du médicament d'urgence enregistrée dans les réglages est dépassée, la page l'indique : `La date de péremption enregistrée dans les réglages du cabinet est dépassée`.

⚠️ **Le réseau peut manquer, mais pas le compte-rendu.** L'instant de début et les étapes cochées sont enregistrés dans le navigateur **avant** tout appel au serveur : recharger la page, ou perdre la connexion, ne remet pas à zéro le chronomètre et ne perd pas le compte-rendu. L'enregistrement dans le dossier a lieu à la fermeture, et en cas d'échec, le compte-rendu reste téléchargeable.

À la fermeture, on choisit la `Gravité`, et le compte-rendu indique **les horaires du moment où tu as coché chaque étape**, et non des horaires reconstitués après coup.

`Quitter sans fermer` laisse la session ouverte : le chronomètre continue.

## Enregistrer une complication

Depuis la même ligne de la séance, l'action `Enregistrer une complication sur cette séance`. La complication reste **liée à ce traitement**, avec son produit et son lot : c'est la raison pour laquelle on l'enregistre depuis là et non depuis une liste séparée.

Le formulaire demande :

- **la complication**, à partir d'une liste fermée de douze éléments : ecchymose, œdème, érythème persistant, nodule, granulome, infection, nécrose cutanée, occlusion vasculaire, ptosis palpébral, asymétrie, réaction allergique, et `Autre (décrit dans les notes)` ;
- **`Quand tu l'as observée`**. La date **ne** se préremplit pas avec aujourd'hui : une complication se voit souvent plusieurs jours après, et un champ déjà rempli est un champ que personne ne corrige ;
- **`Gravité`** : légère, modérée ou grave. C'est le médecin qui la choisit : il n'existe aucun avertissement indiquant « cette complication est grave » ;
- **`Ce que tu as observé`** et **`Ce que tu as fait`** (par exemple hyaluronidase, compresses, antibiotique) ;
- **`Issue (si déjà connue)`**, qui peut être laissée à `Pas encore connue`.

Les complications enregistrées apparaissent **dans la fiche de la séance**, en évidence : pour savoir comment cela s'est passé, il n'est pas nécessaire de regarder à deux endroits.

⚠️ **Une séance marquée comme saisie par erreur n'accepte pas de complications.**

## La fiche de signalement au Ministère

À côté de chaque complication enregistrée apparaît le lien **`Fiche de signalement`**, qui prépare le texte à recopier dans le formulaire ministériel.

Pourquoi elle existe, et dans quels termes :

- le **D.M. Santé 1er juillet 2025**, en vigueur depuis le 18 mars 2026, met en œuvre l'art. 10 du D.Lgs. 137/2022 et couvre expressément également les dispositifs de l'annexe XVI du règlement UE 2017/745, c'est-à-dire les **fillers dermiques** ;
- l'incident **grave, même seulement suspecté**, doit être signalé *« sans délai et en tout cas dans les dix jours »* (art. 4 al. 1) ; l'incident non grave **peut** être signalé dans les trente jours (art. 4 al. 3) ;
- l'obligation est **du professionnel de santé**, et l'absence de signalement est sanctionnée de 26 000 à 120 000 euros.

En enregistrant une complication, le système ouvre un **rappel** avec le délai calculé à partir de ces termes, que tu trouves dans `Rappels`.

Trois choses que cette fonction **ne** fait pas, et qu'il est bon de savoir avant :

- ⛔ **Elle ne transmet rien.** Le canal est le formulaire en ligne du Ministère, avec authentification du médecin (SPID, CIE ou CNS). Ici, on prépare le contenu.
- ⛔ **Elle ne décide pas si l'incident est grave** : elle lit la gravité que tu as enregistrée et en déduit le délai.
- ⛔ **Elle ne renseigne pas les données de la patiente**, et ce n'est pas un oubli : l'art. 2 al. 6 du décret impose que la signalisation *« ne contienne pas de données permettant l'identification du sujet concerné »*. Préremplir à partir du dossier, ce qui serait la chose la plus évidente à faire, ferait commettre la violation précisément par l'outil qui devrait aider. Le formulaire reçoit l'événement et le produit, jamais le patient.

⚠️ **L'enregistrement d'une complication n'est pas une déclaration de pharmacovigilance**, et le formulaire le précise : ce sont deux canaux différents, avec des destinataires différents.

## Erreurs fréquentes

- **Ouvrir l'Urgence et ne pas la fermer.** Le compte-rendu s'écrit dans le dossier à la fermeture : une session laissée ouverte reste un chronomètre qui tourne.
- **Le protocole jamais chargé.** Sans cela, en urgence, l'écran est un chronomètre et un champ de notes. Il se remplit une fois, dans `Réglages`.
- **Enregistrer la complication sur une séance quelconque.** Elle doit être enregistrée sur la séance qui l'a causée : c'est ce lien qui emporte le produit et le lot lorsqu'ils sont nécessaires.

## Voir aussi

- [Enregistrer un traitement](/manuale/trattamenti)
- [Traçabilité du lot](/manuale/tracciabilita-lotto)
- [Rappels et relances](/manuale/promemoria-e-richiami)
