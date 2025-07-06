const gridSize = 20;
const grid = document.getElementById('grid');
const movesLeftSpan = document.getElementById('movesLeft');
const timeSpan = document.getElementById('time');
const modal = document.getElementById('endModal');
const endMessage = document.getElementById('endMessage');
const descriptionModal = document.getElementById('descriptionModal');
let pausedManually = false;
let descriptionOpen = false;

let moves = 5;
let timer = 0;
let interval;
let paused = false;
let mine = { x: 0, y: 0 };

function initGrid() {
  grid.innerHTML = '';
  for (let i = 0; i < gridSize * gridSize; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.index = i;
    grid.appendChild(cell);
  }
}

function getCoords(index) {
  return { x: index % gridSize, y: Math.floor(index / gridSize) };
}

function setRandomMine() {
  mine.x = Math.floor(Math.random() * gridSize);
  mine.y = Math.floor(Math.random() * gridSize);
}

function updateMovesDisplay() {
  movesLeftSpan.textContent = moves;
}

function startTimer() {
  interval = setInterval(() => {
    if (!paused) {
      timer++;
      timeSpan.textContent = timer;
    }
  }, 1000);
}

function endGame(message) {
  clearInterval(interval);
  endMessage.textContent = message;
  modal.style.display = 'block';
}

function handleCellClick(e) {
  if (paused) return;

  const cell = e.target;
  if (cell.classList.contains('revealed')) return;

  const index = parseInt(cell.dataset.index);
  const { x, y } = getCoords(index);
  const distance = Math.abs(x - mine.x) + Math.abs(y - mine.y);

  cell.textContent = distance;
  cell.classList.add('revealed');

  if (distance === 0) {
    endGame("🎉 You found the mine!");
  } else {
    moves--;
    updateMovesDisplay();
    if (moves === 0) {
      endGame("💥 Out of moves!");
    }
  }
}

function restartGame() {
  modal.style.display = 'none';
  descriptionModal.style.display = 'none';
  const level = document.getElementById('level').value;
  moves = level === 'easy' ? 5 : level === 'normal' ? 4 : 3;
  timer = 0;
  paused = false;
  updateMovesDisplay();
  timeSpan.textContent = timer;
  clearInterval(interval);
  startTimer();
  initGrid();
  setRandomMine();

  document.querySelectorAll('.cell').forEach(cell => {
    cell.addEventListener('click', handleCellClick);
  });
}

function goHome() {
  window.location.href = 'home.html';
}

function toggleDescription() {
  const modal = document.getElementById('descriptionModal');

  if (modal.style.display === 'block') {
    modal.style.display = 'none';
    descriptionOpen = false;
    paused = pausedManually;
  } else {
    modal.style.display = 'block';
    descriptionOpen = true;
    pausedManually = paused;
    paused = true;
  }

  const pauseBtn = document.getElementById('resumePause');
  pauseBtn.textContent = paused ? 'Resume' : 'Pause';
}

document.getElementById('resumePause').onclick = function () {
  paused = !paused;
  this.textContent = paused ? 'Resume' : 'Pause';
};

document.getElementById('level').addEventListener('change', restartGame);

restartGame();
