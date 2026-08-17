# Analyse du visage

Cette guide décrit l'analyse morphologique du visage : les mesures que Fibonacci extrait d'une photographie frontale, la comparaison avec les canons néoclassiques, la vue tridimensionnelle, la série photographique par vue, l'enregistrement dans le dossier et l'enregistrement du jugement clinique (PGAIS) sur la comparaison avant/après. L'analyse produit des mesures (angles, rapports, écarts) et les aligne dans le temps ; le jugement reste celui du médecin.

## Prérequis

- Compte avec le rôle `Médecin / Professionnel de santé` ou `Administration`.
- Au moins une photographie frontale du visage déjà dans le dossier (voir le guide « `Photos cliniques et comparaison avant/après` »).

## Où se trouve

Le bouton `Analisi del volto` se trouve dans la barre en haut du dossier du patient, à côté de `Dati e persone` et du menu `Esporta`, et est visible depuis n'importe quelle fiche.

## Ce qui est mesuré, et sur quelle photo

La détection se fait **dans le navigateur** : la photographie ne quitte pas le système et aucun service externe ne la reçoit. Sur un cliché frontal, l'analyse extrait :

- la **médiane du visage** et le **parallélisme des plans** interpupillaire, des canthes externes et des commissures labiales, comme écart en degrés par rapport à la perpendiculaire à la médiane ;
- les **tiers** (rapport tiers moyen / tiers inférieur). Le tiers supérieur n'est pas calculable : il nécessite l'implantation des cheveux, que le modèle ne détecte pas, et la page l'indique au lieu de l'estimer ;
- **quel côté est le plus large** aux pommettes, canthes externes et commissures. Il indique quel côté, pas « à quel point le visage est asymétrique » : c'est la source du modèle qui exclut cette seconde utilisation ;
- la **qualité du cliché** (rotations de la tête), qui marque les clichés non frontaux au lieu d'en cacher les chiffres.

Les mesures sont adimensionnelles (angles, rapports, pourcentages) car à partir d'une photographie sans référence métrique, les millimètres ne peuvent pas être obtenus honnêtement.

## La comparaison avec le canon néoclassique

Chaque élément montre la valeur mesurée, la valeur du canon de référence et l'écart entre les deux. La comparaison avec le canon et la comparaison avant/après restent séparées : les fusionner donnerait un nombre qui ne répond ni à « à quel point il s'écarte de la référence » ni à « ce qu'a fait le traitement ».

## La vue 3D

L'interrupteur `Foto | 3D` montre le maillage du visage reconstruit à partir des points de repère, navigable (*« Fais glisser pour tourner, molette pour zoomer »*), en surface, en grille ou en **`Rilievo`**, qui colore la surface par profondeur au lieu d'imiter la peau : c'est la manière dont les asymétries de volume se voient à l'œil. Les points de repère sont également visibles, tous les 468.

**Ce n'est pas un scan** : la profondeur est estimée à partir d'une seule photographie et est relative : elle sert à tourner autour de la forme, pas à mesurer les saillies ou les volumes. Pour les volumes et les cartes de surface, il faut du matériel de stéréophotogrammétrie, que cette page ne prétend pas remplacer.

## Les angles de profil, posés manuellement

Sur les vues latérales, le modèle ne fournit pas les points nécessaires, donc c'est le médecin qui les pose : la section `Angoli di profilo (punti posati a mano)` demande **six points** et, lorsqu'ils sont tous présents, mesure les angles (*« Six points posés : angles mesurés »*). `Ricomincia` les réinitialise.

C'est le seul point de la page où la mesure dépend de l'endroit où tu cliques : deux séries de clics différentes donnent deux résultats différents, et la répétabilité est la tienne.

## Les mesures en millimètres

`Calibra con un marcatore` transforme les rapports en millimètres : on déclare la `Dimensione reale (mm)` d'un objet présent dans le cliché et on clique sur ses deux extrémités. À partir de là, la page affiche les `Misure assolute (calibrate)` ; `Rifai i clic` et `Ricalibra` refont l'opération.

⚠️ **La calibration ne vaut qu'à l'écran** : les millimètres n'entrent pas dans le dossier, car ils dépendent d'un marqueur et de deux clics de ce moment. Ce qui est sauvegardé reste les rapports et les angles, qui n'ont pas besoin d'échelle.

## Le miroir en direct

`Specchio dal vivo` active la caméra et montre au patient son propre visage en temps réel, avec l'invite à `Inquadra il viso`. **Il ne mesure et n'enregistre rien**, et la caméra *« est éteinte. Elle ne s'allume que lorsque tu le demandes »* : cela sert pendant l'entretien, pour parler d'une zone en la regardant ensemble.

## La série photographique par vue

Le protocole photographique clinique est une série de clichés sur des vues définies (frontale, latérales, obliques à 45°, plus les dynamiques pour la mimique) répétée de manière identique à chaque visite. Pour cette raison, au chargement, chaque photo peut indiquer la **vue** ; la fiche `Foto` montre la série de la visite la plus récente et indique quelles vues manquent.

Trois règles de la série :

- la vue est **facultative** : les photographies chargées avant cette fonction ne l'ont pas, et « non indiquée » reste différent de « frontale ». Le système ne remplit jamais le champ tout seul ;
- la checklist **informe et ne bloque pas** : les clichés hors série sont licites ;
- en prenant une photo depuis la caméra avec une vue choisie, le **cliché précédent de la même vue apparaît en transparence** sur le viseur : superposer le visage au fantôme est la manière pratique de répéter cadrage et distance.

L'analyse travaille sur les clichés frontaux (et sur ceux sans vue indiquée) ; si d'autres clichés sont exclus, la page indique combien.

## Sauvegarder les mesures dans le dossier, et les lire dans le temps

Les mesures sont recalculées à partir de la photographie à chaque ouverture ; **elles n'entrent dans le dossier que si le médecin les sauvegarde**, avec le bouton `Salva in cartella` sous les chiffres. C'est un geste explicite volontairement : un nombre produit par un modèle n'entre dans la documentation clinique que par décision du médecin, et l'enregistrement déclare par lui-même qui a mesuré (le modèle, dans le navigateur), à partir de quelle photographie et qui a décidé de sauvegarder.

Trois règles de la sauvegarde :

- la date clinique de la mesure est celle **du cliché**, pas du jour où on sauvegarde ;
- re-sauvegarder la même photographie **met à jour** l'enregistrement existant, elle n'en crée pas un second ;
- un cliché marqué « à refaire » (tête tournée) **ne peut pas être sauvegardé** : ses chiffres ne sont pas comparables et dans une série historique, ils feraient du tort.

À partir du deuxième enregistrement, la page montre la section **Nel tempo** : une petite série pour chaque mesure, sur les dates réelles des clichés, avec la valeur la plus récente et la différence par rapport à la première. C'est la comparaison du visage avec lui-même (ce que cette page met au centre) étendue au-delà de la paire de photographies.

## Enregistrer le PGAIS à partir de la comparaison

Après avoir choisi deux photographies (la première choisie est le cliché examiné, la seconde la comparaison), la section « Che cosa è cambiato » montre les différences et le bouton `Registra PGAIS`. Le PGAIS est le jugement du médecin sur le résultat, donné **en comparant les photographies pré et post** : l'enregistrer depuis ici signifie enregistrer également quels deux clichés étaient regardés, sans recopier les dates.

La réponse est une étiquette (« Très amélioré », « Amélioré », …), jamais un nombre : la numérotation du GAIS est utilisée dans la littérature dans des directions opposées, et un nombre sauvegardé sans la direction ne serait plus interprétable avec le temps.

## Erreurs fréquentes

- **Comparer des clichés de vues différentes.** Un frontal et un 45° du même jour ne se ressemblent que par le nom : la comparaison ne vaut qu'entre vues homologues.
- **Photographier le « après » trop tôt.** À œdème non résorbé, la comparaison documente le gonflement, pas le résultat.
- **Lire le canon comme un bulletin.** C'est une référence géométrique historique : l'écart est une différence entre deux nombres, pas une indication de traitement.

## Questions fréquentes

**Les mesures sont-elles sauvegardées dans le dossier ?** Seulement si le médecin les sauvegarde, avec le bouton dédié : elles sont recalculées à partir de la photographie à chaque ouverture, et la copie dans le dossier déclare qui a mesuré et à partir de quel cliché. Voir « Sauvegarder les mesures dans le dossier ».

**L'analyse envoie-t-elle la photo à un service externe ?** Non. Le modèle de points de repère fonctionne dans le navigateur ; la photographie reste chiffrée dans le système et n'est déchiffrée que pour ceux qui ont le droit de la voir, comme pour toute autre photo clinique.

**Pourquoi n'y a-t-il pas de score global d'harmonie ?** Choix de produit : la page fournit toutes les mesures ; la synthèse et le jugement restent au médecin.
