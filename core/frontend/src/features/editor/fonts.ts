export interface FontPreset {
  id: string
  label: string
  css: string
}

export const fontPresets: FontPreset[] = [
  { id: 'serif', label: 'Classic serif', css: 'Georgia, "Times New Roman", serif' },
  { id: 'sans', label: 'Clean sans serif', css: '"Segoe UI", Arial, sans-serif' },
  { id: 'handwriting', label: 'Handwriting', css: '"Comic Sans MS", "Segoe Print", cursive' },
]

export const fontFamilyFor = (id: string | null | undefined) =>
  fontPresets.find((font) => font.id === id)?.css ?? fontPresets[0].css
