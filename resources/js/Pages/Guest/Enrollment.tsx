import { Head } from '@inertiajs/react'
import GuestLayout from '@/Layouts/GuestLayout'
import QuillRenderer from '@GuestComponents/QuillRenderer'

interface EnrollmentRecord {
    id: number
    title: string
    body: string
    date: string
    image_url?: string | null
}

export default function Enrollment({ enrollment }: { enrollment?: EnrollmentRecord | null }) {
    return (
        <>
            <Head title="Pendaftaran | Sekolah Kemurnian" />
            <main className="flex flex-col items-center justify-center mt-10 mx-5 md:mx-0">
            {enrollment ? (
                <>
                    <h1 className="text-center tracking-widest font-raleway font-extrabold text-lg md:text-2xl text-[#252525]">
                        {enrollment.title}
                    </h1>
                    <hr className="mx-auto my-5 w-[240px] border-t-[4px] border-solid border-[#8b0000]" />
                    {enrollment.image_url && (
                        <img
                            src={enrollment.image_url}
                            alt={enrollment.title}
                            width={450}
                            height={450}
                            className="mb-6"
                        />
                    )}
                    <h2 className="font-raleway font-bold text-md md:text-lg mb-10">
                        {new Date(enrollment.date).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                        })}
                    </h2>
                    <QuillRenderer
                        content={enrollment.body}
                        className="max-w-2xl font-merriweather font-light text-xs md:text-lg leading-loose"
                    />
                </>
            ) : (
                <p className="font-merriweather text-center text-sm md:text-base">
                    Informasi penerimaan siswa belum tersedia.
                </p>
            )}
            </main>
        </>
    )
}

Enrollment.layout = (page: React.ReactNode) => <GuestLayout>{page}</GuestLayout>
