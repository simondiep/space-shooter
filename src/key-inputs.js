import { addPlayerProjectile, createProjectile, getPlayer, isGameOver } from "./persistent-entities.js";

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
            addPlayerProjectile(createProjectile());
          }
          break;
        case "ball":
          for (let i = 0; i < player.numberOfProjectiles; i++) {
            addPlayerProjectile(
              createProjectile({
                vx: player.projectileSpeed / 2,
                size: player.projectileSize * 4,
              }),
            );
          }
          break;
        case "burst":
          for (let i = 0; i < player.numberOfProjectiles; i++) {
            addPlayerProjectile(
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
            addPlayerProjectile(
              createProjectile({
                x: player.x + (i * player.size) / 2,
                vx: 0,
                vy: -player.projectileSpeed,
              }),
            );
            addPlayerProjectile(
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
      addPlayerProjectile(
        createProjectile({
          y: player.y - (player.size * i) / (player.numberOfProjectiles / 2 + 1),
        }),
      );
      addPlayerProjectile(
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
    addPlayerProjectile(createProjectile());
    for (let i = 1; i <= (player.numberOfProjectiles - 1) / 2; i++) {
      addPlayerProjectile(
        createProjectile({
          y: player.y - (player.size * i) / ((player.numberOfProjectiles + 1) / 2),
        }),
      );
      addPlayerProjectile(
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
      addPlayerProjectile(createProjectile());
      break;
    case 2:
      addPlayerProjectile(
        createProjectile({
          y: player.y - player.size / 2,
          vy: -player.projectileSpeed / 12,
        }),
      );
      addPlayerProjectile(
        createProjectile({
          y: player.y + player.size / 2,
          vy: player.projectileSpeed / 12,
        }),
      );
      break;
    case 3:
      addPlayerProjectile(
        createProjectile({
          y: player.y - player.size / 2,
          vy: -player.projectileSpeed / 8,
        }),
      );
      addPlayerProjectile(createProjectile());
      addPlayerProjectile(
        createProjectile({
          y: player.y + player.size / 2,
          vy: player.projectileSpeed / 8,
        }),
      );
      break;
    case 4:
      addPlayerProjectile(
        createProjectile({
          y: player.y - player.size / 2,
          vy: -player.projectileSpeed / 8,
        }),
      );
      addPlayerProjectile(
        createProjectile({
          y: player.y - player.size / 4,
          vy: -player.projectileSpeed / 12,
        }),
      );
      addPlayerProjectile(
        createProjectile({
          y: player.y + player.size / 4,
          vy: player.projectileSpeed / 12,
        }),
      );
      addPlayerProjectile(
        createProjectile({
          y: player.y + player.size / 2,
          vy: player.projectileSpeed / 8,
        }),
      );
      break;
    case 5:
    default:
      // TODO
      addPlayerProjectile(
        createProjectile({
          y: player.y - player.size / 2,
          vy: -player.projectileSpeed / 4,
        }),
      );
      addPlayerProjectile(
        createProjectile({
          y: player.y - player.size / 4,
          vy: -player.projectileSpeed / 8,
        }),
      );
      addPlayerProjectile(createProjectile());
      addPlayerProjectile(
        createProjectile({
          y: player.y + player.size / 4,
          vy: player.projectileSpeed / 8,
        }),
      );
      addPlayerProjectile(
        createProjectile({
          y: player.y + player.size / 2,
          vy: player.projectileSpeed / 4,
        }),
      );
      break;
  }
}
