import React, { useEffect } from 'react';
import TopBar from '../components/TopBar.jsx';
import SudokuBoard from '../components/SudokuBoard.jsx';
import GameControls from '../components/GameControls.jsx';
import NumberPad from '../components/NumberPad.jsx';
import AdBannerPlaceholder from '../components/AdBannerPlaceholder.jsx';
import { DIFFICULTY_CONFIGS } from '../engine/difficulty.js';

/**
 * Screen where active Sudoku gameplay occurs.
 */
export default function GameScreen({
  gameState,
  timer,
  settings,
  onBackHome
}) {
  const {
    cells,
    difficulty,
    isDaily,
    dateString,
    mistakes,
    activeCellIndex,
    notesMode,
    isCompleted,
    isGameOver,
    canUndo,
    canRedo,
    startNewGame,
    selectCell,
    setCellValue,
    clearCellValue,
    toggleNotesMode,
    revealHint,
    undo,
    redo
  } = gameState;

  const maxMistakes = DIFFICULTY_CONFIGS[difficulty]?.maxMistakes || 3;

  // Keyboards listeners for desktop testing/web version
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isCompleted || isGameOver || timer.isActive === false) return;

      const key = e.key;

      // Numbers 1-9
      if (/^[1-9]$/.test(key)) {
        setCellValue(parseInt(key, 10));
      }
      // Backspace or Delete acts as Erase
      else if (key === 'Backspace' || key === 'Delete') {
        clearCellValue();
      }
      // Undo command
      else if ((e.ctrlKey || e.metaKey) && key.toLowerCase() === 'z') {
        e.preventDefault();
        undo();
      }
      // Redo command
      else if ((e.ctrlKey || e.metaKey) && key.toLowerCase() === 'y') {
        e.preventDefault();
        redo();
      }
      // Pencil mode toggle (e.g. key 'n')
      else if (key.toLowerCase() === 'n') {
        toggleNotesMode();
      }
      // Arrow keys navigation
      else if (activeCellIndex !== null && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
        e.preventDefault();
        const row = Math.floor(activeCellIndex / 9);
        const col = activeCellIndex % 9;
        let newIdx = activeCellIndex;

        if (key === 'ArrowUp' && row > 0) newIdx = (row - 1) * 9 + col;
        else if (key === 'ArrowDown' && row < 8) newIdx = (row + 1) * 9 + col;
        else if (key === 'ArrowLeft' && col > 0) newIdx = row * 9 + (col - 1);
        else if (key === 'ArrowRight' && col < 8) newIdx = row * 9 + (col + 1);

        selectCell(newIdx);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    activeCellIndex,
    isCompleted,
    isGameOver,
    timer.isActive,
    setCellValue,
    clearCellValue,
    undo,
    redo,
    toggleNotesMode,
    selectCell
  ]);

  const handlePauseToggle = () => {
    if (isCompleted || isGameOver) return;
    if (timer.isActive) {
      timer.pause();
    } else {
      timer.start();
    }
  };

  const handleResume = () => {
    timer.start();
  };

  const handleNewGame = () => {
    // Starts a new puzzle with the same difficulty
    startNewGame(difficulty, isDaily ? dateString : null);
  };

  return (
    <div className="screen" style={{ justifyContent: 'space-between', padding: '16px 20px', paddingBottom: 0 }}>
      {/* Top Details & Timer */}
      <TopBar
        difficulty={difficulty}
        mistakes={mistakes}
        isPaused={!timer.isActive}
        timerLabel={timer.formatTime(timer.seconds)}
        onPauseToggle={handlePauseToggle}
        onBackHome={onBackHome}
        settings={settings}
      />

      {/* The Grid Board */}
      <SudokuBoard
        cells={cells}
        activeCellIndex={activeCellIndex}
        onCellClick={selectCell}
        settings={settings}
        isPaused={!timer.isActive}
        onResume={handleResume}
        isCompleted={isCompleted}
        isGameOver={isGameOver}
        mistakes={mistakes}
        maxMistakes={maxMistakes}
        onNewGame={handleNewGame}
        notesMode={notesMode}
      />

      {/* Command Operations Row */}
      <GameControls
        canUndo={canUndo}
        onUndo={undo}
        canRedo={canRedo}
        onRedo={redo}
        onErase={clearCellValue}
        notesMode={notesMode}
        onToggleNotes={toggleNotesMode}
        onHint={revealHint}
        activeCellSelected={activeCellIndex !== null}
      />

      {/* Input Pad */}
      <NumberPad
        cells={cells}
        onNumberSelect={setCellValue}
      />

      {/* Ad Footprint */}
      <AdBannerPlaceholder />
    </div>
  );
}
