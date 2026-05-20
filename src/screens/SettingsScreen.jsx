import React from 'react';
import { ArrowLeft } from 'lucide-react';
import AdBannerPlaceholder from '../components/AdBannerPlaceholder.jsx';

/**
 * Settings configuration screen.
 */
export default function SettingsScreen({ settings, onUpdateSetting, onBack }) {
  const toggleSetting = (key) => {
    onUpdateSetting(key, !settings[key]);
  };

  return (
    <div className="screen" style={{ justifyContent: 'space-between', paddingBottom: 0 }}>
      <div>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
          <button onClick={onBack} aria-label="Back to home" style={{ marginRight: 16, color: 'var(--text-secondary)' }}>
            <ArrowLeft size={24} />
          </button>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Settings</h2>
        </div>

        {/* Options List */}
        <div className="settings-list">
          {/* Dark Mode */}
          <div className="setting-item">
            <div className="setting-label-group">
              <span className="setting-title">Dark Theme</span>
              <span className="setting-desc">Toggle premium dark aesthetic</span>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={settings.darkMode}
                onChange={() => toggleSetting('darkMode')}
                id="setting-darkmode-switch"
              />
              <span className="slider"></span>
            </label>
          </div>

          {/* Mistake Limit */}
          <div className="setting-item">
            <div className="setting-label-group">
              <span className="setting-title">Mistake Limit</span>
              <span className="setting-desc">End game after 3 mistakes</span>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={settings.mistakeLimitEnabled}
                onChange={() => toggleSetting('mistakeLimitEnabled')}
                id="setting-mistakelast-switch"
              />
              <span className="slider"></span>
            </label>
          </div>

          {/* Highlight Duplicates */}
          <div className="setting-item">
            <div className="setting-label-group">
              <span className="setting-title">Highlight Duplicates</span>
              <span className="setting-desc">Mark duplicate entries in same row/col/box</span>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={settings.highlightDuplicates}
                onChange={() => toggleSetting('highlightDuplicates')}
                id="setting-duplicates-switch"
              />
              <span className="slider"></span>
            </label>
          </div>

          {/* Highlight Area */}
          <div className="setting-item">
            <div className="setting-label-group">
              <span className="setting-title">Highlight Peer Area</span>
              <span className="setting-desc">Shade coordinates sharing row, col, or box</span>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={settings.highlightArea}
                onChange={() => toggleSetting('highlightArea')}
                id="setting-peerarea-switch"
              />
              <span className="slider"></span>
            </label>
          </div>

          {/* Highlight Same Numbers */}
          <div className="setting-item">
            <div className="setting-label-group">
              <span className="setting-title">Highlight Identical Numbers</span>
              <span className="setting-desc">Highlight other cells containing selected number</span>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={settings.highlightSameNumbers}
                onChange={() => toggleSetting('highlightSameNumbers')}
                id="setting-samenums-switch"
              />
              <span className="slider"></span>
            </label>
          </div>

          {/* Sounds */}
          <div className="setting-item">
            <div className="setting-label-group">
              <span className="setting-title">Sound Effects (Future)</span>
              <span className="setting-desc">Play gentle feedback tones on inputs</span>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={settings.soundEnabled}
                onChange={() => toggleSetting('soundEnabled')}
                id="setting-sounds-switch"
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>
      </div>

      {/* Ad Footprint */}
      <AdBannerPlaceholder />
    </div>
  );
}
