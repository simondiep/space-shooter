import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./constants.js";
import { addEnemy } from "./persistent-entities.js";

const asteroidImage = document.getElementById("asteroidImage");
const spaceInvaderImage = document.getElementById("spaceInvaderImage");
const spaceInvaderDamagedImage = document.getElementById("spaceInvaderDamagedImage");
const speedsterImage = document.getElementById("speedsterImage");
const speedsterDamagedImage = document.getElementById("speedsterDamagedImage");

export function spawnSpeedster() {
  const size = getRandomNumber(15, 30);
  const health = Math.floor(size / 15) + 1;
  addEnemy({
    x: CANVAS_WIDTH + 10,
    y: getRandomNumber(0, CANVAS_HEIGHT),
    vx: -getRandomNumber(6, 9),
    vy: 0,
    size,
    health,
    score: health * 2,
    recentlyDamaged: false,
    turnsToDisplayDamage: 0,
    hitByProjectiles: [],
    onHit: self => {
      self.vx -= 2;
    },
    images: {
      normal: speedsterImage,
      damaged: speedsterDamagedImage,
    },
  });
}

export function spawnSpaceInvader() {
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
    turnsToDisplayDamage: 0,
    hitByProjectiles: [],
    images: {
      normal: spaceInvaderImage,
      damaged: spaceInvaderDamagedImage,
    },
  });
}

export function spawnBoss() {
  const bossType = getRandomNumber(1, 2);
  switch (bossType) {
    case 1: // Space invader
      const invaderSize = getRandomNumber(100, 200);
      const invaderHealth = Math.floor(invaderSize / 10) * 2;
      addEnemy({
        x: CANVAS_WIDTH + 200,
        y: getRandomNumber(0, CANVAS_HEIGHT),
        vx: -getRandomNumber(1, 2),
        vy: 0,
        size: invaderSize,
        health: invaderHealth,
        score: invaderHealth,
        recentlyDamaged: false,
        turnsToDisplayDamage: 0,
        hitByProjectiles: [],
        images: {
          normal: spaceInvaderImage,
          damaged: spaceInvaderDamagedImage,
        },
      });
      break;
    case 2: // speedster
      const speedsterSize = getRandomNumber(50, 100);
      const speedsterHealth = Math.floor(speedsterSize / 7);
      addEnemy({
        x: CANVAS_WIDTH + 200,
        y: getRandomNumber(0, CANVAS_HEIGHT),
        vx: -getRandomNumber(3, 5),
        vy: 0,
        size: speedsterSize,
        health: speedsterHealth,
        score: speedsterHealth * 2,
        recentlyDamaged: false,
        turnsToDisplayDamage: 0,
        hitByProjectiles: [],
        onHit: self => {
          self.vx--;
        },
        images: {
          normal: speedsterImage,
          damaged: speedsterDamagedImage,
        },
      });
      break;
  }
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
    turnsToDisplayDamage: 0,
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
