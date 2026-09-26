import { Link } from 'react-router-dom'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

export default function Signup() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <h1 className="mb-1 text-lg font-semibold">Create your account</h1>
        <p className="mb-6 text-sm text-text-muted">Start managing your life in one place</p>
        <form className="flex flex-col gap-4">
          <Input label="Email" type="email" name="email" placeholder="you@example.com" />
          <Input label="Password" type="password" name="password" placeholder="••••••••" />
          <Button type="submit" className="mt-2 w-full">
            Sign up
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-text-muted">
          Already have an account?{' '}
          <Link to="/login" className="text-accent hover:text-accent-hover">
            Log in
          </Link>
        </p>
      </Card>
    </div>
  )
}
