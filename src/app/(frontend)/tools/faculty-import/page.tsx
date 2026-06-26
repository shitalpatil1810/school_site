import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'
import { FacultyImportForm } from '@/components/FacultyImportForm'

export const dynamic = 'force-dynamic'

export default async function FacultyImportPage() {
  const headersList = await headers()
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: headersList })

  if (!user) {
    redirect('/admin')
  }

  return <FacultyImportForm />
}
