import './globals.css'
import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'

export const metadata = { title: 'Greenfield Public School', description: 'Demo school website' }

const DEFAULT_NAV = [
  { label: 'Home', url: '/' },
  { label: 'News & Events', url: '/news' },
  { label: 'Gallery', url: '/gallery' },
  { label: 'Faculty', url: '/faculty' },
  { label: 'Contact', url: '/contact' },
]

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const payload = await getPayload({ config })
  const [settings, footer] = await Promise.all([
    payload.findGlobal({ slug: 'site-settings', depth: 1 }),
    payload.findGlobal({ slug: 'footer' }),
  ])

  const schoolName: string = settings?.schoolName ?? 'Greenfield Public School'
  const logoUrl: string | null = (settings?.logo as any)?.url ?? null
  const contact = settings?.contact ?? {}
  const social = settings?.social ?? {}
  const schoolHours: any[] = settings?.schoolHours ?? []
  const quickLinks: any[] = (footer as any)?.quickLinks?.length
    ? (footer as any).quickLinks
    : DEFAULT_NAV
  const copyright: string =
    (footer as any)?.copyright ?? `Copyright © ${new Date().getFullYear()} ${schoolName}. All Rights Reserved.`

  const half = Math.ceil(quickLinks.length / 2)
  const linksLeft = quickLinks.slice(0, half)
  const linksRight = quickLinks.slice(half)

  const SOCIAL_ICONS: { key: keyof typeof social; icon: string; label: string }[] = [
    { key: 'facebook', icon: 'f', label: 'Facebook' },
    { key: 'instagram', icon: '◻', label: 'Instagram' },
    { key: 'youtube', icon: '▶', label: 'YouTube' },
    { key: 'whatsapp', icon: '✆', label: 'WhatsApp' },
  ]

  return (
    <html lang="en">
      <body className="min-h-screen bg-blue-300 text-gray-900 antialiased">

        {/* ── Header ── */}
        <header className="bg-white shadow-sm">
          {/* Top bar: logo + school name */}
          <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
              {logoUrl ? (
                <img src={logoUrl} alt={schoolName} className="h-10 w-auto object-contain" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-blue-800 flex items-center justify-center text-white font-bold text-lg shrink-0">
                  {schoolName.charAt(0)}
                </div>
              )}
              <span className="font-extrabold text-xl text-blue-800 tracking-tight">{schoolName}</span>
            </Link>
          </div>
          {/* Nav bar — dark blue */}
          <div className="bg-blue-800">
            <nav className="max-w-6xl mx-auto px-6 flex items-center gap-1 overflow-x-auto">
              {DEFAULT_NAV.map((item, i) => (
                <Link
                  key={i}
                  href={item.url}
                  className="shrink-0 px-4 py-3 text-sm font-medium text-blue-100 hover:text-white hover:bg-blue-700 transition-colors border-b-2 border-transparent hover:border-white"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>

        {/* ── Page content ── */}
        <main className="w-full">{children}</main>

        {/* ── Footer ── */}
        <footer>
          {/* Main footer body */}
          <div className="bg-gray-800 text-gray-300 px-6 py-14">
            <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-10">

              {/* ── Col 1: School Hours + Social ── */}
              <div>
                <h3 className="text-white font-bold text-lg mb-1">School Hours</h3>
                <div className="w-8 h-0.5 bg-red-700 mb-5" />
                {schoolHours.length > 0 ? (
                  <ul className="space-y-2 text-sm">
                    {schoolHours.map((row: any, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-1.5 w-2 h-2 rounded-full bg-red-700 shrink-0" />
                        <span>{row.label}{row.time ? ` — ${row.time}` : ''}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 w-2 h-2 rounded-full bg-red-700 shrink-0" />
                      <span>Mon – Fri: 7:30 am – 2:30 pm</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 w-2 h-2 rounded-full bg-red-700 shrink-0" />
                      <span>Saturday: 7:30 am – 12:00 pm</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 w-2 h-2 rounded-full bg-red-700 shrink-0" />
                      <span>Sunday: Closed</span>
                    </li>
                  </ul>
                )}

                {/* Social icons */}
                <div className="flex gap-2 mt-8 flex-wrap">
                  {social.facebook && (
                    <a href={social.facebook} target="_blank" rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full border border-gray-600 flex items-center justify-center text-xs hover:bg-red-700 hover:border-red-700 transition"
                      aria-label="Facebook">f</a>
                  )}
                  {social.instagram && (
                    <a href={social.instagram} target="_blank" rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full border border-gray-600 flex items-center justify-center text-xs hover:bg-red-700 hover:border-red-700 transition"
                      aria-label="Instagram">ig</a>
                  )}
                  {social.youtube && (
                    <a href={social.youtube} target="_blank" rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full border border-gray-600 flex items-center justify-center text-xs hover:bg-red-700 hover:border-red-700 transition"
                      aria-label="YouTube">▶</a>
                  )}
                  {social.whatsapp && (
                    <a href={`https://wa.me/${social.whatsapp}`} target="_blank" rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full border border-gray-600 flex items-center justify-center text-xs hover:bg-red-700 hover:border-red-700 transition"
                      aria-label="WhatsApp">✆</a>
                  )}
                  {/* Show placeholder circles if no social links configured */}
                  {!social.facebook && !social.instagram && !social.youtube && !social.whatsapp && (
                    ['f', 'ig', '▶', '✆', 'in'].map((icon) => (
                      <span key={icon}
                        className="w-9 h-9 rounded-full border border-gray-600 flex items-center justify-center text-xs text-gray-500">
                        {icon}
                      </span>
                    ))
                  )}
                </div>
              </div>

              {/* ── Col 2: Quick Links (2 sub-columns) ── */}
              <div>
                <h3 className="text-white font-bold text-lg mb-1">Quick Links</h3>
                <div className="w-8 h-0.5 bg-red-700 mb-5" />
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  {[...linksLeft, ...linksRight].map((link: any, i: number) => (
                    <Link
                      key={i}
                      href={link.url}
                      className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors"
                    >
                      <span className="text-red-700 text-xs">›</span>
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* ── Col 3: Contact Info ── */}
              <div>
                <h3 className="text-white font-bold text-lg mb-1">Contact Info</h3>
                <div className="w-8 h-0.5 bg-red-700 mb-5" />
                <div className="space-y-4 text-sm">
                  {contact.address && (
                    <div className="flex gap-3">
                      <span className="mt-1 w-8 h-8 bg-red-700 rounded flex items-center justify-center shrink-0 text-white text-base">📍</span>
                      <p className="text-gray-400 whitespace-pre-line leading-relaxed">{contact.address}</p>
                    </div>
                  )}
                  {contact.phone && (
                    <div className="flex gap-3">
                      <span className="mt-1 w-8 h-8 bg-red-700 rounded flex items-center justify-center shrink-0 text-white text-base">📞</span>
                      <a href={`tel:${contact.phone}`} className="text-gray-400 hover:text-white transition-colors">{contact.phone}</a>
                    </div>
                  )}
                  {contact.email && (
                    <div className="flex gap-3">
                      <span className="mt-1 w-8 h-8 bg-red-700 rounded flex items-center justify-center shrink-0 text-white text-base">✉️</span>
                      <a href={`mailto:${contact.email}`} className="text-gray-400 hover:text-white transition-colors break-all">{contact.email}</a>
                    </div>
                  )}
                  {!contact.address && !contact.phone && !contact.email && (
                    <p className="text-gray-500 text-xs">Fill in contact details via Admin → Site Settings.</p>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* Bottom bar */}
          <div className="bg-blue-900 text-blue-200 text-sm text-center py-4 px-6">
            {copyright}
          </div>
        </footer>

      </body>
    </html>
  )
}
