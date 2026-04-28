import { useRef, useState } from 'react'
import { Link, router } from '@inertiajs/react'
import AdminLayout from '@/Layouts/AdminLayout'
import { compressMultipleImages } from '@/Utils/ImageCompression'

interface ImageEntry {
  id: string
  file: File
  title: string
}

const sekolahOptions = [
  { label: 'Sekolah Kemurnian I', value: 'sekolah-kemurnian-1' },
  { label: 'Sekolah Kemurnian II', value: 'sekolah-kemurnian-2' },
  { label: 'Sekolah Kemurnian III', value: 'sekolah-kemurnian-3' },
]

export default function FasilitasCreate({ schoolOptions }: { schoolOptions: Record<string, string> }) {
  const optionList = sekolahOptions.length
    ? sekolahOptions
    : Object.entries(schoolOptions).map(([value, label]) => ({ value, label }))

  const [school, setSchool] = useState(optionList[0]?.value ?? '')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [images, setImages] = useState<ImageEntry[]>([])
  const [status, setStatus] = useState<'idle' | 'compressing' | 'submitting'>('idle')
  const [message, setMessage] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const titleRefs = useRef<Record<string, HTMLInputElement>>({})

  const handleImageChange = async (files: FileList | null) => {
    if (!files?.length) return

    const validFiles = Array.from(files).filter(
      (file) => file.type.startsWith('image/') && file.size <= 10 * 1024 * 1024
    )

    if (!validFiles.length) {
      setMessage('Invalid files. Must be images under 10MB.')
      return
    }

    setStatus('compressing')
    setMessage(`Compressing ${validFiles.length} image(s)...`)

    try {
      const compressed = await compressMultipleImages(validFiles, {
        quality: 0.8,
        maxWidth: 1920,
        maxHeight: 1080,
      })

      const newImages = compressed.map((file, index) => ({
        file,
        title: '',
        id: `${Date.now()}_${index}`,
      }))

      setImages((prev) => [...prev, ...newImages])
      setMessage(`Added ${newImages.length} image(s).`)
    } catch (error) {
      console.error(error)
      setMessage('Compression failed.')
    } finally {
      setStatus('idle')
    }
  }

  const updateTitle = (id: string, title: string) => {
    setImages((prev) => prev.map((img) => (img.id === id ? { ...img, title } : img)))
  }

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id))
  }

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {}

    if (!images.length) {
      newErrors.images = 'Field is required'
      setErrors(newErrors)
      fileInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    images.forEach((img) => {
      if (!img.title.trim()) {
        newErrors[img.id] = 'Field is required'
      }
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      const firstErrorId = Object.keys(newErrors)[0]
      if (firstErrorId !== 'images') {
        titleRefs.current[firstErrorId]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      return
    }

    setErrors({})
    setStatus('submitting')

    const formData = new FormData()
    formData.append('nama_sekolah', school)

    images.forEach((img) => {
      formData.append('images[]', img.file)
      formData.append('titles[]', img.title)
    })

    router.post('/admin/fasilitas', formData, {
      onSuccess: () => {
        setImages([])
        setMessage('Facilities uploaded successfully.')
      },
      onError: () => {
        setMessage('Failed to upload facilities.')
      },
      onFinish: () => setStatus('idle')
    })
  }

  return (
    <div className="mx-auto max-w-4xl p-4 space-y-6">
      <Link
        href="/admin/fasilitas"
        className="text-blue-600 hover:text-blue-800 underline"
      >
        Back
      </Link>
      {message && (
        <div className="bg-gray-100 text-gray-800 p-2 rounded">{message}</div>
      )}
      <div className="mt-10">
        <label className="block mb-2 font-medium">Select School</label>
        <select
          value={school}
          onChange={(e) => setSchool(e.target.value)}
          className="border rounded p-2 w-full cursor-pointer"
        >
          {optionList.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block mb-2 font-medium">Upload Images</label>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => {
            handleImageChange(e.target.files)
            setErrors((prev) => {
              const { images, ...rest } = prev
              return rest
            })
          }}
          className={`border-1 w-full p-2 rounded cursor-pointer ${errors.images ? 'border-red-500 border-2' : ''}`}
        />
        {errors.images && (
          <p className="text-red-500 text-sm mt-1">{errors.images}</p>
        )}
      </div>
      {images.length > 0 && (
        <div className="space-y-3">
          {images.map((img, i) => (
            <div key={img.id} className="border rounded p-3 bg-gray-50">
              <div className="flex justify-between">
                <span>{img.file.name}</span>
                <button
                  onClick={() => removeImage(img.id)}
                  className="text-red-600 font-bold"
                  type="button"
                >
                  x
                </button>
              </div>
              <input
                ref={(el) => {
                  if (el) titleRefs.current[img.id] = el
                }}
                value={img.title}
                onChange={(e) => {
                  updateTitle(img.id, e.target.value)
                  if (e.target.value.trim()) {
                    setErrors((prev) => {
                      const { [img.id]: _, ...rest } = prev
                      return rest
                    })
                  }
                }}
                className={`mt-2 border p-2 w-full ${errors[img.id] ? 'border-red-500 border-2' : ''}`}
                placeholder={`Title for image ${i + 1}`}
              />
              {errors[img.id] && (
                <p className="text-red-500 text-sm mt-1">{errors[img.id]}</p>
              )}
            </div>
          ))}
        </div>
      )}
      <button
        onClick={handleSubmit}
        disabled={status === 'submitting' || status === 'compressing'}
        className="bg-btn-primary hover:bg-red-primary text-white px-4 py-2 rounded cursor-pointer"
        type="button"
      >
        {status === 'compressing'
          ? 'Compressing...'
          : status === 'submitting'
            ? 'Saving...'
            : 'Save Facilities'}
      </button>
    </div>
  )
}

FasilitasCreate.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>
