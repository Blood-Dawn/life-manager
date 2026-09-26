import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import Card from '../components/ui/Card'
import { monthKey, formatCurrency } from '../lib/dateUtils'
import { todayISO, currentStreak } from '../lib/habitUtils'
import { dueStatus } from '../lib/choreUtils'

const statusStyles = {
  overdue: 'text-expense',
  soon: 'text-amber-400',
  ok: 'text-text-muted',
  none: 'text-text-muted',
}

export default function Dashboard() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [net, setNet] = useState(0)
  const [habits, setHabits] = useState([])
  const [logsByHabit, setLogsByHabit] = useState({})
  const [chores, setChores] = useState([])

  useEffect(() => {
    let active = true
    async function load() {
      const month = monthKey(new Date())
      const [{ data: txns }, { data: habitData }, { data: logData }, { data: choreData }] = await Promise.all([
        supabase.from('transactions').select('amount, type, occurred_on'),
        supabase.from('habits').select('*').eq('active', true).order('created_at'),
        supabase.from('habit_logs').select('habit_id, log_date'),
        supabase.from('chores').select('*').eq('is_done', false).order('due_date', { ascending: true, nullsFirst: false }),
      ])
      if (!active) return

      const monthTxns = (txns ?? []).filter((t) => t.occurred_on.slice(0, 7) === month)
      const income = monthTxns.filter((t) => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0)
      const expenses = monthTxns.filter((t) => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0)
      setNet(income - expenses)

      setHabits(habitData ?? [])
      const grouped = {}
      for (const log of logData ?? []) {
        grouped[log.habit_id] = grouped[log.habit_id] || []
        grouped[log.habit_id].push(log.log_date)
      }
      setLogsByHabit(grouped)

      setChores((choreData ?? []).slice(0, 5))
      setLoading(false)
    }
    load()
    return () => {
      active = false
    }
  }, [])

  const today = todayISO()

  const handleToggleHabit = async (habit, checked) => {
    if (checked) {
      const { error } = await supabase
        .from('habit_logs')
        .insert({ habit_id: habit.id, user_id: user.id, log_date: today })
      if (!error) {
        setLogsByHabit((prev) => ({ ...prev, [habit.id]: [...(prev[habit.id] || []), today] }))
      }
    } else {
      const { error } = await supabase
        .from('habit_logs')
        .delete()
        .eq('habit_id', habit.id)
        .eq('log_date', today)
      if (!error) {
        setLogsByHabit((prev) => ({
          ...prev,
          [habit.id]: (prev[habit.id] || []).filter((d) => d !== today),
        }))
      }
    }
  }

  if (loading) {
    return <p className="text-sm text-text-muted">Loading dashboard…</p>
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold">Dashboard</h1>

      <Card>
        <p className="text-xs text-text-muted">This month's balance</p>
        <p className={`mt-1 text-3xl font-semibold ${net >= 0 ? 'text-income' : 'text-expense'}`}>
          {formatCurrency(net)}
        </p>
        <Link to="/finance" className="mt-3 inline-block text-sm text-accent hover:text-accent-hover">
          View finance →
        </Link>
      </Card>

      <Card>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold">Today's habits</h2>
          <Link to="/habits" className="text-xs text-accent hover:text-accent-hover">
            View all →
          </Link>
        </div>
        {habits.length === 0 ? (
          <p className="text-sm text-text-muted">No habits yet.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {habits.map((habit) => {
              const logDates = logsByHabit[habit.id] || []
              const checked = logDates.includes(today)
              return (
                <li key={habit.id} className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => handleToggleHabit(habit, e.target.checked)}
                      className="h-4 w-4 accent-accent"
                    />
                    {habit.icon} {habit.name}
                  </label>
                  <span className="text-xs text-text-muted">{currentStreak(logDates)} day streak</span>
                </li>
              )
            })}
          </ul>
        )}
      </Card>

      <Card>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold">Next due chores</h2>
          <Link to="/house" className="text-xs text-accent hover:text-accent-hover">
            View all →
          </Link>
        </div>
        {chores.length === 0 ? (
          <p className="text-sm text-text-muted">Nothing due — you're caught up.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {chores.map((chore) => (
              <li key={chore.id} className="flex items-center justify-between text-sm">
                <span>{chore.title}</span>
                <span className={`text-xs ${statusStyles[dueStatus(chore.due_date)]}`}>
                  {chore.due_date ? `Due ${chore.due_date}` : 'No due date'}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  )
}
