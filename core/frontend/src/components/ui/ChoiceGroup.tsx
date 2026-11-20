import type { ReactNode } from 'react'

export interface Choice {
  id: string
  label: string
  swatch?: ReactNode
}

interface Props {
  legend: string
  name: string
  value: string
  choices: Choice[]
  onChange: (id: string) => void
}

// Native radio inputs, so keyboard and screen reader behavior come from the browser.
export function ChoiceGroup({ legend, name, value, choices, onChange }: Props) {
  return (
    <fieldset className="m-0 border-0 p-0">
      <legend className="mb-2 p-0 text-sm font-medium">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {choices.map((choice) => (
          <label key={choice.id} className="relative cursor-pointer">
            {/* The invisible input covers the whole chip so focus scrolling reveals all of it. */}
            <input
              type="radio"
              name={name}
              value={choice.id}
              checked={choice.id === value}
              onChange={() => onChange(choice.id)}
              className="peer absolute inset-0 size-full cursor-pointer opacity-0"
            />
            <span className="flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-sm peer-checked:border-ink peer-checked:ring-1 peer-checked:ring-ink peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent">
              {choice.swatch}
              {choice.label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}
