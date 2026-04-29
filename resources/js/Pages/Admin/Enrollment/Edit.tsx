import { useState } from 'react'
import { Head, Link, router } from '@inertiajs/react'
import AdminLayout from '@/Layouts/AdminLayout'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'

const modules = {
    toolbar: [
        [{ header: [1, 2, false] }],
        ['bold', 'italic', 'underline'],
        [{ color: [] }, { background: [] }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link'],
        ['clean']
    ]
}

const formats = ['header', 'bold', 'italic', 'underline', 'color', 'background', 'list', 'link']

interface EnrollmentItem {
    id: number
    title: string
    body: string
    date: string
    image_url?: string | null
    image_path?: string | null
}

export default function EnrollmentEdit({ enrollment, image_path }: { enrollment: EnrollmentItem; image_path?: string | null }) {
    const [title, setTitle] = useState(enrollment.title)
    const [body, setBody] = useState(enrollment.body)
    const [date, setDate] = useState(enrollment.date)
    const [existingImage, setExistingImage] = useState(enrollment.image_url ?? null)
    const [existingImagePath, setExistingImagePath] = useState(image_path ?? null)
    const [deleteExistingImage, setDeleteExistingImage] = useState(false)
    const [newImage, setNewImage] = useState<File | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [message, setMessage] = useState('')

    const handleToggleDeleteImage = () => {
        if (!existingImagePath) return
        setDeleteExistingImage(prev => !prev)
    }

    const handleSubmit = () => {
        if (!title || !body || !date) {
            setMessage('Title, body, and date are required.')
            return
        }

        setIsSubmitting(true)
        setMessage('')

        const formData = new FormData()
        formData.append('title', title)
        formData.append('body', body)
        formData.append('date', date)
        if (deleteExistingImage) formData.append('deleteImage', '1')
        if (newImage) formData.append('image', newImage)

        router.post(`/admin/enrollment/${enrollment.id}?_method=PUT`, formData, {
            onSuccess: () => {
                setMessage('Enrollment updated successfully!')
            },
            onError: () => {
                setMessage('Failed to update enrollment.')
            },
            onFinish: () => setIsSubmitting(false)
        })
    }

    return (
        <>
            <Head title="Edit Pendaftaran | Admin" />
            <div className="mx-auto max-w-3xl p-4">
                <Link href="/admin/enrollment" className="mb-4 inline-block text-blue-600 hover:text-blue-800 underline">
                    Back
                </Link>

                {message && <div className="mb-4 p-2 rounded bg-gray-200">{message}</div>}

                <div className="space-y-4">
                    <div>
                        <label className="block mb-1 font-medium">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            className="w-full border rounded p-2 focus:border-blue-500 focus:outline-none"
                            disabled={isSubmitting}
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Date</label>
                        <input
                            type="date"
                            value={date}
                            onChange={e => setDate(e.target.value)}
                            className="w-full border rounded p-2 focus:border-blue-500 focus:outline-none"
                            disabled={isSubmitting}
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Image</label>
                        {existingImage && (
                            <div className={`relative w-48 h-48 ${deleteExistingImage ? 'opacity-40 grayscale' : ''}`}>
                                <img
                                    src={existingImage}
                                    alt="Enrollment"
                                    className="w-full h-full object-cover rounded"
                                />
                                {deleteExistingImage && (
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <span className="text-red-700 font-bold text-xs bg-white/80 px-1 rounded">DELETED</span>
                                    </div>
                                )}
                                <button
                                    type="button"
                                    onClick={handleToggleDeleteImage}
                                    className={`absolute top-0 right-0 px-1 rounded text-white ${deleteExistingImage ? 'bg-blue-500 hover:bg-blue-600' : 'bg-red-500 hover:bg-red-600'}`}
                                >
                                    {deleteExistingImage ? 'Cancel' : 'x'}
                                </button>
                            </div>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={e => setNewImage(e.target.files?.[0] ?? null)}
                            className="w-full border rounded p-2 focus:border-blue-500 focus:outline-none"
                            disabled={isSubmitting}
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Body</label>
                        <ReactQuill
                            value={body}
                            onChange={setBody}
                            modules={modules}
                            formats={formats}
                            className="bg-white min-h-[200px]"
                            readOnly={isSubmitting}
                        />
                    </div>

                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className={`px-4 py-2 rounded text-white ${isSubmitting ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                        {isSubmitting ? 'Updating...' : 'Update'}
                    </button>
                </div>
            </div>
        </>
    )
}

EnrollmentEdit.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>
