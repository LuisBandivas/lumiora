import { describe, expect, it, vi } from 'vitest'
import { createUploadBatch } from './uploadBatch'
import type { ReadResult } from './readImageFile'

function deferred() {
  let resolve!: (result: ReadResult) => void
  const promise = new Promise<ReadResult>((done) => { resolve = done })
  return { promise, resolve }
}

describe('upload batches', () => {
  it('rejects an overlapping batch without decoding it', async () => {
    const pending = deferred()
    const read = vi.fn(() => pending.promise)
    const batch = createUploadBatch(read, vi.fn())
    const first = batch.read(['first'])
    expect(await batch.read(['second'])).toBeNull()
    pending.resolve({ url: 'photo' })
    expect(await first).toEqual([{ url: 'photo' }])
    expect(read).toHaveBeenCalledTimes(1)
  })

  it('releases decoded photos and ignores late results after leaving', async () => {
    const pending = deferred()
    const release = vi.fn()
    const read = vi.fn(async (file: string): Promise<ReadResult> =>
      file === 'first' ? { url: 'first-url' } : pending.promise)
    const batch = createUploadBatch(read, release)
    const result = batch.read(['first', 'second', 'third'])
    await Promise.resolve()
    batch.cancel()
    pending.resolve({ url: 'second-url' })
    expect(await result).toBeNull()
    expect(release.mock.calls).toEqual([['first-url'], ['second-url']])
    expect(read).toHaveBeenCalledTimes(2)
  })

  it('reports a decoding exception and accepts another batch afterward', async () => {
    const read = vi.fn<(file: string) => Promise<ReadResult>>()
      .mockRejectedValueOnce(new Error('decode failed'))
      .mockResolvedValue({ url: 'good' })
    const batch = createUploadBatch(read, vi.fn())
    expect(await batch.read(['broken', 'valid'])).toEqual([
      { error: 'A photo could not be read. Try choosing it again.' }, { url: 'good' },
    ])
    expect(await batch.read(['retry'])).toEqual([{ url: 'good' }])
  })
})
