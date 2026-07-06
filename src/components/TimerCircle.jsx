import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const PHASE_COLORS = {
  ready: { stroke: '#B6A2CF', soft: 'rgba(182,162,207,0.25)' },
  contract: { stroke: '#4FA87C', soft: 'rgba(79,168,124,0.25)' },
  relax: { stroke: '#4E8FD1', soft: 'rgba(78,143,209,0.25)' },
  finished: { stroke: '#D9A94E', soft: 'rgba(217,169,78,0.3)' },
  idle: { stroke: '#B6A2CF', soft: 'rgba(182,162,207,0.2)' },
}

const PHASE_LABELS = {
  ready: 'GET READY',
  contract: 'CONTRACT',
  relax: 'RELAX',
  finished: 'FINISHED',
  idle: 'READY',
}

// The signature visual element: a breathing progress ring whose color and
// glow shift with the current phase (contract / relax / finished).
export default function TimerCircle({ phase = 'idle', secondsLeft = 0, progress = 1, size = 280 }) {
  const colors = PHASE_COLORS[phase] || PHASE_COLORS.idle
  const radius = size / 2 - 16
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference * (1 - Math.min(1, Math.max(0, progress)))

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <motion.div
        className="absolute inset-0 rounded-full animate-breathe"
        style={{ boxShadow: `0 0 60px 10px ${colors.soft}` }}
      />
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          className="text-plum-100 dark:text-white/5"
          strokeWidth={12}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colors.stroke}
          strokeWidth={12}
          strokeLinecap="round"
          strokeDasharray={circumference}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: 0.4, ease: 'linear' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.span
            key={phase}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="text-xs font-bold tracking-[0.2em] text-muted mb-1"
          >
            {PHASE_LABELS[phase]}
          </motion.span>
        </AnimatePresence>
        <AnimatePresence mode="wait">
          <motion.span
            key={secondsLeft}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.2 }}
            className="font-display text-6xl md:text-7xl font-semibold text-ink dark:text-ivory-100 tabular-nums"
          >
            {phase === 'finished' ? '✓' : secondsLeft}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  )
}
