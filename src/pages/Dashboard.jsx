import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { FiActivity, FiZap, FiTrendingUp, FiAward, FiClock, FiCalendar } from 'react-icons/fi'
import StatsCard from '../components/StatsCard'
import WorkoutCard from '../components/WorkoutCard'
import CalendarHeatmap from '../components/CalendarHeatmap'
import useStreak from '../hooks/useStreak'
import { MOTIVATIONAL_QUOTES, ACHIEVEMENT_DEFS } from '../utils/storageHelpers'

export default function Dashboard() {
  const { streak, dailyGoal, todaysSessionCount, stats, unlockedAchievements } = useStreak()

  const quote = useMemo(
    () => MOTIVATIONAL_QUOTES[new Date().getDate() % MOTIVATIONAL_QUOTES.length],
    []
  )

  const goalPct = Math.min(100, Math.round((todaysSessionCount / dailyGoal) * 100))

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-6 md:py-10 pb-24 md:pb-10 space-y-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-1">
        <h1 className="font-display text-3xl md:text-4xl font-semibold text-ink dark:text-ivory-100">
          Welcome back
        </h1>
        <p className="text-muted">{quote}</p>
      </motion.div>

      {/* Daily goal ring */}
      <div className="glass rounded-3xl p-6 flex items-center gap-5">
        <div className="relative w-16 h-16 shrink-0">
          <svg viewBox="0 0 36 36" className="w-16 h-16 -rotate-90">
            <circle cx="18" cy="18" r="15.5" fill="none" stroke="currentColor" strokeWidth="3" className="text-plum-50 dark:text-white/5" />
            <circle
              cx="18" cy="18" r="15.5" fill="none" stroke="#7C6A9C" strokeWidth="3" strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 15.5}
              strokeDashoffset={2 * Math.PI * 15.5 * (1 - goalPct / 100)}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center font-mono text-xs font-semibold text-ink dark:text-ivory-100">
            {todaysSessionCount}/{dailyGoal}
          </div>
        </div>
        <div>
          <p className="font-semibold text-ink dark:text-ivory-100">Today's goal</p>
          <p className="text-sm text-muted">
            {todaysSessionCount >= dailyGoal
              ? "Goal complete — nice work today."
              : `${dailyGoal - todaysSessionCount} more session${dailyGoal - todaysSessionCount > 1 ? 's' : ''} to keep your streak.`}
          </p>
        </div>
      </div>

      {/* Quick start */}
      <div>
        <h2 className="text-sm font-semibold text-muted uppercase tracking-wide mb-3">Quick start</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <WorkoutCard
            title="Kegel Workout"
            subtitle="Hold, relax, repeat"
            icon={FiActivity}
            gradient="bg-gradient-to-br from-plum-500 to-plum-700"
            to="/workout"
          />
          <WorkoutCard
            title="Quick Flicks"
            subtitle="Fast rhythmic contractions"
            icon={FiZap}
            gradient="bg-gradient-to-br from-gold to-plum-500"
            to="/quick-flicks"
            delay={0.05}
          />
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard label="Today" value={stats.todaysWorkouts} unit="sessions" icon={FiCalendar} delay={0} />
        <StatsCard label="Current streak" value={streak.current} unit="days" icon={FiTrendingUp} accent="text-contract" delay={0.05} />
        <StatsCard label="Longest streak" value={streak.longest} unit="days" icon={FiAward} accent="text-gold" delay={0.1} />
        <StatsCard label="Total sessions" value={stats.totalSessions} icon={FiClock} accent="text-relax" delay={0.15} />
      </div>

      {/* Heatmap */}
      <div className="glass rounded-3xl p-6">
        <h2 className="text-sm font-semibold text-muted uppercase tracking-wide mb-4">Consistency</h2>
        <CalendarHeatmap daily={streak.daily} dailyGoal={dailyGoal} />
      </div>

      {/* Achievements preview */}
      {unlockedAchievements.length > 0 && (
        <div className="glass rounded-3xl p-6">
          <h2 className="text-sm font-semibold text-muted uppercase tracking-wide mb-4">Achievements</h2>
          <div className="flex flex-wrap gap-3">
            {ACHIEVEMENT_DEFS.map((a) => {
              const isUnlocked = unlockedAchievements.includes(a.id)
              return (
                <div
                  key={a.id}
                  className={`px-3 py-2 rounded-2xl text-xs font-semibold flex items-center gap-2 ${
                    isUnlocked
                      ? 'bg-gold-soft text-gold'
                      : 'bg-plum-50 dark:bg-white/5 text-muted/50'
                  }`}
                >
                  <FiAward size={14} />
                  {a.label}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
