import type { CollectionConfig } from 'payload'
import { admins, anyone } from '../access'

// Faculty / staff / leadership profiles. Maps to /Committee (team grid) + hierarchy.
export const Faculty: CollectionConfig = {
  slug: 'faculty',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'designation', 'category', 'order'],
    group: 'Content',
    components: {
      beforeList: ['@/components/FacultyImportButton#FacultyImportButton'],
    },
  },
  access: { read: anyone, create: admins, update: admins, delete: admins },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'designation', type: 'text', required: true },
    {
      name: 'category', type: 'select', defaultValue: 'faculty',
      options: [
        { label: 'Leadership', value: 'leadership' },
        { label: 'Faculty', value: 'faculty' },
        { label: 'Administration', value: 'admin-staff' },
      ],
    },
    { name: 'department', type: 'text' },
    { name: 'photo', type: 'upload', relationTo: 'media' },
    { name: 'bio', type: 'textarea' },
    {
      name: 'social', type: 'group',
      fields: [
        { name: 'email', type: 'email' },
        { name: 'linkedin', type: 'text' },
      ],
    },
    { name: 'order', type: 'number', defaultValue: 0, admin: { description: 'Lower numbers show first.' } },
  ],
}
