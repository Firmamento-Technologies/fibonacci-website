# Paramètres cutanés

Ce guide décrit la mesure des **paramètres cutanés esthétiques** : onze grandeurs que Fibonacci calcule sur une région de peau que tu choisis sur une photographie déjà présente dans le dossier, leur enregistrement et leur comparaison dans le temps. Ce sont des mesures **de la photographie**, pas de la peau : elles décrivent l'image d'une zone, et servent à documenter avec des chiffres ce qui aujourd'hui se documente uniquement avec deux photos côte à côte.

⚠️ **La page n'apparaît que si la fonction a été activée pour ton cabinet.** Si dans la barre du dossier tu ne vois pas `Paramètres cutanés`, ce n'est pas un défaut : la fonction est derrière un interrupteur, éteint par défaut.

## Ce que ça ne fait pas, avant ce que ça fait

C'est écrit aussi en tête de page, avec la même évidence que les chiffres, et ce n'est pas une formule de politesse :

> Cet outil calcule des grandeurs photographiques sur la région que tu délimites. Il ne détecte, ne signale et ne compte pas de lésions, de nævus ou de taches suspectes, n'attribue pas les valeurs à une cause et n'est pas un outil de dépistage : il ne remplace pas l'examen de la peau.

En pratique : aucune valeur n'est comparée à un seuil, il n'existe pas de jugements de gravité ou de degré, aucun chiffre n'est coloré en vert ou en rouge, et la page ne dit jamais « amélioré » ou « aggravé ». Les chiffres s'affichent nus, avec leur unité ; le jugement reste le tien. Si en regardant la région tu remarques quelque chose, c'est ton œil qui l'a remarqué : le programme ne regarde pas, il mesure là où tu lui dis de mesurer.

## Prérequis

- Compte avec le rôle `médecin` ou `admin studio`.
- Au moins une photographie dans le dossier (voir le guide « Photos cliniques et comparaison avant/après »). N'importe quelle vue convient, pas besoin de la vue frontale.

## Où le trouver

Le bouton `Paramètres cutanés` se trouve dans la barre en haut du dossier du patient, à côté de `Analyse du visage`, et est visible depuis n'importe quelle fiche. Depuis la page de l'analyse du visage et celle des paramètres, on passe de l'une à l'autre via un lien en haut à droite.

## Comment l'utiliser

1. **Choisis la photographie.** Sous `Fotografia` se trouve la bande des clichés dans le dossier, du plus récent. Le premier est déjà sélectionné.
2. **Trace la région.** Sous `Regione da misurare`, fais glisser ton doigt ou la souris sur la photographie : ce qui reste en dehors s'assombrit, ainsi on voit d'un coup d'œil ce qui entre dans le calcul et ce qui n'y entre pas. Tu peux la redessiner autant de fois que tu veux, le dernier rectangle l'emporte. Sous la photographie, tu trouves la mesure en pixels de la région que tu as tracée.
3. **Lis les valeurs.** Elles apparaissent à côté de la photographie dès que tu relâches le glisser.

⛔ **Il n'y a pas de région prédéfinie, et ce n'est pas un oubli.** Un programme qui choisit lui-même où regarder commence à sélectionner des éléments, ce qui est différent de ce que fait celui-ci. La zone, c'est toi qui la choisis, toujours.

En changeant de photographie, la région est réinitialisée : c'était un rectangle sur une autre peau, et la garder donnerait des chiffres plausibles sur une zone que personne n'a choisie.

Le calcul s'effectue **dans le navigateur** : la photographie ne quitte pas le système et aucun service externe ne la reçoit.

## Les onze éléments

| élément | ce qu'il indique |
|---|---|
| Zone avec pigmentation plus foncée que le fond local | quelle partie de la région est plus foncée que la moyenne locale qui l'entoure, en pourcentage |
| Ouvertures circulaires détectées | combien de petites ouvertures rondes sont comptées, dans l'intervalle de diamètre déclaré |
| Diamètre moyen des ouvertures détectées | quelle est leur taille moyenne, en pourcentage du côté court de la région |
| Zone occupée par les lignes détectées | quelle partie de la région est couverte par les lignes que les filtres de contraste trouvent |
| Longueur totale des lignes détectées | leur longueur additionnée, en multiples du côté court de la région |
| Couleur moyenne, clarté L\* | la clarté moyenne, de 0 (noir) à 100 (blanc) |
| Couleur moyenne, axe a\* | l'axe rouge/vert de la couleur moyenne |
| Couleur moyenne, axe b\* | l'axe jaune/bleu de la couleur moyenne |
| Angle typologique individuel (ITA) | l'angle colorimétrique calculé à partir de L\* et b\*, en degrés |
| Hétérogénéité de la couleur | à quel point les pixels de la région s'éloignent en moyenne de la couleur moyenne |
| Zone avec composante rouge plus élevée que la médiane de la région | quelle partie de la région dépasse d'une quantité déclarée la médiane du rouge de la région elle-même |

Les étiquettes indiquent **ce qui a été mesuré sur l'image**, jamais à quoi cela pourrait être dû : cette interprétation, tu la fais devant le patient, et c'est la raison pour laquelle le programme ne l'écrit pas à ta place.

### L'ITA n'est pas le phototype, et Fibonacci ne le transforme pas en phototype

C'est la question qui vient immédiatement, car dans la littérature, une table de conversion entre l'angle typologique individuel et le phototype de Fitzpatrick existe, et elle tient en six lignes. Fibonacci **ne l'applique pas**, et affiche uniquement l'angle. Trois raisons, par ordre d'importance :

1. **Un phototype est un degré, et cette page n'attribue pas de degrés.** La même règle s'applique ici que pour le reste : l'outil mesure, la classification est faite par le médecin.
2. **La conversion, mesurée, ne tient pas bien précisément sur Fitzpatrick.** Une étude de 2025 qui calcule l'ITA automatiquement et le mappe sur deux échelles trouve un bon accord avec l'échelle de Monk et un accord **moins constant** avec les types de Fitzpatrick. Cela n'étonne pas : Fitzpatrick naît de la **réaction au soleil**, pas de la couleur, et c'est en fait une évaluation, pas une mesure de couleur.
3. **Classer une personne selon la couleur de sa peau à partir d'une photographie est une catégorisation biométrique sur une caractéristique protégée**, et en tant que telle, ce n'est pas un choix technique mais une décision avec des conséquences normatives propres.

Le phototype dans Fibonacci reste là où il a toujours été : le champ `Fototipo (Fitzpatrick)` dans l'anamnèse esthétique, que le système décrit déjà comme « C'est une évaluation du médecin, pas une réponse du patient ». L'angle mesuré ici peut t'aider à le remplir, il ne le remplit pas à ta place.

Le bouton `Come è misurato`, sous les valeurs, ouvre les paramètres exacts de la méthode : zone de travail, région minimale, rayon du fond local, intervalle de diamètre des ouvertures, orientations et seuil des filtres des lignes, écart de la composante rouge. Ce sont les paramètres de l'outil, comme le diaphragme d'un appareil photo : aucun d'eux ne sépare une valeur « normale » d'une valeur « anormale ».

## Quelle doit être la taille de la région

Elle doit avoir au moins **120 pixels de côté** et **40 000 pixels carrés** de surface. En dessous, la page l'indique et n'affiche pas de chiffres.

La raison est mesurée, pas prudente : sur une petite région, les ouvertures à compter sont peu nombreuses, et un comptage sur peu d'éléments varie. En reprenant la même peau sans rien changer, le comptage a varié de **33 % sur vingt-et-un mille pixels carrés** et de **9,8 % sur soixante-dix-huit mille** : c'est-à-dire que sur une petite région, le nombre change d'un tiers sans que rien ne se soit passé sur la peau. Un nombre de ce genre n'est pas une mesure, c'est du bruit qui a l'air d'une mesure, et alors il vaut mieux ne pas avoir de nombre.

Pour la même raison, sous les valeurs, la page indique combien d'ouvertures ont été comptées dans cette région et quelle est la précision du comptage. C'est la tolérance de l'outil, comme celle d'un pied à coulisse : **ce n'est pas** un jugement sur la peau. Si tu as besoin d'un comptage plus stable, élargis la région.

## Enregistrer dans le dossier

Les valeurs sont recalculées à partir de la photographie chaque fois que tu ouvres la page. Dans le dossier, elles n'entrent **que si tu les enregistres** : sous les valeurs, choisis la `Zona misurata` dans la liste (le même vocabulaire de zones que tu utilises pour les traitements et les photos) et appuie sur `Salva in cartella`.

La zone est obligatoire : sans elle, dans la comparaison dans le temps, une joue et un front finiraient dans la même ligne.

Enregistrer à nouveau la **même région de la même photographie** met à jour la mesure au lieu de la dupliquer, et le bouton l'indique : il devient `Aggiorna in cartella`. Deux zones différentes sur la même photographie coexistent sans se superposer.

Ce qui est enregistré dans le dossier emporte avec lui d'où il vient : la photographie d'origine, le rectangle exact (ainsi la même mesure peut être refaite à l'identique), la méthode avec laquelle elle a été obtenue et qui a décidé de l'enregistrer. La date de la mesure est celle de la **prise de vue**, pas celle de l'enregistrement : la peau mesurée est celle de ce moment-là.

## Dans le temps

En bas de la page, `Nel tempo, per zona` aligne les mesures enregistrées, **séparées par zone**, avec la valeur la plus récente et la différence par rapport à la première.

Au-dessus des séries, il y a toujours la même phrase, et c'est la chose la plus importante de la page :

> En reprenant la même peau sans rien changer, lors des tests, ces chiffres ont varié entre 1 % et 6 % (jusqu'à 10 % pour le comptage des ouvertures, sur une petite région). Une différence plus petite que cela n'est pas une différence.

Même les graphiques sont calibrés sur ce chiffre : une différence plus petite que la précision de l'outil apparaît **plate**, pas en hausse. Sans cette précaution, une ligne brisée entre deux seules mesures dessinerait toujours une diagonale à pleine hauteur, même pour une différence de zéro, et le dessin dirait quelque chose que le nombre ne dit pas.

## Les limites, en détail

- **Elles mesurent la photographie, pas la peau.** Elles changent avec la lumière, la distance de prise de vue, l'objectif et la compression du fichier. Pour que deux mesures soient comparables, il faut deux clichés comparables : même poste, même lumière, même distance. Cela vaut exactement comme pour la comparaison avant/après.
- **Le test de répétabilité a été fait sur des photographies de studio**, bien éclairées et nettes. Il ne tient pas compte de la lumière de ta salle, du maquillage résiduel, de l'heure de la journée. Les chiffres ci-dessus sont donc un **minimum** : sur ton poste, l'écart sera plus grand, pas plus petit.
- **Aucun modèle entraîné.** Les valeurs proviennent de calculs descriptibles un par un (moyennes locales, composantes connexes, filtres orientés, conversion d'espace couleur), pas d'un système entraîné sur des cas cliniques. C'est un choix, pas une limite technique : un système entraîné répondrait à la question « à quoi cela ressemble », qui est une autre question.
- **Ce n'est pas un outil de dépistage.** Mesurer quelque chose dans une région ne signifie pas que le reste a été examiné.

## Guides liés

- « Photos cliniques et comparaison avant/après », pour le protocole de prise de vue : c'est ce qui rend les mesures comparables.
- « Analyse du visage », pour les mesures de forme et de proportion sur la vue frontale.
