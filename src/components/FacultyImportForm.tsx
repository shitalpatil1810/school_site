'use client'

import { useRef, useState } from 'react'

type ImportResult = {
  created: number
  createdNames: string[]
  errors: string[]
}

export function FacultyImportForm() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ImportResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!file) return

    setLoading(true)
    setResult(null)
    setError(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/faculty/import', { method: 'POST', body: formData })
      const data: ImportResult & { error?: string } = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Import failed.')
      } else {
        setResult(data)
        setFile(null)
        if (inputRef.current) inputRef.current.value = ''
      }
    } catch {
      setError('Network error — please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 760, margin: '40px auto', padding: '0 24px', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#1a1a1a' }}>
      <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 6 }}>Import Faculty from Excel</h1>
      <p style={{ color: '#555', marginBottom: 28, fontSize: 15 }}>
        Bulk-create faculty records by uploading a <code style={{ background: '#f0f0f0', padding: '2px 6px', borderRadius: 4 }}>.xlsx</code> file.
        Photos must be added separately via the{' '}
        <a href="/admin/collections/faculty" style={{ color: '#0070f3' }}>Admin panel</a>.
      </p>

      {/* Format reference */}
      <div style={{ background: '#f8f9fa', border: '1px solid #e0e0e0', borderRadius: 10, padding: '20px 24px', marginBottom: 28 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 14, marginTop: 0 }}>Excel Column Reference</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ background: '#e8ecf0' }}>
              {['Column header', 'Required', 'Accepted values / notes'].map(h => (
                <th key={h} style={{ padding: '8px 12px', textAlign: 'left', border: '1px solid #ccc', fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ['name', true, 'Full name'],
              ['designation', true, 'Job title (e.g. Principal, Senior Teacher)'],
              ['category', true, 'Leadership · Faculty · Administration'],
              ['department', false, 'Department name (e.g. Mathematics, English)'],
              ['bio', false, 'Short biography — plain text'],
              ['email', false, 'Work email address'],
              ['linkedin', false, 'Full LinkedIn profile URL'],
              ['order', false, 'Number — lower numbers appear first (default 0)'],
            ].map(([col, req, notes]) => (
              <tr key={col as string} style={{ background: 'transparent' }}>
                <td style={{ padding: '6px 12px', border: '1px solid #ccc', fontFamily: 'monospace', fontSize: 13 }}>{col as string}</td>
                <td style={{ padding: '6px 12px', border: '1px solid #ccc', color: req ? '#b00' : '#555', fontWeight: req ? 600 : 400 }}>
                  {req ? 'Required' : 'Optional'}
                </td>
                <td style={{ padding: '6px 12px', border: '1px solid #ccc', color: '#444' }}>{notes as string}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <a
          href="/api/faculty/import/sample"
          download
          style={{
            display: 'inline-block', marginTop: 16, padding: '8px 18px',
            background: '#0070f3', color: '#fff', borderRadius: 6,
            textDecoration: 'none', fontSize: 14, fontWeight: 500,
          }}
        >
          ↓ Download Sample .xlsx
        </a>
      </div>

      {/* Upload form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
        <label style={{ display: 'block', fontWeight: 600, marginBottom: 8, fontSize: 15 }}>
          Select Excel file
        </label>
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={e => setFile(e.target.files?.[0] ?? null)}
          style={{ display: 'block', marginBottom: 16, fontSize: 14 }}
        />
        <button
          type="submit"
          disabled={!file || loading}
          style={{
            padding: '10px 28px',
            background: !file || loading ? '#9ca3af' : '#166534',
            color: '#fff', border: 'none', borderRadius: 7,
            cursor: !file || loading ? 'not-allowed' : 'pointer',
            fontSize: 15, fontWeight: 600, transition: 'background 0.15s',
          }}
        >
          {loading ? 'Importing…' : 'Import Faculty'}
        </button>
      </form>

      {/* Error banner */}
      {error && (
        <div style={{ padding: '14px 18px', background: '#fff0f0', border: '1px solid #fca5a5', borderRadius: 8, color: '#991b1b', fontSize: 14 }}>
          {error}
        </div>
      )}

      {/* Success / partial results */}
      {result && (
        <div style={{ marginTop: 8 }}>
          <div style={{ padding: '14px 18px', background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 8, marginBottom: 14 }}>
            <strong style={{ color: '#166534', fontSize: 15 }}>
              ✓ {result.created} record{result.created !== 1 ? 's' : ''} imported successfully
            </strong>
            {result.createdNames.length > 0 && (
              <ul style={{ margin: '8px 0 0', paddingLeft: 22, color: '#166534', fontSize: 13 }}>
                {result.createdNames.map(n => <li key={n}>{n}</li>)}
              </ul>
            )}
          </div>

          {result.errors.length > 0 && (
            <div style={{ padding: '14px 18px', background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 8 }}>
              <strong style={{ color: '#9a3412', fontSize: 15 }}>
                ⚠ {result.errors.length} row{result.errors.length !== 1 ? 's' : ''} skipped
              </strong>
              <ul style={{ margin: '8px 0 0', paddingLeft: 22, color: '#9a3412', fontSize: 13 }}>
                {result.errors.map((e, i) => <li key={i}>{e}</li>)}
              </ul>
            </div>
          )}

          <p style={{ marginTop: 16, fontSize: 14, color: '#555' }}>
            <a href="/admin/collections/faculty" style={{ color: '#0070f3' }}>View all faculty in Admin →</a>
          </p>
        </div>
      )}
    </div>
  )
}
