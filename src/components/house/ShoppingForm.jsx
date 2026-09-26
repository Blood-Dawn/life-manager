import { useState } from 'react'
import Input from '../ui/Input'
import Button from '../ui/Button'

const empty = { item_name: '', quantity: '' }

export default function ShoppingForm({ initial, onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState(initial ? { item_name: initial.item_name, quantity: initial.quantity ?? '' } : empty)
  const isEditing = Boolean(initial)

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!form.item_name.trim()) return
    const ok = await onSubmit({ item_name: form.item_name.trim(), quantity: form.quantity.trim() || null })
    if (ok && !isEditing) setForm(empty)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3">
      <Input
        label="Item"
        name="item_name"
        placeholder="Milk"
        value={form.item_name}
        onChange={(e) => setForm((f) => ({ ...f, item_name: e.target.value }))}
        className="min-w-40 flex-1"
        required
      />
      <Input
        label="Quantity"
        name="quantity"
        placeholder="Optional"
        value={form.quantity}
        onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value }))}
        className="w-32"
      />
      <div className="flex gap-2">
        <Button type="submit" disabled={submitting}>
          {isEditing ? 'Save' : 'Add item'}
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
