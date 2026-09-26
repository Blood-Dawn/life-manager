import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import Card from '../ui/Card'
import Button from '../ui/Button'
import ErrorBanner from '../ui/ErrorBanner'
import { Select } from '../ui/Input'
import Input from '../ui/Input'
import { CATEGORIES, formatCurrency } from '../../lib/dateUtils'

export default function BudgetPanel({ transactions }) {
  const { user } = useAuth()
  const [budgets, setBudgets] = useState([])
  const [category, setCategory] = useState(CATEGORIES[0])
  const [limit, setLimit] = useState('')
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [formError, setFormError] = useState(null)
  const [listError, setListError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setLoadError(null)
    const { data, error } = await supabase.from('budgets').select('*').order('category')
    if (error) {
      setLoadError(error.message)
    } else {
      setBudgets(data ?? [])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const spentByCategory = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Number(t.amount)
      return acc
    }, {})

  const handleSetLimit = async (event) => {
    event.preventDefault()
    setFormError(null)
    const monthlyLimit = Number(limit)
    if (!monthlyLimit || monthlyLimit <= 0) return

    const { data, error } = await supabase
      .from('budgets')
      .upsert(
        { user_id: user.id, category, monthly_limit: monthlyLimit },
        { onConflict: 'user_id,category' },
      )
      .select()
      .single()

    if (error) {
      setFormError(error.message)
      return
    }
    setBudgets((prev) =>
      [...prev.filter((b) => b.category !== category), data].sort((a, b) => a.category.localeCompare(b.category)),
    )
    setLimit('')
  }

  const handleDelete = async (budget) => {
    if (!window.confirm(`Remove the budget for ${budget.category}?`)) return
    setListError(null)
    const { error } = await supabase.from('budgets').delete().eq('id', budget.id)
    if (error) {
      setListError(error.message)
      return
    }
    setBudgets((prev) => prev.filter((b) => b.id !== budget.id))
  }

  if (loading) return null

  if (loadError) {
    return (
      <Card>
        <h2 className="mb-3 text-sm font-semibold">Budgets</h2>
        <ErrorBanner message={`Couldn't load your budgets: ${loadError}`} onRetry={load} />
      </Card>
    )
  }

  return (
    <Card>
      <h2 className="mb-3 text-sm font-semibold">Budgets</h2>
      <ErrorBanner message={formError} />
      <form onSubmit={handleSetLimit} className="mb-4 flex flex-wrap items-end gap-3">
        <Select label="Category" value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
        <Input
          label="Monthly limit"
          type="number"
          min="0"
          step="0.01"
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
        />
        <Button type="submit">Set limit</Button>
      </form>

      <ErrorBanner message={listError} />

      {budgets.length === 0 ? (
        <p className="text-sm text-text-muted">No budgets set yet.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {budgets.map((b) => {
            const spent = spentByCategory[b.category] || 0
            const pct = Math.min(100, (spent / b.monthly_limit) * 100)
            const over = spent > b.monthly_limit
            return (
              <li key={b.id}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span>{b.category}</span>
                  <span className={over ? 'text-expense' : 'text-text-muted'}>
                    {formatCurrency(spent)} / {formatCurrency(b.monthly_limit)}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-border">
                  <div
                    className={`h-full rounded-full ${over ? 'bg-expense' : 'bg-accent'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <button
                  onClick={() => handleDelete(b)}
                  className="mt-1 text-xs text-text-muted hover:text-expense"
                >
                  Remove
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </Card>
  )
}
