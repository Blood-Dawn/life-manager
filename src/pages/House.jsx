import { Home } from 'lucide-react'
import EmptyState from '../components/ui/EmptyState'

export default function House() {
  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold">House</h1>
      <EmptyState
        icon={Home}
        title="No chores yet"
        hint="Add a chore with a due date to keep the house running."
      />
    </div>
  )
}
