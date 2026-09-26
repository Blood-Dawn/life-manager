export default function Input({ label, className = '', id, ...props }) {
  const inputId = id || props.name

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm text-text-muted">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`rounded-xl border border-border bg-surface px-3 py-2 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent ${className}`}
        {...props}
      />
    </div>
  )
}

export function Select({ label, className = '', id, children, ...props }) {
  const selectId = id || props.name

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={selectId} className="text-sm text-text-muted">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`rounded-xl border border-border bg-surface px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent ${className}`}
        {...props}
      >
        {children}
      </select>
    </div>
  )
}
