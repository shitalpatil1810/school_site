import { getPayload } from 'payload'
import config from '@payload-config'

export const revalidate = 60

const CATEGORY_ORDER = ['leadership', 'faculty', 'admin-staff']
const CATEGORY_LABEL: Record<string, string> = {
  leadership: 'Leadership',
  faculty: 'Faculty',
  'admin-staff': 'Administration',
}

export default async function FacultyPage() {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({ collection: 'faculty', limit: 100, sort: 'order', depth: 1 })

  const grouped = CATEGORY_ORDER.reduce<Record<string, any[]>>((acc, cat) => {
    acc[cat] = docs.filter((p: any) => p.category === cat)
    return acc
  }, {})

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 bg-white rounded-2xl shadow-sm my-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-10">Our Faculty & Leadership</h1>

      {docs.length === 0 && (
        <p className="text-gray-500">No faculty profiles yet. Add them in the admin panel.</p>
      )}

      {CATEGORY_ORDER.map((cat) => {
        const people = grouped[cat]
        if (!people?.length) return null
        return (
          <section key={cat} className="mb-12">
            <h2 className="text-xl font-semibold text-gray-700 border-b border-gray-200 pb-2 mb-6">
              {CATEGORY_LABEL[cat]}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {people.map((person: any) => (
                <div key={person.id} className="text-center group">
                  {person.photo?.url ? (
                    <img
                      src={person.photo.url}
                      alt={person.name}
                      className="w-28 h-28 rounded-full object-cover mx-auto border-2 border-blue-100 group-hover:border-blue-400 transition"
                    />
                  ) : (
                    <div className="w-28 h-28 rounded-full bg-blue-50 border-2 border-blue-100 mx-auto flex items-center justify-center text-4xl">
                      👤
                    </div>
                  )}
                  <p className="mt-3 font-semibold text-gray-800">{person.name}</p>
                  <p className="text-sm text-blue-600">{person.designation}</p>
                  {person.department && <p className="text-xs text-gray-400">{person.department}</p>}
                </div>
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
