> **Traduction de courtoisie.** En cas de divergence, la version italienne de ce document fait foi.

# Sous-responsables du traitement

**Version 2.0 · Dernière révision : {ULTIMA_REVISIONE}**

{AVVISO_BOZZA}

Le présent document constitue l'**Annexe B** de l'Accord relatif au traitement des données (DPA) conformément à l'art. 28 du Règlement (UE) 2016/679 (ci-après, « GDPR »), conclu entre le responsable du traitement (médecin client) et Fibonacci en qualité de sous-traitant pour la fourniture du logiciel SaaS Fibonacci. Il énumère de manière nominative les sous-responsables autorisés conformément aux art. 28.2 et 28.4 du GDPR et est soumis à une mise à jour continue.

---

## 1. Préambule et cadre juridique

1.1. **Définition de sous-responsable**. On définit comme sous-responsable du traitement (ci-après, « Sous-responsable ») le tiers, personne physique ou morale, dont le responsable du traitement se sert pour l'exécution d'activités spécifiques de traitement pour le compte du responsable du traitement, conformément à l'art. 28, paragraphes 2 et 4, du GDPR.

1.2. **Autorisation générale ex art. 28.2 GDPR**. Par la signature du DPA, le responsable du traitement confère au sous-traitant une autorisation écrite générale de recourir aux Sous-responsables indiqués dans la présente Annexe B, reconnaissant que chacun d'eux a été sélectionné par le sous-traitant sur la base d'un jugement de fiabilité et d'adéquation des garanties offertes en termes de sécurité technique et organisationnelle du traitement, conformément à l'art. 28, paragraphe 1, du GDPR.

1.3. **Chaîne contractuelle**. Le sous-traitant conclut avec chaque Sous-responsable un contrat écrit qui impose les mêmes obligations de protection des données prévues dans le DPA entre le responsable du traitement et le sous-traitant, notamment en matière de confidentialité, de mesures de sécurité, d'assistance au responsable du traitement dans l'exercice des droits des personnes concernées et de coopération avec l'autorité de contrôle. Le sous-traitant répond envers le responsable du traitement du manquement des Sous-responsables aux obligations de protection des données, conformément à l'art. 28, paragraphe 4, du GDPR.

1.4. **Obligation d'information et droit d'opposition**. Toute modification de la liste des Sous-responsables, y compris l'ajout d'un nouveau Sous-responsable, le remplacement d'un Sous-responsable existant ou la cessation de la relation avec un Sous-responsable, est communiquée par le sous-traitant au responsable du traitement avec **un préavis d'au moins 30 (trente) jours** par rapport à la date d'effet de la modification, au moyen d'un email adressé à l'adresse du responsable du traitement figurant dans le Contrat de Service et par la mise à jour concomitante de la présente page publiée à l'adresse `{URL_SITO}/sub-responsabili`.

1.5. **Exercice du droit d'opposition**. Dans le délai de 30 jours mentionné au point 1.4, le responsable du traitement a la faculté de s'opposer de manière motivée à la modification proposée. La procédure applicable en cas d'opposition est régie au paragraphe 3 de la présente Annexe.

1.6. **Transparence**. La présente liste est rendue publique afin de permettre au responsable du traitement de vérifier, avant la signature du Contrat de Service et pendant toute la durée de la relation, l'identité et la localisation des acteurs intervenant dans la chaîne de traitement.

---

## 2. Liste des sous-responsables autorisés

Les sous-responsables actuellement autorisés à la date de la dernière révision du présent document sont les suivants.

### 2.1. Aruba S.p.A.

- **Dénomination légale** : Aruba S.p.A.
- **Siège social** : Via San Clemente 53, 24036 Ponte San Pietro (BG), Italie
- **Catégorie de service** : hébergement de l'infrastructure applicative, base de données relationnelle PostgreSQL, archivage des photographies cliniques chiffrées, exécution des sauvegardes périodiques
- **Type de données traitées** : catégories particulières de données au sens de l'art. 9 GDPR (données de santé, anamnèse, comptes-rendus, prescriptions), données d'état civil des patients, photographies cliniques. Toutes les données au repos sont chiffrées avec l'algorithme AES-256 ; les clés de chiffrement sont gérées par le sous-traitant et ne sont pas à la disposition du fournisseur
- **Localisation du traitement** : infrastructure du fournisseur sur réseau italien. Le bloc d'adresses hébergeant le Service est enregistré dans la base de données RIPE sous le nom `ARUBA-NET`, Aruba S.p.A., pays **IT** : la vérification est à la portée de quiconque, via une interrogation `whois` sur l'adresse publique du Service
- **Base juridique du transfert** : traitement entièrement effectué sur le territoire de l'Union européenne ; aucun transfert de données vers des pays tiers au sens du Chapitre V du GDPR n'est configuré
- **Garanties déclarées par le fournisseur** : certification **ISO/IEC 27001** et adhésion au **CISPE Data Protection Code of Conduct for Cloud Infrastructure Service Providers**, code de conduite au sens de l'**art. 40 GDPR** approuvé par la CNIL française en 2021, qui agit en tant qu'autorité de contrôle désignée pour le code. L'inscription du fournisseur est vérifiable dans le registre public CISPE
- **Politique de confidentialité du fournisseur** : [https://www.aruba.it/documents/tc-files/it/11_it_privacy_policy_aruba_spa.aspx](https://www.aruba.it/documents/tc-files/it/11_it_privacy_policy_aruba_spa.aspx)
- **Information GDPR du fournisseur** : [https://www.aruba.it/gdpr-regolamento-europeo-privacy.aspx](https://www.aruba.it/gdpr-regolamento-europeo-privacy.aspx)
- **Registre public CISPE** : [https://cispe.cloud/publicregister/](https://cispe.cloud/publicregister/)
- **Notes opérationnelles** : le fournisseur agit en qualité de simple fournisseur d'infrastructure ; il n'a pas accès applicatif ni logique aux données cliniques, qui résident dans des volumes chiffrés dont la clé est exclusivement à la disposition du sous-traitant
- ⚠️ **À compléter** : la désignation écrite en tant que sous-responsable ex art. 28.3 GDPR avec ce fournisseur est en cours de formalisation en même temps que la constitution de la société titulaire du Service. Jusqu'à présent, cette entrée décrit l'architecture technique vérifiée, et non une relation contractuelle déjà finalisée

### 2.2. Hostinger International Ltd

- **Dénomination légale** : Hostinger International Ltd
- **Siège social** : 61 Lordou Vironos str., 6023 Larnaca, Chypre
- **Catégorie de service** : acheminement d'emails transactionnels via serveur SMTP authentifié, y compris confirmations et rappels de rendez-vous, notifications système, envoi de documents en pièce jointe et communications relatives au premier accès ; **DNS faisant autorité** pour le domaine du Service et ses sous-domaines
- **Type de données traitées** : adresse email du destinataire, nom du destinataire, contenu textuel du message, éventuels documents joints, logs techniques d'envoi. **Ne reçoit pas de données de santé détaillées dans le corps du message** ; les textes sont limités à des informations opérationnelles (date, heure, lieu du rendez-vous) et à des communications de service
- **Localisation du traitement** : fournisseur établi dans l'Union européenne (Chypre). L'emplacement des serveurs de messagerie dépend du plan souscrit et doit être vérifié dans le panneau du fournisseur
- **Base juridique du transfert** : pour d'éventuels traitements en dehors de l'Espace économique européen, les clauses contractuelles types visées par l'Addendum de traitement des données du fournisseur s'appliquent, lesquelles font partie intégrante des conditions de service acceptées
- **Politique de confidentialité du fournisseur** : [https://www.hostinger.com/legal/privacy-policy](https://www.hostinger.com/legal/privacy-policy)
- **DPA du fournisseur** : [https://www.hostinger.com/legal/dpa](https://www.hostinger.com/legal/dpa)
- **Notes opérationnelles** : le contenu des messages est structuré de manière à ne pas véhiculer d'informations cliniques identifiantes ; la référence à la prestation de santé est maintenue de manière générique. ⚠️ Exception faite pour l'envoi de documents en pièce jointe (consentements éclairés, feuille de visite), explicitement demandé par l'utilisateur du service : dans ce cas, la pièce jointe transite par le serveur de messagerie du fournisseur

### 2.3. Mistral AI SAS

- **Dénomination légale** : Mistral AI SAS
- **Siège social** : 15 rue des Halles, 75001 Paris, France
- **Catégorie de service** : transcription automatique de la parole (Speech-to-Text) via le modèle Voxtral pour la fonctionnalité de dictée médicale intégrée dans le Logiciel
- **Type de données traitées** : enregistrements audio temporaires de la dictée du responsable du traitement, pouvant contenir des références directes ou indirectes à des catégories particulières de données au sens de l'art. 9 GDPR. L'audio est envoyé en streaming via API HTTPS et traité dans une fenêtre temporaire
- **Localisation du traitement** : serveurs situés dans l'Union européenne
- **Base juridique du transfert** : traitement effectué sur le territoire de l'Union européenne
- **Politique de confidentialité du fournisseur** : [https://mistral.ai/terms/#privacy-policy](https://mistral.ai/terms/#privacy-policy)
- **DPA du fournisseur** : conditions enterprise de Mistral AI, souscrites par le sous-traitant au moment de l'activation du service ; copie disponible sur demande écrite du responsable du traitement
- **Notes opérationnelles** : l'audio n'est pas conservé par le fournisseur au-delà du temps strictement nécessaire à l'achèvement de la transcription (rétention zéro). Le sous-traitant a sélectionné la configuration contractuelle excluant l'utilisation des entrées des clients API pour l'entraînement des modèles (opt-out training), en l'absence d'opt-in explicite. Le texte transcrit retourné par le service est immédiatement transféré dans l'infrastructure du sous-traitant mentionnée au point 2.1 et ne reste pas à la charge du fournisseur

### 2.4. Stripe Payments Europe Limited

- **Dénomination légale** : Stripe Payments Europe Limited
- **Siège social** : 1 Grand Canal Street Lower, Grand Canal Dock, Dublin, Irlande
- **Catégorie de service** : gestion de l'abonnement au Service Fibonacci, prélèvement récurrent sur carte de crédit ou moyen de paiement équivalent, émission de la facturation du responsable du traitement à l'égard du sous-traitant
- **Type de données traitées** : données d'état civil et données de paiement du médecin responsable du traitement (intitulé, numéro de TVA, adresse de facturation, données du moyen de paiement). **Ne reçoit en aucun cas de données cliniques des patients**, ni de données identificatoires les concernant
- **Localisation du traitement** : serveurs primaires situés dans l'Union européenne (Irlande) ; réplication de résilience dans des datacenters localisés aux États-Unis d'Amérique et au Royaume-Uni
- **Base juridique du transfert** : pour la réplication aux États-Unis, clauses contractuelles types de la Commission UE visées par la Décision 2021/914 (module Responsable-Sous-responsable) complétées par des mesures supplémentaires ; pour le Royaume-Uni, décision d'adéquation de la Commission UE du 28 juin 2021
- **Politique de confidentialité du fournisseur** : [https://stripe.com/it/privacy](https://stripe.com/it/privacy)
- **DPA du fournisseur** : [https://stripe.com/it/legal/dpa](https://stripe.com/it/legal/dpa)
- **Notes opérationnelles** : la chaîne de paiement est séparée de la chaîne clinique ; la réconciliation entre l'abonnement et le tenant Fibonacci s'effectue via un identifiant opaque ne véhiculant pas de données cliniques

---

## 2-bis. Acteurs n'intervenant PAS dans la chaîne

Ce paragraphe énumère ce qui **n'est pas présent**. Il est utile car l'absence d'un intermédiaire constitue en soi une garantie, et parce qu'une version précédente de la présente Annexe mentionnait un sous-responsable que le Service n'utilise pas.

**Aucun réseau de diffusion de contenu (CDN), aucun proxy inverse de tiers, aucun pare-feu applicatif web géré par des tiers.** Le domaine du Service résout **directement** sur l'adresse de l'infrastructure mentionnée au point 2.1 : aucun acteur supplémentaire ne s'interpose entre le navigateur de l'utilisateur et le backend, et il n'existe aucun point où un tiers termine la connexion chiffrée. Cette circonstance est vérifiable de l'extérieur via une interrogation DNS sur le domaine du Service.

**Conséquence sur le Chapitre V du GDPR** : la chaîne traitant les données des patients ne comprend aucun fournisseur soumis à une juridiction extra-européenne. Les seuls transferts vers des pays tiers restants concernent la chaîne des paiements mentionnée au point 2.4, qui **ne traite pas les données des patients**.

---

## 3. Procédure de modification de la liste et droit d'opposition

3.1. **Notification préalable**. Toute modification de la présente liste (ajout d'un nouveau Sous-responsable, remplacement d'un Sous-responsable existant, cessation d'une relation de sous-responsabilité) est notifiée par le sous-traitant au responsable du traitement avec **un préavis d'au moins 30 (trente) jours** par rapport à la date d'effet de la modification. La notification est envoyée par email à l'adresse de contact du responsable du traitement figurant dans le Contrat de Service et la présente page est mise à jour concomitamment.

3.2. **Contenu de la notification**. La notification indique : la dénomination et le siège du Sous-responsable concerné, la catégorie de service confiée, le type de données traitées, la localisation du traitement, la base juridique du transfert le cas échéant, les garanties adoptées, la date d'effet.

3.3. **Droit d'opposition**. Dans un délai de 30 jours à compter de la réception de la notification, le responsable du traitement peut s'opposer par écrit à la modification proposée, en indiquant les motifs de son opposition. L'opposition est envoyée à l'adresse {EMAIL_PRIVACY}, ou par courrier électronique certifié (PEC) ou lettre recommandée avec accusé de réception à l'adresse du siège du sous-traitant.

3.4. **Gestion de l'opposition**. À réception de l'opposition, le sous-traitant évalue de bonne foi des solutions alternatives aptes à satisfaire le besoin technique ou organisationnel sous-jacent à la modification, sans préjudice du droit du sous-traitant d'adopter la solution technique qu'il estime la plus adéquate pour la poursuite du Service.

3.5. **Désaccord**. En l'absence d'accord entre les Parties dans un délai raisonnable suivant l'opposition, chaque Partie a la faculté de résilier le Contrat de Service avec préavis écrit, sans préjudice de l'application des dispositions contractuelles en matière de restitution et d'effacement des données à la fin de la relation.

3.6. **Modifications urgentes pour raisons de sécurité**. Si la modification s'avère nécessaire en urgence pour des raisons de sécurité, de continuité du service ou pour se conformer à une obligation légale, le sous-traitant peut procéder avec un préavis réduit, en communiquant sans délai les raisons au responsable du traitement. Dans ce cas, le droit d'opposition du responsable du traitement et les dispositions des points 3.3, 3.4 et 3.5 s'appliquent néanmoins, bien que *a posteriori*.

3.7. **Absence d'opposition**. L'absence d'opposition du responsable du traitement dans le délai de 30 jours équivaut à l'acceptation de la modification.

---

## 4. Registre des versions

| Version | Date | Modification |
| --- | --- | --- |
| 1.0 | {ULTIMA_REVISIONE} | Première publication de la liste nominative des sous-responsables du traitement, incluant Hetzner Online GmbH, Hostinger International Ltd, Mistral AI SAS, Stripe Payments Europe Limited et Cloudflare, Inc. |
| 1.1 | {ULTIMA_REVISIONE} | Remplacement de Brevo SAS par Hostinger International Ltd en tant que sous-responsable pour l'acheminement des emails transactionnels : le service n'utilise plus de plateforme externe de marketing par email et achemine les messages via le serveur SMTP authentifié du fournisseur de la boîte mail. |
| 2.0 | {ULTIMA_REVISIONE} | **Correction de l'hébergeur et suppression d'un sous-responsable jamais utilisé.** (a) Hetzner Online GmbH (Falkenstein, Allemagne) est remplacée par **Aruba S.p.A.** (Italie), qui est l'entité auprès de laquelle l'infrastructure réside effectivement : la vérification a été effectuée en résolvant le domaine du Service et en interrogeant le registre RIPE de l'adresse obtenue. (b) **Cloudflare, Inc. est supprimé** : le Service n'utilise aucun réseau de diffusion de contenu ni aucun proxy tiers, et le domaine résout directement sur l'infrastructure mentionnée au point 2.1. Il s'ensuit que la chaîne traitant les données des patients ne comprend plus aucun transfert vers des pays tiers. (c) Le DNS faisant autorité est attribué à Hostinger International Ltd, qui le fournit de fait. |

---

## 5. Contacts

Pour toute demande de clarification, exercice du droit d'opposition ou demande de documentation complémentaire relative aux sous-responsables autorisés, le responsable du traitement peut s'adresser aux coordonnées suivantes :

- **Contact pour la protection des données** : {EMAIL_PRIVACY}
- **Service privacy** : {EMAIL_PRIVACY}
- **Sous-traitant** : {DENOMINAZIONE} · siège social : {SEDE_LEGALE}

---

> Le présent document est mis à jour à la date indiquée en en-tête et est soumis à une révision continue. Le responsable du traitement peut demander à tout moment une confirmation écrite de la version en vigueur de la présente liste, en écrivant à l'adresse {EMAIL_PRIVACY}. En cas de divergence entre la copie imprimée et la version publiée à l'adresse `{URL_SITO}/sub-responsabili`, la version en ligne prévaut.
