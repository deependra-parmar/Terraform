var beep = new Audio("./beep.wav");
var success = new Audio("./success.mp3");

var player1;
var player2;

var playerMarks1 = [];
var playerMarks2 = [];

var isResultOut = false;

const winPatterns = [
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [1, 4, 7],
    [2, 4, 6],
    [2, 5, 8],
    [3, 4, 5],
    [6, 7, 8]
]

var turn = true; // player 1 will start


const getNames = function () {
    player1 = document.getElementById("player1");
    player2 = document.getElementById("player2");

    player1.style.color = 'gold';
    player1.style.textDecoration = 'underline';
    player1.style.fontSize = '2.25rem';
}

getNames();

const announceResult = (player) => {
    success.play();
    isResultOut = true;
    const winnerName = player === 0 ? "Player 1" : "Player 2";
    document.querySelector(".result").classList.add('show');
    document.querySelector(".message").classList.add('show');

    if (player == -1) {
        document.querySelector(".message").innerText = `Match Draw 😔`
    }
    else {
        document.querySelector(".message").innerText = `${winnerName} Won 🥳`
    }

    const button = document.createElement('button');
    button.innerHTML = '<i class="fa-solid fa-xmark"></i>'
    button.classList.add('close-button');
    button.onclick = hide;
    document.querySelector(".result").appendChild(button)
}

const reset = () => {
    playerMarks1 = []
    playerMarks2 = []

    cells.forEach((cell) => {
        cell.innerHTML = '';
        cell.disabled = false;
    })
    turn = true;
    isResultOut = false;
}

const show = () => {
    document.querySelector(".result").classList.add('show');
    document.querySelector(".message").classList.add('show');
}
const hide = () => {
    document.querySelector(".result").classList.remove('show');
    document.querySelector(".message").classList.remove('show');
    reset();
}

const checkWin = function (array, player) {
    winPatterns.forEach((win) => {
        var matchCount = 0;

        for (let i = 0; i < win.length; i++) {
            if (array.includes(win[i]))
                matchCount++;

            if (matchCount == 3) {
                console.log("Announcing result")
                announceResult(player);
                break;
            }
        }
    })
}

let cells = document.querySelectorAll(".cell");

cells.forEach((cell) => {
    cell.addEventListener('click', () => {
        beep.play();
        const cellNum = parseInt(cell.getAttribute('value'));

        if (turn) {
            cell.innerHTML = '<i class="fa-solid fa-xmark"></i>';
            playerMarks1.push(cellNum);
            playerMarks1.sort();

            // changing the color of name according to turn
            player2.style.color = "gold"
            player2.style.textDecoration = 'underline';
            player2.style.fontSize = '2.25rem';
            player1.style.color = "white"

            // checking win of player 1 only if plays >= 3

            if (playerMarks1.length >= 3)
                checkWin(playerMarks1, 0);
        }
        else {
            cell.innerHTML = '<i class="fa-regular fa-circle"></i>';
            playerMarks2.push(cellNum)
            playerMarks2.sort();

            // changing the color of name according to turn
            player1.style.color = "gold"
            player1.style.textDecoration = 'underline';
            player1.style.fontSize = '2.25rem';
            player2.style.color = "white"


            // checking win of player 2 only if plays >= 3

            if (playerMarks2.length >= 3)
                checkWin(playerMarks2, 1);
        }

        turn = !turn;
        cell.disabled = true;

        if (playerMarks1.length + playerMarks2.length == 9 && !isResultOut) {
            announceResult(-1);
        }
    })
})