/**
 * One-off: add the new "9 Days Lemosho Route" card to the packagesHubPage-en
 * singleton's `cards` array (the /kilimanjaro-packages/ hub grid), without
 * touching the hero or any other existing card — unlike re-running
 * seed-shared-and-hubs.ts, which does a full createOrReplace and would wipe
 * any Studio edits to the whole document.
 *
 * Safe to run more than once: skips if a card with this packageSlug already
 * exists.
 *
 * Run from the studio folder:
 *   npx sanity exec scripts/patch-packages-hub-add-9-day-card.ts --with-user-token
 */
import {getCliClient} from 'sanity/cli'

import {packageHubCards} from '../../climbingkilimanjarotanzania/content/packages'
import {key} from './lib/pt'
import {uploadImage} from './lib/assets'

const DOC_ID = 'packagesHubPage-en'
const SLUG = '9-days-lemosho-route'

const client = getCliClient({apiVersion: '2026-07-01'})

async function run() {
  const card = packageHubCards.find((c) => c.slug === SLUG)
  if (!card) throw new Error(`No packageHubCards entry with slug "${SLUG}" found in content/packages.ts`)

  const doc = await client.getDocument(DOC_ID)
  if (!doc) throw new Error(`${DOC_ID} not found`)

  const cards = (doc.cards as {packageSlug?: string}[] | undefined) ?? []
  if (cards.some((c) => c.packageSlug === SLUG)) {
    console.log(`${DOC_ID} already has a card for "${SLUG}", nothing to do`)
    return
  }

  const newCard = {
    _type: 'packageHubCard',
    _key: key(),
    title: card.title,
    packageSlug: card.slug,
    nights: card.nights,
    summary: card.summary,
    image: await uploadImage(client, card.image),
  }

  await client.patch(DOC_ID).insert('before', 'cards[0]', [newCard]).commit()
  console.log(`inserted "${SLUG}" card at the front of ${DOC_ID}.cards`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
