// Date utilities used across streak tracking, history, and statistics.

export const toDateKey = (date = new Date()) => {
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export const isSameDay = (a, b) => toDateKey(a) === toDateKey(b)

export const addDays = (date, amount) => {
  const d = new Date(date)
  d.setDate(d.getDate() + amount)
  return d
}

export const formatTime = (totalSeconds) => {
  const s = Math.max(0, Math.round(totalSeconds))
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
}

export const formatClock = (date) => {
  return new Date(date).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

export const formatDateLabel = (dateKey) => {
  const d = new Date(dateKey + 'T00:00:00')
  return d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })
}

export const startOfWeek = (date) => {
  const d = new Date(date)
  const day = d.getDay()
  return addDays(d, -day)
}

export const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate()

// Returns array of last `count` date keys ending today (oldest first).
export const lastNDateKeys = (count, endDate = new Date()) => {
  const keys = []
  for (let i = count - 1; i >= 0; i--) {
    keys.push(toDateKey(addDays(endDate, -i)))
  }
  return keys
}

export const weekLabel = (dateKey) => {
  const d = new Date(dateKey + 'T00:00:00')
  return d.toLocaleDateString([], { weekday: 'short' })[0]
}
