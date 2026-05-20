/**
 * Sudoku Board Validator
 * Handles duplicate checking and inline constraint verification.
 */

/**
 * Checks if a row, column, or box contains any duplicate entries.
 * Returns an array of indices that are in conflict.
 * Works on an array of 81 cell objects (which have a .value property).
 * 
 * @param {Array<{value: number}>} cells - 81-element cell array
 * @returns {Set<number>} - Set of cell indices that contain duplicates
 */
export function getDuplicates(cells) {
  const duplicateIndices = new Set();

  // Helper to check a group of 9 indices
  function checkGroup(indices) {
    const valueMap = new Map(); // value -> list of indices

    for (const idx of indices) {
      const val = cells[idx].value;
      if (val && val !== 0) {
        if (!valueMap.has(val)) {
          valueMap.set(val, []);
        }
        valueMap.get(val).push(idx);
      }
    }

    for (const [val, idxs] of valueMap.entries()) {
      if (idxs.length > 1) {
        for (const idx of idxs) {
          duplicateIndices.add(idx);
        }
      }
    }
  }

  // Check rows
  for (let r = 0; r < 9; r++) {
    const rowIndices = [];
    for (let c = 0; c < 9; c++) {
      rowIndices.push(r * 9 + c);
    }
    checkGroup(rowIndices);
  }

  // Check columns
  for (let c = 0; c < 9; c++) {
    const colIndices = [];
    for (let r = 0; r < 9; r++) {
      colIndices.push(r * 9 + c);
    }
    checkGroup(colIndices);
  }

  // Check 3x3 boxes
  for (let boxRow = 0; boxRow < 3; boxRow++) {
    for (let boxCol = 0; boxCol < 3; boxCol++) {
      const boxIndices = [];
      const startRow = boxRow * 3;
      const startCol = boxCol * 3;
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          boxIndices.push((startRow + r) * 9 + (startCol + c));
        }
      }
      checkGroup(boxIndices);
    }
  }

  return duplicateIndices;
}

/**
 * Checks if a specific cell index value is correct compared to the final board solution.
 * Useful for marking exact mistake counts.
 * 
 * @param {number} value - Placed value
 * @param {number} solutionValue - Correct solution value
 * @returns {boolean} - True if correct, false if mistake
 */
export function isMistake(value, solutionValue) {
  return value !== 0 && value !== solutionValue;
}
