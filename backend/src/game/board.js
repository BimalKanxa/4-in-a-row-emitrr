/**
 * Board representation for Connect 4 (7 columns x 6 rows)
 * Row 0 is the TOP of the board
 * Row 5 is the BOTTOM of the board
 */

const ROWS = 6;
const COLS = 7;

class Board {
  constructor() {
    this.grid = Array.from({ length: ROWS }, () =>
      Array(COLS).fill(null)
    );
  }

  /**
   * Drops a disc into a column
   * @param {number} col - column index (0-6)
   * @param {string} player - player identifier (e.g. "P1", "P2", "BOT")
   * @returns {object|null} - { row, col } if successful, null if column is full
   */
  dropDisc(col, player) {
    if (col < 0 || col >= COLS) return null;

    // Start from bottom row
    for (let row = ROWS - 1; row >= 0; row--) {
      if (this.grid[row][col] === null) {
        this.grid[row][col] = player;
        return { row, col };
      }
    }

    // Column full
    return null;
  }

  /**
   * Checks if a column is full
   */
  isColumnFull(col) {
    return this.grid[0][col] !== null;
  }

  /**
   * Returns list of valid columns
   */
  getAvailableColumns() {
    const cols = [];
    for (let c = 0; c < COLS; c++) {
      if (!this.isColumnFull(c)) {
        cols.push(c);
      }
    }
    return cols;
  }

  /**
   * Checks if board is completely full
   */
  isFull() {
    return this.getAvailableColumns().length === 0;
  }

  /**
   * Deep clone board (used by bot simulations)
   */
  clone() {
    const newBoard = new Board();
    newBoard.grid = this.grid.map(row => [...row]);
    return newBoard;
  }

  /**
   * Get cell value safely
   */
  getCell(row, col) {
    if (row < 0 || row >= ROWS || col < 0 || col >= COLS) {
      return null;
    }
    return this.grid[row][col];
  }

  /**
   * Reset board
   */
  reset() {
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        this.grid[r][c] = null;
      }
    }
  }
}

module.exports = {
  Board,
  ROWS,
  COLS
};
