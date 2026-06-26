import type { Page } from '@/payload-types'
import Image from 'next/image'

type HeroBlockType = Extract<NonNullable<Page['layout']>[number], { blockType: 'hero' }>

export function HeroBlock({ block }: { block: HeroBlockType }) {
  const bg = typeof block.backgroundImage === 'object' ? block.backgroundImage : null

  return (
    <section
      className="relative flex min-h-[320px] items-center justify-center overflow-hidden bg-gray-700 text-white"
    >
      {bg?.url && (
        <Image
          src={bg.url}
          alt={bg.alt ?? ''}
          fill
          className="object-cover opacity-40"
          priority
        />
      )}
      <div className="relative z-10 mx-auto max-w-3xl px-6 py-16 text-center">
        <h1 className="text-4xl font-bold leading-tight">{block.heading}</h1>
        {block.subheading && (
          <p className="mt-4 text-lg opacity-90">{block.subheading}</p>
        )}
        {block.ctaLabel && block.ctaUrl && (
          <a
            href={block.ctaUrl}
            className="mt-8 inline-block rounded-lg bg-white px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50"
          >
            {block.ctaLabel}
          </a>
        )}
      </div>
    </section>
  )
}
