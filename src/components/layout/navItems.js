import { LayoutDashboard, Wallet, ListChecks, Home } from 'lucide-react'

export const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/finance', label: 'Finance', icon: Wallet },
  { to: '/habits', label: 'Habits', icon: ListChecks },
  { to: '/house', label: 'House', icon: Home },
]
