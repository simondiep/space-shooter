import { spawnAsteroid, spawnHearty, spawnSpeedster, spawnSpaceInvader } from "../enemy-spawner.js";
import { clearEnemies, getEnemies } from "../persistent-entities.js";
import { FadeInText } from "../entities/fade-in-text.js";
import { getContext } from "../canvas-view.js";
import { tutorialCompleted } from "../main.js";

let currentLevel = 1;
let fadeInText;
let levelLogicDone = false;
let tutorialInProgress = false;

export function isTutorialInProgress() {
  return tutorialInProgress;
}

export function stopTutorial() {
  tutorialInProgress = false;
}

export function startLevel() {
  tutorialInProgress = true;
  setLevelLogicDone(false);
  levels[currentLevel].start();
}

export function runLevelLogic() {
  levels[currentLevel].levelLogic();
}

export function checkIfLevelIsComplete() {
  return levels[currentLevel].isComplete();
}

export function onLevelComplete() {
  currentLevel++;
  startLevel();
}

function initializeFadeInText(text) {
  fadeInText = new FadeInText(text);
}

function setLevelLogicDone(isDone) {
  levelLogicDone = isDone;
}

const levels = {
  // TODO first level to check player presses WASD/arrow keys and space
  1: {
    start: () => {
      initializeFadeInText("Shoot enemies with space bar");
    },
    levelLogic: () => {
      if (levelLogicDone) {
        return;
      }
      if (fadeInText.isDoneRendering()) {
        spawnSpaceInvader();
        setLevelLogicDone(true);
      } else {
        fadeInText.render(getContext());
      }
    },
    isComplete: () => {
      return levelLogicDone && getEnemies().length == 0;
    },
  },
  2: {
    start: () => {
      initializeFadeInText("Avoid Asteroids");
    },
    levelLogic: () => {
      if (levelLogicDone) {
        return;
      }
      if (fadeInText.isDoneRendering()) {
        spawnAsteroid();
        setLevelLogicDone(true);
      } else {
        fadeInText.render(getContext());
      }
    },
    isComplete: () => {
      // Avoided asteroid
      if (levelLogicDone && getEnemies()[0].x < 0) {
        clearEnemies();
        return true;
      }
      return false;
    },
  },
  3: {
    start: () => {
      initializeFadeInText("Shoot everything and avoid collisions");
    },
    levelLogic: () => {
      if (levelLogicDone) {
        return;
      }
      if (fadeInText.isDoneRendering()) {
        spawnHearty();
        spawnSpeedster();
        setLevelLogicDone(true);
      } else {
        fadeInText.render(getContext());
      }
    },
    isComplete: () => {
      return levelLogicDone && getEnemies().length == 0;
    },
  },
  4: {
    start: () => {
      initializeFadeInText("Tutorial Completed!");
    },
    levelLogic: () => {
      if (fadeInText.isDoneRendering()) {
        setLevelLogicDone(true);
      } else {
        fadeInText.render(getContext());
      }
    },
    isComplete: () => {
      if (levelLogicDone) {
        initializeFadeInText("Press Enter to start the real challenge.");
        tutorialCompleted();
      }
      return false;
    },
  },
};
