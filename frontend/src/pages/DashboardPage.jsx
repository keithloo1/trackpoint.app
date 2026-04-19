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
      className={`rounded-[1.35rem] border border-white/8 bg-[#17181b] p-5 text-white shadow-[0_10px_40px_rgba(0,0,0,0.18)] ${className}`}
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
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="14"
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
        stroke="rgba(255,255,255,0.15)"
        strokeWidth="1"
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
    <div className="min-h-svh bg-[radial-gradient(circle_at_top,#17d86f_0%,#16c266_18%,#121314_56%)] p-4 text-white sm:p-6 lg:p-10">
      <div className="mx-auto max-w-[1480px] rounded-[1.75rem] border border-white/10 bg-[#111214] p-3 shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
        <div className="grid gap-3 lg:grid-cols-[240px_minmax(0,1fr)_280px]">
          <aside className="rounded-[1.35rem] border border-white/8 bg-[#121317] px-4 py-5">
            <div className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/5 px-3 py-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-lime-300 text-xs font-bold text-black">
                {displayName.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white">
                  {displayName}
                </p>
                <p className="truncate text-xs text-zinc-500">
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
                        ? 'bg-lime-300 font-semibold text-black'
                        : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </nav>
            </div>

            <div className="mt-8 rounded-3xl border border-lime-300/20 bg-[linear-gradient(180deg,#1f2d17,#161816)] p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-lime-300/70">
                Premium plan
              </p>
              <div className="mt-4 flex items-end gap-2">
                <span className="text-4xl font-semibold">$30</span>
                <span className="pb-1 text-sm text-zinc-400">/ per month</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                Improve your workplace and analyze your profits and losses.
              </p>
              <button
                type="button"
                className="mt-5 w-full rounded-full bg-lime-300 px-4 py-3 text-sm font-semibold text-black transition hover:bg-lime-200"
              >
                Get started
              </button>
            </div>
          </aside>

          <main className="rounded-[1.35rem] border border-white/8 bg-[#111214] p-3">
            <div className="rounded-[1.35rem] border border-white/8 bg-[#121317] p-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">
                    Dashboards / Overview
                  </p>
                  <h1 className="mt-4 text-2xl font-semibold text-white">
                    Overview
                  </h1>
                </div>
                <div className="flex items-center gap-3">
                  <ThemeToggle theme={theme} onToggle={onToggleTheme} />
                  <button
                    type="button"
                    onClick={logout}
                    className="rounded-full border border-white/12 px-4 py-2 text-sm text-zinc-300 transition hover:bg-white/5 hover:text-white"
                  >
                    Log out
                  </button>
                </div>
              </div>

              <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                {metricCards.map((card) => (
                  <Panel key={card.label} className="bg-[#17191d] p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
                      {card.label}
                    </p>
                    <p className="mt-3 text-3xl font-semibold">{card.value}</p>
                    <p className="mt-2 text-sm text-lime-300">{card.change}</p>
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
                    <span className="rounded-full bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.24em] text-zinc-400">
                      This week
                    </span>
                  </div>

                  <div className="mt-6 grid items-center gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
                    <RevenueDonut />
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl bg-white/4 p-4">
                        <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
                          Number of sales
                        </p>
                        <p className="mt-3 text-2xl font-semibold">$71,020</p>
                      </div>
                      <div className="rounded-2xl bg-white/4 p-4">
                        <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
                          Furniture
                        </p>
                        <p className="mt-3 text-2xl font-semibold">$11,420</p>
                      </div>
                      <div className="rounded-2xl bg-white/4 p-4">
                        <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
                          Electronic
                        </p>
                        <p className="mt-3 text-2xl font-semibold">$55,640</p>
                      </div>
                      <div className="rounded-2xl bg-white/4 p-4">
                        <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
                          Shoes
                        </p>
                        <p className="mt-3 text-2xl font-semibold">$2,120</p>
                      </div>
                    </div>
                  </div>
                </Panel>

                <div className="grid gap-3">
                  <Panel className="bg-[#18231d]">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
                          New customers
                        </p>
                        <p className="mt-3 text-3xl font-semibold">862</p>
                      </div>
                      <div className="rounded-full bg-lime-300 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-black">
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
                      <span className="text-sm text-lime-300">+12.4%</span>
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
                      className="rounded-full border border-white/10 px-3 py-1.5 text-xs uppercase tracking-[0.24em] text-zinc-400 transition hover:bg-white/5"
                    >
                      Export
                    </button>
                  </div>

                  <div className="mt-5 overflow-hidden rounded-2xl border border-white/8">
                    <table className="min-w-full divide-y divide-white/8 text-left">
                      <thead className="bg-white/4 text-xs uppercase tracking-[0.22em] text-zinc-500">
                        <tr>
                          <th className="px-4 py-3 font-medium">Name</th>
                          <th className="px-4 py-3 font-medium">Sales</th>
                          <th className="px-4 py-3 font-medium">Total deal value</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/6 text-sm text-zinc-300">
                        {clientRows.map(([name, sales, total]) => (
                          <tr key={name} className="bg-white/[0.02]">
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
                    className="flex items-start gap-3 border-b border-white/6 pb-4 last:border-b-0 last:pb-0"
                  >
                    <div className="mt-1 h-2.5 w-2.5 rounded-full bg-lime-300" />
                    <p className="text-sm text-zinc-400">{item}</p>
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
                    className="flex items-start gap-3 border-b border-white/6 pb-4 last:border-b-0 last:pb-0"
                  >
                    <div className="mt-1 h-8 w-8 rounded-full bg-white/5" />
                    <div>
                      <p className="text-sm text-zinc-300">{item}</p>
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
                  className="text-xs uppercase tracking-[0.24em] text-lime-300"
                >
                  View all
                </Link>
              </div>
              <div className="mt-5 space-y-3">
                {managers.map((manager, index) => (
                  <div
                    key={manager}
                    className={`flex items-center justify-between rounded-2xl px-3 py-3 ${
                      index === 0 ? 'bg-lime-300 text-black' : 'bg-white/4'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold ${
                          index === 0
                            ? 'bg-black/10 text-black'
                            : 'bg-white/6 text-white'
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
                            index === 0 ? 'text-black/70' : 'text-zinc-500'
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
                          ? 'bg-black text-white'
                          : 'border border-white/10 text-zinc-400'
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
