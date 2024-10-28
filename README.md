# Démineur - Jeu réalisé avec Vue.js (Mode Solo et Multijoueur)

Ce projet est une version moderne du classique jeu Démineur, développé avec [Vue.js](https://vuejs.org/), un framework JavaScript. En plus du mode solo, le jeu intègre un mode multijoueur en cours de développement pour une expérience encore plus engageante.

## Table des matières
- [Aperçu](#aperçu)
- [Fonctionnalités](#fonctionnalités)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Utilisation](#utilisation)
- [Technologies Utilisées](#technologies-utilisées)
- [Contributeurs](#contributeurs)
- [Licence](#licence)

## Aperçu

Le Démineur est un jeu de logique dans lequel le joueur doit identifier et marquer toutes les cases contenant des mines dans une grille. Le but est d'éviter les mines tout en dévoilant le plus de cases possible. Ce projet est une excellente introduction aux concepts de réactivité et de gestion d’événements dans Vue.js, avec en plus l'intégration d'un mode multijoueur pour jouer en ligne contre vos amis.

Vous pouvez jouer au jeu directement en ligne sur [https://minesweeper.zac.ovh/](https://minesweeper.zac.ovh/)

## Fonctionnalités

- **Mode Solo** : Profitez du jeu classique avec des niveaux de difficulté ajustables (facile, moyen, difficile et extrême).
- **Mode Multijoueur (en développement)** : Jouez contre vos amis en temps réel et tentez de marquer plus de cases qu'eux sans toucher de mines.
- **Génération aléatoire des mines** : Les mines sont placées aléatoirement pour chaque nouvelle partie.
- **Marquage de cases** : Utilisez le clic droit pour marquer une case soupçonnée de contenir une mine.
- **Affichage dynamique** : La grille est mise à jour en temps réel en fonction des actions du joueur.
- **Gestion d'état** : Utilisation des fonctionnalités de Vue.js pour la gestion de l'état du jeu et des données de grille.
- **Temps de jeu et score** : Un compteur de temps pour suivre les performances du joueur.

## Prérequis

Avant de commencer, assurez-vous d'avoir les éléments suivants installés sur votre machine :

- [Node.js](https://nodejs.org/) (version 12 ou supérieure)
- [npm](https://www.npmjs.com/) ou [Yarn](https://yarnpkg.com/)

## Installation

1. Clonez le dépôt GitHub :
   ```bash
   git clone https://github.com/votre-utilisateur/demineur-vue.git
   ```

2. Naviguez dans le répertoire du projet :
   ```bash
   cd demineur-vue
   ```

3. Installez les dépendances :
   ```bash
   npm install
   ```
   ou
   ```bash
   yarn install
   ```

## Utilisation

1. Lancez le serveur de développement :
   ```bash
   npm run dev
   ```
   ou
   ```bash
   yarn dev
   ```

2. Ouvrez votre navigateur et accédez à `http://localhost:8080` pour voir le jeu Démineur.

3. Pour construire le projet pour la production :
   ```bash
   npm run build
   ```
   ou
   ```bash
   yarn build
   ```

## Technologies Utilisées

- **Vue.js** - Framework JavaScript pour construire des interfaces utilisateur réactives.
- **JavaScript (ES6+)** - Langage de programmation principal pour la logique du jeu.
- **HTML5 & CSS3** - Pour le rendu et le style de l'interface.
- **Vue CLI** - Outil en ligne de commande pour gérer la configuration du projet Vue.js.

## Contributeurs

- **[@angels-dev](https://github.com/angels-dev)** - Alternant Ingénieur Réseau et développeur
- **[@betasown](https://github.com/betasown)** - Etudiant en informatique et développeur

## Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## Remarque sur le mode Multijoueur

Le mode multijoueur est encore en développement. Nous travaillons activement à l'ajout de nouvelles fonctionnalités telles que la connexion entre joueurs, les classements, et les interactions en temps réel. Restez à l'affût des mises à jour !

