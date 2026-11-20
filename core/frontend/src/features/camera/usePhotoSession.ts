import { useMemo, useState } from 'react'
import type { Template } from '../templates/catalog'

/** A filled slot holds an object URL for a photo that exists only in this browser. */
export type Slots = (string | null)[]

/**
 * Fills the active slot first, then the remaining empty slots in order.
 * `discarded` lists URLs that found no slot; `replaced` lists URLs that were overwritten.
 */
export function placePhotos(slots: Slots, active: number, urls: string[]) {
  const order = [active, ...slots.map((_, i) => i).filter((i) => i !== active && slots[i] === null)]
  const next = [...slots]
  const discarded: string[] = []
  const replaced: string[] = []
  urls.forEach((url, k) => {
    const i = order[k]
    if (i === undefined) {
      discarded.push(url)
      return
    }
    const old = next[i]
    if (old) replaced.push(old)
    next[i] = url
  })
  const nextEmpty = next.findIndex((u) => u === null)
  return {
    next,
    nextActive: nextEmpty === -1 ? active : nextEmpty,
    placed: urls.length - discarded.length,
    discarded,
    replaced,
  }
}

// Photos are stored per template ID, so switching template neither loses photos nor mismatches
// slot counts. How to migrate photos between templates remains an open decision (docs/FEATURES.md).
export function usePhotoSession(template: Template) {
  const [store, setStore] = useState<Record<string, Slots>>({})
  const [activeRaw, setActive] = useState(0)

  const slots = useMemo<Slots>(
    () => store[template.id] ?? Array.from({ length: template.photoCount }, () => null),
    [store, template],
  )
  const active = Math.min(activeRaw, template.photoCount - 1)
  const filled = slots.filter(Boolean).length

  const commit = (next: Slots, nextActive: number) => {
    setStore((s) => ({ ...s, [template.id]: next }))
    setActive(nextActive)
  }

  /** Fills the active slot first, then the remaining empty slots. Returns how many were placed. */
  const place = (urls: string[]) => {
    const result = placePhotos(slots, active, urls)
    ;[...result.discarded, ...result.replaced].forEach((url) => URL.revokeObjectURL(url))
    commit(result.next, result.nextActive)
    return result.placed
  }

  const remove = (index: number) => {
    const old = slots[index]
    if (old) URL.revokeObjectURL(old)
    const next = [...slots]
    next[index] = null
    commit(next, index)
  }

  /** Releases every photo in the session, for all templates. */
  const clearAll = () => {
    Object.values(store).forEach((list) => list.forEach((url) => url && URL.revokeObjectURL(url)))
    setStore({})
    setActive(0)
  }

  return {
    clearAll,
    slots,
    active,
    filled,
    complete: filled === slots.length,
    select: setActive,
    place,
    remove,
  }
}

export type PhotoSession = ReturnType<typeof usePhotoSession>
