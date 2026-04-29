import { Head } from '@inertiajs/react'
import GuestLayout from '@/Layouts/GuestLayout'
import SectionHeader from '@GuestComponents/SectionHeader'
import schools from '@/data/schools.json'

interface UnitRecord {
  nama_sekolah: string
  izin_operasional: string
  status_sekolah: string
  nama_yayasan: string
  tanggal_berdiri: string
  status_tanah_bangunan: string
  waktu_penyelenggaraan: string
  akreditasi: {
    no_sk: string
    jenjang: string
    tahun: number
  }
  alamat: {
    jalan: string
    desa_kelurahan: string
    kecamatan: string
    kotamadya: string
    provinsi: string
    kode_pos: string
  }
  kontak: {
    telepon: string
    fax: string
  }
}

interface SchoolData {
  title: any
  image_path: string | undefined
  units: UnitRecord[]
}

const schoolData = schools as Record<string, SchoolData>

const slugify = (value: string) => value.trim().toLowerCase().replace(/\s+/g, '-')

export default function UnitDetail({ detail }: { detail: string }) {
  let currentUnit: UnitRecord | null = null
  let currentSchool: SchoolData | null = null

  for (const [, school] of Object.entries(schoolData)) {
    const unit = school.units.find((item) => slugify(item.nama_sekolah) === detail)
    if (unit) {
      currentUnit = unit
      currentSchool = school
      break
    }
  }

  if (!currentUnit || !currentSchool) {
    return (
      <>
        <Head title="Unit | Sekolah Kemurnian" />
        <div className="py-12">
          <SectionHeader title="UNIT" as="h1" />
          <p className="text-center font-merriweather">Unit not found.</p>
        </div>
      </>
    )
  }

  const DetailRow = ({
    label,
    value,
    isChild = false,
  }: {
    label: string
    value: string | number
    isChild?: boolean
  }) => (
    <>
      <div
        className={
          isChild
            ? "relative pl-5 before:content-['•'] before:absolute before:left-2"
            : 'font-bold'
        }
      >
        {label}
      </div>
      <div>:</div>
      <div>{value}</div>
    </>
  )

  return (
    <>
      <Head title={`${currentUnit.nama_sekolah}`} />
      <div className="flex items-center justify-center mb-8 w-full h-56 md:h-86 bg-red-primary text-white text-3xl md:text-6xl font-raleway font-bold text-center uppercase">
        <h1>{currentUnit.nama_sekolah}</h1>
      </div>

      <SectionHeader title="PROFIL SEKOLAH" as="h2" />

      <div className="flex flex-col items-center p-6 font-merriweather">
        <img
          src={currentSchool.image_path}
          alt={`Foto ${currentSchool.title}`}
          width={200}
          height={200}
          className="mb-8 h-auto w-52 object-cover shadow-md md:w-96"
        />
        <div className="grid grid-cols-[max-content_max-content_1fr] items-start ml-2 gap-x-2 md:gap-x-4 gap-y-1 md:gap-y-4 text-sm md:text-lg">
          <DetailRow label="Nama Sekolah" value={currentUnit.nama_sekolah} />
          <DetailRow label="Akreditasi" value={currentUnit.akreditasi.jenjang} />
          <DetailRow label="No. SK Akreditasi" value={currentUnit.akreditasi.no_sk} isChild />
          <DetailRow label="Tahun Akreditasi" value={currentUnit.akreditasi.tahun} isChild />
          <DetailRow label="Izin Operasional" value={currentUnit.izin_operasional} />
          <DetailRow label="Alamat Sekolah" value={currentUnit.alamat.jalan} />
          <DetailRow label="Nomor Telepon" value={currentUnit.kontak.telepon} isChild />
          <DetailRow label="Nomor Fax" value={currentUnit.kontak.fax} isChild />
          <DetailRow label="Desa / Kelurahan" value={currentUnit.alamat.desa_kelurahan} isChild />
          <DetailRow label="Kecamatan" value={currentUnit.alamat.kecamatan} isChild />
          <DetailRow label="Kotamadya" value={currentUnit.alamat.kotamadya} isChild />
          <DetailRow label="Provinsi" value={currentUnit.alamat.provinsi} isChild />
          <DetailRow label="Kode Pos" value={currentUnit.alamat.kode_pos} isChild />
          <DetailRow label="Status Sekolah" value={currentUnit.status_sekolah} />
          <DetailRow label="Nama Yayasan" value={currentUnit.nama_yayasan} />
          <DetailRow label="Tanggal Berdirinya Sekolah" value={currentUnit.tanggal_berdiri} />
          <DetailRow label="Status Tanah dan Bangunan" value={currentUnit.status_tanah_bangunan} />
          <DetailRow label="Waktu Penyelenggaraan" value={currentUnit.waktu_penyelenggaraan} />
        </div>
      </div>
    </>
  )
}

UnitDetail.layout = (page: React.ReactNode) => <GuestLayout>{page}</GuestLayout>
