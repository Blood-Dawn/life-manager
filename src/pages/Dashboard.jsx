import { LayoutDashboard } from 'lucide-react'
import EmptyState from '../components/ui/EmptyState'

export default function Dashboard() {
  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold">Dashboard</h1>
      <EmptyState
        icon={LayoutDashboard}
        title="Your overview is coming soon"
        hint="This month's balance, today's habits, and next due chores will show up here."
      />
    </div>
  )
}
