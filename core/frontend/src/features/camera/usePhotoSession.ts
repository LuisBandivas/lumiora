import { useMemo, useState } from 'react'
import type { Template } from '../templates/catalog'

/** A filled slot holds an object URL for a photo that exists only in this browser. */
export type Slots = (string | null)[]

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
    const order = [active, ...slots.map((_, i) => i).filter((i) => i !== active && slots[i] === null)]
    const next = [...slots]
    let placed = 0
    urls.forEach((url, k) => {
      const i = order[k]
      if (i === undefined) {
        URL.revokeObjectURL(url)
        return
      }
      const old = next[i]
      if (old) URL.revokeObjectURL(old)
      next[i] = url
      placed++
    })
    const nextEmpty = next.findIndex((u) => u === null)
    commit(next, nextEmpty === -1 ? active : nextEmpty)
    return placed
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
