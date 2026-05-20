import React from 'react';
import { Play, PlayCircle, Calendar, BarChart2, Settings } from 'lucide-react';
import AdBannerPlaceholder from '../components/AdBannerPlaceholder.jsx';

/**
 * Main dashboard screen.
 */
export default function HomeScreen({
  hasSavedGame,
  savedGameDifficulty,
  onContinueGame,
  onNewGameClick,
  onDailyChallengeClick,
  onStatsClick,
  onSettingsClick
}) {
  return (
    <div className="screen" style={{ justifyContent: 'space-between', paddingBottom: 0 }}>
      {/* Brand Title */}
      <div className="app-header">
        <h1 className="app-title">Sudoku</h1>
        <p className="app-subtitle">Calm &amp; Interruption-Free</p>
      </div>

      {/* Main Action Hub */}
      <div className="menu-options">
        {/* Continue Last Game */}
        {hasSavedGame && (
          <button className="menu-btn" onClick={onContinueGame} style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }} id="home-continue-btn">
            <div className="menu-btn-icon" style={{ backgroundColor: 'var(--primary)', color: 'white' }}>
              <PlayCircle size={24} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span>Continue Game</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>
                Active {savedGameDifficulty} board
              </span>
            </div>
          </button>
        )}

        {/* Start New Game */}
        <button className="menu-btn" onClick={onNewGameClick} id="home-newgame-btn">
          <div className="menu-btn-icon">
            <Play size={22} fill="var(--primary)" />
          </div>
          <span>New Game</span>
        </button>

        {/* Daily Challenge */}
        <button className="menu-btn" onClick={onDailyChallengeClick} id="home-daily-btn">
          <div className="menu-btn-icon" style={{ color: 'var(--accent-color)' }}>
            <Calendar size={22} />
          </div>
          <span>Daily Challenge</span>
        </button>

        {/* Statistics */}
        <button className="menu-btn" onClick={onStatsClick} id="home-stats-btn">
          <div className="menu-btn-icon">
            <BarChart2 size={22} />
          </div>
          <span>Statistics</span>
        </button>

        {/* Settings */}
        <button className="menu-btn" onClick={onSettingsClick} id="home-settings-btn">
          <div className="menu-btn-icon">
            <Settings size={22} />
          </div>
          <span>Settings</span>
        </button>
      </div>

      {/* Aesthetic Spacer */}
      <div style={{ flex: 1 }}></div>

      {/* Ad Footprint */}
      <AdBannerPlaceholder />
    </div>
  );
}
