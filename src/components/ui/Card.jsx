export default function Card({ className = '', children, ...props }) {
  return (
    <div
      className={`rounded-xl bg-surface p-5 shadow-lg shadow-black/20 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
