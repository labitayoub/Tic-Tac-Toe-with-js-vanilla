let player = 'X';
let board = [];
let gameOver = false;
let movePlayer = 1;
let boardSize = 3;
let winLength = 3;
let p1Symbol = 'X';
let p2Symbol = 'O';
let player1Score = 0;
let player2Score = 0;
let tiesScore = 0;

const gameBoard = document.getElementById('game-board');
const playerTurn = document.getElementById('player-turn');

const gridSizeInput = document.getElementById('grid-size');
const saveSettingsBtn = document.getElementById('save-settings');
const scoreP1 = document.getElementById('score-p1');
const scoreP2 = document.getElementById('score-p2');
const scoreTies = document.getElementById('score-ties');
const settings = document.getElementById('settings');
const toggleSettingsBtn = document.getElementById('toggle-settings');
const p1SymbolInput = document.getElementById('p1-symbol');
const p2SymbolInput = document.getElementById('p2-symbol');
const winLengthInput = document.getElementById('win-length');




    saveSettingsBtn.addEventListener('click', () => {
        const n = parseInt(gridSizeInput.value, 10);
        if (Number.isNaN(n)) return;

        let newSize = n;
        if (newSize < 3) newSize = 3;
        if (newSize > 10) newSize = 10;

        gridSizeInput.value = newSize;

        p1Symbol = p1SymbolInput.value || 'X';
        p2Symbol = p2SymbolInput.value || 'O';

        boardSize = newSize;
        gameOver = false;
        player = p1Symbol;
        movePlayer = 1;
        playerTurn.textContent = `Joueur ${player}, c'est à vous !`;
        initializeBoard(boardSize);
    });


    toggleSettingsBtn.addEventListener('click', () => {
      
        if (!settings.classList.contains('hidden')) {
            settings.classList.add('hidden');
        }else {
            settings.classList.remove('hidden');
        }
    });


function updateScores() {
    scoreP1.textContent = player1Score;
    scoreP2.textContent = player2Score;
    scoreTies.textContent = tiesScore;
    saveScoresToLocalStorage();
}

function saveScoresToLocalStorage() {
    localStorage.setItem('player1Score', player1Score);
    localStorage.setItem('player2Score', player2Score);
    localStorage.setItem('tiesScore', tiesScore);
}

function loadScoresFromLocalStorage() {
    const savedP1Score = localStorage.getItem('player1Score');
    const savedP2Score = localStorage.getItem('player2Score');
    const savedTiesScore = localStorage.getItem('tiesScore');
    
    if (savedP1Score !== null) player1Score = parseInt(savedP1Score, 10);
    if (savedP2Score !== null) player2Score = parseInt(savedP2Score, 10);
    if (savedTiesScore !== null) tiesScore = parseInt(savedTiesScore, 10);
}

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

function initializeBoard(size) {
    board = [];
    gameBoard.innerHTML = '';
    gameBoard.style.gridTemplateColumns = `repeat(${size}, 1fr)`;

    for (let row = 0; row < size; row++) {
        let boardRow = [];
        for (let col = 0; col < size; col++) {
            boardRow.push('-');
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.addEventListener('click', handleMove);
            gameBoard.appendChild(cell);
        }
        board.push(boardRow);
    }
    console.table(board);
}

function handleMove(e) {
    if (gameOver) return;

    const row = e.target.dataset.row;
    const col = e.target.dataset.col;

    if (board[row][col] !== "-") return;

    board[row][col] = player;
    e.target.textContent = player;
    console.table(board);

    checkWin(boardSize, parseInt(row), parseInt(col));

    if (!gameOver) {
        player = (player === p1Symbol) ? p2Symbol : p1Symbol;
        movePlayer++;
        playerTurn.textContent = `Joueur ${player}, c'est à vous !`;
    }
}

function checkWin(size, x, y) {
    if (movePlayer === (size * size)) {
        gameOver = true;
        tiesScore++;
        updateScores();
        alert("Match nul !");
    }

    let rowValue = new Set();
    let colValue = new Set();
    let diagValue1 = new Set();
    let diagValue2 = new Set();

    for (let i = 0; i < size; i++) {
        rowValue.add(board[x][i]);
        colValue.add(board[i][y]);
        diagValue1.add(board[i][i]);
        diagValue2.add(board[i][size - 1 - i]);
    }

    if (
        (rowValue.size === 1 && !rowValue.has("-")) ||
        (colValue.size === 1 && !colValue.has("-")) ||
        (diagValue1.size === 1 && !diagValue1.has("-")) ||
        (diagValue2.size === 1 && !diagValue2.has("-"))
    ) {
        gameOver = true;
        if (player === p1Symbol) {
            player1Score++;
        } else {
            player2Score++;
        }
        updateScores();
        alert(`Le joueur ${player} a gagné !`);
    }
}


document.getElementById("restart").addEventListener("click", () => {
    gameOver = false;
    player = p1Symbol;
    movePlayer = 1;
    playerTurn.textContent = `Joueur ${player}, c'est à vous !`;
    initializeBoard(boardSize);
});

document.getElementById("reset-scores").addEventListener("click", () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer tous les scores sauvegardés ? Cette action est irréversible.')) {
        clearScoresFromLocalStorage();
    }
});

player = p1Symbol;
initializeBoard(boardSize);
loadScoresFromLocalStorage();
updateScores();