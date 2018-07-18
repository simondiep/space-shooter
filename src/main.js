import {
  spawnAsteroid,
  spawnBoss,
  spawnHearty,
  spawnSpaceInvader,
  spawnSpeedster,
  spawnSpaceInvaderWave,
} from "./enemy-spawner.js";
import { keyDownHandler, keyUpHandler } from "./key-inputs.js";
import { clearEnemies, clearProjectiles, clearScore, resetPlayer, setGameOver } from "./persistent-entities.js";
import { update } from "./game-loop.js";
import { initializeCanvas, drawIntroScreen } from "./canvas-view.js";
import {
  initializeShotTypesAndModifiers,
  initializeStatIncreaseButtons,
  populateShipCustomizationStats,
} from "./ship-customization.js";
import { muteSound } from "./sounds.js";
import { playBackgroundMusic, playBigExplosionSound } from "./sounds.js";

let oneTimePlayerInit = false;
let oneTimeCustomizationInit = false;

initializeCanvas();
drawIntroScreen();

function startGameEventListener(event) {
  event.preventDefault();
  switch (event.keyCode) {
    case 82: // r
      startGame();
      break;
    case 67: // c
      document.getElementById("canvas").style.display = "none";
      populateShipCustomizationStats();
      document.getElementById("customization").style.display = "block";
      if (!oneTimeCustomizationInit) {
        initializeStatIncreaseButtons();
        oneTimeCustomizationInit = true;
      }
      clearGameIntervals();
      break;
  }
}

window.addEventListener("keydown", startGameEventListener);

let gameIntervals = [];

function clearGameIntervals() {
  for (let intervalId of gameIntervals) {
    clearInterval(intervalId);
  }
  gameIntervals.length = 0;
}

function startGame() {
  clearGameIntervals();
  setGameOver(false);
  window.removeEventListener("keydown", startGameEventListener);
  document.getElementById("canvas").style.display = "block";
  document.getElementById("customization").style.display = "none";
  if (!oneTimePlayerInit) {
    playBackgroundMusic();
    initializeShotTypesAndModifiers();

    window.addEventListener("keydown", keyDownHandler);
    window.addEventListener("keyup", keyUpHandler);
    document.getElementById("muteButton").addEventListener("click", muteSound);
    oneTimePlayerInit = true;
  }
  resetGameState();
  startGameIntervals();
}

export function onGameOver() {
  setGameOver(true);
  playBigExplosionSound();
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
