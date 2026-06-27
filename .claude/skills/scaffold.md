# Scaffold — SRP School Website

Use this skill when asked to create a new page, component, Payload collection, or API route. It applies all project conventions from CLAUDE.md without the user having to repeat them.

## Instructions

Ask which of the following the user wants if not already specified: Page, Component, Payload Collection, Route Handler, or Server Action. Then follow the relevant template below exactly. Do not add fields, props, or options beyond what is asked.

---

### New Next.js Page (App Router)

Create three files:

**`src/app/(site)/<route>/page.tsx`**
```tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '<Page Title> | SRP School',
  description: '<One-sentence description>',
  openGraph: {
    title: '<Page Title> | SRP School',
    description: '<One-sentence description>',
  },
}

export default async function <PageName>Page() {
  return (
    <main>
      <h1><Page Title></h1>
    </main>
  )
}
```

**`src/app/(site)/<route>/loading.tsx`**
```tsx
export default function Loading() {
  return <div aria-busy="true" aria-label="Loading" />
}
```

**`src/app/(site)/<route>/error.tsx`**
```tsx
'use client'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <main>
      <h1>Something went wrong</h1>
      <button onClick={reset}>Try again</button>
    </main>
  )
}
```

---

### New React Component

Create one file at `src/components/<category>/<ComponentName>.tsx`:

```tsx
import type { FC } from 'react'

type <ComponentName>Props = {
  // props here
}

const <ComponentName>: FC<<ComponentName>Props> = ({ ...props }) => {
  return (
    <div>
      {/* content */}
    </div>
  )
}

export default <ComponentName>
```

Rules:
- Category is one of: `ui`, `blocks`, `layout`
- No default export if the component is a Server Component that re-exports named things
- Add `'use client'` at the top only if the component uses hooks or browser APIs

---

### New Payload Collection

Create one file at `src/payload/collections/<CollectionName>.ts`:

```ts
import type { CollectionConfig } from 'payload'

export const <CollectionName>: CollectionConfig = {
  slug: '<collection-slug>',
  admin: {
    useAsTitle: '<fieldName>',
  },
  access: {
    create: ({ req }) => Boolean(req.user),
    read: () => true,
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => req.user?.role === 'admin',
  },
  versions: {
    drafts: true,
  },
  fields: [
    // fields here
  ],
}
```

Then register it in `src/payload/payload.config.ts` under `collections: [...]`.

Rules:
- Access control functions must always be explicit — no implicit `true` on write operations
- Add `index: true` to any field used in list filters or sorts
- Add `validate` to any free-text field that accepts user input

---

### New Route Handler

Create `src/app/api/<path>/route.ts`:

```ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const bodySchema = z.object({
  // define expected shape
})

export async function POST(req: NextRequest) {
  const raw = await req.json().catch(() => null)
  const parsed = bodySchema.safeParse(raw)

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  // handler logic here

  return NextResponse.json({ ok: true })
}
```

Rules:
- Always validate with Zod before any database access
- Return generic error messages to the client; log detail server-side
- Add rate limiting at the middleware or CDN layer for any public endpoint

---

### New Server Action

Create in `src/app/actions/<actionName>.ts`:

```ts
'use server'

import { z } from 'zod'
import { getPayload } from 'payload'
import config from '@payload-config'

const inputSchema = z.object({
  // define expected shape
})

export async function <actionName>(input: unknown) {
  const parsed = inputSchema.safeParse(input)
  if (!parsed.success) {
    return { error: 'Invalid input' }
  }

  const payload = await getPayload({ config })
  // action logic here

  return { ok: true }
}
```

Rules:
- Input typed as `unknown`; always validate with Zod first
- Use `getPayload` — do not reach into the database directly
- Never return raw database errors or stack traces to the caller
