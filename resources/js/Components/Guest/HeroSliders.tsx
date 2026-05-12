import { useEffect, useMemo, useRef, useState } from 'react'
import { useSlider } from '@GuestComponents/HeroSlidersUtils/useSlider'
import { useDrag } from '@GuestComponents/HeroSlidersUtils/useDrag'
import HeroSlide from '@GuestComponents/HeroSlidersUtils/HeroSlide'
import SliderDots from '@GuestComponents/HeroSlidersUtils/SliderDots'

interface HeroBannerRecord {
  id: number
  image_urls: string
  tablet_image_urls?: string | null
  mobile_image_urls?: string | null
  header_text?: string | null
  button_text?: string | null
  href_text?: string | null
  order: number
}

const NoBanners = () => (
  <div className="relative w-full h-[calc(100svh-4rem)] flex items-center justify-center bg-gray-primary text-white">
    <div className="text-center">
      <p className="text-lg font-medium">No hero banners available</p>
      <p className="text-sm opacity-75 mt-2">Add some images to see them here</p>
    </div>
  </div>
)

export default function HeroSliders({ images = [], interval = 5000 }: { images?: HeroBannerRecord[]; interval?: number }) {
  const sliderRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.innerWidth < 768
  })

  const { sortedSlides, loopedSlides, totalSlides } = useMemo(() => {
    const sorted = [...images].sort((a, b) => a.order - b.order)
    const total = sorted.length
    const looped = total > 1 ? [sorted[total - 1], ...sorted, sorted[0]] : sorted
    return { sortedSlides: sorted, loopedSlides: looped, totalSlides: total }
  }, [images])

  const {
    currentIndex,
    isTransitioning,
    setIsTransitioning,
    nextSlide,
    prevSlide,
    goToSlide,
    stopAutoPlay,
    startAutoPlay,
  } = useSlider(totalSlides, interval)

  const dragHandlers = useDrag({
    sliderRef,
    currentIndex,
    totalSlides,
    nextSlide,
    prevSlide,
    stopAutoPlay,
    startAutoPlay,
    setIsTransitioning,
  })

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (totalSlides === 0) return <NoBanners />

  if (totalSlides === 1) {
    return (
      <div className="relative w-full overflow-hidden">
        <HeroSlide slide={sortedSlides[0]} />
      </div>
    )
  }

  return (
    <div className="relative w-full overflow-hidden" style={{ touchAction: 'pan-y' }}>
      <div className="overflow-hidden">
        <div
          ref={sliderRef}
          className="flex w-full"
          style={{
            transform: `translateX(${-currentIndex * 100}%)`,
            transition: isTransitioning ? 'transform 0.5s ease-in-out' : 'none',
          }}
          {...dragHandlers}
        >
          {loopedSlides.map((slide, idx) => (
            <HeroSlide key={idx} slide={slide} />
          ))}
        </div>
      </div>

      {isMobile ? (
        <div className="py-4">
          <SliderDots
            slides={sortedSlides}
            currentIndex={currentIndex}
            goToSlide={goToSlide}
            placement="below"
          />
        </div>
      ) : (
        <SliderDots
          slides={sortedSlides}
          currentIndex={currentIndex}
          goToSlide={goToSlide}
          placement="overlay"
        />
      )}
    </div>
  )
}
