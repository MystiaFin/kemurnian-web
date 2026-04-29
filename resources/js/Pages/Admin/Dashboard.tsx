import { useState } from 'react'
import { Head } from '@inertiajs/react'
import AdminLayout from '@/Layouts/AdminLayout'

const presets = [
  { label: 'Mobile', value: 375 },
  { label: 'Tablet', value: 768 },
  { label: 'Laptop', value: 1280 },
  { label: 'Desktop', value: 1920 },
]

export default function Dashboard({ siteUrl }: { siteUrl: string }) {
  const [width, setWidth] = useState(1040)

  const handleWidthChange = (value: number) => {
    if (value < 320) value = 320
    if (value > 1920) value = 1920
    setWidth(value)
  }

  return (
    <>
      <Head title="Dashboard | Admin" />
      <div className="p-6 h-screen flex flex-col">
      <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
      <p className="text-gray-600 mb-4">Responsive Website Preview</p>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <label className="text-sm font-medium text-gray-700">Width:</label>

        <input
          type="range"
          min={320}
          max={1920}
          value={width}
          onChange={(e) => handleWidthChange(Number(e.target.value))}
          className="w-48 cursor-pointer"
        />

        <input
          type="number"
          min={320}
          max={1920}
          value={width}
          onChange={(e) => handleWidthChange(Number(e.target.value))}
          className="w-20 border rounded px-2 py-1 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <span className="text-sm text-gray-600">px</span>

        <div className="flex items-center gap-2">
          {presets.map((preset) => (
            <button
              key={preset.label}
              onClick={() => handleWidthChange(preset.value)}
              className={`px-3 py-1 text-sm rounded border transition-colors ${
                width === preset.value
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <div
        className="shadow-lg bg-white rounded-lg overflow-hidden"
        style={{ width: `${width}px`, height: '100%' }}
      >
        <iframe
          src={siteUrl}
          className="w-full h-full border-none"
          loading="lazy"
          allowFullScreen
        />
      </div>
    </div>
    </>
  )
}

Dashboard.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>
