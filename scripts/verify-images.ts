/**
 * Verify image seeding: walks every published document, collects every
 * image reference (any object carrying asset._ref), and checks each ref
 * resolves to a real uploaded image asset. Also flags empty image objects
 * (siteImage without an asset) and reports per-type coverage.
 *
 * Run from the studio folder:
 *   npx sanity exec scripts/verify-images.ts --with-user-token
 */
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2026-07-01'})

interface ImageRef {
  docId: string
  docType: string
  path: string
  ref: string | null
}

function walk(node: unknown, docId: string, docType: string, path: string, out: ImageRef[]) {
  if (Array.isArray(node)) {
    node.forEach((item, i) => walk(item, docId, docType, `${path}[${i}]`, out))
    return
  }
  if (node && typeof node === 'object') {
    const obj = node as Record<string, unknown>
    const asset = obj.asset as {_ref?: string} | undefined
    if (obj._type === 'siteImage' || obj._type === 'image' || asset?._ref?.startsWith('image-')) {
      out.push({docId, docType, path, ref: asset?._ref ?? null})
      return
    }
    for (const [key, value] of Object.entries(obj)) {
      if (key.startsWith('_')) continue
      walk(value, docId, docType, path ? `${path}.${key}` : key, out)
    }
  }
}

async function run() {
  const docs = await client.fetch<Record<string, unknown>[]>(
    '*[!(_id in path("drafts.**")) && !(_type match "sanity.**") && !(_type match "system.**")]',
  )
  const assetIds = new Set(
    await client.fetch<string[]>('*[_type == "sanity.imageAsset"]._id'),
  )

  const refs: ImageRef[] = []
  for (const doc of docs) {
    walk(doc, String(doc._id), String(doc._type), '', refs)
  }

  const missingAsset = refs.filter((r) => !r.ref)
  const brokenRef = refs.filter((r) => r.ref && !assetIds.has(r.ref))
  const uniqueRefs = new Set(refs.map((r) => r.ref).filter(Boolean))

  const byType = new Map<string, number>()
  for (const r of refs) byType.set(r.docType, (byType.get(r.docType) ?? 0) + 1)

  console.log(`documents scanned:        ${docs.length}`)
  console.log(`image references found:   ${refs.length}`)
  console.log(`unique assets referenced: ${uniqueRefs.size}`)
  console.log(`assets in dataset:        ${assetIds.size}`)
  console.log(`orphan assets (uploaded but unreferenced): ${assetIds.size - uniqueRefs.size}`)
  console.log('')
  console.log('image references per document type:')
  for (const [type, count] of [...byType.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${type.padEnd(26)} ${count}`)
  }
  console.log('')

  if (missingAsset.length) {
    console.log(`✗ EMPTY IMAGE OBJECTS (no asset uploaded): ${missingAsset.length}`)
    for (const r of missingAsset.slice(0, 20)) {
      console.log(`  ${r.docType} ${r.docId} at ${r.path}`)
    }
  }
  if (brokenRef.length) {
    console.log(`✗ BROKEN REFERENCES (asset does not exist): ${brokenRef.length}`)
    for (const r of brokenRef.slice(0, 20)) {
      console.log(`  ${r.docType} ${r.docId} at ${r.path} -> ${r.ref}`)
    }
  }
  if (!missingAsset.length && !brokenRef.length) {
    console.log('✓ ALL IMAGE REFERENCES RESOLVE TO UPLOADED ASSETS')
  }

  // spot-check that asset URLs are actually served by the CDN
  const sample = await client.fetch<{url: string}[]>(
    '*[_type == "sanity.imageAsset"][0...5]{url}',
  )
  for (const {url} of sample) {
    const res = await fetch(url, {method: 'HEAD'})
    console.log(`${res.ok ? '✓' : '✗'} ${res.status} ${url.slice(0, 90)}`)
  }
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
