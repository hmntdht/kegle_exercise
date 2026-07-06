// Centralized LocalStorage keys and default shapes for Kegel Trainer.

export const STORAGE_KEYS = {
  HISTORY: 'kegel.history',
  SETTINGS: 'kegel.settings',
  STREAK: 'kegel.streak',
  REMINDERS: 'kegel.reminders',
  ACHIEVEMENTS: 'kegel.achievements',
  THEME: 'kegel.theme',
}

export const DEFAULT_SETTINGS = {
  theme: 'system', // 'dark' | 'light' | 'system'
  voiceEnabled: true,
  soundEnabled: true,
  animationsEnabled: true,
  units: 'seconds', // 'seconds' | 'minutes'
  dailyGoal: 2, // sessions per day
}

export const DEFAULT_REMINDERS = {
  enabled: false,
  times: ['08:00', '20:00'],
}

export const DEFAULT_STREAK = {
  current: 0,
  longest: 0,
  lastCompletedDate: null, // date key of last day the goal was met
  daily: {}, // { 'YYYY-MM-DD': sessionsCompletedThatDay }
}

export const ACHIEVEMENT_DEFS = [
  { id: 'first_workout', label: 'First Workout', description: 'Complete your first session.' },
  { id: 'streak_7', label: '7-Day Streak', description: 'Hit your daily goal 7 days in a row.' },
  { id: 'streak_30', label: '30-Day Streak', description: 'Hit your daily goal 30 days in a row.' },
  { id: 'sessions_100', label: '100 Sessions', description: 'Complete 100 total sessions.' },
  { id: 'sessions_500', label: '500 Sessions', description: 'Complete 500 total sessions.' },
  { id: 'sessions_1000', label: '1000 Sessions', description: 'Complete 1000 total sessions.' },
]

export const MOTIVATIONAL_QUOTES = [
  'Small, steady squeezes build real strength.',
  'Consistency beats intensity — you showed up today.',
  'Every rep is an investment in your future self.',
  'Strong pelvic floor, strong foundation.',
  'Breathe, contract, relax. That\u2019s all it takes.',
  'Progress hides in the reps nobody sees.',
  'You\u2019re building a habit, not chasing perfection.',
]

export const readJSON = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

export const writeJSON = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage full or unavailable — fail silently, app still works in-memory.
  }
}
