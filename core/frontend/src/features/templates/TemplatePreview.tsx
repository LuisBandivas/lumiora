import { CompositionPreview } from '../editor/CompositionPreview'
import { defaultEdits } from '../editor/useEditSettings'
import type { Template } from './catalog'

interface Props {
  template: Template
  /** Height of the preview in rem; width follows the export aspect ratio. */
  heightRem: number
  active?: boolean
}

const emptySlots = (count: number) => Array.from({ length: count }, () => null)

// Draws the template with its own default frame and filter and empty photo slots.
export function TemplatePreview({ template, heightRem, active = true }: Props) {
  return (
    <div aria-hidden="true" className={`transition-opacity ${active ? 'opacity-100' : 'opacity-50'}`}>
      <CompositionPreview
        template={template}
        slots={emptySlots(template.photoCount)}
        edits={defaultEdits}
        height={`${heightRem}rem`}
      />
    </div>
  )
}
