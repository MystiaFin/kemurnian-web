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

interface Kurikulum {
    id: number
    title: string
    body: string
    preview?: string | null
}

export default function KurikulumEdit({ kurikulum }: { kurikulum: Kurikulum }) {
    const [title, setTitle] = useState(kurikulum.title)
    const [preview, setPreview] = useState(kurikulum.preview ?? '')
    const [content, setContent] = useState(kurikulum.body)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [message, setMessage] = useState('')

    const handleSubmit = () => {
        setIsSubmitting(true)

        router.put(`/admin/kurikulum/${kurikulum.id}`, {
            title,
            preview,
            body: content.replace(/&nbsp;|\u00A0/g, ' '),
        }, {
            onError: () => {
                setMessage('Failed to update kurikulum.')
                setIsSubmitting(false)
            }
        })
    }

    return (
        <>
            <Head title="Edit Kurikulum | Admin" />
            <div className="mx-auto max-w-3xl p-4">
                <Link href="/admin/kurikulum" className="mb-4 inline-block text-blue-600 hover:text-blue-800 underline">
                    ← back
                </Link>

                {message && (
                    <div className="mb-4 p-2 rounded bg-gray-200">{message}</div>
                )}

                <div className="mb-4">
                    <label className="block mb-2 font-medium">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        className="w-full p-2 border rounded focus:ring-1 focus:ring-blue-500"
                        disabled={isSubmitting}
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-2 font-medium">Preview</label>
                    <textarea
                        value={preview}
                        onChange={e => setPreview(e.target.value)}
                        className="w-full p-2 border rounded focus:ring-1 focus:ring-blue-500"
                        placeholder="Short description or excerpt..."
                        disabled={isSubmitting}
                        rows={3}
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-2 font-medium">Content</label>
                    <ReactQuill
                        theme="snow"
                        value={content}
                        onChange={setContent}
                        modules={modules}
                        formats={formats}
                        className="bg-white"
                        readOnly={isSubmitting}
                    />
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !title.trim() || !content.trim()}
                    className={`px-4 py-2 rounded-full text-white cursor-pointer ${isSubmitting ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                    {isSubmitting ? 'Updating...' : 'Update'}
                </button>
            </div>
        </>
    )
}

KurikulumEdit.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>
