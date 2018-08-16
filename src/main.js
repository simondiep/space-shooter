import {
  spawnAsteroid,
  spawnBoss,
  spawnHearty,
  spawnSpaceInvader,
  spawnSpeedster,
  spawnSpeedsterWave,
  spawnSpaceInvaderWave,
  spawnDoppelganger,
} from "./enemy-spawner.js";
import { keyDownHandler, keyUpHandler } from "./key-inputs.js";
import { clearEnemies, clearProjectiles, clearScore, setGameOver, getScore } from "./persistent-entities.js";
import { getPlayer, resetPlayer, setPlayerName } from "./entities/player.js";
import { update } from "./game-loop.js";
import { HIGH_SCORES_API_URL, displayHighScores, hideHighScores, pushHighScore } from "./high-scores.js";
import { initializeCanvas, drawIntroScreen } from "./canvas-view.js";
import {
  initializeShotTypesAndModifiers,
  initializeStatIncreaseButtons,
  populateShipCustomizationStats,
} from "./ship-customization.js";
import { muteSound, playBackgroundMusic, playBigExplosionSound } from "./sounds.js";

let oneTimePlayerInit = false;
let oneTimeCustomizationInit = false;
let playerEnteredName = false;

initializeCanvas();
drawIntroScreen();
document.getElementById("nameInputDiv").style.display = "block";

function startGameEventListener(event) {
  if (playerEnteredName) {
    event.preventDefault();
  }
  switch (event.keyCode) {
    case 82: // r
      if (!playerEnteredName) {
        break;
      }
    case 13: // enter
      if (!playerEnteredName) {
        playerEnteredName = true;
        document.getElementById("nameInputDiv").style.display = "none";
        setPlayerName(document.getElementById("nameInput").value);
      }
      startGame();
      break;
    case 67: // c
      if (!playerEnteredName) {
        break;
      }
      document.getElementById("canvas").style.display = "none";
      populateShipCustomizationStats();
      document.getElementById("customization").style.display = "block";
      if (!oneTimeCustomizationInit) {
        initializeStatIncreaseButtons();
        initializeShotTypesAndModifiers();
        oneTimeCustomizationInit = true;
      }
      clearGameIntervals();
      break;
  }
}

window.addEventListener("keydown", startGameEventListener);

let gameIntervals = [];

function clearEnemyIntervals() {
  for (let i = 1; i < gameIntervals.length; i++) {
    clearInterval(gameIntervals[i]);
  }
  gameIntervals.length = 1;
}

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
  hideHighScores();
  if (!oneTimePlayerInit) {
    playBackgroundMusic();

    window.addEventListener("keydown", keyDownHandler);
    window.addEventListener("keyup", keyUpHandler);
    document.getElementById("muteButton").addEventListener("click", muteSound);
    oneTimePlayerInit = true;
  }
  resetGameState();
  startGameIntervals();
}

export async function onGameOver() {
  setGameOver(true);
  clearEnemyIntervals();
  playBigExplosionSound();
  if (HIGH_SCORES_API_URL) {
    if (await pushHighScore(getPlayer().name, getScore())) {
      displayHighScores();
    }
  }
  window.addEventListener("keydown", startGameEventListener);
}

function startGameIntervals() {
  gameIntervals.push(setInterval(() => requestAnimationFrame(update), 1000 / 60));

  gameIntervals.push(setInterval(() => requestAnimationFrame(spawnAsteroid), 1000));
  gameIntervals.push(setInterval(() => requestAnimationFrame(spawnHearty), 1000));
  gameIntervals.push(setInterval(() => requestAnimationFrame(spawnSpaceInvader), 500));
  gameIntervals.push(setInterval(() => requestAnimationFrame(spawnSpeedster), 2000));
  gameIntervals.push(setInterval(() => requestAnimationFrame(spawnBoss), 10000));

  gameIntervals.push(setInterval(() => requestAnimationFrame(spawnDoppelganger), 33000));

  gameIntervals.push(setInterval(() => requestAnimationFrame(spawnSpaceInvaderWave), 9000));
  gameIntervals.push(setInterval(() => requestAnimationFrame(spawnSpeedsterWave), 14000));
}

function resetGameState() {
  clearScore();
  resetPlayer();
  clearEnemies();
  clearProjectiles();
}
