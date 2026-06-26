import type { Page } from '@/payload-types'
import { RichText } from '@payloadcms/richtext-lexical/react'

type RichTextBlockType = Extract<NonNullable<Page['layout']>[number], { blockType: 'richText' }>

export function RichTextBlockRenderer({ block }: { block: RichTextBlockType }) {
  return (
    <section className="mx-auto max-w-3xl px-6 py-10">
      <RichText data={block.content} />
    </section>
  )
}
