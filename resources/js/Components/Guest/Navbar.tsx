import { useEffect, useState } from 'react'
import { Link } from '@inertiajs/react'
import { navItems } from '@GuestComponents/NavbarUtils/constants'
import { useSearch } from '@GuestComponents/NavbarUtils/useSearch'

interface Page {
  title: string
  url: string
}

export default function Navbar({ searchPages }: { searchPages: Page[] }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const {
    query,
    setQuery,
    suggestions,
    highlightIndex,
    debouncedQuery,
    searchContainerRef,
    handleKeyDown,
    clearSearch,
    updatePages,
  } = useSearch(isMenuOpen)

  useEffect(() => {
    updatePages(searchPages)
  }, [searchPages, updatePages])

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  const handleSuggestionClick = () => {
    clearSearch()
    setIsMenuOpen(false)
  }

  return (
    <>
      <nav className="bg-gray-primary sticky top-0 z-50 h-16 w-full">
        <div className="flex h-full items-center justify-between">
          <button
            onClick={toggleMenu}
            className="bg-btn-primary flex h-16 w-16 flex-col items-center justify-center space-y-1 hover:opacity-80 transition-colors duration-200 relative z-[60] focus:outline-none cursor-pointer"
            aria-label="Toggle menu"
          >
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-5 h-[3px] bg-white" />
            ))}
          </button>

          <div className="absolute left-1/2 -translate-x-1/2 z-[60]">
            <Link href="/">
              <img
                src="/nav_logo.webp"
                alt="Logo"
                width={245}
                height={245}
                className="w-65 h-auto"
              />
            </Link>
          </div>

          <div className="w-10" />
        </div>
      </nav>

      <section
        className={`fixed top-16 left-0 w-full px-12 pb-7 pt-4 bg-gray-primary z-40 transition-transform duration-300 ease-out flex flex-col-reverse md:flex-col ${
          isMenuOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <ul className="flex flex-col md:flex-row pt-10 px-2 md:p-8 gap-4 md:gap-10">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-white font-raleway font-bold text-xs border-b border-dotted pb-5 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </ul>

        <div ref={searchContainerRef} className="relative flex flex-col gap-1">
          <div className="flex">
            <input
              type="text"
              placeholder="Search"
              className="text-white w-full h-12 bg-[#555454] px-3 py-2 placeholder-gray-300 text-lg rounded-l-md focus:outline-none"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button className="bg-btn-primary w-12 h-12 flex justify-center items-center rounded-r-md" type="button">
              <img src="/search.svg" alt="Search" width={20} height={30} />
            </button>
          </div>

          {suggestions.length > 0 && (
            <div className="absolute top-full left-0 w-full bg-white font-merriweather max-h-60 overflow-y-auto z-50 rounded-b-md border border-gray-300 shadow-lg">
              {suggestions.map((s, i) => {
                const startIndex = s.title.toLowerCase().indexOf(debouncedQuery.toLowerCase())
                const endIndex = startIndex + debouncedQuery.length
                const isHighlighted = i === highlightIndex

                return (
                  <Link
                    key={s.url}
                    href={s.url}
                    className={`block px-4 py-2 cursor-pointer transition-colors duration-150 ${
                      isHighlighted
                        ? 'bg-btn-primary text-white'
                        : 'text-gray-800 hover:bg-btn-primary hover:text-white'
                    }`}
                    onClick={handleSuggestionClick}
                  >
                    {startIndex > -1 ? (
                      <span>
                        {s.title.substring(0, startIndex)}
                        <strong className="font-bold">
                          {s.title.substring(startIndex, endIndex)}
                        </strong>
                        {s.title.substring(endIndex)}
                      </span>
                    ) : (
                      s.title
                    )}
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
