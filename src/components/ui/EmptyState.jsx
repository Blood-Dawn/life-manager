export default function EmptyState({ icon: Icon, title, hint }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border py-14 text-center">
      {Icon && <Icon size={28} className="text-text-muted" />}
      <p className="font-semibold text-text">{title}</p>
      {hint && <p className="max-w-xs text-sm text-text-muted">{hint}</p>}
    </div>
  )
}
