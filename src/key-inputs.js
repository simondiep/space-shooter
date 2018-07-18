import { addProjectile, createProjectile, getPlayer, isGameOver } from "./persistent-entities.js";

export function keyDownHandler(event) {
  event.preventDefault();
  if (isGameOver()) {
    return;
  }
  const player = getPlayer();
  switch (event.keyCode) {
    case 32: // Space
      switch (player.shotType) {
        case "overlap":
          for (let i = 0; i < player.numberOfProjectiles; i++) {
            addProjectile(createProjectile());
          }
          break;
        case "ball":
          for (let i = 0; i < player.numberOfProjectiles; i++) {
            addProjectile(
              createProjectile({
                vx: player.projectileSpeed / 2,
                size: player.projectileSize * 4,
              }),
            );
          }
          break;
        case "burst":
          for (let i = 0; i < player.numberOfProjectiles; i++) {
            addProjectile(
              createProjectile({
                x: player.x + i * player.projectileSize * 2,
              }),
            );
          }
          break;
        case "spread":
          shootSpread(player);
          break;
        case "side":
          for (let i = 0; i < player.numberOfProjectiles; i++) {
            addProjectile(
              createProjectile({
                x: player.x + (i * player.size) / 2,
                vx: 0,
                vy: -player.projectileSpeed,
              }),
            );
            addProjectile(
              createProjectile({
                x: player.x + (i * player.size) / 2,
                vx: 0,
                vy: player.projectileSpeed,
              }),
            );
          }
          break;
        default:
          shootStandard(player);
      }
      break;
    case 38: // up arrow
    case 87: // W
      player.directionsPressed.UP = true;
      break;
    case 37: // left arrow
    case 65: // A
      player.directionsPressed.LEFT = true;
      break;
    case 40: // down arrow
    case 83: // S
      player.directionsPressed.DOWN = true;
      break;
    case 39: // right arrow
    case 68: // D
      player.directionsPressed.RIGHT = true;
      break;
  }
}

export function keyUpHandler(event) {
  const player = getPlayer();
  switch (event.keyCode) {
    case 38: // up arrow
    case 87: // W
      player.directionsPressed.UP = false;
      break;
    case 37: // left arrow
    case 65: // A
      player.directionsPressed.LEFT = false;
      break;
    case 40: // down arrow
    case 83: // S
      player.directionsPressed.DOWN = false;
      break;
    case 39: // right arrow
    case 68: // D
      player.directionsPressed.RIGHT = false;
      break;
  }
}

function shootStandard(player) {
  if (player.numberOfProjectiles % 2 === 0) {
    for (let i = 1; i <= player.numberOfProjectiles / 2; i++) {
      addProjectile(
        createProjectile({
          y: player.y - (player.size * i) / (player.numberOfProjectiles / 2 + 1),
        }),
      );
      addProjectile(
        createProjectile({
          y: player.y + (player.size * i) / (player.numberOfProjectiles / 2 + 1),
        }),
      );
    }
    // 2 : 1/2
    // 4 : 1/3, 2/3
    // 6 : 1/4, 2/4, 3/4
    // 8 : 1/5, 2/5, 3/5, 4/5
  } else {
    // 1
    // 3 : 1/2
    // 5 : 1/3, 2/3
    // 7 : 1/4, 2/4, 3/4
    // 9 : 1/5, 2/5, 3/5, 4/5
    addProjectile(createProjectile());
    for (let i = 1; i <= (player.numberOfProjectiles - 1) / 2; i++) {
      addProjectile(
        createProjectile({
          y: player.y - (player.size * i) / ((player.numberOfProjectiles + 1) / 2),
        }),
      );
      addProjectile(
        createProjectile({
          y: player.y + (player.size * i) / ((player.numberOfProjectiles + 1) / 2),
        }),
      );
    }
  }
}

function shootSpread(player) {
  switch (player.numberOfProjectiles) {
    case 1:
      addProjectile(createProjectile());
      break;
    case 2:
      addProjectile(
        createProjectile({
          y: player.y - player.size / 2,
          vy: -player.projectileSpeed / 12,
        }),
      );
      addProjectile(
        createProjectile({
          y: player.y + player.size / 2,
          vy: player.projectileSpeed / 12,
        }),
      );
      break;
    case 3:
      addProjectile(
        createProjectile({
          y: player.y - player.size / 2,
          vy: -player.projectileSpeed / 8,
        }),
      );
      addProjectile(createProjectile());
      addProjectile(
        createProjectile({
          y: player.y + player.size / 2,
          vy: player.projectileSpeed / 8,
        }),
      );
      break;
    case 4:
      addProjectile(
        createProjectile({
          y: player.y - player.size / 2,
          vy: -player.projectileSpeed / 8,
        }),
      );
      addProjectile(
        createProjectile({
          y: player.y - player.size / 4,
          vy: -player.projectileSpeed / 12,
        }),
      );
      addProjectile(
        createProjectile({
          y: player.y + player.size / 4,
          vy: player.projectileSpeed / 12,
        }),
      );
      addProjectile(
        createProjectile({
          y: player.y + player.size / 2,
          vy: player.projectileSpeed / 8,
        }),
      );
      break;
    case 5:
    default:
      // TODO
      addProjectile(
        createProjectile({
          y: player.y - player.size / 2,
          vy: -player.projectileSpeed / 4,
        }),
      );
      addProjectile(
        createProjectile({
          y: player.y - player.size / 4,
          vy: -player.projectileSpeed / 8,
        }),
      );
      addProjectile(createProjectile());
      addProjectile(
        createProjectile({
          y: player.y + player.size / 4,
          vy: player.projectileSpeed / 8,
        }),
      );
      addProjectile(
        createProjectile({
          y: player.y + player.size / 2,
          vy: player.projectileSpeed / 4,
        }),
      );
      break;
  }
}
