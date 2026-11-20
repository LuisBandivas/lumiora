// Photo style presets. These are separate from application UI tokens (src/index.css) so a new
// composition aesthetic never needs a new app theme. The starting set is placeholder content.

export interface FramePreset {
  id: string
  label: string
  background: string
  /** Caption color that stays readable on the background. */
  ink: string
}

export interface FilterPreset {
  id: string
  label: string
  /** A CSS filter string, so export can reuse it with canvas `ctx.filter`. */
  css: string
}

export const framePresets: FramePreset[] = [
  { id: 'white', label: 'White', background: '#ffffff', ink: '#16161a' },
  { id: 'black', label: 'Black', background: '#111114', ink: '#f6f6f4' },
  { id: 'cream', label: 'Cream', background: '#f3ead7', ink: '#4a3f2a' },
  { id: 'pink', label: 'Pastel pink', background: '#f8d7e3', ink: '#6b3a4e' },
  { id: 'sage', label: 'Sage', background: '#d5e3d3', ink: '#33473a' },
  { id: 'sky', label: 'Sky', background: '#d7e6f5', ink: '#2f4560' },
]

export const filterPresets: FilterPreset[] = [
  { id: 'original', label: 'Original', css: 'none' },
  { id: 'mono', label: 'Mono', css: 'grayscale(1) contrast(1.1)' },
  { id: 'pastel', label: 'Pastel', css: 'saturate(0.7) brightness(1.1) contrast(0.9)' },
  { id: 'vintage', label: 'Vintage', css: 'sepia(0.45) contrast(0.95) saturate(1.1)' },
  { id: 'warm', label: 'Warm', css: 'sepia(0.2) saturate(1.2) hue-rotate(-8deg)' },
]

export const CAPTION_MAX_LENGTH = 30
