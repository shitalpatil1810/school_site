import * as XLSX from 'xlsx'

export async function GET() {
  const wb = XLSX.utils.book_new()

  const data = [
    ['name', 'designation', 'category', 'department', 'bio', 'email', 'linkedin', 'order'],
    [
      'Dr. Rajesh Kumar', 'Principal', 'Leadership', 'Administration',
      'Over 20 years of educational leadership. Passionate about student success and faculty development.',
      'principal@school.edu', 'https://linkedin.com/in/rajesh-kumar', 1,
    ],
    [
      'Mrs. Sunita Sharma', 'Vice Principal', 'Leadership', 'Administration',
      'Dedicated to holistic student development and a positive school culture.',
      'vp@school.edu', '', 2,
    ],
    [
      'Mr. Anil Mehta', 'Head of Department', 'Faculty', 'Mathematics',
      'Passionate about making mathematics accessible and engaging for all students.',
      'anil.mehta@school.edu', '', 3,
    ],
    [
      'Ms. Priya Verma', 'Senior Teacher', 'Faculty', 'English',
      'Literature enthusiast with 10 years of experience in secondary education.',
      'priya.verma@school.edu', 'https://linkedin.com/in/priya-verma', 4,
    ],
    [
      'Mr. Suresh Patil', 'Office Superintendent', 'Administration', 'Administration',
      'Manages the day-to-day administrative operations of the school.',
      'suresh.patil@school.edu', '', 5,
    ],
  ]

  const ws = XLSX.utils.aoa_to_sheet(data)

  ws['!cols'] = [
    { wch: 25 }, // name
    { wch: 25 }, // designation
    { wch: 16 }, // category
    { wch: 18 }, // department
    { wch: 55 }, // bio
    { wch: 30 }, // email
    { wch: 42 }, // linkedin
    { wch: 8 },  // order
  ]

  XLSX.utils.book_append_sheet(wb, ws, 'Faculty')

  const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }) as Buffer

  return new Response(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="faculty-import-sample.xlsx"',
    },
  })
}
