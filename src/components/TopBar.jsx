import React from 'react';
import { ArrowLeft, Pause, Play } from 'lucide-react';
import { DIFFICULTY_CONFIGS } from '../engine/difficulty.js';

/**
 * TopBar navigation and live match details.
 */
export default function TopBar({
  difficulty,
  mistakes,
  isPaused,
  timerLabel,
  onPauseToggle,
  onBackHome,
  settings
}) {
  const difficultyName = DIFFICULTY_CONFIGS[difficulty]?.name || 'Easy';
  const maxMistakes = DIFFICULTY_CONFIGS[difficulty]?.maxMistakes || 3;

  return (
    <div className="top-bar">
      {/* Back button */}
      <button
        onClick={onBackHome}
        style={{ display: 'flex', alignItems: 'center', color: 'var(--text-secondary)' }}
        aria-label="Back to home screen"
        id="topbar-back-btn"
      >
        <ArrowLeft size={24} />
      </button>

      {/* Game meta data */}
      <div className="game-meta">
        <span className="difficulty-tag">{difficultyName}</span>
        {settings.mistakeLimitEnabled && (
          <span className="stats-tag">
            Mistakes: <strong style={{ color: mistakes > 0 ? 'var(--error)' : 'inherit' }}>{mistakes}</strong>/{maxMistakes}
          </span>
        )}
      </div>

      {/* Timer with Pause Toggle */}
      <div
        className="timer-container"
        onClick={onPauseToggle}
        title={isPaused ? 'Resume game' : 'Pause game'}
        id="topbar-timer-toggle"
      >
        {isPaused ? <Play size={16} fill="var(--primary)" /> : <Pause size={16} />}
        <span>{timerLabel}</span>
      </div>
    </div>
  );
}
