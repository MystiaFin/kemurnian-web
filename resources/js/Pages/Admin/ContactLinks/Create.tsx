import { useState } from 'react'
import { Head, Link, router } from '@inertiajs/react'
import AdminLayout from '@/Layouts/AdminLayout'

interface Option {
    value: string
    label: string
}

export default function ContactLinksCreate({ schoolGroups, schoolLevels }: { schoolGroups: Option[]; schoolLevels: Option[] }) {
    const [name, setName] = useState('')
    const [schoolGroup, setSchoolGroup] = useState('')
    const [schoolLevel, setSchoolLevel] = useState('')
    const [url, setUrl] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const handleSubmit = () => {
        if (!name.trim() || !schoolGroup || !schoolLevel || !url.trim()) {
            setErrorMessage('All fields are required.')
            return
        }

        setIsSubmitting(true)
        setErrorMessage('')

        router.post('/admin/contact-links', {
            name: name.trim(),
            school_group: schoolGroup,
            school_level: schoolLevel,
            url: url.trim(),
        }, {
            onError: () => {
                setErrorMessage('Failed to create contact link.')
                setIsSubmitting(false)
            }
        })
    }

    return (
        <>
            <Head title="Create Contact Link | Admin" />
            <div className="mx-auto max-w-3xl p-4">
                <Link href="/admin/contact-links" className="mb-4 inline-block text-blue-600 hover:text-blue-800 underline">
                    Back to Contact Links
                </Link>

                {errorMessage && (
                    <div className="mb-4 bg-red-100 text-red-800 p-2 rounded">{errorMessage}</div>
                )}

                <div className="space-y-4">
                    <div>
                        <label className="block mb-1 font-medium">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border rounded-2xl p-2 focus:border-blue-500 focus:outline-none"
                            placeholder="e.g. Admin WA TK"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">School Group</label>
                        <select
                            value={schoolGroup}
                            onChange={(e) => setSchoolGroup(e.target.value)}
                            className="w-full border rounded-2xl p-2 focus:border-blue-500 focus:outline-none bg-white"
                        >
                            <option value="">Select group</option>
                            {schoolGroups.map((group) => (
                                <option key={group.value} value={group.value}>
                                    {group.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">School Level</label>
                        <select
                            value={schoolLevel}
                            onChange={(e) => setSchoolLevel(e.target.value)}
                            className="w-full border rounded-2xl p-2 focus:border-blue-500 focus:outline-none bg-white"
                        >
                            <option value="">Select level</option>
                            {schoolLevels.map((level) => (
                                <option key={level.value} value={level.value}>
                                    {level.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">URL</label>
                        <input
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="w-full border rounded-2xl p-2 focus:border-blue-500 focus:outline-none"
                            placeholder="https://wa.me/628..."
                        />
                    </div>

                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className={`px-4 py-2 rounded-full text-white transition-colors cursor-pointer ${
                            isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                    >
                        {isSubmitting ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </div>
        </>
    )
}

ContactLinksCreate.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>
