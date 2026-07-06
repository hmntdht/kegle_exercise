import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Full-bleed "READY... 3 2 1 START" overlay shown before a session begins.
export default function Countdown({ value }) {
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-ivory/90 dark:bg-plum-950/90 backdrop-blur-sm rounded-3xl">
      <AnimatePresence mode="wait">
        <motion.div
          key={value}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.4 }}
          transition={{ duration: 0.35 }}
          className="font-display text-7xl md:text-8xl font-bold text-plum-500 text-center"
        >
          {value}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
