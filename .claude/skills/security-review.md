# Security Review — SRP School Website Stack

Use this skill when asked to audit security in this project, before merging a PR, or after adding new API routes, forms, or CMS configuration. Covers OWASP Top 10 mapped to the specific stack: Next.js, Payload CMS, PostgreSQL, and React.

## Instructions

Read every specified or recently changed file. Work through each section that applies. Report findings grouped by severity:

- **Critical** — exploitable now; block the merge
- **High** — likely exploitable under realistic conditions; fix before release
- **Medium** — exploitable under specific conditions; fix in current sprint
- **Low** — defense-in-depth; fix when touching the area

End with a pass/fail verdict and a prioritised fix list.

---

### 1. Input Validation & Injection (OWASP A03)

**Next.js Route Handlers & Server Actions**
- [ ] All user-supplied data validated with Zod before any database or filesystem operation
- [ ] File upload endpoints restrict MIME type, extension, and file size — never trust `Content-Type` header alone
- [ ] Query parameters parsed and typed — never passed raw to a database query
- [ ] `searchParams` values treated as untrusted strings even inside Server Components

**PostgreSQL / Drizzle ORM**
- [ ] Zero string-interpolated SQL (`\`SELECT * FROM ${table}\`` is a critical finding)
- [ ] All queries use Drizzle's query builder or `sql` tagged template with bound parameters
- [ ] `LIMIT` applied to all list queries — no unbounded result sets

**Payload CMS**
- [ ] `validate` functions defined on all fields that accept free text
- [ ] Rich text content sanitized before rendering (Payload's lexical renderer is safe; custom renderers must use DOMPurify or equivalent)

---

### 2. Authentication & Authorisation (OWASP A01, A07)

**Payload CMS Access Control**
- [ ] Every collection has explicit `create`, `read`, `update`, `delete` access functions — no implicit `true` on write operations for unauthenticated users
- [ ] Every global has explicit `read` and `update` access functions
- [ ] Field-level access control (`access.read`, `access.update`) applied to sensitive fields (email, phone, internal notes)
- [ ] Admin panel restricted: `PAYLOAD_SECRET` is a strong random string (≥32 chars), stored only in env

**Next.js Route Handlers**
- [ ] Server Actions and Route Handlers that mutate data verify the caller's session before acting
- [ ] No authorisation logic duplicated on the client — server is the authority
- [ ] `cookies()` / `headers()` used to read session; session token never passed in query params

**General**
- [ ] No hardcoded credentials, API keys, or secrets anywhere in source files
- [ ] `.env.local` is in `.gitignore`; run `git log -p --all -- .env*` to confirm no past commit exposed secrets
- [ ] `NEXT_PUBLIC_` env vars contain no secrets — they are bundled into the client JS

---

### 3. Cross-Site Scripting — XSS (OWASP A03)

- [ ] No `dangerouslySetInnerHTML` without explicit DOMPurify sanitization of the content
- [ ] Rich text from Payload rendered only via the official Payload lexical React renderer — not via `innerHTML`
- [ ] User-supplied strings never used to set `href` on `<a>` without URL scheme validation (`javascript:` protocol blocked)
- [ ] `Content-Security-Policy` header configured in `next.config.ts` — at minimum blocks inline scripts from unknown origins
- [ ] No `eval()`, `Function()`, or dynamic `import()` with user-controlled paths

---

### 4. Cross-Site Request Forgery — CSRF (OWASP A01)

- [ ] React Server Actions are CSRF-safe by default (Next.js adds origin check) — confirm no custom Route Handler duplicates mutation logic without a CSRF token
- [ ] State-changing Route Handlers (`POST`, `PUT`, `PATCH`, `DELETE`) verify `Origin` or `Referer` header matches the site origin
- [ ] Forms that call Route Handlers directly (not Server Actions) include a CSRF token

---

### 5. Security Misconfiguration (OWASP A05)

**Next.js Headers (`next.config.ts`)**
- [ ] `X-Frame-Options: DENY` or `frame-ancestors 'none'` in CSP (clickjacking)
- [ ] `X-Content-Type-Options: nosniff`
- [ ] `Referrer-Policy: strict-origin-when-cross-origin`
- [ ] `Permissions-Policy` disables unused browser features (camera, microphone, geolocation)
- [ ] `Strict-Transport-Security` set for production (`max-age=63072000; includeSubDomains`)

**Payload CMS**
- [ ] Admin route (`/admin`) blocked at CDN/WAF level in production for non-staff IPs where possible
- [ ] `cors` option in Payload config restricted to known origins — not `'*'`
- [ ] `serverURL` in Payload config set to the production domain, not `localhost`

**PostgreSQL**
- [ ] Database user has least-privilege: only `SELECT`, `INSERT`, `UPDATE`, `DELETE` on application tables — no `DROP`, `CREATE`, `TRUNCATE` in the app role
- [ ] Database not exposed on a public network interface; accessible only from the app server
- [ ] SSL (`sslmode=require`) enforced in `DATABASE_URI`

---

### 6. Sensitive Data Exposure (OWASP A02)

- [ ] Passwords never logged or returned in API responses
- [ ] Payload user collection does not expose the `password` field via any API endpoint or collection hook log
- [ ] PII (student names, parent contacts, addresses) returned only to authenticated and authorised users
- [ ] `console.log` statements removed or replaced with a structured logger that redacts sensitive fields in production
- [ ] Error responses to the client do not include stack traces or database error messages — use generic messages; log detail server-side only

---

### 7. Vulnerable & Outdated Dependencies (OWASP A06)

- [ ] Run `pnpm audit` — report any Critical or High CVEs
- [ ] Run `pnpm outdated` — flag packages more than one major version behind
- [ ] No packages with known prototype pollution vulnerabilities in the dependency tree
- [ ] Payload CMS, Next.js, and Drizzle on their latest stable patch versions

---

### 8. Server-Side Request Forgery — SSRF (OWASP A10)

- [ ] No Route Handler or Server Action accepts a URL from user input and fetches it server-side without an allowlist check
- [ ] Webhook endpoints that accept a callback URL validate the URL against an allowlist of known domains
- [ ] `next/image` `remotePatterns` in `next.config.ts` is restrictive — not a wildcard `**` hostname

---

### 9. File Upload Security

- [ ] Payload media collection has `mimeTypes` restricted to safe types (images, PDF) — no `.js`, `.html`, `.php` allowed
- [ ] Uploaded file names sanitized before storage (Payload handles this; verify no custom storage adapter bypasses it)
- [ ] Uploaded files served from a separate origin or with `Content-Disposition: attachment` to prevent script execution
- [ ] Maximum file size enforced both client-side (UX) and server-side (authoritative)

---

### 10. Rate Limiting & Abuse Prevention

- [ ] Authentication endpoints (`/api/users/login`) have rate limiting at the CDN or middleware level
- [ ] Public forms (contact, enquiry) have CAPTCHA or honeypot field to prevent bot submissions
- [ ] API routes that trigger emails or external calls are rate-limited per IP

---

### Quick-Scan Commands

Run these before completing the review:

```bash
# Secret patterns in source
grep -rE "(password|secret|api_key|token|DATABASE_URI)\s*=\s*['\"][^'\"]{6,}" src/ --include="*.ts" --include="*.tsx" --include="*.js"

# dangerouslySetInnerHTML usage
grep -rn "dangerouslySetInnerHTML" src/

# Raw SQL interpolation
grep -rn "sql\`.*\${" src/

# any type usage
grep -rn ": any" src/ --include="*.ts" --include="*.tsx"

# Dependency audit
pnpm audit

# Check for exposed .env files in git history
git log --all --full-history -- "**/.env*"
```
