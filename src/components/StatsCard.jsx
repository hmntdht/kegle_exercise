import React from 'react'
import { motion } from 'framer-motion'

export default function StatsCard({ label, value, unit, icon: Icon, accent = 'text-plum-500', delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="glass rounded-3xl p-5 flex flex-col gap-2"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-muted uppercase tracking-wide">{label}</span>
        {Icon && <Icon className={accent} size={18} />}
      </div>
      <div className="flex items-baseline gap-1">
        <span className="font-display text-3xl font-semibold text-ink dark:text-ivory-100 tabular-nums">
          {value}
        </span>
        {unit && <span className="text-sm text-muted">{unit}</span>}
      </div>
    </motion.div>
  )
}
