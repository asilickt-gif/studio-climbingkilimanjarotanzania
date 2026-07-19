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
import {key, segmentParagraphsToPt, segmentsToRichText} from './lib/pt'
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
    _id: 'homePage-en',
    _type: 'homePage',
    language: 'en',
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
    _id: 'climbingKilimanjaroPage-en',
    _type: 'climbingKilimanjaroPage',
    language: 'en',
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
    infoTabs: [
      {
        _type: 'routeChoicesTab',
        _key: key(),
        label: data.infoTabs.routeChoices.label,
        heading: data.infoTabs.routeChoices.heading,
        intro: segmentParagraphsToPt(data.infoTabs.routeChoices.intro),
        faqCards: data.infoTabs.routeChoices.faqCards.map((card) => ({
          _type: 'richFaqCard',
          _key: key(),
          question: card.question,
          answer: segmentsToRichText(card.answer),
        })),
        closingNote: segmentsToRichText(data.infoTabs.routeChoices.closingNote),
      },
      {
        _type: 'routesComparisonTab',
        _key: key(),
        label: data.infoTabs.routesComparison.label,
        heading: data.infoTabs.routesComparison.heading,
        table: {
          _type: 'dataTable',
          columns: data.infoTabs.routesComparison.table.columns,
          rows: data.infoTabs.routesComparison.table.rows.map((cells) => ({
            _type: 'tableRow',
            _key: key(),
            cells,
          })),
        },
        noteLabel: data.infoTabs.routesComparison.noteLabel,
        noteBody: data.infoTabs.routesComparison.noteBody,
      },
      {
        _type: 'bestTimeTab',
        _key: key(),
        label: data.infoTabs.bestTime.label,
        heading: data.infoTabs.bestTime.heading,
        intro: segmentParagraphsToPt(data.infoTabs.bestTime.intro),
        cards: data.infoTabs.bestTime.cards.map((card) => ({
          _type: 'bestTimeCard',
          _key: key(),
          title: card.title,
          bullets: card.bullets.map((bullet) => ({
            _type: 'bulletItem',
            _key: key(),
            body: segmentsToRichText(bullet),
          })),
        })),
        closingNote: segmentsToRichText(data.infoTabs.bestTime.closingNote),
      },
      {
        _type: 'climbCostTab',
        _key: key(),
        label: data.infoTabs.climbCost.label,
        heading: data.infoTabs.climbCost.heading,
        intro: segmentsToRichText(data.infoTabs.climbCost.intro),
        items: data.infoTabs.climbCost.items,
        closingNote: segmentsToRichText(data.infoTabs.climbCost.closingNote),
      },
      {
        _type: 'climbingInsightsTab',
        _key: key(),
        label: data.infoTabs.climbingInsights.label,
        heading: data.infoTabs.climbingInsights.heading,
        intro: segmentsToRichText(data.infoTabs.climbingInsights.intro),
        tips: data.infoTabs.climbingInsights.tips.map((tip) => ({
          _type: 'tip',
          _key: key(),
          label: tip.label,
          description: tip.description,
        })),
        closingNote: data.infoTabs.climbingInsights.closingNote,
      },
      {
        _type: 'guidedClimbsTab',
        _key: key(),
        label: data.infoTabs.guidedClimbs.label,
        heading: data.infoTabs.guidedClimbs.heading,
        intro: segmentsToRichText(data.infoTabs.guidedClimbs.intro),
        faqs: data.infoTabs.guidedClimbs.faqs.map((faq) => ({
          _type: 'faqItem',
          _key: key(),
          question: faq.question,
          answer: faq.answer,
        })),
        closingNote: segmentsToRichText(data.infoTabs.guidedClimbs.closingNote),
        ctaLabel: data.infoTabs.guidedClimbs.ctaLabel,
        ctaHref: data.infoTabs.guidedClimbs.ctaHref,
      },
    ],
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
