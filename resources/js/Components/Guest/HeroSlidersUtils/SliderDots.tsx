interface SliderDotsProps {
  slides: any[]
  currentIndex: number
  goToSlide: (index: number) => void
}

export default function SliderDots({ slides, currentIndex, goToSlide }: SliderDotsProps) {
  const totalSlides = slides.length
  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3">
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
                : 'border-white bg-transparent hover:border-btn-primary'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
            type="button"
          />
        )
      })}
    </div>
  )
}
