const boardElement = document.getElementById("board");
const status = document.getElementById("status");
const overlay = document.getElementById("paused-overlay");
const timerDisplay = document.getElementById("timer");
const modeSelector = document.getElementById("mode");
const endModal = document.getElementById("endModal");
const endText = document.getElementById("endText");

let board, userMoves, botMoves, friendMovesX, friendMovesO;
let gameOver, pause, timer, interval, currentPlayer;

function toggleDescription() {
  const modal = document.getElementById('descriptionModal');
  modal.style.display = modal.style.display === 'flex' ? 'none' : 'flex';
  if (modal.style.display === 'flex') {
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
  }
}

function updateTimer() {
  timer++;
  let m = String(Math.floor(timer / 60)).padStart(2, '0');
  let s = String(timer % 60).padStart(2, '0');
  timerDisplay.innerText = `Time: ${m}:${s}`;
}

function startTimer() {
  clearInterval(interval);
  interval = setInterval(updateTimer, 1000);
}

function togglePauseResume(btn) {
  pause = !pause;
  overlay.style.display = pause ? 'flex' : 'none';
  if (pause) clearInterval(interval);
  else startTimer();
  btn.innerText = pause ? "Resume" : "Pause";
}

function goHome() {
  window.location.href = 'index.html';
}

function resetGame() {
  board = Array(3).fill(null).map(() => Array(3).fill(""));
  userMoves = [], botMoves = [], friendMovesX = [], friendMovesO = [];
  gameOver = false; pause = false;
  currentPlayer = "X";
  document.getElementById("pause-btn").innerText = "Pause";
  overlay.style.display = "none";
  timer = 0; updateTimer(); startTimer();
  endModal.style.display = "none";

  status.innerText = modeSelector.value === "friend" ? "X's turn" : "Your turn";
  createBoard();
}

function createBoard() {
  boardElement.innerHTML = "";
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.dataset.row = r;
      cell.dataset.col = c;
      cell.innerText = board[r][c];
      cell.onclick = () => handleMove(r, c);
      boardElement.appendChild(cell);
    }
  }
}

function handleMove(r, c) {
  if (pause || gameOver || board[r][c] !== "") return;

  const mode = modeSelector.value;
  if (mode === "friend") {
    let moveList = currentPlayer === "X" ? friendMovesX : friendMovesO;
    makeMove(r, c, currentPlayer, moveList);
    if (checkWin(currentPlayer)) return showEnd(`${currentPlayer} wins!`);
    if (isBoardFull()) return showEnd("It's a draw!");
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    status.innerText = `${currentPlayer}'s turn`;
  } else {
    makeMove(r, c, "X", userMoves);
    if (checkWin("X")) return showEnd("You win!");
    if (isBoardFull()) return showEnd("It's a draw!");
    status.innerText = "Bot is thinking...";
    setTimeout(() => {
      let move = getBestBotMove();
      if (move) makeMove(move[0], move[1], "O", botMoves);
      if (checkWin("O")) return showEnd("You lose!");
      if (isBoardFull()) return showEnd("It's a draw!");
      status.innerText = "Your turn";
    }, 400);
  }
}

function makeMove(r, c, symbol, moveList) {
  board[r][c] = symbol;
  moveList.push([r, c]);
  if (moveList.length > 3) {
    const [oldR, oldC] = moveList.shift();
    board[oldR][oldC] = "";
  }
  createBoard();
}

function checkWin(player) {
  for (let i = 0; i < 3; i++) {
    if (board[i].every(cell => cell === player)) return true;
    if ([0, 1, 2].every(j => board[j][i] === player)) return true;
  }
  if ([0, 1, 2].every(i => board[i][i] === player)) return true;
  if ([0, 1, 2].every(i => board[i][2 - i] === player)) return true;
  return false;
}

function isBoardFull() {
  return board.flat().filter(x => x !== "").length === 9;
}

function getBestBotMove() {
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      if (board[r][c] === "") return [r, c];
    }
  }
  return null;
}

function showEnd(msg) {
  clearInterval(interval);
  gameOver = true;
  endText.innerText = msg;
  endModal.style.display = "flex";
}

resetGame();
