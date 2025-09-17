let player = 'X';
let board = [];
let gameOver = false;
let movePlayer = 1;

function initializeBoard(boardSize) {
    for (let row = 0; row < boardSize; row++) {
        let boardRow = [];
        for (let col = 0; col < boardSize; col++) {
            boardRow.push('-');
        }
        board.push(boardRow);
    }
    console.table(board);
}

function playTicTac(boardSize) {
    initializeBoard(boardSize);
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
    if (movePlayer > 5) {
        gameOver = true;
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
if (rowValue.size == 1 || colValue.size == 1 || diagValue1.size == 1 || diagValue2.size == 1) {
    gameOver = true;
    console.log(`Le joueur ${player} a gagné!`);
}

}





playTicTac(3);