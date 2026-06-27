import './globals.css'
import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'
import Image from 'next/image'
import SiteNav from './components/SiteNav'

export const revalidate = 60

export const metadata = { title: 'Greenfield Public School', description: 'Demo school website' }

export const DEFAULT_NAV = [
  { label: 'Home', url: '/' },
  { label: 'News & Events', url: '/news' },
  { label: 'Gallery', url: '/gallery' },
  { label: 'Faculty', url: '/faculty' },
  { label: 'Contact', url: '/contact' },
]

type SocialKey = 'facebook' | 'instagram' | 'youtube' | 'whatsapp'

const SOCIAL_ICONS: { key: SocialKey; icon: string; label: string }[] = [
  { key: 'facebook', icon: 'f', label: 'Facebook' },
  { key: 'instagram', icon: 'ig', label: 'Instagram' },
  { key: 'youtube', icon: '▶', label: 'YouTube' },
  { key: 'whatsapp', icon: '✆', label: 'WhatsApp' },
]

function safeSocialUrl(url: unknown): string | null {
  if (typeof url !== 'string' || !url) return null
  try {
    const { protocol } = new URL(url)
    return protocol === 'https:' || protocol === 'http:' ? url : null
  } catch {
    return null
  }
}

function socialHref(key: SocialKey, value: unknown): string | null {
  if (typeof value !== 'string' || !value) return null
  if (key === 'whatsapp') return `https://wa.me/${value}`
  return safeSocialUrl(value)
}

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

  const quickLinks: { label: string; url: string }[] = (
    (footer as any)?.quickLinks?.length
      ? (footer as any).quickLinks
      : DEFAULT_NAV
  ).filter((link: any) => typeof link?.url === 'string' && link.url)

  const copyright: string =
    (footer as any)?.copyright ?? `Copyright © ${new Date().getFullYear()} ${schoolName}. All Rights Reserved.`

  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100 text-gray-900 antialiased">

        {/* Skip navigation — must be first focusable element (WCAG 2.4.1) */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-2 focus:left-2 focus:px-4 focus:py-2 focus:bg-white focus:text-gray-900 focus:rounded-lg focus:shadow-lg focus-visible:ring-2 focus-visible:ring-gray-800"
        >
          Skip to main content
        </a>

        {/* ── Header ── */}
        <header className="bg-gray-100">
          {/* Top bar: logo + school name */}
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-3 sm:gap-4">
            <Link href="/" className="flex items-center gap-3 sm:gap-4 hover:opacity-90 transition-opacity min-w-0">
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt={schoolName}
                  width={64}
                  height={64}
                  className="h-12 sm:h-16 w-auto object-contain shrink-0"
                  priority
                />
              ) : (
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gray-800 flex items-center justify-center text-white font-bold text-xl sm:text-2xl shrink-0">
                  {schoolName.charAt(0)}
                </div>
              )}
              <span className="font-extrabold text-lg sm:text-2xl text-gray-900 tracking-tight leading-tight">{schoolName}</span>
            </Link>
          </div>
          {/* Nav bar — desktop horizontal / mobile hamburger */}
          <SiteNav items={DEFAULT_NAV} />
        </header>

        {/* ── Page content ── */}
        <main id="main-content" className="w-full">{children}</main>

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
                      <li key={row.label ?? i} className="flex items-start gap-2">
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

                {/* Social icons — 44×44 touch targets, sanitized hrefs */}
                <div className="flex gap-2 mt-8 flex-wrap">
                  {SOCIAL_ICONS.map(({ key, icon, label }) => {
                    const href = socialHref(key, (social as Record<SocialKey, unknown>)[key])
                    return href ? (
                      <a
                        key={key}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-11 h-11 rounded-full border border-gray-600 flex items-center justify-center text-xs hover:bg-red-700 hover:border-red-700 transition"
                        aria-label={label}
                      >
                        {icon}
                      </a>
                    ) : (
                      <span
                        key={key}
                        className="w-11 h-11 rounded-full border border-gray-600 flex items-center justify-center text-xs text-gray-500"
                        aria-hidden="true"
                      >
                        {icon}
                      </span>
                    )
                  })}
                </div>
              </div>

              {/* ── Col 2: Quick Links ── */}
              <div>
                <h3 className="text-white font-bold text-lg mb-1">Quick Links</h3>
                <div className="w-8 h-0.5 bg-red-700 mb-5" />
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  {quickLinks.map((link) => (
                    <Link
                      key={link.url}
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
                      <a
                        href={`tel:${String(contact.phone).replace(/[^\d+]/g, '')}`}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        {contact.phone}
                      </a>
                    </div>
                  )}
                  {contact.email && (
                    <div className="flex gap-3">
                      <span className="mt-1 w-8 h-8 bg-red-700 rounded flex items-center justify-center shrink-0 text-white text-base">✉️</span>
                      <a
                        href={`mailto:${String(contact.email).split('?')[0]}`}
                        className="text-gray-400 hover:text-white transition-colors break-all"
                      >
                        {contact.email}
                      </a>
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
          <div className="bg-gray-900 text-gray-300 text-sm text-center py-4 px-6">
            {copyright}
          </div>
        </footer>

      </body>
    </html>
  )
}
