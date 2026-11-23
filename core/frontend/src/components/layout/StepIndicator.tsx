import { motion } from 'motion/react'
import { stepIndex, steps, type JourneyStep } from '../../app/journey'

interface Props {
  current: JourneyStep
  onNavigate: (step: JourneyStep) => void
}

// Earlier steps are reachable so progress is preserved when moving backward.
export function StepIndicator({ current, onNavigate }: Props) {
  const currentIndex = stepIndex(current)
  return (
    <nav aria-label="Progress" className="w-full border-b border-line bg-surface">
      <div className="mx-auto w-full max-w-5xl px-4 py-3">
        <p className="mb-2 text-sm font-medium text-ink min-[700px]:hidden">
          <span className="text-accent">Step {currentIndex + 1} of {steps.length}</span>
          <span aria-hidden="true" className="px-2 text-muted">·</span>
          {steps[currentIndex].label}
        </p>
        <ol className="grid grid-cols-5 gap-1 lg:gap-2">
          {steps.map((step, i) => {
            const done = i < currentIndex
            const active = i === currentIndex
            return (
              <li key={step.id} className="min-w-0">
                <button
                  type="button"
                  disabled={i > currentIndex}
                  onClick={() => onNavigate(step.id)}
                  aria-current={active ? 'step' : undefined}
                  aria-label={`${step.label}, ${active ? 'current step' : done ? 'completed' : 'upcoming'}`}
                  className={`flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border px-1 py-2 text-left text-sm transition-colors min-[700px]:px-2 min-[700px]:text-xs lg:px-3 lg:text-sm ${
                    active
                      ? 'border-accent/20 bg-accent/10 font-semibold text-accent'
                      : done
                        ? 'border-transparent font-medium text-ink hover:bg-canvas'
                        : 'border-transparent text-muted'
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`grid size-7 shrink-0 place-items-center rounded-full text-xs font-semibold ${
                      active
                        ? 'bg-accent text-accent-ink'
                        : done
                          ? 'bg-accent/10 text-accent'
                          : 'bg-canvas text-muted ring-1 ring-inset ring-line'
                    }`}
                  >
                    {done ? '✓' : i + 1}
                  </span>
                  <span className="sr-only min-[700px]:not-sr-only min-[700px]:leading-tight lg:whitespace-nowrap">{step.label}</span>
                </button>
              </li>
            )
          })}
        </ol>
        <div aria-hidden="true" className="mt-3 h-1 overflow-hidden rounded-full bg-line">
          <motion.div
            className="h-full rounded-full bg-accent"
            initial={false}
            animate={{ width: `${((currentIndex + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        </div>
      </div>
    </nav>
  )
}
