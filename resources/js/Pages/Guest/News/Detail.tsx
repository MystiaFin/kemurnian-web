import { Head } from '@inertiajs/react'
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
            <>
                <Head title="Berita | Sekolah Kemurnian" />
                <div className="py-12">
                    <SectionHeader title="BERITA" as="h1" />
                    <p className="text-center font-merriweather">News not found.</p>
                </div>
            </>
        )
    }

    const hasEmbed = Boolean(news.embed && news.embed.trim().length > 0)

    return (
        <>
            <Head title={`${news.title} - News`} />
            <div className="flex justify-center items-center flex-col px-4 py-8">
                <h1 className="font-raleway font-extrabold tracking-widest uppercase text-2xl mb-4 text-center mt-4 md:mt-12">
                    {news.title}
                </h1>
                <p className="text-center underline text-btn-primary font-bold text-lg mb-4">
                    {new Date(news.date).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                    })}
                </p>

                {hasEmbed ? (
                    <div className="w-full max-w-2xl md:max-w-3xl my-8 flex justify-center">
                        <div
                            className="relative w-full aspect-video [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:absolute [&>iframe]:top-0 [&>iframe]:left-0"
                            dangerouslySetInnerHTML={{ __html: news.embed ?? '' }}
                        />
                    </div>
                ) : (
                    news.image_urls?.length > 0 && (
                        <ImageCardSlider images={news.image_urls} alt={news.title} />
                    )
                )}

                <QuillRenderer
                    content={news.body}
                    className="text-justify text-sm md:text-base font-merriweather font-light tracking-wider leading-loose max-w-2xl md:max-w-3xl w-full"
                />

                <hr className="clear-both mx-auto my-10 h-0 w-3/4 md:max-w-4xl border-0 border-t-[3px] border-solid border-[#8b0000]" />

                <h2 className="font-raleway font-extrabold text-2xl text-center mb-8">
                    OTHER NEWS AND EVENTS
                </h2>

                {otherNews.length > 0 ? (
                    <div className="w-full max-w-6xl">
                        <NewsPreview news={otherNews} />
                    </div>
                ) : (
                    <p className="text-gray-600 font-merriweather">No other recent news available.</p>
                )}
            </div>
        </>
    )
}

NewsDetail.layout = (page: React.ReactNode) => <GuestLayout>{page}</GuestLayout>
