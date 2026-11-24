export interface FontPreset {
  id: string
  label: string
  css: string
}

export const fontPresets: FontPreset[] = [
  { id: 'default', label: 'Original', css: 'Georgia, "Times New Roman", serif' },
  { id: 'cormorant', label: 'Classic serif', css: '"Ephemora Cormorant", Georgia, serif' },
  { id: 'sans', label: 'Clean sans serif', css: '"Ephemora Inter", sans-serif' },
  { id: 'handwriting', label: 'Handwriting', css: '"Ephemora Caveat", cursive' },
]

export const fontFamilyFor = (id: string | null | undefined) =>
  id === 'default' || !id ? 'Georgia, "Times New Roman", serif' :
    fontPresets.find((font) => font.id === id)?.css ?? fontPresets[0].css
