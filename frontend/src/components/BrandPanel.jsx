import { Link } from 'react-router-dom'
import trackpointLogo from '../assets/trackpoint-logo.png'

export default function BrandPanel() {
  return (
    <div className="relative flex min-h-[42vh] flex-col overflow-hidden bg-zinc-50 lg:min-h-svh dark:bg-black">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35] dark:hidden"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgb(0 0 0 / 0.07) 1px, transparent 1px),
            linear-gradient(to bottom, rgb(0 0 0 / 0.07) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 hidden opacity-[0.18] dark:block"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgb(255 255 255 / 0.09) 1px, transparent 1px),
            linear-gradient(to bottom, rgb(255 255 255 / 0.09) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
        aria-hidden
      />

      <header className="relative z-10 px-8 pt-8 lg:px-12">
        <Link
          to="/"
          className="text-sm font-medium tracking-wide text-zinc-900 dark:text-white"
        >
          TrackPoint<span className="text-zinc-500 dark:text-zinc-500">.app</span>
        </Link>
      </header>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-16 pt-8">
        <img
          src={trackpointLogo}
          alt="TrackPoint logo"
          className="w-full max-w-[420px] rounded-2xl object-contain dark:opacity-95"
        />
      </div>

      <footer className="relative z-10 px-8 pb-8 text-xs text-zinc-500 dark:text-zinc-500 lg:px-12">
        © {new Date().getFullYear()} TrackPoint.app
      </footer>
    </div>
  )
}
