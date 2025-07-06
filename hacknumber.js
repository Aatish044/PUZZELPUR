let x = 0, n = 0;
let moveLimit = 7;
let movesLeft = 0;
let logHistory = [];
let timer = 0, timerInterval;
let paused = false;
let gameEnded = false;

function startGame() {
  x = Math.floor(Math.random() * 1e9) + 1;
  n = Math.floor(Math.random() * 1e9) + 1;
  logHistory = [x];
  gameEnded = false;
  document.getElementById("target-number").textContent = n;
  setLevel(document.getElementById("level").value);
  document.getElementById("log").innerHTML = '<div>> Game logs will appear here.</div>';
  updateLog("Game started. Perform operations to reach the target.");
  startTimer();
}

function setLevel(level) {
  moveLimit = (level === "hard") ? 5 : 7;
  movesLeft = moveLimit;
  updateMoves();
}

function updateMoves() {
  document.getElementById("moves-left").textContent = movesLeft;
}

function updateLog(msg) {
  const log = document.getElementById("log");
  if (log.innerHTML.includes('Game logs will appear here.')) log.innerHTML = '';
  log.innerHTML += `<div>> ${msg}</div>`;
  log.scrollTop = log.scrollHeight;
}

function startTimer() {
  clearInterval(timerInterval);
  timer = 0;
  timerInterval = setInterval(() => {
    if (!paused) {
      timer++;
      document.getElementById("timer").textContent = formatTime(timer);
    }
  }, 1000);
}

function formatTime(t) {
  let m = String(Math.floor(t / 60)).padStart(2, '0');
  let s = String(t % 60).padStart(2, '0');
  return `${m}:${s}`;
}

function makeMove() {
  if (gameEnded || movesLeft <= 0) return;
  const op = document.getElementById("operation").value;
  const val = document.getElementById("value").value.trim();
  let success = false;

  if (op === "digit") {
    x = sumDigits(x);
    success = true;
    updateLog(`Digit sum applied.`);
  } else {
    let y = Number(val);
    if (isNaN(y)) {
      alert("Enter a valid number.");
      return;
    }
    if (op === "add" && x + y >= 1 && x + y <= 1e18) {
      x += y; success = true; updateLog(`add ${y} applied.`);
    } else if (op === "mul" && y >= 1 && x * y <= 1e18) {
      x *= y; success = true; updateLog(`mul ${y} applied.`);
    } else if (op === "div" && y >= 1 && x % y === 0) {
      x = Math.floor(x / y); success = true; updateLog(`div ${y} applied.`);
    } else {
      updateLog(`${op} ${y} failed.`);
    }
  }

  movesLeft--;
  updateMoves();

  if (success) {
    logHistory.push(x);
    if (x === n) endGame(true);
    else if (movesLeft === 0) endGame(false);
  } else {
    if (movesLeft === 0) endGame(false);
  }

  document.getElementById("value").value = "";
}

function sumDigits(num) {
  return num.toString().split('').reduce((a, b) => a + Number(b), 0);
}

function endGame(won) {
  clearInterval(timerInterval);
  gameEnded = true;
  updateLog(won ? "🎉 You WON!" : "❌ You LOST.");
  updateLog("📜 Transformation trail:");
  logHistory.forEach((val, idx) => updateLog(`Step ${idx + 1}: ${val}`));
}

function toggleDescription() {
  const modal = document.getElementById("description-modal");
  paused = modal.style.display !== "flex";
  modal.style.display = paused ? "flex" : "none";
}

function resumeGame() {
  if (gameEnded) return;
  paused = !paused;
  updateLog(paused ? "⏸ Game paused." : "▶️ Game resumed.");
}

function restartGame() {
  startGame();
}

function goHome() {
  window.location.href = 'index.html';
}

function undoMove() {
  if (logHistory.length <= 1 || gameEnded) return;
  logHistory.pop();
  x = logHistory[logHistory.length - 1];
  movesLeft++;
  updateMoves();
  updateLog("Undo last move.");
}

window.onload = startGame;