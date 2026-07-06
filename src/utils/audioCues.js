// Lightweight beep generator (WebAudio) + SpeechSynthesis wrapper.
// No external audio files needed — everything is synthesized.

let audioCtx = null
const getCtx = () => {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext
    audioCtx = new AudioContext()
  }
  return audioCtx
}

export const playBeep = ({ frequency = 880, duration = 0.12, volume = 0.15 } = {}) => {
  try {
    const ctx = getCtx()
    if (ctx.state === 'suspended') ctx.resume()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.value = frequency
    gain.gain.setValueAtTime(volume, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + duration)
  } catch {
    // Audio unavailable (e.g. autoplay policy) — fail silently.
  }
}

export const SOUND_CUES = {
  start: () => playBeep({ frequency: 660, duration: 0.15 }),
  contract: () => playBeep({ frequency: 880, duration: 0.1 }),
  relax: () => playBeep({ frequency: 520, duration: 0.1 }),
  tick: () => playBeep({ frequency: 740, duration: 0.05, volume: 0.08 }),
  complete: () => {
    playBeep({ frequency: 660, duration: 0.12 })
    setTimeout(() => playBeep({ frequency: 880, duration: 0.15 }), 140)
    setTimeout(() => playBeep({ frequency: 1040, duration: 0.2 }), 300)
  },
}

export const speak = (text) => {
  try {
    if (!('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 1
    utterance.pitch = 1
    utterance.volume = 0.9
    window.speechSynthesis.speak(utterance)
  } catch {
    // Speech synthesis unavailable — fail silently.
  }
}
