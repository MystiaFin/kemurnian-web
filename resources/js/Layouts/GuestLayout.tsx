import { usePage } from '@inertiajs/react'
import Footer from '@GuestComponents/Footer'
import FixedBottom from '@GuestComponents/FixedBottom'
import Navbar from '@GuestComponents/Navbar'

interface SearchPage {
  title: string
  url: string
}

export default function GuestLayout({ children }: { children: React.ReactNode }) {
  const { searchPages = [] } = usePage<{ searchPages: SearchPage[] }>().props

  return (
    <div className="antialiased scroll-smooth">
      <Navbar searchPages={searchPages || []} />
      {children}
      <Footer />
      <FixedBottom />
    </div>
  )
}
