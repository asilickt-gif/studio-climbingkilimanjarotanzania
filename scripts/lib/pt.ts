import {randomUUID} from 'node:crypto'

// Builders that convert the web app's legacy content shapes into Portable
// Text blocks matching the studio's `richText` type (normal + bullet,
// strong + link marks). The web app's adapters round-trip these exactly.

export const key = () => randomUUID().replace(/-/g, '').slice(0, 12)

export interface RichTextSegment {
  text: string
  bold?: boolean
  href?: string
}

export function paragraphBlock(text: string) {
  return {
    _type: 'block' as const,
    _key: key(),
    style: 'normal' as const,
    markDefs: [] as {_key: string; _type: string; href?: string}[],
    children: [{_type: 'span' as const, _key: key(), text, marks: [] as string[]}],
  }
}

export function bulletBlock(text: string) {
  return {...paragraphBlock(text), listItem: 'bullet' as const, level: 1}
}

/** Multi-paragraph plain string (\n\n separated; single \n stays a soft break). */
export function stringToPt(text: string) {
  return text
    .split(/\n{2,}/)
    .filter((p) => p.length > 0)
    .map((p) => paragraphBlock(p))
}

/** One paragraph of RichTextSegments -> one PT block with strong/link marks. */
export function segmentsToBlock(segments: RichTextSegment[]) {
  const block = paragraphBlock('')
  block.children = []
  for (const segment of segments) {
    const marks: string[] = []
    if (segment.bold) marks.push('strong')
    if (segment.href) {
      const defKey = key()
      block.markDefs.push({_key: defKey, _type: 'link', href: segment.href})
      marks.push(defKey)
    }
    block.children.push({_type: 'span', _key: key(), text: segment.text, marks})
  }
  return block
}

/** RichTextSegment[][] (paragraphs of segments) -> PT blocks. */
export function segmentParagraphsToPt(paragraphs: RichTextSegment[][]) {
  return paragraphs.map(segmentsToBlock)
}
