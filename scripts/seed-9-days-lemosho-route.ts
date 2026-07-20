/**
 * One-off: create/update ONLY the new "9 Days Lemosho Route" trip document
 * from content/packages.ts. Unlike seed-trips.ts, this does not touch any
 * other trip document — safe to run without resetting Studio edits made to
 * the other 8 packages/combos/safaris.
 *
 * Idempotent: upserts by slug.
 *
 * Run from the studio folder:
 *   npx sanity exec scripts/seed-9-days-lemosho-route.ts --with-user-token
 */
import {getCliClient} from 'sanity/cli'

import {packages} from '../../climbingkilimanjarotanzania/content/packages'
import type {PackageDetailData, PackageItineraryStop} from '../../climbingkilimanjarotanzania/types/packages'
import {key, paragraphBlock} from './lib/pt'
import {uploadImage} from './lib/assets'

const SLUG = '9-days-lemosho-route'

const client = getCliClient({apiVersion: '2026-07-01'})

const seo = (data: PackageDetailData) => ({
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

async function packageToFields(data: PackageDetailData) {
  const itinerary = []
  for (const stop of data.itinerary) itinerary.push(await packageDayToDoc(stop))
  return {
    category: 'package',
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
      ...(data.overview.mapImageIsPhoto !== undefined ? {mapImageIsPhoto: data.overview.mapImageIsPhoto} : {}),
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

async function run() {
  const pkg = packages.find((p) => p.slug === SLUG)
  if (!pkg) throw new Error(`No package with slug "${SLUG}" found in content/packages.ts`)

  const fields = await packageToFields(pkg)
  const existingId = await client.fetch<string | null>(
    '*[_type == "trip" && slug.current == $slug && !(_id in path("drafts.**"))][0]._id',
    {slug: SLUG},
  )
  if (existingId) {
    await client.patch(existingId).set(fields).commit()
    console.log(`updated ${SLUG} (${existingId})`)
  } else {
    const created = await client.create({
      _type: 'trip',
      language: 'en',
      slug: {_type: 'slug', current: SLUG},
      ...fields,
    })
    console.log(`created ${SLUG} (${created._id})`)
  }
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
