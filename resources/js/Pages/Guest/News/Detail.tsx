import GuestLayout from '@/Layouts/GuestLayout'
import ImageCardSlider from '@GuestComponents/ImageCardSlider'
import NewsPreview from '@GuestComponents/NewsPreview'
import QuillRenderer from '@GuestComponents/QuillRenderer'
import SectionHeader from '@GuestComponents/SectionHeader'

interface NewsRecord {
  id: number
  title: string
  body: string
  date: string
  from?: string | null
  embed?: string | null
  image_urls: string[]
}

export default function NewsDetail({ news, otherNews }: { news?: NewsRecord | null; otherNews: NewsRecord[] }) {
  if (!news) {
    return (
      <div className="py-12">
        <SectionHeader title="BERITA" as="h1" />
        <p className="text-center font-merriweather">News not found.</p>
      </div>
    )
  }

  return (
    <div className="py-12">
      <SectionHeader title="BERITA" as="h1" />
      <section className="mx-auto max-w-4xl px-4">
        <p className="text-sm text-gray-500 mb-2">
          {new Date(news.date).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </p>
        <h2 className="font-raleway font-extrabold text-2xl md:text-3xl mb-6">
          {news.title}
        </h2>
        <ImageCardSlider images={news.image_urls || []} alt={news.title} />
        <QuillRenderer content={news.body} className="mt-6" />
        {news.embed && (
          <div className="mt-6">
            <iframe
              src={news.embed}
              title="News embed"
              className="w-full h-64 md:h-96"
              allowFullScreen
            />
          </div>
        )}
      </section>
      {otherNews.length > 0 && (
        <section className="mt-12">
          <SectionHeader title="BERITA LAINNYA" as="h2" />
          <NewsPreview news={otherNews} />
        </section>
      )}
    </div>
  )
}

NewsDetail.layout = (page: React.ReactNode) => <GuestLayout>{page}</GuestLayout>
