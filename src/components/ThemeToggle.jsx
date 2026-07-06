import React from 'react'
import { FiSun, FiMoon, FiMonitor } from 'react-icons/fi'
import { useSettings } from '../context/SettingsContext'

const OPTIONS = [
  { id: 'light', icon: FiSun, label: 'Light' },
  { id: 'dark', icon: FiMoon, label: 'Dark' },
  { id: 'system', icon: FiMonitor, label: 'System' },
]

export default function ThemeToggle({ compact = false }) {
  const { settings, updateSetting } = useSettings()

  return (
    <div className={`inline-flex rounded-full p-1 bg-plum-50 dark:bg-white/5 gap-1`}>
      {OPTIONS.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          onClick={() => updateSetting('theme', id)}
          aria-label={`${label} theme`}
          aria-pressed={settings.theme === id}
          className={`focus-ring flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
            settings.theme === id
              ? 'bg-white dark:bg-plum-700 text-plum-600 dark:text-ivory-100 shadow-sm'
              : 'text-muted hover:text-ink dark:hover:text-ivory-100'
          }`}
        >
          <Icon size={14} />
          {!compact && label}
        </button>
      ))}
    </div>
  )
}
