import type { Page } from '@/payload-types'
import Image from 'next/image'
import { RichText } from '@payloadcms/richtext-lexical/react'

type ImageTextBlockType = Extract<NonNullable<Page['layout']>[number], { blockType: 'imageText' }>

export function ImageTextBlock({ block }: { block: ImageTextBlockType }) {
  const img = typeof block.image === 'object' ? block.image : null
  const reversed = block.imagePosition === 'right'

  return (
    <section className="mx-auto max-w-5xl px-6 py-10">
      <div className={`flex flex-col gap-8 md:flex-row ${reversed ? 'md:flex-row-reverse' : ''}`}>
        {img?.url && (
          <div className="relative h-64 w-full shrink-0 overflow-hidden rounded-xl md:h-auto md:w-1/2">
            <Image src={img.url} alt={img.alt ?? ''} fill className="object-cover" />
          </div>
        )}
        <div className="flex flex-col justify-center md:w-1/2">
          {block.heading && (
            <h2 className="mb-4 text-2xl font-bold text-gray-800">{block.heading}</h2>
          )}
          {block.body && <RichText data={block.body} />}
        </div>
      </div>
    </section>
  )
}
