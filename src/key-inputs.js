import { addProjectile, createProjectile, getPlayer } from "./persistent-entities.js";
import { playBackgroundMusic } from "./sounds.js";

export function keyDownHandler(event) {
  event.preventDefault();
  playBackgroundMusic();
  const player = getPlayer();
  switch (event.keyCode) {
    case 32: // Space
      event.preventDefault();
      switch (player.shotType) {
        case "double":
          addProjectile(
            createProjectile({
              y: player.y - player.size / 2,
            }),
          );
          addProjectile(
            createProjectile({
              y: player.y + player.size / 2,
            }),
          );
          break;
        case "ball":
          addProjectile(
            createProjectile({
              vx: player.projectileSpeed / 2,
              size: player.projectileSize * 4,
            }),
          );
          break;
        case "laser":
          for (let i = 1; i <= 30; i++) {
            addProjectile(
              createProjectile({
                x: player.x + i * 10,
                vx: player.projectileSpeed * 10,
                size: player.projectileSize * 2,
              }),
            );
          }
          break;
        case "spread":
          addProjectile(
            createProjectile({
              y: player.y - player.size / 2,
              vy: -player.projectileSpeed / 2,
            }),
          );
          addProjectile(createProjectile());
          addProjectile(
            createProjectile({
              y: player.y + player.size / 2,
              vy: player.projectileSpeed / 2,
            }),
          );
          break;
        case "side":
          addProjectile(
            createProjectile({
              vx: 0,
              vy: -player.projectileSpeed,
            }),
          );
          addProjectile(
            createProjectile({
              vx: 0,
              vy: player.projectileSpeed,
            }),
          );
          break;
        default:
          addProjectile(createProjectile());
      }
      break;
    case 87: // W
      player.directionsPressed.UP = true;
      break;
    case 65: // A
      player.directionsPressed.LEFT = true;
      break;
    case 83: // S
      player.directionsPressed.DOWN = true;
      break;
    case 68: // D
      player.directionsPressed.RIGHT = true;
      break;
  }
}

export function keyUpHandler(event) {
  const player = getPlayer();
  switch (event.keyCode) {
    case 87: // W
      player.directionsPressed.UP = false;
      break;
    case 65: // A
      player.directionsPressed.LEFT = false;
      break;
    case 83: // S
      player.directionsPressed.DOWN = false;
      break;
    case 68: // D
      player.directionsPressed.RIGHT = false;
      break;
  }
}
