import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthShell from '../components/AuthShell'
import ThemeToggle from '../components/ThemeToggle'
import { useAuth } from '../context/useAuth'

export default function SignupPage({ theme, onToggleTheme }) {
  const navigate = useNavigate()
  const { signup, isLoading } = useAuth()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  function updateField(field, value) {
    setForm((currentForm) => ({ ...currentForm, [field]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    try {
      await signup(form)
      navigate('/dashboard', { replace: true })
    } catch (submitError) {
      setError(submitError.message)
    }
  }

  return (
    <AuthShell>
      <div className="w-full max-w-[440px] rounded-3xl bg-zinc-200/95 p-8 shadow-none dark:bg-[#141414] sm:p-10">
        <div className="mb-10 flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1" />
          <div className="flex shrink-0 items-center gap-3">
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
            <Link
              to="/login"
              className="whitespace-nowrap text-sm font-medium text-zinc-700 underline-offset-4 hover:underline dark:text-white/90"
            >
              Already have an account
            </Link>
          </div>
        </div>

        <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 dark:text-white sm:text-[2.75rem] sm:leading-none">
          Sign up
        </h1>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          Create your TrackPoint workspace and jump straight into the dashboard.
        </p>

        <form className="mt-10" onSubmit={handleSubmit} noValidate>
          <div className="space-y-7">
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-xs font-medium uppercase tracking-wider text-zinc-600 dark:text-zinc-400"
              >
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                value={form.name}
                onChange={(event) => updateField('name', event.target.value)}
                placeholder="Alex Trainer"
                className="w-full border-0 border-b border-zinc-400 bg-transparent py-2 text-base text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-900 dark:border-white/35 dark:text-white dark:placeholder:text-zinc-500 dark:focus:border-white"
                required
              />
            </div>

            <div>
              <label
                htmlFor="signup-email"
                className="mb-2 block text-xs font-medium uppercase tracking-wider text-zinc-600 dark:text-zinc-400"
              >
                Email
              </label>
              <input
                id="signup-email"
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={(event) => updateField('email', event.target.value)}
                placeholder="you@trackpoint.app"
                className="w-full border-0 border-b border-zinc-400 bg-transparent py-2 text-base text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-900 dark:border-white/35 dark:text-white dark:placeholder:text-zinc-500 dark:focus:border-white"
                required
              />
            </div>

            <div>
              <label
                htmlFor="signup-password"
                className="mb-2 block text-xs font-medium uppercase tracking-wider text-zinc-600 dark:text-zinc-400"
              >
                Password
              </label>
              <div className="flex items-center gap-2 border-b border-zinc-400 transition focus-within:border-zinc-900 dark:border-white/35 dark:focus-within:border-white">
                <input
                  id="signup-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={form.password}
                  onChange={(event) => updateField('password', event.target.value)}
                  placeholder="Minimum 8 characters"
                  className="min-w-0 flex-1 border-0 bg-transparent py-2 text-base text-zinc-900 outline-none dark:text-white"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((currentValue) => !currentValue)}
                  className="shrink-0 rounded p-1 text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    aria-hidden
                  >
                    {showPassword ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178ZM15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                    )}
                  </svg>
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="password-confirm"
                className="mb-2 block text-xs font-medium uppercase tracking-wider text-zinc-600 dark:text-zinc-400"
              >
                Confirm password
              </label>
              <input
                id="password-confirm"
                name="passwordConfirm"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={form.passwordConfirm}
                onChange={(event) =>
                  updateField('passwordConfirm', event.target.value)
                }
                placeholder="Repeat your password"
                className="w-full border-0 border-b border-zinc-400 bg-transparent py-2 text-base text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-900 dark:border-white/35 dark:text-white dark:placeholder:text-zinc-500 dark:focus:border-white"
                required
              />
            </div>
          </div>

          {error ? (
            <p className="mt-6 rounded-2xl border border-rose-500/25 bg-rose-500/10 px-4 py-3 text-sm text-rose-700 dark:text-rose-200">
              {error}
            </p>
          ) : null}

          <div className="mt-12 flex items-center justify-between gap-4">
            <Link
              to="/"
              className="text-sm font-medium text-zinc-700 underline-offset-4 hover:underline dark:text-zinc-300"
            >
              Back
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex min-w-28 items-center justify-center rounded-xl bg-zinc-900 px-5 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-zinc-800 disabled:cursor-wait disabled:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zinc-900 dark:bg-white dark:text-black dark:hover:bg-zinc-100 dark:focus-visible:outline-white"
            >
              {isLoading ? 'Creating' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </AuthShell>
  )
}
