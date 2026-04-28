import GuestLayout from '@/Layouts/GuestLayout'
import SectionHeader from '@GuestComponents/SectionHeader'
import SchoolsInfo from '@GuestComponents/SchoolsInfo'

export default function About() {
  return (
    <div className="py-12">
      <SectionHeader title="TENTANG KAMI" as="h1" />
      <section className="mx-auto max-w-4xl px-4 text-center">
        <p className="font-merriweather leading-loose tracking-wide text-sm md:text-base">
          Sekolah Kemurnian adalah lembaga pendidikan yang berfokus pada pembelajaran
          yang seimbang antara akademik dan pembentukan karakter. Kami menghadirkan
          lingkungan belajar yang hangat, modern, dan berorientasi pada masa depan.
        </p>
        <p className="mt-4 font-merriweather leading-loose tracking-wide text-sm md:text-base">
          Dengan pengalaman puluhan tahun, kami terus berinovasi untuk memberikan
          pengalaman belajar terbaik bagi setiap siswa dan orang tua.
        </p>
      </section>
      <SchoolsInfo />
    </div>
  )
}

About.layout = (page: React.ReactNode) => <GuestLayout>{page}</GuestLayout>
