import React, { useState, useEffect } from 'react';
import HomeScreen from './screens/HomeScreen.jsx';
import DifficultyScreen from './screens/DifficultyScreen.jsx';
import GameScreen from './screens/GameScreen.jsx';
import StatsScreen from './screens/StatsScreen.jsx';
import SettingsScreen from './screens/SettingsScreen.jsx';

import { useTimer } from './hooks/useTimer.js';
import { useSudokuGame } from './hooks/useSudokuGame.js';
import { useLocalSave } from './hooks/useLocalSave.js';

export default function App() {
  const { getActiveGame, getStats, saveStats, getSettings, saveSettings } = useLocalSave();

  // Navigation Screen Router
  const [currentScreen, setCurrentScreen] = useState('home');

  // Core App states loaded from localStorage
  const [settings, setSettings] = useState(() => getSettings());
  const [stats, setStats] = useState(() => getStats());
  const [savedGameExists, setSavedGameExists] = useState(false);
  const [savedGameDifficulty, setSavedGameDifficulty] = useState('easy');

  // Hooks integration
  const timer = useTimer(0);
  const game = useSudokuGame(timer, settings);

  // Sync Dark/Light theme with document element
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [settings.darkMode]);

  // Check on mount and periodically if a saved game exists in localStorage
  const checkSavedGame = () => {
    const active = getActiveGame();
    if (active) {
      setSavedGameExists(true);
      setSavedGameDifficulty(active.difficulty);
    } else {
      setSavedGameExists(false);
    }
  };

  useEffect(() => {
    checkSavedGame();
  }, [currentScreen]);

  // Handle setting updates
  const handleUpdateSetting = (key, value) => {
    const updatedSettings = { ...settings, [key]: value };
    setSettings(updatedSettings);
    saveSettings(updatedSettings);
    game.updateSettings(updatedSettings);
  };

  // Reset all stats
  const handleResetStats = () => {
    const defaultStats = {
      gamesPlayed: 0,
      gamesCompleted: 0,
      bestTimes: {
        easy: null,
        medium: null,
        hard: null,
        expert: null
      },
      totalCompletedPlayTime: 0
    };
    setStats(defaultStats);
    saveStats(defaultStats);
  };

  // Navigate to difficulty selector
  const handleNewGameClick = () => {
    setCurrentScreen('difficulty');
  };

  // Select a difficulty and start the game
  const handleSelectDifficulty = (selectedDiff) => {
    game.startNewGame(selectedDiff);
    setCurrentScreen('game');
  };

  // Trigger Daily Challenge
  const handleDailyChallenge = () => {
    // Generate YYYY-MM-DD deterministically in local timezone
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const localDateString = `${year}-${month}-${day}`;

    // Standard daily difficulty is Medium
    game.startNewGame('medium', localDateString);
    setCurrentScreen('game');
  };

  // Continue a paused/saved game
  const handleContinueGame = () => {
    const activeState = getActiveGame();
    if (activeState) {
      const loaded = game.loadGame(activeState);
      if (loaded) {
        setCurrentScreen('game');
      }
    }
  };

  // Return to home screen
  const handleBackToHome = () => {
    // Pause timer when stepping back to dashboard
    timer.pause();
    // Refresh stats from storage
    setStats(getStats());
    setCurrentScreen('home');
  };

  return (
    <>
      {currentScreen === 'home' && (
        <HomeScreen
          hasSavedGame={savedGameExists}
          savedGameDifficulty={savedGameDifficulty}
          onContinueGame={handleContinueGame}
          onNewGameClick={handleNewGameClick}
          onDailyChallengeClick={handleDailyChallenge}
          onStatsClick={() => {
            setStats(getStats());
            setCurrentScreen('stats');
          }}
          onSettingsClick={() => setCurrentScreen('settings')}
        />
      )}

      {currentScreen === 'difficulty' && (
        <DifficultyScreen
          onSelectDifficulty={handleSelectDifficulty}
          onBack={handleBackToHome}
        />
      )}

      {currentScreen === 'game' && (
        <GameScreen
          gameState={game}
          timer={timer}
          settings={settings}
          onBackHome={handleBackToHome}
        />
      )}

      {currentScreen === 'stats' && (
        <StatsScreen
          stats={stats}
          onResetStats={handleResetStats}
          onBack={handleBackToHome}
        />
      )}

      {currentScreen === 'settings' && (
        <SettingsScreen
          settings={settings}
          onUpdateSetting={handleUpdateSetting}
          onBack={handleBackToHome}
        />
      )}
    </>
  );
}
