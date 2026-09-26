import { Pencil, Trash2, Wallet } from 'lucide-react'
import EmptyState from '../ui/EmptyState'
import { formatCurrency } from '../../lib/dateUtils'

export default function TransactionList({ transactions, onEdit, onDelete }) {
  if (transactions.length === 0) {
    return (
      <EmptyState
        icon={Wallet}
        title="No transactions this month"
        hint="Add your first income or expense above."
      />
    )
  }

  return (
    <ul className="flex flex-col divide-y divide-border overflow-hidden rounded-xl border border-border">
      {transactions.map((t) => (
        <li key={t.id} className="flex items-center justify-between gap-3 bg-surface px-4 py-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{t.description || t.category}</p>
            <p className="text-xs text-text-muted">
              {t.occurred_on} · {t.category}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <span className={`text-sm font-semibold ${t.type === 'income' ? 'text-income' : 'text-expense'}`}>
              {t.type === 'income' ? '+' : '-'}
              {formatCurrency(t.amount)}
            </span>
            <button
              onClick={() => onEdit(t)}
              className="rounded-lg p-1.5 text-text-muted hover:bg-surface-hover hover:text-text"
              aria-label="Edit transaction"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={() => window.confirm('Delete this transaction?') && onDelete(t)}
              className="rounded-lg p-1.5 text-text-muted hover:bg-expense/10 hover:text-expense"
              aria-label="Delete transaction"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}
