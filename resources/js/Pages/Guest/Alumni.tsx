import { Head } from '@inertiajs/react'
import GuestLayout from '@/Layouts/GuestLayout'
import SectionHeader from '@GuestComponents/SectionHeader'

interface AlumniRecord {
	id: number
	name: string
	graduation_year: number
	university?: string | null
	job_title?: string | null
	motto?: string | null
	image_url?: string | null
}

export default function Alumni({ alumni }: { alumni: AlumniRecord[] }) {
	const hasData = alumni && alumni.length > 0

	return (
		<>
			<Head title="Alumni | Sekolah Kemurnian" />
			<h1 className="flex items-center justify-center mb-8 w-full h-40 md:h-86 bg-red-primary text-white text-4xl md:text-6xl font-raleway font-bold text-center uppercase">
				ALUMNI
			</h1>

			<section className="py-12">
				<SectionHeader title="ALUMNI KEMURNIAN" as="h2" />

				{hasData ? (
					<section className="flex flex-wrap justify-center gap-4 md:gap-8 max-w-lg md:max-w-4xl mx-auto px-4">
						{alumni.map((item) => (
							<article
								key={item.id}
								className="flex flex-col items-center w-[calc(50%-8px)] sm:w-[260px]"
							>
								<img
									src={item.image_url || '/placeholder-image.png'}
									alt={item.name}
									width={300}
									height={200}
									className="rounded mb-4 w-32 sm:w-40 md:w-64"
									loading="lazy"
								/>
								<div className="text-center">
									<p className="text-[#8B0000] mb-2 font-raleway font-bold text-xs sm:text-sm">
										Angkatan {item.graduation_year}
									</p>
									<h2 className="font-raleway font-extrabold text-sm sm:text-lg mb-1 leading-tight">
										{item.name}
									</h2>
									{(item.university || item.job_title) && (
										<p className="font-merriweather leading-loose tracking-wider font-light text-sm md:text-base">
											{item.university || 'Universitas belum tersedia'}
											{item.job_title ? ` | ${item.job_title}` : ''}
										</p>
									)}
									{item.motto && (
										<p className="font-merriweather leading-loose tracking-wider font-light text-xs md:text-sm italic">
											&quot;{item.motto}&quot;
										</p>
									)}
								</div>
							</article>
						))}
					</section>
				) : (
					<p className="mt-8 text-center font-merriweather text-sm md:text-base text-[#4b5563]">
						Data alumni belum tersedia.
					</p>
				)}
			</section>
		</>
	)
}

Alumni.layout = (page: React.ReactNode) => <GuestLayout>{page}</GuestLayout>
