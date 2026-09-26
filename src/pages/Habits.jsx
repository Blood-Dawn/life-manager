import { useCallback, useEffect, useState } from 'react'
import { ListChecks } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import Card from '../components/ui/Card'
import EmptyState from '../components/ui/EmptyState'
import ErrorBanner from '../components/ui/ErrorBanner'
import HabitForm from '../components/habits/HabitForm'
import HabitRow from '../components/habits/HabitRow'
import { todayISO } from '../lib/habitUtils'

export default function Habits() {
  const { user } = useAuth()
  const [habits, setHabits] = useState([])
  const [logsByHabit, setLogsByHabit] = useState({})
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [formError, setFormError] = useState(null)
  const [listError, setListError] = useState(null)
  const [editing, setEditing] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setLoadError(null)
    const [habitsRes, logsRes] = await Promise.all([
      supabase.from('habits').select('*').eq('active', true).order('created_at'),
      supabase.from('habit_logs').select('habit_id, log_date'),
    ])
    const firstError = habitsRes.error || logsRes.error
    if (firstError) {
      setLoadError(firstError.message)
      setLoading(false)
      return
    }
    setHabits(habitsRes.data ?? [])
    const grouped = {}
    for (const log of logsRes.data ?? []) {
      grouped[log.habit_id] = grouped[log.habit_id] || []
      grouped[log.habit_id].push(log.log_date)
    }
    setLogsByHabit(grouped)
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const handleAdd = async (values) => {
    setFormError(null)
    const { data, error } = await supabase
      .from('habits')
      .insert({ ...values, user_id: user.id })
      .select()
      .single()
    if (error) {
      setFormError(error.message)
      return false
    }
    setHabits((prev) => [...prev, data])
    return true
  }

  const handleUpdate = async (values) => {
    setFormError(null)
    const { data, error } = await supabase
      .from('habits')
      .update(values)
      .eq('id', editing.id)
      .select()
      .single()
    if (error) {
      setFormError(error.message)
      return false
    }
    setHabits((prev) => prev.map((h) => (h.id === data.id ? data : h)))
    setEditing(null)
    return true
  }

  const handleDelete = async (habit) => {
    setListError(null)
    const { error } = await supabase.from('habits').delete().eq('id', habit.id)
    if (error) {
      setListError(error.message)
      return
    }
    setHabits((prev) => prev.filter((h) => h.id !== habit.id))
  }

  const handleToggle = async (habit, checked) => {
    setListError(null)
    const today = todayISO()
    if (checked) {
      const { error } = await supabase.from('habit_logs').insert({
        habit_id: habit.id,
        user_id: user.id,
        log_date: today,
      })
      if (error) {
        setListError(error.message)
        return
      }
      setLogsByHabit((prev) => ({
        ...prev,
        [habit.id]: [...(prev[habit.id] || []), today],
      }))
    } else {
      const { error } = await supabase
        .from('habit_logs')
        .delete()
        .eq('habit_id', habit.id)
        .eq('log_date', today)
      if (error) {
        setListError(error.message)
        return
      }
      setLogsByHabit((prev) => ({
        ...prev,
        [habit.id]: (prev[habit.id] || []).filter((d) => d !== today),
      }))
    }
  }

  const today = todayISO()

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold">Habits</h1>

      <Card>
        <h2 className="mb-3 text-sm font-semibold">{editing ? 'Edit habit' : 'Add habit'}</h2>
        <ErrorBanner message={formError} />
        <HabitForm
          key={editing?.id ?? 'new'}
          initial={editing}
          onSubmit={editing ? handleUpdate : handleAdd}
          onCancel={() => {
            setEditing(null)
            setFormError(null)
          }}
        />
      </Card>

      <ErrorBanner message={listError} />

      {loading ? (
        <p className="text-sm text-text-muted">Loading habits…</p>
      ) : loadError ? (
        <ErrorBanner message={`Couldn't load your habits: ${loadError}`} onRetry={load} />
      ) : habits.length === 0 ? (
        <EmptyState
          icon={ListChecks}
          title="No habits yet"
          hint="Add a habit to start checking in daily and building a streak."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {habits.map((habit) => (
            <HabitRow
              key={habit.id}
              habit={habit}
              logDates={logsByHabit[habit.id] || []}
              checkedToday={(logsByHabit[habit.id] || []).includes(today)}
              onToggle={(checked) => handleToggle(habit, checked)}
              onEdit={setEditing}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}
