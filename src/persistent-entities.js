import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./constants.js";
import { playShootSound } from "./sounds.js";

let enemies = [];
let playerProjectiles = [];
let enemyProjectiles = [];
let enemyExplosions = [];
let score = 0;
let credits = 0;
let gameStartTime;
let timeAliveInSeconds = 0;
let longestTimeAliveInSeconds = 0;
let nextProjectileId = 1;
let gameOver = false;

export function isGameOver() {
  return gameOver;
}

export function setGameOver(isGameOver) {
  gameOver = isGameOver;
}

/**************************
 * Score Helper Functions *
 **************************/
export function clearScore() {
  score = 0;
  document.getElementById("scoreLabel").innerHTML = score;
  gameStartTime = Date.now();
  timeAliveInSeconds = 0;
}

export function getScore() {
  return score;
}

export function incrementScore(scoreToAdd) {
  score += scoreToAdd;
  credits += scoreToAdd;
  document.getElementById("scoreLabel").innerHTML = score;
  document.getElementById("creditsLabel").innerHTML = credits;
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

export function getCredits() {
  return credits;
}

export function spendCredits(amount) {
  credits -= amount;
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

/*******************************
 * Projectile Helper Functions *
 *******************************/
export function addPlayerProjectile(proj) {
  playerProjectiles.push(proj);
  playShootSound();
}

export function addEnemyProjectile(proj) {
  enemyProjectiles.push(proj);
  playShootSound();
}

export function getPlayerProjectiles() {
  return playerProjectiles;
}

export function getEnemyProjectiles() {
  return enemyProjectiles;
}

export function clearProjectiles() {
  playerProjectiles.length = 0;
  enemyProjectiles.length = 0;
}

export function removeProjectilesThatAreOffScreen() {
  playerProjectiles = playerProjectiles.filter(function(projectile) {
    if (projectile.x < CANVAS_WIDTH + 20 && projectile.y > -20 && projectile.y < CANVAS_HEIGHT + 20) {
      return true;
    }
  });
  enemyProjectiles = enemyProjectiles.filter(function(projectile) {
    if (projectile.x > -20 && projectile.y > -20 && projectile.y < CANVAS_HEIGHT + 20) {
      return true;
    }
  });
}

function getNextProjectileId() {
  nextProjectileId++;
  return nextProjectileId;
}

export function createProjectile(entity, options) {
  const defaultValues = {
    id: getNextProjectileId(),
    originX: entity.x + entity.size,
    x: entity.x + entity.size,
    y: entity.y,
    vx: entity.projectileSpeed,
    vy: 0,
    size: entity.projectileSize,
    range: entity.projectileRange,
    damage: 1,
    modifiers: getShotModifiers(entity),
  };
  return Object.assign({}, defaultValues, options);
}

export function createEnemyProjectile(entity, options) {
  const defaultValues = {
    id: getNextProjectileId(),
    originX: entity.x - entity.size,
    x: entity.x - entity.size,
    y: entity.y,
    vx: -entity.projectileSpeed,
    vy: 0,
    size: entity.projectileSize,
    range: entity.projectileRange,
    damage: 1,
    modifiers: getShotModifiers(entity),
  };
  return Object.assign({}, defaultValues, options);
}

function getShotModifiers(entity) {
  return Object.assign({}, entity.shotModifiers);
}
