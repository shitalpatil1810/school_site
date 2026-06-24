import type { GlobalConfig } from 'payload'
import { admins, anyone } from '../access'

export const Footer: GlobalConfig = {
  slug: 'footer',
  admin: { group: 'Settings' },
  access: { read: anyone, update: admins },
  fields: [
    { name: 'about', type: 'textarea' },
    {
      name: 'quickLinks', type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
      ],
    },
    { name: 'copyright', type: 'text' },
  ],
}
