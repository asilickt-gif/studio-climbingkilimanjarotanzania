/**
 * One-off: fix the stale "Rongai Route 6 Days" home-page card, which linked
 * to the 7-day Rongai package because no 6-day package existed. Now that
 * 6-days-rongai-route exists (see seed-6-days-rongai-route.ts), point the
 * card at it.
 *
 * Only patches the matching array item's href field — everything else
 * (title, image, price, etc.) is left untouched.
 *
 * Run from the studio folder:
 *   npx sanity exec scripts/patch-home-rongai-card.ts --with-user-token
 */
import {getCliClient} from 'sanity/cli'

const DOC_ID = 'homePage-en'
const TOUR_ID = 'KPSIR63'

const client = getCliClient({apiVersion: '2026-07-01'})

async function run() {
  const doc = await client.getDocument(DOC_ID)
  if (!doc) throw new Error(`${DOC_ID} not found`)

  const cards = (doc.kilimanjaroPackages as {cards?: {_key: string; tourId?: string}[]} | undefined)?.cards ?? []
  const index = cards.findIndex((card) => card.tourId === TOUR_ID)
  if (index === -1) {
    throw new Error(`No kilimanjaroPackages.cards entry with tourId "${TOUR_ID}" found on ${DOC_ID}`)
  }

  await client
    .patch(DOC_ID)
    .set({
      [`kilimanjaroPackages.cards[${index}].href`]: '/kilimanjaro-packages/6-days-rongai-route/',
    })
    .commit()

  console.log(`patched ${DOC_ID} kilimanjaroPackages.cards[${index}].href (tourId ${TOUR_ID})`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
