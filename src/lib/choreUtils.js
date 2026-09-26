export const ZONES = ['Kitchen', 'Bathroom', 'Bedroom', 'Common Areas', 'Outdoor', 'Other']

function todayDateOnly() {
  const d = new Date()
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

export function dueStatus(dueDate) {
  if (!dueDate) return 'none'
  const due = new Date(dueDate)
  const today = todayDateOnly()
  const diffDays = Math.round((due - today) / 86400000)
  if (diffDays < 0) return 'overdue'
  if (diffDays <= 1) return 'soon'
  return 'ok'
}

const FREQUENCY_DAYS = {
  one_time: 1,
  daily: 1,
  weekly: 7,
  monthly: 30,
}

export function snoozeDueDate(dueDate, frequency) {
  const base = dueDate ? new Date(dueDate) : new Date()
  base.setDate(base.getDate() + (FREQUENCY_DAYS[frequency] ?? 1))
  return base.toISOString().slice(0, 10)
}
