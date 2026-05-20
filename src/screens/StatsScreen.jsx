import React from 'react';
import { ArrowLeft, Trash2 } from 'lucide-react';
import StatsPanel from '../components/StatsPanel.jsx';
import AdBannerPlaceholder from '../components/AdBannerPlaceholder.jsx';

/**
 * Historical statistics review screen.
 */
export default function StatsScreen({ stats, onResetStats, onBack }) {
  const handleResetClick = () => {
    const confirmClear = window.confirm(
      'Are you sure you want to reset all your statistics? This will permanently delete your best times and game completion records.'
    );
    if (confirmClear) {
      onResetStats();
    }
  };

  return (
    <div className="screen" style={{ justifyContent: 'space-between', paddingBottom: 0 }}>
      <div>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button onClick={onBack} aria-label="Back to home" style={{ marginRight: 16, color: 'var(--text-secondary)' }}>
              <ArrowLeft size={24} />
            </button>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Statistics</h2>
          </div>

          {/* Reset button */}
          {(stats.gamesPlayed > 0 || stats.gamesCompleted > 0) && (
            <button
              onClick={handleResetClick}
              style={{ color: 'var(--error)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem', fontWeight: '500' }}
              title="Reset stats"
              id="stats-reset-btn"
            >
              <Trash2 size={16} /> Reset
            </button>
          )}
        </div>

        {/* Stats Content */}
        <StatsPanel stats={stats} />
      </div>

      {/* Ad Footprint */}
      <AdBannerPlaceholder />
    </div>
  );
}
