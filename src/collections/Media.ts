import type { CollectionConfig } from 'payload'
import { admins, anyone } from '../access'

// All uploaded images/files. Swap staticDir for an S3/R2/UploadThing adapter in prod.
export const Media: CollectionConfig = {
  slug: 'media',
  admin: { group: 'Content' },
  access: { read: anyone, create: admins, update: admins, delete: admins },
  upload: {
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre' },
      { name: 'card', width: 768, height: 512, position: 'centre' },
      { name: 'hero', width: 1920, height: 1080, position: 'centre' },
    ],
    mimeTypes: ['image/*'],
  },
  fields: [{ name: 'alt', type: 'text', required: true }],
}
