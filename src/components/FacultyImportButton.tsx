export function FacultyImportButton() {
  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <a
        href="/tools/faculty-import"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.45rem 1rem',
          background: 'transparent',
          color: 'rgba(255,255,255,0.75)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '6px',
          textDecoration: 'none',
          fontSize: '0.8rem',
          fontWeight: 500,
        }}
      >
        ↑ Import from Excel
      </a>
    </div>
  )
}
