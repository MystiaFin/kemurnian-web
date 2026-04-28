import { useMemo, useRef } from 'react'
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
  <div className="relative w-full h-[400px] md:h-[540px] flex items-center justify-center bg-[#641609] text-white">
    <div className="text-center">
      <p className="text-lg font-medium">No hero banners available</p>
      <p className="text-sm opacity-75 mt-2">Add some images to see them here</p>
    </div>
  </div>
)

export default function HeroSliders({ images = [], interval = 5000 }: { images?: HeroBannerRecord[]; interval?: number }) {
  const sliderRef = useRef<HTMLDivElement>(null)

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

  if (totalSlides === 0) return <NoBanners />

  if (totalSlides === 1) {
    return (
      <div className="relative w-full h-[400px] md:h-[540px] bg-[#641609]">
        <HeroSlide slide={sortedSlides[0]} />
      </div>
    )
  }

  return (
    <div
      className="relative w-full h-[600px] md:h-[540px] overflow-hidden bg-[#641609]"
      style={{ touchAction: 'pan-y' }}
    >
      <div
        ref={sliderRef}
        className="flex w-full h-full"
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

      <SliderDots slides={sortedSlides} currentIndex={currentIndex} goToSlide={goToSlide} />
    </div>
  )
}
