import { NavLink } from 'react-router-dom'
import { navItems } from './navItems'

export default function BottomTabBar() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-10 flex border-t border-border bg-surface md:hidden">
      {navItems.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center gap-0.5 py-2.5 text-xs font-medium ${
              isActive ? 'text-accent' : 'text-text-muted'
            }`
          }
        >
          <Icon size={20} />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}
