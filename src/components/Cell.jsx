import React from 'react';

/**
 * Renders a single cell in the Sudoku grid.
 */
export default function Cell({
  index,
  cell,
  isSelected,
  isHighlightedArea,
  isHighlightedMatch,
  onClick,
  settings,
  notesMode
}) {
  const { value, initialValue, solutionValue, notes, isDuplicate } = cell;
  const isClue = initialValue !== 0;

  // Mistakes are values that don't match the solution
  // We highlight mistakes immediately in standard MVP for premium UX
  const isMistake = value !== 0 && !isClue && value !== solutionValue;

  // Build CSS classes dynamically
  const classes = ['sudoku-cell'];
  if (isClue) classes.push('clue');
  if (!isClue && value !== 0) classes.push('user');
  if (isSelected) classes.push('selected');
  if (isSelected && notesMode && !isClue) classes.push('notes-active');
  if (isHighlightedArea && !isSelected) classes.push('highlighted-area');
  if (isHighlightedMatch && !isSelected) classes.push('highlighted-match');
  if (isDuplicate && settings.highlightDuplicates) classes.push('duplicate');
  if (isMistake) classes.push('error');

  // Helper to render pencil notes
  const renderNotes = () => {
    return (
      <div className="notes-grid">
        {Array.from({ length: 9 }, (_, i) => i + 1).map((n) => {
          const isSet = notes.includes(n);
          if (isSet) {
            return (
              <div key={n} className="note-cell active-note">
                {n}
              </div>
            );
          } else if (notesMode) {
            return (
              <div key={n} className="note-cell placeholder-note">
                {n}
              </div>
            );
          } else {
            return (
              <div key={n} className="note-cell empty-note"></div>
            );
          }
        })}
      </div>
    );
  };

  return (
    <div
      className={classes.join(' ')}
      onClick={onClick}
      id={`cell-${index}`}
    >
      {value !== 0 ? value : renderNotes()}
    </div>
  );
}
