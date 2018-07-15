import {
  spawnAsteroid,
  spawnBoss,
  spawnHearty,
  spawnSpaceInvader,
  spawnSpeedster,
  spawnSpaceInvaderWave,
} from "./enemy-spawner.js";
import { keyDownHandler, keyUpHandler } from "./key-inputs.js";
import { clearEnemies, clearProjectiles, clearScore, resetPlayer, getPlayer } from "./persistent-entities.js";
import { update } from "./game-loop.js";
import { initializeShotModifiers } from "./shot-modifiers.js";
import { initializeCanvas, drawIntroScreen } from "./canvas-view.js";
import { muteSound } from "./sounds.js";
import { playBackgroundMusic } from "./sounds.js";

const ship1Image = document.getElementById("ship1Image");
const ship2Image = document.getElementById("ship2Image");

let oneTimeInit = false;

initializeCanvas();
drawIntroScreen();

function startGameEventListener(event) {
  event.preventDefault();
  switch (event.keyCode) {
    case 32: // Space
      startGame();
      break;
    case 67: // c
      document.getElementById("canvas").style.display = "none";
      document.getElementById("customization").style.display = "block";
      break;
  }
}

window.addEventListener("keydown", startGameEventListener);

let gameIntervals = [];

function startGame() {
  window.removeEventListener("keydown", startGameEventListener);
  document.getElementById("canvas").style.display = "block";
  document.getElementById("customization").style.display = "none";
  if (!oneTimeInit) {
    playBackgroundMusic();
    initializeShotModifiers();

    window.addEventListener("keydown", keyDownHandler);
    window.addEventListener("keyup", keyUpHandler);
    document.getElementById("muteButton").addEventListener("click", muteSound);
    oneTimeInit = true;
  }
  resetGameState();
  startGameIntervals();
}

export function stopGame() {
  for (let intervalId of gameIntervals) {
    clearInterval(intervalId);
  }
  gameIntervals.length = 0;
  window.addEventListener("keydown", startGameEventListener);
}

function startGameIntervals() {
  gameIntervals.push(setInterval(() => requestAnimationFrame(update), 1000 / 60));

  gameIntervals.push(setInterval(() => requestAnimationFrame(spawnAsteroid), 1000));
  gameIntervals.push(setInterval(() => requestAnimationFrame(spawnHearty), 1000));
  gameIntervals.push(setInterval(() => requestAnimationFrame(spawnSpaceInvader), 500));
  gameIntervals.push(setInterval(() => requestAnimationFrame(spawnSpeedster), 2000));
  gameIntervals.push(setInterval(() => requestAnimationFrame(spawnBoss), 10000));

  gameIntervals.push(setInterval(() => requestAnimationFrame(spawnSpaceInvaderWave), 30000));
}

function resetGameState() {
  clearScore();
  resetPlayer();
  clearEnemies();
  clearProjectiles();
}
