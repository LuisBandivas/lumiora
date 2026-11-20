export type JourneyStep = 'select' | 'source' | 'customize' | 'review' | 'export'

export interface StepInfo {
  id: JourneyStep
  label: string
  summary: string
}

export const steps: StepInfo[] = [
  { id: 'select', label: 'Choose look', summary: 'Pick a category and template.' },
  { id: 'source', label: 'Capture or upload', summary: 'Fill each photo slot from the camera or a file.' },
  { id: 'customize', label: 'Customize', summary: 'Adjust frame, filters and extras.' },
  { id: 'review', label: 'Review', summary: 'Check the final composition.' },
  { id: 'export', label: 'Export', summary: 'Download your image.' },
]

export const stepIndex = (id: JourneyStep) => steps.findIndex((s) => s.id === id)
