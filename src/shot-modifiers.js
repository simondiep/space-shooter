import { getPlayer } from "./persistent-entities.js";

export function initializeShotModifiers() {
  document
    .getElementById("shot-type-single")
    .addEventListener("click", () => onShotSelected("single"));
  document
    .getElementById("shot-type-double")
    .addEventListener("click", () => onShotSelected("double"));
  document
    .getElementById("shot-type-spread")
    .addEventListener("click", () => onShotSelected("spread"));
  document
    .getElementById("shot-type-ball")
    .addEventListener("click", () => onShotSelected("ball"));
  document
    .getElementById("shot-type-laser")
    .addEventListener("click", () => onShotSelected("laser"));
  document
    .getElementById("shot-type-side")
    .addEventListener("click", () => onShotSelected("side"));

  document
    .getElementById("shot-modifier-pierce-once")
    .addEventListener("click", () => onShotModifierPierceOnceChange());
  document
    .getElementById("shot-modifier-fork-once")
    .addEventListener("click", () => onShotModifierForkOnceChange());
}

function onShotSelected(shotType) {
  getPlayer().shotType = shotType;
}

function onShotModifierPierceOnceChange() {
  const pierceSelected = document.getElementById("shot-modifier-pierce-once")
    .checked;
  if (pierceSelected) {
    getPlayer().shotModifiers.pierce = 1;
  } else {
    getPlayer().shotModifiers.pierce = 0;
  }
}

function onShotModifierForkOnceChange() {
  const forkSelected = document.getElementById("shot-modifier-fork-once")
    .checked;
  if (forkSelected) {
    getPlayer().shotModifiers.fork = 1;
  } else {
    getPlayer().shotModifiers.fork = 0;
  }
}
