import { useEffect, useRef, useState } from 'react'

export interface Page {
  title: string
  url: string
}

export function useSearch(isMenuOpen: boolean) {
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [pages, setPages] = useState<Page[]>([])
  const [suggestions, setSuggestions] = useState<Page[]>([])
  const [highlightIndex, setHighlightIndex] = useState(-1)
  const searchContainerRef = useRef<HTMLDivElement>(null)

  const updatePages = (data: Page[]) => {
    setPages(data)
  }

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(query), 300)
    return () => clearTimeout(handler)
  }, [query])

  const clearSearch = () => {
    setQuery('')
    setSuggestions([])
    setHighlightIndex(-1)
  }

  useEffect(() => {
    if (!debouncedQuery) {
      clearSearch()
      return
    }

    const matches = pages
      .filter((p) => p.title.toLowerCase().includes(debouncedQuery.toLowerCase()))
      .slice(0, 10)
    setSuggestions(matches)
    setHighlightIndex(-1)
  }, [debouncedQuery, pages])

  useEffect(() => {
    if (!isMenuOpen) {
      clearSearch()
    }
  }, [isMenuOpen])

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => e.key === 'Escape' && clearSearch()
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        clearSearch()
      }
    }

    document.addEventListener('keydown', handleEsc)
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (suggestions.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1))
    } else if (e.key === 'Enter' && highlightIndex > -1) {
      e.preventDefault()
      window.location.href = suggestions[highlightIndex].url
    }
  }

  return {
    query,
    setQuery,
    suggestions,
    highlightIndex,
    debouncedQuery,
    searchContainerRef,
    handleKeyDown,
    clearSearch,
    updatePages,
  }
}
