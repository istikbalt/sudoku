import React from 'react';
import { ArrowLeft, Star, Share2, Palette, Settings, Pause, Play } from 'lucide-react';
import { DIFFICULTY_CONFIGS } from '../engine/difficulty.js';

/**
 * TopBar navigation and dual-row match details matching screenshots 3 & 4.
 */
export default function TopBar({
  difficulty,
  mistakes,
  score = 0,
  streak = 0,
  isPaused,
  timerLabel,
  onPauseToggle,
  onBackHome,
  settings,
  isFavorite,
  onFavoriteToggle,
  onShareClick,
  onPaletteClick,
  onSettingsClick
}) {
  const difficultyName = DIFFICULTY_CONFIGS[difficulty]?.name || 'Easy';
  const maxMistakes = DIFFICULTY_CONFIGS[difficulty]?.maxMistakes || 3;

  return (
    <div className="game-header-container">
      {/* Row 1: Back/Streak & Top Actions */}
      <div className="header-row-primary">
        {/* Left Side: Back & Streak */}
        <div className="header-left-group">
          <button
            onClick={onBackHome}
            className="header-icon-btn"
            aria-label="Back to home screen"
            id="topbar-back-btn"
          >
            <ArrowLeft size={24} />
          </button>
          {streak > 0 && (
            <span className="streak-badge">Streak {streak}</span>
          )}
        </div>

        {/* Right Side: Primary Actions */}
        <div className="header-right-group">
          <button
            onClick={onFavoriteToggle}
            className={`header-icon-btn ${isFavorite ? 'active-star' : ''}`}
            aria-label="Favorite this game"
            id="topbar-star-btn"
          >
            <Star size={22} fill={isFavorite ? 'var(--warning)' : 'none'} stroke={isFavorite ? 'var(--warning)' : 'currentColor'} />
          </button>

          <button
            onClick={onShareClick}
            className="header-icon-btn"
            aria-label="Share game"
            id="topbar-share-btn"
          >
            <Share2 size={22} />
          </button>

          <button
            onClick={onPaletteClick}
            className="header-icon-btn"
            aria-label="Change theme"
            id="topbar-palette-btn"
          >
            <Palette size={22} />
          </button>

          <button
            onClick={onSettingsClick}
            className="header-icon-btn"
            aria-label="Open settings"
            id="topbar-settings-btn"
          >
            <Settings size={22} />
          </button>
        </div>
      </div>

      {/* Row 2: Mistakes, Score/Difficulty, Timer */}
      <div className="header-row-secondary">
        {/* Left: Mistakes */}
        <div className="header-mistakes">
          {settings.mistakeLimitEnabled ? (
            <span>
              Mistakes: <strong style={{ color: mistakes > 0 ? 'var(--error)' : 'inherit' }}>{mistakes}</strong>/{maxMistakes}
            </span>
          ) : (
            <span>Relax Mode</span>
          )}
        </div>

        {/* Center: Score & Difficulty */}
        <div className="header-center-info">
          <span className="header-score-label">Score: {score}</span>
          <span className="header-difficulty-label">{difficultyName}</span>
        </div>

        {/* Right: Timer & Pause Button */}
        <div
          className="header-timer-group"
          onClick={onPauseToggle}
          title={isPaused ? 'Resume game' : 'Pause game'}
          id="topbar-timer-toggle"
        >
          <span className="header-timer-label">{timerLabel}</span>
          <button className="header-pause-btn" aria-label="Pause or play game">
            {isPaused ? <Play size={12} fill="currentColor" /> : <Pause size={12} fill="currentColor" />}
          </button>
        </div>
      </div>
    </div>
  );
}
