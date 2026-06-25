import type { CollectionConfig } from 'payload'
import { admins, adminsOrPublished } from '../access'
import { ImageSlider } from '../blocks/ImageSlider'
import { ImageBlock } from '../blocks/ImageBlock'
import { ImageText } from '../blocks/ImageText'

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
    {
      name: 'blocks',
      type: 'blocks',
      blocks: [ImageSlider, ImageBlock, ImageText],
      admin: {
        description: 'Optional: add image slideshows, positioned images, or image+text sections below the article body.',
      },
    },
  ],
}
