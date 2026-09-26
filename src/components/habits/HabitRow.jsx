import { Pencil, Trash2 } from 'lucide-react'
import Card from '../ui/Card'
import { currentStreak, bestStreak, shouldNudge, lastNDays } from '../../lib/habitUtils'

export default function HabitRow({ habit, logDates, checkedToday, onToggle, onEdit, onDelete }) {
  const streak = currentStreak(logDates)
  const best = bestStreak(logDates)
  const nudge = shouldNudge(logDates)
  const days = lastNDays(logDates, 7)

  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onToggle(!checkedToday)}
            aria-label={checkedToday ? 'Mark not done today' : 'Mark done today'}
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-lg ${
              checkedToday ? 'bg-accent text-white' : 'bg-surface-hover text-text-muted'
            }`}
          >
            {habit.icon}
          </button>
          <div>
            <p className="font-medium">{habit.name}</p>
            <p className="text-xs text-text-muted">
              {streak > 0 ? `${streak} day streak` : 'No streak yet'} · best {best}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(habit)}
            className="rounded-lg p-1.5 text-text-muted hover:bg-surface-hover hover:text-text"
            aria-label="Edit habit"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={() => window.confirm(`Delete "${habit.name}" and all its check-ins?`) && onDelete(habit)}
            className="rounded-lg p-1.5 text-text-muted hover:bg-expense/10 hover:text-expense"
            aria-label="Delete habit"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {nudge && (
        <p className="rounded-lg bg-accent/10 px-3 py-2 text-xs text-accent">
          You missed yesterday — check in today to keep going.
        </p>
      )}

      <div className="flex gap-1">
        {days.map((d) => (
          <div
            key={d.date}
            title={d.date}
            className={`h-4 flex-1 rounded ${d.logged ? 'bg-accent' : 'bg-border'}`}
          />
        ))}
      </div>
    </Card>
  )
}
