import type { CollectionConfig } from 'payload'
import { admins, adminsOrPublished } from '../access'
import { Hero } from '../blocks/Hero'
import { RichTextBlock } from '../blocks/RichTextBlock'
import { ImageText } from '../blocks/ImageText'
import { Timeline } from '../blocks/Timeline'

// Flexible content pages (About, History, Academics, Facilities, Departments...).
export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'slug', '_status'], group: 'Content' },
  versions: { drafts: true },
  access: { read: adminsOrPublished, create: admins, update: admins, delete: admins },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'slug', type: 'text', required: true, unique: true, index: true,
      admin: { description: 'URL segment, e.g. about-us, history, academics' },
    },
    {
      name: 'layout', type: 'blocks',
      blocks: [Hero, RichTextBlock, ImageText, Timeline],
      admin: { description: 'Compose the page from reusable content blocks.' },
    },
  ],
}
