const db = require("./index");

async function saveGame({
  id,
  player1,
  player2,
  winner,
  duration
}) {
  const query = `
    INSERT INTO games (id, player1, player2, winner, duration)
    VALUES ($1, $2, $3, $4, $5)
  `;

  await db.query(query, [
    id,
    player1,
    player2,
    winner,
    duration
  ]);
}

async function getLeaderboard() {
  const query = `
    SELECT winner, COUNT(*) AS wins
    FROM games
    WHERE winner IS NOT NULL AND winner != 'DRAW'
    GROUP BY winner
    ORDER BY wins DESC
  `;

  // const { rows } = await db.query(query);
  try {
    const { rows } = await db.query(query);
    // Return rows if they exist, otherwise return an empty array
    return rows || []; 
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    // Return empty array on error so the frontend doesn't break
    return [];
  }
  // return rows;
}

module.exports = {
  saveGame,
  getLeaderboard
};
