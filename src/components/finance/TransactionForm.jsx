import { useState } from 'react'
import Input, { Select } from '../ui/Input'
import Button from '../ui/Button'
import { CATEGORIES, todayISO } from '../../lib/dateUtils'

const emptyForm = {
  type: 'expense',
  amount: '',
  category: 'Food',
  description: '',
  occurred_on: todayISO(),
}

export default function TransactionForm({ initial, transactions, onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState(initial ? { ...initial } : emptyForm)
  const [error, setError] = useState(null)
  const isEditing = Boolean(initial)

  const handleDescriptionBlur = () => {
    if (isEditing || !form.description.trim()) return
    const match = transactions.find(
      (t) => t.description?.trim().toLowerCase() === form.description.trim().toLowerCase(),
    )
    if (match) {
      setForm((f) => ({ ...f, category: match.category, amount: String(match.amount), type: match.type }))
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const amountNumber = Number(form.amount)
    if (!form.amount || Number.isNaN(amountNumber) || amountNumber <= 0) {
      setError('Enter an amount greater than 0.')
      return
    }
    setError(null)
    onSubmit({ ...form, amount: amountNumber })
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <Select
        label="Type"
        name="type"
        value={form.type}
        onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
        className="col-span-1"
      >
        <option value="expense">Expense</option>
        <option value="income">Income</option>
      </Select>
      <Input
        label="Amount"
        type="number"
        step="0.01"
        min="0"
        name="amount"
        value={form.amount}
        onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
        className="col-span-1"
        required
      />
      <Select
        label="Category"
        name="category"
        value={form.category}
        onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
        className="col-span-1"
      >
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </Select>
      <Input
        label="Date"
        type="date"
        name="occurred_on"
        value={form.occurred_on}
        onChange={(e) => setForm((f) => ({ ...f, occurred_on: e.target.value }))}
        className="col-span-1"
        required
      />
      <Input
        label="Description"
        name="description"
        placeholder="Optional"
        value={form.description}
        onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
        onBlur={handleDescriptionBlur}
        className="col-span-2 sm:col-span-3"
      />
      <div className="col-span-2 flex items-end gap-2 sm:col-span-1">
        <Button type="submit" disabled={submitting} className="w-full">
          {isEditing ? 'Save' : 'Add'}
        </Button>
        {isEditing && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
      {error && <p className="col-span-full text-sm text-expense">{error}</p>}
    </form>
  )
}
