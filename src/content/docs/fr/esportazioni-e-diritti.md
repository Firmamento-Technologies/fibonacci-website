# Exportations et droits du patient

Ce guide décrit comment remettre à un patient ses données et comment répondre aux demandes découlant du GDPR. Il s'adresse aux médecins et à ceux qui administrent le cabinet.

Le responsable du traitement est **le cabinet** : les demandes des patients parviennent au médecin, pas à nous. Ce guide explique ce que le système met à disposition pour répondre.

## Les demandes qui peuvent arriver

| Demande | Référence | Ce qui est nécessaire |
|---|---|---|
| « Je veux une copie de mes données » | art. 15 (accès) | exportation de la fiche |
| « Je veux mes données dans un format que je peux emporter ailleurs » | art. 20 (portabilité) | exportation structurée |
| « Corrigez cette donnée » | art. 16 (rectification) | modification dans le dossier, avec historique |
| « Effacez mes données » | art. 17 (effacement) | ⚠️ voir ci-dessous : ce n'est pas automatique |
| « Je révoque mon consentement » | L. 219/2017 art. 1 c. 5 | ⛔ **ce n'est pas ce guide** → [Consentements informés](/manuale/consensi-informati) |

⚠️ **« Révocation » signifie deux choses différentes, et les confondre conduit à faire une erreur.**
Révoquer le **consentement à une prestation** (le document que le patient a signé avant le
traitement) se fait depuis le guide [Consentements informés](/manuale/consensi-informati), et la
conséquence est clinique : interruption du traitement. **Ce n'est pas** une demande d'effacement des
données, et en effet le PDF révoqué **reste archivé** : il sert à démontrer que le consentement existait
lorsque la prestation a été réalisée. Les demandes du tableau ci-dessus concernent en revanche les
données, et pour la documentation clinique s'appliquent les limites de l'art. 17 expliquées ci-dessous.

## Étape 1, exporter la fiche d'un patient

Depuis la fiche du patient, le bouton d'exportation génère un document contenant les données administratives, l'anamnèse, les traitements, les prescriptions, les examens, les consentements et l'historique des accès.

Les **photographies** ne sont pas incluses dans ce document : elles sont chiffrées et leur ouverture est un accès tracé séparément. Elles sont exportées séparément et sont **déchiffrées au moment de la remise**, de sorte que le patient reçoive des images qu'il peut ouvrir : un fichier chiffré illisible ne satisfait pas le droit à la portabilité.

## Étape 2, la demande d'effacement

⚠️ **L'effacement n'est pas automatique, et ne doit pas l'être.** Le droit à l'oubli de l'art. 17 comporte des exceptions, et l'une d'elles concerne précisément ce cas : le paragraphe 3 lettre b) exclut l'effacement lorsque le traitement est nécessaire pour respecter une obligation légale, et la lettre c) lorsqu'il sert à des fins de médecine préventive, de diagnostic et de soins.

En pratique : la documentation clinique doit être conservée pendant la durée où le médecin peut être appelé à répondre de son action. L'effacer sur demande signifierait se priver de la preuve permettant de se défendre, et ce n'est pas une obligation imposée par le GDPR.

⇒ La réponse correcte à une demande d'effacement est motivée, ce n'est ni un refus ni une exécution automatique. Si la demande concerne des données non cliniques (une coordonnée, une note organisationnelle), celles-ci peuvent être effacées.

## Étape 3, si le cabinet ferme ou change de logiciel

La migration suit une procédure spécifique : on exporte tout, on vérifie avoir reçu le paquet, et **uniquement après** on procède à l'effacement. L'ordre n'est pas négociable : l'inverser signifie détruire la seule copie lisible.

Le paquet contient les données structurées et les photographies en clair. ⛔ Il ne contient pas la clé de chiffrement, et ce n'est pas pour notre confidentialité : cette clé ouvre **toutes** les copies chiffrées existantes, y compris celles dans les sauvegardes qui ne sont pas remises, et elle n'est pas révocable.

À la confirmation de la remise, la clé de ce projet est détruite. C'est ce qui permet d'affirmer en toute vérité que les sauvegardes résiduelles, bien qu'existant encore pendant un certain temps, ne sont plus lisibles par personne.

## Erreurs fréquentes

- **Remettre des photographies via une messagerie ordinaire.** Ce sont des données de l'art. 9.
- **Exécuter un effacement parce qu'il a été demandé.** Il faut l'évaluer, et cette évaluation doit être consignée.
- **Effacer avant d'avoir reçu confirmation de la remise.** C'est l'erreur irréversible.

## Questions fréquentes

**Le patient peut-il demander les logs de ses accès ?** Oui, et ils sont disponibles : chaque ouverture de son dossier est enregistrée avec qui et quand.

**Combien de temps ai-je pour répondre ?** Un mois à partir de la demande, prolongeable de deux mois dans les cas complexes, en en informant l'intéressé.

**Qui répond, moi ou Fibonacci ?** Le cabinet : c'est le responsable. Nous sommes sous-traitants et fournissons les outils pour répondre.
