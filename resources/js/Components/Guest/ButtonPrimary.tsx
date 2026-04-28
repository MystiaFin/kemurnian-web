import { Link } from '@inertiajs/react'

type ButtonPrimaryProps = {
  href?: string
  text?: string
  className?: string
}

export default function ButtonPrimary({
  href = '#',
  text = 'READ ON',
  className = '',
}: ButtonPrimaryProps) {
  const baseClasses =
    'text-sm md:text-base block mx-auto my-6 md:my-12 px-2 py-2 md:px-5 md:py-3 rounded-full w-40 uppercase tracking-[1.5px] border-3 border-[#8b0000] bg-[#8b0000] text-white shadow-md whitespace-nowrap font-raleway font-bold ' +
    'hover:bg-transparent hover:text-[#8b0000] hover:shadow-md transition-colors duration-200 ease-out text-center'

  return (
    <Link href={href} className={`${baseClasses} ${className}`}>
      {text}
    </Link>
  )
}
