import React from 'react';

/**
 * Renders inputs 1-9.
 * Tracks solved frequencies and dims completed numbers.
 */
export default function NumberPad({ cells, onNumberSelect }) {
  // Count frequency of each number placed on the board
  const getNumberCounts = () => {
    const counts = Array(10).fill(0);
    cells.forEach((cell) => {
      if (cell.value && cell.value >= 1 && cell.value <= 9) {
        counts[cell.value]++;
      }
    });
    return counts;
  };

  const counts = getNumberCounts();

  return (
    <div className="number-pad">
      {Array.from({ length: 9 }, (_, i) => i + 1).map((num) => {
        const isCompleted = counts[num] >= 9;

        return (
          <button
            key={num}
            className={`number-btn ${isCompleted ? 'completed' : ''}`}
            onClick={() => !isCompleted && onNumberSelect(num)}
            disabled={isCompleted}
            aria-label={`Place number ${num}`}
            id={`number-pad-${num}`}
          >
            {num}
            {!isCompleted && counts[num] > 0 && (
              <span className="number-count">{counts[num]}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
