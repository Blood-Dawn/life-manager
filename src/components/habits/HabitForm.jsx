import { useState } from 'react'
import Input from '../ui/Input'
import Button from '../ui/Button'

const empty = { name: '', icon: '✅' }

export default function HabitForm({ initial, onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState(initial ? { name: initial.name, icon: initial.icon } : empty)
  const isEditing = Boolean(initial)

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!form.name.trim()) return
    const ok = await onSubmit({ name: form.name.trim(), icon: form.icon.trim() || '✅' })
    if (ok && !isEditing) setForm(empty)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3">
      <Input
        label="Habit"
        name="name"
        placeholder="Drink water"
        value={form.name}
        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        className="min-w-40 flex-1"
        required
      />
      <Input
        label="Icon"
        name="icon"
        value={form.icon}
        onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
        className="w-20 text-center"
        maxLength={4}
      />
      <div className="flex gap-2">
        <Button type="submit" disabled={submitting}>
          {isEditing ? 'Save' : 'Add habit'}
        </Button>
        {isEditing && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}
