# Où demander de l'aide : manuel, assistant, assistance

En bas du menu de navigation, il y a quatre options qui servent quand quelque chose ne fonctionne pas. Elles font des choses différentes, et savoir laquelle utiliser permet de gagner du temps.

| Option | Qu'est-ce que c'est | Quand l'utiliser |
|---|---|---|
| `Visite guidée par IA` | la visite des zones principales, à l'écran | le premier jour, ou quand un nouveau collaborateur arrive |
| `Guides et manuel` | ce manuel | *« comment faire X »* |
| l'assistant en bas à droite | répond en lisant le manuel | *« où se trouve X »*, sans arrêter de travailler |
| `Demander de l'aide` | nous écrit | quelque chose ne fonctionne pas |

## La visite guidée

`Visite guidée par IA` accompagne en quelques minutes à travers le `Tableau de bord`, les `Patients`, le dossier médical, les zones traitées, les photos, les `Consentements`, l'agenda, les `Rappels`, les `Médicaments`, la `Littérature`, l'atlas et le `Journal des accès`. Elle défile automatiquement, et on peut la mettre en pause, revenir en arrière ou sauter des étapes. Elle se lance automatiquement la première fois que l'on accède à la démo ; ensuite, on peut la relancer via ce bouton.

## Le manuel

`Guides et manuel` ouvre le manuel **dans l'application** : la table des matières à gauche, avec la recherche en haut ; le texte au centre ; à droite, sur les grands écrans, les titres du chapitre que tu es en train de lire. Les flèches **←** et **→** du clavier changent de chapitre, et en bas de chaque chapitre, il y a les liens vers le chapitre précédent et le suivant.

Chaque chapitre a sa propre adresse (`/manuale/<capitolo>`), donc tu peux envoyer à un collègue le lien vers un chapitre précis plutôt que vers le manuel entier.

⚠️ **Le manuel n'est pas publié sur le site.** Jusqu'au 12 août 2026, les guides étaient des pages publiques de `fibonaccimedica.it` ; elles ont été retirées pour ne pas montrer à la concurrence tout ce que le produit fait. On ne peut les lire qu'ici, avec une session ouverte, et le texte ne voyage pas dans le programme que le navigateur télécharge : il arrive du serveur après le contrôle de l'accès.

⚠️ **Le manuel se met à jour avec les releases, pas tout seul.** Si un écran a changé et que le guide indique encore autre chose, ce n'est pas une erreur de ta part : signale-le.

## L'assistant dans l'application

La fenêtre en bas à droite (`Demander à l'IA`) répond sur les fonctions du produit **en lisant ces mêmes guides**, et sait depuis quel écran tu écris. Trois choses à savoir :

- **Si la réponse ne se trouve pas dans les guides, il le dit** au lieu d'inventer, et propose d'envoyer une demande d'assistance. C'est le comportement voulu : un assistant qui comble les vides est pire qu'un assistant qui reste silencieux.
- **Il ne remplace pas le jugement clinique**, et l'indique sous chaque réponse. Pour les posologies, il renvoie à la section `Médicaments`.
- **`Pulisci` réinitialise la conversation.**

## Demander de l'assistance

`Demander de l'aide` ouvre un message déjà prêt à envoyer vers notre boîte mail. Avant de l'envoyer, tu vois exactement ce qui part :

- **ce que tu écris** dans *« Que se passe-t-il ? »* ;
- **le `Rapport technique joint`**, c'est-à-dire la dernière erreur enregistrée dans cette session du navigateur, affichée en entier avant l'envoi. S'il n'y a pas d'erreurs, la fenêtre l'indique : *« Aucun erreur enregistrée dans cette session : seul ce que tu écris partira »*.

⛔ **N'écris pas ici de données de patients**, et l'avertissement est dans le champ. La conversation avec l'assistant **n'est pas jointe**, volontairement : elle contient les noms que tu as recherchés.

`Ouvrir le message` transfère le texte à ton programme de messagerie : l'envoi reste un geste de ta part.

⚠️ Si l'option `Demander de l'aide` n'apparaît pas, l'adresse d'assistance n'est pas configurée sur cette installation. Un bouton qui ouvre un e-mail vers le néant est pire qu'un bouton absent, donc dans ce cas, il n'est pas affiché.

## Installer l'application sur tablette ou téléphone

`Installa l'app` apparaît quand le navigateur est prêt à l'installer : il ajoute Fibonacci à l'écran d'accueil, en plein écran, sans la barre d'adresses. C'est pratique pour la tablette des questionnaires et pour l'appareil photo en consultation.

Deux comportements voulus :

- **le bouton ne disparaît pas** si l'installation n'a pas réussi : il devient `Réessayer d'installer`, et la page se recharge pour obtenir une nouvelle invitation du navigateur ;
- **son absence est une information, pas une panne** : certains navigateurs ne proposent pas l'installation, et sur iPhone, on utilise *« Ajouter à l'écran d'accueil »* depuis le menu de partage de Safari.

## Voir aussi

- [Premier accès et configuration initiale](/manuale/installazione)
- [Le tableau de bord : que regarder le matin](/manuale/dashboard)
