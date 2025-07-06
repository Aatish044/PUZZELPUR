const gameList = document.getElementById('gameList');
const gameItems = gameList.querySelectorAll('.game-item');
const description = document.getElementById('gameDescription');
const startButton = document.getElementById('startButton');

let selectedIndex = 0;

function updateSelectedGame(index) {
  if (index < 0 || index >= gameItems.length) return;
  selectedIndex = index;

  gameItems.forEach((item, idx) => {
    item.classList.toggle('selected', idx === selectedIndex);
  });

  const selectedItem = gameItems[selectedIndex];
  description.textContent = selectedItem.getAttribute('data-desc');

  description.appendChild(startButton);
  startButton.style.display = 'inline-block';

  const gameName = selectedItem.getAttribute('data-game');
  startButton.textContent = `Start ${gameName.charAt(0).toUpperCase() + gameName.slice(1)}`;

  startButton.onclick = () => {
    if (gameName === 'mine') {
      window.location.href = 'findMine.html';
    } else if (gameName === 'tictactoe') {
      window.location.href = 'tic.html';
    } else {
      window.location.href = 'mathgame.html';
    }
  };
}

gameItems.forEach((item, idx) => {
  item.addEventListener('click', () => updateSelectedGame(idx));
  item.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      updateSelectedGame(idx);
    }
  });
});

updateSelectedGame(selectedIndex);
