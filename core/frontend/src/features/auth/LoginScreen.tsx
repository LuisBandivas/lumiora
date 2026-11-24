import { useState, type FormEvent } from 'react'
import { BrandMark } from '../../components/layout/BrandMark'

export function LoginScreen({ mode = 'login' }: { mode?: 'login' | 'signup' }) {
  const [notice, setNotice] = useState('')
  const isSignup = mode === 'signup'

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setNotice(isSignup ? 'Account creation is a visual preview. Authentication is not connected yet.' : 'Sign in is a visual preview. Authentication is not connected yet.')
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

        <button type="button" onClick={() => setNotice('Google sign-in is not connected yet.')} className="flex min-h-12 w-full items-center justify-center gap-3 rounded-xl border border-line bg-white px-4 font-medium transition hover:bg-canvas">
          <span aria-hidden="true" className="grid size-5 place-items-center rounded border border-line text-xs font-semibold text-muted">G</span>
          {isSignup ? 'Continue with Google' : 'Continue with Google'}
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
          <button type="submit" className="min-h-12 w-full rounded-xl bg-accent px-4 font-medium text-accent-ink transition hover:opacity-90">{isSignup ? 'Create account' : 'Sign in'}</button>
        </form>

        {notice && <p role="status" className="mt-4 rounded-xl bg-canvas px-4 py-3 text-center text-sm text-muted">{notice}</p>}
        <p className="mt-6 text-center text-sm text-muted">{isSignup ? 'Already have an account?' : 'New here?'} <a href={isSignup ? '/login' : '/signup'} className="font-medium text-ink underline underline-offset-4">{isSignup ? 'Sign in' : 'Create an account'}</a></p>
        <p className="mt-6 text-center text-xs leading-5 text-muted">Your photos stay in this browser during creation.</p>
      </section>
    </main>
  )
}
