import React, { useCallback } from 'react';
import { Award, Trophy, Clock, CheckCircle } from 'lucide-react';

/**
 * Statistics overview panel for the StatsScreen.
 */
export default function StatsPanel({ stats }) {
  const { gamesPlayed, gamesCompleted, bestTimes, totalCompletedPlayTime } = stats;

  // Format seconds to readable format
  const formatTime = useCallback((totalSecs) => {
    if (!totalSecs) return '—';
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;

    const formattedMins = mins.toString().padStart(2, '0');
    const formattedSecs = secs.toString().padStart(2, '0');

    if (hrs > 0) {
      return `${hrs}:${formattedMins}:${formattedSecs}`;
    }
    return `${mins}:${formattedSecs}`;
  }, []);

  // Compute stats metrics
  const completionRate = gamesPlayed > 0 ? Math.round((gamesCompleted / gamesPlayed) * 100) : 0;
  const avgTime = gamesCompleted > 0 ? Math.round(totalCompletedPlayTime / gamesCompleted) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* High Level Cards */}
      <div className="stats-grid">
        <div className="stats-card">
          <div className="stats-card-value">{gamesPlayed}</div>
          <div className="stats-card-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
            <Award size={14} /> Played
          </div>
        </div>

        <div className="stats-card">
          <div className="stats-card-value">{gamesCompleted}</div>
          <div className="stats-card-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
            <CheckCircle size={14} /> Completed
          </div>
        </div>

        <div className="stats-card">
          <div className="stats-card-value">{completionRate}%</div>
          <div className="stats-card-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
            <Trophy size={14} /> Win Rate
          </div>
        </div>

        <div className="stats-card">
          <div className="stats-card-value">{formatTime(avgTime)}</div>
          <div className="stats-card-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
            <Clock size={14} /> Avg Time
          </div>
        </div>
      </div>

      {/* Best Times Breakdown */}
      <div className="best-times-section">
        <h3 className="best-times-title">Personal Best Times</h3>
        
        <div className="best-time-row">
          <span className="best-time-diff" style={{ color: 'var(--text-secondary)' }}>Easy</span>
          <span className="best-time-val">{formatTime(bestTimes.easy)}</span>
        </div>

        <div className="best-time-row">
          <span className="best-time-diff" style={{ color: 'var(--text-secondary)' }}>Medium</span>
          <span className="best-time-val">{formatTime(bestTimes.medium)}</span>
        </div>

        <div className="best-time-row">
          <span className="best-time-diff" style={{ color: 'var(--text-secondary)' }}>Hard</span>
          <span className="best-time-val">{formatTime(bestTimes.hard)}</span>
        </div>

        <div className="best-time-row">
          <span className="best-time-diff" style={{ color: 'var(--text-secondary)' }}>Expert</span>
          <span className="best-time-val">{formatTime(bestTimes.expert)}</span>
        </div>
      </div>
    </div>
  );
}
