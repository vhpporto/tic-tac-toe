const socket = io();
const cells = document.querySelectorAll(".cell");

const modal = document.getElementById("game-over-modal");
const winnerAnnouncement = document.getElementById("winner-announcement");
const restartBtn = document.getElementById("restart-btn");

let currentPlayer = "x";
let isMyTurn = false; // Define que inicialmente não é a vez do jogador

function checkWinner(board, player) {
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // linhas
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // colunas
    [0, 4, 8],
    [2, 4, 6], // diagonais
  ];

  return winningCombinations.some((combination) => {
    return combination.every((index) => {
      return board[index] === player;
    });
  });
}

cells.forEach((cell) => {
  cell.addEventListener("click", (e) => {
    if (!e.target.textContent && isMyTurn) {
      socket.emit("move", e.target.dataset.index, currentPlayer);
    }
  });
});

socket.on("start", (player) => {
  currentPlayer = player;
  if (player === "x") {
    isMyTurn = true;
    alert("Você é 'X'. Comece a jogar!");
  } else {
    alert("Você é 'O'. Aguarde sua vez.");
  }
});

socket.on("move", (index, player) => {
  cells[index].textContent = player;

  const boardState = Array.from(cells).map((cell) => cell.textContent);

  if (checkWinner(boardState, player)) {
    alert(`${player} venceu!`);
    location.reload();
  } else if (!boardState.includes("")) {
    alert("Empate!");
    location.reload();
  } else {
    isMyTurn = !isMyTurn;
  }
});

socket.on("move", (index, player) => {
  cells[index].textContent = player;
  currentPlayer = player === "x" ? "o" : "x";
});
