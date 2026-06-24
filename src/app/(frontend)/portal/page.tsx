import { getPayload } from 'payload'
import config from '@payload-config'
import { headers as nextHeaders } from 'next/headers'

// Gated student directory. Students must be logged in (auth handled by Payload).
// For production, replace email+password with Admission No + OTP — see CLAUDE.md.
export const dynamic = 'force-dynamic'

export default async function PortalPage() {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await nextHeaders() })

  if (!user) {
    return (
      <div>
        <h1>Student Portal</h1>
        <p>Please log in to view your records. (Wire up a login form posting to Payload auth.)</p>
      </div>
    )
  }

  // Access control ensures a student only sees their own record.
  const { docs } = await payload.find({ collection: 'students', limit: 1, overrideAccess: false, user })
  const me = docs[0]

  return (
    <div>
      <h1>Welcome, {me?.name}</h1>
      <ul>
        <li>Admission No: {me?.admissionNo}</li>
        <li>Class: {me?.class} {me?.section}</li>
        <li>Roll No: {me?.rollNo}</li>
      </ul>
    </div>
  )
}
