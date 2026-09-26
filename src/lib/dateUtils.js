export const CATEGORIES = ['Food', 'Rent', 'Utilities', 'Transport', 'Entertainment', 'Income', 'Other']

export function todayISO() {
  return new Date().toISOString().slice(0, 10)
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
