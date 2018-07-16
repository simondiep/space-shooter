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

const STAT_PRICES = {
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
    .getElementById("increaseProjectileSizeButton")
    .addEventListener("click", () => increaseStat("projectileSize"));
  document
    .getElementById("increaseProjectileSpeedButton")
    .addEventListener("click", () => increaseStat("projectileSpeed"));
  document.getElementById("increaseSpeedButton").addEventListener("click", () => increaseStat("speed"));
  document.getElementById("increaseTopSpeedButton").addEventListener("click", () => increaseStat("topSpeed"));
}

export function populateShipCustomizationStats() {
  const player = getPlayer();
  document.getElementById("numberOfCredits").innerHTML = getCredits();
  document.getElementById("shotTypeCost").innerHTML = MISC_PRICES.shotType;
  document.getElementById("shotModifierCost").innerHTML = MISC_PRICES.shotModifier;
  document.getElementById("projectileSize").innerHTML = player.projectileSize;
  document.getElementById("projectileSizeCost").innerHTML = STAT_PRICES.projectileSize;
  document.getElementById("projectileSpeed").innerHTML = player.projectileSpeed;
  document.getElementById("projectileSpeedCost").innerHTML = STAT_PRICES.projectileSpeed;
  document.getElementById("shipSpeed").innerHTML = player.speed;
  document.getElementById("shipSpeedCost").innerHTML = STAT_PRICES.speed;
  document.getElementById("shipTopSpeed").innerHTML = player.topSpeed;
  document.getElementById("shipTopSpeedCost").innerHTML = STAT_PRICES.topSpeed;

  for (const [priceKey, priceValue] of Object.entries(STAT_PRICES)) {
    const upperCasedKey = capitalizeFirstLetter(priceKey);
    document.getElementById(`increase${upperCasedKey}Button`).disabled = getCredits() < priceValue;
  }

  enableDisabledShotTypes(getCredits() >= MISC_PRICES.shotType);
  enableDisableShotModifiers(getCredits() >= MISC_PRICES.shotModifier);
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function increaseStat(statName) {
  spendCredits(STAT_PRICES[statName]);
  const player = getPlayer();
  player[statName]++;
  populateShipCustomizationStats();
  playUpgradeSound();
}

/****************************
 * Shot Types and Modifiers *
 ****************************/

export function initializeShotTypesAndModifiers() {
  document.getElementById("shot-type-single").addEventListener("click", () => onShotSelected("single"));
  document.getElementById("shot-type-double").addEventListener("click", () => onShotSelected("double"));
  document.getElementById("shot-type-spread").addEventListener("click", () => onShotSelected("spread"));
  document.getElementById("shot-type-ball").addEventListener("click", () => onShotSelected("ball"));
  document.getElementById("shot-type-laser").addEventListener("click", () => onShotSelected("laser"));
  document.getElementById("shot-type-side").addEventListener("click", () => onShotSelected("side"));

  document
    .getElementById("shot-modifier-pierce-once")
    .addEventListener("click", () => onShotModifierPierceOnceChange());
  document.getElementById("shot-modifier-fork-once").addEventListener("click", () => onShotModifierForkOnceChange());
}

export function enableDisabledShotTypes(enable) {
  enableDisabledShotType(document.getElementById("shot-type-single"), enable);
  enableDisabledShotType(document.getElementById("shot-type-double"), enable);
  enableDisabledShotType(document.getElementById("shot-type-spread"), enable);
  enableDisabledShotType(document.getElementById("shot-type-ball"), enable);
  enableDisabledShotType(document.getElementById("shot-type-laser"), enable);
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
