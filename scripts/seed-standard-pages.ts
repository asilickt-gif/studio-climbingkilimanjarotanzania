/**
 * Seed the standardPage documents (3 legal pages + why-travel-with-us) from
 * the web app's typed content files. Idempotent: upserts by slug, and image
 * uploads dedupe server-side (Sanity content-addresses assets by hash).
 *
 * Run from the studio folder:
 *   npx sanity exec scripts/seed-standard-pages.ts --with-user-token
 */
import {createReadStream} from 'node:fs'
import path from 'node:path'
import {getCliClient} from 'sanity/cli'

import {cookiesPolicy, privacyPolicy, termsAndConditions} from '../../climbingkilimanjarotanzania/content/legal'
import {whyTravelWithUsData} from '../../climbingkilimanjarotanzania/content/why-travel-with-us'
import type {LegalPageData} from '../../climbingkilimanjarotanzania/types/legal'
import type {ImageAsset, StandardPageData} from '../../climbingkilimanjarotanzania/types/content'
import {bulletBlock, key, paragraphBlock, stringToPt} from './lib/pt'

const client = getCliClient({apiVersion: '2026-07-01'})
const WEB_ROOT = path.resolve(process.cwd(), '../climbingkilimanjarotanzania')

async function uploadImage(image: ImageAsset) {
  const filePath = path.join(WEB_ROOT, 'public', image.src)
  const asset = await client.assets.upload('image', createReadStream(filePath), {
    filename: path.basename(filePath),
  })
  console.log(`  uploaded image ${image.src} -> ${asset._id}`)
  return {
    _type: 'siteImage' as const,
    asset: {_type: 'reference' as const, _ref: asset._id},
    alt: image.alt,
  }
}

async function upsertStandardPage(slug: string, fields: Record<string, unknown>) {
  const existingId = await client.fetch<string | null>(
    '*[_type == "standardPage" && slug.current == $slug && !(_id in path("drafts.**"))][0]._id',
    {slug},
  )
  if (existingId) {
    await client.patch(existingId).set(fields).commit()
    console.log(`updated ${slug} (${existingId})`)
  } else {
    const created = await client.create({
      _type: 'standardPage',
      slug: {_type: 'slug', current: slug},
      ...fields,
    })
    console.log(`created ${slug} (${created._id})`)
  }
}

function legalToFields(data: LegalPageData) {
  return {
    seo: {_type: 'seo', title: data.seo.title, description: data.seo.description},
    hero: {heading: data.pageTitle},
    intro: data.intro,
    sections: data.sections.map((section) => ({
      _type: 'pageSection',
      _key: key(),
      heading: section.heading,
      body: section.blocks.flatMap((block) =>
        block.type === 'paragraph' ? [paragraphBlock(block.text)] : block.items.map(bulletBlock),
      ),
    })),
  }
}

async function standardToFields(data: StandardPageData) {
  const backgroundImage = data.hero.backgroundImage
    ? await uploadImage(data.hero.backgroundImage)
    : undefined
  return {
    seo: {_type: 'seo', title: data.seo.title, description: data.seo.description},
    hero: {
      heading: data.hero.heading,
      ...(data.hero.subheading ? {subheading: data.hero.subheading} : {}),
      ...(backgroundImage ? {backgroundImage} : {}),
    },
    sections: await Promise.all(
      data.sections.map(async (section) => ({
        _type: 'pageSection',
        _key: key(),
        ...(section.heading ? {heading: section.heading} : {}),
        body: stringToPt(section.body),
        ...(section.image ? {image: await uploadImage(section.image)} : {}),
      })),
    ),
  }
}

async function run() {
  const legalPages: [string, LegalPageData][] = [
    ['privacy-policy', privacyPolicy],
    ['terms-and-conditions', termsAndConditions],
    ['cookies-policy', cookiesPolicy],
  ]
  for (const [slug, data] of legalPages) {
    await upsertStandardPage(slug, legalToFields(data))
  }
  await upsertStandardPage(whyTravelWithUsData.slug, await standardToFields(whyTravelWithUsData))
  console.log('done')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
