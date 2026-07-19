import {defineArrayMember, defineField, defineType} from 'sanity'
import {EarthAmericasIcon} from '@sanity/icons/EarthAmericas'

/**
 * A destination detail page (currently only Serengeti) — hero, overview,
 * activities grid, best-time section, gallery, and cross-promo grid.
 * Renders at /<slug>/ via a dedicated route.
 */
export const destinationDetailType = defineType({
  name: 'destinationDetail',
  title: 'Destination Detail',
  type: 'document',
  icon: EarthAmericasIcon,
  fields: [
    defineField({name: 'language', type: 'string', readOnly: true, hidden: true}),
    defineField({name: 'slug', title: 'Slug', type: 'slug', validation: (rule) => rule.required()}),
    defineField({name: 'seo', title: 'SEO', type: 'seo', validation: (rule) => rule.required()}),
    defineField({name: 'name', title: 'Name', type: 'string', validation: (rule) => rule.required()}),
    defineField({
      name: 'hero',
      title: 'Hero',
      type: 'object',
      fields: [
        defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string', validation: (rule) => rule.required()}),
        defineField({name: 'heading', title: 'Heading', type: 'string', validation: (rule) => rule.required()}),
        defineField({name: 'locationPill', title: 'Location pill', type: 'string', validation: (rule) => rule.required()}),
        defineField({name: 'backgroundImage', title: 'Background image', type: 'siteImage', validation: (rule) => rule.required()}),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'overview',
      title: 'Overview',
      type: 'object',
      fields: [
        defineField({name: 'heading', title: 'Heading', type: 'string', validation: (rule) => rule.required()}),
        defineField({name: 'body', title: 'Body', type: 'richText', validation: (rule) => rule.required()}),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'activitiesHeading', title: 'Activities heading', type: 'string', validation: (rule) => rule.required()}),
    defineField({
      name: 'activities',
      title: 'Activities',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'activity',
          title: 'Activity',
          type: 'object',
          fields: [
            defineField({name: 'title', title: 'Title', type: 'string', validation: (rule) => rule.required()}),
            defineField({name: 'body', title: 'Body', type: 'text', rows: 3, validation: (rule) => rule.required()}),
          ],
          preview: {select: {title: 'title'}},
        }),
      ],
      validation: (rule) => rule.min(1),
    }),
    defineField({
      name: 'bestTimeToVisit',
      title: 'Best time to visit',
      type: 'object',
      fields: [
        defineField({name: 'heading', title: 'Heading', type: 'string', validation: (rule) => rule.required()}),
        defineField({name: 'body', title: 'Body', type: 'richText', validation: (rule) => rule.required()}),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      of: [defineArrayMember({type: 'siteImage'})],
    }),
    defineField({name: 'otherDestinationsHeading', title: 'Other destinations heading', type: 'string', validation: (rule) => rule.required()}),
    defineField({
      name: 'otherDestinations',
      title: 'Other destinations',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'crossPromo',
          title: 'Destination',
          type: 'object',
          fields: [
            defineField({name: 'name', title: 'Name', type: 'string', validation: (rule) => rule.required()}),
            defineField({name: 'href', title: 'Link', type: 'string', validation: (rule) => rule.required()}),
            defineField({name: 'image', title: 'Image', type: 'siteImage', validation: (rule) => rule.required()}),
          ],
          preview: {select: {title: 'name', media: 'image'}},
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'name', subtitle: 'slug.current', media: 'hero.backgroundImage'},
  },
})
