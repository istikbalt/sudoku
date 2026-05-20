import React from 'react';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { DIFFICULTY_LEVELS } from '../engine/difficulty.js';
import AdBannerPlaceholder from '../components/AdBannerPlaceholder.jsx';

/**
 * Screen to choose game difficulty.
 */
export default function DifficultyScreen({ onSelectDifficulty, onBack }) {
  const levels = [
    {
      key: DIFFICULTY_LEVELS.EASY,
      name: 'Easy',
      desc: '43 clues. Perfect for relaxing and warming up.'
    },
    {
      key: DIFFICULTY_LEVELS.MEDIUM,
      name: 'Medium',
      desc: '34 clues. A standard mental workout.'
    },
    {
      key: DIFFICULTY_LEVELS.HARD,
      name: 'Hard',
      desc: '28 clues. Tests advanced scanning skills.'
    },
    {
      key: DIFFICULTY_LEVELS.EXPERT,
      name: 'Expert',
      desc: '22 clues. Highly restrictive. For sudoku masters.'
    }
  ];

  return (
    <div className="screen" style={{ justifyContent: 'space-between', paddingBottom: 0 }}>
      {/* Top Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
          <button onClick={onBack} aria-label="Back to home" style={{ marginRight: 16, color: 'var(--text-secondary)' }}>
            <ArrowLeft size={24} />
          </button>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Select Difficulty</h2>
        </div>

        {/* Selection buttons */}
        <div className="difficulty-selector">
          {levels.map((level) => (
            <button
              key={level.key}
              className="difficulty-btn"
              onClick={() => onSelectDifficulty(level.key)}
              id={`diff-btn-${level.key}`}
            >
              <div className="diff-info">
                <span className="diff-name">{level.name}</span>
                <span className="diff-desc">{level.desc}</span>
              </div>
              <ChevronRight size={20} style={{ color: 'var(--text-secondary)' }} />
            </button>
          ))}
        </div>
      </div>

      {/* Ad Footprint */}
      <AdBannerPlaceholder />
    </div>
  );
}
