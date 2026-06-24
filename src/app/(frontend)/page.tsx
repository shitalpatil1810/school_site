import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'
import HeroCarousel from './components/HeroCarousel'

export const revalidate = 60

function DateBadge({ iso }: { iso?: string | null }) {
  if (!iso) return null
  const d = new Date(iso)
  const day = d.getDate()
  const month = d.toLocaleString('en', { month: 'short' }).toUpperCase()
  return (
    <div className="absolute bottom-4 left-4 bg-red-800 text-white rounded-full w-14 h-14 flex flex-col items-center justify-center leading-tight shadow-lg">
      <span className="text-xl font-bold">{day}</span>
      <span className="text-[10px] font-semibold tracking-wide">{month}</span>
    </div>
  )
}

export default async function HomePage() {
  const payload = await getPayload({ config })

  const [settings, { docs: latestPosts }, { docs: leadership }, { docs: galleries }] =
    await Promise.all([
      payload.findGlobal({ slug: 'site-settings', depth: 1 }),
      payload.find({
        collection: 'posts', limit: 3, sort: '-publishedAt', depth: 1,
        where: { _status: { equals: 'published' } },
      }),
      payload.find({
        collection: 'faculty', limit: 4, sort: 'order', depth: 1,
        where: { category: { equals: 'leadership' } },
      }),
      payload.find({
        collection: 'galleries', limit: 1, sort: '-date', depth: 2,
      }),
    ])

  const heroSlides: any[] = settings?.heroSlides ?? []
  const schoolHours: any[] = settings?.schoolHours ?? []
  const latestAlbum: any = galleries[0]
  const galleryImages: any[] = (latestAlbum?.images ?? []).slice(0, 4)

  return (
    <>
      {/* ── Hero carousel ── */}
      <div className="max-w-6xl mx-auto px-6 pt-6">
        <HeroCarousel
          slides={heroSlides}
          schoolName={settings?.schoolName}
          tagline={settings?.tagline}
        />
      </div>

      {/* ── Page sections — centred, max-width ── */}
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-16">

        {/* ── News & Events ── */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">News &amp; Events</h2>
          {latestPosts.length === 0 ? (
            <p className="text-gray-500 text-sm text-center">No news published yet. Add posts in the admin panel.</p>
          ) : (
            <>
              <div className="grid sm:grid-cols-3 gap-6">
                {latestPosts.map((post: any) => (
                  <article key={post.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition group">
                    <div className="relative">
                      {post.coverImage?.url ? (
                        <img
                          src={post.coverImage.url}
                          alt={post.title}
                          className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-56 bg-gray-100 flex items-center justify-center text-gray-300 text-5xl">🖼️</div>
                      )}
                      <DateBadge iso={post.publishedAt} />
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-gray-900 text-lg leading-snug mb-3">
                        <Link href={`/news/${post.slug}`} className="hover:text-red-700 transition-colors">
                          {post.title}
                        </Link>
                      </h3>
                      <Link href={`/news/${post.slug}`} className="text-red-700 font-semibold text-sm underline underline-offset-2 hover:text-red-900">
                        Read More
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
              <div className="text-center mt-8">
                <Link href="/news" className="inline-block border border-gray-300 text-gray-700 font-medium px-6 py-2 rounded-full hover:border-red-700 hover:text-red-700 transition">
                  View all news →
                </Link>
              </div>
            </>
          )}
        </section>

        {/* ── Gallery preview ── */}
        {galleryImages.length > 0 && (
          <section>
            <p className="text-center text-xs font-bold tracking-widest text-amber-600 uppercase mb-1">Gallery</p>
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Photo Gallery</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {galleryImages.map((row: any, i: number) => (
                <div key={i} className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100 shadow-sm hover:shadow-md transition group">
                  {row.image?.url && (
                    <img
                      src={row.image.url}
                      alt={row.caption ?? ''}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link href="/gallery" className="inline-block border border-gray-300 text-gray-700 font-medium px-6 py-2 rounded-full hover:border-amber-600 hover:text-amber-600 transition">
                View full gallery →
              </Link>
            </div>
          </section>
        )}

        {/* ── Leadership ── */}
        {leadership.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Leadership</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {leadership.map((person: any) => (
                <div key={person.id} className="text-center">
                  {person.photo?.url ? (
                    <img src={person.photo.url} alt={person.name} className="w-24 h-24 rounded-full object-cover mx-auto border-2 border-blue-100" />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-blue-100 mx-auto flex items-center justify-center text-3xl">👤</div>
                  )}
                  <p className="mt-2 font-semibold text-gray-800 text-sm">{person.name}</p>
                  <p className="text-xs text-gray-500">{person.designation}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-6">
              <Link href="/faculty" className="text-sm text-blue-600 hover:underline">Meet all faculty →</Link>
            </div>
          </section>
        )}



      </div>
    </>
  )
}
