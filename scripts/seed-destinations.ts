/**
 * Seed the destinationsPage singleton (10-entry hub) and the
 * destinationDetail documents (currently Serengeti) from the web app's
 * content files. Idempotent.
 *
 * Run from the studio folder:
 *   npx sanity exec scripts/seed-destinations.ts --with-user-token
 */
import {getCliClient} from 'sanity/cli'

import {destinationsData} from '../../climbingkilimanjarotanzania/content/destinations'
import {serengetiDetail} from '../../climbingkilimanjarotanzania/content/destination-detail'
import type {DestinationDetailData} from '../../climbingkilimanjarotanzania/types/destination-detail'
import {key, paragraphBlock} from './lib/pt'
import {uploadImage} from './lib/assets'

const client = getCliClient({apiVersion: '2026-07-01'})

async function detailToFields(data: DestinationDetailData) {
  return {
    seo: {_type: 'seo', title: data.seo.title, description: data.seo.description},
    name: data.name,
    hero: {
      eyebrow: data.hero.eyebrow,
      heading: data.hero.heading,
      locationPill: data.hero.locationPill,
      backgroundImage: await uploadImage(client, data.hero.backgroundImage),
    },
    overview: {
      heading: data.overview.heading,
      body: data.overview.body.map(paragraphBlock),
    },
    activitiesHeading: data.activitiesHeading,
    activities: data.activities.map((activity) => ({
      _type: 'activity',
      _key: key(),
      title: activity.title,
      body: activity.body,
    })),
    bestTimeToVisit: {
      heading: data.bestTimeToVisit.heading,
      body: data.bestTimeToVisit.body.map(paragraphBlock),
    },
    gallery: await Promise.all(data.gallery.map((img) => uploadImage(client, img))),
    otherDestinationsHeading: data.otherDestinationsHeading,
    otherDestinations: await Promise.all(
      data.otherDestinations.map(async (dest) => ({
        _type: 'crossPromo',
        _key: key(),
        name: dest.name,
        href: dest.href,
        image: await uploadImage(client, dest.image),
      })),
    ),
  }
}

async function run() {
  await client.createOrReplace({
    _id: 'destinationsPage-en',
    _type: 'destinationsPage',
    language: 'en',
    seo: {_type: 'seo', title: destinationsData.seo.title, description: destinationsData.seo.description},
    heading: destinationsData.heading,
    destinations: await Promise.all(
      destinationsData.destinations.map(async (dest) => ({
        _type: 'destinationEntry',
        _key: key(),
        name: dest.name,
        ...(dest.href ? {href: dest.href} : {}),
        image: await uploadImage(client, dest.image),
        body: dest.body,
        highlightsHeading: dest.highlightsHeading,
        highlights: dest.highlights,
        bestTime: dest.bestTime,
        ...(dest.bonusHeading ? {bonusHeading: dest.bonusHeading} : {}),
        ...(dest.bonus?.length ? {bonus: dest.bonus} : {}),
      })),
    ),
  })
  console.log('destinationsPage created/replaced')

  const fields = await detailToFields(serengetiDetail)
  const existingId = await client.fetch<string | null>(
    '*[_type == "destinationDetail" && slug.current == $slug && !(_id in path("drafts.**"))][0]._id',
    {slug: serengetiDetail.slug},
  )
  if (existingId) {
    await client.patch(existingId).set(fields).commit()
    console.log(`updated ${serengetiDetail.slug} (${existingId})`)
  } else {
    const created = await client.create({
      _type: 'destinationDetail',
      slug: {_type: 'slug', current: serengetiDetail.slug},
      ...fields,
    })
    console.log(`created ${serengetiDetail.slug} (${created._id})`)
  }
  console.log('done')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
