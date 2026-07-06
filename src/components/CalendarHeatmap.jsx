import React, { useMemo } from 'react'
import { toDateKey } from '../utils/dateHelpers'

// Shows a GitHub-style heatmap of the last ~12 weeks of daily completion.
export default function CalendarHeatmap({ daily = {}, dailyGoal = 2, weeks = 12 }) {
  const cells = useMemo(() => {
    const today = new Date()
    const start = new Date(today)
    start.setDate(start.getDate() - weeks * 7 + 1)
    // Align to the previous Sunday so columns represent full weeks.
    start.setDate(start.getDate() - start.getDay())

    const days = []
    for (let i = 0; i < weeks * 7; i++) {
      const d = new Date(start)
      d.setDate(start.getDate() + i)
      const key = toDateKey(d)
      const count = daily[key] || 0
      const level = count === 0 ? 0 : count >= dailyGoal ? 3 : count === dailyGoal - 1 ? 2 : 1
      days.push({ key, date: d, count, level, isFuture: d > today })
    }
    return days
  }, [daily, dailyGoal, weeks])

  const columns = []
  for (let i = 0; i < cells.length; i += 7) columns.push(cells.slice(i, i + 7))

  const levelClass = [
    'bg-plum-50 dark:bg-white/5',
    'bg-plum-200 dark:bg-plum-700/50',
    'bg-plum-400 dark:bg-plum-500/70',
    'bg-contract dark:bg-contract',
  ]

  return (
    <div className="flex gap-1 overflow-x-auto pb-2">
      {columns.map((col, ci) => (
        <div key={ci} className="flex flex-col gap-1">
          {col.map((cell) => (
            <div
              key={cell.key}
              title={`${cell.key}: ${cell.count} session(s)`}
              className={`w-3.5 h-3.5 rounded-[4px] ${cell.isFuture ? 'opacity-0' : levelClass[cell.level]}`}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
