# School Site (Next.js + Payload CMS) — demo build

A structurally complete starter for a school website (news, galleries, faculty,
flexible pages, a gated student portal) built on **Next.js 16 + Payload CMS 3 +
PostgreSQL**. See `docs/PROJECT_CONTEXT.md` and `CLAUDE.md`.

## What's included
- `src/payload.config.ts`, all collections, globals, blocks, and access helpers
- Public Next.js pages under `src/app/(frontend)/`
- `CLAUDE.md` (Claude Code project memory) and `docs/PROJECT_CONTEXT.md`

> These `src/` files are meant to be dropped on top of a freshly scaffolded
> Payload project, which supplies the `(payload)` admin route group and boilerplate.

## Setup
1. **Scaffold the base app** (gives you the `/admin` route group and config wiring):
   ```bash
   pnpm create payload-app@latest school-site -t blank --db postgres
   ```
2. **Copy these files** into the generated project (overwrite `src/payload.config.ts`,
   add the `collections/`, `globals/`, `blocks/`, `access/` folders and the
   `(frontend)` pages).
3. **Configure env**: copy `.env.example` to `.env` and fill in `DATABASE_URI` and
   `PAYLOAD_SECRET` (`openssl rand -base64 32`). A free Neon or Supabase Postgres works.
4. **Install & run**:
   ```bash
   pnpm install
   pnpm dev
   ```
5. Open `http://localhost:3000/admin`, create the first admin user, and add a few
   demo records (a Page, some Posts, a Gallery, Faculty, the SiteSettings global).
6. Public site renders at `http://localhost:3000`.

## Then hand it to Claude Code
Open the project folder in Claude Code. `CLAUDE.md` loads automatically every session.
Try: "Read CLAUDE.md and docs/PROJECT_CONTEXT.md, then build out the Pages block
renderer for the Hero, RichText, ImageText, and Timeline blocks."
