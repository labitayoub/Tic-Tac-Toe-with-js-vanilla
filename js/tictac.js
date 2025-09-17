let player = 'X';
let board = [];
let gameOver = false;
let movePlayer = 1;
let boardSize = 3;

const gameBoard = document.getElementById('game-board');
const playerTurn = document.getElementById('player-turn');

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
        cell.addEventListener('click', handleCellClick);
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

    if (board[row][col] !== "-") return; // case déjà prise

    board[row][col] = player;
    e.target.textContent = player;
    console.table(board);

    checkWin(boardSize, parseInt(row), parseInt(col));

    if (!gameOver) {
        player = (player === "X") ? "O" : "X";
        movePlayer++;
        playerTurn.textContent = `Joueur ${player}, c'est à vous !`;
    }
}

function checkWin(size, x, y) {
    if (movePlayer === (size * size)) {
        gameOver = true;
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
        alert(`Le joueur ${player} a gagné !`);
    }
}

document.getElementById("restart").addEventListener("click", () => {
    gameOver = false;
    player = "X";
    movePlayer = 1;
    playerTurn.textContent = `Joueur ${player}, c'est à vous !`;
    initializeBoard(boardSize);
});

initializeBoard(boardSize);