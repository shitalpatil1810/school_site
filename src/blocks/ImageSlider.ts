import type { Block } from 'payload'

export const ImageSlider: Block = {
  slug: 'imageSlider',
  labels: { singular: 'Image Slideshow', plural: 'Image Slideshows' },
  fields: [
    {
      name: 'slides',
      type: 'array',
      required: true,
      minRows: 2,
      admin: { description: 'Add two or more images to create a slideshow.' },
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        { name: 'caption', type: 'text' },
      ],
    },
    {
      name: 'height',
      type: 'select',
      defaultValue: 'medium',
      admin: { description: 'Height of the slideshow.' },
      options: [
        { label: 'Small (300 px)', value: 'small' },
        { label: 'Medium (450 px)', value: 'medium' },
        { label: 'Large (600 px)', value: 'large' },
      ],
    },
  ],
}
