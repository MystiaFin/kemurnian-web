import { useState } from 'react'
import { Head } from '@inertiajs/react'
import GuestLayout from '@/Layouts/GuestLayout'
import NewsCategoryFilter from '@GuestComponents/NewsCategoryFilter'
import NewsPreview from '@GuestComponents/NewsPreview'
import SectionHeader from '@GuestComponents/SectionHeader'

interface NewsRecord {
  id: number
  title: string
  body: string
  date: string
  image_urls: string[]
}

interface NewsCategoryProps {
  category: string
  allNews: NewsRecord[]
  initialNews: NewsRecord[]
}

const categoryTitles: Record<string, string> = {
  'sekolah-kemurnian': 'SEKOLAH KEMURNIAN',
  'sekolah-kemurnian-ii': 'SEKOLAH KEMURNIAN II',
  'sekolah-kemurnian-iii': 'SEKOLAH KEMURNIAN III',
}

export default function NewsCategory({ category, allNews, initialNews }: NewsCategoryProps) {
  const [visibleCount, setVisibleCount] = useState(initialNews.length)

  const visibleNews = allNews.slice(0, visibleCount)
  const hasMore = visibleCount < allNews.length

  return (
    <>
      <Head title={`${categoryTitles[category] || 'Berita'} | Sekolah Kemurnian`} />
      <div className="py-12">
        <SectionHeader title={categoryTitles[category] || 'BERITA'} as="h1" />
        <NewsCategoryFilter />
        <NewsPreview news={visibleNews} />
        {hasMore && (
          <div className="mt-8 flex justify-center">
            <button
              className="px-6 py-3 border-2 border-btn-primary text-btn-primary font-raleway font-bold tracking-widest hover:bg-btn-primary hover:text-white transition"
              onClick={() => setVisibleCount((prev) => Math.min(prev + 12, allNews.length))}
              type="button"
            >
              LOAD MORE
            </button>
          </div>
        )}
      </div>
    </>
  )
}

NewsCategory.layout = (page: React.ReactNode) => <GuestLayout>{page}</GuestLayout>
