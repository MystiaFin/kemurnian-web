import GuestLayout from '@/Layouts/GuestLayout'
import QuillRenderer from '@GuestComponents/QuillRenderer'
import SectionHeader from '@GuestComponents/SectionHeader'

interface EnrollmentRecord {
  id: number
  title: string
  body: string
  date: string
  image_url?: string | null
}

export default function Enrollment({ enrollment }: { enrollment?: EnrollmentRecord | null }) {
  return (
    <div className="py-12">
      <SectionHeader title="PENERIMAAN SISWA" as="h1" />
      <section className="mx-auto max-w-4xl px-4">
        {enrollment ? (
          <>
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {enrollment.image_url && (
                <img
                  src={enrollment.image_url}
                  alt={enrollment.title}
                  width={480}
                  height={320}
                  className="rounded-lg object-cover w-full md:w-1/2"
                />
              )}
              <div>
                <h2 className="font-raleway font-extrabold text-2xl mb-2">
                  {enrollment.title}
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                  {new Date(enrollment.date).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
            <div className="mt-8">
              <QuillRenderer content={enrollment.body} />
            </div>
          </>
        ) : (
          <p className="font-merriweather text-center text-sm md:text-base">
            Informasi penerimaan siswa belum tersedia.
          </p>
        )}
      </section>
    </div>
  )
}

Enrollment.layout = (page: React.ReactNode) => <GuestLayout>{page}</GuestLayout>
