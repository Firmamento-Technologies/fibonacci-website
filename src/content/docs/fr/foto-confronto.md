# Photos cliniques et comparaison avant/après

Ce guide décrit comment acquérir, conserver et comparer les photographies cliniques dans Fibonacci. Il s'adresse aux médecins et au personnel documentant les traitements.

Les photographies constituent la documentation qui tient ou ne tient pas lorsqu'un résultat est contesté, et sont des données relatives à la santé au sens de l'art. 9 du GDPR : c'est pourquoi le processus décrit ici n'est pas identique à celui d'une archive d'images quelconque.

## Prérequis

- Compte avec rôle `médecin` ou `admin studio`.
- Fiche du patient déjà créée.
- Consentement informé au traitement photographique recueilli et archivé. Le consentement aux soins ne couvre pas la photographie : ce sont deux finalités distinctes, et la seconde doit être documentée séparément.

## Comment sont conservées les photographies

Chaque image est chiffrée **avant de quitter le navigateur**, avec une clé générée pour cette photographie spécifique. Cette clé est à son tour protégée par une clé de projet résidant sur le serveur et n'entrant jamais dans le code exécuté dans le navigateur.

Trois conséquences pratiques, qu'il est utile de connaître avant de travailler :

- Quiconque obtiendrait une copie de la base de données ou du disque ne verrait pas les photographies : il verrait des blocs chiffrés.
- L'ouverture d'une photographie est un accès et est enregistrée dans le `Journal des accès`, avec qui et quand. Ce n'est pas une limitation : c'est ce qui permet de démontrer, des années plus tard, qui a vu quoi.
- Les photographies n'apparaissent pas dans les aperçus d'impression des documents cliniques. Elles doivent être remises séparément et de manière consciente.

## Étape 1, acquérir une photographie

Depuis la fiche du patient, la section `Foto` affiche les acquisitions existantes regroupées par date. Le bouton `Ajouter` ouvre la fenêtre de chargement, qui accepte les images depuis l'appareil photo du dispositif ou depuis des fichiers.

Avant de sauvegarder, le système effectue deux opérations automatiques :

- **suppression des métadonnées EXIF**, y compris la position géographique. Une photographie prise avec le téléphone en cabinet contient les coordonnées : la transmettre à un tiers signifierait transmettre également l'adresse de celui qui l'a prise,
- **détection des visages**, avec possibilité de les flouter. Le floutage est un choix du médecin et n'est pas automatique, car en médecine esthétique le visage est souvent l'objet même de la documentation.

Lors de la sauvegarde, on indique la zone traitée et, si pertinent, le traitement auquel la photographie se réfère. Cette association est ce qui rend possible la comparaison de l'étape 3.

### La vue, et la série standard

Chaque prise de vue peut déclarer la `Vista` : `Frontale`, `Latérale droite`, `Latérale gauche`, `Oblique 45° droite`, `Oblique 45° gauche`, `Dynamique (mimique)`. C'est le protocole photographique clinique : la même série de cadrages, répétée à chaque visite, est ce qui rend comparables deux dates.

Trois règles, toutes voulues :

- **la vue est facultative.** Les photographies chargées avant cette fonction ne l'ont pas, et « non indiquée » reste différent de « frontale » : le système ne remplit jamais le champ automatiquement ;
- **la checklist informe et ne bloque pas.** La fiche `Foto` affiche la série de la visite la plus récente et indique quelles vues manquent ; les prises de vue hors série restent licites ;
- **en prenant une photo depuis l'appareil photo avec une vue sélectionnée, la prise de vue précédente de la même vue apparaît en transparence dans le viseur** (*« Prise de vue précédente en transparence : superposez pour répéter le cadrage »*). Superposer le visage au fantôme est le moyen pratique de répéter le cadrage et la distance, et l'appareil photo aide également avec l'ovale de pose et le rappel *« Yeux sur la ligne · lumière frontale uniforme · fond neutre »*.

### À quoi pourra servir cette photo

Lors du chargement, on déclare la finalité : `C1: Clinique:` (nécessaire pour le traitement), `C2: Didactique:` et `C3: Promotionnel:`. Les premières restent toujours dans le dossier ; les deux autres dépendent d'un consentement séparé, révocable à tout moment, et pour la promotion, la L. 145/2018 s'applique. En dehors des soins, l'anonymisation est obligatoire.

## Étape 2, organiser par séance

Les photographies associées à un traitement apparaissent dans la ligne de la séance correspondante. Les photographies non associées restent dans la liste générale, classées par date.

Conseil opérationnel : acquérir toujours au moins une prise de vue avant le traitement, avec le même cadrage et le même éclairage que ceux utilisés après. Une comparaison entre deux photographies prises dans des conditions différentes ne documente pas le résultat : elle documente la différence de lumière.

## Étape 3, comparaison avant/après

Dans la section `Foto`, en sélectionnant deux images de la même zone, s'ouvre la vue de comparaison côte à côte. La vue affiche les deux dates, la zone et l'éventuel traitement intermédiaire.

La comparaison dispose d'une **barre centrale déplaçable** (*« Avant à gauche, Après à droite »*) et d'un `Rileva il volto e allinea automaticamente le foto`, qui superpose les deux prises de vue en utilisant les points du visage lorsque les cadrages ne coïncident pas ; `Supprimer` revient aux images telles qu'elles ont été prises.

⚠️ **L'alignement est une aide à la lecture, pas une correction de la photographie** : les images originales ne sont pas modifiées. Et aligner deux prises de vue prises sous des angles différents les rend superposables, pas comparables : la série par vue reste la bonne méthode.

La comparaison est une vue, pas un document : elle ne modifie pas les images et n'en crée pas de nouvelles. Si vous devez remettre la comparaison au patient, exportez les deux photographies originales.

Depuis la comparaison, on enregistre également le **PGAIS**, le jugement du médecin sur le résultat : voir [Analyse du visage](/manuale/analisi-del-volto).

## Étape 4, remettre les photographies au patient

Le patient a le droit de recevoir ses propres données, photographies comprises, dans un format lisible. L'exportation des images les déchiffre au moment de la remise : elles sortent en clair dans le paquet, tandis que la clé de projet n'est jamais remise.

La raison est précise : cette clé n'ouvre pas seulement les photographies que l'on remet, elle ouvre chaque copie chiffrée existante, y compris celles dans les sauvegardes, et elle n'est pas révocable. La remettre signifierait donner accès à du matériel que l'on ne remet pas.

## Erreurs fréquentes

- **Photographies sans consentement spécifique.** Le consentement au traitement n'est pas le consentement à la photographie. Si ce dernier manque, l'image ne devrait pas être acquise.
- **Comparaisons entre cadrages différents.** Ce sont la cause la plus fréquente de contestations sur le résultat : la différence perçue peut dépendre de l'angle, pas du résultat.
- **Envoi des photographies via messagerie ordinaire.** Ce sont des données de l'art. 9 : le canal doit être choisi en conséquence, et une conversation non chiffrée n'est pas ce canal.

## Questions fréquentes

**Puis-je supprimer une photographie ?** Oui. La suppression retire l'image, mais il reste une trace dans le `Journal des accès` du fait qu'une photographie a existé et a été supprimée, avec qui et quand. C'est une protection, pas un résidu.

**Les photographies figurent-elles dans le compte-rendu ?** Non, pas automatiquement. Le dossier de la séance indique qu'elles existent et ne les incorpore pas, car leur ouverture est un accès en soi qui doit rester tracé.

**Combien d'espace occupent-elles ?** Environ 18 Go par cabinet par an avec une utilisation intensive. C'est la raison pour laquelle l'archive des images est prévue sur un espace dédié et non sur le même disque que la base de données.
