import { CANVAS_WIDTH, CANVAS_HEIGHT } from "./constants.js";
import {
  createProjectile,
  getEnemies,
  getPlayer,
  getProjectiles,
  incrementScore,
  removeEnemiesThatAreOffScreen,
  removeProjectilesThatAreOffScreen,
} from "./persistent-entities.js";
import { initializeGame } from "./main.js";

export function update() {
  const context = document.getElementById("canvas").getContext("2d");
  context.fillStyle = "black";
  context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  removeEnemiesThatAreOffScreen();
  removeProjectilesThatAreOffScreen();

  const enemies = getEnemies();
  const player = getPlayer();
  const projectiles = getProjectiles();
  const spaceInvaderImage = document.getElementById("spaceInvaderImage");
  // Move and draw projectiles
  context.fillStyle = "blue";
  for (const projectile of projectiles) {
    projectile.x += projectile.vx;
    projectile.y += projectile.vy;
    context.beginPath();
    context.arc(projectile.x, projectile.y, projectile.size, 0, 2 * Math.PI);
    context.closePath();
    context.fill();
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

  // Draw player
  context.fillStyle = "blue";
  context.beginPath();
  context.arc(player.x, player.y, player.size, 0, 2 * Math.PI);
  context.closePath();
  context.fill();
  context.fillStyle = "white";
  context.beginPath();
  context.moveTo(player.x, player.y - player.size);
  context.lineTo(player.x - player.size, player.y + player.size);
  context.lineTo(player.x + player.size, player.y + player.size);
  context.closePath();
  context.fill();

  // Move and draw enemies
  for (let enemyIndex = enemies.length - 1; enemyIndex >= 0; enemyIndex--) {
    const enemy = enemies[enemyIndex];
    enemy.y += enemy.vy;

    // check for collision of player
    if (hasCollided(player, enemy)) {
      context.fillStyle = "red";
      context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

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
        if (enemy.health <= 0) {
          // Remove enemy
          enemies.splice(enemyIndex, 1);
          enemyHasBeenDestroyed = true;
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
            vx: projectile.vx ? projectile.vx : -projectile.vy / 2,
            vy: projectile.vy,
            size: projectile.size,
            damage: projectile.damage,
            modifiers: projectile.modifiers,
          });
          const forkedProj2 = createProjectile({
            x: projectile.x,
            y: projectile.y,
            vx: projectile.vx ? projectile.vx : projectile.vy / 2,
            vy: projectile.vy,
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
      incrementScore();
    } else {
      // Draw enemy
      let enemyColor = "gray";
      if (enemy.recentlyDamaged) {
        enemyColor = "red";
        enemy.recentlyDamaged = false;
      }

      // To see collision circle, uncomment this
      // context.fillStyle = enemyColor;
      // context.beginPath();
      // context.arc(enemy.x, enemy.y, enemy.size, 0, 2 * Math.PI);
      // context.closePath();
      // context.fill();

      context.drawImage(
        spaceInvaderImage,
        enemy.x - enemy.size,
        enemy.y - enemy.size,
        enemy.size * 2,
        enemy.size * 2,
      );
    }
  }
}

function hasCollided(obj1, obj2) {
  const dx = obj1.x - obj2.x;
  const dy = obj1.y - obj2.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance < obj1.size + obj2.size;
}
