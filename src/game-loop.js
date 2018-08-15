import { CANVAS_WIDTH, CANVAS_HEIGHT } from "./constants.js";
import {
  createEnemyProjectile,
  createProjectile,
  getEnemies,
  getEnemyExplosions,
  getPlayer,
  getEnemyProjectiles,
  getPlayerProjectiles,
  incrementScore,
  isGameOver,
  removeEnemiesThatAreOffScreen,
  removeProjectilesThatAreOffScreen,
  updateTimeAliveInSeconds,
  addEnemyProjectile,
} from "./persistent-entities.js";
import { onGameOver } from "./main.js";
import {
  drawBackground,
  drawExplosion,
  drawGameOverScreen,
  drawImage,
  drawPlayer,
  drawEnemy,
  shakeScreen,
} from "./canvas-view.js";
import { playHitSound, playExplosionSound } from "./sounds.js";
import { shoot } from "./shoot.js";

export function update() {
  if (!isGameOver()) {
    updateTimeAliveInSeconds();
  }
  drawBackground();

  removeEnemiesThatAreOffScreen();
  removeProjectilesThatAreOffScreen();

  const player = getPlayer();
  const playerProjectiles = getPlayerProjectiles();
  const enemyProjectiles = getEnemyProjectiles();

  // Move and draw player projectiles
  for (let projIndex = playerProjectiles.length - 1; projIndex >= 0; projIndex--) {
    const projectile = playerProjectiles[projIndex];
    projectile.x += projectile.vx;
    projectile.y += projectile.vy;
    drawImage(
      player.images.projectile,
      projectile.x - projectile.size / 2,
      projectile.y - projectile.size / 2,
      projectile.size,
    );
    if (projectile.x - projectile.originX > projectile.range) {
      // Remove projectile
      playerProjectiles.splice(projIndex, 1);
    }
  }

  // Move and draw enemy projectiles
  for (let projIndex = enemyProjectiles.length - 1; projIndex >= 0; projIndex--) {
    const projectile = enemyProjectiles[projIndex];
    projectile.x += projectile.vx;
    projectile.y += projectile.vy;
    drawImage(
      enemyProjectileImage,
      projectile.x - projectile.size / 2,
      projectile.y - projectile.size / 2,
      projectile.size,
    );
    if (projectile.originX - projectile.x > projectile.range) {
      // Remove projectile
      enemyProjectiles.splice(projIndex, 1);
    }

    // check for collision of enemy projectile
    if (!isGameOver() && hasCollided(player, projectile)) {
      onGameOver();
    }
  }

  // Player Movement
  if (player.directionsPressed.UP && player.vy > -player.topSpeed) {
    player.vy -= player.speed;
  }
  if (player.directionsPressed.DOWN && player.vy < player.topSpeed) {
    player.vy += player.speed;
  }
  if (player.directionsPressed.LEFT && player.vx > -player.topSpeed) {
    player.vx -= player.speed;
  }
  if (player.directionsPressed.RIGHT && player.vx < player.topSpeed) {
    player.vx += player.speed;
  }

  if (!player.directionsPressed.UP && !player.directionsPressed.DOWN) {
    player.vy = 0;
  }
  if (!player.directionsPressed.LEFT && !player.directionsPressed.RIGHT) {
    player.vx = 0;
  }

  if (player.x + player.vx > 0 && player.x + player.vx < CANVAS_WIDTH) {
    player.x += player.vx;
  }
  if (player.y + player.vy > 0 && player.y + player.vy < CANVAS_HEIGHT - player.size) {
    player.y += player.vy;
  }

  if (isGameOver()) {
    if (player.turnCounter % 10) {
      drawExplosion(player.turnCounter, player.x, player.y, player.size);
    }
  } else {
    drawPlayer(player);
  }
  player.turnCounter++;
  const enemyExplosions = getEnemyExplosions();
  for (let enemyExplosionIndex = enemyExplosions.length - 1; enemyExplosionIndex >= 0; enemyExplosionIndex--) {
    const enemyExplosion = enemyExplosions[enemyExplosionIndex];
    drawExplosion(player.turnCounter, enemyExplosion.x, enemyExplosion.y, enemyExplosion.size);
    enemyExplosions.splice(enemyExplosionIndex, 1);
  }

  moveAndDrawEnemiesWhileCheckingCollisions();

  if (isGameOver()) {
    drawGameOverScreen();
  }
}

function moveAndDrawEnemiesWhileCheckingCollisions() {
  const enemies = getEnemies();
  const player = getPlayer();
  const playerProjectiles = getPlayerProjectiles();

  for (let enemyIndex = enemies.length - 1; enemyIndex >= 0; enemyIndex--) {
    const enemy = enemies[enemyIndex];
    enemy.x += enemy.vx;
    enemy.y += enemy.vy;
    if (enemy.vyFunction) {
      enemy.y += enemy.vyFunction();
    }

    // check for collision of player
    if (!isGameOver() && hasCollided(player, enemy)) {
      onGameOver();
    }

    let enemyHasBeenDestroyed = false;
    // check for collision of projectile
    for (let projIndex = playerProjectiles.length - 1; projIndex >= 0; projIndex--) {
      const projectile = playerProjectiles[projIndex];
      if (hasCollided(projectile, enemy)) {
        // Ensure a single projectile doesn't hit an enemy multiple times
        if (enemy.hitByProjectiles.includes(projectile.id)) {
          continue;
        } else {
          enemy.hitByProjectiles.push(projectile.id);
        }

        enemy.health -= projectile.damage;
        enemy.recentlyDamaged = true;
        enemy.turnsToDisplayDamage = 5;
        if (enemy.health <= 0) {
          // Remove enemy
          enemies.splice(enemyIndex, 1);
          enemyHasBeenDestroyed = true;
        }
        if (enemy.onHit) {
          enemy.onHit(enemy);
        }

        // Pierce
        if (projectile.modifiers.pierce) {
          projectile.modifiers.pierce--;
        } else {
          // Remove projectile
          playerProjectiles.splice(projIndex, 1);
        }
        // Fork
        if (projectile.modifiers.fork) {
          projectile.modifiers.fork--;
          const forkedProj1 = createProjectile(player, {
            originX: projectile.x,
            x: projectile.x,
            y: projectile.y,
            vx: projectile.vx,
            vy: projectile.vy ? projectile.vy : -projectile.vx / 2,
            size: projectile.size,
            damage: projectile.damage,
            modifiers: projectile.modifiers,
          });
          const forkedProj2 = createProjectile(player, {
            originX: projectile.x,
            x: projectile.x,
            y: projectile.y,
            vx: projectile.vx,
            vy: projectile.vy ? projectile.vy : projectile.vx / 2,
            size: projectile.size,
            damage: projectile.damage,
            modifiers: projectile.modifiers,
          });
          playerProjectiles.push(forkedProj1);
          playerProjectiles.push(forkedProj2);
          // The same enemy should not be hit by the forked projectiles
          enemy.hitByProjectiles.push(forkedProj1.id);
          enemy.hitByProjectiles.push(forkedProj2.id);
        }
        break;
      }
    }

    if (enemyHasBeenDestroyed) {
      getEnemyExplosions().push(enemy);
      shakeScreen(2);
      playExplosionSound();
      incrementScore(enemy.score);
    } else {
      if (enemy.recentlyDamaged) {
        shakeScreen(1);
      }
      drawEnemy(enemy);
      // Reset damage state
      enemy.turnsToDisplayDamage--;
      if (enemy.recentlyDamaged) {
        playHitSound();
        enemy.recentlyDamaged = false;
      }

      // Enemy shoots
      if (enemy.shotsPerSecond) {
        if (!enemy.lastShotTime || Date.now() > enemy.lastShotTime + 1000 / enemy.shotsPerSecond) {
          shoot(enemy, addEnemyProjectile, createEnemyProjectile);
          enemy.lastShotTime = Date.now();
        }
      }
    }
  }
}

function hasCollided(obj1, obj2) {
  const dx = obj1.x - obj2.x;
  const dy = obj1.y - obj2.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance < obj1.size + obj2.size;
}
