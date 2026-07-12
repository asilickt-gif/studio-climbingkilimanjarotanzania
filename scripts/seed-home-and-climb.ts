/**
 * Seed the homePage and climbingKilimanjaroPage singletons.
 * Idempotent via createOrReplace.
 *
 * Run from the studio folder:
 *   npx sanity exec scripts/seed-home-and-climb.ts --with-user-token
 */
import {getCliClient} from 'sanity/cli'

import {homeData} from '../../climbingkilimanjarotanzania/content/home'
import {climbingKilimanjaroPageData} from '../../climbingkilimanjarotanzania/content/climbing-kilimanjaro-page'
import type {TourCard} from '../../climbingkilimanjarotanzania/types/home'
import {key, segmentParagraphsToPt} from './lib/pt'
import {uploadImage} from './lib/assets'

const client = getCliClient({apiVersion: '2026-07-01'})

async function tourCards(cards: TourCard[]) {
  const out = []
  for (const card of cards) {
    out.push({
      _type: 'tourCard',
      _key: key(),
      title: card.title,
      href: card.href,
      image: await uploadImage(client, card.image),
      tourType: card.tourType,
      tourId: card.tourId,
      price: card.price,
      location: card.location,
    })
  }
  return out
}

const features = (typeName: string, items: {title: string; description: string}[]) =>
  items.map((item) => ({_type: typeName, _key: key(), title: item.title, description: item.description}))

async function seedHome() {
  const destinations = []
  for (const dest of homeData.hero.destinations) {
    destinations.push({
      _type: 'heroDestination',
      _key: key(),
      key: dest.key,
      eyebrow: dest.eyebrow,
      heading: dest.heading,
      body: dest.body,
      stats: dest.stats.map((stat) => ({_type: 'heroStat', _key: key(), label: stat.label, value: stat.value})),
      mediaType: dest.media.type,
      ...(dest.media.type === 'video'
        ? {videoSrc: dest.media.src, poster: await uploadImage(client, dest.media.poster)}
        : {image: await uploadImage(client, dest.media.image)}),
      thumbnail: await uploadImage(client, dest.thumbnail),
      ctaHref: dest.ctaHref,
    })
  }

  await client.createOrReplace({
    _id: 'homePage',
    _type: 'homePage',
    hero: {
      exploreLabel: homeData.hero.exploreLabel,
      primaryCtaLabel: homeData.hero.primaryCtaLabel,
      secondaryCtaLabel: homeData.hero.secondaryCtaLabel,
      secondaryCtaHref: homeData.hero.secondaryCtaHref,
      destinations,
    },
    features: features('featureItem', homeData.features),
    intro: {
      heading: homeData.intro.heading,
      body: segmentParagraphsToPt(homeData.intro.body),
      ctaLabel: homeData.intro.ctaLabel,
      ctaHref: homeData.intro.ctaHref,
      image: await uploadImage(client, homeData.intro.image),
    },
    introFeatures: features('introFeature', homeData.introFeatures),
    routeGuide: {
      eyebrow: homeData.routeGuide.eyebrow,
      heading: homeData.routeGuide.heading,
      items: homeData.routeGuide.items.map((item) => ({
        _type: 'routeGuideItem',
        _key: key(),
        name: item.name,
        detail: item.detail,
      })),
    },
    kilimanjaroPackages: {
      heading: homeData.kilimanjaroPackages.heading,
      viewAllHref: homeData.kilimanjaroPackages.viewAllHref,
      cards: await tourCards(homeData.kilimanjaroPackages.cards),
    },
    safariPackages: {
      heading: homeData.safariPackages.heading,
      viewAllHref: homeData.safariPackages.viewAllHref,
      cards: await tourCards(homeData.safariPackages.cards),
    },
    zanzibarPackages: {
      heading: homeData.zanzibarPackages.heading,
      viewAllHref: homeData.zanzibarPackages.viewAllHref,
      cards: await tourCards(homeData.zanzibarPackages.cards),
    },
    routeOptions: {
      heading: homeData.routeOptions.heading,
      cards: await Promise.all(
        homeData.routeOptions.cards.map(async (card) => ({
          _type: 'routeOptionCard',
          _key: key(),
          title: card.title,
          href: card.href,
          image: await uploadImage(client, card.image),
          summary: card.summary,
          duration: card.duration,
          prices: card.prices,
        })),
      ),
    },
    notSureBand: {...homeData.notSureBand},
    whyUs: {
      heading: homeData.whyUs.heading,
      body: homeData.whyUs.body,
      cards: homeData.whyUs.cards.map((card) => ({
        _type: 'whyUsCard',
        _key: key(),
        title: card.title,
        description: card.description,
        icon: card.icon,
      })),
    },
    comboExperience: {
      heading: homeData.comboExperience.heading,
      body: homeData.comboExperience.body,
      cardTitle: homeData.comboExperience.cardTitle,
      cardBody: homeData.comboExperience.cardBody,
      ctaLabel: homeData.comboExperience.ctaLabel,
      ctaHref: homeData.comboExperience.ctaHref,
      tiles: await Promise.all(
        homeData.comboExperience.tiles.map(async (tile) => ({
          _type: 'comboTile',
          _key: key(),
          title: tile.title,
          subtitle: tile.subtitle,
          href: tile.href,
          image: await uploadImage(client, tile.image),
        })),
      ),
      body2: homeData.comboExperience.body2,
      viewToursLabel: homeData.comboExperience.viewToursLabel,
      viewToursHref: homeData.comboExperience.viewToursHref,
    },
    testimonials: {
      heading: homeData.testimonials.heading,
      items: homeData.testimonials.items.map((item) => ({
        _type: 'testimonial',
        _key: key(),
        name: item.name,
        timeAgo: item.timeAgo,
        rating: item.rating,
        quote: item.quote,
      })),
    },
    faq: {
      heading: homeData.faq.heading,
      tabs: homeData.faq.tabs.map((tab) => ({
        _type: 'faqTab',
        _key: key(),
        label: tab.label,
        faqs: tab.faqs.map((faq) => ({
          _type: 'faqItem',
          _key: key(),
          question: faq.question,
          answer: faq.answer,
        })),
      })),
    },
  })
  console.log('homePage created/replaced')
}

async function seedClimb() {
  const data = climbingKilimanjaroPageData
  await client.createOrReplace({
    _id: 'climbingKilimanjaroPage',
    _type: 'climbingKilimanjaroPage',
    trustBadges: {
      heading: data.trustBadges.heading,
      badges: data.trustBadges.badges.map((badge) => ({
        _type: 'trustBadge',
        _key: key(),
        title: badge.title,
        description: badge.description,
      })),
    },
    challengeBand: {
      heading: data.challengeBand.heading,
      body: data.challengeBand.body,
      backgroundImage: await uploadImage(client, data.challengeBand.backgroundImage),
      primaryCtaLabel: data.challengeBand.primaryCtaLabel,
      secondaryCtaLabel: data.challengeBand.secondaryCtaLabel,
    },
    routeSelector: {
      heading: data.routeSelector.heading,
      tabs: await Promise.all(
        data.routeSelector.tabs.map(async (tab) => ({
          _type: 'routeTab',
          _key: key(),
          name: tab.name,
          body: tab.body,
          map: await uploadImage(client, tab.map),
        })),
      ),
    },
    conquerBand: {
      heading: data.conquerBand.heading,
      body: data.conquerBand.body,
      backgroundImage: await uploadImage(client, data.conquerBand.backgroundImage),
      primaryCtaLabel: data.conquerBand.primaryCtaLabel,
      secondaryCtaLabel: data.conquerBand.secondaryCtaLabel,
      primaryCtaHref: data.conquerBand.primaryCtaHref,
      secondaryCtaHref: data.conquerBand.secondaryCtaHref,
    },
    promoStrip: {
      heading: data.promoStrip.heading,
      cards: await Promise.all(
        data.promoStrip.cards.map(async (card) => ({
          _type: 'promoCard',
          _key: key(),
          title: card.title,
          body: card.body,
          linkLabel: card.linkLabel,
          href: card.href,
          backgroundImage: await uploadImage(client, card.backgroundImage),
        })),
      ),
    },
    reviews: {
      tripAdvisor: {
        heading: data.reviews.tripAdvisor.heading,
        cardHeading: data.reviews.tripAdvisor.cardHeading,
        cardBody: data.reviews.tripAdvisor.cardBody,
        cards: data.reviews.tripAdvisor.cards.map((card) => ({
          _type: 'reviewCard',
          _key: key(),
          name: card.name,
          date: card.date,
          title: card.title,
          quote: card.quote,
        })),
      },
      google: {
        cardHeading: data.reviews.google.cardHeading,
        cardBody: data.reviews.google.cardBody,
      },
    },
  })
  console.log('climbingKilimanjaroPage created/replaced')
}

async function run() {
  await seedHome()
  await seedClimb()
  console.log('done')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
