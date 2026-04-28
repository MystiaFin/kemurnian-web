type SectionHeaderProps = {
  title: string
  h2ClassName?: string
  hrClassName?: string
  as?: 'h1' | 'h2' | 'h3'
}

export default function SectionHeader({
  title,
  as = 'h2',
  h2ClassName = '',
  hrClassName = '',
}: SectionHeaderProps) {
  const Heading = as
  return (
    <div>
      <Heading
        className={`text-md tracking-wider text-center font-extrabold font-raleway ${h2ClassName}`}
      >
        {title}
      </Heading>
      <hr
        className={`clear-both mx-auto my-5 h-0 w-[90px] border-0 border-t-[3px] border-solid border-[#8b0000] ${hrClassName}`}
      />
    </div>
  )
}
