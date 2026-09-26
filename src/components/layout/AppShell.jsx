import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import BottomTabBar from './BottomTabBar'
import { useAuth } from '../../context/AuthContext'

export default function AppShell() {
  const { signOut } = useAuth()

  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar onLogout={signOut} />
      <main className="flex-1 pb-20 md:pb-0">
        <div className="mx-auto max-w-3xl px-4 py-8">
          <Outlet />
        </div>
      </main>
      <BottomTabBar />
    </div>
  )
}
