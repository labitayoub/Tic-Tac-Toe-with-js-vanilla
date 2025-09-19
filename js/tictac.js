let currentPlayer = 'X';
let gameBoard = [];
let isGameOver = false;
let moveCount = 0;
let gridSize = 3;
let symbolsToWin = 3;
let player1Symbol = 'X';
let player2Symbol = 'O';
let player1Score = 0;
let player2Score = 0;
let tiesScore = 0;

const boardElement = document.getElementById('game-board');
const playerTurnElement = document.getElementById('player-turn');
const kValueElement = document.getElementById('k-value');
const scorePlayer1Element = document.getElementById('score-p1');
const scorePlayer2Element = document.getElementById('score-p2');
const scoreTiesElement = document.getElementById('score-ties');
const settingsPanel = document.getElementById('settings');
const toggleSettingsButton = document.getElementById('toggle-settings');
const restartButton = document.getElementById('restart');
const resetScoresButton = document.getElementById('reset-scores');

const gridSizeInput = document.getElementById('grid-size');
const winLengthInput = document.getElementById('win-length');
const player1SymbolInput = document.getElementById('p1-symbol');
const player2SymbolInput = document.getElementById('p2-symbol');
const saveSettingsButton = document.getElementById('save-settings');

toggleSettingsButton.addEventListener('click', toggleSettings);
saveSettingsButton.addEventListener('click', saveSettings);
restartButton.addEventListener('click', restartGame);
resetScoresButton.addEventListener('click', confirmResetScores);


function initializeGame() {
    currentPlayer = player1Symbol;
    initializeBoard(gridSize);
    loadScoresFromLocalStorage();
    updateScores();
    updatePlayerTurn();
    kValueElement.textContent = symbolsToWin;
}

/**
 * Create the game board based on the specified size
 */
function initializeBoard(size) {
    gameBoard = [];
    boardElement.innerHTML = '';
    boardElement.style.gridTemplateColumns = `repeat(${size}, 1fr)`;

    for (let row = 0; row < size; row++) {
        let boardRow = [];
        for (let col = 0; col < size; col++) {
            boardRow.push('-');
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.addEventListener('click', handleCellClick);
            boardElement.appendChild(cell);
        }
        gameBoard.push(boardRow);
    }
    moveCount = 0;
    isGameOver = false;
}

/**
 * Handle player moves when cells are clicked
 */
function handleCellClick(event) {
    if (isGameOver) return;

    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);

    if (gameBoard[row][col] !== "-") return;

    // Update board state and UI
    gameBoard[row][col] = currentPlayer;
    event.target.textContent = currentPlayer;
    moveCount++;

    // Check if the current move resulted in a win
    checkForWinOrTie(row, col);

    if (!isGameOver) {
        switchPlayer();
        updatePlayerTurn();
    }
}

/**
 * Switch to the next player
 */
function switchPlayer() {
    currentPlayer = (currentPlayer === player1Symbol) ? player2Symbol : player1Symbol;
}

/**
 * Update the display showing whose turn it is
 */
function updatePlayerTurn() {
    playerTurnElement.textContent = `Joueur ${currentPlayer === player1Symbol ? '1' : '2'} (${currentPlayer}), c'est à vous !`;
}

/**
 * Check if the game has been won or ended in a tie
 */
function checkForWinOrTie(lastMoveRow, lastMoveCol) {
    // Check for tie
    if (moveCount === (gridSize * gridSize)) {
        isGameOver = true;
        tiesScore++;
        updateScores();
        alert("Match nul !");
        return;
    }

    // Check for win conditions
    if (checkAllWinConditions()) {
        declareWinner();
    }
}

/**
 * Check all possible win conditions (rows, columns, diagonals)
 */
function checkAllWinConditions() {
    return (
        checkRowsForWin() ||
        checkColumnsForWin() ||
        checkMainDiagonalsForWin() ||
        checkAntiDiagonalsForWin()
    );
}

/**
 * Check rows for winning combinations
 */
function checkRowsForWin() {
    for (let row = 0; row < gridSize; row++) {
        if (checkLineForWin(gameBoard[row])) {
            return true;
        }
    }
    return false;
}

/**
 * Check columns for winning combinations
 */
function checkColumnsForWin() {
    for (let col = 0; col < gridSize; col++) {
        let column = [];
        for (let row = 0; row < gridSize; row++) {
            column.push(gameBoard[row][col]);
        }
        if (checkLineForWin(column)) {
            return true;
        }
    }
    return false;
}

/**
 * Check main diagonals (top-left to bottom-right) for winning combinations
 */
function checkMainDiagonalsForWin() {
    for (let startRow = 0; startRow <= gridSize - symbolsToWin; startRow++) {
        for (let startCol = 0; startCol <= gridSize - symbolsToWin; startCol++) {
            let diagonal = [];
            for (let i = 0; i < symbolsToWin; i++) {
                diagonal.push(gameBoard[startRow + i][startCol + i]);
            }
            if (checkLineForWin(diagonal)) {
                return true;
            }
        }
    }
    return false;
}

/**
 * Check anti-diagonals (top-right to bottom-left) for winning combinations
 */
function checkAntiDiagonalsForWin() {
    for (let startRow = 0; startRow <= gridSize - symbolsToWin; startRow++) {
        for (let startCol = symbolsToWin - 1; startCol < gridSize; startCol++) {
            let diagonal = [];
            for (let i = 0; i < symbolsToWin; i++) {
                diagonal.push(gameBoard[startRow + i][startCol - i]);
            }
            if (checkLineForWin(diagonal)) {
                return true;
            }
        }
    }
    return false;
}

/**
 * Check if a line (row, column or diagonal) contains a winning combination
 */
function checkLineForWin(line) {
    for (let i = 0; i <= line.length - symbolsToWin; i++) {
        let symbol = line[i];
        if (symbol === '-') continue;
        
        let allSame = true;
        for (let j = 1; j < symbolsToWin; j++) {
            if (line[i + j] !== symbol) {
                allSame = false;
                break;
            }
        }
        if (allSame) return true;
    }
    return false;
}

/**
 * Handle the win condition
 */
function declareWinner() {
    isGameOver = true;
    if (currentPlayer === player1Symbol) {
        player1Score++;
    } else {
        player2Score++;
    }
    updateScores();
    alert(`Le joueur ${currentPlayer === player1Symbol ? '1' : '2'} (${currentPlayer}) a gagné !`);
}

/**
 * Update the scoreboard display
 */
function updateScores() {
    scorePlayer1Element.textContent = player1Score;
    scorePlayer2Element.textContent = player2Score;
    scoreTiesElement.textContent = tiesScore;
    saveScoresToLocalStorage();
}

/**
 * Save game scores to local storage
 */
function saveScoresToLocalStorage() {
    localStorage.setItem('player1Score', player1Score);
    localStorage.setItem('player2Score', player2Score);
    localStorage.setItem('tiesScore', tiesScore);
}

/**
 * Load game scores from local storage
 */
function loadScoresFromLocalStorage() {
    const savedP1Score = localStorage.getItem('player1Score');
    const savedP2Score = localStorage.getItem('player2Score');
    const savedTiesScore = localStorage.getItem('tiesScore');
    
    if (savedP1Score !== null) player1Score = parseInt(savedP1Score, 10);
    if (savedP2Score !== null) player2Score = parseInt(savedP2Score, 10);
    if (savedTiesScore !== null) tiesScore = parseInt(savedTiesScore, 10);
}

/**
 * Clear saved scores from local storage
 */
function clearScoresFromLocalStorage() {
    localStorage.removeItem('player1Score');
    localStorage.removeItem('player2Score');
    localStorage.removeItem('tiesScore');
    
    player1Score = 0;
    player2Score = 0;
    tiesScore = 0;
    
    updateScores();
    
    alert('Scores supprimés avec succès !');
}

/**
 * Show confirmation dialog before resetting scores
 */
function confirmResetScores() {
    if (confirm('Êtes-vous sûr de vouloir supprimer tous les scores sauvegardés ? Cette action est irréversible.')) {
        clearScoresFromLocalStorage();
    }
}

/**
 * Toggle visibility of settings panel
 */
function toggleSettings() {
    settingsPanel.classList.toggle('hidden');
}

/**
 * Save game settings and restart with new configuration
 */
function saveSettings() {
    // Get and validate grid size
    const newSize = Math.max(3, Math.min(10, parseInt(gridSizeInput.value, 10) || 3));
    
    // Get and validate win length
    const newWinLength = Math.max(2, Math.min(newSize, parseInt(winLengthInput.value, 10) || 3));
    
    // Update input values to validated values
    gridSizeInput.value = newSize;
    winLengthInput.value = newWinLength;
    
    // Save player symbols
    player1Symbol = player1SymbolInput.value || 'X';
    player2Symbol = player2SymbolInput.value || 'O';
    
    // Update game state
    gridSize = newSize;
    symbolsToWin = newWinLength;
    currentPlayer = player1Symbol;
    
    // Update UI
    kValueElement.textContent = symbolsToWin;
    
    // Restart game with new settings
    restartGame();
}

/**
 * Restart the game with current settings
 */
function restartGame() {
    isGameOver = false;
    moveCount = 0;
    currentPlayer = player1Symbol;
    updatePlayerTurn();
    initializeBoard(gridSize);
}

// Initialize the game when script loads
initializeGame();
