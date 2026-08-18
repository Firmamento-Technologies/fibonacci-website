# Analyse du visage

Cette guide décrit la page « Analyse du visage » : la **comparaison directe entre deux photographies**, avant et après, la **vue tridimensionnelle** du visage, le **miroir en direct** et l'enregistrement du **jugement clinique (PGAIS)** sur la comparaison.

La page **ne mesure pas**. Elle ne calcule pas d'angles, de rapports, d'écarts ni de scores, ne les enregistre pas dans le dossier et ne les compare à aucune référence : elle affiche les photographies et la forme du visage, et le jugement reste celui du médecin.

## Prérequis

- Compte avec le rôle `medico` ou `admin studio`.
- Au moins une photographie frontale du visage déjà présente dans le dossier (voir le guide « Photos cliniques et comparaison avant/après »).

## Où se trouve-t-elle

Le bouton `Analyse du visage` se trouve dans la barre supérieure du dossier du patient, à côté de `Données et personnes` et du menu `Exporter`, et est visible depuis n'importe quelle fiche.

## La comparaison avant/après

Le premier clic sélectionne le cliché à examiner, le second sur une autre photographie ajoute la comparaison : les deux fiches s'affichent côte à côte et sont observées ensemble. C'est le geste central de la page.

Au-dessus de chaque photographie, la page indique quand le **cliché n'est pas comparable** : une pose différente (menton levé, tête tournée) modifie ce que l'on voit, et deux poses différentes ne se comparent pas. L'avertissement ne bloque rien : il informe avant que quelqu'un ne tire une conclusion.

## La vue 3D

L'interrupteur `Photo | 3D` affiche la forme du visage reconstruite à partir des points de repère, navigable (*« Fais glisser pour tourner, utilise la molette pour zoomer »*), en surface, en maillage ou en **`Relief`**, qui colore la surface en fonction de la profondeur au lieu d'imiter la peau : c'est la manière dont les asymétries de volume se voient à l'œil nu. Les points de repère sont également visibles, tous les 468.

**Ce n'est pas un scan** : la profondeur est estimée à partir d'une seule photographie et est relative. Elle sert à tourner autour de la forme et à la montrer au patient, **pas** à mesurer des saillies ou des volumes. Pour les volumes et les cartes de surface, il faut du matériel de stéréophotogrammétrie, que cette page ne prétend pas remplacer.

## Le maillage sur la photographie

Le bouton `Maillage` superpose à la photographie le maillage des points de repère : il montre **comment le logiciel voit la forme du visage**. Ce n'est pas une mesure et ce n'est pas un jugement ; il reste activé entre une photo et l'autre car ceux qui l'utilisent l'utilisent toujours.

## Le miroir en direct

`Miroir en direct` active la caméra et montre au patient son propre visage en temps réel, avec l'invite à `Cadrage du visage`. **Ne mesure et n'enregistre rien**, et la caméra *« est éteinte. Elle ne s'allume que lorsque tu le demandes »* : elle sert pendant l'entretien, pour parler d'une zone en la regardant ensemble.

## La série photographique par vue

Le protocole photographique clinique est une série de clichés sur des vues définies (frontale, latérales, obliques à 45°, plus les dynamiques pour la mimique) répétée de manière identique à chaque visite. Pour cette raison, lors du chargement, chaque photo peut indiquer la **vue** ; la fiche `Photos` affiche la série de la visite la plus récente et indique quelles vues manquent.

Trois règles de la série :

- la vue est **facultative** : les photographies chargées avant cette fonction ne l'ont pas, et « non indiquée » reste différent de « frontale ». Le système ne remplit jamais le champ automatiquement ;
- la checklist **informe et ne bloque pas** : les clichés hors série sont licites ;
- en prenant une photo depuis la caméra avec une vue choisie, le **cliché précédent de la même vue apparaît en transparence** sur le viseur : superposer le visage au fantôme est la manière pratique de répéter le cadrage et la distance.

La page travaille sur les clichés frontaux (et sur ceux sans vue indiquée) ; si d'autres clichés sont exclus, elle indique combien.

## Enregistrer le PGAIS à partir de la comparaison

Une fois deux photographies choisies, le bouton `Enregistrer PGAIS` apparaît. Le PGAIS est le jugement du médecin sur le résultat, donné **en comparant les photographies avant et après** : l'enregistrer ici signifie enregistrer également quels deux clichés étaient en cours d'observation, sans recopier les dates.

La réponse est une étiquette (« Très amélioré », « Amélioré », …), jamais un nombre : la numérotation du GAIS est utilisée dans la littérature dans des directions opposées, et un nombre enregistré sans la direction ne serait plus interprétable avec le temps.

## Erreurs fréquentes

- **Comparer des clichés de vues différentes.** Un frontale et un 45° du même jour ne se ressemblent que par le nom : la comparaison n'est valable qu'entre des vues homologues.
- **Photographier le « après » trop tôt.** À œdème non résorbé, la comparaison documente le gonflement, pas le résultat.
- **Lire le 3D comme une mesure.** C'est une représentation de la forme issue d'une photographie : elle sert à regarder et à montrer, pas à quantifier.

## Questions fréquentes

**La page enregistre-t-elle quelque chose dans le dossier ?** Seulement le PGAIS, qui est le jugement du médecin, avec les deux clichés auxquels il se réfère. La forme 3D et le maillage se recalculent à partir de la photographie à chaque ouverture et ne sont pas conservés.

**L'analyse envoie-t-elle la photo à un service externe ?** Non. Le modèle de points de repère fonctionne dans le navigateur ; la photographie reste chiffrée dans le système et n'est déchiffrée que pour ceux qui ont le droit de la voir, comme pour toute autre photo clinique.

**Pourquoi n'y a-t-il pas de mesures du visage ?** Choix de produit. Un nombre clinique n'a de sens qu'avec sa précision déclarée et avec quelqu'un qui en réponde : tant qu'il n'y en a pas, la page affiche les photographies et la forme, et laisse au médecin la mesure et le jugement.
