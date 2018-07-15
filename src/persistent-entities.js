import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./constants.js";
import { playShootSound } from "./sounds.js";

const PLAYER_DEFAULTS = {
  x: 50,
  y: CANVAS_HEIGHT / 2,
  turnsAlive: 0,
  directionsPressed: {
    UP: false,
    DOWN: false,
    LEFT: false,
    RIGHT: false,
  },
  vx: 0,
  vy: 0,
  images: {
    one: ship1Image,
    two: ship2Image,
  },
};

const INITIAL_PLAYER_STATS = {
  size: 20,
  speed: 2,
  topSpeed: 10,
  projectileSize: 5,
  projectileSpeed: 25,
  shotType: "single",
  shotModifiers: {
    pierce: 0,
    fork: 0,
  },
};

let player = Object.assign({}, PLAYER_DEFAULTS, INITIAL_PLAYER_STATS);
let enemies = [];
let projectiles = [];
let enemyExplosions = [];
let score = 0;
let highScore = 0;
let gameStartTime;
let timeAliveInSeconds = 0;
let longestTimeAliveInSeconds = 0;
let nextProjectileId = 1;

/**************************
 * Score Helper Functions *
 **************************/
export function clearScore() {
  score = 0;
  document.getElementById("scoreLabel").innerHTML = score;
  gameStartTime = Date.now();
  timeAliveInSeconds = 0;
}

export function incrementScore(scoreToAdd) {
  score = score + scoreToAdd;
  document.getElementById("scoreLabel").innerHTML = score;
  if (score > highScore) {
    highScore = score;
    document.getElementById("highScoreLabel").innerHTML = highScore;
  }
}

export function getTimeAliveInSeconds() {
  return timeAliveInSeconds;
}

export function updateTimeAliveInSeconds() {
  timeAliveInSeconds = Math.trunc((Date.now() - gameStartTime) / 1000);
  document.getElementById("timeAliveInSeconds").innerHTML = timeAliveInSeconds;
  if (timeAliveInSeconds > longestTimeAliveInSeconds) {
    longestTimeAliveInSeconds = timeAliveInSeconds;
    document.getElementById("longestTimeAliveInSeconds").innerHTML = longestTimeAliveInSeconds;
  }
}

/**************************
 * Enemy Helper Functions *
 **************************/
export function addEnemy(enemy) {
  enemies.push(enemy);
}

export function getEnemies() {
  return enemies;
}

export function clearEnemies() {
  enemies.length = 0;
}

export function removeEnemiesThatAreOffScreen() {
  enemies = enemies.filter(function(enemy) {
    if (enemy.x > -30) {
      return true;
    }
  });
}

export function getEnemyExplosions() {
  return enemyExplosions;
}

/***************************
 * Player Helper Functions *
 ***************************/
export function getPlayer() {
  return player;
}

export function resetPlayer() {
  player = Object.assign(player, PLAYER_DEFAULTS);
}

/*******************************
 * Projectile Helper Functions *
 *******************************/
export function addProjectile(proj) {
  projectiles.push(proj);
  playShootSound();
}

export function getProjectiles() {
  return projectiles;
}

export function clearProjectiles() {
  projectiles.length = 0;
}

export function removeProjectilesThatAreOffScreen() {
  projectiles = projectiles.filter(function(projectile) {
    if (projectile.x < CANVAS_WIDTH + 20) {
      return true;
    }
  });
}

function getNextProjectileId() {
  nextProjectileId++;
  return nextProjectileId;
}

export function createProjectile(options) {
  const defaultValues = {
    id: getNextProjectileId(),
    x: player.x,
    y: player.y,
    vx: player.projectileSpeed,
    vy: 0,
    size: player.projectileSize,
    damage: 1,
    modifiers: getShotModifiers(),
  };
  return Object.assign({}, defaultValues, options);
}

function getShotModifiers() {
  return Object.assign({}, player.shotModifiers);
}
