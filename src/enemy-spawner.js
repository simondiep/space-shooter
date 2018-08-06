import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./constants.js";
import { addEnemy, getPlayer, getTimeAliveInSeconds } from "./persistent-entities.js";

const asteroidImage = document.getElementById("asteroidImage");
const enemyShipImage = document.getElementById("enemyShipImage");
const enemyShipDamagedImage = document.getElementById("enemyShipDamagedImage");
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
  addEnemy(
    createEnemy({
      vx: -getRandomNumber(2, 4),
      size,
      health,
      score: health,
      onHit: self => {
        self.size += 5;
      },
      images: {
        normal: heartyImage,
        damaged: heartyDamagedImage,
      },
    }),
  );
}

export function spawnSpeedster() {
  const size = getRandomNumber(15, 30);
  const health = Math.floor(size / 15) + Math.floor(getTimeAliveInSeconds() / 20);
  addEnemy(
    createEnemy({
      vx: -getRandomNumber(6, 9) - Math.floor(getTimeAliveInSeconds() / 20),
      size,
      health,
      score: health * 2,
      onHit: self => {
        self.vx -= 2;
      },
      images: {
        normal: speedsterImage,
        damaged: speedsterDamagedImage,
      },
    }),
  );
}

export function spawnSpeedsterWave() {
  const count = 5 + Math.floor(getTimeAliveInSeconds() / 10);
  for (let i = 0; i < count; i++) {
    spawnSpeedster();
  }
}

export function spawnSpaceInvader() {
  const size = getRandomNumber(20, 40) + Math.floor(getTimeAliveInSeconds() / 20);
  const health = Math.floor(size / 10);
  addEnemy(
    createEnemy({
      vx: -getRandomNumber(3, 6),
      size,
      health,
      score: health,
      images: {
        normal: spaceInvaderImage,
        damaged: spaceInvaderDamagedImage,
      },
    }),
  );
}

export function spawnSpaceInvaderWave() {
  const count = 5 + Math.floor(getTimeAliveInSeconds() / 10);
  for (let i = 0; i < count; i++) {
    spawnSpaceInvader();
  }
}

export function spawnBoss() {
  const bossType = getRandomNumber(1, 3);
  switch (bossType) {
    case 1: // Space invader
      const invaderSize = getRandomNumber(100, 200) + Math.floor(getTimeAliveInSeconds() / 2);
      const invaderHealth = Math.floor(invaderSize / 10) * 2;
      addEnemy(
        createEnemy({
          x: CANVAS_WIDTH + 200,
          vx: -getRandomNumber(1, 2),
          size: invaderSize,
          health: invaderHealth,
          score: invaderHealth * 3,
          images: {
            normal: spaceInvaderImage,
            damaged: spaceInvaderDamagedImage,
          },
        }),
      );
      break;
    case 2: // speedster
      const speedsterSize = getRandomNumber(75, 100) + Math.floor(getTimeAliveInSeconds() / 5);
      const speedsterHealth = Math.floor(speedsterSize / 7);
      addEnemy(
        createEnemy({
          x: CANVAS_WIDTH + 200,
          vx: -getRandomNumber(3, 5),
          size: speedsterSize,
          health: speedsterHealth,
          score: speedsterHealth * 5,
          onHit: self => {
            self.vx--;
          },
          images: {
            normal: speedsterImage,
            damaged: speedsterDamagedImage,
          },
        }),
      );
      break;
    case 3: // hearty
      const heartySize = getRandomNumber(50, 60) + Math.floor(getTimeAliveInSeconds() / 5);
      const heartyHealth = Math.floor(heartySize / 2);
      addEnemy(
        createEnemy({
          x: CANVAS_WIDTH + 200,
          vx: -getRandomNumber(1, 3),
          size: heartySize,
          health: heartyHealth,
          score: heartyHealth * 5,
          onHit: self => {
            self.size += 5;
          },
          images: {
            normal: heartyImage,
            damaged: heartyDamagedImage,
          },
        }),
      );
  }
}

export function spawnAsteroid() {
  const size = getRandomNumber(20, 40) + Math.floor(getTimeAliveInSeconds() / 25);
  const health = size;
  addEnemy(
    createEnemy({
      vx: -getRandomNumber(3, 6),
      vy: getRandomNumber(-1, 1),
      size,
      health,
      images: {
        normal: asteroidImage,
        damaged: asteroidImage,
      },
    }),
  );
}

export function spawnDoppelganger() {
  const player = getPlayer();
  const size = player.size;
  const health = Math.floor(getTimeAliveInSeconds() / 10);
  addEnemy(
    createEnemy({
      vx: -player.speed,
      vyFunction: () => getRandomNumber(-player.speed, player.speed),
      size,
      health,
      score: health * 20,
      shotsPerSecond: 1,
      numberOfProjectiles: player.numberOfProjectiles,
      projectileSize: player.projectileSize,
      projectileSpeed: player.projectileSpeed,
      projectileRange: player.projectileRange,
      shotType: player.shotType,
      shotModifiers: player.shotModifiers,
      images: {
        normal: enemyShipImage,
        damaged: enemyShipDamagedImage,
      },
    }),
  );
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createEnemy(overrides) {
  return {
    x: CANVAS_WIDTH + 10,
    y: getRandomNumber(0, MAX_Y_SPAWN),
    vx: 0,
    vy: 0,
    size: 30,
    health: 1,
    score: 1,
    recentlyDamaged: false,
    turnsToDisplayDamage: 0,
    hitByProjectiles: [],
    ...overrides,
  };
}
