import React from 'react';
import { Undo2, Eraser, Sparkles, Pencil, Lightbulb } from 'lucide-react';

/**
 * Premium control operations toolbar matching screenshots.
 */
export default function GameControls({
  canUndo,
  onUndo,
  onErase,
  notesMode,
  onToggleNotes,
  onFastPencil,
  hintsLeft = 3,
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
        <div className="control-icon-wrapper">
          <Undo2 size={22} />
        </div>
        <span className="control-btn-label">Undo</span>
      </button>

      {/* Erase */}
      <button
        className="control-btn"
        onClick={onErase}
        disabled={!activeCellSelected}
        aria-label="Erase selected cell"
        id="control-erase-btn"
      >
        <div className="control-icon-wrapper">
          <Eraser size={22} />
        </div>
        <span className="control-btn-label">Erase</span>
      </button>

      {/* Fast Pencil (Auto-fill) */}
      <button
        className="control-btn"
        onClick={onFastPencil}
        aria-label="Auto fill notes"
        id="control-fast-pencil-btn"
      >
        <div className="control-icon-wrapper">
          <Sparkles size={22} />
          <span className="control-badge fast-pencil-badge">+1</span>
        </div>
        <span className="control-btn-label">Fast Pencil</span>
      </button>

      {/* Pencil Notes Toggle */}
      <button
        className={`control-btn ${notesMode ? 'notes-active-btn' : ''}`}
        onClick={onToggleNotes}
        aria-label="Toggle notes mode"
        id="control-notes-btn"
      >
        <div className="control-icon-wrapper">
          <Pencil size={22} />
          <span className={`pencil-pill ${notesMode ? 'on' : 'off'}`}>
            {notesMode ? 'ON' : 'OFF'}
          </span>
        </div>
        <span className="control-btn-label">Pencil</span>
      </button>

      {/* Smart Hint */}
      <button
        className="control-btn"
        onClick={onHint}
        disabled={!activeCellSelected || hintsLeft <= 0}
        aria-label="Reveal hint for active cell"
        id="control-hint-btn"
      >
        <div className="control-icon-wrapper">
          <Lightbulb size={22} style={{ color: activeCellSelected && hintsLeft > 0 ? 'var(--warning)' : 'inherit' }} />
          {hintsLeft > 0 && (
            <span className="control-badge hint-count-badge">{hintsLeft}</span>
          )}
        </div>
        <span className="control-btn-label">Hint</span>
      </button>
    </div>
  );
}
