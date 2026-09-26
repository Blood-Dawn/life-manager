import { localISODate, parseLocalDate } from './dateUtils'

export const ZONES = ['Kitchen', 'Bathroom', 'Bedroom', 'Common Areas', 'Outdoor', 'Other']

function startOfToday() {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

export function dueStatus(dueDate) {
  if (!dueDate) return 'none'
  const due = parseLocalDate(dueDate)
  const today = startOfToday()
  const diffDays = Math.round((due - today) / 86400000)
  if (diffDays < 0) return 'overdue'
  if (diffDays <= 1) return 'soon'
  return 'ok'
}

const FREQUENCY_DAYS = {
  one_time: 1,
  daily: 1,
  weekly: 7,
}

export function snoozeDueDate(dueDate, frequency) {
  const base = dueDate ? parseLocalDate(dueDate) : startOfToday()

  if (frequency === 'monthly') {
    const day = base.getDate()
    base.setDate(1)
    base.setMonth(base.getMonth() + 1)
    const lastDayOfMonth = new Date(base.getFullYear(), base.getMonth() + 1, 0).getDate()
    base.setDate(Math.min(day, lastDayOfMonth))
  } else {
    base.setDate(base.getDate() + (FREQUENCY_DAYS[frequency] ?? 1))
  }

  return localISODate(base)
}
