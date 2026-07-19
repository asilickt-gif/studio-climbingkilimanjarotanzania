/**
 * i18n backfill (Phase 2 of the multi-language rollout):
 *  1. Repeatable docs (article/trip/route/blogPost/destinationDetail/
 *     standardPage): set language: "en" where missing.
 *  2. Singletons: copy `<type>` -> `<type>-en` with language: "en".
 *     The ORIGINAL unsuffixed docs are kept so the live site (which still
 *     queries the old IDs until Phase 3 ships) keeps working; they are
 *     deleted by scripts/cleanup-old-singletons.ts after Phase 3 verification.
 * Idempotent: re-running skips whatever already exists.
 *
 * Run from the studio folder:
 *   npx sanity exec scripts/backfill-language.ts --with-user-token
 */
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2026-07-01'})

const TRANSLATABLE_TYPES = [
  'article',
  'trip',
  'route',
  'blogPost',
  'destinationDetail',
  'standardPage',
]

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
  // 1. repeatables: language = en
  for (const type of TRANSLATABLE_TYPES) {
    const ids = await client.fetch<string[]>(
      '*[_type == $type && !defined(language) && !(_id in path("drafts.**"))]._id',
      {type},
    )
    if (ids.length === 0) {
      console.log(`${type}: all docs already have language`)
      continue
    }
    let tx = client.transaction()
    for (const id of ids) tx = tx.patch(id, (p) => p.set({language: 'en'}))
    await tx.commit()
    console.log(`${type}: set language=en on ${ids.length} doc(s)`)
  }

  // 2. singletons: <type> -> <type>-en copies
  for (const type of SINGLETON_TYPES) {
    const enId = `${type}-en`
    const existingEn = await client.fetch<string | null>('*[_id == $id][0]._id', {id: enId})
    if (existingEn) {
      console.log(`${type}: ${enId} already exists`)
      continue
    }
    const doc = await client.fetch<Record<string, unknown> | null>('*[_id == $id][0]', {id: type})
    if (!doc) {
      console.log(`${type}: WARN no source doc with _id "${type}"`)
      continue
    }
    const {_rev, _createdAt, _updatedAt, ...rest} = doc
    await client.createOrReplace({
      ...(rest as {_type: string}),
      _id: enId,
      language: 'en',
    })
    console.log(`${type}: created ${enId}`)
  }
  console.log('done')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
