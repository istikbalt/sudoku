import { useCallback } from 'react';

const KEYS = {
  ACTIVE_GAME: 'sudoku_active_game_v1',
  STATS: 'sudoku_stats_v1',
  SETTINGS: 'sudoku_settings_v1'
};

const DEFAULT_STATS = {
  gamesPlayed: 0,
  gamesCompleted: 0,
  bestTimes: {
    easy: null,
    medium: null,
    hard: null,
    expert: null
  },
  totalCompletedPlayTime: 0 // in seconds, to calculate average completed time
};

const DEFAULT_SETTINGS = {
  darkMode: false, // Soft premium light mode by default!
  soundEnabled: false,
  mistakeLimitEnabled: true,
  highlightDuplicates: true,
  highlightSameNumbers: true,
  highlightArea: true
};

export function useLocalSave() {
  // --- Active Game ---
  const saveActiveGame = useCallback((gameState) => {
    try {
      if (!gameState) {
        localStorage.removeItem(KEYS.ACTIVE_GAME);
      } else {
        localStorage.setItem(KEYS.ACTIVE_GAME, JSON.stringify(gameState));
      }
    } catch (e) {
      console.error('Failed to save active game state:', e);
    }
  }, []);

  const getActiveGame = useCallback(() => {
    try {
      const data = localStorage.getItem(KEYS.ACTIVE_GAME);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Failed to read active game state:', e);
      return null;
    }
  }, []);

  const clearActiveGame = useCallback(() => {
    try {
      localStorage.removeItem(KEYS.ACTIVE_GAME);
    } catch (e) {
      console.error('Failed to clear active game state:', e);
    }
  }, []);

  // --- Statistics ---
  const getStats = useCallback(() => {
    try {
      const data = localStorage.getItem(KEYS.STATS);
      return data ? { ...DEFAULT_STATS, ...JSON.parse(data) } : DEFAULT_STATS;
    } catch (e) {
      console.error('Failed to get stats:', e);
      return DEFAULT_STATS;
    }
  }, []);

  const saveStats = useCallback((stats) => {
    try {
      localStorage.setItem(KEYS.STATS, JSON.stringify(stats));
    } catch (e) {
      console.error('Failed to save stats:', e);
    }
  }, []);

  const recordGamePlayed = useCallback(() => {
    const stats = getStats();
    stats.gamesPlayed += 1;
    saveStats(stats);
    return stats;
  }, [getStats, saveStats]);

  const recordGameCompleted = useCallback((difficulty, timeInSeconds) => {
    const stats = getStats();
    stats.gamesCompleted += 1;
    stats.totalCompletedPlayTime += timeInSeconds;

    const diffKey = difficulty.toLowerCase();
    const currentBest = stats.bestTimes[diffKey];
    if (currentBest === null || timeInSeconds < currentBest) {
      stats.bestTimes[diffKey] = timeInSeconds;
    }

    saveStats(stats);
    return stats;
  }, [getStats, saveStats]);

  // --- Settings ---
  const getSettings = useCallback(() => {
    try {
      const data = localStorage.getItem(KEYS.SETTINGS);
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
    } catch (e) {
      console.error('Failed to get settings:', e);
      return DEFAULT_SETTINGS;
    }
  }, []);

  const saveSettings = useCallback((settings) => {
    try {
      localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings:', e);
    }
  }, []);

  return {
    saveActiveGame,
    getActiveGame,
    clearActiveGame,
    getStats,
    saveStats,
    recordGamePlayed,
    recordGameCompleted,
    getSettings,
    saveSettings
  };
}
