// Put your webtask URL here
export const HIGH_SCORES_API_URL =
  "https://wt-82e23ef79ade2a8d8cfed3117b878cdb-0.sandbox.auth0-extend.com/space-shooter-highscores";

let lastPushedHighScore = {};

export async function displayHighScores() {
  // Retrieve high scores and display them
  const response = await fetch(HIGH_SCORES_API_URL);
  const highscoresObject = await response.json();
  const highscoresTable = document.getElementById("highScoresTable");
  // Clear out the table contents
  while (highscoresTable.firstChild) {
    highscoresTable.removeChild(highscoresTable.firstChild);
  }

  const headerRow = document.createElement("tr");
  const headerName = document.createElement("th");
  headerName.innerHTML = "Name";
  headerRow.appendChild(headerName);
  const headerScore = document.createElement("th");
  headerScore.innerHTML = "Score";
  headerRow.appendChild(headerScore);
  const headerNumDeaths = document.createElement("th");
  headerNumDeaths.innerHTML = "Deaths";
  headerRow.appendChild(headerNumDeaths);
  highscoresTable.appendChild(headerRow);

  for (const highscoreObject of highscoresObject.highscores) {
    let highlightRow = false;
    if (
      highscoreObject.name === lastPushedHighScore.name &&
      highscoreObject.score === lastPushedHighScore.score &&
      highscoreObject.numberOfDeaths === lastPushedHighScore.numberOfDeaths
    ) {
      highlightRow = true;
    }

    const highscoreRow = document.createElement("tr");
    if (highlightRow) {
      highscoreRow.classList.add("highlightedHighScoreRow");
    }
    const nameDiv = document.createElement("td");
    nameDiv.innerHTML = highscoreObject.name;
    highscoreRow.appendChild(nameDiv);
    const highscoreDiv = document.createElement("td");
    highscoreDiv.innerHTML = highscoreObject.score;
    highscoreRow.appendChild(highscoreDiv);
    const numberOfDeathsDiv = document.createElement("td");
    numberOfDeathsDiv.innerHTML = highscoreObject.numberOfDeaths;
    highscoreRow.appendChild(numberOfDeathsDiv);
    highscoresTable.appendChild(highscoreRow);
  }
  document.getElementById("highScores").style.display = "block";
}

export function hideHighScores() {
  document.getElementById("highScores").style.display = "none";
}

export async function pushHighScore(name, score, numberOfDeaths) {
  try {
    await fetch(HIGH_SCORES_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({ name, score, numberOfDeaths }),
    });
    lastPushedHighScore = { name, score, numberOfDeaths };
    return true;
  } catch (e) {
    return false;
  }
}
