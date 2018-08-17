import { addPlayerProjectile, isGameOver, createProjectile } from "./persistent-entities.js";
import { getPlayer } from "./entities/player.js";
import { shoot } from "./shoot.js";

export function keyDownHandler(event) {
  event.preventDefault();
  if (isGameOver()) {
    return;
  }
  const player = getPlayer();
  switch (event.keyCode) {
    case 32: // Space
      shoot(player, addPlayerProjectile, createProjectile);
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

// Don't check for game over to allow player to stop
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
