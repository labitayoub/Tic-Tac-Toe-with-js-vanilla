# Tic Tac Toe (Morpion) – Vanilla JS

Site déployé : https://tic-tac-2025.vercel.app/


## 🎯 Objectif
Jeu classique de Tic Tac Toe (Morpion) réalisé en **HTML / CSS / JavaScript vanilla**. Deux joueurs s'affrontent (X et O). Le premier qui aligne 3 symboles (horizontalement, verticalement ou en diagonale) gagne. Si la grille est pleine sans gagnant : match nul.

## ✅ Fonctionnalités actuelles
- Grille nxn interactive
- Alternance automatique des joueurs (X / O)
- Détection de victoire / égalité
- Réinitialisation rapide de la partie
- Interface responsive basique

## 🧠 Règles
1. X commence (par défaut) sauf si vous avez implémenté un tirage au sort.
2. Les joueurs cliquent à tour de rôle sur une case vide.
3. Le jeu s'arrête lorsqu'un joueur aligne 3 symboles ou que toutes les cases sont remplies.
4. Un bouton (ou action) permet de recommencer.

## 🗂️ Structure du projet
```
index.html
css/
  style.css
js/
  tictac.js
```

## 🛠️ Technologies
- HTML5
- CSS3
- JavaScript (ES6+)

## 🚀 Lancer localement
1. Télécharger ou cloner le dépôt :
  - `git clone <URL_DU_DEPOT>`
2. Méthodes possibles :

### A. Ouvrir directement
Double-cliquez sur `index.html` (OK pour un simple test, mais certains comportements liés au chemin des fichiers peuvent être limités en mode `file://`).

### B. Extension VS Code (recommandé)
Installer l'extension "Live Server" puis clic droit sur `index.html` → "Open with Live Server".

### C. Serveur statique via Node (sans installation globale)
Depuis la racine du projet :
```
npx serve .
```
Ou :
```
npx http-server . -p 8080
```
Puis ouvrir http://localhost:3000/ (par défaut avec `serve`) ou http://localhost:8080/ selon la commande.

### D. (Optionnel) Autre méthode simple
Si vous avez Python installé, vous pouvez aussi (option secondaire) :
```
python -m http.server 8080
```
Puis ouvrir http://localhost:8080/


## 🧪 Tests (suggestions)
- Vérifier toutes les combinaisons de victoire
- Empêcher de jouer sur une case déjà remplie
- Détection correcte du match nul


## 🤝 Contributions
Les suggestions sont bienvenues : ouvrez une *issue* ou une *pull request*.


---
Bon jeu ! 🎉
