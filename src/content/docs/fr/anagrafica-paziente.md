# Création et gestion de la fiche patient

> ⚠️ **Vérifié par rapport à l'application le 2026-08-10.** Les éléments listés ici sont ceux
> qui existent réellement. Si vous en trouvez un décrit mais ne le voyez pas à l'écran, il s'agit d'un défaut
> du guide : signalez-le.

Ce guide décrit comment enregistrer un nouveau patient dans Fibonacci, comment le rechercher, le modifier, l'archiver et comment exporter ses données pour satisfaire au droit à la portabilité prévu par l'article 20 du GDPR. Il s'adresse aux médecins et au personnel de secrétariat.

La fiche patient est la base de toute autre fonctionnalité clinique : visites, body map, consentements, agenda et audit log sont liés à la fiche anagraphique via un identifiant unique. Une saisie initiale correcte évite les doublons, réduit les erreurs cliniques et garantit la conformité aux normes sanitaires italiennes.

## Prérequis

- Compte Fibonacci avec rôle `médecin`, `secrétariat` ou `admin studio`.
- Pièce d'identité ou code fiscal du patient pour la vérification.
- Adresse e-mail ou numéro de téléphone portable du patient pour les contacts automatiques et les rappels.

## Étape 1, ouverture du formulaire nouveau patient

Depuis la barre de navigation principale, section `Patients`, le bouton `Nouveau patient` en haut à droite ouvre le formulaire d'enregistrement. Le même formulaire est accessible via le raccourci clavier **N** disponible sur n'importe quel écran.

Le formulaire est divisé en quatre onglets :

- `Anagrafica`, données d'identification obligatoires.
- `Contatti`, coordonnées pour les rendez-vous et notifications.
- `Clinico`, informations sanitaires de base.
- `Foto`, image de reconnaissance.

Les onglets doivent être remplis dans l'ordre ; le bouton `Enregistrer` ne s'active que lorsque tous les champs obligatoires de l'onglet anagraphique sont valides.

## Étape 2, saisie des champs obligatoires

Les champs obligatoires sont :

- **Prénom** et **Nom**, en caractères latins sans abréviations.
- **Code fiscal** italien ou type et numéro de document pour les patients étrangers.
- **Date de naissance**, format `jj/mm/aaaa`.
- **Sexe**, valeurs `M`, `F`, `Autre` ou `Non spécifié`.
- **Contact principal**, au moins un entre e-mail et numéro de téléphone.

Le code fiscal italien est validé automatiquement. Le système calcule le code de contrôle, vérifie la cohérence avec la date de naissance, le sexe et le lieu de naissance, signale les incohérences avant l'enregistrement. Pour les patients sans code fiscal italien, le champ `Tipo documento` est disponible : les valeurs sont celles que vous trouvez dans le menu déroulant.

Le numéro de téléphone italien accepte aussi bien le format local `333 1234567` que le format international `+39 333 1234567`. Le système normalise toujours au format international pour les rappels SMS automatiques.

## Étape 3, champs optionnels

Les champs facultatifs de l'onglet clinique incluent :

- **Adresse de résidence** complète.
- **Médecin traitant**.
- **Allergies connues**, champ libre ou autocomplétion à partir de la terminologie SNOMED CT.
- **Groupe sanguin**, valeurs `0`, `A`, `B`, `AB` avec `Rh+` ou `Rh-`.
- **Notes cliniques générales**, champ libre pour des informations pertinentes non structurées.

La saisie des allergies connues et du groupe sanguin est fortement recommandée pour les patients soumis à des procédures invasives : le système affiche un avertissement en haut de chaque fiche de visite lorsque ces champs sont vides.

## Étape 4, photo de profil du patient

L'onglet `Foto` permet de charger une image de reconnaissance du patient, utile pour éviter les homonymies et pour la pré-visite rapide.

Le bouton `Carica` accepte les fichiers JPEG et PNG jusqu'à cinq mégaoctets. Le bouton `Scatta` ouvre l'appareil photo du dispositif avec le consentement explicite du patient.

La photo est chiffrée au repos avec l'algorithme AES-256 et accessible uniquement aux opérateurs autorisés à voir la fiche. Le chiffrement utilise des clés dérivées du tenant du cabinet, séparées des clés des autres cabinets sur la même plateforme.

## Étape 5, enregistrement et vérification anti-doublons

Au clic sur `Enregistrer`, le système vérifie la présence de patients avec un code fiscal identique ou avec une combinaison de prénom, nom et date de naissance identique.

En cas de possible doublon, le système affiche un panneau avec le patient préexistant et trois options :

- `Apri esistente`, abandonne la création et ouvre la fiche déjà existante.
- `Unisci`, unifie les deux enregistrements après confirmation explicite de l'opérateur.
- `Salva comunque`, crée le nouvel enregistrement en le marquant comme possible doublon à réviser.

La fusion est tracée dans l'audit log comme opération administrative.

## Recherche du patient

La barre de recherche globale en haut à droite effectue une recherche incrémentale sur le prénom, le nom, le code fiscal et le numéro de téléphone. Les résultats apparaissent après trois caractères.

Des filtres avancés sont disponibles depuis l'écran `Patients > Filtri` :

- plage de dates de naissance,
- créé par un opérateur spécifique,
- dernière visite dans une plage temporelle,
- présence d'allergies connues,
- état d'archivage.

Les filtres se combinent et produisent une liste triable, exportable en CSV.

## Archivage du patient

Lorsqu'un patient n'est plus en soins, le bouton `Archivia` dans la fiche patient le marque comme archivé. L'opération **ne supprime pas les données** : le dossier médical reste accessible en lecture seule pour la période de conservation prévue par la réglementation sanitaire.

Le patient archivé n'apparaît pas dans la recherche standard ni dans les propositions de nouveau rendez-vous. Il reste néanmoins dans le dossier et peut être retrouvé via la recherche.

L'archivage est le mode conforme à l'article 17 du GDPR (droit à l'oubli) dans le contexte sanitaire, où le droit est équilibré avec les obligations de conservation prévues par le Code de déontologie médicale et la réglementation fiscale.

## Suppression définitive

La suppression physique des données n'est autorisée que dans les cas prévus par la réglementation, par exemple pour les patients enregistrés par erreur ou avec un consentement révoqué avant le début de la prestation.

La suppression définitive ne s'initie pas depuis l'interface : il faut contacter l'assistance, et elle est délibérée : il s'agit d'une opération irréversible sur les données cliniques. Approbation d'un second opérateur avec rôle `admin studio`. La suppression effective a lieu après trente jours de période de réflexion, avec un avis préalable par e-mail à l'opérateur demandeur. Toutes les phases de la procédure sont enregistrées dans l'audit log.

## Remettre au patient ses données

L'article 20 du GDPR garantit au patient le droit de recevoir ses données dans un format structuré et d'usage courant.

Depuis le bouton `Esporta dati` dans la fiche patient, on génère une archive ZIP contenant :

- fichier `Patient.json` avec l'anagraphique complète, dans un format standard que toute autre fiche clinique peut lire,
- fichier `Observation.json` avec les observations et paramètres relevés,
- fichier `Condition.json` avec l'anamnèse et les pathologies,
- fichier `MedicationStatement.json` avec les médicaments enregistrés,
- fichier `Procedure.json` avec les procédures effectuées,
- dossier `consents/` avec les PDF des consentements signés,
- dossier `attachments/` avec les photos et comptes-rendus.

L'archive est signée numériquement pour en garantir l'intégrité et est disponible en téléchargement pendant sept jours. Le lien de téléchargement est envoyé par e-mail au patient avec un second facteur d'accès via SMS.

## Conseils

- Raccourci clavier **N** partout pour un nouveau patient, **F** pour ouvrir la recherche rapide, **Esc** pour fermer les modales.
- Importation en masse depuis CSV disponible dans `les réglages du cabinet` : le template prévoit une ligne par patient avec des en-têtes standard. L'importation se fait en deux étapes : aperçu avec validation, puis confirmation.
- Pour les patients mineurs, le référent du parent ou tuteur est enregistré parmi les contacts : les consentements et les reçus font référence au tuteur.
- Pour les patients étrangers sans code fiscal italien, il est recommandé de demander une copie du document et d'enregistrer son numéro dans le champ `Tipo documento > Numero`.

## Résolution des problèmes

**Code fiscal rejeté comme non valide.** Vérifiez que les seize caractères correspondent au document officiel. Une erreur de saisie de la lettre de contrôle finale est l'erreur la plus fréquente. Sinon, utilisez la fonction `Calcola codice fiscale` depuis l'onglet anagraphique.

**E-mail déjà utilisé par un autre patient.** La même adresse e-mail ne peut être associée qu'à un seul patient par cabinet. Pour les familles partageant une adresse e-mail, enregistrez l'adresse uniquement sur le référent et laissez le champ e-mail vide pour les autres membres en utilisant le téléphone comme contact principal.

**Possible doublon signalé mais le patient est nouveau.** Vérifiez le prénom, le nom, la date de naissance : les patients avec des noms communs et des dates proches peuvent déclencher un faux positif. Utilisez `Salva comunque` ; l'enregistrement sera marqué pour une révision ultérieure.

**Photo ne se charge pas.** La limite est de cinq mégaoctets et les formats acceptés sont JPEG et PNG. Les fichiers HEIC provenant d'iPhone doivent être convertis : la plupart des navigateurs mobiles le font automatiquement au moment du téléchargement, certains modèles nécessitent de désactiver l'option `Haute efficacité` dans les paramètres de l'appareil photo.

## Voir aussi

- [Premier accès et configuration initiale](/manuale/installazione)
- [Remplir l'anamnèse avec la dictée IA](/manuale/anamnesi-dettatura)
- [Audit log et traçabilité des accès](/manuale/audit-log)

Dernière révision : {ULTIMA_REVISIONE}
