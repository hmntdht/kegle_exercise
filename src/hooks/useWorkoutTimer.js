import { useState, useRef, useCallback, useEffect } from 'react'

// Phases: 'idle' -> 'ready' -> 'contract' <-> 'relax' -> 'finished'
// Timing is computed from wall-clock timestamps (Date.now()) rather than
// counted ticks, so pausing/resuming or a sluggish tab never causes drift.
export default function useWorkoutTimer({ holdTime, restTime, totalDuration, onComplete }) {
  const [phase, setPhase] = useState('idle')
  const [secondsLeftInPhase, setSecondsLeftInPhase] = useState(3)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [completedCycles, setCompletedCycles] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const phaseRef = useRef('idle')
  const phaseEndRef = useRef(0) // timestamp when current phase should end
  const phaseDurationRef = useRef(3)
  const workoutStartRef = useRef(0) // timestamp workout truly started (post-ready)
  const pausedAtRef = useRef(0)
  const pauseOffsetRef = useRef(0) // total ms spent paused, subtracted from elapsed
  const cyclesRef = useRef(0)
  const rafRef = useRef(null)
  const completeRef = useRef(false)

  const setPhaseBoth = (p, duration) => {
    phaseRef.current = p
    phaseDurationRef.current = duration
    setPhase(p)
  }

  const tick = useCallback(() => {
    if (phaseRef.current === 'idle' || phaseRef.current === 'finished' || isPausedFn()) {
      rafRef.current = requestAnimationFrame(tick)
      return
    }
    const now = Date.now()
    const remainingMs = phaseEndRef.current - now
    const remaining = Math.max(0, Math.ceil(remainingMs / 1000))
    setSecondsLeftInPhase(remaining)

    if (phaseRef.current !== 'ready') {
      const elapsed = (now - workoutStartRef.current - pauseOffsetRef.current) / 1000
      const clampedElapsed = Math.min(elapsed, totalDuration)
      setElapsedSeconds(clampedElapsed)

      if (clampedElapsed >= totalDuration && !completeRef.current) {
        completeRef.current = true
        setPhaseBoth('finished', 0)
        setElapsedSeconds(totalDuration)
        onComplete && onComplete({ completedCycles: cyclesRef.current, totalSeconds: totalDuration })
        return
      }
    }

    if (remainingMs <= 0) {
      if (phaseRef.current === 'ready') {
        workoutStartRef.current = Date.now()
        pauseOffsetRef.current = 0
        const dur = holdTime
        phaseEndRef.current = Date.now() + dur * 1000
        setPhaseBoth('contract', dur)
      } else if (phaseRef.current === 'contract') {
        cyclesRef.current += 1
        setCompletedCycles(cyclesRef.current)
        const dur = restTime
        phaseEndRef.current = Date.now() + dur * 1000
        setPhaseBoth('relax', dur)
      } else if (phaseRef.current === 'relax') {
        const dur = holdTime
        phaseEndRef.current = Date.now() + dur * 1000
        setPhaseBoth('contract', dur)
      }
    }
    rafRef.current = requestAnimationFrame(tick)
  }, [holdTime, restTime, totalDuration, onComplete])

  const isPausedFnRef = useRef(false)
  const isPausedFn = () => isPausedFnRef.current

  useEffect(() => {
    isPausedFnRef.current = isPaused
  }, [isPaused])

  useEffect(() => {
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [tick])

  const start = useCallback(() => {
    completeRef.current = false
    cyclesRef.current = 0
    setCompletedCycles(0)
    setElapsedSeconds(0)
    setIsPaused(false)
    phaseEndRef.current = Date.now() + 3000
    setPhaseBoth('ready', 3)
    setSecondsLeftInPhase(3)
  }, [])

  const pause = useCallback(() => {
    if (phaseRef.current === 'idle' || phaseRef.current === 'finished') return
    pausedAtRef.current = Date.now()
    setIsPaused(true)
  }, [])

  const resume = useCallback(() => {
    if (!pausedAtRef.current) {
      setIsPaused(false)
      return
    }
    const pausedMs = Date.now() - pausedAtRef.current
    pauseOffsetRef.current += pausedMs
    phaseEndRef.current += pausedMs
    pausedAtRef.current = 0
    setIsPaused(false)
  }, [])

  const stop = useCallback(() => {
    phaseEndRef.current = 0
    setPhaseBoth('idle', 0)
    setIsPaused(false)
    setElapsedSeconds(0)
    setCompletedCycles(0)
    cyclesRef.current = 0
    completeRef.current = false
  }, [])

  const restart = useCallback(() => {
    start()
  }, [start])

  const skipPhase = useCallback(() => {
    if (phaseRef.current === 'contract' || phaseRef.current === 'relax') {
      phaseEndRef.current = Date.now() + 1
    }
  }, [])

  return {
    phase,
    secondsLeftInPhase,
    elapsedSeconds,
    remainingSeconds: Math.max(0, totalDuration - elapsedSeconds),
    completedCycles,
    isPaused,
    progress: phase === 'ready' ? secondsLeftInPhase / 3 : phaseDurationRef.current ? secondsLeftInPhase / phaseDurationRef.current : 0,
    start,
    pause,
    resume,
    stop,
    restart,
    skipPhase,
  }
}
