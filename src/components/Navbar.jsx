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
import ThemeToggle from './ThemeToggle'

const LINKS = [
  { to: '/', label: 'Home', icon: FiHome, end: true },
  { to: '/workout', label: 'Workout', icon: FiActivity },
  { to: '/quick-flicks', label: 'Flicks', icon: FiZap },
  { to: '/history', label: 'History', icon: FiClock },
  { to: '/statistics', label: 'Stats', icon: FiBarChart2 },
]

// Top bar (mobile only) + bottom tab bar (mobile only).
export default function Navbar() {
  return (
    <>
      <header className="md:hidden flex items-center justify-between px-4 py-3 sticky top-0 z-20 glass rounded-b-2xl">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-plum-500 flex items-center justify-center text-white font-display font-bold">
            K
          </div>
          <span className="font-display font-semibold text-ink dark:text-ivory-100">Kegel Trainer</span>
        </div>
        <ThemeToggle compact />
      </header>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-20 glass rounded-t-3xl px-2 py-2 flex justify-around">
        {LINKS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `focus-ring flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-[11px] font-medium transition-colors ${
                isActive ? 'text-plum-500' : 'text-muted'
              }`
            }
          >
            <Icon size={19} />
            {label}
          </NavLink>
        ))}
      </nav>
    </>
  )
}
