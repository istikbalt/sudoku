import { useState, useCallback, useEffect } from 'react';
import { generatePuzzle, generateDailyChallenge } from '../engine/generator.js';
import { getDuplicates, isMistake } from '../engine/validator.js';
import { DIFFICULTY_CONFIGS, DIFFICULTY_LEVELS } from '../engine/difficulty.js';
import { useLocalSave } from './useLocalSave.js';
import { isValid } from '../engine/solver.js';

export function useSudokuGame(timer, initialSettings) {
  const { saveActiveGame, clearActiveGame, recordGamePlayed, recordGameCompleted, recordGameOver } = useLocalSave();

  // Core Game State
  const [difficulty, setDifficulty] = useState(DIFFICULTY_LEVELS.EASY);
  const [isDaily, setIsDaily] = useState(false);
  const [dateString, setDateString] = useState(null);
  const [cells, setCells] = useState([]);
  const [mistakes, setMistakes] = useState(0);
  const [activeCellIndex, setActiveCellIndex] = useState(null);
  const [notesMode, setNotesMode] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [hintsLeft, setHintsLeft] = useState(3);
  
  // History stack for Undo/Redo
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Settings cached inside game context
  const [settings, setSettings] = useState(initialSettings);

  // Update duplicate state for cells dynamically
  const updateDuplicates = useCallback((gridCells) => {
    if (!settings.highlightDuplicates) {
      return gridCells.map(c => ({ ...c, isDuplicate: false }));
    }
    const duplicateSet = getDuplicates(gridCells);
    return gridCells.map((c, idx) => ({
      ...c,
      isDuplicate: duplicateSet.has(idx)
    }));
  }, [settings.highlightDuplicates]);

  // Save current game state to local storage
  const autoSave = useCallback((gridCells, currentMistakes, currentDifficulty, currentIsDaily, currentDateString, currentHistory, currentHistoryIdx, currentScore, currentHintsLeft) => {
    const serializedState = {
      cells: gridCells.map(c => ({
        value: c.value,
        initialValue: c.initialValue,
        solutionValue: c.solutionValue,
        notes: c.notes
      })),
      mistakes: currentMistakes,
      difficulty: currentDifficulty,
      isDaily: currentIsDaily,
      dateString: currentDateString,
      seconds: timer.seconds,
      history: currentHistory.map(step => step.map(c => ({
        value: c.value,
        initialValue: c.initialValue,
        solutionValue: c.solutionValue,
        notes: c.notes
      }))),
      historyIndex: currentHistoryIdx,
      score: currentScore,
      hintsLeft: currentHintsLeft
    };
    saveActiveGame(serializedState);
  }, [timer.seconds, saveActiveGame]);

  // Start a brand new puzzle
  const startNewGame = useCallback((selectedDiff, dailyDate = null) => {
    const config = DIFFICULTY_CONFIGS[selectedDiff];
    
    let puzzleData;
    if (dailyDate) {
      puzzleData = generateDailyChallenge(dailyDate, selectedDiff);
      setIsDaily(true);
      setDateString(dailyDate);
    } else {
      puzzleData = generatePuzzle(selectedDiff);
      setIsDaily(false);
      setDateString(null);
    }

    const { puzzle, solution } = puzzleData;

    const initialCells = puzzle.map((val, idx) => ({
      value: val,
      initialValue: val,
      solutionValue: solution[idx],
      notes: [],
      isDuplicate: false
    }));

    const finalCells = updateDuplicates(initialCells);

    setDifficulty(selectedDiff);
    setCells(finalCells);
    setMistakes(0);
    setActiveCellIndex(null);
    setNotesMode(false);
    setIsCompleted(false);
    setIsGameOver(false);
    setScore(0);
    setHintsLeft(3);

    // Reset history
    const initialHistory = [JSON.parse(JSON.stringify(finalCells))];
    setHistory(initialHistory);
    setHistoryIndex(0);

    // Reset timer
    timer.reset(0);
    timer.start();

    // Record game played statistic
    if (!dailyDate) {
      recordGamePlayed();
    }

    // Trigger initial autosave
    autoSave(finalCells, 0, selectedDiff, !!dailyDate, dailyDate, initialHistory, 0, 0, 3);
  }, [timer, updateDuplicates, autoSave, recordGamePlayed]);

  // Load a previously saved game
  const loadGame = useCallback((savedState) => {
    if (!savedState) return false;

    const loadedCells = savedState.cells.map(c => ({
      ...c,
      isDuplicate: false
    }));
    const cellsWithDuplicates = updateDuplicates(loadedCells);

    setDifficulty(savedState.difficulty);
    setIsDaily(savedState.isDaily || false);
    setDateString(savedState.dateString || null);
    setCells(cellsWithDuplicates);
    setMistakes(savedState.mistakes);
    setActiveCellIndex(null);
    setNotesMode(false);
    setIsCompleted(false);
    setIsGameOver(false);
    setScore(savedState.score || 0);
    setHintsLeft(savedState.hintsLeft !== undefined ? savedState.hintsLeft : 3);

    // Load history
    if (savedState.history && savedState.historyIndex !== undefined) {
      setHistory(savedState.history);
      setHistoryIndex(savedState.historyIndex);
    } else {
      const initialHistory = [JSON.parse(JSON.stringify(cellsWithDuplicates))];
      setHistory(initialHistory);
      setHistoryIndex(0);
    }

    timer.reset(savedState.seconds || 0);
    timer.start();
    return true;
  }, [timer, updateDuplicates]);

  // Push a new grid snapshot to the history stack
  const pushHistory = useCallback((newCellsState, newScore = score, newHintsLeft = hintsLeft) => {
    const updatedHistory = history.slice(0, historyIndex + 1);
    updatedHistory.push(JSON.parse(JSON.stringify(newCellsState)));
    setHistory(updatedHistory);
    setHistoryIndex(updatedHistory.length - 1);

    // Trigger save
    autoSave(
      newCellsState,
      mistakes,
      difficulty,
      isDaily,
      dateString,
      updatedHistory,
      updatedHistory.length - 1,
      newScore,
      newHintsLeft
    );
  }, [history, historyIndex, autoSave, mistakes, difficulty, isDaily, dateString, score, hintsLeft]);

  // Select active cell
  const selectCell = useCallback((index) => {
    if (isCompleted || isGameOver) return;
    setActiveCellIndex(index);
  }, [isCompleted, isGameOver]);

  // Toggles notes mode
  const toggleNotesMode = useCallback(() => {
    setNotesMode(prev => !prev);
  }, []);

  // Place a value in the currently selected cell
  const setCellValue = useCallback((value) => {
    if (activeCellIndex === null || isCompleted || isGameOver) return;

    const targetCell = cells[activeCellIndex];
    if (targetCell.initialValue !== 0) return; // Cannot edit original clues!

    // If game was paused, resume on action
    if (!timer.isActive) {
      timer.start();
    }

    let newScore = score;
    let newMistakes = mistakes;

    let newCells = cells.map((c, idx) => {
      if (idx !== activeCellIndex) return c;
      
      if (notesMode) {
        // Toggle note
        const currentNotes = [...c.notes];
        const noteIdx = currentNotes.indexOf(value);
        if (noteIdx > -1) {
          currentNotes.splice(noteIdx, 1);
        } else {
          currentNotes.push(value);
          currentNotes.sort();
          newScore += 10; // pencil note +10 points
        }
        return { ...c, notes: currentNotes, value: 0 };
      } else {
        // Standard placement
        // If placing same value, clear it (toggle behavior)
        const newValue = c.value === value ? 0 : value;
        return { ...c, value: newValue, notes: [] };
      }
    });

    // Check duplicate warnings dynamically
    newCells = updateDuplicates(newCells);

    // If we filled a value in normal mode (not note), verify if it is a mistake or correct
    if (!notesMode && value !== 0 && targetCell.value !== value) {
      const solutionVal = targetCell.solutionValue;
      if (isMistake(value, solutionVal)) {
        newMistakes += 1;
        setMistakes(newMistakes);
        newScore = Math.max(0, newScore - 100);
        setScore(newScore);

        // Check if Game Over
        const config = DIFFICULTY_CONFIGS[difficulty];
        if (settings.mistakeLimitEnabled && newMistakes >= config.maxMistakes) {
          setIsGameOver(true);
          timer.pause();
          clearActiveGame();
          recordGameOver();
          setCells(newCells);
          return;
        }
      } else {
        // Correct placement!
        if (targetCell.value !== solutionVal) {
          newScore += 50;
          setScore(newScore);
        }
      }
    } else if (notesMode) {
      setScore(newScore);
    }

    setCells(newCells);
    pushHistory(newCells, newScore, hintsLeft);

    // Verify Completion
    const hasEmpty = newCells.some(c => c.value === 0);
    const hasErrors = newCells.some(c => c.value !== 0 && c.value !== c.solutionValue);

    if (!hasEmpty && !hasErrors) {
      setIsCompleted(true);
      timer.pause();
      clearActiveGame();
      
      // Save stats
      if (!isDaily) {
        recordGameCompleted(difficulty, timer.seconds);
      }
    }
  }, [
    activeCellIndex,
    cells,
    notesMode,
    isCompleted,
    isGameOver,
    timer,
    updateDuplicates,
    mistakes,
    difficulty,
    settings.mistakeLimitEnabled,
    pushHistory,
    clearActiveGame,
    isDaily,
    recordGameCompleted,
    recordGameOver,
    score,
    hintsLeft
  ]);

  // Clear value / Eraser action
  const clearCellValue = useCallback(() => {
    if (activeCellIndex === null || isCompleted || isGameOver) return;
    
    const targetCell = cells[activeCellIndex];
    if (targetCell.initialValue !== 0) return; // Cannot clear original clues!

    // If cell already empty and has no notes, do nothing
    if (targetCell.value === 0 && targetCell.notes.length === 0) return;

    let newCells = cells.map((c, idx) => {
      if (idx !== activeCellIndex) return c;
      return { ...c, value: 0, notes: [] };
    });

    newCells = updateDuplicates(newCells);
    setCells(newCells);
    pushHistory(newCells);
  }, [activeCellIndex, cells, isCompleted, isGameOver, updateDuplicates, pushHistory]);

  // Provide a Hint for active cell
  const revealHint = useCallback(() => {
    if (activeCellIndex === null || isCompleted || isGameOver) return;

    const targetCell = cells[activeCellIndex];
    if (targetCell.initialValue !== 0) return; // Clues are already solved
    if (targetCell.value === targetCell.solutionValue) return; // Already solved correctly

    const solutionVal = targetCell.solutionValue;
    const newHintsLeft = Math.max(0, hintsLeft - 1);
    setHintsLeft(newHintsLeft);

    let newScore = score;
    if (targetCell.value !== solutionVal) {
      newScore += 50;
      setScore(newScore);
    }

    // Hint acts as placing the exact correct cell value
    let newCells = cells.map((c, idx) => {
      if (idx !== activeCellIndex) return c;
      return { ...c, value: solutionVal, notes: [] };
    });

    newCells = updateDuplicates(newCells);
    setCells(newCells);
    pushHistory(newCells, newScore, newHintsLeft);

    // Verify Completion
    const hasEmpty = newCells.some(c => c.value === 0);
    const hasErrors = newCells.some(c => c.value !== 0 && c.value !== c.solutionValue);

    if (!hasEmpty && !hasErrors) {
      setIsCompleted(true);
      timer.pause();
      clearActiveGame();
      if (!isDaily) {
        recordGameCompleted(difficulty, timer.seconds);
      }
    }
  }, [
    activeCellIndex,
    cells,
    isCompleted,
    isGameOver,
    updateDuplicates,
    pushHistory,
    clearActiveGame,
    isDaily,
    difficulty,
    timer,
    recordGameCompleted,
    score,
    hintsLeft
  ]);

  // Undo Action
  const undo = useCallback(() => {
    if (historyIndex <= 0 || isCompleted || isGameOver) return;

    const newIdx = historyIndex - 1;
    const previousState = JSON.parse(JSON.stringify(history[newIdx]));
    
    const cellsWithDuplicates = updateDuplicates(previousState);
    setCells(cellsWithDuplicates);
    setHistoryIndex(newIdx);

    autoSave(
      cellsWithDuplicates,
      mistakes,
      difficulty,
      isDaily,
      dateString,
      history,
      newIdx,
      score,
      hintsLeft
    );
  }, [history, historyIndex, isCompleted, isGameOver, updateDuplicates, autoSave, mistakes, difficulty, isDaily, dateString, score, hintsLeft]);

  // Redo Action
  const redo = useCallback(() => {
    if (historyIndex >= history.length - 1 || isCompleted || isGameOver) return;

    const newIdx = historyIndex + 1;
    const nextState = JSON.parse(JSON.stringify(history[newIdx]));

    const cellsWithDuplicates = updateDuplicates(nextState);
    setCells(cellsWithDuplicates);
    setHistoryIndex(newIdx);

    autoSave(
      cellsWithDuplicates,
      mistakes,
      difficulty,
      isDaily,
      dateString,
      history,
      newIdx,
      score,
      hintsLeft
    );
  }, [history, historyIndex, isCompleted, isGameOver, updateDuplicates, autoSave, mistakes, difficulty, isDaily, dateString, score, hintsLeft]);

  // Sync settings when they are updated in SettingsScreen
  const updateSettings = useCallback((newSettings) => {
    setSettings(newSettings);
    // Trigger duplicate recalculation based on new settings
    setCells(prev => {
      const duplicateSet = newSettings.highlightDuplicates ? getDuplicates(prev) : new Set();
      return prev.map((c, idx) => ({
        ...c,
        isDuplicate: duplicateSet.has(idx)
      }));
    });
  }, []);

  // Autosave periodically whenever time advances (every 10 seconds)
  useEffect(() => {
    if (cells.length > 0 && !isCompleted && !isGameOver && timer.isActive && timer.seconds % 10 === 0) {
      autoSave(cells, mistakes, difficulty, isDaily, dateString, history, historyIndex, score, hintsLeft);
    }
  }, [timer.seconds, cells, isCompleted, isGameOver, timer.isActive, mistakes, difficulty, isDaily, dateString, history, historyIndex, autoSave, score, hintsLeft]);

  // Auto-fill all valid notes for empty cells (Fast Pencil)
  const autoFillNotes = useCallback(() => {
    if (isCompleted || isGameOver) return;

    const board = cells.map(c => c.value);
    
    let newCells = cells.map((cell, idx) => {
      if (cell.value !== 0) return cell;

      const validCandidates = [];
      for (let n = 1; n <= 9; n++) {
        if (isValid(board, idx, n)) {
          validCandidates.push(n);
        }
      }

      return {
        ...cell,
        notes: validCandidates
      };
    });

    newCells = updateDuplicates(newCells);
    setCells(newCells);
    pushHistory(newCells, score, hintsLeft);
  }, [cells, isCompleted, isGameOver, updateDuplicates, pushHistory, score, hintsLeft]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  return {
    cells,
    difficulty,
    isDaily,
    dateString,
    mistakes,
    activeCellIndex,
    notesMode,
    isCompleted,
    isGameOver,
    canUndo,
    canRedo,
    startNewGame,
    loadGame,
    selectCell,
    setCellValue,
    clearCellValue,
    toggleNotesMode,
    revealHint,
    undo,
    redo,
    updateSettings,
    autoFillNotes,
    score,
    hintsLeft
  };
}
