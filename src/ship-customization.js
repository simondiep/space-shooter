import { getCredits, getPlayer, spendCredits } from "./persistent-entities.js";
import { playUpgradeSound } from "./sounds.js";

export const INITIAL_PLAYER_STATS = {
  size: 50,
  speed: 1,
  topSpeed: 5,
  numberOfProjectiles: 1,
  projectileSize: 5,
  projectileSpeed: 5,
  shotType: "standard",
  shotModifiers: {
    pierce: 0,
    fork: 0,
  },
};

const DECREASE_STAT_PRICES = {
  size: 2,
};
const STAT_PRICES = {
  numberOfProjectiles: 30,
  projectileSize: 5,
  projectileSpeed: 1,
  speed: 1,
  topSpeed: 2,
};

const MISC_PRICES = {
  shotType: 50,
  shotModifier: 30,
};

/**************
 * Ship Stats *
 **************/

export function initializeStatIncreaseButtons() {
  document
    .getElementById("increaseNumberOfProjectilesButton")
    .addEventListener("click", () => increaseStat("numberOfProjectiles"));
  document
    .getElementById("increaseProjectileSizeButton")
    .addEventListener("click", () => increaseStat("projectileSize"));
  document
    .getElementById("increaseProjectileSpeedButton")
    .addEventListener("click", () => increaseStat("projectileSpeed"));
  document.getElementById("decreaseSizeButton").addEventListener("click", () => decreaseStat("size"));
  document.getElementById("increaseSpeedButton").addEventListener("click", () => increaseStat("speed"));
  document.getElementById("increaseTopSpeedButton").addEventListener("click", () => increaseStat("topSpeed"));
}

export function populateShipCustomizationStats() {
  const player = getPlayer();
  document.getElementById("numberOfCredits").innerHTML = getCredits();
  document.getElementById("shotTypeCost").innerHTML = MISC_PRICES.shotType;
  document.getElementById("shotModifierCost").innerHTML = MISC_PRICES.shotModifier;
  document.getElementById("numberOfProjectiles").innerHTML = player.numberOfProjectiles;
  document.getElementById("numberOfProjectilesCost").innerHTML = STAT_PRICES.numberOfProjectiles;
  document.getElementById("projectileSize").innerHTML = player.projectileSize;
  document.getElementById("projectileSizeCost").innerHTML = STAT_PRICES.projectileSize;
  document.getElementById("projectileSpeed").innerHTML = player.projectileSpeed;
  document.getElementById("projectileSpeedCost").innerHTML = STAT_PRICES.projectileSpeed;
  document.getElementById("shipSize").innerHTML = player.size;
  document.getElementById("shipSizeCost").innerHTML = DECREASE_STAT_PRICES.size;
  document.getElementById("shipSpeed").innerHTML = player.speed;
  document.getElementById("shipSpeedCost").innerHTML = STAT_PRICES.speed;
  document.getElementById("shipTopSpeed").innerHTML = player.topSpeed;
  document.getElementById("shipTopSpeedCost").innerHTML = STAT_PRICES.topSpeed;

  for (const [priceKey, priceValue] of Object.entries(STAT_PRICES)) {
    const upperCasedKey = capitalizeFirstLetter(priceKey);
    document.getElementById(`increase${upperCasedKey}Button`).disabled = getCredits() < priceValue;
  }

  for (const [priceKey, priceValue] of Object.entries(DECREASE_STAT_PRICES)) {
    const upperCasedKey = capitalizeFirstLetter(priceKey);
    document.getElementById(`decrease${upperCasedKey}Button`).disabled = getCredits() < priceValue;
  }

  enableDisabledShotTypes(getCredits() >= MISC_PRICES.shotType);
  enableDisableShotModifiers(getCredits() >= MISC_PRICES.shotModifier);
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function increaseStat(statName) {
  const player = getPlayer();
  if (statName === "numberOfProjectiles" && player.numberOfProjectiles >= 5) {
    return;
  }
  spendCredits(STAT_PRICES[statName]);
  player[statName]++;
  populateShipCustomizationStats();
  playUpgradeSound();
}

function decreaseStat(statName) {
  const player = getPlayer();
  if (player[statName] > 5) {
    spendCredits(DECREASE_STAT_PRICES[statName]);
    player[statName]--;
    populateShipCustomizationStats();
    playUpgradeSound();
  }
}

/****************************
 * Shot Types and Modifiers *
 ****************************/

export function initializeShotTypesAndModifiers() {
  document.getElementById("shot-type-standard").addEventListener("click", () => onShotSelected("standard"));
  document.getElementById("shot-type-overlap").addEventListener("click", () => onShotSelected("overlap"));
  document.getElementById("shot-type-spread").addEventListener("click", () => onShotSelected("spread"));
  document.getElementById("shot-type-ball").addEventListener("click", () => onShotSelected("ball"));
  document.getElementById("shot-type-burst").addEventListener("click", () => onShotSelected("burst"));
  document.getElementById("shot-type-side").addEventListener("click", () => onShotSelected("side"));

  document
    .getElementById("shot-modifier-pierce-once")
    .addEventListener("click", () => onShotModifierPierceOnceChange());
  document.getElementById("shot-modifier-fork-once").addEventListener("click", () => onShotModifierForkOnceChange());
}

export function enableDisabledShotTypes(enable) {
  enableDisabledShotType(document.getElementById("shot-type-standard"), enable);
  enableDisabledShotType(document.getElementById("shot-type-overlap"), enable);
  enableDisabledShotType(document.getElementById("shot-type-spread"), enable);
  enableDisabledShotType(document.getElementById("shot-type-ball"), enable);
  enableDisabledShotType(document.getElementById("shot-type-burst"), enable);
  enableDisabledShotType(document.getElementById("shot-type-side"), enable);
}

function enableDisabledShotType(element, enable) {
  if (element.checked) {
    element.disabled = false;
  } else {
    element.disabled = !enable;
  }
}

export function enableDisableShotModifiers(enable) {
  document.getElementById("shot-modifier-pierce-once").disabled = !enable;
  document.getElementById("shot-modifier-fork-once").disabled = !enable;
}

function onShotSelected(shotType) {
  spendCredits(MISC_PRICES.shotType);
  getPlayer().shotType = shotType;
  populateShipCustomizationStats();
  playUpgradeSound();
}

function onShotModifierPierceOnceChange() {
  spendCredits(MISC_PRICES.shotType);
  const pierceSelected = document.getElementById("shot-modifier-pierce-once").checked;
  if (pierceSelected) {
    getPlayer().shotModifiers.pierce = 1;
  } else {
    getPlayer().shotModifiers.pierce = 0;
  }
  populateShipCustomizationStats();
  playUpgradeSound();
}

function onShotModifierForkOnceChange() {
  spendCredits(MISC_PRICES.shotType);
  const forkSelected = document.getElementById("shot-modifier-fork-once").checked;
  if (forkSelected) {
    getPlayer().shotModifiers.fork = 1;
  } else {
    getPlayer().shotModifiers.fork = 0;
  }
  populateShipCustomizationStats();
  playUpgradeSound();
}
