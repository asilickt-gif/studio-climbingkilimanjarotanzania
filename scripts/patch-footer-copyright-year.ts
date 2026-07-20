/**
 * One-off: bump the footer copyright year 2025 -> 2026 across all four
 * siteSettings-<locale> documents. Only patches footer.copyright — every
 * other field (nav, footer columns, contact, social links) is untouched.
 *
 * Run from the studio folder:
 *   npx sanity exec scripts/patch-footer-copyright-year.ts --with-user-token
 */
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2026-07-01'})

async function run() {
  const docs = await client.fetch<{_id: string; copyright: string | null}[]>(
    '*[_type == "siteSettings"]{_id, "copyright": footer.copyright}',
  )

  for (const doc of docs) {
    if (!doc.copyright) {
      console.log(`SKIP ${doc._id}: no footer.copyright field`)
      continue
    }
    if (!doc.copyright.includes('2025')) {
      console.log(`SKIP ${doc._id}: no "2025" found in "${doc.copyright}"`)
      continue
    }
    const updated = doc.copyright.replace('2025', '2026')
    await client.patch(doc._id).set({'footer.copyright': updated}).commit()
    console.log(`${doc._id}: "${doc.copyright}" -> "${updated}"`)
  }
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
