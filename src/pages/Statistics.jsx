import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
} from 'recharts'
import StatsCard from '../components/StatsCard'
import useStreak from '../hooks/useStreak'
import { lastNDateKeys, toDateKey, weekLabel, formatTime } from '../utils/dateHelpers'
import { FiTrendingUp, FiAward, FiClock, FiActivity } from 'react-icons/fi'

export default function Statistics() {
  const { history, streak } = useStreak()

  const weekly = useMemo(() => {
    const keys = lastNDateKeys(7)
    return keys.map((key) => ({
      day: weekLabel(key),
      sessions: history.filter((h) => toDateKey(h.date) === key).length,
    }))
  }, [history])

  const monthly = useMemo(() => {
    const keys = lastNDateKeys(30)
    // Bucket into 6 groups of 5 days for readability.
    const buckets = []
    for (let i = 0; i < keys.length; i += 5) {
      const slice = keys.slice(i, i + 5)
      const sessions = history.filter((h) => slice.includes(toDateKey(h.date))).length
      buckets.push({ label: `${slice[0].slice(5)}`, sessions })
    }
    return buckets
  }, [history])

  const minutesTrend = useMemo(() => {
    const keys = lastNDateKeys(14)
    return keys.map((key) => ({
      day: key.slice(5),
      minutes: Math.round(history.filter((h) => toDateKey(h.date) === key).reduce((s, h) => s + h.duration, 0) / 60),
    }))
  }, [history])

  const avgDuration = useMemo(() => {
    if (!history.length) return 0
    return Math.round(history.reduce((s, h) => s + (h.duration || 0), 0) / history.length)
  }, [history])

  const avgHold = useMemo(() => {
    const withHold = history.filter((h) => h.holdTime != null)
    if (!withHold.length) return 0
    return Math.round(withHold.reduce((s, h) => s + h.holdTime, 0) / withHold.length)
  }, [history])

  const totalMinutes = Math.round(history.reduce((s, h) => s + (h.duration || 0), 0) / 60)

  const axisColor = '#8A8296'

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-6 md:py-10 pb-24 md:pb-10 space-y-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="font-display text-3xl font-semibold text-ink dark:text-ivory-100">Statistics</h1>
        <p className="text-muted mt-1">Your consistency, visualized.</p>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard label="Current streak" value={streak.current} unit="days" icon={FiTrendingUp} accent="text-contract" />
        <StatsCard label="Longest streak" value={streak.longest} unit="days" icon={FiAward} accent="text-gold" delay={0.05} />
        <StatsCard label="Avg duration" value={formatTime(avgDuration)} icon={FiClock} accent="text-relax" delay={0.1} />
        <StatsCard label="Avg hold time" value={avgHold} unit="sec" icon={FiActivity} delay={0.15} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass rounded-3xl p-6">
          <h2 className="text-sm font-semibold text-muted uppercase tracking-wide mb-4">Weekly workouts</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weekly}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E4DCEE" vertical={false} />
              <XAxis dataKey="day" stroke={axisColor} fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke={axisColor} fontSize={12} allowDecimals={false} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', fontSize: 12 }} />
              <Bar dataKey="sessions" fill="#7C6A9C" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass rounded-3xl p-6">
          <h2 className="text-sm font-semibold text-muted uppercase tracking-wide mb-4">Monthly workouts (5-day buckets)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E4DCEE" vertical={false} />
              <XAxis dataKey="label" stroke={axisColor} fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke={axisColor} fontSize={12} allowDecimals={false} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', fontSize: 12 }} />
              <Bar dataKey="sessions" fill="#4E8FD1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass rounded-3xl p-6 md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-muted uppercase tracking-wide">Minutes exercised (last 14 days)</h2>
            <span className="font-mono text-sm text-muted">{totalMinutes} min total</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={minutesTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E4DCEE" vertical={false} />
              <XAxis dataKey="day" stroke={axisColor} fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke={axisColor} fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', fontSize: 12 }} />
              <Line type="monotone" dataKey="minutes" stroke="#4FA87C" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
