export const CATEGORIES = ['Food', 'Rent', 'Utilities', 'Transport', 'Entertainment', 'Income', 'Other']

/** Format a Date using its local year/month/day, avoiding the UTC shift toISOString() introduces. */
export function localISODate(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

/** Parse a "YYYY-MM-DD" string as a local-midnight Date, avoiding new Date(str)'s UTC parsing. */
export function parseLocalDate(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function todayISO() {
  return localISODate(new Date())
}

export function monthKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

export function monthLabel(monthKeyStr) {
  const [year, month] = monthKeyStr.split('-').map(Number)
  return new Date(year, month - 1, 1).toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  })
}

export function shiftMonth(monthKeyStr, delta) {
  const [year, month] = monthKeyStr.split('-').map(Number)
  const next = new Date(year, month - 1 + delta, 1)
  return monthKey(next)
}

export function isInMonth(dateStr, monthKeyStr) {
  return dateStr.slice(0, 7) === monthKeyStr
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(amount)
}
