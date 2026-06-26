export function FacultyImportButton() {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.75rem' }}>
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
          color: 'var(--theme-text)',
          border: '1px solid var(--theme-border-color)',
          borderRadius: '4px',
          textDecoration: 'none',
          fontSize: '0.8rem',
          fontWeight: 500,
          cursor: 'pointer',
        }}
      >
        ↑ Bulk Import from Excel
      </a>
    </div>
  )
}
