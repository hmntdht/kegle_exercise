import { useCallback, useMemo } from 'react'
import useCloudSync from './useCloudSync'
import {
  STORAGE_KEYS,
  DEFAULT_STREAK,
  ACHIEVEMENT_DEFS,
} from '../utils/storageHelpers'
import { toDateKey, addDays } from '../utils/dateHelpers'

// Manages the "2 sessions per day" streak system, workout history, and achievements.
// Each piece of state syncs to Supabase (when signed in) via useCloudSync, so
// progress recorded on one device shows up on the other.
export default function useStreak() {
  const [history, setHistory] = useCloudSync(STORAGE_KEYS.HISTORY, [])
  const [streak, setStreak] = useCloudSync(STORAGE_KEYS.STREAK, DEFAULT_STREAK)
  const [settings] = useCloudSync(STORAGE_KEYS.SETTINGS, { dailyGoal: 2 })
  const [unlocked, setUnlocked] = useCloudSync(STORAGE_KEYS.ACHIEVEMENTS, [])

  const dailyGoal = settings.dailyGoal || 2

  const todayKey = toDateKey()
  const todaysSessionCount = streak.daily?.[todayKey] || 0

  // Recomputes current + longest streak by walking backward day by day
  // from today through the daily completion map.
  const recomputeStreak = useCallback((dailyMap) => {
    let current = 0
    let cursor = new Date()
    // If today isn't complete yet, streak counts up to yesterday but still displays
    // today's partial progress separately via todaysSessionCount.
    if ((dailyMap[toDateKey(cursor)] || 0) < dailyGoal) {
      cursor = addDays(cursor, -1)
    }
    while ((dailyMap[toDateKey(cursor)] || 0) >= dailyGoal) {
      current += 1
      cursor = addDays(cursor, -1)
    }

    // Longest streak: scan all recorded days for the best run.
    const allKeys = Object.keys(dailyMap).sort()
    let longest = 0
    let running = 0
    let prevKey = null
    for (const key of allKeys) {
      if ((dailyMap[key] || 0) >= dailyGoal) {
        if (prevKey && toDateKey(addDays(new Date(prevKey + 'T00:00:00'), 1)) === key) {
          running += 1
        } else {
          running = 1
        }
        longest = Math.max(longest, running)
        prevKey = key
      } else {
        running = 0
        prevKey = null
      }
    }
    longest = Math.max(longest, current)
    return { current, longest }
  }, [dailyGoal])

  const recordSession = useCallback((session) => {
    const entry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      date: new Date().toISOString(),
      type: session.type, // 'kegel' | 'quickflicks'
      duration: session.duration, // seconds
      holdTime: session.holdTime ?? null,
      restTime: session.restTime ?? null,
      completedCycles: session.completedCycles ?? null,
      flickCount: session.flickCount ?? null,
      notes: session.notes || '',
    }

    let newHistory
    setHistory((prev) => {
      newHistory = [entry, ...prev]
      return newHistory
    })

    const newlyUnlocked = []
    let newStreakValue = streak

    setStreak((prev) => {
      const dailyMap = { ...prev.daily }
      const key = toDateKey()
      dailyMap[key] = (dailyMap[key] || 0) + 1
      const { current, longest } = recomputeStreak(dailyMap)
      newStreakValue = {
        current,
        longest: Math.max(longest, prev.longest || 0),
        lastCompletedDate: dailyMap[key] >= dailyGoal ? key : prev.lastCompletedDate,
        daily: dailyMap,
      }
      return newStreakValue
    })

    // Achievement checks use the freshly computed history/streak values.
    setUnlocked((prevUnlocked) => {
      const totalSessions = (newHistory || history).length
      const checks = [
        { id: 'first_workout', met: totalSessions >= 1 },
        { id: 'sessions_100', met: totalSessions >= 100 },
        { id: 'sessions_500', met: totalSessions >= 500 },
        { id: 'sessions_1000', met: totalSessions >= 1000 },
        { id: 'streak_7', met: (newStreakValue.current || 0) >= 7 },
        { id: 'streak_30', met: (newStreakValue.current || 0) >= 30 },
      ]
      const next = [...prevUnlocked]
      checks.forEach(({ id, met }) => {
        if (met && !next.includes(id)) {
          next.push(id)
          newlyUnlocked.push(ACHIEVEMENT_DEFS.find((a) => a.id === id))
        }
      })
      return next
    })

    return { newlyUnlocked }
  }, [setHistory, setStreak, setUnlocked, recomputeStreak, dailyGoal, streak, history])

  const deleteEntry = useCallback((id) => {
    setHistory((prev) => prev.filter((e) => e.id !== id))
  }, [setHistory])

  const clearAll = useCallback(() => {
    setHistory([])
    setStreak(DEFAULT_STREAK)
    setUnlocked([])
  }, [setHistory, setStreak, setUnlocked])

  const stats = useMemo(() => {
    const totalSessions = history.length
    const totalMinutes = Math.round(history.reduce((sum, h) => sum + (h.duration || 0), 0) / 60)
    const todaysWorkouts = history.filter((h) => toDateKey(h.date) === todayKey).length
    return { totalSessions, totalMinutes, todaysWorkouts }
  }, [history, todayKey])

  return {
    history,
    streak,
    dailyGoal,
    todaysSessionCount,
    unlockedAchievements: unlocked,
    stats,
    recordSession,
    deleteEntry,
    clearAll,
  }
}
