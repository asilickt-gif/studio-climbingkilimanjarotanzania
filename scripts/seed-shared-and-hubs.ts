/**
 * Seed the sharedTripContent singleton and the three hub-page singletons
 * (routesHubPage, packagesHubPage, comboHubPage). Idempotent.
 *
 * Run from the studio folder:
 *   npx sanity exec scripts/seed-shared-and-hubs.ts --with-user-token
 */
import {getCliClient} from 'sanity/cli'

import {
  hubCtaBandImage,
  routeCtaBand,
  routeGuestReviews,
  routeGuidePromos,
  routeHubData,
  routePackagesCta,
  routeRelatedGuides,
  routeReviewStats,
  routeTestimonials,
  routeTrustBadges,
} from '../../climbingkilimanjarotanzania/content/routes'
import {
  packageExpertCta,
  packageHeroImage,
  packageHubCards,
  packageHubHero,
  packageInterestedCta,
  packageStandardIntro,
  packageTrustBadges,
} from '../../climbingkilimanjarotanzania/content/packages'
import {
  comboHeroImage,
  comboHubCards,
  comboHubCta,
  comboHubIntro,
  comboPriceDisclaimer,
  comboStandardIntro,
  comboTrustBadges,
} from '../../climbingkilimanjarotanzania/content/combo'
import {safariInterestedCta, safariTrustBadges} from '../../climbingkilimanjarotanzania/content/safari'
import {key, paragraphBlock, segmentsToBlock} from './lib/pt'
import {uploadImage} from './lib/assets'

const client = getCliClient({apiVersion: '2026-07-01'})

const badges = (typeName: string, items: {title: string; description: string}[]) =>
  items.map((b) => ({_type: typeName, _key: key(), title: b.title, description: b.description}))

async function seedShared() {
  await client.createOrReplace({
    _id: 'sharedTripContent-en',
    _type: 'sharedTripContent',
    language: 'en',
    routeTrustBadges: routeTrustBadges.map((b) => ({
      _type: 'routeTrustBadge',
      _key: key(),
      title: b.title,
      subtitle: b.subtitle,
      description: b.description,
    })),
    routeCtaBand: {
      heading: routeCtaBand.heading,
      body: routeCtaBand.body,
      buttons: routeCtaBand.buttons.map((b) => ({
        _type: 'ctaButton',
        _key: key(),
        label: b.label,
        href: b.href,
        variant: b.variant,
      })),
      image: await uploadImage(client, routeCtaBand.image),
    },
    hubCtaBandImage: await uploadImage(client, hubCtaBandImage),
    routeGuidePromos: routeGuidePromos.map((p) => ({
      _type: 'guidePromo',
      _key: key(),
      color: p.color,
      heading: p.heading,
      body: p.body,
      ctaLabel: p.ctaLabel,
      href: p.href,
    })),
    routeRelatedGuides: routeRelatedGuides.map((g) => ({
      _type: 'navLink',
      _key: key(),
      label: g.label,
      href: g.href,
    })),
    routeReviewStats: {
      tripAdvisor: {...routeReviewStats.tripAdvisor},
      google: {...routeReviewStats.google},
    },
    routeTestimonials: routeTestimonials.map((t) => ({
      _type: 'routeTestimonial',
      _key: key(),
      name: t.name,
      timeAgo: t.timeAgo,
      heading: t.heading,
      quote: [segmentsToBlock(t.quote)],
    })),
    routeGuestReviews: {
      heading: routeGuestReviews.heading,
      items: routeGuestReviews.items.map((r) => ({
        _type: 'guestReview',
        _key: key(),
        name: r.name,
        summitDate: r.summitDate,
        heading: r.heading,
        quote: r.quote,
      })),
    },
    routePackagesCta: {...routePackagesCta},
    packageTrustBadges: badges('packageBadge', packageTrustBadges),
    packageStandardIntro,
    packageInterestedCta: {...packageInterestedCta},
    packageExpertCta: {...packageExpertCta},
    packageHeroImage: await uploadImage(client, packageHeroImage),
    comboTrustBadges: badges('comboBadge', comboTrustBadges),
    comboPriceDisclaimer,
    comboStandardIntro,
    comboHeroImage: await uploadImage(client, comboHeroImage),
    safariTrustBadges: badges('safariBadge', safariTrustBadges),
    safariInterestedCta: {...safariInterestedCta},
  })
  console.log('sharedTripContent created/replaced')
}

async function seedHubs() {
  await client.createOrReplace({
    _id: 'routesHubPage-en',
    _type: 'routesHubPage',
    language: 'en',
    seo: {_type: 'seo', ...routeHubData.seo},
    hero: {...routeHubData.hero},
    ctaBandButtons: routeHubData.ctaBand.buttons.map((b) => ({
      _type: 'ctaButton',
      _key: key(),
      label: b.label,
      href: b.href,
      variant: b.variant,
    })),
    promoSection: {...routeHubData.promoSection},
    tabsHeading: routeHubData.tabsHeading,
    cards: await Promise.all(
      routeHubData.cards.map(async (card) => ({
        _type: 'routeHubCard',
        _key: key(),
        title: card.title,
        routeSlug: card.slug,
        summary: card.summary,
        image: await uploadImage(client, card.image),
      })),
    ),
    testimonials: routeHubData.testimonials.map((t) => ({
      _type: 'hubTestimonial',
      _key: key(),
      name: t.name,
      date: t.date,
      quote: t.quote,
    })),
    faqHeading: routeHubData.faqHeading,
    faqSubheading: routeHubData.faqSubheading,
    faqIntro: routeHubData.faqIntro,
    faqs: routeHubData.faqs.map((f) => ({
      _type: 'faqItem',
      _key: key(),
      question: f.question,
      answer: f.answer,
    })),
  })
  console.log('routesHubPage created/replaced')

  await client.createOrReplace({
    _id: 'packagesHubPage-en',
    _type: 'packagesHubPage',
    language: 'en',
    hero: {...packageHubHero},
    cards: await Promise.all(
      packageHubCards.map(async (card) => ({
        _type: 'packageHubCard',
        _key: key(),
        title: card.title,
        packageSlug: card.slug,
        nights: card.nights,
        summary: card.summary,
        image: await uploadImage(client, card.image),
      })),
    ),
  })
  console.log('packagesHubPage created/replaced')

  await client.createOrReplace({
    _id: 'comboHubPage-en',
    _type: 'comboHubPage',
    language: 'en',
    intro: {
      heading: comboHubIntro.heading,
      body: comboHubIntro.body.map(paragraphBlock),
    },
    cards: await Promise.all(
      comboHubCards.map(async (card) => ({
        _type: 'comboHubCard',
        _key: key(),
        title: card.title,
        ...(card.href ? {href: card.href} : {}),
        nights: card.nights,
        summary: card.summary,
        image: await uploadImage(client, card.image),
      })),
    ),
    cta: {...comboHubCta},
  })
  console.log('comboHubPage created/replaced')
}

async function run() {
  await seedShared()
  await seedHubs()
  console.log('done')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
