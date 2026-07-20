/**
 * One-off: fix the stale "Machame Route 9 Day" home-page card, which linked
 * to the 7-day Machame package because no 9-day package existed. Now that
 * 9-days-lemosho-route exists (see seed-9-days-lemosho-route.ts), point the
 * card at it and relabel it correctly.
 *
 * Only patches the matching array item's title/href/tourId/price/location/
 * image.alt fields on the existing homePage-en document — every other field
 * on the document (hero, features, other cards, etc.) is left untouched, so
 * this is safe to run even if the homepage has been edited in Studio since
 * it was last seeded.
 *
 * Run from the studio folder:
 *   npx sanity exec scripts/patch-home-9-day-card.ts --with-user-token
 */
import {getCliClient} from 'sanity/cli'

const DOC_ID = 'homePage-en'
const OLD_TOUR_ID = 'KSB1'

const client = getCliClient({apiVersion: '2026-07-01'})

async function run() {
  const doc = await client.getDocument(DOC_ID)
  if (!doc) throw new Error(`${DOC_ID} not found`)

  const cards = (doc.kilimanjaroPackages as {cards?: {_key: string; tourId?: string}[]} | undefined)?.cards ?? []
  const index = cards.findIndex((card) => card.tourId === OLD_TOUR_ID)
  if (index === -1) {
    throw new Error(`No kilimanjaroPackages.cards entry with tourId "${OLD_TOUR_ID}" found on ${DOC_ID}`)
  }

  await client
    .patch(DOC_ID)
    .set({
      [`kilimanjaroPackages.cards[${index}].title`]: 'Lemosho Route 9 Day – Sleep in the Crater',
      [`kilimanjaroPackages.cards[${index}].href`]: '/kilimanjaro-packages/9-days-lemosho-route/',
      [`kilimanjaroPackages.cards[${index}].tourId`]: 'KSB2',
      [`kilimanjaroPackages.cards[${index}].price`]: '$3970 per person',
      [`kilimanjaroPackages.cards[${index}].location`]: 'Arusha › Lemosho › Kilimanjaro',
      [`kilimanjaroPackages.cards[${index}].image.alt`]: 'Lemosho Route 9 Day',
    })
    .commit()

  console.log(`patched ${DOC_ID} kilimanjaroPackages.cards[${index}] (was tourId ${OLD_TOUR_ID})`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
