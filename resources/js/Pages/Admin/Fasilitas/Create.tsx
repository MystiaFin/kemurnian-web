import { useEffect, useRef, useState } from 'react'
import { Head, Link, router } from '@inertiajs/react'
import { RiDeleteBinLine } from '@remixicon/react'
import AdminLayout from '@/Layouts/AdminLayout'
import { compressMultipleImages } from '@/Utils/ImageCompression'

interface ImageEntry {
    id: string
    file: File
    title: string
    previewUrl: string
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

    const [school, setSchool] = useState('')
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [images, setImages] = useState<ImageEntry[]>([])
    const [imageToRemove, setImageToRemove] = useState<ImageEntry | null>(null)
    const [status, setStatus] = useState<'idle' | 'compressing' | 'submitting'>('idle')
    const [message, setMessage] = useState('')
    const schoolRef = useRef<HTMLSelectElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const uploadAreaRef = useRef<HTMLDivElement>(null)
    const titleRefs = useRef<Record<string, HTMLInputElement>>({})
    const imagesRef = useRef<ImageEntry[]>([])

    useEffect(() => {
        imagesRef.current = images
    }, [images])

    useEffect(() => {
        return () => {
            imagesRef.current.forEach((img) => URL.revokeObjectURL(img.previewUrl))
        }
    }, [])

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
                previewUrl: URL.createObjectURL(file),
            }))

            setImages((prev) => [...prev, ...newImages])
            setMessage(`Added ${newImages.length} image(s).`)
        } catch (error) {
            console.error(error)
            setMessage('Compression failed.')
        } finally {
            setStatus('idle')
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }
        }
    }

    const updateTitle = (id: string, title: string) => {
        setImages((prev) => prev.map((img) => (img.id === id ? { ...img, title } : img)))
    }

    const removeImage = (id: string) => {
        setImages((prev) => {
            const image = prev.find((img) => img.id === id)
            if (image) {
                URL.revokeObjectURL(image.previewUrl)
            }

            return prev.filter((img) => img.id !== id)
        })
    }

    const handleSubmit = () => {
        const newErrors: Record<string, string> = {}

        if (!school) {
            newErrors.school = 'Please select a school'
        }

        if (!images.length) {
            newErrors.images = 'Field is required'
        }

        images.forEach((img) => {
            if (!img.title.trim()) {
                newErrors[img.id] = 'Field is required'
            }
        })

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            const firstErrorId = Object.keys(newErrors)[0]
            if (firstErrorId === 'school') {
                schoolRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
            } else if (firstErrorId === 'images') {
                uploadAreaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
            } else {
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
                imagesRef.current.forEach((img) => URL.revokeObjectURL(img.previewUrl))
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
        <>
            <Head title="Buat Fasilitas | Admin" />
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
                        ref={schoolRef}
                        value={school}
                        onChange={(e) => {
                            setSchool(e.target.value)
                            setErrors((prev) => {
                                const { school: _school, ...rest } = prev
                                return rest
                            })
                        }}
                        className="border rounded p-2 w-full cursor-pointer"
                    >
                        <option value="" disabled>
                            Select school
                        </option>
                        {optionList.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    {errors.school && (
                        <p className="text-red-500 text-sm mt-1">{errors.school}</p>
                    )}
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
                        className="hidden"
                    />
                    <div ref={uploadAreaRef} className="flex flex-wrap gap-4">
                        {images.map((img, i) => (
                            <div key={img.id} className="w-64 rounded-lg border border-gray-300 bg-transparent p-3">
                                <div className="relative h-40 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                                    <img
                                        src={img.previewUrl}
                                        alt={img.file.name}
                                        className="h-full w-full object-cover"
                                    />
                                    <button
                                        onClick={() => setImageToRemove(img)}
                                        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-red-600 shadow hover:bg-white"
                                        type="button"
                                    >
                                        <RiDeleteBinLine size={16} />
                                    </button>
                                </div>
                                <div className="mt-3 border-t border-gray-200 pt-3">
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
                                        className={`w-full rounded border p-2 ${errors[img.id] ? 'border-red-500 border-2' : 'border-gray-300'}`}
                                        placeholder={`Title for image ${i + 1}`}
                                    />
                                    {errors[img.id] && (
                                        <p className="text-red-500 text-sm mt-1">{errors[img.id]}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className={`flex h-64 w-64 flex-col items-center justify-center rounded-lg border-2 bg-transparent transition-colors cursor-pointer ${
                                errors.images
                                    ? 'border-red-500 text-red-500'
                                    : 'border-gray-300 text-gray-400 hover:border-gray-400 hover:text-gray-500'
                            }`}
                        >
                            <span className="text-7xl leading-none">+</span>
                            <span className="mt-2 text-sm font-medium">Add Images</span>
                        </button>
                    </div>
                    {errors.images && (
                        <p className="text-red-500 text-sm mt-2">{errors.images}</p>
                    )}
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={status === 'submitting' || status === 'compressing'}
                    className="bg-btn-primary hover:bg-red-primary text-white px-4 py-2 rounded-full cursor-pointer"
                    type="button"
                    >
                        {status === 'compressing'
                            ? 'Compressing...'
                            : status === 'submitting'
                                ? 'Saving...'
                                : 'Save Facilities'}
                    </button>
                {imageToRemove && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
                        onClick={() => setImageToRemove(null)}
                    >
                        <div
                            className="w-full max-w-sm rounded-xl bg-white p-5 shadow-xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3 className="text-lg font-semibold text-gray-900">Cancel selected image?</h3>
                            <p className="mt-2 text-sm text-gray-600">
                                Do you want to remove "{imageToRemove.file.name}" from this upload list?
                            </p>
                            <div className="mt-5 flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setImageToRemove(null)}
                                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                >
                                    Keep
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        removeImage(imageToRemove.id)
                                        setImageToRemove(null)
                                    }}
                                    className="rounded-lg bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

FasilitasCreate.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>
