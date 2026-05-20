import React from 'react';
import { Undo2, Redo2, Eraser, Pencil, Lightbulb } from 'lucide-react';

/**
 * Control operations row (Undo, Redo, Eraser, Pencil notes, Hints).
 */
export default function GameControls({
  canUndo,
  onUndo,
  canRedo,
  onRedo,
  onErase,
  notesMode,
  onToggleNotes,
  onHint,
  activeCellSelected
}) {
  return (
    <div className="game-controls-container">
      {/* Undo */}
      <button
        className="control-btn"
        onClick={onUndo}
        disabled={!canUndo}
        aria-label="Undo last move"
        id="control-undo-btn"
      >
        <Undo2 size={22} />
        <span>Undo</span>
      </button>

      {/* Redo */}
      <button
        className="control-btn"
        onClick={onRedo}
        disabled={!canRedo}
        aria-label="Redo last move"
        id="control-redo-btn"
      >
        <Redo2 size={22} />
        <span>Redo</span>
      </button>

      {/* Eraser */}
      <button
        className="control-btn"
        onClick={onErase}
        disabled={!activeCellSelected}
        aria-label="Erase selected cell"
        id="control-erase-btn"
      >
        <Eraser size={22} />
        <span>Erase</span>
      </button>

      {/* Pencil Notes */}
      <button
        className={`control-btn ${notesMode ? 'active' : ''}`}
        onClick={onToggleNotes}
        aria-label="Toggle notes mode"
        id="control-notes-btn"
      >
        <Pencil size={22} />
        <span>Notes {notesMode ? 'ON' : 'OFF'}</span>
      </button>

      {/* Hints */}
      <button
        className="control-btn"
        onClick={onHint}
        disabled={!activeCellSelected}
        aria-label="Reveal hint for active cell"
        id="control-hint-btn"
      >
        <Lightbulb size={22} style={{ color: activeCellSelected ? 'var(--warning)' : 'inherit' }} />
        <span>Hint</span>
      </button>
    </div>
  );
}
