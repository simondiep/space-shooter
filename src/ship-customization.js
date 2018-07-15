import { getCredits, getPlayer, spendCredits } from "./persistent-entities.js";
import { playUpgradeSound } from "./sounds.js";

export const INITIAL_PLAYER_STATS = {
  size: 20,
  speed: 2,
  topSpeed: 10,
  projectileSize: 5,
  projectileSpeed: 25,
  shotType: "single",
  shotModifiers: {
    pierce: 0,
    fork: 0,
  },
};

export function initializeStatIncreaseButtons() {
  document
    .getElementById("increaseProjectileSizeButton")
    .addEventListener("click", () => increaseStat("projectileSize"));
  document
    .getElementById("increaseProjectileSpeedButton")
    .addEventListener("click", () => increaseStat("projectileSpeed"));
  document.getElementById("increaseShipSpeedButton").addEventListener("click", () => increaseStat("speed"));
  document.getElementById("increaseShipTopSpeedButton").addEventListener("click", () => increaseStat("topSpeed"));
}

export function populateShipCustomizationStats() {
  const player = getPlayer();
  document.getElementById("numberOfCredits").innerHTML = getCredits();
  document.getElementById("projectileSize").innerHTML = player.projectileSize;
  document.getElementById("projectileSpeed").innerHTML = player.projectileSpeed;
  document.getElementById("shipSpeed").innerHTML = player.speed;
  document.getElementById("shipTopSpeed").innerHTML = player.topSpeed;

  if (getCredits() <= 0) {
    enableDisableUpgradeStatButtons(false);
  } else {
    enableDisableUpgradeStatButtons(true);
  }
}

function increaseStat(statName) {
  if (getCredits() > 0) {
    spendCredits(1);
    const player = getPlayer();
    player[statName]++;
    populateShipCustomizationStats();
    playUpgradeSound();
  }
}

function enableDisableUpgradeStatButtons(enable) {
  document.getElementById("increaseProjectileSizeButton").disabled = !enable;
  document.getElementById("increaseProjectileSpeedButton").disabled = !enable;
  document.getElementById("increaseShipSpeedButton").disabled = !enable;
  document.getElementById("increaseShipTopSpeedButton").disabled = !enable;
}
