let origBoard;
const human = "X";
const ai = "O";
const winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

const cells = document.querySelectorAll(".cell");
const endgame = document.querySelector(".endgame");

const startGame = () => {
    endgame.style.display = "none";
    origBoard = Array.from(Array(9).keys());
    cells.forEach((cell) => {
        cell.innerHTML = "";
        cell.style.removeProperty("background-color");
        cell.addEventListener("click", turnClick, false);
    });
};

const turnClick = (square) => {
    if (typeof origBoard[square.target.id] == "number") {
        turn(square.target.id, human);
        if (!checkTie()) turn(bestSpot(), ai);
    }
};

const turn = (squareId, player) => {
    origBoard[squareId] = player;
    // console.log(origBoard);
    document.getElementById(squareId).innerHTML = player;
    let gameWon = checkWin(origBoard, player);
    if (gameWon) gameOver(gameWon);
};

const checkWin = (board, player) => {
    let plays = board.reduce((a, e, i) => (e === player ? a.concat(i) : a), []);
    // console.log(plays);
    let gameWon = null;
    for (let [index, win] of winCombos.entries()) {
        if (win.every((elem) => plays.indexOf(elem) > -1)) {
            gameWon = { index, player };
            break;
        }
    }
    return gameWon;
};

const gameOver = (gameWon) => {
    for (let index of winCombos[gameWon.index]) {
        document.getElementById(index).style.backgroundColor = gameWon.player == human ? "#5cb85c80" : "#d9534f80";
    }
    for (var i = 0; i < cells.length; i++) {
        cells[i].removeEventListener("click", turnClick, false);
    }
    declareWinner(gameWon.player == human ? "You win!" : "You lose.");
};

const declareWinner = (who) => {
    setTimeout(() => {
        document.querySelector(".endgame").style.display = "flex";
        document.querySelector(".endgame .text").innerText = who;
    }, 500);
};

const emptySquares = () => {
    return origBoard.filter((s) => typeof s == "number");
};

const bestSpot = () => {
    return minimax(origBoard, ai).index;
    // return emptySquares()[0];
};

const checkTie = () => {
    if (emptySquares().length === 0) {
        cells.forEach((cell) => {
            cell.style.backgroundColor = "#5bc0de80";
            cell.removeEventListener("click", turnClick, false);
        });
        declareWinner("Tie!");
        return true;
    }
    return false;
};

const minimax = (newBoard, player) => {
    var availSpots = emptySquares();

    if (checkWin(newBoard, human)) {
        return { score: -10 };
    } else if (checkWin(newBoard, ai)) {
        return { score: 10 };
    } else if (availSpots.length === 0) {
        return { score: 0 };
    }

    var moves = [];

    for (var i = 0; i < availSpots.length; i++) {
        var move = {};
        move.index = newBoard[availSpots[i]];
        newBoard[availSpots[i]] = player;

        if (player == ai) {
            var result = minimax(newBoard, human);
            move.score = result.score;
        } else {
            var result = minimax(newBoard, ai);
            move.score = result.score;
        }

        newBoard[availSpots[i]] = move.index;

        moves.push(move);
    }
    console.log(moves);
    var bestMove;
    if (player === ai) {
        var bestScore = -10000;
        for (var i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        var bestScore = 10000;
        for (var i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
};

startGame();
