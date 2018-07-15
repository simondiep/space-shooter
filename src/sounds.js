let muted = false;
let playingBackgroundMusic = false;

export function muteSound() {
  muted = true;
}

export function playBackgroundMusic() {
  if (!playingBackgroundMusic) {
    const music = document.getElementById("music-background");
    music.volume = 0.2;
    music.play();
  }
}

export function playExplosionSound() {
  playSound("sound-explosion");
}

export function playHitSound() {
  playSound("sound-hit");
}

export function playShootSound() {
  playSound("sound-shoot");
}

export function playUpgradeSound() {
  playSound("sound-upgrade");
}

function playSound(soundId) {
  if (!muted) {
    const music = document.getElementById(soundId).cloneNode();
    music.play();
  }
}
