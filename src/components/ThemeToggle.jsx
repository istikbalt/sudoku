import React from 'react';
import { Sun, Moon } from 'lucide-react';

/**
 * Premium Theme switcher button.
 * Triggers document theme shifts and saves preference.
 * 
 * @param {object} props
 * @param {boolean} props.darkMode
 * @param {function} props.onChange
 */
export default function ThemeToggle({ darkMode, onChange }) {
  return (
    <button
      onClick={() => onChange(!darkMode)}
      className="control-btn"
      style={{ padding: '8px 12px', background: 'var(--bg-color)', borderRadius: '20px', flex: 'none' }}
      aria-label="Toggle Theme"
      id="theme-toggle-btn"
    >
      {darkMode ? (
        <Sun size={20} className="text-amber-500" style={{ color: 'var(--warning)' }} />
      ) : (
        <Moon size={20} style={{ color: 'var(--primary)' }} />
      )}
    </button>
  );
}
