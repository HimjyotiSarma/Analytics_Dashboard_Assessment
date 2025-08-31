import Image from 'next/image'
import Link from 'next/link'

export default function Header() {
  return (
    <header className="w-full flex items-center justify-between p-4 bg-white shadow-md">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <Link href="/">
          <Image
            src="https://www.mapup.ai/mapup-logo.png"
            alt="MapUp Logo"
            width={100}
            height={40}
          />
        </Link>
      </div>
      <div className="text-xl font-bold">EV Analytics Dashboard</div>
    </header>
  )
}
