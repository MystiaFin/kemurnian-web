import { Head } from '@inertiajs/react'
import AdminLayout from '@/Layouts/AdminLayout'
import KurikulumList from '@AdminComponents/KurikulumList'
import ActionButton from '@AdminComponents/ActionButton'

interface Kurikulum {
    id: number
    title: string
    body: string
    preview?: string | null
    created_at: string
}

export default function KurikulumIndex({ kurikulums }: { kurikulums: Kurikulum[] }) {
    return (
        <>
            <Head title="Kurikulum | Admin" />
            <div className="p-8 bg-gray-100 min-h-screen">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Kurikulum Management</h1>
                    <ActionButton href="/admin/kurikulum/create" label="+ New Kurikulum" />
                </div>
                <KurikulumList initialKurikulums={kurikulums} />
            </div>
        </>
    )
}

KurikulumIndex.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>
