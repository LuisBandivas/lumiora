import { useCallback, useEffect, useState } from 'react'
import {
  categories,
  findCategory,
  findTemplate,
  templatesIn,
  type CategoryId,
  type Template,
} from './catalog'

interface Selection {
  category: CategoryId
  template: Template
  /** Set when the URL named an unknown category or template and a valid choice replaced it. */
  notice: string | null
}

// Reads the public selection from the query string and falls back to a valid choice.
function readSelection(): Selection {
  const params = new URLSearchParams(window.location.search)
  const rawCategory = params.get('category')
  const rawTemplate = params.get('template')

  const category = findCategory(rawCategory)?.id ?? categories[0].id
  const requested = findTemplate(rawTemplate)
  const options = templatesIn(category)
  const template = requested && requested.category === category ? requested : options[0]

  const invalid =
    (rawCategory !== null && !findCategory(rawCategory)) ||
    (rawTemplate !== null && (!requested || requested.category !== category))

  return {
    category,
    template,
    notice: invalid ? 'That look is no longer available, so we picked another one.' : null,
  }
}

function writeUrl(selection: Selection, mode: 'push' | 'replace') {
  const params = new URLSearchParams({
    category: selection.category,
    template: selection.template.id,
  })
  const url = `/create?${params.toString()}`
  if (mode === 'push') window.history.pushState(null, '', url)
  else window.history.replaceState(null, '', url)
}

export function useTemplateSelection() {
  const [selection, setSelection] = useState<Selection>(readSelection)

  // Normalize the address bar once, so a refresh restores the same choice.
  useEffect(() => {
    writeUrl(selection, 'replace')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const onPop = () => setSelection(readSelection())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const update = useCallback((category: CategoryId, template: Template) => {
    const next = { category, template, notice: null }
    setSelection(next)
    writeUrl(next, 'replace')
  }, [])

  const selectCategory = useCallback(
    (category: CategoryId) => update(category, templatesIn(category)[0]),
    [update],
  )

  const step = useCallback(
    (delta: 1 | -1) => {
      const options = templatesIn(selection.category)
      const index = options.findIndex((t) => t.id === selection.template.id)
      update(selection.category, options[(index + delta + options.length) % options.length])
    },
    [selection, update],
  )

  return {
    category: selection.category,
    template: selection.template,
    notice: selection.notice,
    options: templatesIn(selection.category),
    selectCategory,
    next: () => step(1),
    previous: () => step(-1),
    selectTemplate: (template: Template) => update(selection.category, template),
  }
}
