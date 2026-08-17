> **Traduction de courtoisie.** En cas de divergence, la version italienne de ce document fait foi.

# Sécurité et protection des données

**Version 0.2 · Dernière révision : {ULTIMA_REVISIONE}**

{AVVISO_BOZZA}

La présente fiche technique décrit les mesures de sécurité, techniques et organisationnelles, adoptées par Fibonacci (ci-après, « Fibonacci » ou le « Responsable du traitement ») dans le cadre de la fourniture du logiciel SaaS de dossier médical numérique Fibonacci (ci-après, le « Service » ou « Fibonacci »). Ce document est établi conformément à l'article 32 du Règlement (UE) 2016/679 (ci-après, « GDPR ») et constitue l'Annexe A de l'Accord de Traitement des Données (DPA) signé par le médecin client en qualité de Titulaire du traitement. Les mesures décrites s'appliquent au traitement des catégories particulières de données visées à l'art. 9 GDPR (données relatives à la santé) effectué pour le compte du Titulaire dans le cadre du Service.

Ce document est publié à l'adresse {URL_SITO}/sicurezza et fait l'objet de mises à jour périodiques en fonction de l'évolution technologique du Service et de l'état de l'art en matière de cybersécurité. Les modifications techniques significatives sont notifiées aux Titulaires clients selon les modalités indiquées en bas du présent document.

---

## 1. Architecture de sécurité

L'architecture de sécurité de Fibonacci est structurée sur trois niveaux concentriques, chacun mettant en œuvre des contrôles indépendants et complémentaires. La logique de défense repose sur la profondeur (defense in depth) : la défaillance d'un seul niveau n'est pas suffisante pour compromettre la confidentialité, l'intégrité ou la disponibilité des données cliniques.

### 1.1 Niveau réseau (périmètre)

Le périmètre réseau est hébergé au sein de l'infrastructure d'Aruba S.p.A., sur un réseau italien et donc au sein de l'Union européenne. Le trafic entrant transite exclusivement par un reverse proxy Caddy qui termine TLS 1.3 et applique les en-têtes de sécurité HTTP décrits à la section 6. Le backend applicatif n'est pas exposé directement à l'Internet public : les conteneurs Docker communiquent sur un réseau privé, et l'accès administratif aux hôtes est autorisé exclusivement depuis des adresses IP autorisées via clé SSH, sans authentification par mot de passe.

**Aucun intermédiaire réseau n'est interposé.** Le domaine du Service résout directement vers l'adresse de l'infrastructure décrite ci-dessus : aucun réseau de distribution de contenu, proxy inverse tiers ou Web Application Firewall géré par un tiers n'est utilisé, et il n'existe aucun point où un sujet différent du Responsable termine la connexion chiffrée provenant du navigateur. Cette circonstance est vérifiable de l'extérieur par une interrogation DNS sur le domaine du Service.

### 1.2 Niveau applicatif

Au niveau applicatif, Fibonacci implémente une authentification multi-facteurs, une session renforcée, un contrôle d'accès basé sur les rôles (RBAC) et un cloisonnement FHIR par tenant médical. Chaque requête est validée par un middleware de sanitisation de l'input côté serveur, un contrôle CSRF et un rate limiting par utilisateur et par adresse IP. La logique applicative est écrite dans des langages à typage fort et suit les pratiques de développement sécurisé décrites à la section 7.

### 1.3 Niveau des données

Au niveau des données, Fibonacci applique un chiffrement sur deux axes : chiffrement du système de fichiers au niveau volume pour l'ensemble de l'instance PostgreSQL et chiffrement applicatif AES-256 GCM pour les colonnes contenant des identifiants sensibles et pour les fichiers photo. Les clés de chiffrement applicatives (Key Encryption Keys, KEK) sont gérées côté serveur et ne transitent jamais vers le navigateur du médecin utilisateur. Chaque opération CRUD sur les ressources cliniques est tracée dans un audit log immuable au format FHIR AuditEvent signé en hash-chain SHA-256 (section 4).

### 1.4 Diagramme de flux simplifié

```
                              TLS 1.3, sans intermédiaires
   [Navigateur médecin]  ----------------------------------->  [Caddy reverse proxy / Aruba IT]
                       (cookie httpOnly Secure)                     |
                                                                    |  réseau privé
                                                                    v
                                                       [Conteneur app Fibonacci]
                                                                    |
                                       +----------------------------+----------------------------+
                                       |                            |                            |
                                       v                            v                            v
                              [PostgreSQL chiffré]      [Stockage photos AES-256]         [Audit log hash-chain]
                                       |
                                       v
                                  [Sauvegarde quotidienne chiffrée AES-256]
```

---

## 2. Chiffrement

Le chiffrement est la principale mesure d'atténuation du risque d'exfiltration et d'accès non autorisé aux données. Fibonacci applique un chiffrement en transit, un chiffrement au repos du système de fichiers et un chiffrement applicatif par colonne et des payloads binaires.

| Composant | Que fait-il (WHAT) | Risque atténué (WHY) | Technologie et paramètres (HOW) |
| --- | --- | --- | --- |
| Transport client-serveur | Chiffre l'intégralité de la communication entre le navigateur du médecin et le backend | Interception sur le réseau, attaques man-in-the-middle | TLS 1.3 avec cipher suite AEAD recommandées IETF, HSTS preload, Forward Secrecy via ECDHE |
| Système de fichiers de la base de données | Chiffre au niveau bloc le volume de la base de données PostgreSQL | Exfiltration physique des disques, accès non autorisé au volume | Chiffrement du système de fichiers au niveau volume avec clés gérées par le système hôte, dérivées d'une master key non résidente sur l'instance |
| Chiffrement applicatif par colonnes | Chiffre au niveau applicatif les champs les plus sensibles du dossier avant l'écriture dans la base de données | Exfiltration de la base de données, accès par des opérateurs de l'infrastructure | AES-256 GCM avec intégrité garantie par l'auth-tag, nonce unique par enregistrement, KEK côté serveur |
| Chiffrement des photos cliniques | Chiffre les fichiers binaires des photos avant le stockage | Exfiltration du stockage d'objets, accès non autorisé aux fichiers | AES-256 GCM avec KEK gérée par le sidecar pdf-signer, déchiffrement on-demand côté serveur au moment de la livraison autorisée |
| Sauvegarde | Chiffre le paquet de sauvegarde avant le transfert hors site | Exfiltration de la sauvegarde, perte d'un support | AES-256 sur le paquet de snapshot, clé séparée de la KEK applicative |

### 2.1 Gestion des clés

Les clés de chiffrement applicatives (Key Encryption Keys) sont détenues côté serveur et ne sont jamais exposées au navigateur du médecin utilisateur. La dérivation des Data Encryption Keys (DEK) pour chaque enregistrement se fait en mémoire sur le backend au moment de l'opération d'écriture ou de lecture. Les clés ne sont pas incluses dans les sauvegardes dans le même paquet que les données chiffrées. La rotation des KEK est une procédure documentée et re-chiffre de manière incrémentale les données existantes sans interruption du service.

### 2.2 Intégrité

Le mode GCM (Galois/Counter Mode) garantit simultanément confidentialité et intégrité. L'auth-tag vérifie que le payload n'a pas été altéré et rejette toute tentative de manipulation du ciphertext. Cette propriété est particulièrement pertinente pour les photos cliniques, où la modification d'un seul bit invaliderait la valeur probante de la donnée.

---

## 3. Contrôle d'accès et authentification

L'identité numérique est la principale surface d'attaque d'une application médicale en cloud. Fibonacci adopte une authentification multi-facteurs, un hachage robuste des mots de passe, une session renforcée et un cloisonnement du domaine des données basé sur les rôles et sur FHIR.

### 3.1 Authentification

| Mesure | WHAT | WHY | HOW |
| --- | --- | --- | --- |
| Hachage des mots de passe | Ne stocke que le digest non réversible du mot de passe | Exfiltration de la base de données utilisateurs, brute force offline | bcrypt avec cost factor calibré en fonction de la charge, salt aléatoire par utilisateur |
| MFA TOTP | Requiert un second facteur à la connexion | Vol de credentials, réutilisation de mots de passe compromis, phishing | RFC 6238 TOTP à 30 secondes, obligatoire pour les rôles admin, recommandé et activable par le médecin pour son propre compte |
| Recovery codes | Permet la récupération du compte en l'absence du dispositif TOTP | Perte du dispositif, lock-out utilisateur | Codes à usage unique générés lors de la configuration MFA, hash-only en base de données, invalidés après utilisation |
| Rate limiting login | Bloque les tentatives automatisées | Brute force, credential stuffing | Throttling par IP et par utilisateur sur les endpoints login, MFA verify et dictée |

### 3.2 Session

Les sessions utilisateur sont gérées au moyen de cookies httpOnly, Secure et SameSite=Strict. L'attribut httpOnly empêche l'accès au cookie depuis JavaScript côté client, réduisant l'impact de potentielles vulnérabilités XSS. L'attribut Secure force la transmission uniquement sur TLS. L'attribut SameSite=Strict atténue les classes d'attaques de type cross-site request forgery et cross-site leak. Le token de session est soumis à rotation : chaque élévation de privilège (connexion, changement de mot de passe, activation MFA) émet un nouvel identifiant et invalide le précédent.

### 3.3 RBAC et cloisonnement

L'accès aux ressources cliniques est régi par un modèle RBAC avec les rôles minimaux suivants :

| Rôle | Capacités typiques |
| --- | --- |
| admin | Configuration de l'organisation, gestion des utilisateurs, accès au panneau d'audit, aucun accès clinique par défaut |
| médecin | Accès complet à ses propres patients, création de dossiers, dictée, signature de consentements |
| secrétariat | Accès aux données administratives et à l'agenda, accès clinique limité selon la politique du Titulaire |
| utilisateur | Profil minimal, accès self-service à sa propre configuration |

Au-dessus du modèle RBAC opère le cloisonnement FHIR via AccessPolicy Medplum : chaque médecin est isolé sur ses propres patients, les requêtes FHIR sont filtrées au niveau serveur et toute tentative de lecture cross-tenant retourne un refus, enregistré dans l'audit log. Le cloisonnement est la principale mesure d'atténuation du risque de lateral movement et d'accès non autorisé entre cabinets médicaux distincts partageant la même instance.

---

## 4. Intégrité et traçabilité

Pour les applications médicales, l'intégrité des données est fonctionnelle à leur valeur probante et clinique. Fibonacci implémente un audit log immuable au format FHIR AuditEvent avec concaténation cryptographique des entrées (hash-chain).

### 4.1 Audit log

Chaque opération CRUD sur les ressources FHIR (Patient, Encounter, Observation, Condition, MedicationStatement, DocumentReference, Consent, ImagingStudy et autres) génère une entrée AuditEvent contenant :

- identifiant de l'acteur (médecin, rôle, session) ;
- timestamp UTC haute résolution ;
- type d'action (create, read, update, delete, sign) ;
- référence à la ressource concernée ;
- résultat (success, failure) et raison du refus éventuel ;
- adresse IP d'origine et user agent.

### 4.2 Hash-chain

Chaque entrée d'audit incorpore le digest SHA-256 de l'entrée précédente, construisant une chaîne de hachage analogue à un registre append-only. Toute manipulation rétroactive d'une entrée intermédiaire provoquerait la rupture de la chaîne et serait détectable par vérification déterministe du registre. Le digest de la dernière entrée est exportable comme preuve d'intégrité périodique.

### 4.3 Accès et rétention

L'audit log est accessible au Titulaire via la section /audit de l'espace réservé, avec des filtres par acteur, ressource et fenêtre temporelle. La conservation est de dix ans à partir de l'événement, en cohérence avec l'obligation de conservation de la documentation médicale. À l'expiration, l'enregistrement est supprimé de manière sécurisée ou anonymisé selon les instructions du Titulaire.

---

## 5. Disponibilité et sauvegardes

La continuité d'accès aux données cliniques est une propriété de sécurité au même titre que la confidentialité et l'intégrité, et fait l'objet spécifique de l'art. 32 par. 1 lett. b et c GDPR.

| Mesure | WHAT | WHY | HOW |
| --- | --- | --- | --- |
| Sauvegarde quotidienne | Sauvegarde d'un snapshot quotidien de la base de données et des stockages | Perte de données due à un incident, ransomware, erreur opérationnelle | Snapshot chiffré AES-256, généré pendant une fenêtre nocturne à faible charge |
| Rétention 30 jours | Conserve 30 versions rolling de la sauvegarde | Exfiltration lente, corruption non immédiatement détectée | Conservation des paquets chiffrés avec rotation à 30 jours |
| Archivage continu des logs de transaction | Permet la restauration à un instant précis et non seulement au dernier snapshot nocturne | Perte des heures suivant la dernière sauvegarde | Archivage des Write-Ahead Log, travail planifié toutes les 5 minutes |
| RPO 24h | Définit le point maximal de perte de données acceptable | Contrainte de planification de la sauvegarde | Garanti par la fréquence de sauvegarde quotidienne |
| RTO 24h | Définit le temps maximal de restauration du service | Contrainte de planification du disaster recovery | Procédure de restauration documentée, testée trimestriellement avec mesure du temps de récupération |

### 5.1 Copie hors site : limite déclarée

⚠️ **À la date de cette révision, la copie de sécurité réside sur la même machine que celle protégée.** Le système de réplication auprès d'un fournisseur tiers est installé et actif (le travail planifié s'exécute, et en l'absence d'une destination configurée, il le enregistre explicitement dans ses logs), mais la destination distante n'a pas encore été achetée et configurée. La conséquence doit être énoncée clairement : **aujourd'hui, la perte du fournisseur d'hébergement entraînerait la perte du système et de sa copie simultanément.**

Cette limite est déclarée ici, et non dans une note de bas de page, car c'est précisément le type d'information qu'un Titulaire doit connaître **avant** de confier des données à un Responsable, et parce que la copie hors site fait l'objet spécifique de l'art. 32 par. 1 lett. c) GDPR. La destination distante sera un fournisseur **différent** de celui qui héberge l'infrastructure primaire, et situé dans l'Union européenne : une copie conservée par le même fournisseur n'est pas une copie hors site.

Le présent paragraphe sera remplacé par la description de la mesure active lorsque celle-ci sera en service et vérifiée.

### 5.2 Tests de restauration

Trimestriellement, un test de restauration complet est effectué à partir de la sauvegarde la plus récente, sur une instance hors production, en vérifiant l'intégrité des données restaurées et le temps effectif de récupération. Le résultat du test est enregistré et conservé à des fins de preuve conformément à l'art. 32 par. 1 lett. d GDPR (procédure pour tester, vérifier et évaluer régulièrement l'efficacité des mesures techniques et organisationnelles).

---

## 6. Hardening applicatif

Fibonacci adopte une configuration de hardening du front-end et du back-end visant à réduire la surface d'attaque des classes OWASP Top 10 les plus pertinentes pour les applications web.

| Contrôle | WHAT | WHY | HOW |
| --- | --- | --- | --- |
| Content Security Policy strict | Limite les sources autorisées pour les scripts, styles, images et connexions | Cross-site scripting, exfiltration de données | CSP strict sans inline script, allowlist explicite des seules origines nécessaires |
| HSTS preload | Force le navigateur à contacter le domaine uniquement via HTTPS, même lors du premier accès | Downgrade vers HTTP, attaques sur Wi-Fi non sécurisé | En-tête Strict-Transport-Security avec max-age élevé et flag preload, domaine inscrit dans la preload list |
| X-Frame-Options DENY | Interdit l'inclusion du Service dans des iframes externes | Clickjacking, UI redress | En-tête X-Frame-Options: DENY sur chaque réponse du backend applicatif |
| X-Content-Type-Options nosniff | Désactive le MIME sniffing du navigateur | Exécution de contenus en tant que types différents de celui déclaré | En-tête X-Content-Type-Options: nosniff |
| Permissions-Policy | Désactive les API navigateur non nécessaires (géolocalisation, microphone lorsque non requis, USB, serial, payment) | Réduction de la surface d'attaque côté client | Permissions-Policy restrictive, activation explicite uniquement là où la fonction le nécessite (ex. microphone uniquement sur la page de dictée) |
| CSRF token | Protège les requêtes mutantes de leur émission cross-origin | Cross-site request forgery | Token CSRF par session, validation côté serveur sur chaque POST, PUT, PATCH, DELETE |
| Rate limiting | Limite la fréquence des requêtes sur les endpoints sensibles | Brute force, scraping, abus de services à coût (dictée) | Limites différenciées par IP et par utilisateur sur les endpoints login, MFA verify, dictée, exportation massive |
| Sanitisation des inputs | Valide et normalise chaque input avant utilisation | Injection (SQL, NoSQL, commande), XSS réfléchi, path traversal | Validation basée sur schéma côté serveur, requêtes paramétrées vers la base de données, escaping context-aware des outputs |

---

## 7. Développement sécurisé (Secure SDLC)

La sécurité est intégrée dans le cycle de développement du logiciel (Security by Design ex art. 25 GDPR) par le biais de contrôles automatiques et de revues humaines à chaque modification du code.

| Phase | Contrôle | WHY | HOW |
| --- | --- | --- | --- |
| Pre-merge | Revue de code obligatoire | Défauts logiques, régressions de sécurité | Au moins un relecteur distinct de l'auteur approuve chaque pull request |
| Pre-merge | Analyse statique SAST | Vulnérabilités de pattern (injection, bypass d'authentification, fuite de secrets) | Semgrep et CodeQL exécutés sur chaque pull request, blocage du merge en cas de finding High ou Critical |
| Pre-merge | Analyse des dépendances | Vulnérabilités des bibliothèques tierces, supply chain | npm audit et Dependabot actifs, alertes automatiques pour les CVE hautes et critiques, mise à jour rapide |
| Pre-merge | Tests E2E | Régressions fonctionnelles sur les flux critiques | Suite Playwright sur les flux de login, MFA, création de dossier, dictée, consentement, export |
| Post-deploy | Pen test OWASP ZAP baseline | Vulnérabilités de runtime et de configuration | Exécution mensuelle sur l'environnement de production, triage et remédiation des findings non faux positifs |
| Continu | Formation de l'équipe | Erreurs dues à la désinformation, dérive des pratiques | Formation annuelle GDPR + sécurité applicative, participation à la communauté OWASP, security champion désigné |

Les secrets de production (clés, tokens, mots de passe de service) sont gérés via un secret manager de l'infrastructure, ne sont jamais présents dans le code source et sont rotés périodiquement ou suite à toute suspicion d'exposition.

---

## 8. Gestion des incidents et violation de données

Fibonacci adopte une procédure documentée de réponse aux incidents qui définit les rôles, les seuils d'escalade, les délais de notification et les modalités de communication avec le Titulaire.

### 8.1 Notification au Titulaire

En cas de violation de données personnelles au sens de l'art. 4 n. 12 GDPR impliquant des données traitées pour le compte du Titulaire, Fibonacci notifie le Titulaire de l'événement dans un délai de **24 heures suivant sa découverte**. Ce délai est plus strict que le délai minimal de « sans retard injustifié » prévu par l'art. 33 par. 2 GDPR pour le Responsable du traitement, et vise à fournir au Titulaire une marge suffisante par rapport aux 72 heures prévues par l'art. 33 par. 1 pour sa éventuelle notification à l'Autorité de contrôle.

La notification au Titulaire inclut, dans la mesure disponible au moment de la communication initiale :

- description de la nature de la violation ;
- catégories et nombre approximatif de personnes concernées et d'enregistrements impliqués ;
- conséquences probables ;
- mesures techniques et organisationnelles adoptées ou proposées pour contenir l'incident ;
- point de contact opérationnel au sein de Fibonacci.

Les informations manquantes au moment de la première notification sont transmises au Titulaire de manière incrémentale dès qu'elles sont disponibles, conformément aux Lignes directrices EDPB 9/2022.

### 8.2 Escalade et coopération

La procédure interne prévoit l'activation immédiate d'un incident manager, l'isolement de l'actif concerné, la conservation des preuves forensiques et l'ouverture d'un registre d'incident. Fibonacci coopère activement avec le Titulaire dans l'évaluation du risque pour les personnes concernées et dans la préparation de l'éventuelle notification à l'Autorité ou aux personnes concernées. À la clôture de l'incident, un post-mortem est rédigé et partagé avec le Titulaire, contenant la timeline, la root cause, les actions de remédiation mises en œuvre et les actions correctives à long terme (lessons learned).

### 8.3 Registre

Tous les incidents, indépendamment de leur qualification finale comme violation notifiable, sont enregistrés dans le registre interne des incidents, conservé à des fins d'audit et de preuve conformément à l'art. 33 par. 5 GDPR.

---

## 9. Transferts internationaux

Pour le traitement des données de santé des patients, Fibonacci n'effectue aucun transfert en dehors de l'Union européenne. L'ensemble de la stack applicative, la base de données, le stockage des photos et les sauvegardes résident au sein de l'infrastructure d'Aruba S.p.A., sur un réseau italien.

### 9.1 Absence d'intermédiaires extra-européens sur le parcours des données

Le parcours que suivent les données cliniques entre le navigateur du médecin et la base de données **ne traverse aucun sujet extra-européen**, et ce par construction et non par configuration : aucun réseau de distribution de contenu, proxy inverse tiers ou Web Application Firewall géré par un tiers n'est utilisé. Le domaine du Service résout directement vers l'adresse de l'infrastructure, et la connexion chiffrée est terminée uniquement par le reverse proxy du Responsable.

La différence par rapport à l'architecture répandue dans le secteur doit être mentionnée car c'est la raison pour laquelle ce paragraphe est bref : lorsqu'un intermédiaire est présent, le transfert extra-UE des métadonnées réseau existe et doit être justifié par des Clauses Contractuelles Types et des mesures supplémentaires. Ici, **le transfert n'existe pas**, donc il n'est pas nécessaire de le justifier. Cette circonstance est vérifiable par quiconque, de l'extérieur et sans notre consentement, par une interrogation DNS sur le domaine du Service.

### 9.2 Transferts résiduels et leur périmètre

Le seul sous-responsable de la chaîne avec des répliques de résilience en dehors de l'Union européenne est le fournisseur des paiements indiqué dans l'Annexe B, qui **ne traite pas les données des patients** ni aucune donnée clinique : la chaîne des paiements est séparée de celle clinique et la réconciliation se fait par identifiant opaque. Pour ce fournisseur, les Clauses Contractuelles Types de la Décision d'exécution (UE) 2021/914 s'appliquent.

### 9.3 Autres sous-responsables extra-UE

D'éventuels autres sous-responsables extra-UE sont autorisés uniquement avec le consentement du Titulaire conformément à ce qui est prévu par le DPA et sont soumis aux mêmes garanties (SCC, mesures supplémentaires, évaluation du risque de transfert).

---

## 10. Continuité opérationnelle

⚠️ **Cette section décrivait une architecture redondée que le Service ne possède pas.** La version précédente déclarait une distribution sur plusieurs zones de disponibilité, plusieurs instances de reverse proxy derrière health check et une réplique en streaming de la base de données avec promotion automatique. Rien de tout cela n'est en service : le Service tourne sur **un seul hôte**, et déclarer une redondance inexistante dans une annexe technique signée est précisément le type d'affirmation que le Titulaire ne peut pas vérifier seul et sur laquelle il a le droit de ne pas être trompé.

Voici l'état réel, distingué entre ce qui est actif et ce qui est prévu.

| Composant | État | WHY | HOW |
| --- | --- | --- | --- |
| Emplacement | **Actif** | Juridiction et loi applicables connues et vérifiables | Hôte unique chez Aruba S.p.A., réseau italien, Union européenne |
| Isolement réseau | **Actif** | Réduction de la surface exposée | Seul le reverse proxy est accessible depuis Internet ; les services applicatifs communiquent sur un réseau privé entre conteneurs |
| Sauvegarde quotidienne | **Actif** | Perte de données due à un incident, erreur opérationnelle, ransomware | Snapshot chiffré nocturne, avec rotation à 30 jours |
| Restauration à un instant précis | **Actif** | Perte des heures suivant le dernier snapshot | Archivage continu des logs de transaction, travail planifié toutes les 5 minutes |
| Preuve de restauration | **Actif** | Une sauvegarde jamais restaurée n'est pas une sauvegarde | Travail planifié de restauration et vérification, avec résultat enregistré |
| Copie hors site | **Prévu** | Perte du fournisseur d'hébergement | Voir la limite déclarée au paragraphe 5.1 : système installé, destination distante non encore activée |
| Redondance de l'hôte | **Prévu** | Tolérance à la panne de la machine unique | Non en service. Une panne de l'hôte entraîne une indisponibilité du Service jusqu'à la restauration |
| Plan de continuité formalisé | **Prévu** | Coordination des actions de restauration | Les procédures de restauration sont documentées et exécutées ; leur formalisation dans un plan approuvé interviendra après la constitution de la société |

---

## 11. Formation et gouvernance

La sécurité technique n'est efficace que si elle est accompagnée d'une gouvernance organisationnelle cohérente. Fibonacci intègre des obligations de formation et des responsabilités définies au sein de sa structure.

| Mesure | WHAT | WHY | HOW |
| --- | --- | --- | --- |
| Formation annuelle | Formation du personnel technique sur le GDPR et la sécurité applicative | Réduction de l'erreur humaine, alignement avec l'état de l'art | Cours annuel obligatoire pour tout le personnel ayant accès aux systèmes traitant des données personnelles, attestation conservée |
| Intégration | Check-list de sécurité pour les nouveaux employés | Alignement initial aux exigences de sécurité | Procédure formalisée avec remise des identifiants, activation MFA, lecture des politiques internes, acceptation du code de conduite |
| Security champion | Point de référence interne pour les questions de sécurité | Désengorgement rapide des questions techniques, escalade interne | Désignation d'un security champion au sein de l'équipe technique |
| Accès au code | Principe du moindre privilège | Réduction du risque d'exfiltration interne | Accès au dépôt et à l'infrastructure accordés par rôle, révision périodique des habilitations |
| Gestion des actifs | Inventaire des actifs informationnels | Connaissance complète du périmètre à protéger | Inventaire mis à jour des systèmes, services, dépendances et flux de données |

---

## 12. Certifications et standards de référence

À ce jour, Fibonacci **n'est pas certifiée ISO/IEC 27001**. En l'absence de certification, Fibonacci adopte volontairement les contrôles applicables de l'Annexe A de la norme ISO/IEC 27001:2022 comme cadre de référence pour sa posture de sécurité, en particulier dans les domaines des contrôles organisationnels, des contrôles des personnes, des contrôles physiques et des contrôles technologiques. Cette référence ne constitue pas une déclaration de conformité certifiée et ne doit pas être interprétée comme un claim de certification.

### 12.0 Ce qui est certifié, et par qui : la distinction qui compte

Les certifications couvrant une partie du Service appartiennent au **fournisseur de l'infrastructure**, et non à Fibonacci. Cette distinction est déclarée ici car c'est celle qu'un fournisseur peu scrupuleux omet, exhibant le label de son hébergeur comme s'il était le sien.

| Niveau | Qui répond | Ce qui est certifié ou déclaré | Comment le vérifier |
| --- | --- | --- | --- |
| Data center et infrastructure | Aruba S.p.A. | Certification **ISO/IEC 27001** ; adhésion au **CISPE Data Protection Code of Conduct**, code de conduite ex **art. 40 GDPR** approuvé par la CNIL en 2021 | Registre public CISPE ; déclarations publiées par le fournisseur |
| Application, données, processus | Fibonacci | **Aucune certification tierce.** Conformité au GDPR autodéclarée sur la base de la documentation interne et des preuves conservées | Le présent document, le DPA et l'Annexe B, tous publics et sans formulaire de demande |

⚠️ **Ce que cela signifie concrètement** : le fait que le data center soit certifié ISO/IEC 27001 dit quelque chose sur la sécurité physique et organisationnelle de la salle des machines, et **rien** sur la qualité du code applicatif de Fibonacci, sur son modèle de contrôle d'accès ou sur sa gestion des clés. Présenter la certification de son hébergeur comme une garantie sur son propre logiciel, c'est répondre à une question différente de celle qui a été posée.

La conformité au GDPR, et en particulier aux principes de sécurité by design et by default (art. 25 GDPR) et aux mesures techniques et organisationnelles adéquates (art. 32 GDPR), est autodéclarée par le Responsable sur la base de la documentation interne et des preuves de processus conservées.

Parmi les autres standards et lignes directrices pris en compte dans la conception des mesures décrites dans le présent document, bien que non soumis à certification, figurent :

- OWASP Top 10 2021 et OWASP Application Security Verification Standard (ASVS) pour les pratiques de développement sécurisé et de hardening applicatif ;
- NIST Special Publication 800-53 pour le vocabulaire des contrôles de sécurité ;
- Lignes directrices EDPB 9/2022 sur la notification des violations de données personnelles.

### 12.1 Feuille de route de certification

Fibonacci a fixé comme objectif l'évaluation du lancement du parcours de certification ISO/IEC 27001 à l'atteinte du premier round consolidé de clients pilotes du Service. L'état d'avancement de la feuille de route est communiqué de manière transparente aux Titulaires clients par le biais de mises à jour périodiques du présent document et, le cas échéant, par des communications dédiées.

### 12.2 Espace européen des données de santé : l'obligation à venir

Le **Règlement (UE) 2025/327** institue l'Espace européen des données de santé (EHDS) et établit un cadre harmonisé pour les **systèmes de dossiers médicaux électroniques**. Le règlement s'applique à compter du **26 mars 2027** ; pour les systèmes destinés au traitement des catégories prioritaires de données de santé électroniques personnelles visées à l'art. 14, par. 1, lettres a), b) et c), les dispositions pertinentes s'appliquent à partir du **26 mars 2029**.

Pour un système de dossiers médicaux électroniques, le cadre prévu par le règlement implique : la rédaction de la **documentation technique** (art. 37), une **fiche d'information** accompagnant le système (art. 38), une **déclaration de conformité UE** par rapport aux exigences essentielles de l'**Annexe II** (art. 39), l'évaluation des composants logiciels harmonisés dans un **environnement numérique européen de test** (art. 40), l'apposition du **marquage CE de conformité** (art. 41) et l'enregistrement dans la **base de données UE** des systèmes de dossiers médicaux électroniques (art. 49).

**Fibonacci n'est pas à ce jour un système marqué CE conformément au Chapitre III du Règlement (UE) 2025/327, et ne le déclare pas.** Le marquage n'est pas encore apposable : les spécifications communes de l'environnement numérique européen de test et le format européen d'échange des dossiers médicaux électroniques sont renvoyés à des actes d'exécution de la Commission.

Ce qui peut être déclaré aujourd'hui est l'état du produit par rapport aux prescriptions de l'Annexe II qui **ne dépendent pas** de ces actes d'exécution :

| Prescription (Annexe II) | État | Preuve |
| --- | --- | --- |
| 2.6 absence de caractéristiques rendant difficile l'exportation autorisée des données pour remplacer le système par un autre produit | **Satisfait** | L'exportation intégrale au format FHIR R4 est une fonction du produit, disponible pour le Titulaire à tout moment et sans autorisation du Responsable |
| 3.1 mécanismes fiables d'identification et d'authentification des professionnels de santé | **Satisfait** | Section 3 du présent document |
| 3.2 et 3.3 enregistrement des accès et outils pour les examiner et les analyser | **Satisfait** | Section 4 : registre FHIR AuditEvent avec concaténation d'empreintes, consultable par le Titulaire avec filtres par acteur, ressource et fenêtre temporelle |
| 3.4 support de périodes de conservation et de droits d'accès différenciés par origine et catégorie de données | **Partiel** | Conservation différenciée active ; la granularité par origine des données est en cours d'extension |
| 2.1, 2.2, 2.3, 2.4 interopérabilité dans le format européen d'échange | **Non applicable à ce stade** | Le format européen d'échange est renvoyé à des actes d'exécution non encore adoptés. Le produit adopte entre-temps FHIR R4, qui est la base technique sur laquelle le format européen est construit |

---

## 13. Contacts opérationnels

| Fonction | Contact |
| --- | --- |
| Sécurité informatique et signalement de vulnérabilités | {EMAIL_SICUREZZA} |
| Contact pour la protection des données | {EMAIL_PRIVACY} |
| Vie privée et questions de traitement des données | {EMAIL_PRIVACY} |

Les signalements de vulnérabilités sont les bienvenus et gérés conformément aux pratiques de responsible disclosure. Il est possible, sur demande du signalant, d'établir un canal chiffré via une clé PGP de l'équipe de sécurité, fournie sur demande. Fibonacci s'engage à fournir un retour initial au signalant dans un délai raisonnable suivant la réception, à ne pas poursuivre légalement les signalements effectués de bonne foi et dans le respect du périmètre indiqué, et à reconnaître publiquement la contribution du signalant sauf demande d'anonymat.

---

## 14. Dernière révision

Dernière révision du présent document : {ULTIMA_REVISIONE}.

> Le présent document a un caractère descriptif et est mis à jour selon la version actuelle du logiciel Fibonacci. Les modifications techniques significatives des mesures de sécurité décrites ici sont notifiées aux Titulaires clients par email à l'adresse de contact indiquée dans le Contrat de Service, avec un préavis raisonnable avant leur entrée en vigueur. Version 0.2.
