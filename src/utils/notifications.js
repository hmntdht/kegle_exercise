// Browser Notification helpers for reminders.

export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) return 'unsupported'
  if (Notification.permission === 'granted') return 'granted'
  if (Notification.permission === 'denied') return 'denied'
  return Notification.requestPermission()
}

export const notify = (title, options = {}) => {
  if (!('Notification' in window)) return
  if (Notification.permission !== 'granted') return
  try {
    new Notification(title, options)
  } catch {
    // Some browsers (mobile Safari) don't support the constructor — ignore.
  }
}

// Computes the next upcoming reminder Date object from a list of "HH:MM" times.
export const nextReminderTime = (times = []) => {
  if (!times.length) return null
  const now = new Date()
  const candidates = times.map((t) => {
    const [h, m] = t.split(':').map(Number)
    const d = new Date(now)
    d.setHours(h, m, 0, 0)
    if (d <= now) d.setDate(d.getDate() + 1)
    return d
  })
  return candidates.sort((a, b) => a - b)[0]
}
