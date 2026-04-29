import { Head } from '@inertiajs/react'
import GuestLayout from '@/Layouts/GuestLayout'
import QuillRenderer from '@GuestComponents/QuillRenderer'
import SectionHeader from '@GuestComponents/SectionHeader'

interface KurikulumRecord {
    id: number
    title: string
    body: string
}

export default function KurikulumDetail({ kurikulum }: { kurikulum?: KurikulumRecord | null }) {
    if (!kurikulum) {
        return (
            <>
                <Head title="Kurikulum | Sekolah Kemurnian" />
                <div className="py-12">
                    <SectionHeader title="KURIKULUM" as="h1" />
                    <p className="text-center font-merriweather">Kurikulum not found.</p>
                </div>
            </>
        )
    }

    return (
        <>
            <Head title={`${kurikulum.title}`} />
            <h1 className="flex items-center justify-center mb-8 w-full h-40 md:h-86 bg-red-primary text-white text-4xl md:text-6xl font-raleway font-bold text-center uppercase">
                {kurikulum.title}
            </h1>
            <section className="flex justify-center mb-10">
                <div className="w-full px-4 max-w-3xl">
                    <QuillRenderer
                        content={kurikulum.body}
                        className="font-merriweather font-[100] leading-loose tracking-wider text-justify text-xs md:text-lg"
                    />
                </div>
            </section>
        </>
    )
}

KurikulumDetail.layout = (page: React.ReactNode) => <GuestLayout>{page}</GuestLayout>
