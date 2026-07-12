import {createReadStream} from 'node:fs'
import path from 'node:path'
import type {SanityClient} from 'sanity'

export const WEB_ROOT = path.resolve(process.cwd(), '../climbingkilimanjarotanzania')

// Cache per run so the same file path is only uploaded once per script
// execution (Sanity also dedupes server-side by content hash).
const uploaded = new Map<string, string>()

export interface LegacyImage {
  src: string
  alt: string
}

/** Upload a public/ image and return a siteImage value referencing it. */
export async function uploadImage(client: SanityClient, image: LegacyImage) {
  let assetId = uploaded.get(image.src)
  if (!assetId) {
    const filePath = path.join(WEB_ROOT, 'public', image.src)
    const asset = await client.assets.upload('image', createReadStream(filePath), {
      filename: path.basename(filePath),
    })
    assetId = asset._id
    uploaded.set(image.src, assetId)
    console.log(`  uploaded ${image.src} -> ${assetId}`)
  }
  return {
    _type: 'siteImage' as const,
    asset: {_type: 'reference' as const, _ref: assetId},
    alt: image.alt,
  }
}
