# Project Context — School Website

## Why this project exists
A full-featured website for a school with content pages, news, photo/video galleries,
a staff/faculty grid, a contact page with a map, and a login-gated student portal.
Built with a clean, reusable architecture so it can be maintained and extended by
non-technical staff through the Payload CMS admin.

## Why Next.js + Payload CMS was chosen
Evaluated several routes (custom Next.js + Postgres, a Spring Boot + Angular stack,
WordPress/Squarespace, and headless CMSes). Chosen: **Next.js + Payload** because:
- One TypeScript codebase = frontend + backend + a generated self-service admin.
- Payload auto-generates the admin UI, so non-technical staff manage all dynamic
  content (news, galleries, faculty, students) with no custom admin to build.
- Single deploy, low hosting cost, and strong AI-codegen support.

## Feature overview
| Feature | Pages / Collections | Payload piece |
|---|---|---|
| About / History (timeline) | About, History | `pages` + Timeline block |
| Leadership / Patrons | Leadership | `faculty` (category: leadership) |
| Faculty / Staff grid | Staff directory | `faculty` |
| Academics / Departments / Facilities | Flexible content pages | `pages` |
| News & Events | News, notices, events | `posts` |
| Photo Gallery | Photo albums | `galleries` + `media` |
| Video Gallery | YouTube / Vimeo embeds | `videos` |
| Student Portal (Admission No + DOB login) | Gated student records | `students` (auth, gated) |
| Contact + Google Map | Contact page | `site-settings` global |
| School hours / hero slides | Site-wide banners | `site-settings` global |

## Data model summary
- **users** — admin/staff auth (manage everything).
- **media** — uploads (images), with thumbnail/card/hero sizes.
- **pages** — flexible content pages composed of blocks (Hero, RichText, ImageText, Timeline).
- **posts** — news/events, draft+publish, slug detail pages.
- **galleries** — photo albums (array of images).
- **videos** — YouTube/Vimeo embeds.
- **faculty** — staff/leadership profiles (team grid), ordered.
- **students** — gated directory; auth-enabled; read access limited to self/admin.
- Globals: **site-settings**, **header**, **footer**.

## Status / next steps
1. Scaffold a blank `create-payload-app` project, then drop in these `src/` files.
2. Seed a few demo records via `/admin`.
3. Style the public pages with Tailwind + shadcn/ui.
4. Replace the student portal's email+password login with Admission No + OTP.

## Open decisions to revisit
- Media storage in production (Cloudflare R2 / S3 / Vercel Blob) — currently local disk.
- Hosting target (Vercel vs self-hosted Docker on a VPS / Azure Container Apps).
- Exact student-login UX and OTP channel (email vs WhatsApp/SMS).
