import { localISODate } from './dateUtils'

function startOfToday() {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

function daysAgoDate(n) {
  const d = startOfToday()
  d.setDate(d.getDate() - n)
  return d
}

export function todayISO() {
  return localISODate(startOfToday())
}

export function yesterdayISO() {
  return localISODate(daysAgoDate(1))
}

/** Consecutive-day streak ending today or yesterday, tolerating a single missed day. */
export function currentStreak(logDates) {
  const dates = new Set(logDates)
  const today = todayISO()
  const yesterday = yesterdayISO()

  let cursor
  if (dates.has(today)) {
    cursor = startOfToday()
  } else if (dates.has(yesterday)) {
    cursor = daysAgoDate(1)
  } else {
    return 0
  }

  let streak = 0
  let usedGrace = false
  while (true) {
    if (dates.has(localISODate(cursor))) {
      streak += 1
    } else if (usedGrace) {
      break
    } else {
      usedGrace = true
    }
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}

/** Longest run of consecutive days anywhere in the habit's history. */
export function bestStreak(logDates) {
  if (logDates.length === 0) return 0
  const sorted = [...new Set(logDates)].sort()
  let longest = 1
  let running = 1
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1])
    const curr = new Date(sorted[i])
    const diffDays = Math.round((curr - prev) / 86400000)
    running = diffDays === 1 ? running + 1 : 1
    longest = Math.max(longest, running)
  }
  return longest
}

/** True when yesterday was missed but the day before had a log and today hasn't happened yet. */
export function shouldNudge(logDates) {
  const dates = new Set(logDates)
  return !dates.has(todayISO()) && !dates.has(yesterdayISO()) && dates.has(localISODate(daysAgoDate(2)))
}

/** Last n days (oldest first) as { date, logged } for a heatmap strip. */
export function lastNDays(logDates, n = 7) {
  const dates = new Set(logDates)
  const days = []
  for (let i = n - 1; i >= 0; i--) {
    const date = localISODate(daysAgoDate(i))
    days.push({ date, logged: dates.has(date) })
  }
  return days
}
