import type { CollectionConfig } from 'payload'
import { admins, anyone } from '../access'

// Photo albums (a gallery = a titled set of images). Maps to /Gallery.
export const Galleries: CollectionConfig = {
  slug: 'galleries',
  admin: { useAsTitle: 'title', group: 'Content' },
  access: { read: anyone, create: admins, update: admins, delete: admins },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'date', type: 'date' },
    {
      name: 'images', type: 'array', minRows: 1,
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        { name: 'caption', type: 'text' },
      ],
    },
  ],
}
