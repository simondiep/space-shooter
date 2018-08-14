# space-shooter

Choose your weapon and shoot space aliens in your spaceship

# How to start

npm i && npm start

# External Storage

This game leverages an external store (webtask.io) for high scores. To set up your own external store:

1. Create a new webtask at https://webtask.io/make
2. Copy/paste the code in [webtask_highscores.js](webtask_highscores.js) into your webtask.
3. Save
4. Grab the public URL for your webtask at the bottom of the webtask editor
5. Replace the value of `HIGH_SCORES_API_URL` inside `high-scores.js`

# Ideas

- Explain more about game at intro
- Stop spawning enemies when dead
- Colorize player's name in high score table
- Longer projectiles that look cool but don't have additional power
- Faster pace like videoball
- stylize radio/checkboxes
- on hold
  - charge up shot
  - auto-fire
- on projectile hit effects
  - explode
- Easy to Difficult Levels
- Support more than five projectiles for spread type

# Longer term

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
- Progression system

- Like Life-force?
- Exp system
- Level up screen
- Loot drops from enemies
- Loot magnet

Dynamic difficulty

- target survival time of 1 min
- if over x games, user averages a longer survival time, bump up enemy health and speed
