import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiTrash2, FiActivity, FiZap } from 'react-icons/fi'
import { formatDateLabel, formatClock, toDateKey, formatTime } from '../utils/dateHelpers'

export default function HistoryTable({ entries = [], onDelete }) {
  if (!entries.length) {
    return (
      <div className="glass rounded-3xl p-10 text-center text-muted">
        <p className="font-display text-lg text-ink dark:text-ivory-100 mb-1">No sessions yet</p>
        <p className="text-sm">Complete a workout and it will show up here.</p>
      </div>
    )
  }

  return (
    <div className="glass rounded-3xl overflow-hidden">
      <AnimatePresence initial={false}>
        {entries.map((e) => (
          <motion.div
            key={e.id}
            layout
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-4 px-5 py-4 border-b border-plum-100/60 dark:border-white/5 last:border-0"
          >
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                e.type === 'quickflicks' ? 'bg-gold-soft text-gold' : 'bg-contract-soft text-contract'
              }`}
            >
              {e.type === 'quickflicks' ? <FiZap size={18} /> : <FiActivity size={18} />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-ink dark:text-ivory-100">
                  {e.type === 'quickflicks' ? 'Quick Flicks' : 'Kegel Workout'}
                </span>
                <span className="text-xs text-muted">
                  {formatDateLabel(toDateKey(e.date))} · {formatClock(e.date)}
                </span>
              </div>
              <div className="text-xs text-muted mt-1 flex flex-wrap gap-x-3 gap-y-0.5 font-mono">
                <span>Duration {formatTime(e.duration)}</span>
                {e.holdTime != null && <span>Hold {e.holdTime}s</span>}
                {e.restTime != null && <span>Rest {e.restTime}s</span>}
                {e.completedCycles != null && <span>{e.completedCycles} cycles</span>}
                {e.flickCount != null && <span>{e.flickCount} flicks</span>}
              </div>
              {e.notes && <p className="text-xs text-muted mt-1 italic">{e.notes}</p>}
            </div>
            <button
              onClick={() => onDelete(e.id)}
              aria-label="Delete entry"
              className="focus-ring p-2 rounded-xl text-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
            >
              <FiTrash2 size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
