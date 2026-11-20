import { useState } from 'react'
import { filterPresets, framePresets } from './presets'

/** Edit choices are data. Renders combine them with the original photos, so edits never alter a capture. */
export interface EditSettings {
  frameId: string
  filterId: string
  caption: string
}

export const defaultEdits: EditSettings = {
  frameId: framePresets[0].id,
  filterId: filterPresets[0].id,
  caption: '',
}

export const resolveEdits = (settings: EditSettings) => ({
  frame: framePresets.find((f) => f.id === settings.frameId) ?? framePresets[0],
  filter: filterPresets.find((f) => f.id === settings.filterId) ?? filterPresets[0],
  caption: settings.caption.trim(),
})

export function useEditSettings() {
  const [settings, setSettings] = useState<EditSettings>(defaultEdits)
  return {
    settings,
    update: (patch: Partial<EditSettings>) => setSettings((s) => ({ ...s, ...patch })),
    reset: () => setSettings(defaultEdits),
    isDefault: (Object.keys(defaultEdits) as (keyof EditSettings)[]).every(
      (key) => settings[key] === defaultEdits[key],
    ),
  }
}

export type EditSession = ReturnType<typeof useEditSettings>
