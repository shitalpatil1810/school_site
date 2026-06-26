import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import * as XLSX from 'xlsx'

// Maps user-friendly Excel values to Payload category slugs
const CATEGORY_MAP: Record<string, 'leadership' | 'faculty' | 'admin-staff'> = {
  leadership: 'leadership',
  faculty: 'faculty',
  administration: 'admin-staff',
  'admin-staff': 'admin-staff',
  staff: 'admin-staff',
}

export async function POST(request: NextRequest) {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: request.headers })

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized — please log in to the admin panel first.' }, { status: 401 })
  }

  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return NextResponse.json({ error: 'Invalid request — expected multipart form data.' }, { status: 400 })
  }

  const file = formData.get('file') as File | null
  if (!file) {
    return NextResponse.json({ error: 'No file provided.' }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const workbook = XLSX.read(buffer)
  const sheet = workbook.Sheets[workbook.SheetNames[0]]
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '' })

  if (rows.length === 0) {
    return NextResponse.json({ error: 'The spreadsheet is empty or has no data rows.' }, { status: 400 })
  }

  const createdNames: string[] = []
  const errors: string[] = []

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    const rowNum = i + 2 // account for header row

    const name = String(row['name'] ?? '').trim()
    const designation = String(row['designation'] ?? '').trim()
    const categoryRaw = String(row['category'] ?? '').toLowerCase().trim()
    const category = CATEGORY_MAP[categoryRaw]

    if (!name) {
      errors.push(`Row ${rowNum}: "name" is required`)
      continue
    }
    if (!designation) {
      errors.push(`Row ${rowNum}: "designation" is required`)
      continue
    }
    if (!category) {
      errors.push(`Row ${rowNum} (${name}): "category" must be Leadership, Faculty, or Administration — got "${row['category']}"`)
      continue
    }

    const email = String(row['email'] ?? '').trim()
    const linkedin = String(row['linkedin'] ?? '').trim()
    const orderRaw = row['order']
    const order = orderRaw !== '' && orderRaw != null ? Number(orderRaw) : 0

    try {
      await payload.create({
        collection: 'faculty',
        data: {
          name,
          designation,
          category,
          department: String(row['department'] ?? '').trim() || undefined,
          bio: String(row['bio'] ?? '').trim() || undefined,
          social: {
            email: email || undefined,
            linkedin: linkedin || undefined,
          },
          order,
        },
      })
      createdNames.push(name)
    } catch (err) {
      errors.push(`Row ${rowNum} (${name}): ${err instanceof Error ? err.message : 'Create failed'}`)
    }
  }

  return NextResponse.json({ created: createdNames.length, createdNames, errors })
}
