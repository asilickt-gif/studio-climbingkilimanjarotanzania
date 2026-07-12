/**
 * Seed `route` documents (6 Kilimanjaro routes) from the web app's
 * content/routes.ts. Idempotent: upserts by slug.
 *
 * Run from the studio folder:
 *   npx sanity exec scripts/seed-routes.ts --with-user-token
 */
import {getCliClient} from 'sanity/cli'

import {routes} from '../../climbingkilimanjarotanzania/content/routes'
import type {RouteDetailData} from '../../climbingkilimanjarotanzania/types/routes'
import {key, paragraphBlock} from './lib/pt'
import {uploadImage} from './lib/assets'

const client = getCliClient({apiVersion: '2026-07-01'})

async function routeToFields(data: RouteDetailData) {
  return {
    seo: {_type: 'seo', title: data.seo.title, description: data.seo.description},
    name: data.name,
    hero: {
      heading: data.hero.heading,
      tagline: data.hero.tagline,
      body: data.hero.body.map(paragraphBlock),
      image: await uploadImage(client, data.hero.image),
    },
    itinerary: {
      heading: data.itinerary.heading,
      subheading: data.itinerary.subheading,
      daysLabel: data.itinerary.daysLabel,
      stops: data.itinerary.stops.map((stop) => ({
        _type: 'routeStop',
        _key: key(),
        label: stop.label,
        ...(stop.meta?.length ? {meta: stop.meta} : {}),
        body: stop.body.map(paragraphBlock),
      })),
    },
    infoTabs: {
      heading: data.infoTabs.heading,
      tabs: data.infoTabs.tabs.map((tab) => ({
        _type: 'routeInfoTab',
        _key: key(),
        tabId: tab.id,
        label: tab.label,
        blocks: tab.blocks.map((block) => ({
          _type: 'routeInfoBlock',
          _key: key(),
          heading: block.heading,
          ...(block.paragraphs?.length ? {paragraphs: block.paragraphs.map(paragraphBlock)} : {}),
          ...(block.bullets?.length ? {bullets: block.bullets} : {}),
          ...(block.pricingTable
            ? {
                pricingTable: {
                  columns: block.pricingTable.columns,
                  rows: block.pricingTable.rows.map((row) => ({
                    _type: 'pricingRow',
                    _key: key(),
                    label: row.label,
                    values: row.values,
                  })),
                },
              }
            : {}),
        })),
      })),
    },
    secondaryBanner: {
      heading: data.secondaryBanner.heading,
      tagline: data.secondaryBanner.tagline,
    },
    faqHeading: data.faqHeading,
    faqs: data.faqs.map((faq) => ({
      _type: 'numberedFaq',
      _key: key(),
      number: faq.number,
      question: faq.question,
      answer: faq.answer,
    })),
  }
}

async function run() {
  for (const route of routes) {
    const fields = await routeToFields(route)
    const existingId = await client.fetch<string | null>(
      '*[_type == "route" && slug.current == $slug && !(_id in path("drafts.**"))][0]._id',
      {slug: route.slug},
    )
    if (existingId) {
      await client.patch(existingId).set(fields).commit()
      console.log(`updated ${route.slug} (${existingId})`)
    } else {
      const created = await client.create({
        _type: 'route',
        slug: {_type: 'slug', current: route.slug},
        ...fields,
      })
      console.log(`created ${route.slug} (${created._id})`)
    }
  }
  console.log('done')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
