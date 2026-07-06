import React from 'react'
import { motion } from 'framer-motion'

const VARIANTS = {
  primary: 'bg-plum-500 text-white hover:bg-plum-600 shadow-md shadow-plum-500/20',
  ghost: 'bg-white/50 dark:bg-white/5 text-ink dark:text-ivory-100 hover:bg-white/80 dark:hover:bg-white/10 border border-plum-100 dark:border-white/10',
  subtle: 'bg-plum-50 dark:bg-plum-900/60 text-plum-700 dark:text-plum-100 hover:bg-plum-100 dark:hover:bg-plum-900',
  danger: 'bg-white dark:bg-plum-900 text-red-500 border border-red-200 dark:border-red-500/30 hover:bg-red-50 dark:hover:bg-red-500/10',
}

const SIZES = {
  sm: 'px-3 py-1.5 text-sm rounded-xl',
  md: 'px-5 py-2.5 text-sm rounded-2xl',
  lg: 'px-8 py-4 text-base rounded-2xl',
  icon: 'p-3 rounded-full',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  className = '',
  ...props
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      whileHover={{ scale: 1.02 }}
      className={`focus-ring inline-flex items-center justify-center gap-2 font-semibold transition-colors duration-200 disabled:opacity-40 disabled:pointer-events-none ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {Icon && <Icon className="shrink-0" size={size === 'lg' ? 20 : 16} />}
      {children}
    </motion.button>
  )
}
