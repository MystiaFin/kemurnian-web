import { useEffect, useRef, useState } from 'react'

export function useSlider(totalSlides: number, interval: number) {
  const [currentIndex, setCurrentIndex] = useState(1)
  const [isTransitioning, setIsTransitioning] = useState(true)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const stopAutoPlay = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
  }

  const nextSlide = () => {
    if (totalSlides <= 1) return
    setCurrentIndex((prev) => prev + 1)
    setIsTransitioning(true)
  }

  const startAutoPlay = () => {
    if (totalSlides <= 1) return
    stopAutoPlay()
    intervalRef.current = setInterval(nextSlide, interval)
  }

  const prevSlide = () => {
    if (totalSlides <= 1) return
    setCurrentIndex((prev) => prev - 1)
    setIsTransitioning(true)
  }

  const goToSlide = (index: number) => {
    stopAutoPlay()
    setCurrentIndex(index + 1)
    setIsTransitioning(true)
    startAutoPlay()
  }

  useEffect(() => {
    if (totalSlides <= 1) return

    if (currentIndex === 0 || currentIndex === totalSlides + 1) {
      const timer = setTimeout(() => {
        setIsTransitioning(false)
        setCurrentIndex(currentIndex === 0 ? totalSlides : 1)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [currentIndex, totalSlides])

  useEffect(() => {
    startAutoPlay()
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopAutoPlay()
      } else {
        startAutoPlay()
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      stopAutoPlay()
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [interval, totalSlides])

  return {
    currentIndex,
    isTransitioning,
    setIsTransitioning,
    nextSlide,
    prevSlide,
    goToSlide,
    stopAutoPlay,
    startAutoPlay,
  }
}
