/**
 * Seed the six bespoke page singletons: aboutPage, contactPage,
 * requestQuotePage, zanzibarPage, tanzaniaSafariPage, safariToursPage.
 * Idempotent via createOrReplace (explicit singleton ids).
 *
 * Run from the studio folder:
 *   npx sanity exec scripts/seed-bespoke-pages.ts --with-user-token
 */
import {getCliClient} from 'sanity/cli'

import {aboutData} from '../../climbingkilimanjarotanzania/content/about'
import {contactData} from '../../climbingkilimanjarotanzania/content/contact'
import {requestQuoteData} from '../../climbingkilimanjarotanzania/content/request-quote'
import {zanzibarData} from '../../climbingkilimanjarotanzania/content/zanzibar'
import {tanzaniaSafariData} from '../../climbingkilimanjarotanzania/content/tanzania-safari'
import {safariToursData} from '../../climbingkilimanjarotanzania/content/safari-tours'
import {key, segmentsToBlock} from './lib/pt'
import {uploadImage} from './lib/assets'

const client = getCliClient({apiVersion: '2026-07-01'})

const seo = (data: {seo: {title: string; description: string}}) => ({
  _type: 'seo',
  title: data.seo.title,
  description: data.seo.description,
})

async function run() {
  await client.createOrReplace({
    _id: 'aboutPage-en',
    _type: 'aboutPage',
    language: 'en',
    seo: seo(aboutData),
    hero: {
      heading: aboutData.hero.heading,
      backgroundImage: await uploadImage(client, aboutData.hero.backgroundImage),
    },
    intro: {
      eyebrow: aboutData.intro.eyebrow,
      sections: aboutData.intro.sections.map((section) => ({
        _type: 'aboutSection',
        _key: key(),
        ...(section.heading ? {heading: section.heading} : {}),
        body: section.body,
      })),
    },
    bodyImage: await uploadImage(client, aboutData.bodyImage),
    fleetSection: {
      ...(aboutData.fleetSection.heading ? {heading: aboutData.fleetSection.heading} : {}),
      body: aboutData.fleetSection.body,
    },
    quote: aboutData.quote,
    ctaHeading: aboutData.ctaHeading,
  })
  console.log('aboutPage created/replaced')

  await client.createOrReplace({
    _id: 'contactPage-en',
    _type: 'contactPage',
    language: 'en',
    seo: seo(contactData),
    pageTitle: contactData.pageTitle,
    hero: {
      backgroundImage: await uploadImage(client, contactData.hero.backgroundImage),
      heading: contactData.hero.heading,
      subheading: contactData.hero.subheading,
    },
    intro: {
      heading: contactData.intro.heading,
      body: contactData.intro.body,
      contactLabel: contactData.intro.contactLabel,
      location: contactData.intro.location,
      imageLeft: await uploadImage(client, contactData.intro.imageLeft),
      imageRight: await uploadImage(client, contactData.intro.imageRight),
    },
    form: {
      eyebrow: contactData.form.eyebrow,
      heading: contactData.form.heading,
      routeOptions: contactData.form.routeOptions,
    },
  })
  console.log('contactPage created/replaced')

  await client.createOrReplace({
    _id: 'requestQuotePage-en',
    _type: 'requestQuotePage',
    language: 'en',
    seo: seo(requestQuoteData),
    hero: {
      heading: requestQuoteData.hero.heading,
      subheading: requestQuoteData.hero.subheading,
    },
    contactInfo: {
      address: requestQuoteData.contactInfo.address,
      officeHours: requestQuoteData.contactInfo.officeHours,
      whatsappHref: requestQuoteData.contactInfo.whatsappHref,
    },
    intro: requestQuoteData.intro,
    howToHeading: requestQuoteData.howToHeading,
    howToBody: [segmentsToBlock(requestQuoteData.howToBody)],
  })
  console.log('requestQuotePage created/replaced')

  await client.createOrReplace({
    _id: 'zanzibarPage-en',
    _type: 'zanzibarPage',
    language: 'en',
    seo: seo(zanzibarData),
    hero: {
      heading: zanzibarData.hero.heading,
      backgroundImage: await uploadImage(client, zanzibarData.hero.backgroundImage),
    },
    cards: await Promise.all(
      zanzibarData.cards.map(async (card) => ({
        _type: 'zanzibarCard',
        _key: key(),
        title: card.title,
        price: card.price,
        location: card.location,
        image: await uploadImage(client, card.image),
      })),
    ),
  })
  console.log('zanzibarPage created/replaced')

  await client.createOrReplace({
    _id: 'tanzaniaSafariPage-en',
    _type: 'tanzaniaSafariPage',
    language: 'en',
    seo: seo(tanzaniaSafariData),
    hero: {
      eyebrow: tanzaniaSafariData.hero.eyebrow,
      heading: tanzaniaSafariData.hero.heading,
      backgroundImage: await uploadImage(client, tanzaniaSafariData.hero.backgroundImage),
    },
    cards: await Promise.all(
      tanzaniaSafariData.cards.map(async (card) => ({
        _type: 'safariCard',
        _key: key(),
        title: card.title,
        price: card.price,
        image: await uploadImage(client, card.image),
      })),
    ),
  })
  console.log('tanzaniaSafariPage created/replaced')

  await client.createOrReplace({
    _id: 'safariToursPage-en',
    _type: 'safariToursPage',
    language: 'en',
    seo: seo(safariToursData),
    hero: {
      eyebrow: safariToursData.hero.eyebrow,
      heading: safariToursData.hero.heading,
      backgroundImage: await uploadImage(client, safariToursData.hero.backgroundImage),
    },
    intro: {
      title: safariToursData.intro.title,
      body: safariToursData.intro.body,
    },
    whereToGo: {
      eyebrow: safariToursData.whereToGo.eyebrow,
      heading: safariToursData.whereToGo.heading,
      body: safariToursData.whereToGo.body,
      image: await uploadImage(client, safariToursData.whereToGo.image),
    },
    tourStyles: {
      eyebrow: safariToursData.tourStyles.eyebrow,
      heading: safariToursData.tourStyles.heading,
      styles: await Promise.all(
        safariToursData.tourStyles.styles.map(async (style) => ({
          _type: 'tourStyle',
          _key: key(),
          label: style.label,
          image: await uploadImage(client, style.image),
        })),
      ),
    },
    seasons: {
      eyebrow: safariToursData.seasons.eyebrow,
      heading: safariToursData.seasons.heading,
      intro: safariToursData.seasons.intro,
      months: safariToursData.seasons.months.map((month) => ({
        _type: 'seasonMonth',
        _key: key(),
        month: month.month,
        body: month.body,
      })),
    },
    whyTravelWithUs: {
      heading: safariToursData.whyTravelWithUs.heading,
      intro: safariToursData.whyTravelWithUs.intro,
      features: safariToursData.whyTravelWithUs.features.map((feature) => ({
        _type: 'safariFeature',
        _key: key(),
        description: feature.description,
      })),
    },
  })
  console.log('safariToursPage created/replaced')
  console.log('done')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
