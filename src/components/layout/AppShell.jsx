import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import BottomTabBar from './BottomTabBar'

export default function AppShell({ onLogout }) {
  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar onLogout={onLogout} />
      <main className="flex-1 pb-20 md:pb-0">
        <div className="mx-auto max-w-3xl px-4 py-8">
          <Outlet />
        </div>
      </main>
      <BottomTabBar />
    </div>
  )
}
