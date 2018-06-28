import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./constants.js";
import { addEnemy } from "./persistent-entities.js";

export function spawnEnemy() {
  const size = getRandomNumber(20, 40);
  addEnemy({
    x: CANVAS_WIDTH + 10,
    y: getRandomNumber(0, CANVAS_HEIGHT),
    vx: -getRandomNumber(2, 5),
    vy: 0,
    size,
    health: Math.floor(size / 10),
    recentlyDamaged: false,
    hitByProjectiles: [],
  });
}

export function spawnBoss() {
  addEnemy({
    x: CANVAS_WIDTH + 200,
    y: getRandomNumber(0, CANVAS_HEIGHT),
    vx: -getRandomNumber(1, 2),
    vy: 0,
    size: getRandomNumber(100, 200),
    health: 30,
    recentlyDamaged: false,
    hitByProjectiles: [],
  });
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
