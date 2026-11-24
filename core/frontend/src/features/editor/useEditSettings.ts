import { useState } from 'react'
import type { Template } from '../templates/catalog'
import { filterPresets, framePresets } from './presets'
import type { OverlayItem, OverlayPatch } from './overlays'

/**
 * Edit choices are data. Renders combine them with the original photos, so edits never alter a capture.
 * A null frame or filter means "use the template's default", so changing template shows its own look
 * until the person picks something explicitly.
 */
export interface EditSettings {
  frameId: string | null
  filterId: string | null
  caption: string
  captionFontId: string
  overlays: OverlayItem[]
}

export const defaultEdits: EditSettings = { frameId: null, filterId: null, caption: '', captionFontId: 'default', overlays: [] }

export const resolveEdits = (settings: EditSettings, template: Template) => ({
  frame:
    framePresets.find((f) => f.id === (settings.frameId ?? template.defaults.frameId)) ?? framePresets[0],
  filter:
    filterPresets.find((f) => f.id === (settings.filterId ?? template.defaults.filterId)) ??
    filterPresets[0],
  caption: settings.caption.trim(),
  overlays: settings.overlays,
})

export function useEditSettings() {
  const [settings, setSettings] = useState<EditSettings>(defaultEdits)
  return {
    settings,
    update: (patch: Partial<Pick<EditSettings, 'frameId' | 'filterId' | 'caption' | 'captionFontId'>>) =>
      setSettings((s) => ({ ...s, ...patch })),
    addOverlay: (item: OverlayItem) => setSettings((s) => ({ ...s, overlays: [...s.overlays, item] })),
    updateOverlay: (id: string, patch: OverlayPatch) =>
      setSettings((s) => ({
        ...s,
        overlays: s.overlays.map((o) => (o.id === id ? ({ ...o, ...patch } as OverlayItem) : o)),
      })),
    removeOverlay: (id: string) =>
      setSettings((s) => ({ ...s, overlays: s.overlays.filter((o) => o.id !== id) })),
    reset: () => setSettings(defaultEdits),
    isDefault:
      settings.frameId === null &&
      settings.filterId === null &&
      settings.caption === '' &&
      settings.captionFontId === 'default' &&
      settings.overlays.length === 0,
  }
}

export type EditSession = ReturnType<typeof useEditSettings>
