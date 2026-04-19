import trackpointMark from '../assets/trackpoint-mark.png'

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

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-16">
        <img
          src={trackpointMark}
          alt="TrackPoint logo"
          className="w-full max-w-[220px] object-contain dark:invert"
        />
      </div>

      <footer className="relative z-10 px-8 pb-8 text-xs text-zinc-500 dark:text-zinc-500 lg:px-12">
        © {new Date().getFullYear()} TrackPoint.app
      </footer>
    </div>
  )
}
