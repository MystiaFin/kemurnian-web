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

export default function EnrollmentCreate() {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [date, setDate] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')

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
    if (image) formData.append('image', image)

    router.post('/admin/enrollment', formData, {
      onError: () => {
        setMessage('Failed to save enrollment.')
      },
      onFinish: () => setIsSubmitting(false)
    })
  }

  return (
      <>
        <Head title="Buat Pendaftaran | Admin" />
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
          <input
            type="file"
            accept="image/*"
            onChange={e => setImage(e.target.files?.[0] ?? null)}
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
          {isSubmitting ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
      </>
  )
}

EnrollmentCreate.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>
