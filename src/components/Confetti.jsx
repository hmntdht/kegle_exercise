import React, { useMemo } from 'react'
import { motion } from 'framer-motion'

const COLORS = ['#4FA87C', '#4E8FD1', '#D9A94E', '#7C6A9C', '#E4DCEE']

// Lightweight CSS/SVG confetti burst — no external libraries needed.
export default function Confetti({ count = 60 }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.4,
        duration: 2 + Math.random() * 1.5,
        color: COLORS[i % COLORS.length],
        rotate: Math.random() * 360,
        size: 6 + Math.random() * 6,
        drift: (Math.random() - 0.5) * 120,
      })),
    [count]
  )

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-30">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          initial={{ y: '-10%', x: `${p.x}%`, opacity: 1, rotate: 0 }}
          animate={{ y: '110%', x: `calc(${p.x}% + ${p.drift}px)`, opacity: 0, rotate: p.rotate }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'easeIn' }}
          style={{
            position: 'absolute',
            width: p.size,
            height: p.size * 0.4,
            background: p.color,
            borderRadius: 2,
          }}
        />
      ))}
    </div>
  )
}
