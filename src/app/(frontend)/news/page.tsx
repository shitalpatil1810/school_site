import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'

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

const CATEGORY_BADGE: Record<string, string> = {
  news: 'bg-blue-100 text-blue-700',
  event: 'bg-green-100 text-green-700',
  notice: 'bg-amber-100 text-amber-700',
}

export default async function NewsListing() {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'posts', limit: 50, sort: '-publishedAt', depth: 1,
    where: { _status: { equals: 'published' } },
  })

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 bg-white rounded-2xl shadow-sm my-6">
      <h1 className="text-3xl font-bold text-gray-900 text-center mb-10">News &amp; Events</h1>

      {docs.length === 0 ? (
        <p className="text-gray-500 text-center">No posts published yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {docs.map((post: any) => (
            <article key={post.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition group">
              {/* Image + date badge */}
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
                {post.category && (
                  <span className={`absolute top-3 right-3 text-xs font-semibold px-2 py-0.5 rounded-full ${CATEGORY_BADGE[post.category] ?? 'bg-gray-100 text-gray-600'}`}>
                    {post.category}
                  </span>
                )}
              </div>
              {/* Text */}
              <div className="p-5">
                <h2 className="font-bold text-gray-900 text-lg leading-snug mb-3">
                  <Link href={`/news/${post.slug}`} className="hover:text-red-700 transition-colors">
                    {post.title}
                  </Link>
                </h2>
                {post.excerpt && (
                  <p className="text-sm text-gray-500 line-clamp-2 mb-3">{post.excerpt}</p>
                )}
                <Link
                  href={`/news/${post.slug}`}
                  className="text-red-700 font-semibold text-sm underline underline-offset-2 hover:text-red-900"
                >
                  Read More
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
