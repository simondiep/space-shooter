import { CANVAS_WIDTH, CANVAS_HEIGHT } from "./constants.js";
import { spawnBoss, spawnEnemy } from "./enemy-spawner.js";
import { keyDownHandler, keyUpHandler } from "./key-inputs.js";
import { clearEnemies, clearProjectiles, clearScore, getPlayer, replacePlayer } from "./persistent-entities.js";
import { update } from "./game-loop.js";
import { initializeShotModifiers } from "./shot-modifiers.js";
import { initializeCanvas } from "./canvas-view.js";

initializeCanvas();
initializeGame();
initializeShotModifiers();

window.addEventListener("keydown", keyDownHandler);
window.addEventListener("keyup", keyUpHandler);

setInterval(() => requestAnimationFrame(update), 1000 / 60);

setInterval(() => requestAnimationFrame(spawnEnemy), 500);

setInterval(() => requestAnimationFrame(spawnBoss), 20000);

// Reusable function to start or restart a game
export function initializeGame() {
  clearScore();
  document.getElementById("shot-type-single").checked = true;
  document.getElementById("shot-modifier-pierce-once").checked = false;
  document.getElementById("shot-modifier-fork-once").checked = false;
  replacePlayer({
    x: 50,
    y: CANVAS_HEIGHT / 2,
    size: 20,
    speed: 2,
    topSpeed: 10,
    directionsPressed: {
      UP: false,
      DOWN: false,
      LEFT: false,
      RIGHT: false,
    },
    vx: 0,
    vy: 0,
    projectileSize: 5,
    projectileSpeed: 5,
    shotType: "single",
    shotModifiers: {
      pierce: 0,
      fork: 0,
    },
  });
  clearEnemies();
  clearProjectiles();
}