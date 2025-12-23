const { ROWS, COLS } = require("./board");

/**
 * Check if the given player has won the game
 * @param {Board} board
 * @param {string} player
 * @returns {boolean}
 */
function checkWin(board, player) {
  const grid = board.grid;

  // 1️⃣ Horizontal check
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col <= COLS - 4; col++) {
      if (
        grid[row][col] === player &&
        grid[row][col + 1] === player &&
        grid[row][col + 2] === player &&
        grid[row][col + 3] === player
      ) {
        return true;
      }
    }
  }

  // 2️⃣ Vertical check
  for (let col = 0; col < COLS; col++) {
    for (let row = 0; row <= ROWS - 4; row++) {
      if (
        grid[row][col] === player &&
        grid[row + 1][col] === player &&
        grid[row + 2][col] === player &&
        grid[row + 3][col] === player
      ) {
        return true;
      }
    }
  }

  // 3️⃣ Diagonal (bottom-left → top-right)
  for (let row = 3; row < ROWS; row++) {
    for (let col = 0; col <= COLS - 4; col++) {
      if (
        grid[row][col] === player &&
        grid[row - 1][col + 1] === player &&
        grid[row - 2][col + 2] === player &&
        grid[row - 3][col + 3] === player
      ) {
        return true;
      }
    }
  }

  // 4️⃣ Diagonal (top-left → bottom-right)
  for (let row = 0; row <= ROWS - 4; row++) {
    for (let col = 0; col <= COLS - 4; col++) {
      if (
        grid[row][col] === player &&
        grid[row + 1][col + 1] === player &&
        grid[row + 2][col + 2] === player &&
        grid[row + 3][col + 3] === player
      ) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Check if the game is a draw
 * @param {Board} board
 * @returns {boolean}
 */
function checkDraw(board) {
  return board.isFull();
}

module.exports = {
  checkWin,
  checkDraw
};
