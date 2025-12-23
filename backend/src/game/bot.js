const { checkWin } = require("./rules");

/**
 * Decide best move for bot
 * @param {Board} board
 * @param {string} botPlayer
 * @param {string} opponent
 * @returns {number|null} column index
 */
function getBotMove(board, botPlayer, opponent) {
  const availableColumns = board.getAvailableColumns();

  // 1️⃣ Try to WIN immediately
  for (const col of availableColumns) {
    const simulated = board.clone();
    simulated.dropDisc(col, botPlayer);

    if (checkWin(simulated, botPlayer)) {
      return col;
    }
  }

  // 2️⃣ Block opponent's immediate win
  for (const col of availableColumns) {
    const simulated = board.clone();
    simulated.dropDisc(col, opponent);

    if (checkWin(simulated, opponent)) {
      return col;
    }
  }

  // 3️⃣ Prefer center columns (strong heuristic)
  const centerOrder = [3, 2, 4, 1, 5, 0, 6];
  for (const col of centerOrder) {
    if (availableColumns.includes(col)) {
      return col;
    }
  }

  // 4️⃣ Fallback (should never happen)
  return availableColumns.length ? availableColumns[0] : null;
}

module.exports = {
  getBotMove
};
