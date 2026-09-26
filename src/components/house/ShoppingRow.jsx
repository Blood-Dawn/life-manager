import { Pencil, Trash2 } from 'lucide-react'

export default function ShoppingRow({ item, onTogglePurchased, onEdit, onDelete }) {
  return (
    <li className="flex items-center justify-between gap-3 bg-surface px-4 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <input
          type="checkbox"
          checked={item.is_purchased}
          onChange={(e) => onTogglePurchased(e.target.checked)}
          className="h-4 w-4 accent-accent"
        />
        <p className={`truncate text-sm font-medium ${item.is_purchased ? 'text-text-muted line-through' : ''}`}>
          {item.item_name}
          {item.quantity && <span className="text-text-muted"> · {item.quantity}</span>}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <button
          onClick={() => onEdit(item)}
          className="rounded-lg p-1.5 text-text-muted hover:bg-surface-hover hover:text-text"
          aria-label="Edit item"
        >
          <Pencil size={16} />
        </button>
        <button
          onClick={() => window.confirm(`Delete "${item.item_name}"?`) && onDelete(item)}
          className="rounded-lg p-1.5 text-text-muted hover:bg-expense/10 hover:text-expense"
          aria-label="Delete item"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </li>
  )
}
