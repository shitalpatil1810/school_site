# Code Review — SRP School Website Stack

Use this skill when asked to review code in this project. It checks HTML, CSS, Tailwind, Next.js, React, Payload CMS, TypeScript, and PostgreSQL against project standards.

## Instructions

Read every changed or specified file fully. Work through each checklist section that applies to the files being reviewed. Report only real findings — skip sections with nothing to flag. Group findings by file and severity: **Critical** (must fix before merge), **Warning** (should fix), **Suggestion** (optional improvement).

---

### HTML & Semantic HTML

- [ ] Correct semantic elements used (`<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<header>`, `<footer>`)
- [ ] Exactly one `<h1>` per page; heading levels do not skip
- [ ] Every `<img>` has a non-empty `alt` unless it is purely decorative (`alt=""`)
- [ ] `<button>` used for actions, `<a href>` used for navigation — not swapped
- [ ] Every form control has an associated `<label>` via `for`/`id` or wrapping
- [ ] `<table>` elements have `<caption>`, `scope` on `<th>`, and `<thead>`/`<tbody>`
- [ ] No ARIA used where a native HTML element already provides the semantics
- [ ] Skip-navigation link is the first focusable element on each page layout
- [ ] Landmark regions present: header, nav, main, footer

### CSS & Tailwind CSS

- [ ] No `!important` without an explanatory comment
- [ ] No hardcoded arbitrary Tailwind values (`w-[743px]`) where a theme token exists
- [ ] Focus styles use `focus-visible:` not `focus:` to avoid outline on mouse click
- [ ] Focus rings are visible: `focus-visible:ring-2 focus-visible:ring-offset-2`
- [ ] `outline-none` never appears without a replacement ring
- [ ] `sr-only` used for visually hidden but screen-reader-visible text
- [ ] Responsive prefixes are mobile-first (`sm:`, `md:`, `lg:`) — no desktop-first overrides
- [ ] `prefers-reduced-motion` media query wraps all non-trivial animations
- [ ] Color contrast: text colors paired with background colors meet WCAG AA (4.5:1 normal, 3:1 large)
- [ ] Color is never the sole differentiator — icon, pattern, or label always accompanies it

### Next.js 15

- [ ] Components default to Server Components; `"use client"` only where browser APIs or interactivity required
- [ ] Each route segment has a `loading.tsx` and `error.tsx`
- [ ] Each page exports `generateMetadata` with `title`, `description`, and `openGraph`
- [ ] All images use `next/image` with `alt`, `width`+`height` or `fill` with a sized parent, and a `sizes` prop
- [ ] All fonts use `next/font` — no CDN `<link>` for Google Fonts
- [ ] All internal links use `next/link`
- [ ] `NEXT_PUBLIC_` prefix only on env vars that are safe to expose to the browser
- [ ] `process.env` not imported in Client Components (no `NEXT_PUBLIC_` prefix leaks private vars)
- [ ] `revalidatePath` / `revalidateTag` strategy documented at the top of files that use it
- [ ] Dynamic imports (`next/dynamic`) used for heavy client-only libraries

### React 19

- [ ] No class components
- [ ] Component file name matches the exported component name exactly (PascalCase)
- [ ] `key` props on lists use stable unique IDs — not array indices on dynamic lists
- [ ] No side effects in the render body; effects use `useEffect` with explicit dependency arrays
- [ ] `useMemo` / `useCallback` only where profiling shows benefit — not applied speculatively
- [ ] Prop drilling not deeper than two levels; Context or state management used otherwise
- [ ] Modal dialogs trap focus and restore focus on close
- [ ] `aria-live="polite"` regions used for async content updates

### Payload CMS 3

- [ ] Access control functions defined on every collection and global; no unguarded public write
- [ ] `richText` fields use lexical config consistently — no mixing lexical and slate
- [ ] `versions` enabled on all editorial content collections
- [ ] Relationship fields have `filterOptions` to prevent orphaned references
- [ ] Hooks are focused and fast — no synchronous heavy computation inside `beforeChange`/`afterChange`
- [ ] Seed scripts have a production guard (`if (process.env.NODE_ENV === 'production') return`)
- [ ] No raw database queries used to bypass Payload's access control layer

### TypeScript 5

- [ ] `tsconfig.json` has `"strict": true`
- [ ] No `any` — `unknown` used and narrowed with type guards
- [ ] No unnecessary type assertions (`as SomeType`) without an explanatory comment
- [ ] External API/form/CMS response shapes validated with Zod before use
- [ ] Types imported from `@/payload-types` rather than duplicated manually
- [ ] `satisfies` operator used for literal config objects where appropriate
- [ ] `const` assertions used for fixed lookup maps and config arrays

### PostgreSQL / Drizzle ORM

- [ ] No string-interpolated SQL — all queries use Drizzle's query builder or parameterized statements
- [ ] Payload migrations created via `pnpm payload migrate:create` — no manual DDL
- [ ] Fields used in filters and sorts have `index: true` in collection config
- [ ] Multi-step writes use `db.transaction()`
- [ ] `DATABASE_URI` sourced from env — not hardcoded anywhere
