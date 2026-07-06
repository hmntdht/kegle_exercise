import React, { createContext, useContext, useEffect } from 'react'
import useCloudSync from '../hooks/useCloudSync'
import { STORAGE_KEYS, DEFAULT_SETTINGS, DEFAULT_REMINDERS } from '../utils/storageHelpers'

const SettingsContext = createContext(null)

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useCloudSync(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS)
  const [reminders, setReminders] = useCloudSync(STORAGE_KEYS.REMINDERS, DEFAULT_REMINDERS)

  useEffect(() => {
    const root = document.documentElement
    const apply = () => {
      const wantsDark =
        settings.theme === 'dark' ||
        (settings.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
      root.classList.toggle('dark', wantsDark)
    }
    apply()
    if (settings.theme === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)')
      mq.addEventListener('change', apply)
      return () => mq.removeEventListener('change', apply)
    }
  }, [settings.theme])

  const updateSetting = (key, value) => setSettings((prev) => ({ ...prev, [key]: value }))

  const resetAll = () => {
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k))
    window.location.reload()
  }

  return (
    <SettingsContext.Provider
      value={{ settings, updateSetting, setSettings, reminders, setReminders, resetAll }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider')
  return ctx
}
