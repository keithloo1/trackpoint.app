import BrandPanel from './BrandPanel'

export default function AuthShell({ children }) {
  return (
    <div className="min-h-svh bg-zinc-100 dark:bg-black">
      <div className="grid min-h-svh grid-cols-1 lg:grid-cols-2">
        <BrandPanel />
        <div className="flex min-h-[58vh] flex-col bg-zinc-100 lg:min-h-svh dark:bg-black">
          <div className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8 lg:px-12 lg:py-12">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
