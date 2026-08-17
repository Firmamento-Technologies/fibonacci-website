# Première connexion et configuration initiale

Ce guide décrit les opérations nécessaires pour commencer à utiliser Fibonacci, de la première connexion à la configuration complète du cabinet. Il s'adresse au médecin titulaire ou au référent administratif du cabinet qui reçoit en premier l'email d'invitation.

À la fin de la procédure, le cabinet dispose d'un compte administratif protégé par une authentification à deux facteurs, d'un profil de cabinet complet et des premiers opérateurs invités. Le temps moyen requis est d'environ quinze minutes.

## Prérequis

- Email d'invitation reçue à l'adresse communiquée lors de l'onboarding commercial.
- Navigateur supporté mis à jour : Chrome, Edge, Safari ou Firefox en version récente.
- Smartphone avec une application **authenticator** installée : `Google Authenticator`, `Authy`, `1Password` ou `Microsoft Authenticator`.
- Fichier du logo du cabinet au format PNG, taille recommandée 512 x 512 pixels, fond transparent.
- Données fiscales du cabinet : raison sociale, numéro de TVA, adresse du siège, coordonnées publiques.

## Étape 1, accès via le lien d'invitation

L'email d'invitation provient d'une adresse système, avec pour objet `Invitation à Fibonacci`. Il contient un lien unique valable quarante-huit heures.

Ouvre le lien dans un nouvel onglet du navigateur. Si le lien est expiré, demande une nouvelle invitation via {EMAIL_SUPPORTO}.

Le premier écran demande de confirmer l'adresse e-mail et de définir un mot de passe personnel. Le mot de passe doit respecter les exigences minimales suivantes :

- au moins douze caractères,
- au moins une lettre majuscule et une minuscule,
- au moins un chiffre,
- au moins un caractère spécial parmi `! @ # $ % & * ?`.

Les mots de passe sont comparés à des listes publiques d'identifiants compromis. Un mot de passe faible ou réutilisé est refusé avec un message explicite.

## Étape 2, activation MFA TOTP

MFA, soit **Multi-Factor Authentication**, est l'authentification à deux facteurs : en plus du mot de passe, un code temporaire généré par l'application authenticator sur le smartphone est requis. L'activation est obligatoire pour tous les comptes accédant à des données de santé.

La procédure guidée affiche un code QR. Ouvre l'application authenticator sur le smartphone, sélectionne `Ajouter un compte` ou équivalent, scanne le code QR. L'application ajoute une nouvelle entrée intitulée `Fibonacci - email@exemple.fr` et commence à afficher un code numérique de six chiffres renouvelé toutes les trente secondes.

Saisis le code actuel dans le champ de vérification et confirme. La validation est immédiate : si le code est correct, l'application reçoit une confirmation d'activation MFA.

## Étape 3, codes de récupération

Immédiatement après l'activation MFA, Fibonacci génère dix **codes de récupération** à usage unique. Chaque code peut être utilisé une seule fois à la place du code TOTP en cas de perte du smartphone.

Imprime la page ou télécharge le fichier PDF affiché. Conserve les codes dans un endroit physique sûr, séparé du smartphone. Ne les enregistre pas sur le même appareil qui génère les codes TOTP.

Lorsqu'un code de récupération est utilisé, il est consommé. Lorsque moins de trois codes inutilisés restent, l'application affiche un avertissement pour en générer de nouveaux.

## Étape 4, profil du cabinet

Après la première connexion complète, l'application ouvre l'écran `Réglages > Organisation`. Les champs obligatoires sont :

- **Raison sociale**, dénomination légale du cabinet ou nom et prénom du professionnel.
- **Numéro de TVA** italien, onze chiffres, validé automatiquement sur le format.
- **Code fiscal** du cabinet ou du titulaire.
- **Adresse du siège** : rue, numéro, code postal, ville, province.
- **Coordonnées publiques** : téléphone du cabinet, email public, site web facultatif.

Les champs facultatifs incluent le numéro d'inscription à l'Ordine dei Medici, la spécialisation principale, les horaires d'ouverture.

Le logo du cabinet se charge avec le bouton `Charger le logo`. Le système accepte les PNG et JPEG jusqu'à deux mégaoctets et redimensionne automatiquement l'image à 512 x 512 pixels en conservant les proportions. Le logo apparaît sur les reçus, les consentements et les messages au patient.

## Étape 5, invitation des opérateurs

Depuis le panneau `Réglages > Utilisateurs`, le bouton `Inviter un utilisateur` ouvre une modale avec les champs suivants :

- prénom et nom de l'opérateur,
- email professionnel,
- rôle,
- spécialité facultative.

Les rôles disponibles sont :

- **Administration**, accès complet à toutes les zones, y compris les réglages et le journal des accès.
- **Médecin / Professionnel de santé**, accès clinique aux patients assignés ou à l'ensemble du cabinet selon la configuration, accès complet aux dossiers, visites, dictée, consentements.
- **Secrétariat**, accès à l'agenda et à l'anagraphie des patients, accès en lecture seule à la partie clinique, aucun accès au journal des accès.

Chaque opérateur invité reçoit son propre email d'invitation avec la même procédure décrite aux étapes un à trois. À la première connexion, l'opérateur configure son propre mot de passe personnel et son propre MFA.

Le nombre maximum d'opérateurs dépend du plan souscrit. Le panneau affiche la consommation actuelle et la limite du plan.

## Conseils

- Crée dès maintenant un compte administratif dédié, séparé du compte clinique du médecin, pour les opérations de gestion uniquement.
- Imprime les codes de récupération en deux exemplaires et conserve-en un en dehors du cabinet.
- Configure le logo avant de commencer à générer des consentements : les PDF déjà générés ne sont pas mis à jour rétroactivement.
- Vérifie les données fiscales avec le comptable avant l'enregistrement : elles apparaissent sur les reçus et les factures.

## Résolution des problèmes

**Le code TOTP n'est pas valide.** Vérifie que l'heure du smartphone est synchronisée automatiquement avec le réseau. Un décalage temporel supérieur à trente secondes invalide les codes TOTP. Sur iOS, `Réglages > Général > Date et heure > Automatique`. Sur Android, `Réglages > Système > Date et heure > Automatique`.

**Le lien d'invitation est expiré.** Les liens sont valables quarante-huit heures. Demande une nouvelle invitation via {EMAIL_SUPPORTO}, en indiquant l'email destinataire.

**Codes de récupération perdus et smartphone indisponible.** Contacte le support. La procédure prévoit une vérification de l'identité du titulaire du cabinet via une pièce d'identité et une réinitialisation MFA ultérieure. La réinitialisation peut prendre jusqu'à vingt-quatre heures ouvrées.

**Erreur lors du téléchargement du logo.** Vérifie que le fichier est au format PNG ou JPEG et ne dépasse pas deux mégaoctets. Les fichiers avec un profil couleur CMYK ou des transparences complexes sont parfois refusés : enregistre le fichier en PNG sRGB et recharge-le.

## Voir aussi

- [Création et gestion de l'anagraphie des patients](/manuale/anagrafica-paziente)
- [Agenda et gestion des rendez-vous](/manuale/agenda-appuntamenti)
- [Journal des accès et traçabilité](/manuale/audit-log)

Dernière révision : {ULTIMA_REVISIONE}
