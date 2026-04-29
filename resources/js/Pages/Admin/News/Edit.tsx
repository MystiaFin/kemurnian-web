import { useState } from 'react'
import { Head, Link, router } from '@inertiajs/react'
import AdminLayout from '@/Layouts/AdminLayout'
import { compressMultipleImages } from '@/Utils/ImageCompression'

import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'

const fromOptions = [
  'General',
  'TK Kemurnian', 'SD Kemurnian', 'SMP Kemurnian', 'Kemurnian',
  'TK Kemurnian II', 'SD Kemurnian II', 'SMP Kemurnian II', 'SMA Kemurnian II', 'Kemurnian II',
  'TK Kemurnian III', 'SD Kemurnian III', 'Kemurnian III'
]

interface ExistingImage {
  url: string
  path: string
}

interface NewsItem {
  id: number
  title: string
  body: string
  date: string
  from: string
  embed?: string | null
  image_urls: string[]
  image_paths: string[]
}

export default function NewsEdit({ news }: { news: NewsItem }) {
  const [title, setTitle] = useState(news.title)
  const [body, setBody] = useState(news.body)
  const [date, setDate] = useState(news.date)
  const [from, setFrom] = useState(news.from)
  const [embed, setEmbed] = useState(news.embed ?? '')
  const [existingImages, setExistingImages] = useState<ExistingImage[]>(
    news.image_urls.map((url, index) => ({
      url,
      path: news.image_paths[index] ?? url
    }))
  )
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([])
  const [newImages, setNewImages] = useState<File[]>([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [compressing, setCompressing] = useState(false)

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline'],
      [{ color: [] }, { background: [] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link'], ['clean']
    ]
  }

  const formats = ['header', 'bold', 'italic', 'underline', 'color', 'background', 'list', 'link']

  async function handleAddImages(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return
    const files = Array.from(e.target.files)

    setCompressing(true)
    setMessage(`Compressing ${files.length} image(s)...`)

    try {
      const compressed = await compressMultipleImages(files, { quality: 0.8, maxWidth: 1920, maxHeight: 1080 })
      setNewImages(prev => [...prev, ...compressed])
      setMessage('Compression done!')
    } catch (err) {
      console.error(err)
      setMessage('Compression failed, using originals instead.')
      setNewImages(prev => [...prev, ...files])
    } finally {
      setCompressing(false)
      e.target.value = ''
    }
  }

  function toggleImageDeletion(path: string) {
    setImagesToDelete(prev => {
      if (prev.includes(path)) {
        return prev.filter(item => item !== path)
      }

      return [...prev, path]
    })
  }

  function removeNewImage(index: number) {
    setNewImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = () => {
    if (!title || !body || !date || !from) {
      setMessage('Title, body, date, and source are required.')
      return
    }

    setLoading(true)

    const remainingPaths = existingImages
      .filter(img => !imagesToDelete.includes(img.path))
      .map(img => img.path)

    const formData = new FormData()
    formData.append('title', title)
    formData.append('body', body)
    formData.append('date', date)
    formData.append('from', from)
    formData.append('embed', embed)
    formData.append('existingImages', JSON.stringify(remainingPaths))

    newImages.forEach((img, index) => {
      formData.append('images', img, `compressed_${index}_${img.name}`)
    })

    router.post(`/admin/news/${news.id}?_method=PUT`, formData, {
      onSuccess: () => {
        setMessage('News updated successfully!')
      },
      onError: () => {
        setMessage('Failed to update news.')
      },
      onFinish: () => setLoading(false)
    })
  }

  return (
      <>
        <Head title="Edit Berita | Admin" />
        <div className="mx-auto max-w-3xl p-4">
      <Link href="/admin/news" className="mb-4 inline-block text-blue-600 hover:text-blue-800 underline">
        Back
      </Link>

      {message && (
        <div className={`mb-4 p-2 rounded ${message.includes('successfully') ? 'bg-green-100 text-green-800' :
          message.includes('Failed') ? 'bg-red-100 text-red-800' :
            'bg-blue-100 text-blue-800'
          }`}>
          {message}
        </div>
      )}

      <form className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Title</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full border rounded p-2 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Date</label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="w-full border rounded p-2 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">From</label>
          <select
            value={from}
            onChange={e => setFrom(e.target.value)}
            className="w-full border rounded p-2 focus:border-blue-500 focus:outline-none"
          >
            {fromOptions.map(option => <option key={option} value={option}>{option}</option>)}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Embed</label>
          <input
            type="text"
            value={embed}
            onChange={e => setEmbed(e.target.value)}
            className="w-full border rounded p-2 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Existing Images</label>
          {existingImages.length === 0 ? (
            <p className="text-gray-500">No images</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {existingImages.map((image) => {
                const isMarked = imagesToDelete.includes(image.path)
                return (
                  <div key={image.path} className={`relative border rounded p-1 transition-all ${isMarked ? 'bg-red-100 border-red-300' : 'bg-white'}`}>
                    <img
                      src={image.url}
                      alt=""
                      className={`w-24 h-24 object-cover rounded transition-opacity ${isMarked ? 'opacity-40 grayscale' : 'opacity-100'}`}
                    />

                    {isMarked && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="text-red-700 font-bold text-xs bg-white/80 px-1 rounded">DELETED</span>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => toggleImageDeletion(image.path)}
                      className={`absolute top-1 right-1 px-2 pt-[4px] pb-[5px] rounded-full text-xs text-white z-10 cursor-pointer ${isMarked ? 'bg-blue-500 hover:bg-blue-600' : 'bg-red-500 hover:bg-red-600'}`}
                      title={isMarked ? 'Restore image' : 'Mark for deletion'}
                    >
                      {isMarked ? 'Cancel' : 'x'}
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div>
          <label className="block mb-1 font-medium">Add New Images</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleAddImages}
            disabled={compressing}
            className="w-full border rounded p-2"
          />
          {newImages.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {newImages.map((img, i) => (
                <div key={`${img.name}-${i}`} className="relative border rounded p-1 bg-green-50">
                  <div className="text-xs truncate max-w-24 font-medium">{img.name}</div>
                  <div className="text-gray-500 text-xs">{(img.size / 1024).toFixed(1)} KB</div>
                  <button
                    type="button"
                    onClick={() => removeNewImage(i)}
                    className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded px-1"
                  >
                    x
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block mb-1 font-medium">Body</label>
          <ReactQuill
            value={body}
            onChange={setBody}
            modules={modules}
            formats={formats}
            className="bg-white"
          />
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading || compressing}
          className={`px-4 py-2 rounded-full text-white ${loading || compressing
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
            }`}
        >
          {loading ? 'Updating...' : compressing ? 'Compressing...' : 'Update'}
        </button>
      </form>
    </div>
    </>
  )
}

NewsEdit.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>
