interface SliderDotsProps {
  slides: any[]
  currentIndex: number
  goToSlide: (index: number) => void
  placement?: 'overlay' | 'below'
}

export default function SliderDots({ slides, currentIndex, goToSlide, placement = 'overlay' }: SliderDotsProps) {
  const totalSlides = slides.length
  const inactiveClass = placement === 'below' ? 'border-gray-primary bg-transparent' : 'border-white bg-transparent'
  return (
    <div
      className={
        placement === 'overlay'
          ? 'absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3'
          : 'flex items-center justify-center gap-3'
      }
    >
      {slides.map((_, idx) => {
        const isActive =
          currentIndex === idx + 1 ||
          (currentIndex === 0 && idx === totalSlides - 1) ||
          (currentIndex === totalSlides + 1 && idx === 0)
        return (
          <button
            key={idx}
            onClick={() => goToSlide(idx)}
            className={`w-4 h-4 rounded-full border-4 transition-all duration-300 shadow-xl cursor-pointer ${
              isActive
                ? 'border-btn-primary bg-transparent'
                : `${inactiveClass} hover:border-btn-primary`
            }`}
            aria-label={`Go to slide ${idx + 1}`}
            type="button"
          />
        )
      })}
    </div>
  )
}
