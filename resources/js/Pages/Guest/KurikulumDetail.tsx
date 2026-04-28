import GuestLayout from '@/Layouts/GuestLayout'
import QuillRenderer from '@GuestComponents/QuillRenderer'
import SectionHeader from '@GuestComponents/SectionHeader'

interface KurikulumRecord {
  id: number
  title: string
  body: string
}

export default function KurikulumDetail({ kurikulum }: { kurikulum?: KurikulumRecord | null }) {
  if (!kurikulum) {
    return (
      <div className="py-12">
        <SectionHeader title="KURIKULUM" as="h1" />
        <p className="text-center font-merriweather">Kurikulum not found.</p>
      </div>
    )
  }

  return (
    <div className="py-12">
      <SectionHeader title={kurikulum.title} as="h1" />
      <section className="mx-auto max-w-4xl px-4">
        <QuillRenderer content={kurikulum.body} />
      </section>
    </div>
  )
}

KurikulumDetail.layout = (page: React.ReactNode) => <GuestLayout>{page}</GuestLayout>
