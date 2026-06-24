import type { CollectionConfig } from 'payload'
import { admins, adminsOrPublished } from '../access'

// News & Events articles. Maps to the church site's /News module.
export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'category', 'publishedAt', '_status'], group: 'Content' },
  versions: { drafts: true },
  access: { read: adminsOrPublished, create: admins, update: admins, delete: admins },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'slug', type: 'text', required: true, unique: true, index: true,
      admin: { description: 'URL segment, e.g. annual-day-2026' },
    },
    {
      name: 'category', type: 'select', defaultValue: 'news',
      options: [
        { label: 'News', value: 'news' },
        { label: 'Event', value: 'event' },
        { label: 'Notice', value: 'notice' },
      ],
    },
    { name: 'publishedAt', type: 'date', admin: { date: { pickerAppearance: 'dayOnly' } } },
    { name: 'coverImage', type: 'upload', relationTo: 'media' },
    { name: 'excerpt', type: 'textarea', admin: { description: 'Short summary for listing cards.' } },
    { name: 'content', type: 'richText' },
  ],
}
