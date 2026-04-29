import { useState } from 'react'
import { Head, Link, router } from '@inertiajs/react'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'
import AdminLayout from '@/Layouts/AdminLayout'

const modules = {
    toolbar: [
        ['bold', 'italic', 'underline'],
        [{ color: [] }, { background: [] }],
        [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
        ['link'],
        ['clean'],
    ],
}

const formats = ['header', 'bold', 'italic', 'underline', 'color', 'background', 'list', 'indent', 'link']

export default function KurikulumCreate() {
    const [title, setTitle] = useState('')
    const [preview, setPreview] = useState('')
    const [content, setContent] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const handleSubmit = () => {
        if (!title.trim() || !content.trim()) {
            setErrorMessage('Title and content are required.')
            return
        }

        setIsSubmitting(true)

        router.post('/admin/kurikulum', {
            title: title.trim(),
            preview: preview.trim(),
            body: content,
        }, {
            onError: () => {
                setErrorMessage('Failed to save kurikulum.')
                setIsSubmitting(false)
            }
        })
    }

    return (
        <>
            <Head title="Buat Kurikulum | Admin" />
            <div className="mx-auto max-w-3xl p-4">
                <Link href="/admin/kurikulum" className="mb-4 inline-block text-blue-600 hover:text-blue-800 underline">
                    ← back
                </Link>

                {errorMessage && (
                    <div className="mb-4 rounded bg-red-200 p-2 text-red-900">{errorMessage}</div>
                )}

                <div className="mb-4">
                    <label className="mb-2 block font-medium">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        className="w-full rounded border p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        placeholder="Enter title..."
                        disabled={isSubmitting}
                    />
                </div>

                <div className="mb-4">
                    <label className="mb-2 block font-medium">
                        Preview <span className="text-gray-400">(optional)</span>
                    </label>
                    <textarea
                        value={preview}
                        onChange={e => setPreview(e.target.value)}
                        className="w-full rounded border p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        placeholder="Short description or excerpt..."
                        rows={3}
                        disabled={isSubmitting}
                    />
                </div>

                <div className="mb-4">
                    <label className="mb-2 block font-medium">Content</label>
                    <ReactQuill
                        theme="snow"
                        value={content}
                        onChange={setContent}
                        modules={modules}
                        formats={formats}
                        placeholder="Write your content here..."
                        className="bg-white"
                        readOnly={isSubmitting}
                    />
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !title.trim() || !content.trim()}
                        className={`rounded-full px-4 py-2 text-white cursor-pointer ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                        {isSubmitting ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </div>
        </>
    )
}

KurikulumCreate.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>
