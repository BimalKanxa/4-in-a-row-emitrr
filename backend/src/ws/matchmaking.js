const { createGame } = require("./gameManager");

// Only one waiting player at a time (simple + effective)
let waitingPlayer = null;

/**
 * Add player to matchmaking queue
 * @param {WebSocket} ws
 * @param {Function} onGameStart
 */
function addToQueue(ws, onGameStart) {
  // If someone is already waiting, pair them
  if (waitingPlayer) {
    const player1 = waitingPlayer;
    const player2 = ws;

    clearTimeout(player1.timeout);

    const game = createGame(
      { username: player1.username, socket: player1 },
      { username: player2.username, socket: player2 },
      false
    );

    // Assign roles
    player1.playerKey = "P1";
    player2.playerKey = "P2";

    // Notify both players
    onGameStart(game, "P1");
    player2.send(
      JSON.stringify({
        type: "GAME_START",
        gameId: game.id,
        playerKey: "P2",
        board: game.board.grid,
        turn: game.turn
      })
    );

    waitingPlayer = null;
    return;
  }

  // Otherwise, wait and spawn bot after 10s
  ws.timeout = setTimeout(() => {
    const bot = { username: "BOT" };

    const game = createGame(
      { username: ws.username, socket: ws },
      bot,
      true
    );

    ws.playerKey = "P1";

    onGameStart(game, "P1");

    waitingPlayer = null;
  }, 10_000);

  waitingPlayer = ws;
}

/**
 * Remove player from queue (on disconnect)
 */
function removeFromQueue(ws) {
  if (waitingPlayer === ws) {
    clearTimeout(ws.timeout);
    waitingPlayer = null;
  }
}

module.exports = {
  addToQueue,
  removeFromQueue
};
