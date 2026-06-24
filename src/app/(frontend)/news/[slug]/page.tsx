import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'
import Link from 'next/link'

export const revalidate = 60

const CATEGORY_BADGE: Record<string, string> = {
  news: 'bg-blue-100 text-blue-700',
  event: 'bg-green-100 text-green-700',
  notice: 'bg-amber-100 text-amber-700',
}

export default async function NewsDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'posts', limit: 1, depth: 1,
    where: { slug: { equals: slug }, _status: { equals: 'published' } },
  })
  const post = docs[0]
  if (!post) notFound()

  const publishedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : null

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 bg-white">

      {/* Back link */}
      <Link href="/news" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-red-700 transition-colors mb-8">
        ← Back to News &amp; Events
      </Link>

      {/* Cover image */}
      {(post as any).coverImage?.url && (
        <div className="rounded-2xl overflow-hidden mb-8 shadow-sm">
          <img
            src={(post as any).coverImage.url}
            alt={post.title}
            className="w-full h-72 object-cover"
          />
        </div>
      )}

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        {post.category && (
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${CATEGORY_BADGE[post.category] ?? 'bg-gray-100 text-gray-600'}`}>
            {post.category}
          </span>
        )}
        {publishedDate && (
          <span className="text-sm text-gray-400">{publishedDate}</span>
        )}
      </div>

      {/* Title */}
      <h1 className="text-3xl font-extrabold text-gray-900 leading-tight mb-4">{post.title}</h1>

      {/* Excerpt */}
      {post.excerpt && (
        <p className="text-lg text-gray-500 italic border-l-4 border-red-200 pl-4 mb-8">{post.excerpt}</p>
      )}

      <hr className="border-gray-100 mb-8" />

      {/* Rich text body */}
      {post.content && (
        <div className="prose prose-gray prose-lg max-w-none
          prose-headings:font-bold prose-headings:text-gray-900
          prose-p:text-gray-700 prose-p:leading-relaxed
          prose-a:text-red-700 prose-a:no-underline hover:prose-a:underline
          prose-img:rounded-xl prose-img:shadow-sm">
          <RichText data={post.content as any} />
        </div>
      )}

    </div>
  )
}
