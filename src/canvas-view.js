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

export function drawIntroScreen() {
  context.drawImage(backgroundImage, 0, 0, backgroundImage.width, backgroundImage.height);
  drawText(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 3, "#dbfaff", "Space Shooter");
  drawText(CANVAS_WIDTH / 2, (CANVAS_HEIGHT * 2) / 3, "#fffbbc", "Press Space to begin", 36);
  drawText(CANVAS_WIDTH / 2, (CANVAS_HEIGHT * 4) / 5, "#dbdbdb", "WASD or Arrow keys to move, Space to shoot", 24);
}

export function drawGameOverScreen() {
  resetScreenShake();
  drawText(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 3, "#ffa0a0", "Game Over");
  drawText(CANVAS_WIDTH / 2, (CANVAS_HEIGHT * 2) / 3, "#fffbbc", "Press Space to restart", 36);
}

function drawText(centerX, centerY, color, text, fontSize = 72) {
  context.save();
  context.lineWidth = 5;
  context.strokeStyle = "black";
  context.fillStyle = color;
  context.font = `bold ${fontSize}px Arial`;

  const textWidth = context.measureText(text).width;
  const textHeight = 24;
  let x = centerX - textWidth / 2;
  let y = centerY + textHeight / 2;

  context.strokeText(text, x, y);
  context.fillText(text, x, y);
  context.restore();
}

function resetScreenShake() {
  screenShakeDuration = 0;
  context.translate(-screenShakeTranslatedX, -screenShakeTranslatedY);
  screenShakeTranslatedX = 0;
  screenShakeTranslatedY = 0;
}

// Infinite scrolling background
export function drawBackground() {
  if (screenShakeDuration > 0) {
    screenShakeDuration--;
  }
  if (screenShakeDuration === 0) {
    resetScreenShake();
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

export function drawPlayer(player) {
  context.drawImage(
    player.turnsAlive % 5 === 0 ? player.images.one : player.images.two,
    player.x - player.size,
    player.y - player.size,
    player.size * 2,
    player.size * 2,
  );
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
