"use client"

import Link from "next/link"

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-white bg-opacity-90 shadow-sm backdrop-blur-md">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex-between py-4">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Promptories
          </Link>
          <div className="md:flex-end space-x-4">
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-700">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
