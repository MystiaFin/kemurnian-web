import { Link } from '@inertiajs/react'
import SectionHeader from '@GuestComponents/SectionHeader'

const schools = [
  {
    name: 'Sekolah Kemurnian I',
    image: '/sekolah/kemurnian_i.avif',
    address:
      'Jl. Kemurnian V No. 209 Glodok, Kecamatan Taman Sari, Kota Jakarta Barat, Daerah Khusus Ibu Kota Jakarta 11120',
    map: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.8820921547413!2d106.81105261396955!3d-6.146534761961614!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f608a1000aab%3A0x92f0ffb2c218f403!2sSekolah%20Kemurnian%20I!5e0!3m2!1sid!2sid!4v1660379395894!5m2!1sid!2sid',
    href: 'sekolah-kemurnian-1',
  },
  {
    name: 'Sekolah Kemurnian II',
    image: '/sekolah/kemurnian_ii.avif',
    address:
      'Komplek Green Ville Blok Q No. 209, Duri Kepa, Kec. Kebon Jeruk, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta 11510',
    map: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63467.48240572489!2d106.71308693124999!3d-6.168550499999991!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f651cef9a1c9%3A0xeff64c79506e34c2!2sSekolah%20Kemurnian%20II!5e0!3m2!1sid!2sid!4v1660379724754!5m2!1sid!2sid',
    href: 'sekolah-kemurnian-2',
  },
  {
    name: 'Sekolah Kemurnian III',
    image: '/sekolah/kemurnian_iii.avif',
    address:
      'Perumahan Citra 2 Jl. Keharmonisan No.Blok A3, RT.1/RW.19, Pegadungan, Kec. Kalideres, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta 11830',
    map: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.9522476009074!2d106.70160087360107!3d-6.1371182938497455!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6a03362119f0c5%3A0x7d52db1e3186ceb0!2sSekolah%20Kemurnian%20III!5e0!3m2!1sid!2sid!4v1733725394023!5m2!1sid!2sid',
    href: 'sekolah-kemurnian-3',
  },
]

export default function SchoolsInfo() {
  return (
    <main className="mt-20">
      <SectionHeader title="LOKASI SEKOLAH" as="h1" />
      <div className="flex justify-center items-center">
        <section className="mb-34 mx-5 mt-6 flex flex-col md:flex-row gap-12 md:gap-8">
          {schools.map((school, idx) => (
            <div
              key={idx}
              className="border-b-2 border-gray-300 md:border-b-0 pb-8 md:pb-0"
            >
              <Link
                href={`/${school.href}`}
                className="text-center cursor-pointer flex flex-col items-center justify-center"
              >
                <img
                  src={school.image}
                  alt={school.name}
                  width={288}
                  height={180}
                  className="w-48 md:w-60 lg:w-72 object-contain"
                />
                <h2 className="tracking-tight font-black mt-2 md:mt-8 mb-0 md:mb-4 text-base md:text-lg font-raleway">
                  {school.name}
                </h2>
                <p className="max-w-64 md:max-w-60 lg:max-w-72 mb-6 font-merriweather font-[100] text-xs md:text-sm leading-loose tracking-wider">
                  {school.address}
                </p>
                <iframe
                  src={school.map}
                  title={`${school.name} location`}
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className={`w-40 h-40 md:w-48 md:h-48 lg:w-52 lg:h-52 iframe${idx + 1}`}
                />
              </Link>
            </div>
          ))}
        </section>
      </div>
    </main>
  )
}
