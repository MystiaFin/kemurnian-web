import { Head } from '@inertiajs/react'
import GuestLayout from '@/Layouts/GuestLayout'
import ImageCardSlider from '@GuestComponents/ImageCardSlider'
import SchoolUnitsGrid from '@GuestComponents/SchoolUnitsGrid'
import SectionHeader from '@GuestComponents/SectionHeader'
import schools from '@/data/schools.json'

interface FasilitasRecord {
    id: number
    title: string
    image_urls?: string | null
}

interface SchoolIndexProps {
    sekolah: string
    fasilitas: FasilitasRecord[]
}

interface SchoolData {
    title: string
    image_path: string
    units: { nama_sekolah: string }[]
}

const schoolData = schools as Record<string, SchoolData>

export default function SchoolIndex({ sekolah, fasilitas }: SchoolIndexProps) {
    const currentSchool = schoolData[sekolah]

    if (!currentSchool) {
        return (
            <>
                <Head title="Sekolah Kemurnian" />
                <div className="py-12">
                    <SectionHeader title="SEKOLAH" as="h1" />
                    <p className="text-center font-merriweather">Sekolah not found.</p>
                </div>
            </>
        )
    }

    const images = fasilitas.map((item) => item.image_urls).filter(Boolean) as string[]
    const titles = fasilitas.map((item) => item.title)

    return (
        <>
            <Head title={currentSchool.title} />
            <div className="pt-0 pb-12">
                <div className="flex items-center justify-center mb-8 w-full h-48 md:h-86 bg-red-primary text-white text-2xl md:text-6xl font-raleway font-bold text-center uppercase">
                    <h1>{currentSchool.title}</h1>
                </div>
                <SectionHeader title="UNIT SEKOLAH" as="h2" />
                <section className="mx-auto max-w-5xl px-4">
                    <SchoolUnitsGrid units={currentSchool.units} />
                </section>
                {images.length > 0 && (
                    <section className="mb-16">
                        <SectionHeader title="FASILITAS" />
                        <div className="flex justify-center">
                            <ImageCardSlider images={images} alt={`Fasilitas ${currentSchool.title}`} title={titles} />
                        </div>
                    </section>
                )}
            </div>
        </>
    )
}

SchoolIndex.layout = (page: React.ReactNode) => <GuestLayout>{page}</GuestLayout>
