import type { GlobalConfig } from 'payload'
import { admins, anyone } from '../access'

// Site-wide editable settings (name, logo, contact, hours, socials, banners).
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  admin: { group: 'Settings' },
  access: { read: anyone, update: admins },
  fields: [
    { name: 'schoolName', type: 'text', required: true, defaultValue: 'Greenfield Public School' },
    { name: 'logo', type: 'upload', relationTo: 'media' },
    { name: 'tagline', type: 'text' },
    {
      name: 'contact', type: 'group',
      fields: [
        { name: 'address', type: 'textarea' },
        { name: 'phone', type: 'text' },
        { name: 'email', type: 'email' },
        { name: 'mapEmbedUrl', type: 'text', admin: { description: 'Google Maps embed iframe src URL.' } },
      ],
    },
    {
      name: 'schoolHours', type: 'array',
      fields: [
        { name: 'label', type: 'text' },
        { name: 'time', type: 'text' },
      ],
    },
    {
      name: 'social', type: 'group',
      fields: [
        { name: 'facebook', type: 'text' },
        { name: 'instagram', type: 'text' },
        { name: 'youtube', type: 'text' },
        { name: 'whatsapp', type: 'text', admin: { description: 'Number for click-to-chat float button.' } },
      ],
    },
    {
      name: 'heroSlides', type: 'array', admin: { description: 'Homepage banner carousel.' },
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        { name: 'heading', type: 'text' },
        { name: 'subheading', type: 'text' },
      ],
    },
  ],
}
