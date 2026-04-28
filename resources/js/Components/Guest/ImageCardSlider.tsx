import { useEffect, useState } from 'react'

interface ImageCardSliderProps {
  images: string[]
  alt: string
  title?: string[]
}

export default function ImageCardSlider({ images, alt, title }: ImageCardSliderProps) {
  const [currentIndex, setCurrent] = useState(1)
  const [isTransitioning, setIsTransitioning] = useState(true)

  const totalImages = images.length
  const slides = totalImages > 1 ? [images[totalImages - 1], ...images, images[0]] : images

  const nextImage = () => {
    if (totalImages <= 1) return
    setCurrent((prev) => prev + 1)
    setIsTransitioning(true)
  }

  const prevImage = () => {
    if (totalImages <= 1) return
    setCurrent((prev) => prev - 1)
    setIsTransitioning(true)
  }

  useEffect(() => {
    if (totalImages <= 1) return

    if (currentIndex === totalImages + 1) {
      const timer = setTimeout(() => {
        setIsTransitioning(false)
        setCurrent(1)
      }, 500)
      return () => clearTimeout(timer)
    }

    if (currentIndex === 0) {
      const timer = setTimeout(() => {
        setIsTransitioning(false)
        setCurrent(totalImages)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [currentIndex, totalImages])

  if (images.length === 0) return null

  if (totalImages === 1) {
    return (
      <div className="relative w-full max-w-3xl mx-auto mb-8">
        <div className="flex justify-center mx-14">
          <img
            src={images[0]}
            alt={alt}
            width={400}
            height={300}
            className="rounded object-cover"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full max-w-3xl mx-auto mb-8">
      <div className="overflow-hidden mx-14">
        <div
          className="flex"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
            transition: isTransitioning ? 'transform 0.5s ease-in-out' : 'none',
          }}
        >
          {slides.map((image, idx) => {
            const actualIndex = totalImages > 1
              ? (idx === 0 ? totalImages - 1 : idx === slides.length - 1 ? 0 : idx - 1)
              : 0

            return (
              <div key={idx} className="flex-shrink-0 w-full max-h-[400px] object-contain flex justify-center items-center flex-col">
                <h2 className="font-raleway font-extrabold text-lg mb-2">
                  {title && title[actualIndex]}
                </h2>
                <img
                  src={image}
                  alt={alt}
                  width={400}
                  height={400}
                  className="rounded object-cover"
                />
              </div>
            )
          })}
        </div>
      </div>

      {totalImages > 1 && (
        <>
          <button
            onClick={prevImage}
            className="absolute mx-4 left-2 top-1/2 -translate-y-1/2 bg-transparent hover:opacity-70 transition-opacity duration-200 z-10 cursor-pointer"
            aria-label="Previous image"
            type="button"
          >
            <img
              src="/left.svg"
              alt="button left"
              width={30}
              height={30}
              className="w-4 md:w-8"
            />
          </button>
          <button
            onClick={nextImage}
            className="absolute mx-4 right-2 top-1/2 -translate-y-1/2 bg-transparent hover:opacity-70 transition-opacity duration-200 z-10"
            aria-label="Next image"
            type="button"
          >
            <img
              src="/right.svg"
              alt="button right"
              width={30}
              height={30}
              className="w-4 md:w-8"
            />
          </button>
        </>
      )}

      {totalImages > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          {images.map((_, index) => {
            const isActive =
              currentIndex === index + 1 ||
              (currentIndex === 0 && index === totalImages - 1) ||
              (currentIndex === totalImages + 1 && index === 0)

            return (
              <button
                key={index}
                onClick={() => {
                  setCurrent(index + 1)
                  setIsTransitioning(true)
                }}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  isActive
                    ? 'bg-btn-primary scale-110'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to image ${index + 1}`}
                type="button"
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
