import { CANVAS_WIDTH } from "./constants.js";
import { addEnemy } from "./persistent-entities.js";

export function spawnEnemy() {
  const size = getRandomNumber(20, 40);
  addEnemy({
    x: getRandomNumber(0, CANVAS_WIDTH),
    y: -10,
    vy: getRandomNumber(2, 5),
    size,
    health: Math.floor(size / 10),
    recentlyDamaged: false,
    hitByProjectiles: [],
  });
}

export function spawnBoss() {
  addEnemy({
    x: getRandomNumber(0, CANVAS_WIDTH),
    y: -200,
    vy: getRandomNumber(1, 2),
    size: getRandomNumber(100, 200),
    health: 30,
    recentlyDamaged: false,
    hitByProjectiles: [],
  });
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
