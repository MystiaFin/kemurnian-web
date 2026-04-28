import { Link } from '@inertiajs/react'
import SchoolCard from '@GuestComponents/SchoolCard'

interface Unit {
  nama_sekolah: string
}

export default function SchoolUnitsGrid({ units }: { units: Unit[] }) {
  const unitCount = units.length

  const getGridColumns = () => {
    if (unitCount === 1) return 'grid-cols-1'
    if (unitCount === 2) return 'grid-cols-1 md:grid-cols-2'
    if (unitCount === 3) return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
    if (unitCount === 4) return 'grid-cols-1 md:grid-cols-2'
    return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
  }

  const maxWidthClass = unitCount === 2 || unitCount === 4 ? 'max-w-[656px]' : 'max-w-[1080px]'

  return (
    <div className="w-full flex justify-center py-8 px-4">
      <div className={`grid ${getGridColumns()} gap-6 ${maxWidthClass}`}>
        {units.map((unit, index) => (
          <Link
            key={index}
            href={`/unit/${unit.nama_sekolah.replace(/\s+/g, '-').toLowerCase()}`}
            className="w-80"
          >
            <SchoolCard title={unit.nama_sekolah} />
          </Link>
        ))}
      </div>
    </div>
  )
}
