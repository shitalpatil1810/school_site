import { getPayload } from 'payload'
import config from '@payload-config'

export const revalidate = 60

export default async function ContactPage() {
  const payload = await getPayload({ config })
  const settings = await payload.findGlobal({ slug: 'site-settings' })
  const c = settings?.contact ?? {}


  return (
    <div className="max-w-2xl mx-auto px-6 py-12 bg-white rounded-2xl shadow-sm my-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Contact Us</h1>

      <div className="space-y-4 mb-8">
        {c.address && (
          <div className="flex gap-3">
            <span className="text-xl mt-0.5">📍</span>
            <div>
              <p className="text-xs font-semibold uppercase text-gray-400 mb-0.5">Address</p>
              <p className="text-gray-700 whitespace-pre-line">{c.address}</p>
            </div>
          </div>
        )}
        {c.phone && (
          <div className="flex gap-3">
            <span className="text-xl mt-0.5">📞</span>
            <div>
              <p className="text-xs font-semibold uppercase text-gray-400 mb-0.5">Phone</p>
              <a href={`tel:${c.phone}`} className="text-blue-600 hover:underline">{c.phone}</a>
            </div>
          </div>
        )}
        {c.email && (
          <div className="flex gap-3">
            <span className="text-xl mt-0.5">✉️</span>
            <div>
              <p className="text-xs font-semibold uppercase text-gray-400 mb-0.5">Email</p>
              <a href={`mailto:${c.email}`} className="text-blue-600 hover:underline">{c.email}</a>
            </div>
          </div>
        )}
        {!c.address && !c.phone && !c.email && (
          <p className="text-gray-500 text-sm">No contact info yet. Fill in Site Settings in the admin panel.</p>
        )}
      </div>

      {c.mapEmbedUrl && (
        <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
          <iframe
            src={c.mapEmbedUrl}
            width="100%"
            height="450"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            title="Location map"
          />
        </div>
      )}
    </div>
  )
}
