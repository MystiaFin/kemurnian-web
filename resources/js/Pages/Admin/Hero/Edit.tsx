import { useState } from 'react'
import { Link, router } from '@inertiajs/react'
import { useImageCompression, DeviceType } from '@/Hooks/useImageCompression'
import AdminLayout from '@/Layouts/AdminLayout'

interface HeroRecord {
  id: number
  header_text: string | null
  button_text: string | null
  href: string | null
  desktop_image: string | null
  tablet_image: string | null
  mobile_image: string | null
}

export default function HeroEdit({ hero }: { hero: HeroRecord }) {
  const [headerText, setHeaderText] = useState(hero.header_text || '')
  const [buttonText, setButtonText] = useState(hero.button_text || '')
  const [hrefText, setHrefText] = useState(hero.href || '')
  const [desktopImage, setDesktopImage] = useState<File | null>(null)
  const [tabletImage, setTabletImage] = useState<File | null>(null)
  const [mobileImage, setMobileImage] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const { compressImage, isCompressing, successMessage } = useImageCompression()
  const isAnyCompressing = isCompressing.desktop || isCompressing.tablet || isCompressing.mobile

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>, deviceType: DeviceType) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const compressed = await compressImage(file, deviceType)
      if (deviceType === 'desktop') setDesktopImage(compressed)
      else if (deviceType === 'tablet') setTabletImage(compressed)
      else setMobileImage(compressed)
    } catch (err: any) {
      setErrorMessage(err.message)
    }
  }

  const removeImage = (deviceType: DeviceType) => {
    if (deviceType === 'desktop') setDesktopImage(null)
    else if (deviceType === 'tablet') setTabletImage(null)
    else setMobileImage(null)
  }

  const handleSubmit = () => {
    setIsSubmitting(true)
    const formData = new FormData()
    formData.append('_method', 'put')
    formData.append('headerText', headerText)
    formData.append('buttonText', buttonText)
    formData.append('hrefText', hrefText)
    if (desktopImage) formData.append('desktopImage', desktopImage)
    if (tabletImage) formData.append('tabletImage', tabletImage)
    if (mobileImage) formData.append('mobileImage', mobileImage)

    router.post(`/admin/hero/${hero.id}`, formData, {
      onError: () => {
        setErrorMessage('Failed to update hero banner.')
        setIsSubmitting(false)
      }
    })
  }

  const renderPreview = (image: File | null, deviceType: DeviceType) => {
    if (!image) return null
    return (
      <div className="mt-3 border rounded p-2 bg-green-50 flex items-center justify-between">
        <div>
          <span className="text-xs text-gray-700 font-medium">{image.name}</span>
          <p className="text-xs text-gray-600">{(image.size / 1024).toFixed(1)} KB</p>
        </div>
        <button type="button" onClick={() => removeImage(deviceType)} className="text-red-500 hover:text-red-700 ml-2 text-lg font-bold">×</button>
      </div>
    )
  }

  const renderExisting = (imageUrl: string | null, label: string) => {
    if (!imageUrl) return null
    return (
      <div className="mt-2">
        <p className="text-xs text-gray-500">Current {label} image</p>
        <img src={imageUrl} alt={label} className="mt-2 h-24 w-auto rounded border object-cover" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl p-4">
      <Link href="/admin/hero" className="mb-4 inline-block text-blue-600 hover:text-blue-800 underline">
        ← Back to Hero Banners
      </Link>

      {successMessage && <div className="mb-4 bg-green-100 text-green-800 p-2 rounded">{successMessage}</div>}
      {errorMessage && <div className="mb-4 bg-red-100 text-red-800 p-2 rounded">{errorMessage}</div>}

      <div className="space-y-6">
        <div>
          <label className="block mb-1 font-medium">Header Text (optional)</label>
          <input type="text" value={headerText} onChange={e => setHeaderText(e.target.value)} className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block mb-1 font-medium">Button Text (optional)</label>
          <input type="text" value={buttonText} onChange={e => setButtonText(e.target.value)} className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block mb-1 font-medium">Link URL (optional)</label>
          <input type="text" value={hrefText} onChange={e => setHrefText(e.target.value)} className="w-full border rounded p-2" />
        </div>

        {(['desktop', 'tablet', 'mobile'] as DeviceType[]).map((device) => {
          const image = device === 'desktop' ? desktopImage : device === 'tablet' ? tabletImage : mobileImage
          return (
            <div key={device}>
              <label className="block mb-1 font-medium capitalize">{device} Image {device === 'desktop' ? '*' : '(optional)'}
              </label>
              {!image && (
                <input type="file" accept="image/*" onChange={e => handleImageChange(e, device)} className="border p-2 w-full rounded" />
              )}
              {renderPreview(image, device)}
              {device === 'desktop' && renderExisting(hero.desktop_image, 'desktop')}
              {device === 'tablet' && renderExisting(hero.tablet_image, 'tablet')}
              {device === 'mobile' && renderExisting(hero.mobile_image, 'mobile')}
            </div>
          )
        })}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting || isAnyCompressing}
          className={`px-4 py-2 rounded text-white transition-colors ${isSubmitting || isAnyCompressing ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {isSubmitting ? 'Saving...' : isAnyCompressing ? 'Compressing...' : 'Update Hero Banner'}
        </button>
      </div>
    </div>
  )
}

HeroEdit.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>
