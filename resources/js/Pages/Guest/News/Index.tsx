import { useState } from 'react'
import GuestLayout from '@/Layouts/GuestLayout'
import NewsPreview from '@GuestComponents/NewsPreview'
import SectionHeader from '@GuestComponents/SectionHeader'

interface NewsRecord {
  id: number
  title: string
  body: string
  date: string
  image_urls: string[]
}

interface NewsIndexProps {
  allNews: NewsRecord[]
  initialNews: NewsRecord[]
}

export default function NewsIndex({ allNews, initialNews }: NewsIndexProps) {
  const [visibleCount, setVisibleCount] = useState(initialNews.length)

  const visibleNews = allNews.slice(0, visibleCount)
  const hasMore = visibleCount < allNews.length

  return (
    <div className="py-12">
      <SectionHeader title="BERITA" as="h1" />
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
  )
}

NewsIndex.layout = (page: React.ReactNode) => <GuestLayout>{page}</GuestLayout>
