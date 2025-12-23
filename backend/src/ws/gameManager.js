// const { v4: uuidv4 } = require("uuid");
// const { Board } = require("../game/board");
// const { checkWin, checkDraw } = require("../game/rules");
// const { getBotMove } = require("../game/bot");
// const { saveGame } = require("../db/queries");
// const { emitEvent } = require("../kafka/producer");


// // In-memory active games
// const games = new Map();

// // Track disconnected players (30s reconnect window)
// const disconnectTimers = new Map();

// /**
//  * Create a new game
//  */
// function createGame(player1, player2, isBotGame = false) {
//   const gameId = uuidv4();

//   const game = {
//     id: gameId,
//     board: new Board(),
//     players: {
//       P1: player1,
//       P2: player2
//     },
//     isBotGame,
//     turn: "P1",
//     status: "ACTIVE",
//     winner: null,
//     createdAt: Date.now()
//   };

//   games.set(gameId, game);
//   return game;
// }

// /**
//  * Persist finished game to DB
//  */
// async function persistGame(game) {
//   try {
//     await saveGame({
//       id: game.id,
//       player1: game.players.P1.username,
//       player2: game.players.P2.username || "BOT",
//       winner:
//         game.winner === "DRAW"
//           ? null
//           : game.players[game.winner]?.username,
//       duration: Math.floor((Date.now() - game.createdAt) / 1000)
//     });
//   } catch (err) {
//     console.error("❌ Failed to save game:", err.message);
//   }
// }

// /**
//  * Handle a move by a player
//  */
// function makeMove(gameId, playerKey, column) {
//   const game = games.get(gameId);
//   if (!game || game.status !== "ACTIVE") return null;

//   if (game.turn !== playerKey) {
//     return { error: "Not your turn" };
//   }

//   const position = game.board.dropDisc(column, playerKey);
//   if (!position) {
//     return { error: "Invalid move" };
//   }

//   // Check win
//   if (checkWin(game.board, playerKey)) {
//     game.status = "FINISHED";
//     game.winner = playerKey;
//     persistGame(game);
//   }
//   // Check draw
//   else if (checkDraw(game.board)) {
//     game.status = "FINISHED";
//     game.winner = "DRAW";
//     persistGame(game);
//   }
//   // Switch turn
//   else {
//     game.turn = game.turn === "P1" ? "P2" : "P1";
//   }

//   return {
//     game,
//     lastMove: position
//   };
// }

// /**
//  * Handle bot move if applicable
//  */
// function handleBotMove(game) {
//   if (!game.isBotGame || game.status !== "ACTIVE") return;
//   if (game.turn !== "P2") return;

//   const botColumn = getBotMove(game.board, "P2", "P1");
//   if (botColumn === null) return;

//   game.board.dropDisc(botColumn, "P2");

//   if (checkWin(game.board, "P2")) {
//     game.status = "FINISHED";
//     game.winner = "P2";
//     persistGame(game);
//   } else if (checkDraw(game.board)) {
//     game.status = "FINISHED";
//     game.winner = "DRAW";
//     persistGame(game);
//   } else {
//     game.turn = "P1";
//   }
// }

// /**
//  * Handle player disconnect (30s grace)
//  */
// function handleDisconnect(gameId, playerKey, onForfeit) {
//   const timer = setTimeout(() => {
//     const game = games.get(gameId);
//     if (!game || game.status !== "ACTIVE") return;

//     game.status = "FINISHED";
//     game.winner = playerKey === "P1" ? "P2" : "P1";

//     persistGame(game);

//     if (onForfeit) onForfeit(game);
//     games.delete(gameId);
//   }, 30_000);

//   disconnectTimers.set(`${gameId}:${playerKey}`, timer);
// }

// /**
//  * Handle player reconnect
//  */
// function handleReconnect(gameId, playerKey) {
//   const key = `${gameId}:${playerKey}`;
//   const timer = disconnectTimers.get(key);

//   if (timer) {
//     clearTimeout(timer);
//     disconnectTimers.delete(key);
//   }

//   return games.get(gameId);
// }

// /**
//  * Remove game manually (cleanup)
//  */
// function removeGame(gameId) {
//   games.delete(gameId);
// }

// module.exports = {
//   createGame,
//   makeMove,
//   handleBotMove,
//   handleDisconnect,
//   handleReconnect,
//   removeGame,
//   games
// };






const { v4: uuidv4 } = require("uuid");
const { Board } = require("../game/board");
const { checkWin, checkDraw } = require("../game/rules");
const { getBotMove } = require("../game/bot");
const { saveGame } = require("../db/queries");
const { emitEvent } = require("../kafka/producer");

// In-memory active games
const games = new Map();

// Track disconnected players (30s reconnect window)
const disconnectTimers = new Map();

/**
 * Create a new game
 */
function createGame(player1, player2, isBotGame = false) {
  const gameId = uuidv4();

  const game = {
    id: gameId,
    board: new Board(),
    players: {
      P1: player1,
      P2: player2
    },
    isBotGame,
    turn: "P1",
    status: "ACTIVE",
    winner: null,
    createdAt: Date.now()
  };

  games.set(gameId, game);

  // Kafka event
  emitEvent("GAME_STARTED", {
    gameId,
    players: [
      player1.username,
      player2.username || "BOT"
    ]
  });

  return game;
}

/**
 * Persist finished game to DB + emit Kafka event
 */
async function persistGame(game) {
  try {
    const duration = Math.floor(
      (Date.now() - game.createdAt) / 1000
    );

    const winnerUsername =
      game.winner === "DRAW"
        ? "DRAW"
        : game.players[game.winner]?.username;

    await saveGame({
      id: game.id,
      player1: game.players.P1.username,
      player2: game.players.P2.username || "BOT",
      winner: winnerUsername === "DRAW" ? null : winnerUsername,
      duration
    });

    emitEvent("GAME_ENDED", {
      gameId: game.id,
      winner: winnerUsername,
      duration
    });
  } catch (err) {
    console.error("❌ Failed to persist game:", err.message);
  }
}

/**
 * Handle a move by a player
 */
function makeMove(gameId, playerKey, column) {
  const game = games.get(gameId);
  if (!game || game.status !== "ACTIVE") return null;

  if (game.turn !== playerKey) {
    return { error: "Not your turn" };
  }

  const position = game.board.dropDisc(column, playerKey);
  if (!position) {
    return { error: "Invalid move" };
  }

  emitEvent("MOVE_PLAYED", {
    gameId,
    player: playerKey,
    column
  });

  // Check win
  if (checkWin(game.board, playerKey)) {
    game.status = "FINISHED";
    game.winner = playerKey;
    persistGame(game);
  }
  // Check draw
  else if (checkDraw(game.board)) {
    game.status = "FINISHED";
    game.winner = "DRAW";
    persistGame(game);
  }
  // Switch turn
  else {
    game.turn = game.turn === "P1" ? "P2" : "P1";
  }

  return {
    game,
    lastMove: position
  };
}

/**
 * Handle bot move (if bot game)
 */
function handleBotMove(game) {
  if (!game.isBotGame || game.status !== "ACTIVE") return;
  if (game.turn !== "P2") return;

  const botColumn = getBotMove(
    game.board,
    "P2",
    "P1"
  );

  if (botColumn === null) return;

  game.board.dropDisc(botColumn, "P2");

  emitEvent("MOVE_PLAYED", {
    gameId: game.id,
    player: "BOT",
    column: botColumn
  });

  if (checkWin(game.board, "P2")) {
    game.status = "FINISHED";
    game.winner = "P2";
    persistGame(game);
  } else if (checkDraw(game.board)) {
    game.status = "FINISHED";
    game.winner = "DRAW";
    persistGame(game);
  } else {
    game.turn = "P1";
  }
}

/**
 * Handle player disconnect (30s grace period)
 */
function handleDisconnect(gameId, playerKey, onForfeit) {
  emitEvent("PLAYER_DISCONNECTED", {
    gameId,
    player: playerKey
  });

  const timer = setTimeout(() => {
    const game = games.get(gameId);
    if (!game || game.status !== "ACTIVE") return;

    game.status = "FINISHED";
    game.winner = playerKey === "P1" ? "P2" : "P1";

    persistGame(game);

    if (onForfeit) onForfeit(game);
    games.delete(gameId);
  }, 30_000);

  disconnectTimers.set(`${gameId}:${playerKey}`, timer);
}

/**
 * Handle player reconnect
 */
function handleReconnect(gameId, playerKey) {
  const key = `${gameId}:${playerKey}`;
  const timer = disconnectTimers.get(key);

  if (timer) {
    clearTimeout(timer);
    disconnectTimers.delete(key);
  }

  return games.get(gameId);
}

/**
 * Cleanup finished game manually
 */
function removeGame(gameId) {
  games.delete(gameId);
}

module.exports = {
  createGame,
  makeMove,
  handleBotMove,
  handleDisconnect,
  handleReconnect,
  removeGame,
  games
}; 
