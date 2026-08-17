# Les zones traitées : sur la photo et sur le modèle 3D

> ⚠️ **Réécrit le 2026-08-17 en consultant l'écran.** La version précédente
> décrivait un tableau récapitulatif avec réorganisation par glisser-déposer, des raccourcis clavier,
> un bouton **« Importer depuis la visite précédente »** et **« Insérer un produit personnalisé »** : **aucune de ces fonctionnalités n'existe**,
> et c'est le pire défaut qu'un guide puisse avoir, car celui qui le lit cherche le bouton et conclut que le produit est défectueux.
> Si tu trouves ici quelque chose qui n'apparaît pas à l'écran, signale-le.

Dans une séance, les zones traitées sont marquées sur une image plutôt que décrites avec des mots : chaque point est un **point rouge numéroté**, et la liste des zones se remplit automatiquement au fur et à mesure que tu les places.

Les surfaces sont **deux**, et ce sont deux façons d'indiquer les mêmes zones :

| Choix | Comment marquer | Ce qu'elle montre |
|---|---|---|
| `Foto` | un clic sur le portrait | le portrait de face, homme ou femme : 76 zones du visage |
| `3D` | double clic sur le modèle | le corps entier, **visage inclus**, homme ou femme |

⚠️ **Jusqu'au 17 août 2026, il y avait aussi un choix entre `visage` et `corps`, et il a été supprimé** : « cela ne fait que prêter à confusion ». Le modèle tridimensionnel est **unique**, avec l'enveloppe du visage par-dessus : tu cliques là où tu as traité, que ce soit la tête ou la cheville. La photo reste parce que sur le visage de face, c'est plus rapide que n'importe quel 3D.

## Prérequis

- Compte avec le rôle `médecin` et accès clinique au patient.
- Une séance ouverte : le module `Nouveau traitement` dans l'onglet `Traitements` du dossier.

## Étape 1, choisir la surface

Dans le module du traitement, à la rubrique `Body-map et zones traitées`, deux boutons : `Foto` et `3D`.

Le **sexe du modèle** (`femme` / `homme`) est **unique** et vaut pour les deux : le choisir sur le portrait et le retrouver sur le 3D reviendrait à poser la même question deux fois. Sur le portrait, le sexe change aussi **l'endroit où tombent les points**, car les deux visages ont des proportions différentes.

⚠️ Le sélecteur du sexe n'apparaît que si le modèle correspondant a été téléchargé sur le serveur. Les zones enregistrées dans le dossier **ne dépendent pas du modèle que tu regardes** : les codes des régions sont les mêmes.

## Étape 2, poser un point

- **Sur le portrait** : un clic à l'endroit traité.
- **Sur le modèle 3D** : **double clic**. Le double clic sert à distinguer le marquage de la rotation : on fait glisser pour tourner, on utilise la molette pour zoomer, et un simple clic ne doit rien marquer par erreur. Un second double clic sur le même point le supprime.
- Le bouton `Ricentra` remet le modèle dans sa position initiale.
- Sur le portrait, `Apri a schermo intero` agrandit l'image lorsque les points sont serrés.

Sur le 3D, le point reste **là où tu as cliqué**, pas au centre de la zone : sur une cuisse, le centre de la zone serait vingt centimètres plus loin. Le modèle s'ouvre sur la figure entière : pour les zones du visage, on zoome avec la molette.

⚠️ **Les points exacts ne valent que pour le modèle sur lequel tu les as posés.** Les deux corps ne sont pas identiques : en passant de l'homme à la femme, le point précis n'existe pas et le point se positionne au centre de la zone, ce qui est toujours correct sur ce modèle. Les zones enregistrées ne changent pas.

## Étape 3, ce qu'on écrit sur un point

Sur le portrait, le point ouvre une petite fenêtre avec deux champs principaux :

- **Traitement**, texte libre (par exemple « filler acide hyaluronique », « botox ») ;
- **Quantité**, texte libre avec l'unité (par exemple « 0,5 ml », « 25 U »).

En dessous, la section **Comment cela a été fait**, fermée par défaut et **facultative**, avec quatre menus déroulants à vocabulaire fermé :

- `Strumento` : aiguille, canule, micro-aiguilles ou roller, autre ;
- `Calibro` : du 18G, le plus épais, au 34G, le plus fin ;
- `Piano` : sus-périosté, sous-galéal, sous-aponévrotique, sous-cutané, dermique profond, dermique superficiel ;
- `Tecnica` : bolus, microbolus, rétrograde, antérograde, en éventail, linéaire.

Ce n'est pas un caprice documentaire : le règlement (UE) 2022/2346, annexe §3.1 lettre j, demande de documenter la technique d'injection, les instruments et la quantité maximale injectée en fonction de la zone et de la technique. Les quatre menus déroulants permettent d'y répondre.

⛔ **Aucun des menus déroulants ne suggère la valeur correcte pour la zone** : ils ne proposent pas de plan, n'avertissent pas si une combinaison est inhabituelle. Les tableaux par zone existent dans la littérature et restent en dehors du logiciel, car ce seraient des indications cliniques.

⚠️ Un point sans ces quatre champs reste valide : toutes les annotations écrites avant le 15 août 2026 ne les ont pas.

## Étape 4, la liste des zones se remplit automatiquement

Les points et la liste `Zones traitées` sous la carte sont **la même chose vue de deux façons** :

- tu poses un point, la zone entre dans la liste ;
- tu choisis une zone dans la liste, le point apparaît sur la carte ;
- tu supprimes l'une, l'autre disparaît.

Cela vaut aussi **entre les surfaces** : une zone marquée sur le modèle 3D a déjà son point en revenant au portrait.

## Étape 5, les zones dictées et celles écrites en toutes lettres

Deux outils amènent sur la carte les zones que tu as écrites (ou dictées) en toutes lettres, et **les deux nécessitent une action de ta part** : rien n'entre dans le dossier automatiquement.

- **« Zones détectées dans le texte : »** apparaît sous le champ des notes pendant que tu écris. Il s'agit d'une reconnaissance par mots-clés, sans modèle linguistique : il propose des étiquettes et tu ajoutes celles qui conviennent.
- **« Extraire automatiquement les zones du texte »** envoie le texte des notes au service d'extraction, qui répond avec les zones, le produit et la quantité déjà séparés, et les zones **s'ajoutent** aux points existants au lieu de les remplacer.

⚠️ **La dictée seule ne colore pas la carte.** `Dicter la séance` remplit le produit, la quantité, le lot et le hors-AMM, mais les zones reconnues sont écrites à la fin des notes sous la forme `[zones dictées : …]`, car les marquer nécessite le code exact de la zone. Ce sont les deux outils ci-dessus qui les transforment en points : le savoir évite de chercher des marques que personne n'a posées.

## Étape 6, usage hors AMM

`Usage hors AMM` est une case à cocher de la fiche du traitement, pas du point individuel, et lorsqu'elle est activée, elle demande la `Motivation hors AMM`. Ce champ existe parce qu'en médecine esthétique, l'usage hors indication est fréquent et légitime **à condition d'être documenté** : la motivation est ce qui reste écrit.

Voir le guide [Enregistrer un traitement](/manuale/trattamenti) pour le lot, la date de péremption, les paramètres du dispositif et le rappel.

## Ce que le modèle 3D ne fait pas

- **Sur le corps, les zones ne se colorent pas en vert**, et ce n'est pas un oubli : les limites des régions proviennent d'une partition en coordonnées osseuses et coupent droit là où l'anatomie est courbe. Les remplir de couleur montrait ce défaut au lieu de la séance. Le signe est le point.
- **Les régions ne sont pas toutes celles du modèle.** La liste contient les zones que la médecine esthétique traite réellement, regroupées en cou, décolleté, bras, mains, abdomen, dos, fesses, cuisses et jambes. Pied, ongles, pavillon auriculaire et régions intimes existent dans le modèle anatomique et **ne figurent pas dans la liste clinique** : une liste qui contient tout est une liste où l'on ne trouve rien.
- **En cliquant en dehors de ces régions, rien n'est attribué**, et la page l'indique : elle affiche le nom technique du point touché, ainsi il est clair que le clic a été enregistré mais que cette zone n'est pas enregistrée.
- **Le côté droit ou gauche vient du clic, pas du nom.** Dans le modèle anatomique, « région antérieure du bras » est un seul nom pour deux bras : c'est la position du point qui détermine le côté.
- **Ce n'est pas l'atlas.** Pour montrer au patient le squelette, les muscles ou les vaisseaux, on utilise la page [Atlas anatomique 3D](/manuale/anatomia), qui n'enregistre rien.

## La carte agrégée, dans l'onglet Traitements

En dehors de la séance, l'onglet `Traitements` du dossier contient une `Carte des traitements` qui résume **tout l'historique du patient** : chaque zone montre **combien de fois** elle a été traitée, et la couleur indique la **catégorie prédominante** de produit dans cette zone. La légende est en page, sous `Légende des catégories`.

En cliquant sur une zone, la timeline en dessous se filtre sur cette zone ; `Supprimer le filtre` revient à tout afficher. La page signale également un `Déséquilibre gauche/droite détecté` lorsque les comptes entre les deux côtés divergent, et `Ouvrir le modèle complet` mène à l'atlas.

⚠️ **Le nombre n'est pas la quantité de produit** : c'est le nombre de traitements enregistrés sur cette zone. Il n'existe pas de sélecteur de période sur cette carte : elle montre tout l'historique.

## Exporter les données

Depuis l'onglet `Traitements` : `Exporter en PDF` produit le récapitulatif des traitements, `Exporter en CSV` la même chose en tableau. Le dossier de **la séance individuelle** se télécharge depuis la ligne de la séance, et est décrit dans [Enregistrer un traitement](/manuale/trattamenti).

## Résolution des problèmes

**Le modèle 3D n'apparaît pas.** Il se télécharge à la première ouverture et est lourd : sur une connexion lente, cela peut prendre quelques secondes. S'il reste vide, recharge la page : les modèles sont servis sans cache, donc un rechargement suffit pour les récupérer.

**J'ai fait un double clic et rien ne s'est passé.** Si le point touché est en dehors des régions que nous enregistrons, un message apparaît avec le nom technique de la zone : essaie plus au centre, ou choisis la zone dans la liste.

**Le point est au mauvais endroit sur le portrait.** Fais-le glisser : la position se met à jour. Sur le 3D, il se supprime avec un second double clic et se replace où nécessaire.

**J'ai changé le sexe du modèle et les points se sont déplacés.** Les deux corps ont des coordonnées différentes : sur l'autre modèle, le point exact n'existe pas et le point revient au centre de la zone. **Les zones dans le dossier restent** identiques.

## Voir aussi

- [Enregistrer un traitement](/manuale/trattamenti)
- [Atlas anatomique 3D](/manuale/anatomia)
- [Remplir l'anamnèse avec la dictée IA](/manuale/anamnesi-dettatura)
- [Résultats et complications](/manuale/esiti-e-complicanze)

Dernière révision : {ULTIMA_REVISIONE}
