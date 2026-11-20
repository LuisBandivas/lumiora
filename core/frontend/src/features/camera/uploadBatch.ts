import type { ReadResult } from './readImageFile'

/** One batch at a time; cancellation releases every URL still owned by the reader. */
export function createUploadBatch<T>(decode: (file: T) => Promise<ReadResult>, release: (url: string) => void) {
  let active: { cancelled: boolean } | null = null
  return {
    cancel() {
      if (active) active.cancelled = true
    },
    async read(files: T[]): Promise<ReadResult[] | null> {
      if (active) return null
      const request = { cancelled: false }
      active = request
      const results: ReadResult[] = []
      try {
        // Decode sequentially to avoid a large batch exhausting phone memory.
        for (const file of files) {
          try {
            results.push(await decode(file))
          } catch {
            results.push({ error: 'A photo could not be read. Try choosing it again.' })
          }
          if (request.cancelled) {
            results.forEach((result) => { if ('url' in result) release(result.url) })
            return null
          }
        }
        return results
      } finally {
        active = null
      }
    },
  }
}
