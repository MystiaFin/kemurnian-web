interface SchoolCardProps {
  title: string
}

export default function SchoolCard({ title }: SchoolCardProps) {
  return (
    <div className="flex justify-center items-center w-[260px] md:w-xs h-[120px] md:h-[160px] text-center bg-[#7b1113] text-white text-lg md:text-2xl font-bold p-4">
      {title}
    </div>
  )
}
