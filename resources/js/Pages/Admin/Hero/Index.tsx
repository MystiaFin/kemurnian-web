import { Head } from '@inertiajs/react'
import HeroList from '@AdminComponents/HeroList'
import ActionButton from '@AdminComponents/ActionButton'
import AdminLayout from '@/Layouts/AdminLayout'

interface Hero {
  id: number
  image_urls: string
  order: number
  header_text: string
}

export default function HeroIndex({ heroes }: { heroes: Hero[] }) {
  return (
    <>
      <Head title="Hero Slider | Admin" />
      <div className="p-8 bg-gray-100 min-h-screen">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold mb-4">Hero Slider Admin</h1>
        <ActionButton href="/admin/hero/create" label="+ New Banner" />
      </div>
      <HeroList initialImages={heroes} />
    </div>
    </>
  )
}

HeroIndex.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>
