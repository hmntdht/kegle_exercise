import React from 'react'
import { motion } from 'framer-motion'

export default function ProgressBar({ value = 0, colorClass = 'bg-plum-500', label, height = 'h-3' }) {
  const pct = Math.min(100, Math.max(0, value))
  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between text-xs text-muted mb-1.5 font-medium">
          <span>{label}</span>
          <span className="font-mono">{Math.round(pct)}%</span>
        </div>
      )}
      <div className={`w-full ${height} rounded-full bg-plum-50 dark:bg-white/5 overflow-hidden`}>
        <motion.div
          className={`${height} rounded-full ${colorClass}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}
