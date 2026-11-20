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
    <nav aria-label="Progress" className="w-full items-center border-b border-line bg-surface">
      <ol className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-4 py-3 sm:justify-center sm:gap-3 rounded-full">
        {steps.map((step, i) => {
          const done = i < currentIndex
          const active = i === currentIndex
          return (
            <li key={step.id} className="flex shrink-0 items-center gap-1 sm:gap-3">
              <button
                type="button"
                disabled={i > currentIndex}
                onClick={() => onNavigate(step.id)}
                aria-current={active ? 'step' : undefined}
                className={`flex items-center gap-2 rounded-full px-2 py-1 text-sm ${
                  active ? 'font-semibold text-ink' : done ? 'text-ink hover:underline' : 'text-muted'
                }`}
              >
                <span
                  className={`grid size-6 place-items-center rounded-full text-xs ${
                    active
                      ? 'bg-accent text-accent-ink'
                      : done
                        ? 'bg-ink text-surface'
                        : 'border border-line'
                  }`}
                >
                  {done ? '✓' : i + 1}
                </span>
                <span className={active ? '' : 'hidden sm:inline'}>{step.label}</span>
              </button>
              {i < steps.length - 1 && (
                <span aria-hidden="true" className="text-line">
                  —
                </span>
              )}
            </li>
          )
        })}
      </ol>
      <div aria-hidden="true" className="h-0.5 bg-line">
        <motion.div
          className="h-full bg-accent"
          initial={false}
          animate={{ width: `${((currentIndex + 1) / steps.length) * 100}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </div>
    </nav>
  )
}
