import { useState } from 'react'
import ThemeToggle from './ThemeToggle'

export default function LoginPanel({ theme, onToggleTheme }) {
  const [email, setEmail] = useState('mark.johnson@gmail.com')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(true)

  function handleSubmit(e) {
    e.preventDefault()
  }

  return (
    <div className="flex min-h-[58vh] flex-col bg-zinc-100 lg:min-h-svh dark:bg-black">
      <div className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8 lg:px-12 lg:py-12">
        <div className="w-full max-w-[420px] rounded-3xl bg-zinc-200/95 p-8 shadow-none dark:bg-[#141414] dark:shadow-none sm:p-10">
          <div className="mb-10 flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1" />
            <div className="flex shrink-0 items-center gap-3">
              <ThemeToggle theme={theme} onToggle={onToggleTheme} />
              <a
                href="#signup"
                className="whitespace-nowrap text-sm font-medium text-zinc-700 underline-offset-4 hover:underline dark:text-white/90"
              >
                Create an account
              </a>
            </div>
          </div>

          <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 dark:text-white sm:text-[2.75rem] sm:leading-none">
            Login
          </h1>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            Manage your clients efficiently.
          </p>

          <form className="mt-10" onSubmit={handleSubmit} noValidate>
            <div className="space-y-8">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-xs font-medium uppercase tracking-wider text-zinc-600 dark:text-zinc-400"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border-0 border-b border-zinc-400 bg-transparent py-2 text-base text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-900 dark:border-white/35 dark:text-white dark:placeholder:text-zinc-500 dark:focus:border-white"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-xs font-medium uppercase tracking-wider text-zinc-600 dark:text-zinc-400"
                >
                  Password
                </label>
                <div className="flex items-center gap-2 border-b border-zinc-400 transition focus-within:border-zinc-900 dark:border-white/35 dark:focus-within:border-white">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="min-w-0 flex-1 border-0 bg-transparent py-2 text-base text-zinc-900 outline-none dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
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
                          d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                        />
                      )}
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between gap-4 text-sm">
              <label className="flex cursor-pointer items-center gap-2 text-zinc-700 dark:text-zinc-300">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded border-zinc-400 bg-transparent text-zinc-900 focus:ring-0 focus:ring-offset-0 dark:border-white/40 dark:text-white"
                />
                Remember me
              </label>
              <a
                href="#forgot"
                className="font-medium text-zinc-700 underline-offset-4 hover:underline dark:text-white/90"
              >
                Forgot?
              </a>
            </div>

            <div className="mt-12 flex justify-end">
              <button
                type="submit"
                className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-center text-[11px] font-semibold uppercase leading-tight tracking-wide text-white shadow-none transition hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zinc-900 dark:bg-white dark:text-black dark:hover:bg-zinc-100 dark:focus-visible:outline-white"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
