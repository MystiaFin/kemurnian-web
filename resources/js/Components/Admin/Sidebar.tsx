import { Link, router } from '@inertiajs/react'
import {
  RiHome9Fill, RiImageFill, RiBookMarkedFill,
  RiNewsFill, RiMegaphone2Fill, RiSettings6Fill, RiLogoutBoxLine
} from '@remixicon/react'

const linkStyle = "block w-full py-6 pl-6 cursor-pointer text-left border-red-800 transition-all duration-180 ease-in-out hover:bg-red-800 active:bg-red-900 active:scale-95"

const menuLinks = [
  { href: '/admin', label: 'Dashboard', icon: <RiHome9Fill className="inline-block mr-3 size-5" /> },
  { href: '/admin/hero', label: 'Hero Section', icon: <RiImageFill className="inline-block mr-3 size-5" /> },
  { href: '/admin/kurikulum', label: 'Kurikulum Section', icon: <RiBookMarkedFill className="inline-block mr-3 size-5" /> },
  { href: '/admin/news', label: 'News', icon: <RiNewsFill className="inline-block mr-3 size-5" /> },
  { href: '/admin/enrollment', label: 'Enrollment', icon: <RiMegaphone2Fill className="inline-block mr-3 size-5" /> },
  { href: '/admin/fasilitas', label: 'Fasilitas', icon: <RiSettings6Fill className="inline-block mr-3 size-5" /> },
]

export default function AdminSidebar() {
  return (
    <nav className="sticky top-0 w-64 bg-red-primary h-screen text-white flex flex-col justify-between">
      <div className="my-8 mx-4 h-12 flex items-center justify-center">
        <img src="/assets/nav_logo.webp" alt="Logo" className="object-contain h-full" />
      </div>

      <div className="flex flex-col">
        {menuLinks.map((link) => (
          <Link key={link.href} href={link.href} className={`flex items-center origin-left ${linkStyle}`}>
            {link.icon}
            <span>{link.label}</span>
          </Link>
        ))}
      </div>

      <button
        onClick={() => router.post('/logout')}
        className="flex justify-center items-center mx-2 mb-2 py-2 bg-white transition-transform active:scale-95 cursor-pointer rounded-full text-red-primary gap-1"
      >
        <RiLogoutBoxLine size={20} />
        Logout
      </button>
    </nav>
  )
}
