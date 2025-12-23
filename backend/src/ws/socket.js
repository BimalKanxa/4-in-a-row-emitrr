const WebSocket = require("ws");
const {
  createGame,
  makeMove,
  handleBotMove,
  handleDisconnect,
  handleReconnect,
  games
} = require("./gameManager");
const { addToQueue, removeFromQueue } = require("./matchmaking");

/**
 * Initialize WebSocket server
 */
function initWebSocket(server) {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    ws.on("message", (message) => {
      try {
        const data = JSON.parse(message.toString());
        handleMessage(ws, data);
      } catch (err) {
        ws.send(JSON.stringify({ error: "Invalid message format" }));
      }
    });

    ws.on("close", () => {
      if (ws.gameId && ws.playerKey) {
        handleDisconnect(ws.gameId, ws.playerKey, (game) => {
          broadcast(game.id, {
            type: "GAME_OVER",
            winner: game.winner,
            reason: "PLAYER_DISCONNECTED"
          });
        });
      }
    });
  });

  function handleMessage(ws, data) {
    const { type } = data;

    switch (type) {
      case "JOIN_QUEUE":
        joinQueue(ws, data);
        break;

      case "MAKE_MOVE":
        playerMove(ws, data);
        break;

      case "RECONNECT":
        reconnect(ws, data);
        break;

      default:
        ws.send(JSON.stringify({ error: "Unknown event type" }));
    }
  }

  function joinQueue(ws, { username }) {
    ws.username = username;
    addToQueue(ws, (game, playerKey) => {
      ws.gameId = game.id;
      ws.playerKey = playerKey;

      ws.send(
        JSON.stringify({
          type: "GAME_START",
          gameId: game.id,
          playerKey,
          board: game.board.grid,
          turn: game.turn
        })
      );
    });
  }

  function playerMove(ws, { gameId, column }) {
    const game = games.get(gameId);
    if (!game) return;

    const result = makeMove(gameId, ws.playerKey, column);
    if (result?.error) {
      ws.send(JSON.stringify({ error: result.error }));
      return;
    }

    broadcast(gameId, {
      type: "GAME_UPDATE",
      board: game.board.grid,
      turn: game.turn,
      status: game.status,
      winner: game.winner
    });

    // Bot plays immediately if applicable
    handleBotMove(game);

    if (game.isBotGame) {
      broadcast(gameId, {
        type: "GAME_UPDATE",
        board: game.board.grid,
        turn: game.turn,
        status: game.status,
        winner: game.winner
      });
    }
  }

  function reconnect(ws, { gameId, playerKey }) {
    const game = handleReconnect(gameId, playerKey);
    if (!game) {
      ws.send(JSON.stringify({ error: "Game not found" }));
      return;
    }

    ws.gameId = gameId;
    ws.playerKey = playerKey;

    ws.send(
      JSON.stringify({
        type: "GAME_RESUME",
        board: game.board.grid,
        turn: game.turn,
        status: game.status
      })
    );
  }

  function broadcast(gameId, payload) {
    wss.clients.forEach((client) => {
      if (
        client.readyState === WebSocket.OPEN &&
        client.gameId === gameId
      ) {
        client.send(JSON.stringify(payload));
      }
    });
  }

  console.log("✅ WebSocket server initialized");
}

module.exports = {
  initWebSocket
};
