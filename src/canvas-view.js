import { CANVAS_WIDTH, CANVAS_HEIGHT } from "./constants.js";

let context;
let spaceInvaderImage;

export function initializeCanvas() {
  const canvas = document.getElementById("canvas");
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  context = document.getElementById("canvas").getContext("2d");
  spaceInvaderImage = document.getElementById("spaceInvaderImage");
}

export function clearScreen() {
  context.fillStyle = "black";
  context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

export function deathScreen() {
  context.fillStyle = "red";
  context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

export function drawEnemy(x, y, size) {
  // To see collision circle, uncomment this
  // context.fillStyle = enemyColor;
  // context.beginPath();
  // context.arc(enemy.x, enemy.y, enemy.size, 0, 2 * Math.PI);
  // context.closePath();
  // context.fill();
  context.drawImage(spaceInvaderImage, x, y, size, size);
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
