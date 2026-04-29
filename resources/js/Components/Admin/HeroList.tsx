import { useState, useRef, useEffect } from 'react'
import { Link, router } from '@inertiajs/react'
import ConfirmationModal from '@AdminComponents/ConfirmationModal'
import { RiDeleteBinLine, RiCheckboxCircleLine, RiEditLine } from '@remixicon/react'

interface Hero {
  id: number
  desktop_image: string
  order: number
  header_text: string
}

export default function HeroList({ initialImages }: { initialImages: Hero[] }) {
  const [images, setImages] = useState<Hero[]>(initialImages)
  const [dragIdx, setDragIdx] = useState<number | null>(null)
  const [dragTargetIdx, setDragTargetIdx] = useState<number | null>(null)
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 })
  const [itemToDelete, setItemToDelete] = useState<Hero | null>(null)
  const dragStartPos = useRef({ x: 0, y: 0 })
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (dragIdx === null) return
      setDragPos({ x: e.clientX, y: e.clientY })

      let targetIdx = dragIdx
      for (let i = 0; i < itemRefs.current.length; i++) {
        const ref = itemRefs.current[i]
        if (!ref) continue
        const rect = ref.getBoundingClientRect()
        if (e.clientY < rect.top + rect.height / 2) {
          targetIdx = i
          break
        }
        if (i === itemRefs.current.length - 1) targetIdx = i + 1
      }
      setDragTargetIdx(targetIdx)
    }

    function handleMouseUp() {
      if (dragIdx === null) return

      const draggedItem = images[dragIdx]
      const targetIdx = dragTargetIdx ?? dragIdx

      if (targetIdx !== dragIdx) {
        const newImages = [...images]
        newImages.splice(dragIdx, 1)
        newImages.splice(targetIdx, 0, draggedItem)
        setImages(newImages)
      }

      setDragIdx(null)
      setDragTargetIdx(null)
      document.body.style.userSelect = ''
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.userSelect = ''
    }
  }, [dragIdx, dragPos, images])

  function handleMouseDown(e: React.MouseEvent, index: number) {
    if ((e.target as HTMLElement).closest('button, a')) return
    e.preventDefault()
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect()
    dragStartPos.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    setDragIdx(index)
    setDragPos({ x: e.clientX, y: e.clientY })
    document.body.style.userSelect = 'none'
  }

  function handleConfirmDelete() {
    if (!itemToDelete) return
    router.delete(`/admin/hero/${itemToDelete.id}`, {
      onSuccess: () => {
        setImages(images.filter(img => img.id !== itemToDelete!.id))
        setItemToDelete(null)
      }
    })
  }

  function handleSaveOrder() {
    router.post('/admin/hero/reorder', {
      order: images.map(img => img.id)
    })
  }

  const DragDots = () => (
    <div className="flex flex-col gap-1 mr-2">
      {[0,1,2].map(i => <div key={i} className="w-1 h-1 bg-gray-400 rounded-full" />)}
    </div>
  )

  return (
    <div className="relative">
      <div className="space-y-4">
        {images.map((img, idx) => (
          <div key={img.id}>
            {dragIdx !== null && dragTargetIdx === idx && (
              <div className="h-1 rounded-full bg-green-500/70 mb-3" />
            )}
            <div
              ref={el => { itemRefs.current[idx] = el }}
              onMouseDown={e => handleMouseDown(e, idx)}
              className={`flex items-center space-x-4 bg-white p-4 rounded-lg shadow-md hover:shadow-lg cursor-grab active:cursor-grabbing ${dragIdx !== null && images[dragIdx]?.id === img.id ? 'opacity-50' : ''}`}
            >
              <div className="flex-shrink-0"><DragDots /></div>
              <img
                src={img.desktop_image}
                width={150}
                height={80}
                alt={`Hero ${img.id}`}
                className="rounded pointer-events-none object-cover"
              />
              <div className="flex-1 pointer-events-none">
                <p className="text-sm text-gray-500">Order: {idx + 1}</p>
                <p className="text-gray-700 font-medium mt-1">{img.header_text}</p>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/hero/edit/${img.id}`}
                  onClick={e => e.stopPropagation()}
                  className="flex gap-1 items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors cursor-pointer"
                >
                  <RiEditLine size={17} />
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={e => { e.stopPropagation(); setItemToDelete(img) }}
                  onMouseDown={e => e.stopPropagation()}
                  className="flex items-center px-3 py-2 bg-red-700 hover:bg-red-800 text-white rounded-full transition-colors cursor-pointer gap-1"
                >
                  <RiDeleteBinLine size={18} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        {dragIdx !== null && dragTargetIdx === images.length && (
          <div className="h-1 rounded-full bg-green-500/70 mt-3" />
        )}
      </div>

      {dragIdx !== null && (
        <div
          className="fixed pointer-events-none z-50"
          style={{
            left: dragPos.x - dragStartPos.current.x,
            top: dragPos.y - dragStartPos.current.y,
            width: itemRefs.current[dragIdx]?.offsetWidth,
          }}
        >
          <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-2xl">
            <div className="flex-shrink-0"><DragDots /></div>
            <img
              src={images[dragIdx].desktop_image}
              width={150}
              height={80}
              alt={`Hero ${images[dragIdx].id}`}
              className="rounded object-cover"
            />
            <div className="flex-1">
              <p className="text-sm text-gray-500">Order: {dragIdx + 1}</p>
              <p className="text-gray-700 font-medium mt-1">{images[dragIdx].header_text}</p>
            </div>
          </div>
        </div>
      )}


      <button
        type="button"
        onClick={handleSaveOrder}
        className="mt-6 px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors flex items-center gap-2 cursor-pointer"
      >
        <RiCheckboxCircleLine size={20} />
        Save Order
      </button>

      {itemToDelete && (
        <ConfirmationModal
          item={{ title: itemToDelete.header_text }}
          onConfirm={handleConfirmDelete}
          onCancel={() => setItemToDelete(null)}
        />
      )}
    </div>
  )
}
