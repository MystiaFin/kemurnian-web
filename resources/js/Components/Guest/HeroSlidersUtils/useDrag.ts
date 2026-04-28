import { PointerEvent, useCallback, useRef } from 'react'
import type { RefObject } from 'react'

interface UseDragProps {
  sliderRef: RefObject<HTMLDivElement | null>
  currentIndex: number
  totalSlides: number
  nextSlide: () => void
  prevSlide: () => void
  stopAutoPlay: () => void
  startAutoPlay: () => void
  setIsTransitioning: (isTransitioning: boolean) => void
}

export function useDrag({
  sliderRef,
  currentIndex,
  totalSlides,
  nextSlide,
  prevSlide,
  stopAutoPlay,
  startAutoPlay,
  setIsTransitioning,
}: UseDragProps) {
  const isDragging = useRef(false)
  const startX = useRef(0)
  const startTime = useRef(0)
  const currentX = useRef(0)
  const dragDistance = useRef(0)
  const containerWidth = useRef(0)
  const autoPlayResetTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const resetAutoPlayTimer = useCallback(() => {
    if (autoPlayResetTimeout.current) {
      clearTimeout(autoPlayResetTimeout.current)
    }
    stopAutoPlay()
    autoPlayResetTimeout.current = setTimeout(() => {
      startAutoPlay()
    }, 3000)
  }, [stopAutoPlay, startAutoPlay])

  const updateSliderPosition = useCallback(() => {
    if (!sliderRef.current || !isDragging.current) return

    const dragPercent = (dragDistance.current / containerWidth.current) * 100
    const baseTranslate = -currentIndex * 100
    const newTranslate = baseTranslate + dragPercent

    sliderRef.current.style.transform = `translateX(${newTranslate}%)`
  }, [currentIndex, sliderRef])

  const handlePointerDown = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      if (totalSlides <= 1 || window.innerWidth > 1024) return
      e.preventDefault()

      isDragging.current = true
      startX.current = e.clientX
      startTime.current = Date.now()
      currentX.current = e.clientX
      dragDistance.current = 0

      if (sliderRef.current) {
        containerWidth.current = sliderRef.current.offsetWidth
        sliderRef.current.style.cursor = 'grabbing'
        sliderRef.current.style.transition = 'none'
      }

      setIsTransitioning(false)
      resetAutoPlayTimer()
      e.currentTarget.setPointerCapture(e.pointerId)
    },
    [totalSlides, setIsTransitioning, resetAutoPlayTimer, sliderRef]
  )

  const handlePointerMove = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      if (!isDragging.current || totalSlides <= 1 || window.innerWidth > 1024) return
      e.preventDefault()

      currentX.current = e.clientX
      dragDistance.current = currentX.current - startX.current

      updateSliderPosition()
    },
    [totalSlides, updateSliderPosition]
  )

  const handlePointerUp = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      if (!isDragging.current || totalSlides <= 1 || window.innerWidth > 1024) return

      isDragging.current = false

      if (sliderRef.current) {
        sliderRef.current.style.cursor = 'grab'
        sliderRef.current.style.transition =
          'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      }

      setIsTransitioning(true)

      const swipeThreshold = containerWidth.current * 0.25
      const swipeVelocityThreshold = 0.5

      const timeDiff = Date.now() - startTime.current
      const velocity = Math.abs(dragDistance.current) / Math.max(timeDiff, 1)

      const shouldSwipe =
        Math.abs(dragDistance.current) > swipeThreshold ||
        velocity > swipeVelocityThreshold

      if (shouldSwipe) {
        if (dragDistance.current < 0) {
          nextSlide()
        } else if (dragDistance.current > 0) {
          prevSlide()
        }
      } else if (sliderRef.current) {
        sliderRef.current.style.transform = `translateX(${-currentIndex * 100}%)`
      }

      dragDistance.current = 0
      startX.current = 0
      currentX.current = 0
      startTime.current = 0
      e.currentTarget.releasePointerCapture(e.pointerId)
    },
    [totalSlides, currentIndex, nextSlide, prevSlide, setIsTransitioning, sliderRef]
  )

  const handlePointerCancel = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      if (isDragging.current) {
        handlePointerUp(e)
      }
    },
    [handlePointerUp]
  )

  return {
    onPointerDown: handlePointerDown,
    onPointerMove: handlePointerMove,
    onPointerUp: handlePointerUp,
    onPointerCancel: handlePointerCancel,
  }
}
