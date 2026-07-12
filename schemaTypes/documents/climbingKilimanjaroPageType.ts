import {defineArrayMember, defineField, defineType} from 'sanity'
import {BoltIcon} from '@sanity/icons/Bolt'

/**
 * Singleton (id: "climbingKilimanjaroPage"): the extra sections composed
 * into /climbing-mount-kilimanjaro/ alongside its guide article — trust
 * badges, CTA bands, route selector tabs, promo strip, and review cards.
 */
export const climbingKilimanjaroPageType = defineType({
  name: 'climbingKilimanjaroPage',
  title: 'Climbing Kilimanjaro Page',
  type: 'document',
  icon: BoltIcon,
  fields: [
    defineField({
      name: 'trustBadges',
      title: 'Trust badges',
      type: 'object',
      fields: [
        defineField({name: 'heading', title: 'Heading', type: 'string', validation: (rule) => rule.required()}),
        defineField({
          name: 'badges',
          title: 'Badges',
          type: 'array',
          of: [
            defineArrayMember({
              name: 'trustBadge',
              title: 'Badge',
              type: 'object',
              fields: [
                defineField({name: 'title', title: 'Title', type: 'string', validation: (rule) => rule.required()}),
                defineField({name: 'description', title: 'Description', type: 'text', rows: 2, validation: (rule) => rule.required()}),
              ],
              preview: {select: {title: 'title'}},
            }),
          ],
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'challengeBand',
      title: 'Challenge CTA band',
      type: 'object',
      fields: [
        defineField({name: 'heading', title: 'Heading', type: 'string', validation: (rule) => rule.required()}),
        defineField({name: 'body', title: 'Body', type: 'text', rows: 3, validation: (rule) => rule.required()}),
        defineField({name: 'backgroundImage', title: 'Background image', type: 'siteImage', validation: (rule) => rule.required()}),
        defineField({name: 'primaryCtaLabel', title: 'Primary CTA label', type: 'string', validation: (rule) => rule.required()}),
        defineField({name: 'secondaryCtaLabel', title: 'Secondary CTA label', type: 'string', validation: (rule) => rule.required()}),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'routeSelector',
      title: 'Route selector tabs',
      type: 'object',
      fields: [
        defineField({name: 'heading', title: 'Heading', type: 'string', validation: (rule) => rule.required()}),
        defineField({
          name: 'tabs',
          title: 'Tabs',
          type: 'array',
          of: [
            defineArrayMember({
              name: 'routeTab',
              title: 'Route tab',
              type: 'object',
              fields: [
                defineField({name: 'name', title: 'Name', type: 'string', validation: (rule) => rule.required()}),
                defineField({name: 'body', title: 'Body', type: 'text', rows: 4, validation: (rule) => rule.required()}),
                defineField({name: 'map', title: 'Map image', type: 'siteImage', validation: (rule) => rule.required()}),
              ],
              preview: {select: {title: 'name', media: 'map'}},
            }),
          ],
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'conquerBand',
      title: 'Conquer CTA band',
      type: 'object',
      fields: [
        defineField({name: 'heading', title: 'Heading', type: 'string', validation: (rule) => rule.required()}),
        defineField({name: 'body', title: 'Body', type: 'text', rows: 3, validation: (rule) => rule.required()}),
        defineField({name: 'backgroundImage', title: 'Background image', type: 'siteImage', validation: (rule) => rule.required()}),
        defineField({name: 'primaryCtaLabel', title: 'Primary CTA label', type: 'string', validation: (rule) => rule.required()}),
        defineField({name: 'secondaryCtaLabel', title: 'Secondary CTA label', type: 'string', validation: (rule) => rule.required()}),
        defineField({name: 'primaryCtaHref', title: 'Primary CTA link', type: 'string', validation: (rule) => rule.required()}),
        defineField({name: 'secondaryCtaHref', title: 'Secondary CTA link', type: 'string', validation: (rule) => rule.required()}),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'promoStrip',
      title: 'Promo strip',
      type: 'object',
      fields: [
        defineField({name: 'heading', title: 'Heading', type: 'string', validation: (rule) => rule.required()}),
        defineField({
          name: 'cards',
          title: 'Cards',
          type: 'array',
          of: [
            defineArrayMember({
              name: 'promoCard',
              title: 'Card',
              type: 'object',
              fields: [
                defineField({name: 'title', title: 'Title', type: 'string', validation: (rule) => rule.required()}),
                defineField({name: 'body', title: 'Body', type: 'text', rows: 3, validation: (rule) => rule.required()}),
                defineField({name: 'linkLabel', title: 'Link label', type: 'string', validation: (rule) => rule.required()}),
                defineField({name: 'href', title: 'Link', type: 'string', validation: (rule) => rule.required()}),
                defineField({name: 'backgroundImage', title: 'Background image', type: 'siteImage', validation: (rule) => rule.required()}),
              ],
              preview: {select: {title: 'title', media: 'backgroundImage'}},
            }),
          ],
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'reviews',
      title: 'Reviews',
      type: 'object',
      fields: [
        defineField({
          name: 'tripAdvisor',
          title: 'TripAdvisor',
          type: 'object',
          fields: [
            defineField({name: 'heading', title: 'Heading', type: 'string', validation: (rule) => rule.required()}),
            defineField({name: 'cardHeading', title: 'Card heading', type: 'string', validation: (rule) => rule.required()}),
            defineField({name: 'cardBody', title: 'Card body', type: 'text', rows: 3, validation: (rule) => rule.required()}),
            defineField({
              name: 'cards',
              title: 'Review cards',
              type: 'array',
              of: [
                defineArrayMember({
                  name: 'reviewCard',
                  title: 'Review',
                  type: 'object',
                  fields: [
                    defineField({name: 'name', title: 'Name', type: 'string', validation: (rule) => rule.required()}),
                    defineField({name: 'date', title: 'Date', type: 'string', validation: (rule) => rule.required()}),
                    defineField({name: 'title', title: 'Title', type: 'string', validation: (rule) => rule.required()}),
                    defineField({name: 'quote', title: 'Quote', type: 'text', rows: 4, validation: (rule) => rule.required()}),
                  ],
                  preview: {select: {title: 'name', subtitle: 'title'}},
                }),
              ],
            }),
          ],
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'google',
          title: 'Google',
          type: 'object',
          fields: [
            defineField({name: 'cardHeading', title: 'Card heading', type: 'string', validation: (rule) => rule.required()}),
            defineField({name: 'cardBody', title: 'Card body', type: 'text', rows: 3, validation: (rule) => rule.required()}),
          ],
          validation: (rule) => rule.required(),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Climbing Kilimanjaro Page'}
    },
  },
})
