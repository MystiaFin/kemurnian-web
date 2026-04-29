import { useState } from 'react'
import { Head } from '@inertiajs/react'
import AdminLayout from '@/Layouts/AdminLayout'
import ActionButton from '@AdminComponents/ActionButton'
import { router } from '@inertiajs/react'

interface FasilitasItem {
    id: number
    nama_sekolah: string
    title: string
    image_url: string
}

const sekolahList = [
    { key: 'sekolah-kemurnian-1', label: 'Sekolah Kemurnian I' },
    { key: 'sekolah-kemurnian-2', label: 'Sekolah Kemurnian II' },
    { key: 'sekolah-kemurnian-3', label: 'Sekolah Kemurnian III' },
]

export default function FasilitasIndex({ grouped }: { grouped: Record<string, FasilitasItem[]> }) {
    const [data, setData] = useState(grouped)
    const [open, setOpen] = useState<Record<string, boolean>>(
        Object.fromEntries(sekolahList.map((s) => [s.key, true]))
    )

    const handleDelete = (id: number, school: string) => {
        if (!confirm('Are you sure you want to delete this facility?')) return

        router.delete(`/admin/fasilitas/${id}`, {
            onSuccess: () => {
                setData(prev => ({
                    ...prev,
                    [school]: prev[school]?.filter(item => item.id !== id) ?? []
                }))
            }
        })
    }

    return (
        <>
            <Head title="Fasilitas | Admin" />
            <div className="p-8 space-y-6">
                <div className="flex justify-between">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">
                        Fasilitas Management
                    </h1>
                    <ActionButton href="/admin/fasilitas/create" label="+ Add New" />
                </div>

                {sekolahList.map((sekolah) => (
                    <div key={sekolah.key} className="border rounded-lg shadow-sm bg-white">
                        <button
                            onClick={() =>
                                setOpen((prev) => ({
                                    ...prev,
                                    [sekolah.key]: !prev[sekolah.key],
                                }))
                            }
                            className="w-full flex justify-between items-center px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-t-lg cursor-pointer"
                        >
                            <span className="font-semibold text-lg">{sekolah.label}</span>
                            <span>{open[sekolah.key] ? '-' : '+'}</span>
                        </button>

                        {open[sekolah.key] && (
                            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {data[sekolah.key]?.length ? (
                                    data[sekolah.key].map((item) => (
                                        <div
                                            key={item.id}
                                            className="relative border rounded-lg shadow-sm overflow-hidden"
                                        >
                                            <img
                                                src={item.image_url}
                                                alt={item.title}
                                                className="w-full h-48 object-cover"
                                            />
                                            <button
                                                onClick={() => handleDelete(item.id, sekolah.key)}
                                                className="absolute top-2 right-2 bg-white/90 text-red-600 hover:text-red-800 hover:bg-red-50 p-1.5 rounded-full shadow cursor-pointer"
                                            >
                                                <svg
                                                    className="w-4 h-4"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 italic">No images available</p>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </>
    )
}

FasilitasIndex.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>
