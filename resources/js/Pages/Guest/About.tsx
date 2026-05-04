import { Head } from '@inertiajs/react'
import GuestLayout from '@/Layouts/GuestLayout'

export default function About() {
    return (
        <>
            <Head title="About" />
            <section className="bg-btn-primary pb-16">
                <h1 className="flex items-center justify-center mb-8 w-full h-40 md:h-86 bg-red-primary text-white text-4xl md:text-6xl font-raleway font-bold text-center uppercase">
                    ABOUT US
                </h1>
                <div className="max-w-4xl mx-auto px-4">
                    <img
                        src="/assets/about-us.avif"
                        alt="about-us"
                        className="w-full h-auto rounded-lg"
                    />
                </div>
            </section>
        </>
    )
}

About.layout = (page: React.ReactNode) => <GuestLayout>{page}</GuestLayout>
