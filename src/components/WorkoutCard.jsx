import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

export default function WorkoutCard({ title, subtitle, icon: Icon, gradient, to, state, delay = 0 }) {
  const navigate = useNavigate()
  return (
    <motion.button
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(to, { state })}
      className={`focus-ring text-left rounded-3xl p-6 flex flex-col gap-3 text-white shadow-lg ${gradient}`}
    >
      <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center">
        <Icon size={22} />
      </div>
      <div>
        <h3 className="font-display text-xl font-semibold">{title}</h3>
        <p className="text-sm text-white/80 mt-0.5">{subtitle}</p>
      </div>
    </motion.button>
  )
}
