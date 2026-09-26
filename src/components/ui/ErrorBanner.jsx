export default function ErrorBanner({ message, onRetry }) {
  if (!message) return null

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-expense/30 bg-expense/10 px-4 py-3 text-sm text-expense">
      <span>{message}</span>
      {onRetry && (
        <button onClick={onRetry} className="shrink-0 font-semibold underline">
          Try again
        </button>
      )}
    </div>
  )
}
