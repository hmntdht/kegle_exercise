import React, { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiPlay, FiPause, FiRotateCcw, FiSquare, FiCheckCircle, FiZap } from 'react-icons/fi'
import Countdown from '../components/Countdown'
import Confetti from '../components/Confetti'
import Button from '../components/Button'
import ProgressBar from '../components/ProgressBar'
import useStreak from '../hooks/useStreak'
import { useSettings } from '../context/SettingsContext'
import { SOUND_CUES, speak } from '../utils/audioCues'

const FLICK_PRESETS = [50, 100, 150, 200]

export default function QuickFlicks() {
  const { settings } = useSettings()
  const { recordSession } = useStreak()

  const [target, setTarget] = useState(100)
  const [customTarget, setCustomTarget] = useState('')
  const [stage, setStage] = useState('setup') // setup | countdown | running | paused | complete
  const [countdownVal, setCountdownVal] = useState(3)
  const [count, setCount] = useState(0)
  const [result, setResult] = useState(null)
  const [unlockedThisSession, setUnlockedThisSession] = useState([])

  const rafRef = useRef(null)
  const nextTickRef = useRef(0)
  const pausedRef = useRef(false)
  const startedAtRef = useRef(0)
  const countRef = useRef(0)

  const finish = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    const duration = Math.round((Date.now() - startedAtRef.current) / 1000)
    const { newlyUnlocked } = recordSession({ type: 'quickflicks', duration, flickCount: countRef.current })
    setUnlockedThisSession(newlyUnlocked)
    if (settings.soundEnabled) SOUND_CUES.complete()
    if (settings.voiceEnabled) speak('Workout complete')
    setResult({ flickCount: countRef.current, duration, completedAt: new Date() })
    setStage('complete')
  }, [recordSession, settings.soundEnabled, settings.voiceEnabled])

  const loop = useCallback(() => {
    if (pausedRef.current) {
      rafRef.current = requestAnimationFrame(loop)
      return
    }
    if (Date.now() >= nextTickRef.current) {
      countRef.current += 1
      setCount(countRef.current)
      if (settings.soundEnabled) SOUND_CUES.tick()
      if (countRef.current >= target) {
        finish()
        return
      }
      nextTickRef.current = Date.now() + 1000
    }
    rafRef.current = requestAnimationFrame(loop)
  }, [target, settings.soundEnabled, finish])

  const runCountdown = useCallback(() => {
    setStage('countdown')
    setCountdownVal(3)
    let n = 3
    const iv = setInterval(() => {
      n -= 1
      if (n <= 0) {
        clearInterval(iv)
        countRef.current = 0
        setCount(0)
        startedAtRef.current = Date.now()
        nextTickRef.current = Date.now() + 1000
        pausedRef.current = false
        setStage('running')
        rafRef.current = requestAnimationFrame(loop)
      } else {
        setCountdownVal(n)
      }
    }, 1000)
  }, [loop])

  useEffect(() => () => cancelAnimationFrame(rafRef.current), [])

  const pause = () => { pausedRef.current = true; setStage('paused') }
  const resume = () => {
    pausedRef.current = false
    nextTickRef.current = Date.now() + 1000
    setStage('running')
  }
  const stop = () => {
    cancelAnimationFrame(rafRef.current)
    setStage('setup')
  }
  const restart = () => {
    cancelAnimationFrame(rafRef.current)
    runCountdown()
  }

  const pct = (count / target) * 100

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-8 py-6 md:py-10 pb-24 md:pb-10">
      <AnimatePresence mode="wait">
        {stage === 'setup' && (
          <motion.div key="setup" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
            <div>
              <h1 className="font-display text-3xl font-semibold text-ink dark:text-ivory-100">Quick Flicks</h1>
              <p className="text-muted mt-1">Fast, rhythmic contractions — one per second, no holding.</p>
            </div>
            <div className="glass rounded-3xl p-5">
              <p className="text-sm font-semibold text-ink dark:text-ivory-100 mb-3">Number of flicks</p>
              <div className="flex flex-wrap gap-2">
                {FLICK_PRESETS.map((n) => (
                  <button
                    key={n}
                    onClick={() => { setTarget(n); setCustomTarget('') }}
                    className={`focus-ring px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                      target === n && !customTarget ? 'bg-plum-500 text-white' : 'bg-plum-50 dark:bg-white/5 text-ink dark:text-ivory-100 hover:bg-plum-100 dark:hover:bg-white/10'
                    }`}
                  >
                    {n}
                  </button>
                ))}
                <input
                  type="number"
                  min={1}
                  placeholder="Custom"
                  value={customTarget}
                  onChange={(e) => {
                    setCustomTarget(e.target.value)
                    const val = parseInt(e.target.value, 10)
                    if (val > 0) setTarget(val)
                  }}
                  className="focus-ring w-24 px-4 py-2 rounded-xl text-sm font-semibold bg-plum-50 dark:bg-white/5 text-ink dark:text-ivory-100 placeholder:text-muted"
                />
              </div>
            </div>
            <div className="flex justify-center">
              <Button size="lg" icon={FiPlay} onClick={runCountdown}>Start Quick Flicks</Button>
            </div>
          </motion.div>
        )}

        {(stage === 'countdown' || stage === 'running' || stage === 'paused') && (
          <motion.div key="session" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative space-y-6">
            {stage === 'countdown' && <Countdown value={countdownVal} />}

            <div className="flex flex-col items-center justify-center py-6 gap-2">
              <FiZap className="text-gold" size={28} />
              <span className="font-display text-7xl font-bold text-ink dark:text-ivory-100 tabular-nums">{count}</span>
              <span className="text-muted text-sm">of {target}</span>
            </div>

            <ProgressBar value={pct} colorClass="bg-gold" label="Progress" />

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              {stage === 'paused' ? (
                <Button variant="ghost" icon={FiPlay} onClick={resume}>Resume</Button>
              ) : (
                <Button variant="ghost" icon={FiPause} onClick={pause} disabled={stage === 'countdown'}>Pause</Button>
              )}
              <Button variant="ghost" icon={FiRotateCcw} onClick={restart}>Restart</Button>
              <Button variant="danger" icon={FiSquare} onClick={stop}>Stop</Button>
            </div>
          </motion.div>
        )}

        {stage === 'complete' && result && (
          <motion.div key="complete" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="relative glass rounded-3xl p-8 text-center space-y-6 overflow-hidden">
            <Confetti />
            <FiCheckCircle className="mx-auto text-gold" size={56} />
            <div>
              <h2 className="font-display text-3xl font-semibold text-ink dark:text-ivory-100">Workout Complete!</h2>
              <p className="text-muted mt-1">{result.flickCount} flicks done — that rhythm adds up.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-plum-50 dark:bg-white/5 p-4">
                <p className="text-[11px] font-semibold text-muted uppercase tracking-wide mb-1">Total flicks</p>
                <p className="font-display text-xl font-semibold text-ink dark:text-ivory-100">{result.flickCount}</p>
              </div>
              <div className="rounded-2xl bg-plum-50 dark:bg-white/5 p-4">
                <p className="text-[11px] font-semibold text-muted uppercase tracking-wide mb-1">Duration</p>
                <p className="font-display text-xl font-semibold text-ink dark:text-ivory-100">{result.duration}s</p>
              </div>
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
              <Button onClick={runCountdown}>Go again</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
