const bestTimeElem = document.getElementById('bestTime');
const playAgainBtn = document.getElementById('playAgainBtn');

let bestTimeInSeconds = localStorage.getItem('bestTime')
  ? parseInt(localStorage.getItem('bestTime'))
  : null;

function updateBestTimeDisplay() {
  if (bestTimeInSeconds !== null) {
    const minutes = Math.floor(bestTimeInSeconds / 60);
    const seconds = bestTimeInSeconds % 60;
    bestTimeElem.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  } else {
    bestTimeElem.textContent = '--:--';
  }
}
updateBestTimeDisplay();

const cards = document.querySelectorAll('.card');
let flippedCards = [];
let lockBoard = false;

let moveCount = 0;
let missCount = 0;
let timerInterval = null;
let secondsElapsed = 0;
let gameStarted = false;

const moveCountElem = document.getElementById('moveCount');
const missCountElem = document.getElementById('missCount');
const timeElem = document.getElementById('time');

function startTimer() {
  timerInterval = setInterval(() => {
    secondsElapsed++;
    updateTimeDisplay();
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function updateTimeDisplay() {
  const minutes = Math.floor(secondsElapsed / 60);
  const seconds = secondsElapsed % 60;
  timeElem.textContent = `${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
}

function flipCard() {
  if (lockBoard) return;
  if (this === flippedCards[0]) return;

  if (!gameStarted) {
    gameStarted = true;
    startTimer();
  }
   const flipSound = document.getElementById('flipSound');
 if (soundEnabled && flipSound) {
  flipSound.play();
  flipSound.volume = 1;
}

  flipSound.volume = 1

  this.classList.add('flip');
  flippedCards.push(this);

  if (flippedCards.length === 2) {
    moveCount++;
    moveCountElem.textContent = moveCount;
    checkMatch();
  }
}
function checkMatch() {
  lockBoard = true;
  const isMatch = flippedCards[0].dataset.image === flippedCards[1].dataset.image;

  if (!isMatch) {
    missCount++;
    missCountElem.textContent = missCount;

    setTimeout(() => {
      flippedCards[0].classList.remove('flip');
      flippedCards[1].classList.remove('flip');
      resetBoard();
    }, 500);
 } else {
  setTimeout(() => {
    flippedCards[0].classList.add('matched', 'animate-out');
    flippedCards[1].classList.add('matched', 'animate-out');

    setTimeout(() => {
      flippedCards[0].style.visibility = 'hidden';
      flippedCards[1].style.visibility = 'hidden';
      flippedCards[0].classList.remove('animate-out');
      flippedCards[1].classList.remove('animate-out');
      resetBoard();
      checkGameEnd();
    }, 400);
  }, 300);
}

}

function resetBoard() {
  flippedCards = [];
  lockBoard = false;
}

cards.forEach(card => card.addEventListener('click', flipCard));

function checkGameEnd() {
  const allCards = document.querySelectorAll('.card'); // ⬅ updated line
  if ([...allCards].every(card => card.classList.contains('matched'))) {
    stopTimer();
    const winSound = document.getElementById('winSound');
    if (soundEnabled && winSound) {
  winSound.play();
  winSound.volume = 0.7;
}

    winSound.volume = 0.7;

    if (bestTimeInSeconds === null || secondsElapsed < bestTimeInSeconds) {
      bestTimeInSeconds = secondsElapsed;
      localStorage.setItem('bestTime', bestTimeInSeconds);
      updateBestTimeDisplay();
    }

    const endStats = document.getElementById('endStats');
    if (endStats) endStats.classList.remove('hidden');

    if (playAgainBtn) playAgainBtn.classList.remove('hidden');

    document.getElementById('finalMoves').textContent = moveCount;
    document.getElementById('finalMisses').textContent = missCount;
    document.getElementById('finalTime').textContent = timeElem.textContent;

    const grid = document.querySelector('.grid');
    if (grid) grid.style.display = 'none';
  }
}


function restartGame() {
  flippedCards = [];
  lockBoard = false;
  moveCount = 0;
  missCount = 0;
  secondsElapsed = 0;
  gameStarted = false;

  moveCountElem.textContent = '0';
  missCountElem.textContent = '0';
  timeElem.textContent = '00:00';
  stopTimer();

  const endStats = document.getElementById('endStats');
  if (endStats) endStats.classList.add('hidden');

  if (playAgainBtn) playAgainBtn.classList.add('hidden');

  const grid = document.querySelector('.grid');
  if (grid) grid.style.display = 'grid';

  const cardList = Array.from(grid.children);

  cardList.forEach(card => {
    card.classList.remove('flip', 'matched');
    card.style.visibility = 'visible';
  });

  for (let i = cardList.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cardList[i], cardList[j]] = [cardList[j], cardList[i]];
  }

  cardList.forEach(card => grid.appendChild(card));

  cardList.forEach(card => {
    card.removeEventListener('click', flipCard);
    card.addEventListener('click', flipCard);
  });
}

(function shuffleOnLoad() {
  const grid = document.querySelector('.grid');
  const cardList = Array.from(grid.children);
  for (let i = cardList.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cardList[i], cardList[j]] = [cardList[j], cardList[i]];
  }
  cardList.forEach(card => grid.appendChild(card));
})();

if (playAgainBtn) {
  playAgainBtn.addEventListener('click', restartGame);
}
document.querySelector('.restart').addEventListener('click', restartGame);
const themeToggle = document.getElementById('themeToggle');

function applyTheme(theme) {
  document.body.classList.toggle('dark-mode', theme === 'dark');
  themeToggle.textContent = theme === 'dark' ? '🌞' : '🌙';
}

function loadTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  applyTheme(savedTheme);
}

themeToggle.addEventListener('click', () => {
  const newTheme = document.body.classList.contains('dark-mode') ? 'light' : 'dark';
  localStorage.setItem('theme', newTheme);
  applyTheme(newTheme);
});

loadTheme(); 
const grid = document.querySelector('.grid');
const levelSelectorContainer = document.getElementById('levelSelectorContainer');
const gridContainer = document.querySelector('.grid-container');

function startGame(level) {
  levelSelectorContainer.style.display = 'none';

  // Show loading screen
  const loadingScreen = document.getElementById('loadingScreen');
  loadingScreen.style.display = 'flex';

  setTimeout(() => {
    // Hide loading screen after delay
    loadingScreen.style.display = 'none';

    // Show game grid
    gridContainer.style.display = 'block';
    createCardsForLevel(level);
    
    // Update history state
    history.pushState({ screen: 'game' }, '', '#game');
    
    // Show restart button
    document.querySelector('.restart').style.display = 'inline-block';
    // document.querySelector('#stats').style.display = 'inline-block';

  }, 500); // 1000ms = 1 second delay
}


function createCardsForLevel(level) {
  grid.innerHTML = ''; 

  let totalCards;
  if (level === 'easy') totalCards = 8;
  else if (level === 'medium') totalCards = 12; 
  else totalCards = 24;                    

  const numPairs = totalCards / 2;

  const imageIndexes = [];
  for (let i = 0; i < numPairs; i++) {
    imageIndexes.push(i, i); 
  }

  for (let i = imageIndexes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [imageIndexes[i], imageIndexes[j]] = [imageIndexes[j], imageIndexes[i]];
  }

  imageIndexes.forEach(imgIndex => {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.image = imgIndex;

    const imgPath = `assets/photos/img${imgIndex}.jpg`;

    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front"></div>
        <div class="card-back">
          <img src="${imgPath}" alt="Card ${imgIndex}">
        </div>
      </div>
    `;

    card.addEventListener('click', flipCard);
    grid.appendChild(card);
  });

  grid.className = 'grid ' + level;

  if (typeof restartGame === 'function') {
    restartGame();
  }
}
window.addEventListener('popstate', (event) => {
  if (!event.state || event.state.screen === 'selector') {
    
    levelSelectorContainer.style.display = 'flex';
    gridContainer.style.display = 'none';
    restartGame(); 
  }
});
history.replaceState({ screen: 'selector' }, '', window.location.pathname);
window.addEventListener('popstate', () => { 
  levelSelectorContainer.style.display = 'flex';
  gridContainer.style.display = 'none';
  document.querySelector('.restart').style.display = 'none';
});
const soundToggle = document.getElementById('soundToggle');
let soundEnabled = true;

function updateSoundIcon() {
  soundToggle.textContent = soundEnabled ? '🔊' : '🔇';
}

soundToggle.addEventListener('click', () => {
  soundEnabled = !soundEnabled;
  updateSoundIcon();
  localStorage.setItem('sound', soundEnabled ? 'on' : 'off');
});
function loadSoundSetting() {
  const savedSound = localStorage.getItem('sound');
  soundEnabled = savedSound !== 'off'; // default to ON
  updateSoundIcon();
}
loadSoundSetting();




