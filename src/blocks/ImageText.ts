import type { Block } from 'payload'

export const ImageText: Block = {
  slug: 'imageText',
  labels: { singular: 'Image + Text', plural: 'Image + Text' },
  fields: [
    { name: 'image', type: 'upload', relationTo: 'media', required: true },
    { name: 'heading', type: 'text' },
    { name: 'body', type: 'richText' },
    { name: 'imagePosition', type: 'select', defaultValue: 'left', options: ['left', 'right'] },
  ],
}
