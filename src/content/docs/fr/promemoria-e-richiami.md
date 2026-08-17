# Rappels et relances

Cette guide décrit les rappels cliniques : ceux créés manuellement, ceux générés par un cycle de traitement, et ceux découlant de la durée attendue d'un produit. Elle s'adresse aux médecins et au secrétariat.

## Les trois types, et pourquoi ils figurent dans la même liste

| Origine | Exemple | Qui le crée |
|---|---|---|
| Manuel | « Rappeler Mme Rossi pour le résultat » | le médecin ou le secrétariat |
| Cycle de traitement | « 3ᵉ séance sur 4, dans 4 semaines » | le plan de soin |
| Durée du produit | « Le résultat est attendu 4-6 mois : recontacter » | la séance enregistrée |

Ils aboutissent tous dans la même section `Rappels`, et ce n'est pas par paresse : pour qui travaille, **« qu'est-ce que je dois me rappeler » est une seule question**. Trois listes séparées pour trois origines différentes seraient une distinction qui nous appartient, pas à lui. La provenance reste lisible dans chaque entrée.

## Étape 1, créer un rappel

Depuis la section `Rappels`, le bouton `Nouveau rappel` demande un titre, un patient, un responsable, une priorité et une échéance. Le responsable peut être soi-même ou un collègue.

## Étape 2, les relances qui se créent toutes seules

Lorsqu'on enregistre une séance dont le produit a une durée attendue **inscrite dans un consentement**, le système propose une relance à la date appropriée.

Deux choix déclarés :

- **On relance à l'extrémité inférieure** de la durée attendue : pour la toxine botulinique à 4 mois, pas à 6. La raison est clinique avant d'être commerciale : l'effet commence à diminuer au début de la fourchette, et un patient recontacté alors que l'effet a déjà disparu entre-temps est allé ailleurs.
- **Si la durée n'est pas connue, rien n'est proposé.** On ne fait pas d'estimation. Une relance inventée ressemble à un conseil du médecin.

Chaque entrée indique **d'où elle vient**, en citant la phrase du consentement : un rappel qui ne sait pas expliquer pourquoi il est là est un rappel que le médecin désactive.

## Étape 3, ce que le système NE FAIT PAS

⚠️ **Aucun message n'est envoyé automatiquement au patient.** Le rappel est interne.

Ce n'est pas une fonction manquante : c'est une limite délibérée. La L. 145/2018, art. 1 comma 525, interdit aux inscrits aux ordres les communications sanitaires contenant des « éléments de caractère attractif et suggestif », et la sanction vise **le médecin**. Un envoi automatique conçu par nous exposerait le client, pas nous.

Lorsque la relance doit être communiquée, cela se fait depuis le cabinet, avec des mots choisis par celui qui répond de ces mots.

## Erreurs fréquentes

- **Utiliser les rappels comme agenda.** Les rendez-vous figurent dans l'agenda ; ici figurent les choses à se rappeler.
- **Tout s'assigner à soi-même dans un cabinet avec plusieurs opérateurs.** Le responsable est ce qui rend la liste utile à quelqu'un d'autre.
- **S'attendre à ce que le patient reçoive quelque chose.** Il ne reçoit rien, et la raison est ci-dessus.

## Questions fréquentes

**Un rappel échu depuis des mois reste-t-il dans la liste ?** Non : au-delà de la durée maximale attendue, le bon moment est passé, et l'afficher comme « à faire aujourd'hui » serait du bruit.

**En enregistrant deux fois la même séance, obtient-on deux relances ?** Non : la relance est identifiée de manière déterministe à partir de la séance, et le second enregistrement ne la duplique pas.
