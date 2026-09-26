import { useEffect, useState } from 'react'
import { ListChecks } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import Card from '../components/ui/Card'
import EmptyState from '../components/ui/EmptyState'
import HabitForm from '../components/habits/HabitForm'
import HabitRow from '../components/habits/HabitRow'
import { todayISO } from '../lib/habitUtils'

export default function Habits() {
  const { user } = useAuth()
  const [habits, setHabits] = useState([])
  const [logsByHabit, setLogsByHabit] = useState({})
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)

  useEffect(() => {
    let active = true
    async function load() {
      const [{ data: habitData }, { data: logData }] = await Promise.all([
        supabase.from('habits').select('*').eq('active', true).order('created_at'),
        supabase.from('habit_logs').select('habit_id, log_date'),
      ])
      if (!active) return
      setHabits(habitData ?? [])
      const grouped = {}
      for (const log of logData ?? []) {
        grouped[log.habit_id] = grouped[log.habit_id] || []
        grouped[log.habit_id].push(log.log_date)
      }
      setLogsByHabit(grouped)
      setLoading(false)
    }
    load()
    return () => {
      active = false
    }
  }, [])

  const handleAdd = async (values) => {
    const { data, error } = await supabase
      .from('habits')
      .insert({ ...values, user_id: user.id })
      .select()
      .single()
    if (!error && data) setHabits((prev) => [...prev, data])
  }

  const handleUpdate = async (values) => {
    const { data, error } = await supabase
      .from('habits')
      .update(values)
      .eq('id', editing.id)
      .select()
      .single()
    if (!error && data) {
      setHabits((prev) => prev.map((h) => (h.id === data.id ? data : h)))
      setEditing(null)
    }
  }

  const handleDelete = async (habit) => {
    const { error } = await supabase.from('habits').delete().eq('id', habit.id)
    if (!error) setHabits((prev) => prev.filter((h) => h.id !== habit.id))
  }

  const handleToggle = async (habit, checked) => {
    const today = todayISO()
    if (checked) {
      const { error } = await supabase.from('habit_logs').insert({
        habit_id: habit.id,
        user_id: user.id,
        log_date: today,
      })
      if (!error) {
        setLogsByHabit((prev) => ({
          ...prev,
          [habit.id]: [...(prev[habit.id] || []), today],
        }))
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

  const today = todayISO()

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold">Habits</h1>

      <Card>
        <h2 className="mb-3 text-sm font-semibold">{editing ? 'Edit habit' : 'Add habit'}</h2>
        <HabitForm
          key={editing?.id ?? 'new'}
          initial={editing}
          onSubmit={editing ? handleUpdate : handleAdd}
          onCancel={() => setEditing(null)}
        />
      </Card>

      {loading ? (
        <p className="text-sm text-text-muted">Loading habits…</p>
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
