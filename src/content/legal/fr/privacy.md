> **Traduction de courtoisie.** En cas de divergence, la version italienne de ce document fait foi.

# Notice d'Information sur la Protection des Données Personnelles

{AVVISO_BOZZA}

La présente notice décrit les modalités de traitement des données personnelles collectées, conservées et traitées dans le cadre du site institutionnel Fibonacci ({URL_SITO}), de l'application SaaS Fibonacci accessible à l'adresse {URL_APP} et des services associés. Ce document est fourni conformément aux articles 13 et 14 du Règlement (UE) 2016/679 (ci-après « GDPR ») et du D.Lgs. 30 juin 2003 n. 196, tel que modifié par le D.Lgs. 10 août 2018 n. 101 (ci-après « Code de la Protection des Données »).

Fibonacci est un dossier médical numérique dédié à la médecine esthétique, destiné aux médecins et aux professionnels de santé italiens et distribué en mode Software as a Service. Parmi ses fonctionnalités figurent la gestion des données anagraphiques du patient, l'anamnèse structurée, les photos cliniques chiffrées, la body-map 2D, la dictée assistée par intelligence artificielle pour l'anamnèse et les comptes-rendus, la génération et l'archivage des consentements informés au format PDF, le catalogue des médicaments AIFA, le journal d'audit immuable au format FHIR AuditEvent, l'agenda des rendez-vous, l'authentification à deux facteurs TOTP et l'échange natif au format FHIR R4.

> Avertissement préliminaire : trois rôles distincts coexistent dans le périmètre du service. Pour les données de navigation du site Fibonacci et pour les données des médecins clients souscrivant à l'abonnement au logiciel, Fibonacci agit en qualité de responsable de traitement. Pour les données des patients saisies par les médecins clients dans le logiciel, Fibonacci agit en qualité de sous-traitant conformément à l'art. 28 GDPR, tandis que le responsable de traitement est le médecin client qui entretient la relation professionnelle avec le patient. La réglementation du traitement des données des patients est régie par l'Accord sur le traitement des données (ci-après « DPA »), signé concomitamment au contrat de service par le médecin client, et est décrite de manière synthétique dans la section 3 et la section 8 de la présente notice.

## 1. Responsable de traitement

Le responsable de traitement des données personnelles est :

Dénomination : {DENOMINAZIONE}
Siège social : {SEDE_LEGALE}
Numéro de TVA : {PARTITA_IVA}
Numéro REA : {REA}
Adresse de courrier électronique certifié : {PEC}
Contact pour les questions relatives à la protection des données : {EMAIL_PRIVACY}

Pour toute question relative au traitement des données personnelles, y compris l'exercice des droits prévus aux art. 15-22 GDPR, le canal de contact est le suivant :

Canal de contact : {EMAIL_PRIVACY}

## 2. Définitions essentielles

Aux fins de la présente notice, on entend par :

- « Responsable de traitement » : la personne physique ou morale qui, seule ou conjointement avec d'autres, détermine les finalités et les moyens du traitement des données personnelles (art. 4, n. 7 GDPR).
- « Sous-traitant » : la personne physique ou morale qui traite des données personnelles pour le compte du responsable de traitement (art. 4, n. 8 GDPR).
- « Personne concernée » : la personne physique identifiée ou identifiable à laquelle se rapportent les données personnelles (art. 4, n. 1 GDPR).
- « Données personnelles » : toute information concernant une personne physique identifiée ou identifiable (art. 4, n. 1 GDPR).
- « Catégories particulières de données personnelles » : les données visées à l'art. 9 GDPR, y compris les données relatives à la santé, à la vie sexuelle, à l'origine raciale ou ethnique, aux convictions religieuses ou philosophiques.
- « Traitement » : toute opération ou ensemble d'opérations, effectuées avec ou sans l'aide de procédés automatisés, appliquées à des données personnelles (art. 4, n. 2 GDPR).
- « Sous-sous-traitant » : le tiers désigné par le sous-traitant pour effectuer des activités spécifiques de traitement pour le compte du responsable de traitement, conformément à l'art. 28, par. 2 et 4 GDPR.

## 3. Catégories de données traitées

Le responsable de traitement traite différentes données personnelles en fonction du segment de la personne concernée. Voici la distinction.

### 3.1 Visiteurs du site Fibonacci

En ce qui concerne les visiteurs du site institutionnel et les clients potentiels qui remplissent les formulaires de contact ou de demande de démonstration, les données suivantes sont traitées :

- données anagraphiques et de contact : nom, prénom, adresse email, numéro de téléphone, raison sociale du cabinet ou de la clinique, qualification professionnelle, spécialité médicale ;
- données de navigation : adresse IP, identifiants du dispositif, type de navigateur et système d'exploitation, pages visitées, date et heure de la visite, site d'origine, données collectées via des cookies techniques et, avec ton consentement, des cookies analytiques ;
- contenu libre des messages envoyés via les formulaires de contact.

### 3.2 Médecins clients utilisateurs du logiciel

En ce qui concerne les médecins et les professionnels de santé qui souscrivent un abonnement au logiciel Fibonacci, les données suivantes sont traitées :

- données anagraphiques et professionnelles : nom, prénom, code fiscal, date et lieu de naissance, adresse, numéro d'inscription à l'Ordre professionnel, spécialisation, numéro de TVA, données de facturation ;
- identifiants d'accès : adresse email, hash du mot de passe, secret TOTP pour l'authentification à deux facteurs, journal des accès ;
- données relatives à l'utilisation du service : configuration du compte, préférences, journal d'activité, piste d'audit des opérations effectuées sur l'application ;
- données de paiement : les données nécessaires à la gestion de l'abonnement (nom du titulaire, référence au moyen de paiement) sont traitées par le sous-sous-traitant Stripe Payments Europe Ltd, qui agit en tant que responsable autonome du traitement des données des cartes. Fibonacci ne conserve pas les numéros complets des cartes de paiement.

### 3.3 Patients des médecins clients

Les données des patients des structures de santé clientes, saisies dans le logiciel par le médecin client ou ses collaborateurs autorisés, comprennent des données anagraphiques, des données de contact, des données cliniques et anamnestiques, des photographies cliniques, des comptes-rendus, des prescriptions, des consentements informés et toute autre donnée nécessaire à la prestation de soins, y compris des données relevant des catégories particulières visées à l'art. 9 GDPR (notamment les données relatives à la santé).

Pour ces données, Fibonacci agit en qualité de sous-traitant conformément à l'art. 28 GDPR. Le responsable de traitement est le médecin client ou la structure de santé qui utilise le logiciel. Les détails concernant les catégories de données traitées, les instructions documentées, les sous-sous-traitants autorisés et les mesures de sécurité adoptées sont régis par l'Accord sur le traitement des données (DPA) signé concomitamment au contrat de service. Le DPA est disponible sur demande à l'adresse {EMAIL_PRIVACY} et dans la section documentaire de l'espace réservé du médecin client.

Les patients souhaitant exercer leurs droits sont invités à s'adresser à leur médecin traitant en qualité de responsable de traitement. Fibonacci, en qualité de sous-traitant, fournit au médecin responsable l'assistance technique nécessaire pour répondre aux demandes des personnes concernées.

## 4. Finalités et base juridique du traitement

Les traitements effectués par le responsable de traitement poursuivent les finalités indiquées ci-dessous, chacune étant fondée sur une base juridique spécifique.

| Finalité | Catégorie de données | Base juridique |
| --- | --- | --- |
| Fourniture du service Fibonacci aux médecins clients, gestion du compte, fourniture des fonctionnalités contractuelles (dossier médical, agenda, archivage documentaire, dictée par IA, journal d'audit) | Données anagraphiques et professionnelles du médecin client, identifiants d'accès, journal d'utilisation | Art. 6, par. 1, let. b GDPR (exécution d'un contrat dont la personne concernée est partie) |
| Gestion administrative, comptable et fiscale des relations avec les médecins clients (facturation, recouvrement des créances, obligations fiscales) | Données anagraphiques, données fiscales, données de paiement | Art. 6, par. 1, let. c GDPR (exécution d'une obligation légale) |
| Sécurité informatique, prévention des fraudes, abus et accès non autorisés, maintien de l'intégrité du service, audit de sécurité | Journal des accès, adresses IP, identifiants des dispositifs, données techniques de navigation | Art. 6, par. 1, let. f GDPR (intérêt légitime du responsable de traitement à la protection du service et des utilisateurs) |
| Réponse aux demandes envoyées via les formulaires de contact et gestion des demandes de démonstration de la part de clients potentiels | Données de contact, contenu du message | Art. 6, par. 1, let. b GDPR (exécution de mesures précontractuelles à la demande de la personne concernée) |
| Envoi de communications promotionnelles, newsletters et documents d'information sur les produits Fibonacci | Adresse email, nom, prénom, préférences | Art. 6, par. 1, let. a GDPR (consentement spécifique, distinct et révocable) |
| Exercice ou défense d'un droit en justice | Toutes les catégories pertinentes pour le litige concerné | Art. 6, par. 1, let. f GDPR (intérêt légitime du responsable de traitement) et, le cas échéant, art. 9, par. 2, let. f GDPR |
| Traitement des données des patients pour le compte du médecin client responsable de traitement (gestion du dossier médical, archivage des prestations, dictée des comptes-rendus) | Données anagraphiques des patients, données relatives à la santé, photographies cliniques, consentements informés | Pour le médecin responsable : art. 6, par. 1, let. b GDPR et art. 9, par. 2, let. h GDPR (finalités de médecine préventive, diagnostic, assistance ou thérapie sanitaire). Pour Fibonacci : art. 28 GDPR en qualité de sous-traitant, selon les instructions documentées dans le DPA |

La communication des données pour les finalités contractuelles, administratives et de sécurité est nécessaire à la fourniture du service. Le refus entraîne l'impossibilité de fournir le service. Le consentement aux communications promotionnelles est en revanche facultatif et révocable à tout moment, sans préjudice pour la relation contractuelle et pour le traitement déjà effectué sur la base du consentement précédemment donné.

## 5. Modalités de traitement et mesures de sécurité

Le traitement est effectué à l'aide d'outils électroniques, conformément au principe d'intégrité et de confidentialité visé à l'art. 5, par. 1, let. f GDPR et en adoptant les mesures techniques et organisationnelles appropriées conformément aux art. 24, 25 et 32 GDPR. En particulier :

- chiffrement des données cliniques et des photographies cliniques au repos avec l'algorithme AES-256 ;
- protection du trafic en transit via TLS 1.3 avec des suites de chiffrement modernes ;
- authentification à deux facteurs obligatoire via TOTP pour l'accès des médecins utilisateurs au logiciel ;
- registre d'audit immuable au format FHIR AuditEvent avec chaîne de hachage cryptographique pour garantir l'intégrité et la non-répudiation des opérations ;
- compartimentation logique et cryptographique des données pour chaque cabinet ou structure de santé cliente, de sorte que chaque médecin responsable n'ait accès qu'aux données de son propre périmètre ;
- politique de mots de passe robustes et blocage progressif du compte en cas de tentatives répétées d'accès non autorisé ;
- sauvegarde quotidienne chiffrée des données avec une rétention de 30 jours et procédures de reprise après sinistre ;
- localisation de l'infrastructure primaire sur le territoire de l'Union européenne, dans des centres de données en Allemagne ;
- exécution périodique de tests de sécurité, d'analyses de vulnérabilités et de révisions de code par du personnel qualifié ;
- formation du personnel autorisé au traitement et adoption d'accords de confidentialité ;
- registres des activités de traitement conformément à l'art. 30 GDPR.

Les données ne sont accessibles qu'au personnel de Fibonacci autorisé et formé en qualité de personne désignée pour le traitement conformément à l'art. 29 GDPR et à l'art. 2-quaterdecies du Code de la Protection des Données.

## 6. Sous-traitants et destinataires des données

Pour l'exécution d'activités techniques spécifiques, le responsable de traitement fait appel aux sous-traitants suivants, désignés conformément à l'art. 28, par. 4 GDPR avec des accords écrits contenant des garanties suffisantes en matière de protection des données personnelles :

| Sous-traitant | Siège | Activité confiée |
| --- | --- | --- |
| Aruba S.p.A. | Italie | Hébergement de l'infrastructure applicative et de la base de données, conservation des sauvegardes chiffrées |
| Hostinger International Ltd | Chypre | Envoi des emails transactionnels (notifications de service, premier accès, confirmations) et DNS autoritatif du domaine |
| Mistral AI SAS | France | Service de transcription audio Voxtral utilisé pour la dictée assistée. L'audio est transmis en mode transitoire, n'est pas persisté ni utilisé pour entraîner des modèles, conformément aux accords contractuels spécifiques |
| Stripe Payments Europe Ltd | Irlande | Gestion technique des abonnements, des paiements récurrents et des données de facturation. Stripe ne reçoit pas de données sanitaires ni de données des patients |

La liste mise à jour des sous-traitants est publiée et maintenue dans la section documentaire réservée aux médecins clients. Toute modification ou ajout est notifié avec un préavis suffisant conformément au DPA.

Les données peuvent également être communiquées à :

- des consultants professionnels (experts-comptables, avocats, auditeurs) désignés comme sous-traitants ou responsables autonomes, dans les limites des prestations fournies ;
- des autorités judiciaires, de sécurité publique, de surveillance ou des administrations publiques, sur demande légitime et dans les cas prévus par la loi ;
- des tiers dans le cadre d'opérations extraordinaires (fusions, acquisitions, cessions de branches d'activité), après information des personnes concernées.

Les données ne font en aucun cas l'objet d'une diffusion.

## 7. Transferts de données en dehors de l'Union européenne

L'infrastructure applicative et les bases de données sont hébergées entièrement au sein de l'Union européenne, sur l'infrastructure d'Aruba S.p.A. sur le réseau italien. Les données sanitaires des patients ne sont pas transférées en dehors de l'Union européenne.

**Aucun intermédiaire n'est interposé entre le navigateur et le backend.** Le domaine du site et celui de l'application résolvent directement sur l'adresse de l'infrastructure : aucun réseau de distribution de contenu, proxy inverse de tiers ou pare-feu d'applications web gérés par des tiers ne sont utilisés, et il n'existe aucun point où un sujet différent du responsable de traitement termine la connexion chiffrée. N'importe qui peut le vérifier de l'extérieur, sans demander notre consentement, avec une interrogation DNS sur le domaine.

Le seul sous-traitant de la chaîne avec des répliques de résilience en dehors de l'Union européenne est le fournisseur des paiements, qui **ne traite pas de données sanitaires ni de données des patients**. Pour ce flux, le transfert est régi par les Clauses Contractuelles Types adoptées par la Commission européenne avec la Décision d'exécution (UE) 2021/914 du 4 juin 2021, intégrées par des mesures supplémentaires conformes aux recommandations de l'EDPB.

Une copie des Clauses Contractuelles Types et de l'évaluation d'impact sur les transferts (Transfer Impact Assessment) correspondante est disponible sur demande en écrivant à {EMAIL_PRIVACY}.

## 8. Durée de conservation

Les données personnelles sont conservées pendant la durée strictement nécessaire aux finalités pour lesquelles elles ont été collectées, conformément au principe de limitation de la conservation visé à l'art. 5, par. 1, let. e GDPR. Les délais spécifiques sont indiqués dans le tableau suivant.

| Catégorie de données | Durée de conservation |
| --- | --- |
| Données anagraphiques et professionnelles du médecin client | Durée du contrat et 10 années supplémentaires après la cessation, pour les besoins de respect des obligations civiles, fiscales et comptables (art. 2220 c.c. et DPR 600/1973) |
| Données de facturation et de paiement | 10 ans à partir de l'émission du document comptable, conformément à la réglementation fiscale |
| Journaux d'accès et journaux d'audit de sécurité | 10 ans, conformément aux dispositions du Garante en matière d'administrateurs de système et aux besoins de preuve en cas de litige |
| Données de navigation et journaux applicatifs non liés à la sécurité | 12 mois, sauf nécessité de conservation pour la constatation d'abus ou pour des besoins défensifs |
| Cookies techniques de session | Durée de la session de navigation |
| Cookies analytiques (en présence de consentement) | Période indiquée dans la Cookie Policy, en tout état de cause ne dépassant pas 12 mois |
| Données collectées via les formulaires de démonstration de clients potentiels | 24 mois à partir du dernier contact ; si aucun contrat n'est conclu pendant cette période, les données sont supprimées. Suppression anticipée sur demande de la personne concernée |
| Données relatives à l'inscription à la newsletter | Jusqu'à révocation du consentement, en tout état de cause pas au-delà de 24 mois à partir de la dernière interaction |
| Communications avec le service client | 24 mois à partir de la clôture de la demande, sauf besoins défensifs |
| Données des patients traitées pour le compte du médecin client responsable de traitement | Conservées selon les instructions du médecin responsable documentées dans le DPA. Le délai de référence général pour les dossiers médicaux ambulatoires est de 20 ans, sous réserve de dispositions différentes du responsable et des obligations légales spécifiques (par exemple, des délais plus longs pour la radiologie ou pour les dossiers hospitaliers). À la cessation du contrat, les données sont restituées au médecin responsable ou supprimées conformément aux dispositions du DPA |

À l'expiration des délais indiqués, les données sont supprimées ou rendues anonymes de manière irréversible, sous réserve de l'obligation de conservation pour des raisons légales ou pour des besoins de protection juridictionnelle.

## 9. Droits de la personne concernée

La personne concernée peut exercer à tout moment les droits reconnus par les art. 15-22 GDPR, et en particulier :

- droit d'accès (art. 15 GDPR) : obtenir la confirmation de l'existence d'un traitement et recevoir une copie des données personnelles ;
- droit de rectification (art. 16 GDPR) : obtenir la correction des données inexactes ou l'intégration des données incomplètes ;
- droit à l'effacement (art. 17 GDPR) : obtenir l'effacement des données qui ne sont plus nécessaires, sous réserve des limites prévues par la loi, y compris les obligations de conservation des documents médicaux et fiscaux ;
- droit à la limitation du traitement (art. 18 GDPR) : dans les cas prévus par la réglementation ;
- droit à la portabilité (art. 20 GDPR) : recevoir dans un format structuré, couramment utilisé et lisible par un dispositif automatique les données personnelles fournies, et obtenir leur transmission directe à un autre responsable lorsque cela est techniquement possible. Pour les médecins clients, une fonction d'exportation au format ZIP avec des données FHIR R4 est disponible ;
- droit d'opposition (art. 21 GDPR) : s'opposer à tout moment au traitement fondé sur l'intérêt légitime ou le marketing direct ;
- droit de révocation du consentement (art. 7, par. 3 GDPR) : révoquer à tout moment les consentements donnés, sans préjudice de la licéité du traitement effectué avant la révocation ;
- droit de ne pas être soumis à des décisions automatisées (art. 22 GDPR) : aucune décision produisant des effets juridiques ou significatifs n'est prise exclusivement sur une base automatisée. Les fonctions de dictée et d'assistance par IA jouent un rôle de soutien au professionnel de santé, qui conserve une pleine autonomie décisionnelle.

Les demandes peuvent être adressées au responsable de traitement aux coordonnées suivantes :

- email du responsable : {EMAIL_PRIVACY}
- email : {EMAIL_PRIVACY}

Le responsable de traitement répond dans un délai de 30 jours à compter de la réception de la demande. Ce délai peut être prolongé de 60 jours supplémentaires en cas de complexité particulière de la demande ou d'un nombre élevé de demandes, avec motivation communiquée à la personne concernée. La réponse est gratuite ; le responsable de traitement se réserve le droit de demander une contribution aux frais ou de refuser la demande en cas de demandes manifestement infondées ou excessives, conformément à l'art. 12, par. 5 GDPR.

Les patients des médecins clients doivent adresser leurs demandes au médecin responsable de traitement, qui reste leur interlocuteur principal. Le responsable Fibonacci, en qualité de sous-traitant, apporte une assistance rapide au médecin pour donner suite à ces demandes, conformément à l'art. 28, par. 3, let. e GDPR.

## 10. Violation de données

En cas de violation de données personnelles, le responsable de traitement évalue le risque pour les droits et libertés des personnes concernées et adopte les mesures nécessaires pour contenir et remédier à la violation. Conformément à l'art. 33 GDPR, la violation est notifiée à l'Autorité Garante pour la protection des données personnelles dans les 72 heures suivant sa découverte, sauf si la violation est peu susceptible de présenter un risque pour les droits et libertés des personnes physiques.

Conformément à l'art. 34 GDPR, lorsque la violation est susceptible de présenter un risque élevé pour les droits et libertés des personnes concernées, le responsable de traitement communique la violation directement aux personnes concernées sans retard injustifié, en utilisant un langage clair et en fournissant les indications utiles pour se protéger des conséquences possibles.

Dans le cas où la violation concerne des données de patients traitées pour le compte du médecin client responsable de traitement, Fibonacci, en qualité de sous-traitant, notifie sans retard injustifié la violation au médecin responsable, en fournissant les informations nécessaires pour lui permettre de s'acquitter de ses obligations de notification conformément aux art. 33 et 34 GDPR, selon les dispositions du DPA.

## 11. Réclamation auprès de l'Autorité de contrôle

La personne concernée qui estime que le traitement de ses données personnelles est effectué en violation du GDPR a le droit d'introduire une réclamation auprès de l'Autorité de contrôle compétente, conformément à l'art. 77 GDPR. En Italie, l'Autorité de contrôle est le Garante per la protezione dei dati personali, dont les coordonnées sont les suivantes :

Garante per la protezione dei dati personali
Piazza Venezia 11, 00187 Roma
Site web : www.garanteprivacy.it
Email : protocollo@gpdp.it
PEC : protocollo@pec.gpdp.it

Le droit d'introduire un recours juridictionnel conformément à l'art. 79 GDPR et aux art. 140-bis et suivants du Code de la Protection des Données reste réservé.

## 12. Cookies

Le site Fibonacci utilise des cookies techniques nécessaires au bon fonctionnement du site et, avec ton consentement exprès, des cookies analytiques et de tiers. Pour plus de détails sur les types de cookies utilisés, leurs finalités et les modalités de gestion des préférences, nous te renvoyons à la Cookie Policy disponible à la page /cookie.

## 13. Mineurs

Le service Fibonacci est destiné aux professionnels de santé majeurs, titulaires des qualifications professionnelles requises par la législation italienne. Le site institutionnel et la zone de souscription au logiciel ne s'adressent pas aux mineurs de moins de 18 ans. Le responsable de traitement ne collecte pas sciemment de données de mineurs dans le cadre de ses relations avec les médecins clients.

Si un patient du médecin client est un mineur, la collecte et le traitement des données sont effectués sous la responsabilité du médecin responsable, qui veille à obtenir le consentement du parent ou du tuteur légal selon les modalités prévues par la réglementation sanitaire et par le D.Lgs. 101/2018. Fibonacci met à la disposition du médecin responsable les outils techniques pour la gestion du consentement parental.

## 14. Modifications de la notice

La présente notice peut être mise à jour à tout moment pour refléter les modifications législatives, les évolutions du service ou les changements dans l'organisation du responsable de traitement. La version en vigueur est toujours publiée sur le site Fibonacci/privacy avec l'indication de la date de la dernière révision.

Les modifications substantielles, entendues comme des modifications ayant un impact significatif sur les finalités du traitement, les bases juridiques, les sous-traitants ou les droits des personnes concernées, sont notifiées par email aux utilisateurs enregistrés et signalées de manière visible dans l'espace réservé, avec un préavis suffisant avant l'entrée en vigueur des modifications.

L'utilisation du service après la publication des modifications vaut acceptation de celles-ci, sans préjudice du droit de rétractation et des droits de la personne concernée.

## 15. Dernière révision

Date de dernière révision : {ULTIMA_REVISIONE}
Version du document : 0.1 (ébauche interne)

> Avertissement final : le présent document constitue un modèle adapté au contexte du service Fibonacci et sera soumis à une révision juridique avant le début des activités commerciales. La version publiée ici est une ébauche interne numérotée 0.1 et ne remplace pas l'avis d'un conseiller juridique qualifié. Toute observation, correction ou intégration pourra être adressée à {EMAIL_PRIVACY}.
