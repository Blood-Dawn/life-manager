const variants = {
  primary: 'bg-accent hover:bg-accent-hover text-white',
  ghost: 'bg-transparent hover:bg-surface-hover text-text',
  danger: 'bg-transparent hover:bg-expense/10 text-expense',
}

export default function Button({
  variant = 'primary',
  className = '',
  children,
  ...props
}) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
