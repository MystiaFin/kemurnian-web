export default function Footer() {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    {
      href: 'https://web.facebook.com/sekolah.kemurnian?_rdc=1&_rdr',
      alt: 'Facebook',
      src: '/facebook.svg',
    },
    {
      href: 'https://www.instagram.com/sekolah.kemurnian/',
      alt: 'Instagram',
      src: '/instagram.svg',
    },
    {
      href: 'https://www.youtube.com/results?search_query=sekolah+kemurnian',
      alt: 'YouTube',
      src: '/youtube.svg',
    },
  ]

  return (
    <footer className="overflow-x-hidden bg-black-primary flex w-full flex-col items-center justify-center p-2 py-4 text-center text-white">
      <div className="mb-4 mt-8 flex flex-wrap justify-center gap-10">
        <img
          src="/cambridge.webp"
          alt="Cambridge Logo"
          width={200}
          height={80}
          className="object-contain h-15 md:h-20 w-auto"
        />
        <div className="flex flex-col">
          <h3 className="flex font-raleway font-bold">FOLLOW US</h3>
          <div className="flex gap-1">
            {socialLinks.map((link) => (
              <a
                key={link.alt}
                href={link.href}
                className="group inline-block rounded-sm bg-white p-2 shadow-md transition-colors duration-300 ease-out hover:bg-red-600"
              >
                <img
                  src={link.src}
                  alt={link.alt}
                  width={15}
                  height={15}
                  className="transition duration-300 ease-out group-hover:brightness-0 group-hover:invert"
                />
              </a>
            ))}
          </div>
        </div>
      </div>
      <span className="mt-4 font-merriweather font-light text-xs text-gray-400">
        Copyright {currentYear} Kemurnian School. All rights reserved.
      </span>
    </footer>
  )
}
