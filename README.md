# space-shooter

Choose your weapon and shoot space aliens in your spaceship

![demo preview](./preview.gif?raw=true)

# How to start

npm i && npm start

# External Storage

This game leverages an external store (webtask.io) for high scores. To set up your own external store:

1.  Create a new webtask at https://webtask.io/make
2.  Copy/paste the code in [webtask_highscores.js](webtask_highscores.js) into your webtask.
3.  Save
4.  Grab the public URL for your webtask at the bottom of the webtask editor
5.  Replace the value of `HIGH_SCORES_API_URL` inside `high-scores.js`

## Ideas

- Have three different game modes
  - Tutorial - done
  - Arcade
  - Endless - done
- reduce hitbox of player
- Endless vs Arcade mode
  - Level 1
    - introduce player to controls
    - introduce game mechanic - What is the special game mechanic?
    - introduce single enemy type and quirk/pattern
    - midboss for that enemy type - apply all that you've learned so far
  - Level 2
    - introduce single enemy type and quirk/pattern
    - mix up enemy types
    - boss

## Longer term

- Display damage numbers
- Attack speed stat
- AoE
- Mutators
- Hotkeys to switch between weapons
- Rotating asteroids
- Non-circle projectiles
- Mouse movement
- Shield
- Twin ships
- Terrain that is collidable
- Reduce fire rate when space bar held down
- Longer projectiles that look cool but don't have additional power
- Faster pace like videoball
- stylize radio/checkboxes
- on hold
  - charge up shot
  - auto-fire
- on projectile hit effects
  - explode
- Support more than five projectiles for spread type

- Like Life-force?
- Exp system
- Level up screen
- Loot drops from enemies
- Loot magnet

Dynamic difficulty

- target survival time of 1 min
- if over x games, user averages a longer survival time, bump up enemy health and speed

## Credits

Music from Josh Penn-Pierson

https://github.com/OpenSourceMusic/Death-Sword
