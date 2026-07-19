/**
 * Phase 3 cleanup: delete the original unsuffixed singleton documents
 * (e.g. "homePage") now that the web app exclusively queries the
 * per-locale ids ("homePage-en", ...) created by backfill-language.ts.
 *
 * Safety: refuses to delete `<type>` unless `<type>-en` already exists,
 * so this can't run ahead of (or instead of) the backfill.
 *
 * Run from the studio folder, AFTER verifying the live site against the
 * -en docs (Phase 3 render-diff):
 *   npx sanity exec scripts/cleanup-old-singletons.ts --with-user-token
 */
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2026-07-01'})

const SINGLETON_TYPES = [
  'siteSettings',
  'blogIndexPage',
  'destinationsPage',
  'aboutPage',
  'contactPage',
  'requestQuotePage',
  'zanzibarPage',
  'tanzaniaSafariPage',
  'safariToursPage',
  'climbingKilimanjaroPage',
  'homePage',
  'sharedTripContent',
  'routesHubPage',
  'packagesHubPage',
  'comboHubPage',
]

async function run() {
  let deleted = 0
  for (const type of SINGLETON_TYPES) {
    const enId = `${type}-en`
    const [oldDoc, enDoc] = await Promise.all([
      client.fetch<string | null>('*[_id == $id][0]._id', {id: type}),
      client.fetch<string | null>('*[_id == $id][0]._id', {id: enId}),
    ])
    if (!oldDoc) {
      console.log(`${type}: no old doc to delete`)
      continue
    }
    if (!enDoc) {
      console.log(`${type}: SKIPPED — ${enId} does not exist, refusing to delete ${type}`)
      continue
    }
    await client.delete(type)
    deleted++
    console.log(`${type}: deleted (${enId} confirmed present)`)
  }
  console.log(`done — ${deleted} old singleton doc(s) deleted`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
