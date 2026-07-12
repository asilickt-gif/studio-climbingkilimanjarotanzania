import {defineArrayMember, defineField, defineType} from 'sanity'
import {PinIcon} from '@sanity/icons/Pin'

/**
 * Singleton (document id: "destinationsPage"): the /destinations/ hub —
 * heading plus the ordered list of destination entries (alternating
 * image/text rows). Entries link to a detail page via href when one exists.
 */
export const destinationsPageType = defineType({
  name: 'destinationsPage',
  title: 'Destinations Page',
  type: 'document',
  icon: PinIcon,
  fields: [
    defineField({name: 'seo', title: 'SEO', type: 'seo', validation: (rule) => rule.required()}),
    defineField({name: 'heading', title: 'Heading', type: 'string', validation: (rule) => rule.required()}),
    defineField({
      name: 'destinations',
      title: 'Destinations',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'destinationEntry',
          title: 'Destination',
          type: 'object',
          fields: [
            defineField({name: 'name', title: 'Name', type: 'string', validation: (rule) => rule.required()}),
            defineField({
              name: 'href',
              title: 'Detail page link',
              type: 'string',
              description: 'Optional, e.g. /serengeti-national-park/',
            }),
            defineField({name: 'image', title: 'Image', type: 'siteImage', validation: (rule) => rule.required()}),
            defineField({name: 'body', title: 'Body', type: 'text', rows: 5, validation: (rule) => rule.required()}),
            defineField({name: 'highlightsHeading', title: 'Highlights heading', type: 'string', validation: (rule) => rule.required()}),
            defineField({
              name: 'highlights',
              title: 'Highlights',
              type: 'array',
              of: [defineArrayMember({type: 'string'})],
              validation: (rule) => rule.min(1),
            }),
            defineField({name: 'bestTime', title: 'Best time to visit', type: 'text', rows: 2, validation: (rule) => rule.required()}),
            defineField({name: 'bonusHeading', title: 'Bonus heading', type: 'string'}),
            defineField({
              name: 'bonus',
              title: 'Bonus items',
              type: 'array',
              of: [defineArrayMember({type: 'string'})],
            }),
          ],
          preview: {select: {title: 'name', media: 'image'}},
        }),
      ],
      validation: (rule) => rule.min(1),
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Destinations Page'}
    },
  },
})
