import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./constants.js";
import { playShootSound } from "./sounds.js";

let player;
let enemies = [];
let projectiles = [];
let enemyExplosions = [];
let score = 0;
let highScore = 0;
let nextProjectileId = 1;

/**************************
 * Score Helper Functions *
 **************************/
export function clearScore() {
  score = 0;
  document.getElementById("scoreLabel").innerHTML = score;
}

export function incrementScore(scoreToAdd) {
  score = score + scoreToAdd;
  document.getElementById("scoreLabel").innerHTML = score;
  if (score > highScore) {
    highScore = score;
    document.getElementById("highScoreLabel").innerHTML = highScore;
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

export function replacePlayer(newPlayer) {
  player = newPlayer;
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
