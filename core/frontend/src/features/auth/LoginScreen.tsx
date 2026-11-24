import { useEffect, useState, type FormEvent } from 'react'
import { BrandMark } from '../../components/layout/BrandMark'
import { useAuth } from './authContext'

export function LoginScreen({ mode = 'login' }: { mode?: 'login' | 'signup' }) {
  const [notice, setNotice] = useState(() => {
    const params = new URLSearchParams(window.location.search)
    const authError = params.get('error_description') ?? params.get('error')
    if (authError) window.history.replaceState({}, document.title, window.location.pathname)
    return authError ?? ''
  })
  const [busy, setBusy] = useState(false)
  const isSignup = mode === 'signup'
  const { user, loading, configured, signInWithGoogle, signInWithPassword, signUp } = useAuth()

  useEffect(() => {
    if (user) window.location.replace('/')
  }, [user])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setNotice('')
    setBusy(true)
    const fields = new FormData(event.currentTarget)
    const email = String(fields.get('email') ?? '').trim()
    const password = String(fields.get('password') ?? '')

    try {
      if (isSignup) {
        const hasSession = await signUp({
          email,
          password,
          firstName: String(fields.get('firstName') ?? '').trim(),
          lastName: String(fields.get('lastName') ?? '').trim(),
          username: String(fields.get('username') ?? '').trim(),
        })
        if (hasSession) window.location.assign('/')
        else setNotice('Check your email for a confirmation link to finish creating your account.')
      } else {
        await signInWithPassword(email, password)
        window.location.assign('/')
      }
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Authentication failed. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  async function continueWithGoogle() {
    setNotice('')
    setBusy(true)
    try {
      await signInWithGoogle()
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Google sign-in failed. Please try again.')
      setBusy(false)
    }
  }

  return (
    <main id="main-content" className="flex flex-1 items-center justify-center px-4 py-12 sm:py-20">
      <section aria-labelledby="login-title" className="w-full max-w-md rounded-3xl border border-line bg-surface/90 p-6 shadow-[0_18px_60px_rgba(88,70,49,0.08)] sm:p-10">
        <div className="mb-8 flex flex-col items-center text-center">
          <BrandMark />
          <p className="mt-4 text-xs font-medium uppercase tracking-[0.22em] text-muted">Moments, kept close</p>
          <h1 id="login-title" className="mt-3 text-4xl">{isSignup ? 'Create your account' : 'Welcome back'}</h1>
          <p className="mt-2 text-sm leading-6 text-muted">{isSignup ? 'Create an account to get started.' : 'Sign in to continue to your photo album.'}</p>
        </div>

        <button type="button" disabled={!configured || loading || busy} onClick={() => void continueWithGoogle()} className="flex min-h-12 w-full items-center justify-center gap-3 rounded-xl border border-line bg-white px-4 font-medium transition hover:bg-canvas disabled:cursor-not-allowed disabled:opacity-50">
          <span aria-hidden="true" className="grid size-5 place-items-center rounded border border-line text-xs font-semibold text-muted">G</span>
          Continue with Google
        </button>

        <div className="my-6 flex items-center gap-3 text-xs text-muted"><span className="h-px flex-1 bg-line" />or use email<span className="h-px flex-1 bg-line" /></div>

        <form onSubmit={submit} className="space-y-4">
          {isSignup && <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium" htmlFor="first-name">First Name
              <input id="first-name" name="firstName" type="text" autoComplete="given-name" required className="mt-2 min-h-12 w-full rounded-xl border border-line bg-white px-4 font-normal" />
            </label>
            <label className="block text-sm font-medium" htmlFor="last-name">Last Name
              <input id="last-name" name="lastName" type="text" autoComplete="family-name" required className="mt-2 min-h-12 w-full rounded-xl border border-line bg-white px-4 font-normal" />
            </label>
          </div>}
          {isSignup && <label className="block text-sm font-medium" htmlFor="username">Username
            <input id="username" name="username" type="text" autoComplete="username" required className="mt-2 min-h-12 w-full rounded-xl border border-line bg-white px-4 font-normal" />
          </label>}
          <label className="block text-sm font-medium" htmlFor="email">Email address
            <input id="email" name="email" type="email" autoComplete="email" required placeholder="you@example.com" className="mt-2 min-h-12 w-full rounded-xl border border-line bg-white px-4 font-normal placeholder:text-muted/70" />
          </label>
          <label className="block text-sm font-medium" htmlFor="password">Password
            <input id="password" name="password" type="password" autoComplete={isSignup ? 'new-password' : 'current-password'} minLength={isSignup ? 8 : undefined} required placeholder={isSignup ? 'Create a password (8+ characters)' : 'Enter your password'} className="mt-2 min-h-12 w-full rounded-xl border border-line bg-white px-4 font-normal placeholder:text-muted/70" />
          </label>
          <button type="submit" disabled={!configured || loading || busy} className="min-h-12 w-full rounded-xl bg-accent px-4 font-medium text-accent-ink transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50">{busy ? 'Please wait...' : isSignup ? 'Create account' : 'Sign in'}</button>
        </form>

        {!configured && <p role="status" className="mt-4 rounded-xl bg-canvas px-4 py-3 text-center text-sm text-muted">Authentication needs VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in core/frontend/.env.local. Restart the frontend after adding them.</p>}
        {notice && <p role="status" className="mt-4 rounded-xl bg-canvas px-4 py-3 text-center text-sm text-muted">{notice}</p>}
        <p className="mt-6 text-center text-sm text-muted">{isSignup ? 'Already have an account?' : 'New here?'} <a href={isSignup ? '/login' : '/signup'} className="font-medium text-ink underline underline-offset-4">{isSignup ? 'Sign in' : 'Create an account'}</a></p>
        <p className="mt-6 text-center text-xs leading-5 text-muted">Your photos stay in this browser during creation.</p>
      </section>
    </main>
  )
}
