/**
 * Seed the siteSettings singleton (id: "siteSettings") from the web app's
 * content/site.ts. Idempotent via createOrReplace (explicit singleton id).
 *
 * Run from the studio folder:
 *   npx sanity exec scripts/seed-site-settings.ts --with-user-token
 */
import {getCliClient} from 'sanity/cli'

import {siteFooter, siteInfo, siteNav} from '../../climbingkilimanjarotanzania/content/site'
import {key} from './lib/pt'

const client = getCliClient({apiVersion: '2026-07-01'})

const navLink = (link: {label: string; href: string}) => ({
  _type: 'navLink' as const,
  _key: key(),
  label: link.label,
  href: link.href,
})

async function run() {
  await client.createOrReplace({
    _id: 'siteSettings-en',
    _type: 'siteSettings',
    language: 'en',
    info: {
      name: siteInfo.name,
      tagline: siteInfo.tagline,
      phone: siteInfo.phone,
      email: siteInfo.email,
    },
    nav: {
      groups: siteNav.groups.map((group) => ({
        _type: 'navGroup',
        _key: key(),
        label: group.label,
        ...(group.href ? {href: group.href} : {}),
        links: group.links.map(navLink),
      })),
      links: siteNav.links.map(navLink),
    },
    footer: {
      newsletterHeading: siteFooter.newsletterHeading,
      newsletterSubheading: siteFooter.newsletterSubheading,
      columns: siteFooter.columns.map((column) => ({
        _type: 'footerColumn',
        _key: key(),
        heading: column.heading,
        links: column.links.map(navLink),
      })),
      contact: {
        phone: siteFooter.contact.phone,
        email: siteFooter.contact.email,
        address: siteFooter.contact.address,
      },
      copyright: siteFooter.copyright,
      legalLinks: siteFooter.legalLinks.map(navLink),
    },
  })
  console.log('siteSettings created/replaced')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
