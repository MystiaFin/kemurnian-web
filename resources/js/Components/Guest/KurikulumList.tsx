import ButtonPrimary from '@GuestComponents/ButtonPrimary'
import { getSnippet } from '@/Utils/sanitize'

interface KurikulumRecord {
  id: number
  title: string
  body: string
  preview?: string | null
}

export default function KurikulumList({ kurikulum }: { kurikulum: KurikulumRecord[] }) {
  const paragraphClasses =
    'font-merriweather font-[100] leading-loose tracking-wider text-center list-disc list-inside text-sm md:text-base'

  return (
    <section className="flex justify-center">
      <div className="w-full px-4">
        <div className="flex flex-wrap justify-center gap-6">
          {kurikulum.map((item) => (
            <div
              key={item.id}
              className="flex justify-center items-center flex-col text-center w-full max-w-sm md:max-w-lg flex-shrink-0 p-4"
            >
              <div className="flex justify-center mb-4">
                <img src="/icon-book.svg" alt="Logo" width={48} height={48} className="w-12" />
              </div>
              <h2 className="font-bold mb-0 md:mb-2 text-lg md:text-xl">
                {item.title}
              </h2>
              <p className={paragraphClasses}>
                {item.preview ? item.preview : getSnippet(item.body)}
              </p>
              <ButtonPrimary href={`/kurikulum/${item.id}`} text="READ ON" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
