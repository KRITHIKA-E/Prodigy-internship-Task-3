// script.js

let board;
const playerO = 'O';
const playerX = 'X';
let currentPlayer = playerX;
const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];
const cells = document.querySelectorAll('.cell');
const message = document.getElementById('message');
const resetButton = document.getElementById('reset');

startGame();

function startGame() {
    board = Array.from(Array(9).keys());
    cells.forEach(cell => {
        cell.innerText = '';
        cell.style.removeProperty('background-color');
        cell.addEventListener('click', turnClick, false);
    });
    message.innerText = '';
    currentPlayer = playerX;
}

function turnClick(square) {
    if (typeof board[square.target.dataset.index] == 'number') {
        turn(square.target.dataset.index, currentPlayer);
        if (!checkWin(board, currentPlayer) && !checkTie()) {
            currentPlayer = currentPlayer === playerX ? playerO : playerX;
        }
    }
}

function turn(squareId, player) {
    board[squareId] = player;
    document.querySelector(`.cell[data-index="${squareId}"]`).innerText = player;
    let gameWon = checkWin(board, player);
    if (gameWon) gameOver(gameWon);
}

function checkWin(board, player) {
    let plays = board.reduce((a, e, i) =>
        (e === player) ? a.concat(i) : a, []);
    let gameWon = null;
    for (let [index, win] of winConditions.entries()) {
        if (win.every(elem => plays.indexOf(elem) > -1)) {
            gameWon = {index: index, player: player};
            break;
        }
    }
    return gameWon;
}

function gameOver(gameWon) {
    for (let index of winConditions[gameWon.index]) {
        document.querySelector(`.cell[data-index="${index}"]`).style.backgroundColor =
            gameWon.player === playerX ? "blue" : "red";
    }
    cells.forEach(cell => cell.removeEventListener('click', turnClick, false));
    declareWinner(gameWon.player === playerX ? "Player X wins!" : "Player O wins!");
}

function declareWinner(who) {
    message.innerText = who;
}

function checkTie() {
    if (board.every(s => typeof s != 'number')) {
        cells.forEach(cell => {
            cell.style.backgroundColor = "green";
            cell.removeEventListener('click', turnClick, false);
        });
        declareWinner("Tie Game!");
        return true;
    }
    return false;
}

resetButton.addEventListener('click', startGame);
