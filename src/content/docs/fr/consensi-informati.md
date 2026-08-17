# Générer et signer des consentements éclairés en PDF

Ce guide décrit comment générer des brouillons de consentement éclairé structurés selon la **loi 219/2017** en utilisant le **Wizard IA de Fibonacci**, les valider section par section et recueillir la signature graphométrique du patient au format PDF/A-3b conforme. Il s'adresse aux médecins de médecine esthétique et de chirurgie plastique exerçant en Italie.

Fibonacci ne distribue pas de modèles tiers. Le système combine deux sources :

1. **Plus de 100 modèles propriétaires Fibonacci v0.1 (brouillons à valider)** pour les procédures les plus fréquentes de médecine esthétique injectable et non chirurgicale, chirurgie plastique du visage et du corps, et suivi.
2. **Wizard IA génératif** pour des consentements sur mesure pour tout traitement hors catalogue, à partir d'une bibliothèque de **72 clauses juridiques extraites de sources de la Pubblica Amministrazione italienne** (actes régionaux, ASL, entreprises hospitalières) qui sont dans le domaine public selon la loi 633/1941 art. 5.

Tous les outputs sont validés par trois couches anti-hallucination (voir Étape 4) et archivés avec un sceau électronique avancé, et chaque étape reste dans le `Journal des accès`.

## Prérequis

- Compte avec rôle `médecin` ou `admin studio`.
- Fiche patient complète avec au moins nom, prénom, code fiscal et date de naissance.
- Profil médecin du cabinet configuré avec données identificatives et numéro d'inscription à l'`Ordine dei Medici` (vérifier dans `Réglages` → `Données cabinet et médecin`).
- Pour la signature graphométrique : une tablette ou un dispositif tactile sur lequel le patient peut apposer sa signature, et une pièce d'identité du patient pour la vérification préalable.

## Étape 1, ouverture du module consentements

Depuis la fiche de visite du patient, l'onglet `Consentements` ouvre le panneau de gestion. L'écran affiche :

- dans la colonne de gauche la liste des consentements déjà générés pour le patient, avec l'état `Brouillon`, `Envoyé`, `Signé`, `Révoqué` ;
- dans la colonne de droite le bouton `Nouveau consentement` qui ouvre le Wizard IA.

Les consentements déjà signés restent accessibles en lecture seule. La génération d'un nouveau consentement n'écrase ni ne modifie les précédents : chaque consentement reste un document distinct, avec sa propre trace non modifiable.

Alternativement, depuis le menu `Consentements` → `Catalogue`, on accède aux plus de 100 modèles propriétaires Fibonacci prêts pour le téléchargement en PDF (automatiquement complétés avec les données du cabinet et du médecin). Ils sont utiles comme référence ou pour des impressions rapides sans patient en charge.

## Étape 2, Wizard IA en 4 étapes

Le bouton `Nouveau consentement` ouvre le wizard en 4 étapes.

**Étape 1 · Choix de la procédure** : le catalogue répertorie les procédures disponibles divisées par catégorie (médecine esthétique injectable, non chirurgicale, suivi). Tu peux rechercher par nom ou partir de zéro avec une description libre du traitement.

**Étape 2 · Paramètres cliniques** : champs pré-remplis pour la technique, les matériaux (ex. type de filler, lot, dispositif laser), les risques connus spécifiques de la procédure, les alternatives thérapeutiques et les notes. Plus tu fournis de détails, plus le score de confiance sera élevé à l'étape suivante.

**Étape 3 · Génération IA** : le système invoque le modèle linguistique configuré et en 10-15 secondes compose le brouillon des 8 sections obligatoires selon la loi 219/2017 :

1. Identification du patient et contexte de la prestation
2. Description clinique de la procédure
3. Bénéfices attendus
4. Risques documentés et probabilités réalistes
5. Alternatives thérapeutiques (y compris l'abstention)
6. Conséquences du refus
7. Déclaration de compréhension du patient
8. Signature et ratification

Sous le résultat, tu reçois le panneau `Validation automatique` (Étape 4).

**Étape 4 · Revue médicale + signature** : dans l'étape finale, tu valides chacune des 8 sections après les avoir relues, puis tu recueilles la signature graphométrique du patient. Le bouton `Enregistrer et envoyer` reste désactivé tant que tu n'as pas confirmé les 8 sections.

## Étape 3, paramètres cliniques et personnalisation

L'éditeur du wizard à l'Étape 2 présente les champs suivants, complétés ou suggérés :

- **Anamnèse** : nom, prénom, code fiscal, date de naissance du patient (complétés automatiquement).
- **Cabinet** : dénomination, P.IVA, adresse, téléphone, PEC (complétés automatiquement depuis les `Réglages`).
- **Médecin exécutant** : nom, ordre professionnel, numéro d'inscription (complétés automatiquement).
- **Date de la prestation** : généralement aujourd'hui ou la date du `Rendez-vous` lié.
- **Technique** : description de la méthode (ex. "injection intradermique avec canule 25G dans la zone vermillon, patient assis, anesthésie topique EMLA 30 min").
- **Matériaux** : produits utilisés avec lots traçables.
- **Risques connus** : les risques spécifiques de cette procédure avec probabilités (ex. "ecchymoses 5-10%, œdème 48h, asymétrie <2%, ischémie rare").
- **Alternatives** : options alternatives raisonnables (y compris "abstention du traitement").
- **Notes libres** : éventuelles conditions cliniques du patient qui modifient le consentement (allergies, thérapies anticoagulantes).

Le niveau de détail que tu saisis ici guide l'IA : entrée riche → sortie riche avec citations précises. Entrée pauvre → sortie générique qui devra être marquée comme `review_obbligatoria`.

## Étape 4, validateurs anti-hallucination

Avant que le consentement ne soit présenté au médecin, le système exécute trois validateurs en séquence :

**Validateur #1 · Liste noire des termes interdits** : le backend rejette automatiquement tout output contenant :

- noms de marques ou sigles de sociétés tierces du secteur (protection anti-copyright) ;
- allégations trompeuses du type "résultat garanti", "100% sûr", "guérison garantie", "aucune complication", "je certifie que", "sans aucun risque".

En cas de détection, l'output n'est jamais affiché et le système régénère avec un prompt renforcé.

**Validateur #2 · Vérification des citations** : vérifie que le texte contient les références normatives obligatoires (`L. 219/2017`, `Cassazione`, `GDPR`). S'ils manquent, un avertissement est émis mais ne bloque pas : le médecin peut tout de même procéder en connaissance de cause.

**Validateur #3 · Score de confiance par section** : chaque section des 8 obligatoires obtient un score `0.0-1.0` calculé sur :

- longueur du texte (sections trop courtes = confiance faible) ;
- présence de citations normatives inline (`legge 219`, `art.`, `gdpr`, `cassazione`, `fnomceo`, `lazio`) ;
- nombre de clauses PA référencées depuis la bibliothèque de 72 éléments.

La section 5 (Souscription/signature) nécessite toujours une revue manuelle quel que soit le score, étant la plus critique juridiquement.

Si `overall_confidence < 0.7` ou s'il y a des erreurs dans la liste noire, le système définit `review_obbligatoria=true` et bloque l'enregistrement jusqu'à ce que le médecin reformule manuellement les sections problématiques.

De plus, un *frequency check* signale comme avertissement les pourcentages suspects (ex. "100% de risque", "0,001% de complication") qui indiquent souvent des hallucinations numériques de l'LLM.

## Étape 5, signature du patient et archivage

Après la revue médicale (8/8 cases cochées), le bouton `Enregistrer et envoyer` devient actif. En cliquant dessus, les actions suivantes se déroulent en séquence :

1. **Génération PDF/A-3b** : le module `pdf-signer` de Fibonacci convertit le Markdown du consentement en PDF/A-3 conforme à la norme ISO 19005-3, avec un fichier XML embarqué pour la validation à long terme. C'est le format requis par le Codice dell'Amministrazione Digitale art. 44 pour la conservation décennale.

2. **Sceau électronique avancé** : le PDF est scellé côté serveur avec le certificat du titulaire du cabinet et une marque temporelle (TSA conforme eIDAS).

3. **Signature graphométrique du patient** : le patient signe sur tablette ; le système capture, en plus de l'image de la signature, les données biométriques du trait (pression, vitesse, temps), qui sont chiffrées et incorporées dans le PDF pour une éventuelle expertise graphologique. Il s'agit d'une signature électronique avancée (FEA), à recueillir après vérification de l'identité du patient via un document. La FEA a la valeur probante de l'écrit privé (art. 2702 c.c.) ; en cas de désaveu, la charge de la preuve incombe à celui qui la produit. La pleine présomption de rattachement au signataire (art. 20 c. 1-bis CAD) s'obtient avec la signature qualifiée (FEQ), activable · avec la marque temporelle qualifiée · via un QTSP accrédité.

4. **Archivage** : le consentement signé entre dans le dossier du patient, lié à la visite et au médecin qui l'a recueilli. Le PDF reste attaché et téléchargeable.

5. **Trace** : l'opération est enregistrée dans le `Journal des accès` immuable avec `action=C` (create), `purposeOfEvent` décrivant la revue IA 8/8 sections, agent (médecin), source (Wizard IA), outcome (success/failure). Recherche forensique depuis l'Audit Log avec filtres date, patient, médecin.

Le patient reçoit une copie du PDF signé par e-mail. Le cabinet conserve toujours l'original archivé.

## Étape 6, révocation, modification, réimpression

- **Révocation** : le patient ou le médecin peuvent révoquer un consentement signé depuis le menu contextuel `Révoquer`. L'état passe à `inactive` (Révoqué), un nouvel `AuditEvent action=U` est créé avec la motivation, mais le PDF original reste archivé. Une révocation après prestation entraîne l'interruption du traitement (loi 219/2017 art. 1 comma 5).

- **Modification** : les consentements signés **ne sont pas modifiables**. Si un consentement mis à jour est nécessaire (ex. changement de technique), un nouveau consentement est généré. Le système affiche automatiquement les précédents dans la fiche patient avec l'historique des versions.

- **Réimpression** : depuis le consentement signé, il est toujours possible de retélécharger le PDF original, identique à celui scellé. Utile pour l'ajouter au dossier papier ou le remettre au patient.

⚠️ **Révoquer un consentement n'est pas effacer des données.** Le PDF révoqué reste archivé : c'est ce qui prouve que le consentement existait au moment où la prestation a été réalisée, et la révocation n'affecte pas le dossier. Si le patient demande l'accès, la portabilité ou la suppression de ses données, le guide est différent : [Exportations et droits du patient](/manuale/esportazioni-e-diritti).

## Notes importantes

- Les plus de 100 modèles propriétaires Fibonacci sont en **version 0.1 (brouillon interne)**. Ils couvrent la structure légale prévue (8 sections L. 219/2017 + 5 éléments Cassazione 26104/2022 + GDPR + eIDAS + PDF/A-3b) mais le **contenu clinique n'a pas encore été validé par un avocat spécialisé en droit médical ni par un médecin spécialiste** de la discipline. Avant toute utilisation avec des patients réels, tu dois : (1) faire relire chaque modèle par le juriste de ton cabinet, (2) vérifier les risques/percentages avec les lignes directrices sociétaires mises à jour (SICPRE/ISAPS, SIDeMaST, SIME/AIME), (3) personnaliser le consentement pour chaque patient (allergies, thérapies en cours, comorbidités · le wizard t'y oblige à l'Étape 2), (4) contresigner le document après la signature du patient. Fibonacci fournit l'infrastructure technique, ne remplace pas l'avis juridique de l'avocat spécialisé en droit médical ni la responsabilité clinique du médecin traitant.

- Le Wizard IA génère des textes qui doivent **toujours être relus** par le médecin avant l'envoi : l'IA est un outil d'assistance (conforme au requisit RF-5.4), pas un dispositif médical. La revue obligatoire des 8 sections de l'Étape 4 sert à marquer cette responsabilité.

- Les données traitées pour la génération du consentement ne sont pas utilisées pour l'entraînement des modèles (opt-out contractuel avec les fournisseurs). L'inférence se fait via le fournisseur LLM configuré : la liste mise à jour des sous-responsables et de leurs lieux de traitement est publiée dans `/sub-responsabili`. N'insère pas dans le contexte clinique d'identifiants directs du patient au-delà de ce qui est strictement nécessaire.

## Références normatives

- **Loi 219/2017 art. 1** : Normes en matière de consentement éclairé et dispositions anticipées de traitement.
- **Cassazione 26104/2022** : Charge de la preuve du consentement éclairé à la charge du médecin.
- **GDPR art. 9 + art. 30** : Traitement des données de santé + registre des activités de traitement.
- **Règlement UE 910/2014 (eIDAS)** : Signature électronique avancée.
- **CAD art. 44 + ISO 19005-3** : Conservation des documents informatiques conformes.
- **Loi 633/1941 art. 5** : Actes de la Pubblica Amministrazione dans le domaine public.

> Document mis à jour le **{ULTIMA_REVISIONE}**.
