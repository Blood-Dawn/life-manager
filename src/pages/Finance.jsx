import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import MonthNav from '../components/finance/MonthNav'
import MonthSummary from '../components/finance/MonthSummary'
import TransactionForm from '../components/finance/TransactionForm'
import TransactionList from '../components/finance/TransactionList'
import BudgetPanel from '../components/finance/BudgetPanel'
import Card from '../components/ui/Card'
import { monthKey, shiftMonth } from '../lib/dateUtils'

export default function Finance() {
  const { user } = useAuth()
  const [allTransactions, setAllTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [month, setMonth] = useState(monthKey(new Date()))
  const [editing, setEditing] = useState(null)

  useEffect(() => {
    let active = true
    supabase
      .from('transactions')
      .select('*')
      .order('occurred_on', { ascending: false })
      .then(({ data }) => {
        if (active) {
          setAllTransactions(data ?? [])
          setLoading(false)
        }
      })
    return () => {
      active = false
    }
  }, [])

  const monthTransactions = useMemo(
    () => allTransactions.filter((t) => t.occurred_on.slice(0, 7) === month),
    [allTransactions, month],
  )

  const income = monthTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0)
  const expenses = monthTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const handleAdd = async (values) => {
    const { data, error } = await supabase
      .from('transactions')
      .insert({ ...values, user_id: user.id })
      .select()
      .single()
    if (!error && data) {
      setAllTransactions((prev) => [data, ...prev])
    }
  }

  const handleUpdate = async (values) => {
    const { data, error } = await supabase
      .from('transactions')
      .update(values)
      .eq('id', editing.id)
      .select()
      .single()
    if (!error && data) {
      setAllTransactions((prev) => prev.map((t) => (t.id === data.id ? data : t)))
      setEditing(null)
    }
  }

  const handleDelete = async (transaction) => {
    const { error } = await supabase.from('transactions').delete().eq('id', transaction.id)
    if (!error) {
      setAllTransactions((prev) => prev.filter((t) => t.id !== transaction.id))
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Finance</h1>
        <MonthNav
          month={month}
          onPrev={() => setMonth((m) => shiftMonth(m, -1))}
          onNext={() => setMonth((m) => shiftMonth(m, 1))}
        />
      </div>

      <MonthSummary income={income} expenses={expenses} isCurrentMonth={month === monthKey(new Date())} />

      <Card>
        <h2 className="mb-3 text-sm font-semibold">{editing ? 'Edit transaction' : 'Add transaction'}</h2>
        <TransactionForm
          key={editing?.id ?? 'new'}
          initial={editing}
          transactions={allTransactions}
          onSubmit={editing ? handleUpdate : handleAdd}
          onCancel={() => setEditing(null)}
        />
      </Card>

      {loading ? (
        <p className="text-sm text-text-muted">Loading transactions…</p>
      ) : (
        <TransactionList transactions={monthTransactions} onEdit={setEditing} onDelete={handleDelete} />
      )}

      <BudgetPanel transactions={monthTransactions} />
    </div>
  )
}
