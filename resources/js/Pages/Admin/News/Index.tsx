import { Head } from '@inertiajs/react'
import AdminLayout from '@/Layouts/AdminLayout'
import ActionButton from '@AdminComponents/ActionButton'
import NewsList, { NewsItem } from '@AdminComponents/NewsList'

export default function NewsIndex({ news }: { news: NewsItem[] }) {
    return (
        <>
            <Head title="Berita | Admin" />
            <div className="p-8 bg-gray-100 min-h-screen">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">News Management</h1>
                    <ActionButton href="/admin/news/create" label="+ Add News" />
                </div>
                <NewsList initialNews={news} />
            </div>
        </>
    )
}

NewsIndex.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>
