# Catalogue des médicaments : mise à jour

Le catalogue des médicaments de Fibonacci provient de l'**AIFA** et compte environ 159 000 entrées.
Il n'est pas compilé manuellement : un processus automatique l'importe et le maintient à jour.

La page **`Catalogo farmaci (stato)`** dans la zone d'`Administration` montre comment s'est déroulée
la dernière importation. Elle est réservée au rôle d'administrateur.

## Que montre la page

- **État de la dernière exécution** : terminée, en cours ou échouée.
- **Quand elle a eu lieu** et **sa durée**.
- **Combien d'entrées** ont été lues, ajoutées ou mises à jour.
- **L'erreur**, s'il y en a eu, avec la raison.

Lorsqu'une importation est **en cours**, la page se met à jour automatiquement toutes les trente
secondes : il n'est pas nécessaire de la recharger. Une importation complète dure environ quarante minutes,
il est donc normal de la voir « en cours » pendant un certain temps.

## « `Forza sync ora` » est désactivé, et c'est voulu

Le bouton est présent mais n'est pas cliquable. Une importation nécessite beaucoup de ressources et
dure plusieurs dizaines de minutes : la lancer depuis une interface web, peut-être deux fois par erreur,
signifierait ralentir le dossier patient pendant les heures de consultation. La synchronisation est programmée,
et elle est forcée depuis le serveur lorsque c'est vraiment nécessaire.

## Que faire si l'importation échoue

Le catalogue **reste celui de la dernière importation réussie** : aucun médicament ne disparaît et
la prescription continue de fonctionner. Un échec n'est pas une urgence : cela signifie que le catalogue vieillit,
pas qu'il se vide.

Si l'état reste en échec pendant plusieurs jours, signale-le : la cause est presque toujours en amont
(la source AIFA inaccessible), et elle est visible dans la raison indiquée sur la page.
