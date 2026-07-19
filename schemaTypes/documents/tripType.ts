import {defineArrayMember, defineField, defineType} from 'sanity'
import {PackageIcon} from '@sanity/icons/Package'
import {isSlugUniquePerLanguage} from '../lib/localizedSlug'

const isSafari = ({document}: {document?: {category?: string}}) => document?.category === 'safari'

/**
 * Unified itinerary trip: Kilimanjaro packages, Kilimanjaro+safari combos,
 * and standalone safaris (the legacy PackageDetailData / ComboDetailData /
 * SafariDetailData shapes). Category picks the route group:
 *  - package -> /kilimanjaro-packages/<slug>/
 *  - combo   -> /combo/<slug>/
 *  - safari  -> /<slug>/ (top-level route)
 */
export const tripType = defineType({
  name: 'trip',
  title: 'Trip',
  type: 'document',
  icon: PackageIcon,
  fields: [
    defineField({name: 'language', type: 'string', readOnly: true, hidden: true}),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Kilimanjaro package', value: 'package'},
          {title: 'Kilimanjaro + safari combo', value: 'combo'},
          {title: 'Safari', value: 'safari'},
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {isUnique: isSlugUniquePerLanguage},
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'seo', title: 'SEO', type: 'seo', validation: (rule) => rule.required()}),
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'e.g. "7 Days Machame Route"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'durationDays',
      title: 'Duration (days)',
      type: 'number',
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'hero',
      title: 'Hero',
      type: 'object',
      fields: [
        defineField({
          name: 'stopsLine',
          title: 'Stops line',
          type: 'string',
          description: 'e.g. "Moshi – Machame Gate – Uhuru Peak – Mweka Gate"',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'priceDisclaimer',
          title: 'Price disclaimer',
          type: 'string',
          hidden: isSafari,
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'overview',
      title: 'Overview',
      type: 'object',
      fields: [
        defineField({name: 'body', title: 'Body', type: 'richText', validation: (rule) => rule.required()}),
        defineField({name: 'mapImage', title: 'Map / lead image', type: 'siteImage'}),
        defineField({
          name: 'mapImageIsPhoto',
          title: 'Lead image is a photo (not a map graphic)',
          type: 'boolean',
          hidden: isSafari,
        }),
        defineField({
          name: 'gallery',
          title: 'Gallery',
          type: 'array',
          of: [defineArrayMember({type: 'siteImage'})],
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'itinerary',
      title: 'Itinerary',
      type: 'array',
      of: [defineArrayMember({type: 'itineraryDay'})],
      validation: (rule) => rule.min(1),
    }),
    defineField({
      name: 'includes',
      title: 'Includes',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
    }),
    defineField({
      name: 'excludes',
      title: 'Excludes',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
    }),
    defineField({name: 'faqHeading', title: 'FAQ heading', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'faqIntro', title: 'FAQ intro', type: 'text', rows: 3}),
    defineField({
      name: 'faqs',
      title: 'FAQs',
      type: 'array',
      of: [defineArrayMember({type: 'faqItem'})],
    }),
    defineField({
      name: 'hubSummary',
      title: 'Hub card summary',
      type: 'text',
      rows: 3,
      description: 'Short blurb for this trip’s card on the hub page',
      hidden: isSafari,
    }),
    defineField({
      name: 'hubImage',
      title: 'Hub card image',
      type: 'siteImage',
      hidden: isSafari,
    }),
  ],
  orderings: [
    {
      title: 'Category, then duration',
      name: 'categoryDuration',
      by: [
        {field: 'category', direction: 'asc'},
        {field: 'durationDays', direction: 'asc'},
      ],
    },
  ],
  preview: {
    select: {title: 'name', subtitle: 'category', media: 'hubImage'},
  },
})
