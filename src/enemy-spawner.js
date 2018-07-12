import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./constants.js";
import { addEnemy, getTimeAliveInSeconds } from "./persistent-entities.js";

const asteroidImage = document.getElementById("asteroidImage");
const heartyImage = document.getElementById("heartyImage");
const heartyDamagedImage = document.getElementById("heartyDamagedImage");
const spaceInvaderImage = document.getElementById("spaceInvaderImage");
const spaceInvaderDamagedImage = document.getElementById("spaceInvaderDamagedImage");
const speedsterImage = document.getElementById("speedsterImage");
const speedsterDamagedImage = document.getElementById("speedsterDamagedImage");

const MAX_Y_SPAWN = CANVAS_HEIGHT - 30;

export function spawnHearty() {
  const size = getRandomNumber(20, 30) + Math.floor(getTimeAliveInSeconds() / 15);
  const health = Math.floor(size / 5);
  addEnemy({
    x: CANVAS_WIDTH + 10,
    y: getRandomNumber(0, MAX_Y_SPAWN),
    vx: -getRandomNumber(2, 4),
    vy: 0,
    size,
    health,
    score: health,
    recentlyDamaged: false,
    turnsToDisplayDamage: 0,
    hitByProjectiles: [],
    onHit: self => {
      self.size += 5;
    },
    images: {
      normal: heartyImage,
      damaged: heartyDamagedImage,
    },
  });
}

export function spawnSpeedster() {
  const size = getRandomNumber(15, 30);
  const health = Math.floor(size / 15) + Math.floor(getTimeAliveInSeconds() / 20);
  addEnemy({
    x: CANVAS_WIDTH + 10,
    y: getRandomNumber(0, MAX_Y_SPAWN),
    vx: -getRandomNumber(6, 9) - Math.floor(getTimeAliveInSeconds() / 20),
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
  const size = getRandomNumber(20, 40) + Math.floor(getTimeAliveInSeconds() / 20);
  const health = Math.floor(size / 10);
  addEnemy({
    x: CANVAS_WIDTH + 10,
    y: getRandomNumber(0, MAX_Y_SPAWN),
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

export function spawnSpaceInvaderWave() {
  const count = 5 + Math.floor(getTimeAliveInSeconds() / 10);
  for (let i = 0; i < count; i++) {
    spawnSpaceInvader();
  }
}

export function spawnBoss() {
  const bossType = getRandomNumber(3, 3);
  switch (bossType) {
    case 1: // Space invader
      const invaderSize = getRandomNumber(100, 200) + Math.floor(getTimeAliveInSeconds() / 2);
      const invaderHealth = Math.floor(invaderSize / 10) * 2;
      addEnemy({
        x: CANVAS_WIDTH + 200,
        y: getRandomNumber(0, MAX_Y_SPAWN),
        vx: -getRandomNumber(1, 2),
        vy: 0,
        size: invaderSize,
        health: invaderHealth,
        score: invaderHealth * 3,
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
      const speedsterSize = getRandomNumber(75, 100) + Math.floor(getTimeAliveInSeconds() / 5);
      const speedsterHealth = Math.floor(speedsterSize / 7);
      addEnemy({
        x: CANVAS_WIDTH + 200,
        y: getRandomNumber(0, MAX_Y_SPAWN),
        vx: -getRandomNumber(3, 5),
        vy: 0,
        size: speedsterSize,
        health: speedsterHealth,
        score: speedsterHealth * 5,
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
    case 3: // hearty
      const heartySize = getRandomNumber(50, 60) + Math.floor(getTimeAliveInSeconds() / 5);
      const heartyHealth = Math.floor(heartySize / 2);
      addEnemy({
        x: CANVAS_WIDTH + 10,
        y: getRandomNumber(0, MAX_Y_SPAWN),
        vx: -getRandomNumber(1, 3),
        vy: 0,
        size: heartySize,
        health: heartyHealth,
        score: heartyHealth * 5,
        recentlyDamaged: false,
        turnsToDisplayDamage: 0,
        hitByProjectiles: [],
        onHit: self => {
          self.size += 5;
        },
        images: {
          normal: heartyImage,
          damaged: heartyDamagedImage,
        },
      });
  }
}

export function spawnAsteroid() {
  const size = getRandomNumber(20, 40) + Math.floor(getTimeAliveInSeconds() / 25);
  const health = size;
  addEnemy({
    x: CANVAS_WIDTH + 10,
    y: getRandomNumber(0, MAX_Y_SPAWN),
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
