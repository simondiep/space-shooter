import { getCredits, getPlayer, spendCredits } from "./persistent-entities.js";
import { playUpgradeSound } from "./sounds.js";

export const INITIAL_PLAYER_STATS = {
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
};

const DECREASE_STAT_PRICES = {
  size: 2,
};
const STAT_PRICES = {
  numberOfProjectiles: 100,
  projectileRange: 1,
  projectileSize: 10,
  projectileSpeed: 1,
  speed: 1,
  topSpeed: 2,
};

const MISC_PRICES = {
  shotType: 50,
  shotModifier: 100,
};

/**************
 * Ship Stats *
 **************/

export function initializeStatIncreaseButtons() {
  for (const statName of Object.keys(STAT_PRICES)) {
    const upperCasedStatName = capitalizeFirstLetter(statName);
    document
      .getElementById(`increase${upperCasedStatName}Button`)
      .addEventListener("click", () => increaseStat(statName));
    document
      .getElementById(`increase${upperCasedStatName}SpendAllButton`)
      .addEventListener("click", () => increaseStatSpendAll(statName));
  }
  for (const statName of Object.keys(DECREASE_STAT_PRICES)) {
    const upperCasedStatName = capitalizeFirstLetter(statName);
    document
      .getElementById(`decrease${upperCasedStatName}Button`)
      .addEventListener("click", () => decreaseStat(statName));
    document
      .getElementById(`decrease${upperCasedStatName}SpendAllButton`)
      .addEventListener("click", () => decreaseStatSpendAll(statName));
  }
}

export function populateShipCustomizationStats() {
  const player = getPlayer();
  document.getElementById("numberOfCredits").innerHTML = getCredits();
  document.getElementById("shotTypeCost").innerHTML = MISC_PRICES.shotType;
  document.getElementById("shotModifierCost").innerHTML = MISC_PRICES.shotModifier;

  // Populate label values
  for (const statName of Object.keys(STAT_PRICES)) {
    document.getElementById(statName).innerHTML = player[statName];
    document.getElementById(`${statName}Cost`).innerHTML = STAT_PRICES[statName];
  }
  // Populate label values
  for (const statName of Object.keys(DECREASE_STAT_PRICES)) {
    document.getElementById(statName).innerHTML = player[statName];
    document.getElementById(`${statName}Cost`).innerHTML = DECREASE_STAT_PRICES[statName];
  }

  // Disable buttons if you don't have enough credits
  for (const [priceKey, priceValue] of Object.entries(STAT_PRICES)) {
    const upperCasedKey = capitalizeFirstLetter(priceKey);
    document.getElementById(`increase${upperCasedKey}Button`).disabled = getCredits() < priceValue;
    document.getElementById(`increase${upperCasedKey}SpendAllButton`).disabled = getCredits() < priceValue;
  }
  // Disable buttons if you don't have enough credits
  for (const [priceKey, priceValue] of Object.entries(DECREASE_STAT_PRICES)) {
    const upperCasedKey = capitalizeFirstLetter(priceKey);
    document.getElementById(`decrease${upperCasedKey}Button`).disabled = getCredits() < priceValue;
    document.getElementById(`decrease${upperCasedKey}SpendAllButton`).disabled = getCredits() < priceValue;
  }

  enableDisabledShotTypes(getCredits() >= MISC_PRICES.shotType);
  enableDisableShotModifiers(getCredits() >= MISC_PRICES.shotModifier);
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function increaseStat(statName) {
  const player = getPlayer();
  spendCredits(STAT_PRICES[statName]);
  player[statName]++;
  populateShipCustomizationStats();
  playUpgradeSound();
}

function increaseStatSpendAll(statName) {
  const player = getPlayer();
  while (getCredits() >= STAT_PRICES[statName]) {
    increaseStat(statName);
  }
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

function decreaseStatSpendAll(statName) {
  const player = getPlayer();
  while (getCredits() >= DECREASE_STAT_PRICES[statName] && player[statName] > 5) {
    decreaseStat(statName);
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
