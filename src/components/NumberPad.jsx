import React from 'react';

/**
 * Renders inputs 1-9.
 * Tracks correct placements and renders the remaining counts (9 - correct_placements) under each pad button.
 * Dims and disables completed buttons when remaining reaches 0.
 */
export default function NumberPad({ cells, onNumberSelect }) {
  // Count correct placements of each number on the board
  const getCorrectPlacements = () => {
    const counts = Array(10).fill(0);
    cells.forEach((cell) => {
      // Count if it matches the solution and is placed
      if (cell.value === cell.solutionValue && cell.value >= 1 && cell.value <= 9) {
        counts[cell.value]++;
      }
    });
    return counts;
  };

  const correctCounts = getCorrectPlacements();

  return (
    <div className="number-pad">
      {Array.from({ length: 9 }, (_, i) => i + 1).map((num) => {
        const remaining = 9 - correctCounts[num];
        const isCompleted = remaining <= 0;

        return (
          <button
            key={num}
            className={`number-btn ${isCompleted ? 'completed' : ''}`}
            onClick={() => !isCompleted && onNumberSelect(num)}
            disabled={isCompleted}
            aria-label={`Place number ${num}, ${remaining} remaining`}
            id={`number-pad-${num}`}
          >
            <span className="number-btn-digit">{num}</span>
            <span className="number-count">{remaining}</span>
          </button>
        );
      })}
    </div>
  );
}
