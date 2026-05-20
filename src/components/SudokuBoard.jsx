import React from 'react';
import Cell from './Cell.jsx';
import { Play } from 'lucide-react';

/**
 * Renders the 9x9 Sudoku grid with support for overlays (Pause, Victory, Game Over).
 */
export default function SudokuBoard({
  cells,
  activeCellIndex,
  onCellClick,
  settings,
  isPaused,
  onResume,
  isCompleted,
  isGameOver,
  mistakes,
  maxMistakes,
  onNewGame,
  notesMode
}) {
  const activeCell = activeCellIndex !== null ? cells[activeCellIndex] : null;
  const activeValue = activeCell ? activeCell.value : 0;

  // Determine if a cell is in the same row, column, or 3x3 block as the selected cell
  const checkHighlightedArea = (idx) => {
    if (activeCellIndex === null || !settings.highlightArea) return false;
    
    const activeRow = Math.floor(activeCellIndex / 9);
    const activeCol = activeCellIndex % 9;
    const cellRow = Math.floor(idx / 9);
    const cellCol = idx % 9;

    const sameRow = activeRow === cellRow;
    const sameCol = activeCol === cellCol;
    
    const sameBox =
      Math.floor(activeRow / 3) === Math.floor(cellRow / 3) &&
      Math.floor(activeCol / 3) === Math.floor(cellCol / 3);

    return sameRow || sameCol || sameBox;
  };

  // Determine if a cell has the same number as the active selection
  const checkHighlightedMatch = (idx, value) => {
    if (activeCellIndex === null || !settings.highlightSameNumbers || value === 0) return false;
    return value === activeValue;
  };

  return (
    <div className="sudoku-container">
      <div className="sudoku-board">
        {cells.map((cell, idx) => (
          <Cell
            key={idx}
            index={idx}
            cell={cell}
            isSelected={activeCellIndex === idx}
            isHighlightedArea={checkHighlightedArea(idx)}
            isHighlightedMatch={checkHighlightedMatch(idx, cell.value)}
            onClick={() => onCellClick(idx)}
            settings={settings}
            notesMode={notesMode}
          />
        ))}
      </div>

      {/* PAUSE OVERLAY */}
      {isPaused && !isCompleted && !isGameOver && (
        <div className="board-overlay">
          <h2>Game Paused</h2>
          <p>Tap below to resume relaxing gameplay</p>
          <button className="btn-primary" onClick={onResume} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Play size={20} fill="white" /> Resume Game
          </button>
        </div>
      )}

      {/* GAME OVER OVERLAY */}
      {isGameOver && (
        <div className="board-overlay" style={{ backgroundColor: 'rgba(76, 29, 36, 0.95)' }}>
          <h2>Game Over</h2>
          <p>You made {mistakes}/{maxMistakes} mistakes</p>
          <button className="btn-primary" onClick={onNewGame}>
            Try Another Puzzle
          </button>
        </div>
      )}

      {/* VICTORY OVERLAY */}
      {isCompleted && (
        <div className="board-overlay" style={{ backgroundColor: 'rgba(15, 118, 110, 0.95)' }}>
          <h2>Perfect!</h2>
          <p>Puzzle completed successfully</p>
          <button className="btn-primary" onClick={onNewGame}>
            New Game
          </button>
        </div>
      )}
    </div>
  );
}
