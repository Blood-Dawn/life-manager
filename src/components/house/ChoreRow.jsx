import { Pencil, Trash2, Clock } from 'lucide-react'
import { dueStatus } from '../../lib/choreUtils'

const statusStyles = {
  overdue: 'text-expense',
  soon: 'text-amber-400',
  ok: 'text-text-muted',
  none: 'text-text-muted',
}

export default function ChoreRow({ chore, onToggleDone, onSnooze, onEdit, onDelete }) {
  const status = dueStatus(chore.due_date)

  return (
    <li className="flex items-center justify-between gap-3 bg-surface px-4 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <input
          type="checkbox"
          checked={chore.is_done}
          onChange={(e) => onToggleDone(e.target.checked)}
          className="h-4 w-4 accent-accent"
        />
        <div className="min-w-0">
          <p className={`truncate text-sm font-medium ${chore.is_done ? 'text-text-muted line-through' : ''}`}>
            {chore.title}
          </p>
          <p className={`text-xs ${statusStyles[status]}`}>
            {chore.zone ? `${chore.zone} · ` : ''}
            {chore.due_date ? `Due ${chore.due_date}` : 'No due date'}
          </p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        {chore.due_date && (
          <button
            onClick={onSnooze}
            className="rounded-lg p-1.5 text-text-muted hover:bg-surface-hover hover:text-text"
            aria-label="Snooze chore"
            title="Snooze"
          >
            <Clock size={16} />
          </button>
        )}
        <button
          onClick={() => onEdit(chore)}
          className="rounded-lg p-1.5 text-text-muted hover:bg-surface-hover hover:text-text"
          aria-label="Edit chore"
        >
          <Pencil size={16} />
        </button>
        <button
          onClick={() => onDelete(chore)}
          className="rounded-lg p-1.5 text-text-muted hover:bg-expense/10 hover:text-expense"
          aria-label="Delete chore"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </li>
  )
}
