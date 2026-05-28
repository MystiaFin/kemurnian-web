import { useMemo, useState } from 'react'
import { Link, router } from '@inertiajs/react'
import ConfirmationModal from '@AdminComponents/ConfirmationModal'

export interface AlumniItem {
    id: number
    name: string
    graduation_year: number
    university?: string | null
    job_title?: string | null
    motto: string
    image_url?: string | null
}

function resolveImageUrl(url?: string | null) {
    if (!url) return null
    if (url.startsWith('http')) return url
    const clean = url.replace(/^\/+/, '')
    return `/uploads/${clean}`
}

export default function AlumniList({ alumni }: { alumni: AlumniItem[] }) {
    const [items, setItems] = useState<AlumniItem[]>(alumni)
    const hasItems = useMemo(() => items.length > 0, [items.length])
    const [itemToDelete, setItemToDelete] = useState<AlumniItem | null>(null)

    const handleConfirmDelete = () => {
        if (!itemToDelete) return

        router.delete(`/admin/alumni/${itemToDelete.id}`, {
            onSuccess: () => {
                setItems((prev) => prev.filter((item) => item.id !== itemToDelete.id))
                setItemToDelete(null)
            }
        })
    }

    if (!hasItems) {
        return (
            <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg">
                <svg
                    className="w-16 h-16 text-gray-400 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6l-2 4-4 .5 3 3-.7 4.5 3.7-2 3.7 2-.7-4.5 3-3-4-.5-2-4z"
                    />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No alumni entries yet</h3>
            </div>
        )
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {items.map((item) => {
                    const imageUrl = resolveImageUrl(item.image_url)

                    return (
                        <div
                            key={item.id}
                            className="relative bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col items-center p-6"
                        >
                        <div className="absolute right-3 top-3 flex items-center gap-2">
                            <Link
                                href={`/admin/alumni/edit/${item.id}`}
                                aria-label="Edit alumni"
                                title="Edit"
                                className="bg-blue-600 hover:bg-blue-700 text-white p-1.5 rounded-full shadow-sm transition-colors duration-200 cursor-pointer"
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
                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    />
                                </svg>
                            </Link>

                            <button
                                type="button"
                                aria-label="Delete alumni"
                                title="Delete"
                                className="bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-full transition-colors duration-200 cursor-pointer"
                                onClick={() => setItemToDelete(item)}
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
                        <div className="h-28 w-28 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                            {imageUrl ? (
                                <img
                                    src={imageUrl}
                                    alt={item.name}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <svg
                                    className="w-12 h-12 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.648 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                </svg>
                            )}
                        </div>

                        <div className="mt-4 text-center">
                            <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">
                                {item.name}
                            </h3>
                            <p className="text-xs text-gray-700">Class of {item.graduation_year}</p>
                            {item.university && (
                                <p className="text-xs text-gray-700 mt-1">{item.university}</p>
                            )}
                            {item.job_title && (
                                <p className="text-xs text-gray-700 mt-1">{item.job_title}</p>
                            )}
                            <p className="text-xs text-gray-700 mt-3 line-clamp-3">
                                {item.motto}
                            </p>
                        </div>
                        </div>
                    )
                })}
            </div>
            {itemToDelete && (
                <ConfirmationModal
                    item={{ title: itemToDelete.name }}
                    onConfirm={handleConfirmDelete}
                    onCancel={() => setItemToDelete(null)}
                />
            )}
        </>
    )
}