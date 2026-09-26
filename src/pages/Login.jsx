import { Link } from 'react-router-dom'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

export default function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <h1 className="mb-1 text-lg font-semibold">Welcome back</h1>
        <p className="mb-6 text-sm text-text-muted">Log in to Life Manager</p>
        <form className="flex flex-col gap-4">
          <Input label="Email" type="email" name="email" placeholder="you@example.com" />
          <Input label="Password" type="password" name="password" placeholder="••••••••" />
          <Button type="submit" className="mt-2 w-full">
            Log in
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-text-muted">
          No account?{' '}
          <Link to="/signup" className="text-accent hover:text-accent-hover">
            Sign up
          </Link>
        </p>
      </Card>
    </div>
  )
}
