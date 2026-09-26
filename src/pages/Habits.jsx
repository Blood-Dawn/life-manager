import { ListChecks } from 'lucide-react'
import EmptyState from '../components/ui/EmptyState'

export default function Habits() {
  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold">Habits</h1>
      <EmptyState
        icon={ListChecks}
        title="No habits yet"
        hint="Add a habit to start checking in daily and building a streak."
      />
    </div>
  )
}
