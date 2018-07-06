import { CANVAS_WIDTH, CANVAS_HEIGHT } from "./constants.js";

let context;
let spaceInvaderImage;
let spaceInvaderDamagedImage;
let backgroundImage;
let backgroundScrollX = 0;
let backgroundScrollXSpeed = 2;
let translatedX = 0;
let translatedY = 0;
// Number of renders before resetting the screen to original state
let screenShakeTurns = 0;

export function initializeCanvas() {
  const canvas = document.getElementById("canvas");
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  context = document.getElementById("canvas").getContext("2d");
  spaceInvaderImage = document.getElementById("spaceInvaderImage");
  spaceInvaderDamagedImage = document.getElementById("spaceInvaderDamagedImage");
  backgroundImage = document.getElementById("backgroundImage");
}

// Infinite scrolling background
export function drawBackground() {
  if (screenShakeTurns > 0) {
    screenShakeTurns--;
  }
  if (screenShakeTurns === 0) {
    context.translate(-translatedX, -translatedY);
    translatedX = 0;
    translatedY = 0;
  }
  context.clearRect(-translatedX, -translatedY, CANVAS_WIDTH, CANVAS_HEIGHT);

  if (backgroundScrollX >= CANVAS_WIDTH) {
    backgroundScrollX = 0;
  }

  backgroundScrollX += backgroundScrollXSpeed;

  context.drawImage(backgroundImage, -backgroundScrollX, 0, backgroundImage.width, backgroundImage.height);
  context.drawImage(
    backgroundImage,
    CANVAS_WIDTH - backgroundScrollX,
    0,
    backgroundImage.width,
    backgroundImage.height,
  );
}

export function deathScreen() {
  context.fillStyle = "red";
  context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

// Shake screen when enemy damaged
export function drawEnemy(x, y, size, isDamaged) {
  if (isDamaged) {
    screenShakeTurns += 5;
    const dx = getRandomNumber(-10, 10);
    const dy = getRandomNumber(-10, 10);
    context.translate(dx, dy);
    translatedX += dx;
    translatedY += dy;
  }
  context.drawImage(isDamaged ? spaceInvaderDamagedImage : spaceInvaderImage, x, y, size, size);
}

export function drawEnemyExplosion(x, y, size) {
  drawFilledCircle(x, y, size, "red");
  drawFilledCircle(x, y, size / 2, "orange");
}

export function drawFilledCircle(x, y, radius, color) {
  context.fillStyle = color;
  context.beginPath();
  context.arc(x, y, radius, 0, 2 * Math.PI);
  context.closePath();
  context.fill();
}

export function drawPlayer(x, y, size) {
  context.fillStyle = "blue";
  context.beginPath();
  context.arc(x, y, size, 0, 2 * Math.PI);
  context.closePath();
  context.fill();
  context.fillStyle = "skyblue";
  context.beginPath();
  context.moveTo(x - size, y - size);
  context.lineTo(x - size, y + size);
  context.lineTo(x + size, y);
  context.closePath();
  context.fill();
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
