import React from 'react'
import { motion } from 'framer-motion'
import HistoryTable from '../components/HistoryTable'
import useStreak from '../hooks/useStreak'

export default function History() {
  const { history, deleteEntry } = useStreak()

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-8 py-6 md:py-10 pb-24 md:pb-10 space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="font-display text-3xl font-semibold text-ink dark:text-ivory-100">History</h1>
        <p className="text-muted mt-1">{history.length} session{history.length !== 1 ? 's' : ''} recorded</p>
      </motion.div>
      <HistoryTable entries={history} onDelete={deleteEntry} />
    </div>
  )
}
