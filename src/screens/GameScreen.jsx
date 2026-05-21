import React, { useEffect, useState } from 'react';
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
  onBackHome,
  stats,
  onUpdateSetting,
  onSettingsClick
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
    redo,
    autoFillNotes,
    score,
    hintsLeft
  } = gameState;

  const maxMistakes = DIFFICULTY_CONFIGS[difficulty]?.maxMistakes || 3;

  // Local HUD states
  const [showThemePopover, setShowThemePopover] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

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

  const handleShare = () => {
    const diffName = DIFFICULTY_CONFIGS[difficulty]?.name || 'Easy';
    const text = `I'm playing Sudoku - Mira! Difficulty: ${diffName}, Score: ${score}. Can you beat me?`;
    if (navigator.share) {
      navigator.share({
        title: 'Sudoku - Mira',
        text: text,
        url: window.location.href,
      }).catch(err => console.log(err));
    } else {
      navigator.clipboard.writeText(text);
      alert('Game sharing text copied to clipboard!');
    }
  };

  return (
    <div className="screen" style={{ justifyContent: 'space-between', padding: '16px 20px', paddingBottom: 0, position: 'relative' }}>
      {/* Top Details & Timer */}
      <TopBar
        difficulty={difficulty}
        mistakes={mistakes}
        score={score}
        streak={stats?.currentStreak || 0}
        isPaused={!timer.isActive}
        timerLabel={timer.formatTime(timer.seconds)}
        onPauseToggle={handlePauseToggle}
        onBackHome={onBackHome}
        settings={settings}
        isFavorite={isFavorite}
        onFavoriteToggle={() => setIsFavorite(prev => !prev)}
        onShareClick={handleShare}
        onPaletteClick={() => setShowThemePopover(prev => !prev)}
        onSettingsClick={onSettingsClick}
      />

      {/* Floating Theme Customizer Popover overlay */}
      {showThemePopover && (
        <div className="theme-popover-card">
          <div className="popover-header">
            <h3>Appearance</h3>
            <button className="popover-close-btn" onClick={() => setShowThemePopover(false)}>×</button>
          </div>
          
          <div className="popover-section">
            <span className="popover-section-title">Color Palette</span>
            <div className="theme-options-grid">
              {[
                { id: 'light', name: 'Light', color: '#2563eb', bg: '#f4f6f9' },
                { id: 'cream', name: 'Sepia', color: '#8c6d58', bg: '#f5ece1' },
                { id: 'green', name: 'Green', color: '#2e7d32', bg: '#ebf3ea' },
                { id: 'dark', name: 'Slate', color: '#6366f1', bg: '#13121f' },
                { id: 'oled', name: 'OLED', color: '#3b82f6', bg: '#000000', border: '1px solid #525252' }
              ].map(t => (
                <button
                  key={t.id}
                  className={`theme-select-btn ${settings.theme === t.id ? 'active' : ''}`}
                  onClick={() => onUpdateSetting('theme', t.id)}
                  style={{ backgroundColor: t.bg, borderColor: settings.theme === t.id ? 'var(--primary)' : 'rgba(148, 163, 184, 0.2)' }}
                >
                  <div className="theme-dot" style={{ backgroundColor: t.color, border: t.border || 'none' }} />
                  <span className="theme-name-label">{t.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="popover-divider" />

          <div className="popover-section row-layout">
            <div className="popover-label-group">
              <span className="popover-section-title">Match System Theme</span>
              <span className="popover-subtitle">Sync automatically with dark mode</span>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={settings.darkThemeSync || false}
                onChange={(e) => onUpdateSetting('darkThemeSync', e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="popover-divider" />

          <div className="popover-section">
            <div className="popover-label-group font-row">
              <span className="popover-section-title">Board Font Size</span>
              <span className="font-size-value">
                {settings.themeFontSize === 1 ? 'Small' : settings.themeFontSize === 3 ? 'Large' : 'Medium'}
              </span>
            </div>
            <div className="slider-wrapper">
              <input
                type="range"
                min="1"
                max="3"
                value={settings.themeFontSize || 2}
                onChange={(e) => onUpdateSetting('themeFontSize', parseInt(e.target.value, 10))}
                className="font-size-slider"
              />
              <div className="slider-labels">
                <span>A</span>
                <span style={{ fontSize: '1.05rem', fontWeight: 600 }}>A</span>
                <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>A</span>
              </div>
            </div>
          </div>
        </div>
      )}

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
        onErase={clearCellValue}
        notesMode={notesMode}
        onToggleNotes={toggleNotesMode}
        onFastPencil={autoFillNotes}
        hintsLeft={hintsLeft}
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
