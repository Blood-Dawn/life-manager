import { Wallet } from 'lucide-react'
import EmptyState from '../components/ui/EmptyState'

export default function Finance() {
  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold">Finance</h1>
      <EmptyState
        icon={Wallet}
        title="No transactions yet"
        hint="Add your first income or expense to see your monthly summary."
      />
    </div>
  )
}
