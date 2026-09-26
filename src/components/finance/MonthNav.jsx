import { ChevronLeft, ChevronRight } from 'lucide-react'
import { monthLabel } from '../../lib/dateUtils'

export default function MonthNav({ month, onPrev, onNext }) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onPrev}
        className="rounded-lg p-1.5 text-text-muted hover:bg-surface-hover hover:text-text"
        aria-label="Previous month"
      >
        <ChevronLeft size={18} />
      </button>
      <span className="min-w-32 text-center text-sm font-medium">{monthLabel(month)}</span>
      <button
        onClick={onNext}
        className="rounded-lg p-1.5 text-text-muted hover:bg-surface-hover hover:text-text"
        aria-label="Next month"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  )
}
