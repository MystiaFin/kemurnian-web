import { useEffect, useState } from 'react'
import { router } from '@inertiajs/react'

export default function LoadingProgress() {
  const [width, setWidth] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const startListener = router.on('start', () => {
      setIsVisible(true)
      setWidth(70)
    })

    const finishListener = router.on('finish', () => {
      setWidth(100)
      setTimeout(() => {
        setIsVisible(false)
        setTimeout(() => setWidth(0), 200)
      }, 500)
    })

    return () => {
      startListener()
      finishListener()
    }
  }, [])

  return (
    <span
      className={`fixed top-0 left-0 h-1 bg-red-900 ease-out ${
        isVisible ? 'transition-all duration-300 opacity-100' : 'transition-none opacity-0'
      }`}
      style={{ width: `${width}%` }}
    />
  )
}
