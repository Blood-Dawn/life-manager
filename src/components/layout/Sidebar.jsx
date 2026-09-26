import { NavLink } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { navItems } from './navItems'

export default function Sidebar({ onLogout }) {
  return (
    <aside className="hidden w-56 shrink-0 flex-col gap-1 border-r border-border bg-surface px-3 py-6 md:flex">
      <p className="mb-6 px-3 text-lg font-semibold">Life Manager</p>
      {navItems.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium ${
              isActive
                ? 'bg-accent text-white'
                : 'text-text-muted hover:bg-surface-hover hover:text-text'
            }`
          }
        >
          <Icon size={18} />
          {label}
        </NavLink>
      ))}
      <button
        onClick={onLogout}
        className="mt-auto flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-text-muted hover:bg-surface-hover hover:text-text"
      >
        <LogOut size={18} />
        Logout
      </button>
    </aside>
  )
}
