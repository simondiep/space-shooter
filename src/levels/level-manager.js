import { spawnAsteroid, spawnSpaceInvader } from "../enemy-spawner.js";
import { getEnemies } from "../persistent-entities.js";

let currentLevel = 1;

export function startLevel() {
  levels[currentLevel].start();
}

export function checkIfLevelIsComplete() {
  return levels[currentLevel].isComplete();
}

export function onLevelComplete() {
  currentLevel++;
  startLevel();
}

const levels = {
  // TODO first level to check player presses WASD/arrow keys and space
  1: {
    start: () => spawnSpaceInvader(),
    isComplete: () => {
      return getEnemies().length == 0;
    },
    note: "Your standard enemy",
    // TODO display this note
  },
  2: {
    start: () => spawnAsteroid(),
    isComplete: () => {
      return getEnemies().length == 0;
    },
    note: "Avoid these",
  },
};
