import { Link } from 'react-router-dom'
import ThemeToggle from '../components/ThemeToggle'
import { useAuth } from '../context/useAuth'

const navItems = [
  'Overview',
  'Revenue',
  'Clients',
  'Bookings',
  'Packages',
]

const metricCards = [
  {
    label: 'Net revenue',
    value: '$31,310',
    change: '+10.4% vs last month',
  },
  {
    label: 'Active clients',
    value: '186',
    change: '+24 new this month',
  },
  {
    label: 'Session utilization',
    value: '71%',
    change: 'Goal 80%',
  },
  {
    label: 'Open renewals',
    value: '18',
    change: '6 expiring this week',
  },
]

const clientRows = [
  ['Danny Liu', '1,023', '$37,431'],
  ['Bella Deviant', '983', '$30,423'],
  ['Darrell Steward', '843', '$28,549'],
  ['Ariana Fox', '744', '$22,190'],
]

const notifications = [
  '56 new users registered.',
  '132 orders placed.',
  'Funds have been withdrawn.',
  '5 unread messages.',
]

const activities = [
  'Changed the style.',
  '117 new products added.',
  '11 products archived.',
  'Page “Toys” removed.',
]

const managers = ['Natalie Donovan', 'Daniel Craig', 'Kate Morton', 'Felicia Raspet']

function Panel({ children, className = '' }) {
  return (
    <section
      className={`rounded-[1.35rem] border border-zinc-200 bg-white p-5 text-zinc-900 shadow-[0_10px_30px_rgba(0,0,0,0.06)] dark:border-white/10 dark:bg-[#17181b] dark:text-white dark:shadow-[0_10px_40px_rgba(0,0,0,0.18)] ${className}`}
    >
      {children}
    </section>
  )
}

function RevenueDonut() {
  return (
    <div className="relative h-44 w-44">
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
        <circle
          cx="60"
          cy="60"
          r="40"
          fill="none"
          stroke="rgba(113,113,122,0.25)"
          strokeWidth="14"
          className="dark:[stroke:rgba(255,255,255,0.08)]"
        />
        <circle
          cx="60"
          cy="60"
          r="40"
          fill="none"
          stroke="#c5ff47"
          strokeDasharray="188 251"
          strokeLinecap="round"
          strokeWidth="14"
        />
        <circle
          cx="60"
          cy="60"
          r="40"
          fill="none"
          stroke="#7dcc23"
          strokeDasharray="42 251"
          strokeDashoffset="-194"
          strokeLinecap="round"
          strokeWidth="14"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-3xl font-semibold">102k</span>
        <span className="text-xs uppercase tracking-[0.24em] text-zinc-400">
          Weekly visits
        </span>
      </div>
    </div>
  )
}

function RevenueChart() {
  return (
    <svg viewBox="0 0 320 150" className="h-36 w-full">
      <defs>
        <linearGradient id="revenue-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#34d27a" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#34d27a" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M0 130 L30 118 L60 120 L90 100 L120 102 L150 78 L180 92 L210 72 L240 88 L270 52 L300 60 L320 34"
        fill="none"
        stroke="rgba(113,113,122,0.35)"
        strokeWidth="1"
        className="dark:[stroke:rgba(255,255,255,0.15)]"
      />
      <path
        d="M0 130 L30 118 L60 120 L90 100 L120 102 L150 78 L180 92 L210 72 L240 88 L270 52 L300 60 L320 34 L320 150 L0 150 Z"
        fill="url(#revenue-fill)"
      />
      <path
        d="M0 130 L30 118 L60 120 L90 100 L120 102 L150 78 L180 92 L210 72 L240 88 L270 52 L300 60 L320 34"
        fill="none"
        stroke="#3ef08f"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function DashboardPage({ theme, onToggleTheme }) {
  const { user, logout } = useAuth()
  const displayName = user?.name || user?.email || 'TrackPoint User'

  return (
    <div className="min-h-svh bg-zinc-100 p-4 text-zinc-900 dark:bg-black dark:text-white sm:p-6 lg:p-10">
      <div className="mx-auto max-w-[1480px] rounded-[1.75rem] border border-zinc-200 bg-zinc-50 p-3 shadow-[0_20px_80px_rgba(0,0,0,0.12)] dark:border-white/10 dark:bg-[#111214] dark:shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
        <div className="grid gap-3 lg:grid-cols-[240px_minmax(0,1fr)_280px]">
          <aside className="rounded-[1.35rem] border border-zinc-200 bg-white px-4 py-5 dark:border-white/10 dark:bg-[#121317]">
            <div className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-3 dark:border-white/10 dark:bg-white/5">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-xs font-bold text-white dark:bg-lime-300 dark:text-black">
                {displayName.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-zinc-900 dark:text-white">
                  {displayName}
                </p>
                <p className="truncate text-xs text-zinc-500 dark:text-zinc-500">
                  Gym owner dashboard
                </p>
              </div>
            </div>

            <div className="mt-6">
              <p className="mb-3 px-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-zinc-500">
                Dashboards
              </p>
              <nav className="space-y-1.5">
                {navItems.map((item, index) => (
                  <button
                    key={item}
                    type="button"
                    className={`flex w-full items-center rounded-xl px-3 py-2.5 text-left text-sm transition ${
                      index === 0
                        ? 'bg-zinc-900 font-semibold text-white dark:bg-lime-300 dark:text-black'
                        : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-white'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </nav>
            </div>

            <div className="mt-8 rounded-3xl border border-zinc-200 bg-zinc-100 p-4 dark:border-lime-300/20 dark:bg-[linear-gradient(180deg,#1f2d17,#161816)]">
              <p className="text-xs uppercase tracking-[0.24em] text-zinc-600 dark:text-lime-300/70">
                Premium plan
              </p>
              <div className="mt-4 flex items-end gap-2">
                <span className="text-4xl font-semibold">$30</span>
                <span className="pb-1 text-sm text-zinc-500 dark:text-zinc-400">/ per month</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                Improve your workplace and analyze your profits and losses.
              </p>
              <button
                type="button"
                className="mt-5 w-full rounded-full bg-zinc-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 dark:bg-lime-300 dark:text-black dark:hover:bg-lime-200"
              >
                Get started
              </button>
            </div>
          </aside>

          <main className="rounded-[1.35rem] border border-zinc-200 bg-white p-3 dark:border-white/10 dark:bg-[#111214]">
            <div className="rounded-[1.35rem] border border-zinc-200 bg-zinc-50 p-5 dark:border-white/10 dark:bg-[#121317]">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">
                    Dashboards / Overview
                  </p>
                  <h1 className="mt-4 text-2xl font-semibold text-zinc-900 dark:text-white">
                    Overview
                  </h1>
                </div>
                <div className="flex items-center gap-3">
                  <ThemeToggle theme={theme} onToggle={onToggleTheme} />
                  <button
                    type="button"
                    onClick={logout}
                    className="rounded-full border border-zinc-300 px-4 py-2 text-sm text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-900 dark:border-white/15 dark:text-zinc-300 dark:hover:bg-white/5 dark:hover:text-white"
                  >
                    Log out
                  </button>
                </div>
              </div>

              <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                {metricCards.map((card) => (
                  <Panel key={card.label} className="bg-white p-4 dark:bg-[#17191d]">
                    <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
                      {card.label}
                    </p>
                    <p className="mt-3 text-3xl font-semibold">{card.value}</p>
                    <p className="mt-2 text-sm text-emerald-600 dark:text-lime-300">{card.change}</p>
                  </Panel>
                ))}
              </div>

              <div className="mt-3 grid gap-3 xl:grid-cols-[1.35fr_0.95fr]">
                <Panel>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-semibold">Sales overview</h2>
                      <p className="mt-1 text-sm text-zinc-500">
                        Weekly client engagement and product sales
                      </p>
                    </div>
                    <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs uppercase tracking-[0.24em] text-zinc-500 dark:bg-white/5 dark:text-zinc-400">
                      This week
                    </span>
                  </div>

                  <div className="mt-6 grid items-center gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
                    <RevenueDonut />
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl bg-zinc-100 p-4 dark:bg-white/4">
                        <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
                          Number of sales
                        </p>
                        <p className="mt-3 text-2xl font-semibold">$71,020</p>
                      </div>
                      <div className="rounded-2xl bg-zinc-100 p-4 dark:bg-white/4">
                        <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
                          Furniture
                        </p>
                        <p className="mt-3 text-2xl font-semibold">$11,420</p>
                      </div>
                      <div className="rounded-2xl bg-zinc-100 p-4 dark:bg-white/4">
                        <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
                          Electronic
                        </p>
                        <p className="mt-3 text-2xl font-semibold">$55,640</p>
                      </div>
                      <div className="rounded-2xl bg-zinc-100 p-4 dark:bg-white/4">
                        <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
                          Shoes
                        </p>
                        <p className="mt-3 text-2xl font-semibold">$2,120</p>
                      </div>
                    </div>
                  </div>
                </Panel>

                <div className="grid gap-3">
                  <Panel className="bg-zinc-100 dark:bg-[#18231d]">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
                          New customers
                        </p>
                        <p className="mt-3 text-3xl font-semibold">862</p>
                      </div>
                      <div className="rounded-full bg-zinc-900 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white dark:bg-lime-300 dark:text-black">
                        +19%
                      </div>
                    </div>
                  </Panel>

                  <Panel>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
                          Total profit
                        </p>
                        <p className="mt-3 text-3xl font-semibold">$136,756</p>
                      </div>
                      <span className="text-sm text-emerald-600 dark:text-lime-300">+12.4%</span>
                    </div>
                    <div className="mt-4">
                      <RevenueChart />
                    </div>
                  </Panel>
                </div>
              </div>

              <div className="mt-3">
                <Panel>
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold">Customer list</h2>
                      <p className="mt-1 text-sm text-zinc-500">
                        Top clients by spend and engagement
                      </p>
                    </div>
                    <button
                      type="button"
                      className="rounded-full border border-zinc-300 px-3 py-1.5 text-xs uppercase tracking-[0.24em] text-zinc-500 transition hover:bg-zinc-100 dark:border-white/10 dark:text-zinc-400 dark:hover:bg-white/5"
                    >
                      Export
                    </button>
                  </div>

                  <div className="mt-5 overflow-hidden rounded-2xl border border-zinc-200 dark:border-white/8">
                    <table className="min-w-full divide-y divide-zinc-200 text-left dark:divide-white/8">
                      <thead className="bg-zinc-100 text-xs uppercase tracking-[0.22em] text-zinc-500 dark:bg-white/4">
                        <tr>
                          <th className="px-4 py-3 font-medium">Name</th>
                          <th className="px-4 py-3 font-medium">Sales</th>
                          <th className="px-4 py-3 font-medium">Total deal value</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-200 text-sm text-zinc-700 dark:divide-white/6 dark:text-zinc-300">
                        {clientRows.map(([name, sales, total]) => (
                          <tr key={name} className="bg-white dark:bg-white/[0.02]">
                            <td className="px-4 py-3">{name}</td>
                            <td className="px-4 py-3">{sales}</td>
                            <td className="px-4 py-3">{total}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Panel>
              </div>
            </div>
          </main>

          <aside className="grid gap-3">
            <Panel>
              <h2 className="text-lg font-semibold">Notifications</h2>
              <div className="mt-5 space-y-4">
                {notifications.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 border-b border-zinc-200 pb-4 last:border-b-0 last:pb-0 dark:border-white/6"
                  >
                    <div className="mt-1 h-2.5 w-2.5 rounded-full bg-zinc-900 dark:bg-lime-300" />
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">{item}</p>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel>
              <h2 className="text-lg font-semibold">Activities</h2>
              <div className="mt-5 space-y-4">
                {activities.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 border-b border-zinc-200 pb-4 last:border-b-0 last:pb-0 dark:border-white/6"
                  >
                    <div className="mt-1 h-8 w-8 rounded-full bg-zinc-100 dark:bg-white/5" />
                    <div>
                      <p className="text-sm text-zinc-800 dark:text-zinc-300">{item}</p>
                      <p className="mt-1 text-xs text-zinc-500">Just now</p>
                    </div>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel>
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold">Managers</h2>
                <Link
                  to="/dashboard"
                  className="text-xs uppercase tracking-[0.24em] text-zinc-700 dark:text-lime-300"
                >
                  View all
                </Link>
              </div>
              <div className="mt-5 space-y-3">
                {managers.map((manager, index) => (
                  <div
                    key={manager}
                    className={`flex items-center justify-between rounded-2xl px-3 py-3 ${
                      index === 0
                        ? 'bg-zinc-900 text-white dark:bg-lime-300 dark:text-black'
                        : 'bg-zinc-100 dark:bg-white/4'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold ${
                          index === 0
                            ? 'bg-white/15 text-white dark:bg-black/10 dark:text-black'
                            : 'bg-zinc-300 text-zinc-800 dark:bg-white/6 dark:text-white'
                        }`}
                      >
                        {manager
                          .split(' ')
                          .map((part) => part[0])
                          .join('')}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{manager}</p>
                        <p
                          className={`text-xs ${
                            index === 0
                              ? 'text-zinc-200 dark:text-black/70'
                              : 'text-zinc-500'
                          }`}
                        >
                          Team lead
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        index === 0
                          ? 'bg-white text-zinc-900 dark:bg-black dark:text-white'
                          : 'border border-zinc-300 text-zinc-600 dark:border-white/10 dark:text-zinc-400'
                      }`}
                    >
                      Message
                    </button>
                  </div>
                ))}
              </div>
            </Panel>
          </aside>
        </div>
      </div>
    </div>
  )
}
