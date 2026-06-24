import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import type { Page } from '@/payload-types'

export const revalidate = 60

// Renders any flexible Page by slug (about-us, history, academics...).
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
    <div>
      <h1>{page.title}</h1>
      {/* TODO: render page.layout blocks (Hero, RichText, ImageText, Timeline) */}
      <pre style={{ fontSize: 12, color: '#888' }}>{JSON.stringify(page.layout, null, 2)}</pre>
    </div>
  )
}
