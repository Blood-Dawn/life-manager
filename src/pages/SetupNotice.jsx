import Card from '../components/ui/Card'

export default function SetupNotice() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <h1 className="mb-2 text-lg font-semibold">Supabase isn't configured yet</h1>
        <p className="text-sm text-text-muted">
          Copy <code className="rounded bg-surface-hover px-1">.env.example</code> to{' '}
          <code className="rounded bg-surface-hover px-1">.env</code>, fill in your Supabase project URL and anon
          key, then restart the dev server.
        </p>
      </Card>
    </div>
  )
}
