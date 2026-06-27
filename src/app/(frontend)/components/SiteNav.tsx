'use client'

import Link from 'next/link'
import { useState } from 'react'

type NavItem = { label: string; url: string }

export default function SiteNav({ items }: { items: NavItem[] }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="bg-gray-800 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center min-h-[48px]">
        {/* Desktop nav — hidden on mobile */}
        <nav className="hidden sm:flex items-center gap-1 flex-1" aria-label="Site navigation">
          {items.map((item) => (
            <Link
              key={item.url}
              href={item.url}
              className="shrink-0 px-4 py-3 text-sm font-medium text-gray-100 hover:text-white hover:bg-gray-700 transition-colors border-b-2 border-transparent hover:border-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Mobile: label + hamburger button */}
        <span className="sm:hidden text-sm text-gray-400 font-medium select-none">Menu</span>
        <button
          className="sm:hidden ml-auto flex flex-col items-center justify-center gap-[5px] w-11 h-11 rounded focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-1 focus-visible:ring-offset-gray-800"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={open}
          aria-controls="mobile-nav"
        >
          <span className={`block w-5 h-0.5 bg-gray-100 transition-all duration-200 origin-center ${open ? 'translate-y-[7px] rotate-45' : ''}`} />
          <span className={`block w-5 h-0.5 bg-gray-100 transition-all duration-200 ${open ? 'opacity-0 scale-x-0' : ''}`} />
          <span className={`block w-5 h-0.5 bg-gray-100 transition-all duration-200 origin-center ${open ? '-translate-y-[7px] -rotate-45' : ''}`} />
        </button>
      </div>

      {/* Mobile nav — always in DOM so aria-controls resolves; hidden attribute hides when closed */}
      <nav
        id="mobile-nav"
        hidden={!open}
        className="sm:hidden absolute top-full left-0 right-0 bg-gray-800 z-50 border-t border-gray-700 shadow-2xl"
        aria-label="Mobile navigation"
      >
        {items.map((item) => (
          <Link
            key={item.url}
            href={item.url}
            onClick={() => setOpen(false)}
            className="flex items-center px-6 py-4 text-sm font-medium text-gray-100 hover:text-white hover:bg-gray-700 border-b border-gray-700/50 transition-colors active:bg-gray-600"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  )
}
