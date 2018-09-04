import { CANVAS_HEIGHT } from "../constants.js";

const PLAYER_DEFAULTS = {
  x: 50,
  y: CANVAS_HEIGHT / 2,
  directionsPressed: {
    UP: false,
    DOWN: false,
    LEFT: false,
    RIGHT: false,
  },
  vx: 0,
  vy: 0,
  images: {
    ship: {
      images: [ship1Image, ship2Image],
      tickCount: 0,
      ticksPerImage: 5,
      displayedImageIndex: 0,
    },
    dead: getDeadImages(),
    projectile: projectileImage,
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
  player.images.dead = getDeadImages();
}

export function setPlayerName(name) {
  player.name = name;
}

export function renderPlayer(context) {
  const playerShip = player.images.ship;
  context.drawImage(
    playerShip.images[playerShip.displayedImageIndex],
    player.x - player.size,
    player.y - player.size,
    player.size * 2,
    player.size * 2,
  );
  playerShip.tickCount += 1;
  if (playerShip.tickCount > playerShip.ticksPerImage) {
    playerShip.tickCount = 0;
    if (playerShip.displayedImageIndex < playerShip.images.length - 1) {
      playerShip.displayedImageIndex += 1;
    } else {
      playerShip.displayedImageIndex = 0;
    }
  }
}

export function renderDeadPlayer(context) {
  const playerDead = player.images.dead;
  context.drawImage(
    playerDead.images[playerDead.displayedImageIndex],
    player.x - player.size,
    player.y - player.size,
    player.size * 2,
    player.size * 2,
  );
  playerDead.tickCount += 1;
  if (playerDead.tickCount > playerDead.ticksPerImage) {
    playerDead.tickCount = 0;
    if (playerDead.displayedImageIndex < playerDead.images.length - 1) {
      playerDead.displayedImageIndex += 1;
    } else {
      playerDead.displayedImageIndex = 0;
    }
  }
}

function getDeadImages() {
  return {
    images: [explosion1Image, explosion2Image, explosion3Image, explosion4Image],
    tickCount: 0,
    ticksPerImage: 5,
    displayedImageIndex: 0,
  };
}

export function incrementDeathCount() {
  if (!player.hasOwnProperty("numberOfDeaths")) {
    player.numberOfDeaths = 0;
  }
  player.numberOfDeaths++;
}
