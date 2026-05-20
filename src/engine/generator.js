import { solve, isValid, countSolutions } from './solver.js';
import { DIFFICULTY_CONFIGS, DIFFICULTY_LEVELS } from './difficulty.js';

/**
 * Shuffles an array in place using the Fisher-Yates algorithm.
 * @param {Array} arr 
 */
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Finds the next empty cell (value 0).
 */
function findEmpty(board) {
  for (let i = 0; i < 81; i++) {
    if (board[i] === 0) return i;
  }
  return -1;
}

/**
 * Recursively fills a board with a valid full Sudoku solution.
 * Shuffles numbers to ensure a unique random configuration each run.
 * @param {number[]} board 
 * @returns {boolean}
 */
function fillBoard(board) {
  const emptyIdx = findEmpty(board);
  if (emptyIdx === -1) return true; // Full!

  const numbers = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);

  for (const val of numbers) {
    if (isValid(board, emptyIdx, val)) {
      board[emptyIdx] = val;
      if (fillBoard(board)) {
        return true;
      }
      board[emptyIdx] = 0; // Backtrack
    }
  }

  return false;
}

/**
 * Generates a full completed board.
 * @returns {number[]}
 */
export function generateFullSolvedBoard() {
  const board = Array(81).fill(0);
  fillBoard(board);
  return board;
}

/**
 * Generates a puzzle for a given difficulty level.
 * Guarantees a unique solution.
 * @param {string} difficulty - Difficulty key ('easy', 'medium', 'hard', 'expert')
 * @returns {{ puzzle: number[], solution: number[] }}
 */
export function generatePuzzle(difficulty) {
  const config = DIFFICULTY_CONFIGS[difficulty] || DIFFICULTY_CONFIGS[DIFFICULTY_LEVELS.EASY];
  const targetClues = config.cluesCount;

  let retries = 0;
  const maxRetries = 10;

  while (retries < maxRetries) {
    const solution = generateFullSolvedBoard();
    const puzzle = [...solution];

    // Create a list of all 81 indices and shuffle them to remove numbers in random order
    const cellIndices = shuffle(Array.from({ length: 81 }, (_, i) => i));

    let cluesRemoved = 0;
    const targetRemovals = 81 - targetClues;

    for (const idx of cellIndices) {
      if (cluesRemoved >= targetRemovals) break;

      const temp = puzzle[idx];
      puzzle[idx] = 0;

      // Check if removing this number preserves a unique solution
      if (countSolutions(puzzle, 2) === 1) {
        cluesRemoved++;
      } else {
        // If it creates multiple solutions, revert
        puzzle[idx] = temp;
      }
    }

    const currentClues = puzzle.filter(val => val !== 0).length;
    
    // If we are close enough to the target or successfully met it, return it.
    // Expert/Hard levels are highly constrained; if we are within 2 clues, it's perfect.
    if (currentClues <= targetClues + 2) {
      return { puzzle, solution };
    }

    retries++;
  }

  // Fallback: if we exceed retries, just generate another and return the best effort
  const solution = generateFullSolvedBoard();
  const puzzle = [...solution];
  const cellIndices = shuffle(Array.from({ length: 81 }, (_, i) => i));
  const targetRemovals = 81 - (config.cluesCount + 2); // relaxed constraint
  let cluesRemoved = 0;

  for (const idx of cellIndices) {
    if (cluesRemoved >= targetRemovals) break;
    const temp = puzzle[idx];
    puzzle[idx] = 0;
    if (countSolutions(puzzle, 2) === 1) {
      cluesRemoved++;
    } else {
      puzzle[idx] = temp;
    }
  }

  return { puzzle, solution };
}

/**
 * Generates a puzzle using a seed string, useful for the Daily Challenge offline placeholder.
 * Daily challenge board is deterministic for a given date string (e.g. "2026-05-20").
 * We implement a simple LCG random number generator to seed our shuffle.
 * @param {string} dateString - e.g. "2026-05-20"
 * @param {string} difficulty 
 * @returns {{ puzzle: number[], solution: number[] }}
 */
export function generateDailyChallenge(dateString, difficulty = DIFFICULTY_LEVELS.MEDIUM) {
  // Simple seed hashing to seed a deterministic random sequence
  let seed = 0;
  for (let i = 0; i < dateString.length; i++) {
    seed = (seed << 5) - seed + dateString.charCodeAt(i);
    seed |= 0;
  }

  // Custom seeded random function (LCG)
  function seededRandom() {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  }

  // Seeded shuffle function
  function seededShuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(seededRandom() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // Seeded fill board
  function seededFillBoard(board) {
    const emptyIdx = findEmpty(board);
    if (emptyIdx === -1) return true;

    const numbers = seededShuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);

    for (const val of numbers) {
      if (isValid(board, emptyIdx, val)) {
        board[emptyIdx] = val;
        if (seededFillBoard(board)) return true;
        board[emptyIdx] = 0;
      }
    }
    return false;
  }

  const solution = Array(81).fill(0);
  seededFillBoard(solution);

  const puzzle = [...solution];
  const cellIndices = seededShuffle(Array.from({ length: 81 }, (_, i) => i));

  const config = DIFFICULTY_CONFIGS[difficulty];
  const targetRemovals = 81 - config.cluesCount;
  let cluesRemoved = 0;

  for (const idx of cellIndices) {
    if (cluesRemoved >= targetRemovals) break;
    const temp = puzzle[idx];
    puzzle[idx] = 0;
    if (countSolutions(puzzle, 2) === 1) {
      cluesRemoved++;
    } else {
      puzzle[idx] = temp;
    }
  }

  return { puzzle, solution };
}
