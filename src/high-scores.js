// Put your webtask URL here
export const HIGH_SCORES_API_URL = "";

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
  highscoresTable.appendChild(headerRow);

  for (const highscoreObject of highscoresObject.highscores) {
    const highscoreRow = document.createElement("tr");
    const nameDiv = document.createElement("td");
    nameDiv.innerHTML = highscoreObject.name;
    highscoreRow.appendChild(nameDiv);
    const highscoreDiv = document.createElement("td");
    highscoreDiv.innerHTML = highscoreObject.score;
    highscoreRow.appendChild(highscoreDiv);
    highscoresTable.appendChild(highscoreRow);
  }
  document.getElementById("highScores").style.display = "block";
}

export function hideHighScores() {
  document.getElementById("highScores").style.display = "none";
}

export async function pushHighScore(name, score) {
  try {
    await fetch(HIGH_SCORES_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({ name, score }),
    });
    return true;
  } catch (e) {
    return false;
  }
}
