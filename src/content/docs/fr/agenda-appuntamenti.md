# Agenda et gestion des rendez-vous

> ⚠️ **Vérifié par rapport à l'application le 2026-08-10.** Les éléments listés ici sont ceux
> qui existent réellement. Si vous en trouvez un décrit mais non visible à l'écran, il s'agit d'un défaut
> du guide : signalez-le.

Ce guide décrit comment utiliser l'agenda intégrée de Fibonacci pour planifier des visites, gérer un calendrier partagé multi-opérateurs, envoyer des rappels SMS automatiques aux patients, exporter et synchroniser les rendez-vous avec des calendriers externes. Il s'adresse aux médecins et au personnel de secrétariat.

L'agenda est conçue pour des cabinets de petite et moyenne taille, de un à vingt opérateurs. La vue par défaut est hebdomadaire pour privilégier la planification opérationnelle quotidienne, mais des vues journalière et mensuelle sont disponibles pour des besoins différents.

## Prérequis

- Compte avec rôle `médecin`, `secrétariat` ou `administration`.
- Fiche patient existante pour la création du rendez-vous ; en alternative, le patient peut être créé à la volée depuis la modale de rendez-vous.
- Pour les rappels SMS automatiques : forfait souscrit incluant le module `Communications`, ou activation optionnelle à la consommation. Le fournisseur est Brevo ou MessageBird selon la configuration du tenant.
- Numéro de portable du patient au format `+39 333 1234567` pour l'envoi correct des rappels.

## Étape 1, accès à l'agenda

Depuis la barre de navigation principale, l'icône calendrier ouvre la section `Rendez-vous`. L'écran affiche :

- en haut à gauche le sélecteur de vue : `Journalière`, `Semaine`, `Mois`,
- en haut à droite le sélecteur d'opérateur avec filtre `Tous`, `Seulement moi`, `Multi-opérateur`,
- au centre la grille horaire avec les rendez-vous disposés en blocs colorés,
- dans la barre latérale droite le panneau de détails du rendez-vous sélectionné.

La vue hebdomadaire est la vue par défaut et affiche cinq ou sept jours selon les préférences : `Réglages > Rendez-vous > Jours visibles`.

## Étape 2, création d'un nouveau rendez-vous

Cliquez à gauche sur une plage horaire libre pour ouvrir la modale `Nouveau rendez-vous`. Les champs sont :

- **Patient**, liste déroulante avec autocomplétion sur l'anagrafique existante. Le bouton `+` adjacent ouvre la création rapide de patient.
- **Opérateur**, sélection parmi les opérateurs actifs du cabinet. Par défaut : utilisateur actuel s'il a le rôle médecin, sinon le premier opérateur disponible.
- **Motif** ou **Type de visite**, sélection dans un catalogue configurable par le cabinet : les éléments disponibles sont ceux que vous trouvez dans le menu, pas une liste fixe.
- **Durée**, valeur en minutes avec un défaut de trente, options rapides quinze, trente, quarante-cinq, soixante, quatre-vingt-dix.
- **État**, modifiable ultérieurement depuis la fiche du rendez-vous.
- **Notes**, champ libre pour mémo de l'opérateur non visible par le patient.
- **Notes patient**, champ libre inclus dans les rappels automatiques.

Le bouton `Enregistrer` enregistre le rendez-vous. La plage horaire apparaît immédiatement dans la grille avec la couleur associée à l'opérateur ou au type de visite selon la préférence configurée.

## Étape 3, gestion des conflits de calendrier

Le système vérifie en temps réel la présence de chevauchements avec des rendez-vous existants pour le même opérateur. En cas de conflit, la modale affiche un avertissement jaune avec le détail du rendez-vous en conflit et trois options :

- `Modifier l'horaire`, revient à la saisie,
- `Attribuer à un autre opérateur`, change d'opérateur en conservant l'horaire,
- `Enregistrer quand même`, enregistre le chevauchement et le marque avec une icône d'avertissement dans la grille.

Le chevauchement `Enregistrer quand même` est utile dans des cas spécifiques, par exemple un double rendez-vous pour un accompagnateur et un patient, mais il est généralement déconseillé.

## Étape 4, gestion des états des rendez-vous

Chaque rendez-vous a un état courant, représenté graphiquement par une couleur et une icône :

- **Programmé**, état initial, bleu clair.
- **Confirmé**, patient a confirmé suite à un rappel, bleu plein.
- **Check-in**, patient arrivé au cabinet, vert clair.
- **En cours**, visite commencée, vert plein.
- **Terminé**, visite terminée, gris.
- **No-show**, patient non présent, orange.
- **Annulé**, rendez-vous annulé avant le début, rouge clair.

Le changement d'état s'effectue en cliquant sur le rendez-vous et en sélectionnant le nouvel état depuis la barre latérale droite. Le système enregistre un timestamp pour chaque changement dans l'audit log.

L'état `Check-in` peut être activé automatiquement par un éventuel kiosque d'accueil en cabinet (module optionnel). L'état `En cours` peut être activé automatiquement à l'ouverture de la fiche visite du patient.

## Étape 5, rappels SMS automatiques

Les rappels SMS sont envoyés automatiquement au numéro de portable du patient enregistré dans l'anagrafique. Le message standard suit le format :

`Cher/Chère [nom], nous vous rappelons votre rendez-vous du [date heure] chez [nom du cabinet]. Pour confirmer, répondez 1, pour annuler, répondez 2. [lien]`

La configuration des rappels se trouve dans `Réglages > Communications > Rappels` :

- **T-24h**, rappel vingt-quatre heures avant le rendez-vous, activé par défaut.
- **T-2h**, rappel deux heures avant, désactivé par défaut, activable.
- **T-7j**, rappel sept jours avant pour les rendez-vous à long terme, désactivé par défaut.

Le fournisseur SMS utilisé est visible dans les paramètres : Brevo pour les forfaits standard, MessageBird pour les forfaits internationaux. Le coût par SMS dépend du forfait souscrit.

Les rappels nécessitent :

- numéro de portable au format international `+39` pour les numéros italiens,
- case `Consentement communications` cochée dans l'anagrafique du patient,
- solde SMS suffisant dans le forfait.

La réponse du patient aux rappels (`1` pour confirmer, `2` pour annuler) met automatiquement à jour l'état du rendez-vous et notifie l'opérateur.

## Étape 6, vue multi-opérateur

Pour les cabinets avec plusieurs médecins ou opérateurs simultanés, la vue multi-opérateur affiche :

- colonne verticale pour chaque opérateur sélectionné,
- en-tête avec nom et spécialité,
- codage couleur distinct pour chaque opérateur,
- ligne des heures commune.

Le sélecteur en haut à droite permet de choisir quels opérateurs afficher. La préférence est mémorisée par utilisateur.

Le filtre `Seulement moi` réduit la vue au calendrier personnel, utile pour la planification individuelle du médecin. Le filtre `Multi-opérateur` agrège les opérateurs configurés dans le groupe de travail principal.

## Étape 7, glisser-déposer et modifications rapides

L'agenda supporte des interactions directes pour des modifications rapides :

- **Glisser-déposer** d'un rendez-vous sur une autre plage horaire, déplace la date ou l'heure en conservant la durée et les détails,
- **Glisser-déposer** du bord inférieur d'un rendez-vous, modifie la durée,
- **Double-clic** sur un rendez-vous, ouvre le panneau détaillé avec tous les champs,
- **Clic droit** sur un rendez-vous, ouvre le menu rapide avec `Modifier`, `Annuler`, `Dupliquer`, `Déplacer`, `Marquer check-in`,
- **Clic droit** sur une plage libre, ouvre le menu rapide pour créer le rendez-vous sur cette plage.

Les modifications par glisser-déposer génèrent automatiquement, si le rendez-vous a déjà été confirmé, une notification au patient avec le nouvel horaire.

## Étape 8, export et synchronisation iCal

Le bouton `Exporter` ouvre deux options :

- **Export PDF hebdomadaire**, génère un PDF avec la grille hebdomadaire imprimable, utile pour l'archivage papier ou la remise au titulaire.
- **Exporter iCal**, télécharge un fichier `.ics` avec tous les rendez-vous de la plage sélectionnée.

La synchronisation automatique avec des calendriers externes est disponible dans `Réglages > Intégrations > Calendriers`. Le système supporte :

- Google Calendar via OAuth,
- Microsoft Outlook via OAuth,
- tout calendrier supportant l'URL iCal en lecture seule.

La synchronisation est bidirectionnelle pour Google et Microsoft (créer un événement dans le calendrier externe crée le rendez-vous dans Fibonacci et vice versa) et unidirectionnelle pour les autres calendriers (lecture seule depuis Fibonacci).

Pour des raisons de confidentialité, les rendez-vous synchronisés en externe affichent uniquement un titre générique (`Visite médicale`) et l'heure, sans données patient.

## Conseils

- Configurez les types de visites récurrentes du cabinet dans `Réglages > Rendez-vous > Types de visite` avec une durée et une couleur prédéfinies : la création de nouveaux rendez-vous devient plus rapide.
- Pour les cabinets avec des horaires récurrents, bloquez les plages de pause déjeuner et de réunion via `Bloquer plage` répété : les rendez-vous ne pourront pas être créés sur ces plages.
- Paramétrez les rappels T-24h comme défaut et activez le T-2h uniquement pour les rendez-vous complexes ou les premières visites : cela réduit la surcharge de notifications.
- Pour les rendez-vous de télémédecine, le système génère automatiquement le lien de visioconférence dans la confirmation et le rappel si le module télémédecine est actif.
- Double-cliquez sur un jour de la vue mensuelle pour ouvrir la vue journalière détaillée de cette date.

## Résolution des problèmes

**Rappels SMS non reçus par le patient.** Vérifiez dans l'ordre : numéro de portable au format international `+39 333 1234567` ; case `Consentement communications` cochée dans l'anagrafique du patient ; solde SMS suffisant dans le panneau `les paramètres des communications` ; historique d'envoi du rendez-vous individuel dans le panneau `Communications > Historique` qui affiche d'éventuelles erreurs du fournisseur.

**Rendez-vous en chevauchement créé par erreur.** Ouvrez le rendez-vous et utilisez `Modifier l'horaire` pour le déplacer, ou `Attribuer à un autre opérateur` pour redistribuer la charge. Dans tous les cas, le système notifie les éventuels patients déjà avertis avec le nouvel horaire ou le changement d'opérateur.

**Synchronisation Google Calendar interrompue.** Souvent causée par l'expiration du token OAuth après des périodes prolongées d'inutilisation. Ouvrez `Réglages > Intégrations > Google Calendar` et renouvelez l'autorisation. Les rendez-vous déjà synchronisés restent intacts.

**Glisser-déposer ne fonctionne pas sur tablette ou écran tactile.** Sur certains appareils mobiles, le mode glisser nécessite une pression prolongée (long press) avant de commencer à déplacer. En alternative, utilisez le panneau latéral `Modifier` pour changer la date et l'heure avec le clavier virtuel.

**État `No-show` non mis à jour automatiquement.** L'état reste celui initial ou `Confirmé` s'il n'est pas marqué manuellement. Configurez dans `Réglages > Rendez-vous > Auto no-show` le délai après lequel un rendez-vous non démarré est marqué automatiquement comme `No-show` : désactivé par défaut, valeur conseillée soixante minutes.

## Voir aussi

- [Création et gestion de l'anagrafique patient](/manuale/anagrafica-paziente)
- [Premier accès et configuration initiale](/manuale/installazione)
- [Audit log et traçabilité des accès](/manuale/audit-log)

Dernière révision : {ULTIMA_REVISIONE}
