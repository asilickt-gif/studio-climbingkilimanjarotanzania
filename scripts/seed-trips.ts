/**
 * Seed unified `trip` documents from the web app's three itinerary groups:
 *  - content/packages.ts (9 Kilimanjaro packages)  -> category "package"
 *  - content/combo.ts    (4 Kilimanjaro+safari combos) -> category "combo"
 *  - content/safari.ts   (2 safaris)               -> category "safari"
 * Idempotent: upserts by (category, slug); image uploads dedupe per run and
 * server-side by content hash. First run uploads ~150 itinerary photos.
 *
 * Run from the studio folder:
 *   npx sanity exec scripts/seed-trips.ts --with-user-token
 */
import {getCliClient} from 'sanity/cli'

import {packages} from '../../climbingkilimanjarotanzania/content/packages'
import {combos} from '../../climbingkilimanjarotanzania/content/combo'
import {safaris} from '../../climbingkilimanjarotanzania/content/safari'
import type {PackageDetailData, PackageItineraryStop} from '../../climbingkilimanjarotanzania/types/packages'
import type {SafariDetailData, SafariStop} from '../../climbingkilimanjarotanzania/types/safari'
import {key, paragraphBlock, segmentParagraphsToPt} from './lib/pt'
import {uploadImage} from './lib/assets'

const client = getCliClient({apiVersion: '2026-07-01'})

const seo = (data: {seo: {title: string; description: string}}) => ({
  _type: 'seo',
  title: data.seo.title,
  description: data.seo.description,
})

const faqs = (items: {question: string; answer: string}[]) =>
  items.map((faq) => ({_type: 'faqItem', _key: key(), question: faq.question, answer: faq.answer}))

async function packageDayToDoc(stop: PackageItineraryStop) {
  return {
    _type: 'itineraryDay',
    _key: key(),
    day: stop.day,
    label: stop.label,
    ...(stop.location ? {location: stop.location} : {}),
    ...(stop.meta?.length ? {meta: stop.meta} : {}),
    body: stop.body.map(paragraphBlock),
    ...(stop.overnightStay ? {overnightStay: stop.overnightStay} : {}),
    ...(stop.image ? {image: await uploadImage(client, stop.image)} : {}),
    ...(stop.secondImage ? {secondImage: await uploadImage(client, stop.secondImage)} : {}),
    ...(stop.lodgeOptions?.length
      ? {
          lodgeOptions: await Promise.all(
            stop.lodgeOptions.map(async (lodge) => ({
              _type: 'lodgeOption',
              _key: key(),
              name: lodge.name,
              image: await uploadImage(client, lodge.image),
            })),
          ),
        }
      : {}),
  }
}

async function safariDayToDoc(stop: SafariStop) {
  return {
    _type: 'itineraryDay',
    _key: key(),
    day: stop.day,
    label: stop.label,
    body: segmentParagraphsToPt(stop.body),
    ...(stop.overnightStay ? {overnightStay: stop.overnightStay} : {}),
    ...(stop.image ? {image: await uploadImage(client, stop.image)} : {}),
    ...(stop.accommodationTiers?.length ? {accommodationTiers: stop.accommodationTiers} : {}),
  }
}

async function packageToFields(data: PackageDetailData, category: 'package' | 'combo') {
  const itinerary = []
  for (const stop of data.itinerary) itinerary.push(await packageDayToDoc(stop))
  return {
    category,
    seo: seo(data),
    name: data.name,
    durationDays: data.durationDays,
    hero: {
      stopsLine: data.hero.stopsLine,
      priceDisclaimer: data.hero.priceDisclaimer,
    },
    overview: {
      body: data.overview.body.map(paragraphBlock),
      mapImage: await uploadImage(client, data.overview.mapImage),
      ...(data.overview.mapImageIsPhoto !== undefined
        ? {mapImageIsPhoto: data.overview.mapImageIsPhoto}
        : {}),
      gallery: await Promise.all(data.overview.gallery.map((img) => uploadImage(client, img))),
    },
    itinerary,
    includes: data.includes,
    excludes: data.excludes,
    faqHeading: data.faqHeading,
    ...(data.faqIntro ? {faqIntro: data.faqIntro} : {}),
    faqs: faqs(data.faqs),
    hubSummary: data.hubSummary,
    hubImage: await uploadImage(client, data.hubImage),
  }
}

async function safariToFields(data: SafariDetailData) {
  const itinerary = []
  for (const stop of data.itinerary) itinerary.push(await safariDayToDoc(stop))
  return {
    category: 'safari',
    seo: seo(data),
    name: data.name,
    durationDays: data.durationDays,
    hero: {stopsLine: data.hero.stopsLine},
    overview: {
      body: data.overview.body.map(paragraphBlock),
      ...(data.overview.mapImage ? {mapImage: await uploadImage(client, data.overview.mapImage)} : {}),
      gallery: await Promise.all(data.overview.gallery.map((img) => uploadImage(client, img))),
    },
    itinerary,
    includes: data.includes,
    excludes: data.excludes,
    faqHeading: data.faqHeading,
    ...(data.faqIntro ? {faqIntro: data.faqIntro} : {}),
    faqs: faqs(data.faqs),
  }
}

async function upsertTrip(slug: string, fields: Record<string, unknown>) {
  const existingId = await client.fetch<string | null>(
    '*[_type == "trip" && slug.current == $slug && !(_id in path("drafts.**"))][0]._id',
    {slug},
  )
  if (existingId) {
    await client.patch(existingId).set(fields).commit()
    console.log(`updated ${slug} (${existingId})`)
  } else {
    const created = await client.create({
      _type: 'trip',
      slug: {_type: 'slug', current: slug},
      ...fields,
    })
    console.log(`created ${slug} (${created._id})`)
  }
}

async function run() {
  for (const pkg of packages) {
    await upsertTrip(pkg.slug, await packageToFields(pkg, 'package'))
  }
  for (const combo of combos) {
    await upsertTrip(combo.slug, await packageToFields(combo, 'combo'))
  }
  for (const safari of safaris) {
    await upsertTrip(safari.slug, await safariToFields(safari))
  }
  console.log('done')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
