import type { Template } from './catalog'

interface Props {
  template: Template
  /** Height of the preview in rem; width follows the export aspect ratio. */
  heightRem: number
  active?: boolean
}

// Placeholder rendering: a paper card with empty photo slots. Real previews come with template assets.
export function TemplatePreview({ template, heightRem, active = true }: Props) {
  const rows = Math.ceil(template.photoCount / template.columns)
  return (
    <div
      aria-hidden="true"
      className={`grid gap-2 rounded-sm bg-surface p-3 shadow-md ring-1 ring-line transition-opacity ${
        active ? 'opacity-100' : 'opacity-50'
      }`}
      style={{
        height: `${heightRem}rem`,
        aspectRatio: String(template.aspect),
        gridTemplateColumns: `repeat(${template.columns}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
      }}
    >
      {Array.from({ length: template.photoCount }, (_, i) => (
        <div key={i} className="rounded-[2px] bg-canvas ring-1 ring-line" />
      ))}
    </div>
  )
}
