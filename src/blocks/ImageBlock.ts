import type { Block } from 'payload'

export const ImageBlock: Block = {
  slug: 'imageBlock',
  labels: { singular: 'Image', plural: 'Images' },
  fields: [
    { name: 'image', type: 'upload', relationTo: 'media', required: true },
    { name: 'caption', type: 'text' },
    {
      name: 'position',
      type: 'select',
      defaultValue: 'full',
      admin: { description: 'Where to place the image relative to surrounding text.' },
      options: [
        { label: 'Full width', value: 'full' },
        { label: 'Left — text wraps right', value: 'left' },
        { label: 'Right — text wraps left', value: 'right' },
        { label: 'Centered', value: 'center' },
      ],
    },
    {
      name: 'size',
      type: 'select',
      defaultValue: 'medium',
      admin: { description: 'Image width (ignored when position is Full width).' },
      options: [
        { label: 'Small (33%)', value: 'small' },
        { label: 'Medium (50%)', value: 'medium' },
        { label: 'Large (66%)', value: 'large' },
      ],
    },
  ],
}
