# Utilisateurs du cabinet et révocation des accès

Ce guide explique comment inviter un collaborateur, ce qu'il peut faire, et surtout **comment lui retirer l'accès lorsqu'il part**. Il s'adresse à l'administrateur du cabinet.

La dernière opération est celle que l'on reporte toujours et qui compte le plus : un collaborateur parti qui conserve ses identifiants peut continuer à ouvrir des dossiers cliniques, et aucun registre ne le signale comme une anomalie car formellement, il est encore autorisé.

## Prérequis

- Compte avec le rôle `admin studio`.
- Pour l'invitation : configuration de la messagerie sur le serveur. Sans cela, le compte de l'invité est créé mais **ne reçoit pas le message avec le lien pour définir le mot de passe**, et la demande apparaît tout de même comme réussie. Si un invité dit n'avoir rien reçu, c'est la première chose à vérifier.

## Étape 1, inviter un collaborateur

Dans `Réglages`, la section `Membres du cabinet` liste les personnes ayant accès. Le bouton `Inviter un utilisateur` demande le prénom, le nom, l'adresse e-mail, le rôle et la politique d'accès.

Chaque invité reçoit **l'authentification à deux facteurs obligatoire** : lors de la première connexion, il lui est demandé de la configurer. Elle n'est pas désactivable, et la raison est que ces comptes accèdent à des données relatives à la santé.

La politique d'accès détermine ce qu'il voit : la politique pour médecin limite la visibilité à ses propres patients ; les politiques de cabinet étendent la visibilité à tous les patients du cabinet. Le choix doit être fait en connaissance de cause, car c'est la différence entre un collègue qui voit ses patients et un qui les voit tous.

## Étape 2, retirer l'accès à quelqu'un qui part

Dans le même tableau, la colonne `Accès` contient le bouton `Révoquer l'accès`.

Avant de confirmer, la fenêtre indique exactement ce qui se passe, et il est bon de la lire :

- **l'accès cesse immédiatement**, y compris les sessions déjà ouvertes : celui qui travaille à ce moment-là est déconnecté dès la première opération,
- **les données cliniques restent**. Les visites, consentements et signatures continuent d'être attribués à ce médecin. Ce n'est pas un détail technique : un compte rendu ne peut pas changer d'auteur parce que celui qui l'a rédigé a changé de cabinet,
- **ce n'est pas réversible depuis l'interface** : pour faire revenir quelqu'un, il faut l'inviter à nouveau.

L'opération est enregistrée dans le `Journal des accès` : qui l'a exécutée, sur qui, et quand.

### Pourquoi il n'existe pas de « suspension temporaire »

C'est la question que se pose quiconque cherche le bouton et ne le trouve pas. La réponse est que sur cette structure, le champ qui semblerait utile, « utilisateur non actif », **n'empêche pas l'accès** : il est descriptif. Un bouton « suspendre » construit sur ce champ dirait à l'administrateur qu'il a retiré l'accès sans l'avoir fait, et c'est pire que l'absence du bouton.

Si l'absence est temporaire et que l'on veut tout de même fermer la porte, la solution est de révoquer l'accès et de réinviter au retour.

## Étape 3, les cas où le bouton n'apparaît pas

À la place du bouton, on trouve un tiret, et en passant dessus, on lit la raison :

- **son propre compte** : personne ne se retire l'accès à soi-même. Si c'était une erreur, il ne resterait personne pour y remédier depuis l'interface,
- **le dernier administrateur** : le retirer fermerait le cabinet hors de son propre projet,
- **les identités de service** (intégrations et automatisations) : elles s'éteignent là où elles sont configurées, pas depuis l'écran des collègues.

## Erreurs fréquentes

- **Reporter la révocation à « quand on aura le temps ».** C'est la seule opération de ce guide qui présente un risque : il existe entre le départ et la révocation.
- **Inviter avec une politique de cabinet « par commodité ».** Cela étend la visibilité à tous les patients, et on ne peut pas revenir en arrière seul.
- **Considérer comme réussie une invitation sans confirmation de l'invité.** Si la messagerie n'est pas configurée, la demande aboutit et le message ne part pas.

## Questions fréquentes

**Que deviennent les dossiers dont il avait la charge ?** Ils restent où ils sont. Ce qui change, c'est qui peut les ouvrir, pas à qui ils sont attribués.

**Puis-je voir qui a révoqué qui ?** Oui, dans le `Journal des accès` : l'opération est tracée comme un événement de sécurité, distinct d'une suppression clinique.

**Un collaborateur révoqué peut-il encore utiliser une application ouverte ?** Non. La session en cours cesse de fonctionner dès la première opération : la révocation ne attend pas l'expiration du token.
