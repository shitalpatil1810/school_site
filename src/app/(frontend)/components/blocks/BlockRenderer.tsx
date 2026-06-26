import type { Page } from '@/payload-types'
import { HeroBlock } from './HeroBlock'
import { RichTextBlockRenderer } from './RichTextBlockRenderer'
import { ImageTextBlock } from './ImageTextBlock'
import { TimelineBlock } from './TimelineBlock'

type LayoutBlock = NonNullable<Page['layout']>[number]

export function BlockRenderer({ layout }: { layout: NonNullable<Page['layout']> }) {
  return (
    <>
      {layout.map((block) => {
        switch (block.blockType) {
          case 'hero':
            return <HeroBlock key={block.id} block={block} />
          case 'richText':
            return <RichTextBlockRenderer key={block.id} block={block} />
          case 'imageText':
            return <ImageTextBlock key={block.id} block={block} />
          case 'timeline':
            return <TimelineBlock key={block.id} block={block} />
          default:
            return null
        }
      })}
    </>
  )
}
