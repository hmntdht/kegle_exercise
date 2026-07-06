import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiPlay,
  FiPause,
  FiRotateCcw,
  FiSquare,
  FiSkipForward,
  FiVolume2,
  FiVolumeX,
  FiMic,
  FiMicOff,
  FiCheckCircle,
} from 'react-icons/fi'
import TimerCircle from '../components/TimerCircle'
import Countdown from '../components/Countdown'
import Confetti from '../components/Confetti'
import Button from '../components/Button'
import ProgressBar from '../components/ProgressBar'
import useWorkoutTimer from '../hooks/useWorkoutTimer'
import useStreak from '../hooks/useStreak'
import { useSettings } from '../context/SettingsContext'
import { SOUND_CUES, speak } from '../utils/audioCues'
import { formatTime } from '../utils/dateHelpers'

const HOLD_PRESETS = [5, 8, 10, 15, 20]
const REST_PRESETS = [2, 3, 5, 8, 10]
const DURATION_PRESETS = [3, 5, 10, 15, 20, 30]

export default function Workout() {
  const { settings, updateSetting } = useSettings()
  const { recordSession } = useStreak()

  const [holdTime, setHoldTime] = useState(10)
  const [restTime, setRestTime] = useState(2)
  const [durationMinutes, setDurationMinutes] = useState(5)
  const [customMinutes, setCustomMinutes] = useState('')
  const [stage, setStage] = useState('setup') // 'setup' | 'session' | 'complete'
  const [result, setResult] = useState(null)
  const [unlockedThisSession, setUnlockedThisSession] = useState([])

  const totalDuration = durationMinutes * 60
  const lastSpokenPhase = useRef(null)

  const handleComplete = useCallback(
    ({ completedCycles, totalSeconds }) => {
      const { newlyUnlocked } = recordSession({
        type: 'kegel',
        duration: totalSeconds,
        holdTime,
        restTime,
        completedCycles,
      })
      setUnlockedThisSession(newlyUnlocked)
      setResult({ completedCycles, totalSeconds, completedAt: new Date() })
      if (settings.soundEnabled) SOUND_CUES.complete()
      if (settings.voiceEnabled) speak('Workout complete')
      setStage('complete')
    },
    [recordSession, holdTime, restTime, settings.soundEnabled, settings.voiceEnabled]
  )

  const timer = useWorkoutTimer({ holdTime, restTime, totalDuration, onComplete: handleComplete })

  // Sound + voice cues on phase transitions.
  useEffect(() => {
    if (timer.phase === lastSpokenPhase.current) return
    lastSpokenPhase.current = timer.phase
    if (timer.phase === 'contract') {
      if (settings.soundEnabled) SOUND_CUES.contract()
      if (settings.voiceEnabled) speak('Contract')
    } else if (timer.phase === 'relax') {
      if (settings.soundEnabled) SOUND_CUES.relax()
      if (settings.voiceEnabled) speak('Relax')
    } else if (timer.phase === 'ready') {
      if (settings.soundEnabled) SOUND_CUES.start()
    }
  }, [timer.phase, settings.soundEnabled, settings.voiceEnabled])

  // Keyboard shortcuts: Space = pause/resume, R = restart, Esc = stop.
  useEffect(() => {
    if (stage !== 'session') return
    const handler = (e) => {
      if (e.code === 'Space') {
        e.preventDefault()
        timer.isPaused ? timer.resume() : timer.pause()
      } else if (e.key.toLowerCase() === 'r') {
        timer.restart()
      } else if (e.key === 'Escape') {
        timer.stop()
        setStage('setup')
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [stage, timer])

  const startSession = () => {
    lastSpokenPhase.current = null
    setResult(null)
    setUnlockedThisSession([])
    setStage('session')
    timer.start()
  }

  const stopSession = () => {
    timer.stop()
    setStage('setup')
  }

  const elapsedPct = totalDuration ? (timer.elapsedSeconds / totalDuration) * 100 : 0

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-8 py-6 md:py-10 pb-24 md:pb-10">
      <AnimatePresence mode="wait">
        {stage === 'setup' && (
          <motion.div
            key="setup"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div>
              <h1 className="font-display text-3xl font-semibold text-ink dark:text-ivory-100">Kegel Workout</h1>
              <p className="text-muted mt-1">Set your hold, rest, and total duration.</p>
            </div>

            <SettingGroup label="Hold time" value={holdTime} unit="sec" presets={HOLD_PRESETS} onChange={setHoldTime} />
            <SettingGroup label="Rest time" value={restTime} unit="sec" presets={REST_PRESETS} onChange={setRestTime} />

            <div className="glass rounded-3xl p-5">
              <p className="text-sm font-semibold text-ink dark:text-ivory-100 mb-3">Workout duration</p>
              <div className="flex flex-wrap gap-2">
                {DURATION_PRESETS.map((m) => (
                  <button
                    key={m}
                    onClick={() => { setDurationMinutes(m); setCustomMinutes('') }}
                    className={`focus-ring px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                      durationMinutes === m && !customMinutes
                        ? 'bg-plum-500 text-white'
                        : 'bg-plum-50 dark:bg-white/5 text-ink dark:text-ivory-100 hover:bg-plum-100 dark:hover:bg-white/10'
                    }`}
                  >
                    {m} min
                  </button>
                ))}
                <input
                  type="number"
                  min={1}
                  placeholder="Custom"
                  value={customMinutes}
                  onChange={(e) => {
                    setCustomMinutes(e.target.value)
                    const val = parseInt(e.target.value, 10)
                    if (val > 0) setDurationMinutes(val)
                  }}
                  className="focus-ring w-24 px-4 py-2 rounded-xl text-sm font-semibold bg-plum-50 dark:bg-white/5 text-ink dark:text-ivory-100 placeholder:text-muted"
                />
              </div>
            </div>

            <div className="glass rounded-3xl p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateSetting('soundEnabled', !settings.soundEnabled)}
                  className="focus-ring p-2 rounded-xl text-muted hover:text-ink dark:hover:text-ivory-100"
                  aria-label="Toggle sound"
                >
                  {settings.soundEnabled ? <FiVolume2 size={18} /> : <FiVolumeX size={18} />}
                </button>
                <button
                  onClick={() => updateSetting('voiceEnabled', !settings.voiceEnabled)}
                  className="focus-ring p-2 rounded-xl text-muted hover:text-ink dark:hover:text-ivory-100"
                  aria-label="Toggle voice"
                >
                  {settings.voiceEnabled ? <FiMic size={18} /> : <FiMicOff size={18} />}
                </button>
              </div>
              <Button size="lg" icon={FiPlay} onClick={startSession}>
                Start Workout
              </Button>
            </div>
          </motion.div>
        )}

        {stage === 'session' && (
          <motion.div
            key="session"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative space-y-6"
          >
            {timer.phase === 'ready' && <Countdown value={timer.secondsLeftInPhase || 'GO'} />}

            <div className="flex justify-center py-4">
              <TimerCircle phase={timer.phase} secondsLeft={timer.secondsLeftInPhase} progress={timer.progress} />
            </div>

            <ProgressBar value={elapsedPct} colorClass="bg-plum-500" label="Workout progress" />

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatBlock label="Elapsed" value={formatTime(timer.elapsedSeconds)} />
              <StatBlock label="Remaining" value={formatTime(timer.remainingSeconds)} />
              <StatBlock label="Cycle" value={timer.completedCycles + 1} />
              <StatBlock label="Completed" value={timer.completedCycles} />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Button variant="ghost" icon={timer.isPaused ? FiPlay : FiPause} onClick={() => (timer.isPaused ? timer.resume() : timer.pause())}>
                {timer.isPaused ? 'Resume' : 'Pause'}
              </Button>
              <Button variant="ghost" icon={FiRotateCcw} onClick={timer.restart}>Restart</Button>
              <Button variant="ghost" icon={FiSkipForward} onClick={timer.skipPhase}>
                Skip {timer.phase === 'relax' ? 'Rest' : 'Hold'}
              </Button>
              <Button variant="danger" icon={FiSquare} onClick={stopSession}>Stop</Button>
            </div>
            <p className="text-center text-xs text-muted">Space = pause · R = restart · Esc = stop</p>
          </motion.div>
        )}

        {stage === 'complete' && result && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative glass rounded-3xl p-8 text-center space-y-6 overflow-hidden"
          >
            <Confetti />
            <FiCheckCircle className="mx-auto text-gold" size={56} />
            <div>
              <h2 className="font-display text-3xl font-semibold text-ink dark:text-ivory-100">Workout Complete!</h2>
              <p className="text-muted mt-1">Great consistency — your future self says thanks.</p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <StatBlock label="Contractions" value={result.completedCycles} />
              <StatBlock label="Seconds exercised" value={result.totalSeconds} />
              <StatBlock label="Finished at" value={result.completedAt.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })} />
            </div>
            {unlockedThisSession.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2">
                {unlockedThisSession.map((a) => (
                  <span key={a.id} className="px-3 py-1.5 rounded-full bg-gold-soft text-gold text-xs font-semibold">
                    🏆 {a.label} unlocked
                  </span>
                ))}
              </div>
            )}
            <div className="flex justify-center gap-3">
              <Button variant="ghost" onClick={() => setStage('setup')}>Back to setup</Button>
              <Button onClick={startSession}>Go again</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function SettingGroup({ label, value, unit, presets, onChange }) {
  return (
    <div className="glass rounded-3xl p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold text-ink dark:text-ivory-100">{label}</p>
        <span className="font-mono text-sm text-plum-500 font-semibold">{value}{unit}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {presets.map((p) => (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`focus-ring px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
              value === p
                ? 'bg-plum-500 text-white'
                : 'bg-plum-50 dark:bg-white/5 text-ink dark:text-ivory-100 hover:bg-plum-100 dark:hover:bg-white/10'
            }`}
          >
            {p}{unit}
          </button>
        ))}
      </div>
    </div>
  )
}

function StatBlock({ label, value }) {
  return (
    <div className="rounded-2xl bg-plum-50 dark:bg-white/5 p-4">
      <p className="text-[11px] font-semibold text-muted uppercase tracking-wide mb-1">{label}</p>
      <p className="font-display text-xl font-semibold text-ink dark:text-ivory-100 tabular-nums">{value}</p>
    </div>
  )
}
