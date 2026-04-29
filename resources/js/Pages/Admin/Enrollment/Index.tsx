import { Head } from '@inertiajs/react'
import AdminLayout from '@/Layouts/AdminLayout'
import ActionButton from '@AdminComponents/ActionButton'
import { Link } from '@inertiajs/react'

interface EnrollmentItem {
    id: number
    title: string
    body: string
    date: string
    image_url?: string | null
}

export default function EnrollmentIndex({ enrollment }: { enrollment: EnrollmentItem | null }) {
    return (
        <>
            <Head title="Pendaftaran | Admin" />
            <div className="flex flex-col p-8 bg-gray-100 w-full min-h-screen">
                <h1 className="flex flex-col justify-start text-3xl font-bold mb-6">Enrollment Management</h1>
                {!enrollment ? (
                    <div className="flex flex-col justify-center items-center text-gray-600 text-center gap-3">
                        No enrollment data found.
                        <ActionButton href="/admin/enrollment/create" label="+ Add Enrollment" />
                    </div>
                ) : (
                    <div className="p-6 bg-white rounded shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                {enrollment.title}
                            </h2>
                            <p className="text-sm text-gray-600">{enrollment.date}</p>
                            {enrollment.image_url && (
                                <img
                                    src={enrollment.image_url}
                                    alt={enrollment.title}
                                    className="mt-3 w-48 h-32 object-cover rounded"
                                />
                            )}
                        </div>

                        <Link
                            href={`/admin/enrollment/edit/${enrollment.id}`}
                            className="px-4 py-2 bg-btn-primary text-white rounded hover:bg-red-primary transition-colors"
                        >
                            Edit
                        </Link>
                    </div>
                )}
            </div>
        </>
    )
}

EnrollmentIndex.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>
