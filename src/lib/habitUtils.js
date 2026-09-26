function toDateOnly(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

function daysAgoISO(n) {
  const d = toDateOnly(new Date())
  d.setDate(d.getDate() - n)
  return d.toISOString().slice(0, 10)
}

export function todayISO() {
  return daysAgoISO(0)
}

export function yesterdayISO() {
  return daysAgoISO(1)
}

/** Consecutive-day streak ending today or yesterday (one day of tail slack). */
export function currentStreak(logDates) {
  const dates = new Set(logDates)
  const today = todayISO()
  const yesterday = yesterdayISO()

  let cursor
  if (dates.has(today)) {
    cursor = new Date(today)
  } else if (dates.has(yesterday)) {
    cursor = new Date(yesterday)
  } else {
    return 0
  }

  let streak = 0
  while (dates.has(cursor.toISOString().slice(0, 10))) {
    streak += 1
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
  return !dates.has(todayISO()) && !dates.has(yesterdayISO()) && dates.has(daysAgoISO(2))
}

/** Last n days (oldest first) as { date, logged } for a heatmap strip. */
export function lastNDays(logDates, n = 7) {
  const dates = new Set(logDates)
  const days = []
  for (let i = n - 1; i >= 0; i--) {
    const date = daysAgoISO(i)
    days.push({ date, logged: dates.has(date) })
  }
  return days
}
