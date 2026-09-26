import { useState } from 'react'
import Input, { Select } from '../ui/Input'
import Button from '../ui/Button'
import { ZONES } from '../../lib/choreUtils'

const empty = { title: '', zone: ZONES[0], frequency: 'one_time', due_date: '' }

export default function ChoreForm({ initial, onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState(
    initial
      ? { title: initial.title, zone: initial.zone ?? ZONES[0], frequency: initial.frequency, due_date: initial.due_date ?? '' }
      : empty,
  )
  const isEditing = Boolean(initial)

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!form.title.trim()) return
    const ok = await onSubmit({ ...form, title: form.title.trim(), due_date: form.due_date || null })
    if (ok && !isEditing) setForm(empty)
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <Input
        label="Chore"
        name="title"
        placeholder="Take out trash"
        value={form.title}
        onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
        className="col-span-2"
        required
      />
      <Select
        label="Zone"
        value={form.zone}
        onChange={(e) => setForm((f) => ({ ...f, zone: e.target.value }))}
      >
        {ZONES.map((z) => (
          <option key={z} value={z}>
            {z}
          </option>
        ))}
      </Select>
      <Select
        label="Frequency"
        value={form.frequency}
        onChange={(e) => setForm((f) => ({ ...f, frequency: e.target.value }))}
      >
        <option value="one_time">One time</option>
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
        <option value="monthly">Monthly</option>
      </Select>
      <Input
        label="Due date"
        type="date"
        value={form.due_date}
        onChange={(e) => setForm((f) => ({ ...f, due_date: e.target.value }))}
      />
      <div className="col-span-2 flex items-end gap-2 sm:col-span-1">
        <Button type="submit" disabled={submitting} className="w-full">
          {isEditing ? 'Save' : 'Add chore'}
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
