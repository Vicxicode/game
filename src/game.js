const canvas = document.querySelector("#game");
const game = canvas.getContext("2d");
const arriba = document.querySelector("#up");
const izquierda = document.querySelector("#left");
const derecha = document.querySelector("#right");
const abajo = document.querySelector("#down");
const vidas = document.querySelector("#lives");
const tiempo = document.querySelector("#times");
const reco = document.querySelector("#reco");
const result = document.querySelector("#result");

let canvasSize;
let elementSize;
let level = 0;
let lives = 3;
let timeStart;
let timePlayer;
let timeInterval;

let playerPosition = {
  x: undefined,
  y: undefined,
};

const giftPosition = {
  x: undefined,
  y: undefined
}

let enemiesPosition = []

window.addEventListener("load", setCanvasSize);
window.addEventListener("resize", setCanvasSize);

function setCanvasSize() {
  if (window.innerHeight > window.innerWidth) {
    canvasSize = window.innerWidth * 0.8;
  } else {
    canvasSize = window.innerHeight * 0.8;
  }

  canvasSize = Number(canvasSize.toFixed(0));

  canvas.setAttribute("width", canvasSize);
  canvas.setAttribute("height", canvasSize);

  elementSize = canvasSize / 10;
  playerPosition.x = undefined;
  playerPosition.y = undefined;
  startGame();
}

function startGame() {
  game.font = elementSize + "px verdana";
  game.textAlign = "end";

  const map = maps[level];
    if (!map) {
      gameWin();
      return;
    }

    if (!timeStart) {
      timeStart = Date.now();
      timeInterval = setInterval(showTime,100);
      showRecord();
    }

  const mapRows = map.trim().split("\n");
  const mapRowCols = mapRows.map((row) => row.trim().split(""));

  showLives();

  enemiesPosition = [];
  game.clearRect(0,0,canvasSize,canvasSize);

  mapRowCols.forEach((row, rowI) => {
    row.forEach((col, colI) => {
      const emoji = emojis[col];
      const elementX = elementSize * (colI + 1);
      const elementY = (elementSize) * (rowI + 1);
      game.fillText(emoji, elementX, elementY);
      if (col == "O") {
        if (!playerPosition.x && !playerPosition.x) {
            playerPosition.x = elementX;
            playerPosition.y = elementY;
        }
      } else if (col == 'I') {
        giftPosition.x = elementX,
        giftPosition.y = elementY
      } else if (col == 'X') {
        enemiesPosition.push({
          x: elementX,
          y: elementY
        })
      }
    });
  });

  movePlayer();
}

function movePlayer() {
  const giftCollisionX = playerPosition.x.toFixed(3) == giftPosition.x.toFixed(3);
  const giftCollisionY = playerPosition.y.toFixed(3) == giftPosition.y.toFixed(3);
  const giftCollision = giftCollisionX && giftCollisionY;
    if (giftCollision) {
        levelWin();
    }

  const enemiesCollision = enemiesPosition.find(enemy => {
    const enemiesCollisionX = enemy.x.toFixed(3) == playerPosition.x.toFixed(3);
    const enemiesCollisionY = enemy.y.toFixed(3) == playerPosition.y.toFixed(3);
    return enemiesCollisionX && enemiesCollisionY;
  });
    if (enemiesCollision) {
      failLevel();
    }
  game.fillText(emojis["PLAYER"], playerPosition.x, playerPosition.y);
}

function levelWin() {
  level++;
  startGame();
}

function gameWin() {
  console.log('ganaste el juego');
  clearInterval(timeInterval);

  const record = localStorage.getItem('newRecord');
  const playerTime = Date.now()- timeStart;

    if (record) {
      if (record > playerTime) {
        localStorage.setItem('newRecord', playerTime);
        result.innerHTML = 'superaste el record';
      } else {
        result.innerHTML = 'no superaste el record';
      }
    } else {
      localStorage.setItem('newRecord', playerTime);
      result.innerHTML = 'tu primer tiempo';
    }
    console.log({record, playerTime});
}

function failLevel() {
  lives--;
  if (lives < 0) {
    level = 0;
    lives = 3;
    timeStart = undefined;
  }  
  
  playerPosition.x = undefined;
  playerPosition.y = undefined;
  startGame();
}

function showLives() {
  const cora = Array(lives).fill(emojis['HEART']);
  vidas.innerHTML = '';
  cora.forEach(heart => vidas.append(heart));
}

function showTime() {
  tiempo.innerHTML = Date.now()- timeStart;
}

function showRecord() {
  reco.innerHTML = localStorage.getItem('newRecord');
}

function moveByKeys(e) {
  if (e.key == "ArrowUp") moveUp();
  else if (e.key == "ArrowLeft") moveLeft();
  else if (e.key == "ArrowRight") moveRight();
  else if (e.key == "ArrowDown") moveDown();
}

function moveUp() {
    if ((playerPosition.y - elementSize) < elementSize) {

    } else {
        playerPosition.y -= elementSize;
        startGame();
    }
}
function moveLeft() {
    if ((playerPosition.x - elementSize) < elementSize) {

    } else {
        playerPosition.x -= elementSize;
        startGame();
    }    
}
function moveRight() {
    if ((playerPosition.x + elementSize) > canvasSize) {

    } else {
        playerPosition.x += elementSize;
        startGame();
    } 
}     
function moveDown() {
    if ((playerPosition.y + elementSize) > canvasSize) {

    } else {
        playerPosition.y += elementSize;
        startGame();
    }    
}

window.addEventListener("keydown", moveByKeys);

arriba.addEventListener("click", moveUp);
izquierda.addEventListener("click", moveLeft);
derecha.addEventListener("click", moveRight);
abajo.addEventListener("click", moveDown);
