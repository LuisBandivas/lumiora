import { BrandMark } from './BrandMark'

export function AppFooter() {
  return (
    <footer className="border-t border-line bg-surface/80">
      <div className="mx-auto grid w-full max-w-3/4 gap-6 px-4 py-8 text-sm sm:grid-cols-[1fr_auto] sm:items-start sm:gap-10 sm:py-10">
        <div>
          <div className="flex items-center gap-3">
            <BrandMark />
            <p className="font-editorial text-xl text-ink">Ephemora</p>
          </div>
          <p className="mt-3 text-muted">Inspired by ephemeral moments.</p>
        </div>
        <div className="max-w-xs">
          <p className="font-semibold text-ink">Made here. Kept by you.</p>
          <p className="mt-2 leading-relaxed text-muted">
            Your photos stay in this browser while you create. Download your finished image to keep it; refreshing or closing this page clears your session.
          </p>
        </div>
      </div>
    </footer>
  )
}
