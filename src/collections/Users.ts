import type { CollectionConfig } from 'payload'
import { admins } from '../access'

// Admin/staff accounts that manage the whole site (Payload's auth-enabled users).
export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: { useAsTitle: 'email', group: 'Admin' },
  access: {
    create: admins,
    read: admins,
    update: admins,
    delete: admins,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'role',
      type: 'select',
      defaultValue: 'editor',
      options: [
        { label: 'Administrator', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
    },
  ],
}
