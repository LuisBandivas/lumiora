import { motion } from 'motion/react'
import { photoCountLabel, type Template } from '../features/templates/catalog'
import { stepIndex, steps, type JourneyStep } from '../app/journey'

interface Props {
  step: JourneyStep
  template: Template
  onBack: () => void
  onContinue: (() => void) | null
}

// Shell only: the real screen replaces this as each feature is built.
export function StepPlaceholder({ step, template, onBack, onContinue }: Props) {
  const info = steps[stepIndex(step)]
  return (
    <section aria-labelledby="step-heading" className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-12 text-center">
      <h1 id="step-heading" className="text-3xl font-semibold tracking-tight">
        {info.label}
      </h1>
      <p className="mt-2 text-muted">{info.summary}</p>
      <p className="mx-auto mt-8 max-w-md rounded-xl border border-dashed border-line bg-surface p-8 text-sm text-muted">
        Not built yet. Selected template: <strong className="text-ink">{template.name}</strong> (
        {photoCountLabel(template.photoCount)}).
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <button type="button" onClick={onBack} className="rounded-full border border-line bg-surface px-6 py-3 font-medium hover:border-ink">
          Back
        </button>
        {onContinue && (
          <motion.button type="button" onClick={onContinue} whileTap={{ scale: 0.97 }} className="rounded-full bg-accent px-6 py-3 font-medium text-accent-ink hover:opacity-90">
            Continue
          </motion.button>
        )}
      </div>
    </section>
  )
}
