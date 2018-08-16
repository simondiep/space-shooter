import { CANVAS_HEIGHT } from "../constants.js";

const PLAYER_DEFAULTS = {
  x: 50,
  y: CANVAS_HEIGHT / 2,
  turnCounter: 0,
  directionsPressed: {
    UP: false,
    DOWN: false,
    LEFT: false,
    RIGHT: false,
  },
  vx: 0,
  vy: 0,
  images: {
    shipImages: [ship1Image, ship2Image],
    projectile: projectileImage,
    tickCount: 0,
    ticksPerImage: 5,
    displayedImageIndex: 0,
  },
};

const INITIAL_PLAYER_STATS = {
  size: 50,
  speed: 1,
  topSpeed: 5,
  numberOfProjectiles: 1,
  projectileSize: 10,
  projectileSpeed: 5,
  projectileRange: 300,
  shotType: "standard",
  shotModifiers: {
    pierce: 0,
    fork: 0,
  },
  unlockedBottomCannon: false,
  unlockedTopCannon: false,
};

let player = Object.assign({}, PLAYER_DEFAULTS, INITIAL_PLAYER_STATS);

export function getPlayer() {
  return player;
}

export function resetPlayer() {
  player = Object.assign(player, PLAYER_DEFAULTS);
}

export function setPlayerName(name) {
  player.name = name;
}

export function renderPlayer(context) {
  context.drawImage(
    player.images.shipImages[player.images.displayedImageIndex],
    player.x - player.size,
    player.y - player.size,
    player.size * 2,
    player.size * 2,
  );
  player.images.tickCount += 1;
  if (player.images.tickCount > player.images.ticksPerImage) {
    player.images.tickCount = 0;
    if (player.images.displayedImageIndex < player.images.shipImages.length - 1) {
      player.images.displayedImageIndex += 1;
    } else {
      player.images.displayedImageIndex = 0;
    }
  }
}
