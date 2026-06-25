import { getPayload } from 'payload'
import config from '@payload-config'
import GalleryLightbox from '../components/GalleryLightbox'

export const revalidate = 60

export default async function GalleryPage() {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({ collection: 'galleries', limit: 50, depth: 2, sort: '-date' })

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 bg-white rounded-2xl shadow-sm my-6">
      <p className="text-center text-xs font-bold tracking-widest text-amber-600 uppercase mb-1">Gallery</p>
      <h1 className="text-3xl font-bold text-gray-900 text-center mb-10">Photo Gallery</h1>

      {docs.length === 0 && (
        <p className="text-gray-500 text-center">No galleries yet. Add photo albums in the admin panel.</p>
      )}

      <div className="space-y-14">
        {docs.map((album: any) => {
          const items = (album.images ?? [])
            .filter((row: any) => row.image?.url)
            .map((row: any) => ({
              url: row.image.url as string,
              alt: row.caption ?? album.title,
              caption: row.caption ?? '',
            }))

          return (
            <section key={album.id}>
              <div className="flex items-baseline gap-3 mb-5">
                <h2 className="text-xl font-bold text-gray-800">{album.title}</h2>
                {album.date && (
                  <span className="text-sm text-gray-400">{album.date.slice(0, 10)}</span>
                )}
                <span className="text-xs text-gray-400 ml-auto">{items.length} photo{items.length !== 1 ? 's' : ''}</span>
              </div>
              {items.length > 0 ? (
                <GalleryLightbox items={items} columns={3} />
              ) : (
                <p className="text-sm text-gray-400">No images in this album yet.</p>
              )}
            </section>
          )
        })}
      </div>
    </div>
  )
}
