import type { GlobalConfig } from 'payload'
import { admins, anyone } from '../access'

export const Header: GlobalConfig = {
  slug: 'header',
  admin: { group: 'Settings' },
  access: { read: anyone, update: admins },
  fields: [
    {
      name: 'navItems', type: 'array', maxRows: 8,
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
        {
          name: 'children', type: 'array', admin: { description: 'Dropdown sub-links.' },
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'url', type: 'text', required: true },
          ],
        },
      ],
    },
  ],
}
