# Journal des accès : qui a fait quoi, et quand

Chaque opération sur les données des patients laisse une trace : qui l'a effectuée, quand, sur quelle fiche. Le **`Journal des accès`** est l'endroit où ces traces peuvent être lues.

Il sert à trois choses concrètes : répondre à un patient qui demande qui a consulté son dossier, reconstituer ce qui s'est passé quand quelque chose ne correspond pas, et démontrer lors d'un contrôle que le cabinet conserve une trace de ses activités.

## Qui peut l'ouvrir

Seules les personnes ayant le rôle d'administrateur du cabinet. Si la rubrique **`Journal des accès`** n'apparaît pas dans la navigation, ton utilisateur ne dispose pas de cette autorisation : c'est l'administrateur qui l'accorde dans les `Réglages`.

## Ce que l'on voit

Un tableau, avec la ligne la plus récente en haut. Pour chacune :

- **quand** cela s'est produit ;
- **qui** l'a fait : le nom de l'opérateur, ou *Système* pour les opérations automatiques ;
- **ce qui** a été fait : création, lecture, mise à jour, suppression ;
- **sur quoi** : la fiche ou le document concerné ;
- **comment cela s'est passé** : réussi, avertissement, erreur.

## Les filtres

Au-dessus du tableau, on affine la recherche.

- **Activité clinique** ou **activité système**. La première concerne ce que font les personnes sur les dossiers ; la seconde, ce que le programme fait automatiquement : importations, processus automatisés. Les séparer est vraiment utile, car les secondes sont nombreuses et masqueraient les premières.
- **L'action** : uniquement les lectures, uniquement les modifications, uniquement les suppressions.
- **Le résultat** : uniquement les avertissements, uniquement les erreurs.

## Répondre à un patient qui demande qui a consulté son dossier

C'est le cas le plus fréquent, et c'est un droit du patient : la loi accorde **quinze jours** pour répondre.

1. Filtre pour ce patient.
2. Choisis l'intervalle de dates.
3. Appuie sur **Exporter**.

On obtient un fichier CSV (qui s'ouvre avec n'importe quel tableur) contenant exactement les lignes affichées à l'écran. C'est sous cette forme que la réponse doit être fournie.

## L'intégrité : pourquoi le journal ne se corrige pas

Le journal est conçu de manière à ce qu'une ligne, une fois écrite, **ne puisse être ni modifiée ni supprimée**, et qu'une éventuelle falsification soit visible : chaque ligne est liée à la précédente, donc en toucher une rend l'altération évidente sur toutes les suivantes.

⚠️ **Cette vérification n'a pas de bouton dans l'interface.** Il s'agit d'un contrôle effectué sur le serveur, et le résultat doit être demandé à l'assistance. Si une altération était détectée, il ne s'agirait pas d'un signalement ordinaire : c'est un incident de sécurité, et il doit être communiqué immédiatement.

## Combien de temps les traces sont conservées

Aussi longtemps que la documentation clinique à laquelle elles se réfèrent. Elles restent **même après** qu'un patient a été supprimé : sans son nom, mais avec la trace que l'opération a eu lieu. C'est voulu : un journal qui disparaît avec les données ne prouverait plus rien.

## Ce qui N'EST PAS dans cette page

Pour éviter de chercher ce qui n'existe pas :

- **aucune exportation en PDF signé** : l'exportation se fait en CSV ;
- **aucun bouton de vérification de l'intégrité** (voir ci-dessus : cela se fait sur le serveur) ;
- **aucune frise chronologique graphique** des opérations sur un patient ;
- **aucun filtre enregistrable dans les favoris**, ni recherche par adresse réseau.
