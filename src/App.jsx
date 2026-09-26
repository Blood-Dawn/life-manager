import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AppShell from './components/layout/AppShell'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Finance from './pages/Finance'
import Habits from './pages/Habits'
import House from './pages/House'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<AppShell />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/finance" element={<Finance />} />
          <Route path="/habits" element={<Habits />} />
          <Route path="/house" element={<House />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
