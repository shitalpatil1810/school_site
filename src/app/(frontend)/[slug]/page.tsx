import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import type { Page } from '@/payload-types'
import { BlockRenderer } from '../components/blocks/BlockRenderer'

export const revalidate = 60

export default async function DynamicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'pages', limit: 1,
    where: { slug: { equals: slug }, _status: { equals: 'published' } }, depth: 2,
  })
  const page = docs[0] as Page
  if (!page) notFound()

  return (
    <main>
      {page.layout && page.layout.length > 0 ? (
        <BlockRenderer layout={page.layout} />
      ) : (
        <div className="mx-auto max-w-3xl px-6 py-16">
          <h1 className="text-3xl font-bold">{page.title}</h1>
        </div>
      )}
    </main>
  )
}
