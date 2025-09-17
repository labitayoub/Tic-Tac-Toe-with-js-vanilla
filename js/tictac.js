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

function playTicTac(size) {
    initializeBoard(size);
    do {
        let position = prompt(`Joueur ${player}, entrez votre position (ligne,colonne)`);
        let positionX = parseInt(position.split(',')[0]);
        let positionY = parseInt(position.split(',')[1]);
        board[positionX][positionY] = player;
        console.table(board);
        checkWin(boardSize, positionX, positionY);
        player = (player === 'X') ? 'O' : 'X';
        movePlayer++;
    } while (
        !gameOver
    );

}

function checkWin(boardSize, positionX, positionY) {
    if (movePlayer == (boardSize * boardSize)) {
        gameOver = true;
        console.log("Match nul!");
    }
 

let rowValue = new Set();
let colValue = new Set();
let diagValue1 = new Set();
let diagValue2 = new Set();
for (let i = 0; i < boardSize; i++) {
    rowValue.add(board[positionX][i]);
    colValue.add(board[i][positionY]);
    diagValue1.add(board[i][i]);
    diagValue2.add(board[i][boardSize - 1 - i]);
}
if ((rowValue.size == 1 && !rowValue.has('-'))
    || (colValue.size == 1 && !colValue.has('-'))
    || (diagValue1.size == 1 && !diagValue1.has('-'))
    || (diagValue2.size == 1 && !diagValue2.has('-'))) {
    gameOver = true;
    alert(`Le joueur ${player} a gagné!`);
}

}



let size = prompt("Entrez la taille du plateau (3 pour 3x3, 4 pour 4x4, etc.)");

playTicTac(size);