## LifeSpent

[![License](https://img.shields.io/github/license/nicejade/life-spent?style=flat-square)](LICENSE)
[![Live Demo](https://img.shields.io/badge/demo-live-10b981?style=flat-square)](https://spent.lovejade.cn/)
[![Stars](https://img.shields.io/github/stars/nicejade/life-spent?style=flat-square)](https://github.com/nicejade/life-spent/stargazers)
[![Issues](https://img.shields.io/github/issues/nicejade/life-spent?style=flat-square)](https://github.com/nicejade/life-spent/issues)
[![Last Commit](https://img.shields.io/github/last-commit/nicejade/life-spent?style=flat-square)](https://github.com/nicejade/life-spent/commits/main)

> Un moment de calme face au temps. Sans jugement, sans injonction – seulement des chiffres.

**LifeSpent** est une application web minimaliste qui vous montre, à partir de votre âge, de l’espérance de vie moyenne et de l’âge médian de la population, quelle part de votre vie est déjà derrière vous. L’objectif n’est pas de culpabiliser, mais de fissurer l’illusion d’un temps infini et d’inviter à une relation plus consciente au temps qui reste.

### ✨ Points clés

- **Valeurs par défaut** : espérance de vie moyenne de 75,37 ans pour les hommes et 80,88 ans pour les femmes ; âge médian mondial de 31,1 ans (modifiable dans le code).
- **Tonalité** : calme, sobre et réfléchie – ni discours motivationnel, ni dramatisation.
- **Vie privée** : aucun compte, aucun suivi, aucune collecte superflue – seulement des calculs locaux.

### 🕊️ Philosophie

LifeSpent n’est ni un outil de développement personnel, ni un compteur macabre.  
C’est un miroir qui vous renvoie simplement la réalité du temps, sans commentaire.

- **Réalité objective** : utilisation de données actuarielles réelles (espérance de vie : 75,37 ans pour les hommes, 80,88 ans pour les femmes ; âge médian mondial par défaut : 31,1 ans).
- **Design cérémoniel** : interface sombre, épurée et contemporaine, pensée pour favoriser la concentration et la réflexion.
- **Expérience sans friction** : pas de création de compte, pas de connexion, pas de tracking – les chiffres ne quittent pas votre écran.

### 🛠️ Stack technique

Le projet est construit avec un souci de performance, de sûreté de typage et de modernité.

- **Frontend** : [Svelte 4](https://svelte.dev/)
- **Langage** : [TypeScript](https://www.typescriptlang.org/)
- **Styles** : [Tailwind CSS](https://tailwindcss.com/)
- **Outil de build** : [Vite](https://vitejs.dev/)

### 🚀 Bien démarrer

#### Prérequis

- Node.js (dernière version LTS recommandée)
- npm ou pnpm

#### Installation

```bash
# Cloner le dépôt
git clone https://github.com/nicejade/life-spent.git
cd life-spent

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Construire pour la production
npm run build
```

### 🔗 Démo en ligne

[https://spent.lovejade.cn/](https://spent.lovejade.cn/)

### 🌐 Accès

- **Développement local** : exécutez `npm run dev` puis ouvrez `http://localhost:5173` dans votre navigateur.
- **Build de production** : exécutez `npm run build`, puis déployez le dossier `dist/` sur un hébergeur statique.
- **Hébergement** : compatible avec la plupart des solutions (Vercel, Netlify, GitHub Pages, etc.).

### 📂 Structure du projet

```bash
src/
├── helper/            # Logique de base, constantes et utilitaires
├── types/             # Définitions de types TypeScript
├── components/        # Composants UI Svelte
├── assets/icons/      # Icônes SVG (check, github, moon, selector, sun)
├── styles/            # Styles globaux minimaux
├── App.svelte         # Point d’entrée de l’application
└── main.ts            # Bootstrap
```

### 🎨 Principes de design

- **Sobriété** : textes courts, hiérarchie typographique claire, peu de bruit visuel.
- **Effet verre dépoli** : cartes translucides et couches subtiles pour une esthétique moderne, légèrement cérémonielle.
- **Accessibilité** : HTML sémantique et support ARIA dès la conception.
- **Responsive** : approche mobile-first pour une consultation simple, quel que soit le contexte.

### 🤝 Contributions

Les contributions sont les bienvenues, tant qu’elles respectent le ton contemplatif et la simplicité du projet.

- **Pour tout changement important** : ouvrez d’abord une issue afin de discuter de la direction.
- **Flux de travail** : fork du dépôt, branche à partir de `main`, puis PR ciblée et claire.
- **Organisation du code** : la logique métier et les calculs doivent rester dans `lib/`, l’UI dans les composants `src/`.
- **En cas de modification de la logique** : ajoutez des tests lorsque c’est pertinent, ou laissez une structure prête à être testée.
- **Style** : privilégiez les utilitaires Tailwind ; limitez au maximum le CSS personnalisé.

### 📜 Licence

Projet sous licence MIT. Voir `LICENSE` pour plus de détails.

---

Un petit rappel discret que chaque seconde est déjà en train de s’écouler.  
À utiliser sans urgence, mais en pleine conscience.

© 2026–présent, [nicejade](https://www.lovejade.cn/).
