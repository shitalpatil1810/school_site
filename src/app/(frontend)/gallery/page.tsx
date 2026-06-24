import { getPayload } from 'payload'
import config from '@payload-config'

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
        {docs.map((album: any) => (
          <section key={album.id}>
            <div className="flex items-baseline gap-3 mb-5">
              <h2 className="text-xl font-bold text-gray-800">{album.title}</h2>
              {album.date && (
                <span className="text-sm text-gray-400">{album.date.slice(0, 10)}</span>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {(album.images ?? []).map((row: any, i: number) => (
                <div
                  key={i}
                  className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100 shadow-sm hover:shadow-md transition group"
                >
                  {row.image?.url ? (
                    <img
                      src={row.image.url}
                      alt={row.caption ?? album.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-4xl">🖼️</div>
                  )}
                  {row.caption && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-3 py-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <p className="text-white text-xs truncate">{row.caption}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
