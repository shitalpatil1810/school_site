import type { Page } from '@/payload-types'

type TimelineBlockType = Extract<NonNullable<Page['layout']>[number], { blockType: 'timeline' }>

export function TimelineBlock({ block }: { block: TimelineBlockType }) {
  return (
    <section className="mx-auto max-w-3xl px-6 py-10">
      {block.heading && (
        <h2 className="mb-8 text-2xl font-bold text-gray-800">{block.heading}</h2>
      )}
      <ol className="relative border-l-2 border-gray-200">
        {block.milestones?.map((m) => (
          <li key={m.id} className="mb-8 ml-6">
            <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-gray-600 text-xs font-bold text-white ring-4 ring-white">
              ●
            </span>
            <span className="mb-1 block text-sm font-semibold text-gray-600">{m.year}</span>
            <h3 className="font-semibold text-gray-900">{m.title}</h3>
            {m.description && <p className="mt-1 text-gray-600">{m.description}</p>}
          </li>
        ))}
      </ol>
    </section>
  )
}
