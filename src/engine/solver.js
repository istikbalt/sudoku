/**
 * Sudoku Solver & Uniqueness Checker
 * Handles board validation, solving, and solution counting.
 * Board is represented as a 1D flat array of 81 numbers (0 for empty).
 */

/**
 * Checks if a value can be placed at a specific index in the board.
 * @param {number[]} board - 81-element flat array
 * @param {number} index - Index from 0 to 80
 * @param {number} val - Value to check (1-9)
 * @returns {boolean} - True if valid, false otherwise
 */
export function isValid(board, index, val) {
  const row = Math.floor(index / 9);
  const col = index % 9;

  // Check row
  for (let c = 0; c < 9; c++) {
    const idx = row * 9 + c;
    if (idx !== index && board[idx] === val) return false;
  }

  // Check column
  for (let r = 0; r < 9; r++) {
    const idx = r * 9 + col;
    if (idx !== index && board[idx] === val) return false;
  }

  // Check 3x3 box
  const boxRowStart = Math.floor(row / 3) * 3;
  const boxColStart = Math.floor(col / 3) * 3;
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const idx = (boxRowStart + r) * 9 + (boxColStart + c);
      if (idx !== index && board[idx] === val) return false;
    }
  }

  return true;
}

/**
 * Finds the next empty cell (value 0).
 * @param {number[]} board 
 * @returns {number} - Index of empty cell, or -1 if full
 */
function findEmpty(board) {
  for (let i = 0; i < 81; i++) {
    if (board[i] === 0) return i;
  }
  return -1;
}

/**
 * Solves a board recursively using backtracking.
 * Mutates the board in place (or works on a copy).
 * @param {number[]} board 
 * @returns {boolean} - True if solvable, false otherwise
 */
export function solve(board) {
  const emptyIdx = findEmpty(board);
  if (emptyIdx === -1) return true; // Solved!

  for (let val = 1; val <= 9; val++) {
    if (isValid(board, emptyIdx, val)) {
      board[emptyIdx] = val;
      if (solve(board)) {
        return true;
      }
      board[emptyIdx] = 0; // Backtrack
    }
  }

  return false;
}

/**
 * Counts solutions to a puzzle to check for uniqueness.
 * Stops searching and returns early if it finds solutions up to the limit.
 * @param {number[]} board 
 * @param {number} limit - Limit of solutions to search for (default 2)
 * @returns {number} - Number of solutions found
 */
export function countSolutions(board, limit = 2) {
  let solutionsCount = 0;
  const boardCopy = [...board];

  function search() {
    if (solutionsCount >= limit) return;

    const emptyIdx = findEmpty(boardCopy);
    if (emptyIdx === -1) {
      solutionsCount++;
      return;
    }

    for (let val = 1; val <= 9; val++) {
      if (isValid(boardCopy, emptyIdx, val)) {
        boardCopy[emptyIdx] = val;
        search();
        boardCopy[emptyIdx] = 0; // Backtrack
      }
    }
  }

  search();
  return solutionsCount;
}

/**
 * Solves and returns a new solved board, or null if unsolvable.
 * Does not mutate the original board.
 * @param {number[]} board 
 * @returns {number[]|null} - Solved board copy, or null
 */
export function getSolution(board) {
  const copy = [...board];
  if (solve(copy)) {
    return copy;
  }
  return null;
}
