const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_BYTES = 15 * 1024 * 1024

export const acceptAttribute = ACCEPTED_TYPES.join(',')

export type ReadResult = { url: string } | { error: string }

// Validates type, size and decodability locally. The file never leaves the browser.
export async function readImageFile(file: File): Promise<ReadResult> {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return { error: `${file.name}: use a JPEG, PNG or WebP image.` }
  }
  if (file.size > MAX_BYTES) {
    return { error: `${file.name}: file is larger than 15 MB.` }
  }
  try {
    const bitmap = await createImageBitmap(file)
    bitmap.close()
  } catch {
    return { error: `${file.name}: this image could not be read.` }
  }
  return { url: URL.createObjectURL(file) }
}
