import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  FiHome,
  FiActivity,
  FiZap,
  FiClock,
  FiBarChart2,
  FiSettings,
} from 'react-icons/fi'

const LINKS = [
  { to: '/', label: 'Dashboard', icon: FiHome, end: true },
  { to: '/workout', label: 'Workout', icon: FiActivity },
  { to: '/quick-flicks', label: 'Quick Flicks', icon: FiZap },
  { to: '/history', label: 'History', icon: FiClock },
  { to: '/statistics', label: 'Statistics', icon: FiBarChart2 },
  { to: '/settings', label: 'Settings', icon: FiSettings },
]

export default function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-60 shrink-0 h-screen sticky top-0 px-4 py-6 border-r border-plum-100/60 dark:border-white/5">
      <div className="flex items-center gap-2 px-2 mb-8">
        <div className="w-9 h-9 rounded-xl bg-plum-500 flex items-center justify-center text-white font-display font-bold text-lg">
          K
        </div>
        <span className="font-display text-lg font-semibold text-ink dark:text-ivory-100">
          Kegel Trainer
        </span>
      </div>
      <nav className="flex flex-col gap-1">
        {LINKS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `focus-ring flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-plum-500 text-white shadow-md shadow-plum-500/20'
                  : 'text-muted hover:bg-plum-50 dark:hover:bg-white/5 hover:text-ink dark:hover:text-ivory-100'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto px-3 text-xs text-muted/70">
        Private &amp; on-device. Your data never leaves this browser.
      </div>
    </aside>
  )
}
