import { describe, expect, it } from 'vitest'
import { placePhotos, type Slots } from './usePhotoSession'

const empty = (n: number): Slots => Array.from({ length: n }, () => null)

describe('placePhotos', () => {
  it('puts one photo in the active slot and moves to the next empty slot', () => {
    const r = placePhotos(empty(3), 0, ['a'])
    expect(r.next).toEqual(['a', null, null])
    expect(r.nextActive).toBe(1)
    expect(r.placed).toBe(1)
  })

  it('replaces a filled slot and reports the replaced photo for release', () => {
    const r = placePhotos(['a', 'b', null], 1, ['c'])
    expect(r.next).toEqual(['a', 'c', null])
    expect(r.replaced).toEqual(['b'])
    expect(r.nextActive).toBe(2)
  })

  it('fills the active slot first, then the remaining empty slots in order', () => {
    const r = placePhotos(['a', null, null, null], 2, ['x', 'y', 'z'])
    expect(r.next).toEqual(['a', 'y', 'x', 'z'])
    expect(r.placed).toBe(3)
  })

  it('discards photos that have no slot and keeps the active slot when full', () => {
    const r = placePhotos(empty(2), 0, ['a', 'b', 'c'])
    expect(r.next).toEqual(['a', 'b'])
    expect(r.discarded).toEqual(['c'])
    expect(r.placed).toBe(2)
    expect(r.nextActive).toBe(0)
  })

  it('does not mutate the input', () => {
    const slots = empty(2)
    placePhotos(slots, 0, ['a'])
    expect(slots).toEqual([null, null])
  })
})
