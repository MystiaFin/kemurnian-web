import GuestLayout from '@/Layouts/GuestLayout'
import ButtonPrimary from '@GuestComponents/ButtonPrimary'
import HeroSliders from '@GuestComponents/HeroSliders'
import KurikulumList from '@GuestComponents/KurikulumList'
import NewsPreview from '@GuestComponents/NewsPreview'
import SchoolsInfo from '@GuestComponents/SchoolsInfo'
import SectionHeader from '@GuestComponents/SectionHeader'
import { getSnippet } from '@/Utils/sanitize'

interface HeroBannerRecord {
  id: number
  image_urls: string
  tablet_image_urls?: string | null
  mobile_image_urls?: string | null
  header_text?: string | null
  button_text?: string | null
  href_text?: string | null
  order: number
}

interface KurikulumRecord {
  id: number
  title: string
  body: string
  preview?: string | null
}

interface NewsRecord {
  id: number
  title: string
  body: string
  date: string
  image_urls: string[]
}

interface EnrollmentRecord {
  id: number
  title: string
  body: string
  date: string
  image_url?: string | null
}

interface HomeProps {
  hero: HeroBannerRecord[]
  kurikulum: KurikulumRecord[]
  latestNews: NewsRecord[]
  enrollment?: EnrollmentRecord | null
}

export default function Home({ hero, kurikulum, latestNews, enrollment }: HomeProps) {
  const socialMediaStyles =
    'bg-[#818FAB] px-4 py-4 rounded-sm text-white font-raleway font-bold'

  return (
    <>
      <div id="hero">
        <HeroSliders images={hero} />
      </div>

      <div id="schools-info">
        <SchoolsInfo />
      </div>

      <section id="about" className="flex flex-col justify-center items-center px-4">
        <SectionHeader title="TENTANG KAMI" as="h2" />
        <p className="mx-4 max-w-4xl mt-6 font-merriweather font-[100] leading-loose tracking-wider text-xs md:text-lg text-justify md:text-center">
          Sekolah Kemurnian pertama didirikan dengan nama TK Kemurnian, pada tanggal 2
          Januari 1978 di Jalan Kemurnian V No. 209, Jakarta Barat. Sampai saat ini,
          Sekolah Kemurnian telah berkembang sehingga mendirikan jenjang pendidikan dari
          Sekolah Dasar (SD), Sekolah Menengah Pertama (SMP), sampai pada Sekolah Menengah
          Atas (SMA) dan berekspansi hingga mendirikan 2 unit cabang sekolah, yaitu
          Sekolah Kemurnian II di Greenville dan Sekolah Kemurnian III di Citra.
        </p>
        <ButtonPrimary text="READ ON" href="/about" />
      </section>

      <div className="bg-[#e6e6e6]">
        <section id="kurikulum" className="px-4 py-20 mt-12">
          <SectionHeader title="KURIKULUM" as="h2" />
          <KurikulumList kurikulum={kurikulum} />
        </section>

        <section id="news" className="px-4 py-16">
          <SectionHeader title="NEWS AND EVENTS" as="h2" />
          <NewsPreview news={latestNews} />
          <ButtonPrimary text="MORE NEWS" href="/news" />
        </section>

        <section
          id="enrollment"
          className="py-38 bg-btn-primary flex flex-col justify-center items-center"
        >
          <SectionHeader
            title="PENERMAAN PESERTA DIDIK BARU"
            h2ClassName="text-white tracking-widest"
            hrClassName="border-white"
            as="h2"
          />

          <div className="mx-10">
            <img
              src={enrollment?.image_url || '/placeholder-image.png'}
              alt="Enrollment"
              width={460}
              height={0}
              className="mx-auto mt-6 mb-10 rounded shadow-lg w-auto h-auto w-lg"
            />
          </div>
          <a
            href="/enrollment"
            className="bg-[#818FAB] py-3 px-5 rounded-lg font-bold text-white"
          >
            Pelajari Selengkapnya
          </a>
        </section>

        <section
          id="contact"
          className="flex flex-col justify-center items-center gap-4 py-16"
        >
          <h2 className="font-raleway font-black tracking-widest text-md">
            COME GET CLOSER WITH US
          </h2>
          <div className="flex gap-2">
            <a
              href="https://linktr.ee/sekolahkemurnian"
              className={socialMediaStyles}
            >
              Whatsapp
            </a>
            <a
              href="https://www.instagram.com/sekolah.kemurnian/"
              className={socialMediaStyles}
            >
              Instagram
            </a>
            <a
              href="https://www.youtube.com/@SekolahKemurnian"
              className={socialMediaStyles}
            >
              Youtube
            </a>
          </div>
          <hr className="clear-both mx-auto my-2 h-0 w-[90px] border-0 border-t-[3px] border-solid border-[#8b0000]" />
        </section>
      </div>
    </>
  )
}

Home.layout = (page: React.ReactNode) => <GuestLayout>{page}</GuestLayout>