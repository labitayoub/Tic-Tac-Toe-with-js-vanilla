# Documentation Fonctionnelle & Logique

## 1. Objectif du produit
Jeu de **Morpion (Tic Tac Toe) généralisé** : grille dynamique de taille `n x n` (3 ≤ n ≤ 10) où deux joueurs s'affrontent avec leurs symboles personnalisables. Le premier qui aligne `k` symboles (2 ≤ k ≤ n) gagne. Le système gère les scores persistants (victoires + matchs nuls) avec stockage local (LocalStorage) et un panneau de paramètres.

## 2. Rôles et acteurs
- Joueur 1 : symbole configurable (défaut `X`), commence chaque partie.
- Joueur 2 : symbole configurable (défaut `O`).
- Navigateur / Moteur JS : rendu DOM + gestion des événements.
- LocalStorage : persistance des scores inter-sessions.

## 3. Vue d'ensemble fonctionnelle
| Domaine | Description |
|---------|-------------|
| Paramétrage | Choix taille de grille (n), longueur d'alignement gagnant (k), symboles des 2 joueurs. |
| Interaction | Clic sur une case vide → pose du symbole du joueur courant. |
| Tour à tour | Alternance automatique des joueurs. |
| Fin de manche | Victoire si alignement trouvé ; match nul si grille remplie sans gagnant. |
| Scores | Incrément joueur gagnant ou compteur de nuls, puis sauvegarde. |
| Réinitialisation | Bouton nouvelle partie (garde scores) ; réinitialisation des scores avec confirmation. |
| Feedback | Popups SweetAlert2 : victoire, match nul, confirmation reset. |

## 4. Modèle de données (en mémoire)
| Variable | Type | Rôle |
|----------|------|------|
| `currentPlayer` | string | Symbole du joueur actif. |
| `gameBoard` | `string[][]` | Représentation de la grille (`'-'` pour vide). |
| `isGameOver` | boolean | Verrouille les clics après fin de partie. |
| `moveCount` | number | Nombre total de coups joués (optimise détection de match nul). |
| `gridSize` | number | Taille `n` de la grille. |
| `symbolsToWin` | number | Longueur `k` requise pour gagner. |
| `player1Symbol` / `player2Symbol` | string | Symboles personnalisables. |
| `player1Score` / `player2Score` / `tiesScore` | number | Scores persistants. |

## 5. Flux principal (scénario nominal)
1. Initialisation (`initializeGame`) :
   - Charge / initialise scores.
   - Construit une grille vide `n x n` (`initializeBoard`).
   - Définit le joueur courant (Joueur 1).
2. Joueur clique une case :
   - Vérification : partie non terminée + case vide.
   - Écriture du symbole dans `gameBoard` + rendu visuel.
   - Incrément de `moveCount`.
   - Vérification victoire / nul (`checkForWinOrTie`).
   - Si pas fini → alternance (`switchPlayer`) + mise à jour texte.
3. Fin de partie :
   - Victoire : incrément score joueur ; popup ; redémarrage possible. 
   - Nul : incrément `tiesScore` ; popup ; redémarrage possible.

## 6. Algorithme de détection de victoire
La détection est segmentée :
- `checkAllWinConditions()` agrège lignes, colonnes, diagonales principales, diagonales anti.
- Chaque dimension est parcourue en fenêtrage glissant sur des sous-séquences de longueur `k`.
- `checkLineForWin(line)` :
  - Pour chaque index `i` allant de `0` à `line.length - k` :
    - Ignore si symbole vide `'-'`.
    - Vérifie que les `k` éléments consécutifs sont identiques.
  - Complexité approximative : O(L * k) par ligne (L = longueur de la ligne explorée).

### 6.1 Remarques de robustesse
- Fonctionne pour toute grille `n ≥ k`.
- L'algorithme actuel génère toutes les diagonales potentielles par balayage des points de départ possibles.
- Absence d'optimisation: on ne limite pas la recherche autour du dernier coup (on pourrait). 

## 7. Persistance
| Élément | Clé LocalStorage | Format |
|---------|------------------|--------|
| Score Joueur 1 | `player1Score` | entier (stringifié) |
| Score Joueur 2 | `player2Score` | entier |
| Matchs nuls | `tiesScore` | entier |

Pas de persistance de : taille de grille, symboles, `k` (réinitialisés à l'ouverture).

## 8. Gestion des paramètres
`saveSettings()` :
- Sanitize et borne `n` ∈ [3,10].
- Ajuste `k` pour `2 ≤ k ≤ n`.
- Met à jour symboles joueurs (un seul caractère, non forcé d'être distinct → point d'amélioration).
- Réinitialise la partie avec la nouvelle configuration.

## 9. UX & Feedback
| Action | Feedback |
|--------|----------|
| Victoire | SweetAlert succès + bouton rejouer. |
| Match nul | SweetAlert info + bouton rejouer. |
| Reset scores | SweetAlert warning → confirmation → success. |
| Paramètres | Panneau masquable (toggle). |

## 10. Limitations / Contraintes actuelles
- Pas de validation empêchant symboles identiques pour les deux joueurs.
- Le redémarrage efface uniquement la grille, pas les scores (comportement voulu).
- Pas d'historique des parties / pas d'undo.
- Pas d'IA (jeu uniquement 2 humains locaux).
- Accessibilité limitée (pas de navigation clavier / rôles ARIA). 
- Aucune prévention anti double clic ultra rapide (mais inoffensif dans ce contexte).
- Les paramètres ne sont pas persistés entre rafraîchissements.

## 11. Qualité & Séparation des responsabilités
| Domaine | Centralisation | Commentaire |
|---------|----------------|-------------|
| État jeu | Variables globales | Simple mais rend difficile l'extensibilité. |
| DOM | Sélection immédiate + écouteurs directs | Ok pour petite app. |
| Logique victoire | Fonctions pures utilisant `gameBoard` | Testable si isolé. |
| Persistance | `localStorage` direct | Couplage possible à abstraire plus tard. |

## 13. Scénarios d'erreurs & gestion
| Scénario | Gestion actuelle | Suggestion future |
|----------|------------------|-------------------|
| Case déjà remplie | Ignorée silencieusement | Ajouter un léger feedback visuel. |
| Symboles identiques | Possible | Bloquer sauvegarde / avertir. |
| `k > n` demandé | Corrigé par bornage | Afficher message explicatif. |
| LocalStorage indisponible | Non géré | Try/catch avec fallback mémoire. |

## 14. Sécurité & Performance
- Aucune interaction réseau → surface d'attaque minimale.
- Entrées utilisateurs très limitées (1 caractère) → faible risque XSS (mais échapper si évolutions).
- Complexité acceptable jusqu'à 10x10 (`O(n^2 * k)` approx). Performance largement suffisante.

## 15. Glossaire
| Terme | Définition |
|-------|------------|
| `n` | Taille de la grille (nombre de lignes/colonnes). |
| `k` | Longueur nécessaire d'un alignement gagnant. |
| Match nul | Aucun alignement trouvé quand la grille est pleine. |

## 16. Résumé rapide (TL;DR)
Une grille dynamique, deux joueurs, paramétrage basique, détection générique d'alignements, persistance des scores uniquement. Architecture simple mais extensible avec refactorisation modulaire.

---
Documentation rédigée le 19/09/2025.
