export const DIFFICULTY_LEVELS = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
  EXPERT: 'expert'
};

export const DIFFICULTY_CONFIGS = {
  [DIFFICULTY_LEVELS.EASY]: {
    name: 'Easy',
    cluesCount: 43, // Target clues to keep
    maxMistakes: 3
  },
  [DIFFICULTY_LEVELS.MEDIUM]: {
    name: 'Medium',
    cluesCount: 34,
    maxMistakes: 3
  },
  [DIFFICULTY_LEVELS.HARD]: {
    name: 'Hard',
    cluesCount: 28,
    maxMistakes: 3
  },
  [DIFFICULTY_LEVELS.EXPERT]: {
    name: 'Expert',
    cluesCount: 22,
    maxMistakes: 3
  }
};
