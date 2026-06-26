import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'
import Link from 'next/link'
import PostImageSlider from '../../components/PostImageSlider'

export const revalidate = 60

const CATEGORY_BADGE: Record<string, string> = {
  news: 'bg-gray-100 text-gray-700',
  event: 'bg-green-100 text-green-700',
  notice: 'bg-amber-100 text-amber-700',
}

const SIZE_CLASS: Record<string, string> = {
  small: 'w-1/3',
  medium: 'w-1/2',
  large: 'w-2/3',
}

function PostBlocks({ blocks }: { blocks: any[] }) {
  if (!blocks?.length) return null
  return (
    <div className="mt-8 space-y-8">
      {blocks.map((block: any, i: number) => {
        if (block.blockType === 'imageSlider') {
          return (
            <PostImageSlider
              key={i}
              slides={block.slides ?? []}
              height={block.height ?? 'medium'}
            />
          )
        }

        if (block.blockType === 'imageBlock') {
          const url = block.image?.url
          if (!url) return null
          const pos = block.position ?? 'full'
          const sizeClass = SIZE_CLASS[block.size ?? 'medium'] ?? 'w-1/2'

          if (pos === 'full') {
            return (
              <figure key={i} className="my-4">
                <img src={url} alt={block.caption ?? ''} className="w-full rounded-xl shadow-sm" />
                {block.caption && <figcaption className="text-center text-sm text-gray-500 mt-2">{block.caption}</figcaption>}
              </figure>
            )
          }
          if (pos === 'center') {
            return (
              <figure key={i} className={`my-4 mx-auto ${sizeClass}`}>
                <img src={url} alt={block.caption ?? ''} className="w-full rounded-xl shadow-sm" />
                {block.caption && <figcaption className="text-center text-sm text-gray-500 mt-2">{block.caption}</figcaption>}
              </figure>
            )
          }
          // left / right float
          const floatClass = pos === 'left' ? 'float-left mr-6 mb-4' : 'float-right ml-6 mb-4'
          return (
            <figure key={i} className={`${floatClass} ${sizeClass}`}>
              <img src={url} alt={block.caption ?? ''} className="w-full rounded-xl shadow-sm" />
              {block.caption && <figcaption className="text-center text-sm text-gray-500 mt-2">{block.caption}</figcaption>}
            </figure>
          )
        }

        if (block.blockType === 'imageText') {
          const url = block.image?.url
          const isLeft = (block.imagePosition ?? 'left') === 'left'
          return (
            <div key={i} className={`flex gap-6 items-start ${isLeft ? '' : 'flex-row-reverse'}`}>
              {url && (
                <img src={url} alt={block.heading ?? ''} className="w-2/5 rounded-xl shadow-sm object-cover" />
              )}
              <div className="flex-1">
                {block.heading && <h3 className="text-xl font-bold text-gray-900 mb-2">{block.heading}</h3>}
                {block.body && (
                  <div className="prose prose-gray max-w-none">
                    <RichText data={block.body} />
                  </div>
                )}
              </div>
            </div>
          )
        }

        return null
      })}
    </div>
  )
}

export default async function NewsDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'posts', limit: 1, depth: 2,
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

      {/* Optional blocks: slideshows, positioned images, image+text */}
      <PostBlocks blocks={(post as any).blocks ?? []} />

    </div>
  )
}
