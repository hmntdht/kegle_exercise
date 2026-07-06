import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  FiVolume2,
  FiMic,
  FiZap,
  FiBell,
  FiTrash2,
  FiPlus,
  FiX,
  FiCloud,
  FiLogOut,
} from 'react-icons/fi'
import ThemeToggle from '../components/ThemeToggle'
import Button from '../components/Button'
import { useSettings } from '../context/SettingsContext'
import { useAuth } from '../context/AuthContext'
import { requestNotificationPermission, nextReminderTime } from '../utils/notifications'

function Toggle({ checked, onChange, label }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`focus-ring w-12 h-7 rounded-full flex items-center px-1 transition-colors ${
        checked ? 'bg-plum-500 justify-end' : 'bg-plum-100 dark:bg-white/10 justify-start'
      }`}
    >
      <motion.span layout className="w-5 h-5 rounded-full bg-white shadow" />
    </button>
  )
}

function Row({ icon: Icon, title, description, children }) {
  return (
    <div className="flex items-center justify-between gap-4 py-4 border-b border-plum-100/60 dark:border-white/5 last:border-0">
      <div className="flex items-center gap-3 min-w-0">
        {Icon && (
          <div className="w-9 h-9 rounded-xl bg-plum-50 dark:bg-white/5 flex items-center justify-center text-plum-500 shrink-0">
            <Icon size={16} />
          </div>
        )}
        <div className="min-w-0">
          <p className="font-semibold text-ink dark:text-ivory-100 text-sm">{title}</p>
          {description && <p className="text-xs text-muted mt-0.5">{description}</p>}
        </div>
      </div>
      {children}
    </div>
  )
}

export default function Settings() {
  const { settings, updateSetting, reminders, setReminders, resetAll } = useSettings()
  const { user, loading: authLoading, signInWithGoogle, signOut, isSupabaseConfigured } = useAuth()
  const [confirmingReset, setConfirmingReset] = useState(false)
  const [newTime, setNewTime] = useState('')
  const [nextReminder, setNextReminder] = useState(null)

  useEffect(() => {
    setNextReminder(nextReminderTime(reminders.enabled ? reminders.times : []))
  }, [reminders])

  const toggleReminders = async (enabled) => {
    if (enabled) await requestNotificationPermission()
    setReminders((prev) => ({ ...prev, enabled }))
  }

  const addTime = () => {
    if (!newTime) return
    setReminders((prev) => ({ ...prev, times: [...new Set([...prev.times, newTime])].sort() }))
    setNewTime('')
  }

  const removeTime = (t) => {
    setReminders((prev) => ({ ...prev, times: prev.times.filter((x) => x !== t) }))
  }

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-8 py-6 md:py-10 pb-24 md:pb-10 space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="font-display text-3xl font-semibold text-ink dark:text-ivory-100">Settings</h1>
        <p className="text-muted mt-1">Tune the app to how you like to train.</p>
      </motion.div>

      <section className="glass rounded-3xl p-5">
        <Row
          icon={FiCloud}
          title="Sync across devices"
          description={
            !isSupabaseConfigured
              ? 'Cloud sync isn\u2019t configured for this build yet'
              : authLoading
              ? 'Checking sign-in status…'
              : user
              ? `Signed in as ${user.email}`
              : 'Sign in with Google to sync your history, streaks, and settings'
          }
        >
          {!isSupabaseConfigured ? null : user ? (
            <Button variant="subtle" size="sm" icon={FiLogOut} onClick={signOut}>
              Sign out
            </Button>
          ) : (
            <Button variant="primary" size="sm" onClick={signInWithGoogle} disabled={authLoading}>
              Sign in with Google
            </Button>
          )}
        </Row>
      </section>

      <section className="glass rounded-3xl px-5">
        <Row icon={FiZap} title="Theme" description="Light, dark, or match your system">
          <ThemeToggle />
        </Row>
        <Row icon={FiMic} title="Voice guidance" description="Speaks Contract / Relax / Complete">
          <Toggle checked={settings.voiceEnabled} onChange={(v) => updateSetting('voiceEnabled', v)} label="Voice guidance" />
        </Row>
        <Row icon={FiVolume2} title="Sound cues" description="Beeps on transitions">
          <Toggle checked={settings.soundEnabled} onChange={(v) => updateSetting('soundEnabled', v)} label="Sound cues" />
        </Row>
        <Row icon={FiZap} title="Animations" description="Motion effects across the app">
          <Toggle checked={settings.animationsEnabled} onChange={(v) => updateSetting('animationsEnabled', v)} label="Animations" />
        </Row>
        <Row icon={FiZap} title="Units" description="How durations are displayed">
          <div className="flex gap-1 bg-plum-50 dark:bg-white/5 rounded-full p-1">
            {['seconds', 'minutes'].map((u) => (
              <button
                key={u}
                onClick={() => updateSetting('units', u)}
                className={`focus-ring px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-colors ${
                  settings.units === u ? 'bg-white dark:bg-plum-700 text-plum-600 dark:text-ivory-100 shadow-sm' : 'text-muted'
                }`}
              >
                {u}
              </button>
            ))}
          </div>
        </Row>
        <Row icon={FiZap} title="Daily goal" description="Sessions per day for streak tracking">
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateSetting('dailyGoal', Math.max(1, (settings.dailyGoal || 2) - 1))}
              className="focus-ring w-8 h-8 rounded-lg bg-plum-50 dark:bg-white/5 text-ink dark:text-ivory-100 font-bold"
            >
              −
            </button>
            <span className="w-6 text-center font-mono font-semibold text-ink dark:text-ivory-100">{settings.dailyGoal || 2}</span>
            <button
              onClick={() => updateSetting('dailyGoal', (settings.dailyGoal || 2) + 1)}
              className="focus-ring w-8 h-8 rounded-lg bg-plum-50 dark:bg-white/5 text-ink dark:text-ivory-100 font-bold"
            >
              +
            </button>
          </div>
        </Row>
      </section>

      <section className="glass rounded-3xl p-5 space-y-4">
        <Row icon={FiBell} title="Reminders" description={nextReminder ? `Next: ${nextReminder.toLocaleString([], { weekday: 'short', hour: 'numeric', minute: '2-digit' })}` : 'Off'}>
          <Toggle checked={reminders.enabled} onChange={toggleReminders} label="Reminders" />
        </Row>
        {reminders.enabled && (
          <div className="space-y-3 pt-1">
            <div className="flex flex-wrap gap-2">
              {reminders.times.map((t) => (
                <span key={t} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-plum-50 dark:bg-white/5 text-sm font-mono text-ink dark:text-ivory-100">
                  {t}
                  <button onClick={() => removeTime(t)} aria-label={`Remove ${t}`} className="text-muted hover:text-red-500">
                    <FiX size={13} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="focus-ring px-3 py-2 rounded-xl text-sm bg-plum-50 dark:bg-white/5 text-ink dark:text-ivory-100"
              />
              <Button size="sm" variant="subtle" icon={FiPlus} onClick={addTime}>Add time</Button>
            </div>
          </div>
        )}
      </section>

      <section className="glass rounded-3xl p-5">
        <Row icon={FiTrash2} title="Reset all data" description="Clears history, streaks, and settings — cannot be undone">
          {!confirmingReset ? (
            <Button variant="danger" size="sm" onClick={() => setConfirmingReset(true)}>Reset</Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => setConfirmingReset(false)}>Cancel</Button>
              <Button variant="danger" size="sm" onClick={resetAll}>Confirm</Button>
            </div>
          )}
        </Row>
      </section>
    </div>
  )
}
