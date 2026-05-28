import { Head } from '@inertiajs/react'
import AdminLayout from '@/Layouts/AdminLayout'
import ActionButton from '@AdminComponents/ActionButton'
import AlumniList, { AlumniItem } from '@AdminComponents/AlumniList'

export default function AlumniIndex({ alumni }: { alumni: AlumniItem[] }) {
    return(
        <>
            <Head title="Alumni | Admin" />
            <div className="p-8 bg-gray-100 min-h-screen">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Alumni Management</h1>
                    <ActionButton href="/admin/alumni/create" label="Create Entry" />
                </div>
                <AlumniList alumni={alumni} />
            </div>
        </>
    )
}

AlumniIndex.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>
