import { useEffect, useState } from 'react'

export default function FixedBottom() {
  const [showButton, setShowButton] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setShowButton(window.scrollY > 100)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (!mounted) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-between items-end pointer-events-none">
      <audio
        id="mars"
        controls
        className="h-6 w-58 pointer-events-auto"
        controlsList="nodownload noplaybackrate"
      >
        <source src="/assets/mars-kemurnian-jaya.mp3" />
      </audio>

      <div className="flex flex-col items-center gap-2 pointer-events-auto">
        <a href="https://linktr.ee/sekolahkemurnian">
          <img src="/assets/whatsapp.svg" width={50} height={50} alt="whatsapp" />
        </a>

        <button
          onClick={scrollToTop}
          className={`bg-btn-primary text-white flex items-center gap-1 py-4 px-7 font-extrabold text-xs tracking-widest font-raleway cursor-pointer transition-opacity duration-300 ${
            showButton ? 'opacity-100' : 'opacity-0'
          }`}
        >
          TOP
          <svg className="w-3 h-3 fill-white" viewBox="0 0 75.32 122.88">
            <polygon points="37.66,0 0,37.99 24.24,37.99 24.24,122.88 51.08,122.88 51.08,37.99 75.32,37.99 37.66,0" />
          </svg>
        </button>
      </div>
    </div>
  )
}
