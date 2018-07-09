import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./constants.js";
import { addEnemy } from "./persistent-entities.js";

const asteroidImage = document.getElementById("asteroidImage");
const spaceInvaderImage = document.getElementById("spaceInvaderImage");
const spaceInvaderDamagedImage = document.getElementById("spaceInvaderDamagedImage");

export function spawnEnemy() {
  const size = getRandomNumber(20, 40);
  const health = Math.floor(size / 10);
  addEnemy({
    x: CANVAS_WIDTH + 10,
    y: getRandomNumber(0, CANVAS_HEIGHT),
    vx: -getRandomNumber(3, 6),
    vy: 0,
    size,
    health,
    score: health,
    recentlyDamaged: false,
    hitByProjectiles: [],
    images: {
      normal: spaceInvaderImage,
      damaged: spaceInvaderDamagedImage,
    },
  });
}

export function spawnBoss() {
  const size = getRandomNumber(100, 200);
  const health = Math.floor(size / 10) * 2;
  addEnemy({
    x: CANVAS_WIDTH + 200,
    y: getRandomNumber(0, CANVAS_HEIGHT),
    vx: -getRandomNumber(1, 2),
    vy: 0,
    size,
    health,
    score: health,
    recentlyDamaged: false,
    hitByProjectiles: [],
    images: {
      normal: spaceInvaderImage,
      damaged: spaceInvaderDamagedImage,
    },
  });
}

export function spawnAsteroid() {
  const size = getRandomNumber(20, 40);
  const health = size;
  addEnemy({
    x: CANVAS_WIDTH + 10,
    y: getRandomNumber(0, CANVAS_HEIGHT),
    vx: -getRandomNumber(3, 6),
    vy: getRandomNumber(-1, 1),
    size,
    health,
    score: 0,
    recentlyDamaged: false,
    hitByProjectiles: [],
    images: {
      normal: asteroidImage,
      damaged: asteroidImage,
    },
  });
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
