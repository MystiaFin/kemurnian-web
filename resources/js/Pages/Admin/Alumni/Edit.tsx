import { useEffect, useMemo, useRef, useState } from 'react'
import { Head, Link, router } from '@inertiajs/react'
import { RiAddLine, RiArrowDownSLine, RiArrowGoBackLine, RiCloseLine, RiPencilLine, RiSearchLine } from '@remixicon/react'
import AdminLayout from '@/Layouts/AdminLayout'

interface Option {
    id: number
    name: string
}

interface AlumniItem {
    id: number
    name: string
    graduation_year: number
    university_id?: number | null
    job_title_id?: number | null
    motto: string
    image_url?: string | null
}

interface SearchableSelectProps {
    label: string
    placeholder: string
    options: Option[]
    value: number | null
    onChange: (value: number | null) => void
    onCreate: () => void
    onEdit: (option: Option) => void
}

function SearchableSelect({ label, placeholder, options, value, onChange, onCreate, onEdit }: SearchableSelectProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [query, setQuery] = useState('')
    const wrapperRef = useRef<HTMLDivElement>(null)
    const searchRef = useRef<HTMLInputElement>(null)

    const selectedLabel = options.find((option) => option.id === value)?.name

    const filteredOptions = useMemo(() => {
        const normalized = query.trim().toLowerCase()
        if (!normalized) return options
        return options.filter((option) => option.name.toLowerCase().includes(normalized))
    }, [options, query])

    useEffect(() => {
        if (!isOpen) return
        searchRef.current?.focus()
    }, [isOpen])

    useEffect(() => {
        if (!isOpen) return

        const handleClickOutside = (event: MouseEvent) => {
            if (!wrapperRef.current?.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [isOpen])

    const handleSelect = (option: Option) => {
        onChange(option.id)
        setIsOpen(false)
        setQuery('')
    }

    return (
        <div className="relative space-y-2" ref={wrapperRef}>
            <label className="block font-medium">{label}</label>
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className="w-full border rounded-2xl p-2 flex items-center justify-between bg-transparent hover:border-gray-400 transition-colors cursor-pointer"
            >
                <span className={selectedLabel ? 'text-gray-900' : 'text-gray-500'}>
                    {selectedLabel ?? placeholder}
                </span>
                <RiArrowDownSLine size={20} className="text-gray-500" />
            </button>

            {isOpen && (
                <div className="absolute left-0 top-full z-20 mt-2 w-full rounded-2xl border bg-gray-100 shadow-lg">
                    <div className="p-2 border-b border-gray-200">
                        <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-200 px-2 py-1">
                            <RiSearchLine size={16} className="text-gray-400" />
                            <input
                                ref={searchRef}
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                                placeholder="Search..."
                                className="w-full bg-transparent focus:outline-none"
                            />
                        </div>
                    </div>
                    <ul className="max-h-60 overflow-y-auto">
                        {filteredOptions.length === 0 ? (
                            <li className="px-3 py-2 text-sm text-gray-500">No results found</li>
                        ) : (
                            filteredOptions.map((option) => (
                                <li key={option.id}>
                                    <div className="flex items-center justify-between px-3 py-2 hover:bg-gray-200">
                                        <button
                                            type="button"
                                            onClick={() => handleSelect(option)}
                                            className="flex-1 text-left"
                                        >
                                            {option.name}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => onEdit(option)}
                                            className="ml-2 rounded-full p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-300 cursor-pointer"
                                            aria-label={`Edit ${label}`}
                                            title={`Edit ${label}`}
                                        >
                                            <RiPencilLine size={14} />
                                        </button>
                                    </div>
                                </li>
                            ))
                        )}
                    </ul>
                    <button
                        type="button"
                        onClick={() => {
                            setIsOpen(false)
                            onCreate()
                        }}
                        className="w-full border-t border-gray-200 px-3 py-2 text-left text-blue-600 hover:bg-gray-200 rounded-b-2xl flex items-center gap-2"
                    >
                        <RiAddLine size={16} />
                        New {label}
                    </button>
                </div>
            )}
        </div>
    )
}

interface NewOptionModalProps {
    title: string
    value: string
    error: string
    isSaving: boolean
    onChange: (value: string) => void
    onClose: () => void
    onSave: () => void
}

function NewOptionModal({ title, value, error, isSaving, onChange, onClose, onSave }: NewOptionModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
                    <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <RiCloseLine size={20} />
                    </button>
                </div>
                <div className="mt-4 space-y-3">
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                        value={value}
                        onChange={(event) => onChange(event.target.value)}
                        className="w-full rounded border p-2 focus:border-blue-500 focus:outline-none"
                        placeholder="Type a name"
                    />
                    {error && (
                        <p className="text-sm text-red-600">{error}</p>
                    )}
                </div>
                <div className="mt-6 flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 rounded-full border text-gray-700 hover:bg-gray-100"
                        disabled={isSaving}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onSave}
                        disabled={isSaving}
                        className={`px-4 py-2 rounded-full text-white transition-colors ${
                            isSaving ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                    >
                        {isSaving ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </div>
        </div>
    )
}

interface EditOptionModalProps {
    title: string
    value: string
    error: string
    isSaving: boolean
    onChange: (value: string) => void
    onClose: () => void
    onSave: () => void
}

function EditOptionModal({ title, value, error, isSaving, onChange, onClose, onSave }: EditOptionModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
                    <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <RiCloseLine size={20} />
                    </button>
                </div>
                <div className="mt-4 space-y-3">
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                        value={value}
                        onChange={(event) => onChange(event.target.value)}
                        className="w-full rounded border p-2 focus:border-blue-500 focus:outline-none"
                        placeholder="Type a name"
                    />
                    {error && (
                        <p className="text-sm text-red-600">{error}</p>
                    )}
                </div>
                <div className="mt-6 flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 rounded-full border text-gray-700 hover:bg-gray-100"
                        disabled={isSaving}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onSave}
                        disabled={isSaving}
                        className={`px-4 py-2 rounded-full text-white transition-colors ${
                            isSaving ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                    >
                        {isSaving ? 'Saving...' : 'Update'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default function AlumniEdit({ alumni, image_path, university, jobTitles }: { alumni: AlumniItem; image_path?: string | null; university: Option[]; jobTitles: Option[] }) {
    const [name, setName] = useState(alumni.name)
    const [graduationYear, setGraduationYear] = useState(String(alumni.graduation_year))
    const [motto, setMotto] = useState(alumni.motto)
    const [universityId, setUniversityId] = useState<number | null>(alumni.university_id ?? null)
    const [jobTitleId, setJobTitleId] = useState<number | null>(alumni.job_title_id ?? null)
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [existingImage, setExistingImage] = useState(alumni.image_url ?? null)
    const [existingImagePath, setExistingImagePath] = useState(image_path ?? null)
    const [deleteExistingImage, setDeleteExistingImage] = useState(false)
    const [universityOptions, setUniversityOptions] = useState<Option[]>(university)
    const [jobTitleOptions, setJobTitleOptions] = useState<Option[]>(jobTitles)
    const [formMessage, setFormMessage] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [modalType, setModalType] = useState<'university' | 'jobTitle' | null>(null)
    const [newOptionName, setNewOptionName] = useState('')
    const [modalError, setModalError] = useState('')
    const [modalSaving, setModalSaving] = useState(false)
    const [editType, setEditType] = useState<'university' | 'jobTitle' | null>(null)
    const [editOptionId, setEditOptionId] = useState<number | null>(null)
    const [editOptionName, setEditOptionName] = useState('')
    const [editError, setEditError] = useState('')
    const [editSaving, setEditSaving] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const currentYear = new Date().getFullYear()

    const csrfToken = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ?? ''

    useEffect(() => {
        return () => {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview)
            }
        }
    }, [imagePreview])

    const openModal = (type: 'university' | 'jobTitle') => {
        setModalType(type)
        setNewOptionName('')
        setModalError('')
    }

    const closeModal = () => {
        setModalType(null)
        setNewOptionName('')
        setModalError('')
    }

    const openEditModal = (type: 'university' | 'jobTitle', option: Option) => {
        setEditType(type)
        setEditOptionId(option.id)
        setEditOptionName(option.name)
        setEditError('')
    }

    const closeEditModal = () => {
        setEditType(null)
        setEditOptionId(null)
        setEditOptionName('')
        setEditError('')
    }

    const appendOption = (type: 'university' | 'jobTitle', option: Option) => {
        if (type === 'university') {
            setUniversityOptions((prev) => [...prev, option].sort((a, b) => a.name.localeCompare(b.name)))
            setUniversityId(option.id)
        } else {
            setJobTitleOptions((prev) => [...prev, option].sort((a, b) => a.name.localeCompare(b.name)))
            setJobTitleId(option.id)
        }
    }

    const handleSaveOption = async () => {
        if (!modalType) return
        const trimmed = newOptionName.trim()
        if (!trimmed) {
            setModalError('Name is required.')
            return
        }

        setModalSaving(true)
        setModalError('')

        try {
            const endpoint = modalType === 'university'
                ? '/admin/alumni/universities'
                : '/admin/alumni/job-titles'

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify({ name: trimmed })
            })

            const payload = await response.json().catch(() => null)

            if (!response.ok) {
                setModalError(payload?.message ?? 'Failed to save. Please try again.')
                return
            }

            if (!payload?.id || !payload?.name) {
                setModalError('Invalid response. Please try again.')
                return
            }

            appendOption(modalType, payload)
            closeModal()
        } catch (error) {
            console.error(error)
            setModalError('Failed to save. Please try again.')
        } finally {
            setModalSaving(false)
        }
    }

    const handleUpdateOption = async () => {
        if (!editType || !editOptionId) return
        const trimmed = editOptionName.trim()
        if (!trimmed) {
            setEditError('Name is required.')
            return
        }

        setEditSaving(true)
        setEditError('')

        try {
            const endpoint = editType === 'university'
                ? `/admin/alumni/universities/${editOptionId}`
                : `/admin/alumni/job-titles/${editOptionId}`

            const response = await fetch(endpoint, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify({ name: trimmed })
            })

            const payload = await response.json().catch(() => null)

            if (!response.ok) {
                setEditError(payload?.message ?? 'Failed to update. Please try again.')
                return
            }

            if (!payload?.id || !payload?.name) {
                setEditError('Invalid response. Please try again.')
                return
            }

            if (editType === 'university') {
                setUniversityOptions((prev) => prev.map((item) => (
                    item.id === payload.id ? { ...item, name: payload.name } : item
                )).sort((a, b) => a.name.localeCompare(b.name)))
            } else {
                setJobTitleOptions((prev) => prev.map((item) => (
                    item.id === payload.id ? { ...item, name: payload.name } : item
                )).sort((a, b) => a.name.localeCompare(b.name)))
            }

            closeEditModal()
        } catch (error) {
            console.error(error)
            setEditError('Failed to update. Please try again.')
        } finally {
            setEditSaving(false)
        }
    }

    const handleToggleDeleteImage = () => {
        if (!existingImagePath) return
        setDeleteExistingImage((prev) => !prev)
    }

    const handleReplaceClick = () => {
        fileInputRef.current?.click()
    }

    const handleUndoReplace = () => {
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview)
        }
        setImagePreview(null)
        setImageFile(null)
    }

    const handleSubmit = () => {
        if (!name.trim() || !graduationYear.trim() || !motto.trim()) {
            setFormMessage('Name, graduation year, and motto are required.')
            return
        }

        const parsedYear = Number(graduationYear)
        if (Number.isNaN(parsedYear) || parsedYear < 1900 || parsedYear > currentYear + 1) {
            setFormMessage('Please enter a valid graduation year.')
            return
        }

        setIsSubmitting(true)
        setFormMessage('')

        const formData = new FormData()
        formData.append('name', name.trim())
        formData.append('graduation_year', String(parsedYear))
        if (universityId) {
            formData.append('university_id', String(universityId))
        }
        if (jobTitleId) {
            formData.append('job_title_id', String(jobTitleId))
        }
        formData.append('motto', motto.trim())
        if (deleteExistingImage) {
            formData.append('deleteImage', '1')
        }
        if (imageFile) {
            formData.append('image', imageFile)
        }

        router.post(`/admin/alumni/${alumni.id}?_method=PUT`, formData, {
            onSuccess: () => {
                setFormMessage('Alumni updated successfully!')
                if (imageFile) {
                    setExistingImage(imagePreview)
                    setExistingImagePath(imageFile.name)
                }
                if (deleteExistingImage) {
                    setExistingImage(null)
                    setExistingImagePath(null)
                }
                setImageFile(null)
                setDeleteExistingImage(false)
            },
            onError: () => {
                setFormMessage('Failed to update alumni entry.')
            },
            onFinish: () => setIsSubmitting(false)
        })
    }

    return (
        <>
            <Head title="Edit Alumni | Admin" />
            <div className="mx-auto max-w-3xl p-4">
                <Link href="/admin/alumni" className="mb-4 inline-block text-blue-600 hover:text-blue-800 underline">
                    Back
                </Link>

                {formMessage && (
                    <div className="mb-4 rounded bg-gray-200 p-2 text-gray-800">
                        {formMessage}
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                        <label className="block mb-1 font-medium">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            className="w-full border rounded-2xl p-2 focus:border-blue-500 focus:outline-none"
                            placeholder="Alumni name"
                            disabled={isSubmitting}
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Graduation Year</label>
                        <input
                            type="number"
                            value={graduationYear}
                            onChange={(event) => setGraduationYear(event.target.value)}
                            className="w-full border rounded-2xl p-2 focus:border-blue-500 focus:outline-none"
                            min={1900}
                            max={currentYear + 1}
                            placeholder="e.g. 2023"
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="relative">
                        <SearchableSelect
                            label="University"
                            placeholder="Select university"
                            options={universityOptions}
                            value={universityId}
                            onChange={setUniversityId}
                            onCreate={() => openModal('university')}
                            onEdit={(option) => openEditModal('university', option)}
                        />
                    </div>

                    <div className="relative">
                        <SearchableSelect
                            label="Job Title"
                            placeholder="Select job title"
                            options={jobTitleOptions}
                            value={jobTitleId}
                            onChange={setJobTitleId}
                            onCreate={() => openModal('jobTitle')}
                            onEdit={(option) => openEditModal('jobTitle', option)}
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Motto</label>
                        <textarea
                            value={motto}
                            onChange={(event) => setMotto(event.target.value)}
                            className="w-full border rounded-2xl p-2 focus:border-blue-500 focus:outline-none"
                            rows={3}
                            placeholder="Short motto"
                            disabled={isSubmitting}
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Image</label>
                        <div className="flex flex-wrap items-start gap-4">
                            <div className="relative h-40 w-40">
                                {imagePreview ? (
                                    <img
                                        src={imagePreview}
                                        alt="New preview"
                                        className="h-full w-full rounded object-cover border"
                                    />
                                ) : existingImage ? (
                                    <div className={`relative h-full w-full ${deleteExistingImage ? 'opacity-40 grayscale' : ''}`}>
                                        <img
                                            src={existingImage}
                                            alt="Alumni"
                                            className="h-full w-full rounded object-cover border"
                                        />
                                        {deleteExistingImage && (
                                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                <span className="text-red-700 font-bold text-xs bg-white/80 px-1 rounded">DELETED</span>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="h-full w-full rounded border border-dashed border-gray-300 flex items-center justify-center text-xs text-gray-500">
                                        No image
                                    </div>
                                )}

                                {imagePreview && (
                                    <button
                                        type="button"
                                        onClick={handleUndoReplace}
                                        className="absolute top-2 right-2 rounded-full bg-white/90 text-gray-700 hover:text-gray-900 hover:bg-white p-1 shadow cursor-pointer"
                                        aria-label="Undo image replacement"
                                        title="Undo"
                                        disabled={isSubmitting}
                                    >
                                        <RiArrowGoBackLine size={16} />
                                    </button>
                                )}
                            </div>

                            <div className="flex flex-col gap-2">
                                <button
                                    type="button"
                                    onClick={handleReplaceClick}
                                    className="px-4 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                                    disabled={isSubmitting}
                                >
                                    Replace image
                                </button>
                                {existingImage && !imagePreview && (
                                    <button
                                        type="button"
                                        onClick={handleToggleDeleteImage}
                                        className={`px-4 py-2 rounded-full text-white transition-colors cursor-pointer ${deleteExistingImage ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'}`}
                                        disabled={isSubmitting}
                                    >
                                        {deleteExistingImage ? 'Undo delete' : 'Delete image'}
                                    </button>
                                )}
                            </div>
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={(event) => {
                                const file = event.target.files?.[0] ?? null
                                if (imagePreview) {
                                    URL.revokeObjectURL(imagePreview)
                                }
                                setImageFile(file)
                                setImagePreview(file ? URL.createObjectURL(file) : null)
                                if (file) {
                                    setDeleteExistingImage(false)
                                }
                                event.target.value = ''
                            }}
                            className="hidden"
                            disabled={isSubmitting}
                        />
                    </div>

                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className={`px-4 py-2 rounded-full text-white transition-colors ${
                            isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                    >
                        {isSubmitting ? 'Updating...' : 'Update Entry'}
                    </button>
                </div>
            </div>

            {modalType && (
                <NewOptionModal
                    title={modalType === 'university' ? 'New University' : 'New Job Title'}
                    value={newOptionName}
                    error={modalError}
                    isSaving={modalSaving}
                    onChange={setNewOptionName}
                    onClose={closeModal}
                    onSave={handleSaveOption}
                />
            )}

            {editType && (
                <EditOptionModal
                    title={editType === 'university' ? 'Edit University' : 'Edit Job Title'}
                    value={editOptionName}
                    error={editError}
                    isSaving={editSaving}
                    onChange={setEditOptionName}
                    onClose={closeEditModal}
                    onSave={handleUpdateOption}
                />
            )}
        </>
    )
}

AlumniEdit.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>
