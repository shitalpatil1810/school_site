# Project Context — School Demo (precursor to a Church website)

## Why this project exists
The end goal is a website for a parish church (modelled on an existing site with
content pages, news, photo/video galleries, a managing-committee grid, a contact
page with a map, and a login-gated member directory). Before building the real
thing, we are building a **structurally identical school website** as a low-risk
practice run. Same architecture, same collections, neutral demo content.

## Why Next.js + Payload CMS was chosen
Evaluated several routes (custom Next.js + Postgres, a Spring Boot + Angular stack,
WordPress/Squarespace, and headless CMSes). Chosen: **Next.js + Payload** because:
- One TypeScript codebase = frontend + backend + a generated self-service admin.
- Payload auto-generates the admin UI, so non-technical staff manage all dynamic
  content (news, galleries, committee, members) with no custom admin to build.
- Single deploy, low hosting cost, and strong AI-codegen support.

## Church → School feature mapping
| Church site | School site (this build) | Payload piece |
|---|---|---|
| History (timeline) | About / History | `pages` + Timeline block |
| Hierarchy / Patrons | Leadership | `faculty` (category: leadership) |
| Managing Committee | Faculty / Staff grid | `faculty` |
| Spiritual orgs, School page | Academics / Departments / Facilities | `pages` |
| News & Events | News & Events | `posts` |
| Photo Gallery | Gallery | `galleries` + `media` |
| Video Gallery | Video Gallery | `videos` |
| Member Directory (Membership ID + DOB login) | Student Portal (Admission No + DOB) | `students` (auth, gated) |
| Contact + Google Map | Contact + Map | `site-settings` global |
| Mass timings / banners | School hours / hero slides | `site-settings` global |

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
5. Once stable, fork the repo and re-skin collections/content for the church.

## Open decisions to revisit
- Media storage in production (Cloudflare R2 / S3 / Vercel Blob) — currently local disk.
- Hosting target (Vercel vs self-hosted Docker on a VPS / Azure Container Apps).
- Exact member-login UX and OTP channel (email vs WhatsApp/SMS).
