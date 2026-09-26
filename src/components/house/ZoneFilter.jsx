import { ZONES } from '../../lib/choreUtils'

export default function ZoneFilter({ value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange(null)}
        className={`rounded-full px-3 py-1 text-xs font-medium ${
          value === null ? 'bg-accent text-white' : 'bg-surface-hover text-text-muted'
        }`}
      >
        All
      </button>
      {ZONES.map((zone) => (
        <button
          key={zone}
          onClick={() => onChange(zone)}
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            value === zone ? 'bg-accent text-white' : 'bg-surface-hover text-text-muted'
          }`}
        >
          {zone}
        </button>
      ))}
    </div>
  )
}
