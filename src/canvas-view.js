import { CANVAS_WIDTH, CANVAS_HEIGHT } from "./constants.js";

let context;
let spaceInvaderImage;
let spaceInvaderDamagedImage;
let backgroundImage;
let tempContext;
let backgroundScrollX = 0;
let backgroundScrollXSpeed = 2;

export function initializeCanvas() {
  const canvas = document.getElementById("canvas");
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  context = document.getElementById("canvas").getContext("2d");
  spaceInvaderImage = document.getElementById("spaceInvaderImage");
  spaceInvaderDamagedImage = document.getElementById("spaceInvaderDamagedImage");
  backgroundImage = document.getElementById("backgroundImage");
  const canvasTemp = document.createElement("canvas");
  canvasTemp.width = backgroundImage.width;
  canvasTemp.height = backgroundImage.height;
  tempContext = canvasTemp.getContext("2d");
  // Draw image on hidden context so it can be retrieved for performance
  tempContext.drawImage(backgroundImage, 0, 0, backgroundImage.width, backgroundImage.height);
}

export function drawBackground() {
  context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  if (backgroundScrollX <= backgroundScrollXSpeed) {
    backgroundScrollX = CANVAS_WIDTH;
  }

  backgroundScrollX -= backgroundScrollXSpeed;

  let imageData = tempContext.getImageData(CANVAS_WIDTH - backgroundScrollX, 0, backgroundScrollX, CANVAS_HEIGHT);
  context.putImageData(imageData, 0, 0);
  imageData = tempContext.getImageData(0, 0, CANVAS_WIDTH - backgroundScrollX, CANVAS_HEIGHT);
  context.putImageData(imageData, backgroundScrollX, 0);
}

export function deathScreen() {
  context.fillStyle = "red";
  context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

export function drawEnemy(x, y, size, isDamaged) {
  // To see collision circle, uncomment this
  // context.fillStyle = enemyColor;
  // context.beginPath();
  // context.arc(enemy.x, enemy.y, enemy.size, 0, 2 * Math.PI);
  // context.closePath();
  // context.fill();
  context.drawImage(isDamaged ? spaceInvaderDamagedImage : spaceInvaderImage, x, y, size, size);
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
