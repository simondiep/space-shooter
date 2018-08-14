// Webtask for high scores storage
module.exports = async function(context, cb) {
  try {
    const highscoresObject = await getHighscores(context.storage);
    if (!context.body) {
      cb(null, highscoresObject);
      return;
    }

    const name = context.body.name;
    const score = context.body.score;
    if (name && score) {
      const highscores = highscoresObject.highscores;
      highscores.push({ name, score: parseInt(score, 10) });
      highscores.sort(function(a, b) {
        return b.score - a.score;
      });
      // Only keep top 10 scores
      if (highscores.length > 10) {
        highscores.pop();
      }
      highscoresObject.highscores = highscores;
      await setHighscores(context.storage, highscoresObject);
    }

    cb(null, highscoresObject);
  } catch (e) {
    cb(e);
  }
};

async function getHighscores(storage) {
  return new Promise(resolve => {
    storage.get(function(error, data) {
      if (data && data.highscores) {
        resolve(data);
      } else {
        const defaultHighScores = { highscores: [] };
        resolve(defaultHighScores);
      }
    });
  });
}

async function setHighscores(storage, highscores) {
  return new Promise((resolve, reject) => {
    storage.set(highscores, { force: 1 }, function(error) {
      if (error) reject();
      resolve();
    });
  });
}
