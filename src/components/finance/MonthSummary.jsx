import Card from '../ui/Card'
import { formatCurrency } from '../../lib/dateUtils'

export default function MonthSummary({ income, expenses, isCurrentMonth }) {
  const net = income - expenses

  return (
    <div className="grid grid-cols-3 gap-3">
      <Card className="col-span-3 sm:col-span-1">
        <p className="text-xs text-text-muted">{isCurrentMonth ? 'Net · safe to spend' : 'Net'}</p>
        <p className={`mt-1 text-2xl font-semibold ${net >= 0 ? 'text-income' : 'text-expense'}`}>
          {formatCurrency(net)}
        </p>
      </Card>
      <Card>
        <p className="text-xs text-text-muted">Income</p>
        <p className="mt-1 text-xl font-semibold text-income">{formatCurrency(income)}</p>
      </Card>
      <Card>
        <p className="text-xs text-text-muted">Expenses</p>
        <p className="mt-1 text-xl font-semibold text-expense">{formatCurrency(expenses)}</p>
      </Card>
    </div>
  )
}
