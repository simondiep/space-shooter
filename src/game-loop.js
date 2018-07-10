import { CANVAS_WIDTH, CANVAS_HEIGHT } from "./constants.js";
import {
  createProjectile,
  getEnemies,
  getEnemyExplosions,
  getPlayer,
  getProjectiles,
  incrementScore,
  removeEnemiesThatAreOffScreen,
  removeProjectilesThatAreOffScreen,
} from "./persistent-entities.js";
import { initializeGame } from "./main.js";
import {
  drawBackground,
  drawEnemyExplosion,
  deathScreen,
  drawFilledCircle,
  drawPlayer,
  drawEnemy,
  shakeScreen,
} from "./canvas-view.js";
import { playHitSound, playExplosionSound } from "./sounds.js";

export function update() {
  drawBackground();

  removeEnemiesThatAreOffScreen();
  removeProjectilesThatAreOffScreen();

  const enemies = getEnemies();
  const player = getPlayer();
  const projectiles = getProjectiles();

  // Move and draw projectiles
  for (const projectile of projectiles) {
    projectile.x += projectile.vx;
    projectile.y += projectile.vy;
    drawFilledCircle(projectile.x, projectile.y, projectile.size, "blue");
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
  if (player.y + player.vy > 0 && player.y + player.vy < CANVAS_HEIGHT) {
    player.y += player.vy;
  }

  drawPlayer(player.x, player.y, player.size);
  const enemyExplosions = getEnemyExplosions();
  for (let enemyExplosionIndex = enemyExplosions.length - 1; enemyExplosionIndex >= 0; enemyExplosionIndex--) {
    const enemyExplosion = enemyExplosions[enemyExplosionIndex];
    drawEnemyExplosion(enemyExplosion.x, enemyExplosion.y, enemyExplosion.size);
    enemyExplosions.splice(enemyExplosionIndex, 1);
  }

  // Move and draw enemies
  for (let enemyIndex = enemies.length - 1; enemyIndex >= 0; enemyIndex--) {
    const enemy = enemies[enemyIndex];
    enemy.x += enemy.vx;
    enemy.y += enemy.vy;

    // check for collision of player
    if (hasCollided(player, enemy)) {
      shakeScreen(3);
      // TODO delay these actions for a few renders
      deathScreen();
      initializeGame();
      return;
    }

    let enemyHasBeenDestroyed = false;
    // check for collision of projectile
    for (let projIndex = projectiles.length - 1; projIndex >= 0; projIndex--) {
      const projectile = projectiles[projIndex];
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
          projectiles.splice(projIndex, 1);
        }
        // Fork
        if (projectile.modifiers.fork) {
          projectile.modifiers.fork--;
          const forkedProj1 = createProjectile({
            x: projectile.x,
            y: projectile.y,
            vx: projectile.vx,
            vy: projectile.vy ? projectile.vy : -projectile.vx / 2,
            size: projectile.size,
            damage: projectile.damage,
            modifiers: projectile.modifiers,
          });
          const forkedProj2 = createProjectile({
            x: projectile.x,
            y: projectile.y,
            vx: projectile.vx,
            vy: projectile.vy ? projectile.vy : projectile.vx / 2,
            size: projectile.size,
            damage: projectile.damage,
            modifiers: projectile.modifiers,
          });
          projectiles.push(forkedProj1);
          projectiles.push(forkedProj2);
          // The same enemy should not be hit by the forked projectiles
          enemy.hitByProjectiles.push(forkedProj1.id);
          enemy.hitByProjectiles.push(forkedProj2.id);
        }
        break;
      }
    }

    if (enemyHasBeenDestroyed) {
      enemyExplosions.push(enemy);
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
    }
  }
}

function hasCollided(obj1, obj2) {
  const dx = obj1.x - obj2.x;
  const dy = obj1.y - obj2.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance < obj1.size + obj2.size;
}
