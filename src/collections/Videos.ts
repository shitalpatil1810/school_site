import type { CollectionConfig } from 'payload'
import { admins, anyone } from '../access'

// Video gallery (YouTube/Vimeo embeds). Maps to /Video.
export const Videos: CollectionConfig = {
  slug: 'videos',
  admin: { useAsTitle: 'title', group: 'Content' },
  access: { read: anyone, create: admins, update: admins, delete: admins },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'youtubeUrl', type: 'text', required: true, admin: { description: 'Full YouTube/Vimeo URL.' } },
    { name: 'description', type: 'textarea' },
  ],
}
