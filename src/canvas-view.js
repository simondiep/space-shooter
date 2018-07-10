import { CANVAS_WIDTH, CANVAS_HEIGHT } from "./constants.js";

let context;
let backgroundImage;
let backgroundScrollX = 0;
let backgroundScrollXSpeed = 2;
let screenShakeTranslatedX = 0;
let screenShakeTranslatedY = 0;
// Number of renders before resetting the screen to original state
let screenShakeDuration = 0;

export function initializeCanvas() {
  const canvas = document.getElementById("canvas");
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  context = document.getElementById("canvas").getContext("2d");
  backgroundImage = document.getElementById("backgroundImage");
}

// Infinite scrolling background
export function drawBackground() {
  if (screenShakeDuration > 0) {
    screenShakeDuration--;
  }
  if (screenShakeDuration === 0) {
    context.translate(-screenShakeTranslatedX, -screenShakeTranslatedY);
    screenShakeTranslatedX = 0;
    screenShakeTranslatedY = 0;
  }
  context.clearRect(-screenShakeTranslatedX, -screenShakeTranslatedY, CANVAS_WIDTH, CANVAS_HEIGHT);

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

export function drawEnemy(enemy) {
  context.drawImage(
    enemy.turnsToDisplayDamage > 0 ? enemy.images.damaged : enemy.images.normal,
    enemy.x - enemy.size,
    enemy.y - enemy.size,
    enemy.size * 2,
    enemy.size * 2,
  );
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

export function shakeScreen(scale) {
  screenShakeDuration += 2 * scale;
  const dx = getRandomNumber(-5 * scale, 5 * scale);
  const dy = getRandomNumber(-5 * scale, 5 * scale);
  context.translate(dx, dy);
  screenShakeTranslatedX += dx;
  screenShakeTranslatedY += dy;
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
