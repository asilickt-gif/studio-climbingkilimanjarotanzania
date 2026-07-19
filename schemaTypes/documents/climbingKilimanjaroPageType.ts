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
    defineField({name: 'language', type: 'string', readOnly: true, hidden: true}),
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
      name: 'infoTabs',
      title: 'Info tabs',
      description: 'The 6-tab "Route Choices / Comparison / Best Time / Cost / Insights / Guided Climbs" section.',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'routeChoicesTab',
          title: 'Route Choices tab',
          type: 'object',
          fields: [
            defineField({name: 'label', title: 'Tab label', type: 'string', validation: (rule) => rule.required()}),
            defineField({name: 'heading', title: 'Heading', type: 'string', validation: (rule) => rule.required()}),
            defineField({name: 'intro', title: 'Intro', type: 'richText', validation: (rule) => rule.required()}),
            defineField({
              name: 'faqCards',
              title: 'FAQ cards',
              type: 'array',
              of: [
                defineArrayMember({
                  name: 'richFaqCard',
                  title: 'Card',
                  type: 'object',
                  fields: [
                    defineField({name: 'question', title: 'Question', type: 'string', validation: (rule) => rule.required()}),
                    defineField({name: 'answer', title: 'Answer', type: 'richText', validation: (rule) => rule.required()}),
                  ],
                  preview: {select: {title: 'question'}},
                }),
              ],
              validation: (rule) => rule.min(1),
            }),
            defineField({name: 'closingNote', title: 'Closing note', type: 'richText', validation: (rule) => rule.required()}),
          ],
          preview: {select: {title: 'label'}},
        }),
        defineArrayMember({
          name: 'routesComparisonTab',
          title: 'Routes Comparison tab',
          type: 'object',
          fields: [
            defineField({name: 'label', title: 'Tab label', type: 'string', validation: (rule) => rule.required()}),
            defineField({name: 'heading', title: 'Heading', type: 'string', validation: (rule) => rule.required()}),
            defineField({name: 'table', title: 'Comparison table', type: 'dataTable', validation: (rule) => rule.required()}),
            defineField({name: 'noteLabel', title: 'Note label', type: 'string', initialValue: 'NOTE:', validation: (rule) => rule.required()}),
            defineField({name: 'noteBody', title: 'Note body', type: 'text', rows: 3, validation: (rule) => rule.required()}),
          ],
          preview: {select: {title: 'label'}},
        }),
        defineArrayMember({
          name: 'bestTimeTab',
          title: 'Best Time to Climb tab',
          type: 'object',
          fields: [
            defineField({name: 'label', title: 'Tab label', type: 'string', validation: (rule) => rule.required()}),
            defineField({name: 'heading', title: 'Heading', type: 'string', validation: (rule) => rule.required()}),
            defineField({name: 'intro', title: 'Intro', type: 'richText', validation: (rule) => rule.required()}),
            defineField({
              name: 'cards',
              title: 'Cards',
              type: 'array',
              of: [
                defineArrayMember({
                  name: 'bestTimeCard',
                  title: 'Card',
                  type: 'object',
                  fields: [
                    defineField({name: 'title', title: 'Title', type: 'string', validation: (rule) => rule.required()}),
                    defineField({
                      name: 'bullets',
                      title: 'Bullets',
                      type: 'array',
                      of: [
                        defineArrayMember({
                          name: 'bulletItem',
                          title: 'Bullet',
                          type: 'object',
                          fields: [defineField({name: 'body', title: 'Body', type: 'richText', validation: (rule) => rule.required()})],
                        }),
                      ],
                      validation: (rule) => rule.min(1),
                    }),
                  ],
                  preview: {select: {title: 'title'}},
                }),
              ],
              validation: (rule) => rule.min(1),
            }),
            defineField({name: 'closingNote', title: 'Closing note', type: 'richText', validation: (rule) => rule.required()}),
          ],
          preview: {select: {title: 'label'}},
        }),
        defineArrayMember({
          name: 'climbCostTab',
          title: 'Climb Cost tab',
          type: 'object',
          fields: [
            defineField({name: 'label', title: 'Tab label', type: 'string', validation: (rule) => rule.required()}),
            defineField({name: 'heading', title: 'Heading', type: 'string', validation: (rule) => rule.required()}),
            defineField({name: 'intro', title: 'Intro', type: 'richText', validation: (rule) => rule.required()}),
            defineField({
              name: 'items',
              title: 'Cost factors',
              type: 'array',
              of: [defineArrayMember({type: 'string'})],
              validation: (rule) => rule.min(1),
            }),
            defineField({name: 'closingNote', title: 'Closing note', type: 'richText', validation: (rule) => rule.required()}),
          ],
          preview: {select: {title: 'label'}},
        }),
        defineArrayMember({
          name: 'climbingInsightsTab',
          title: 'Climbing Insights tab',
          type: 'object',
          fields: [
            defineField({name: 'label', title: 'Tab label', type: 'string', validation: (rule) => rule.required()}),
            defineField({name: 'heading', title: 'Heading', type: 'string', validation: (rule) => rule.required()}),
            defineField({name: 'intro', title: 'Intro', type: 'richText', validation: (rule) => rule.required()}),
            defineField({
              name: 'tips',
              title: 'Tips',
              type: 'array',
              of: [
                defineArrayMember({
                  name: 'tip',
                  title: 'Tip',
                  type: 'object',
                  fields: [
                    defineField({name: 'label', title: 'Label', type: 'string', description: 'Short bold lead-in, e.g. "Go Slow:"', validation: (rule) => rule.required()}),
                    defineField({name: 'description', title: 'Description', type: 'text', rows: 2, validation: (rule) => rule.required()}),
                  ],
                  preview: {select: {title: 'label', subtitle: 'description'}},
                }),
              ],
              validation: (rule) => rule.min(1),
            }),
            defineField({name: 'closingNote', title: 'Closing note', type: 'text', rows: 2, validation: (rule) => rule.required()}),
          ],
          preview: {select: {title: 'label'}},
        }),
        defineArrayMember({
          name: 'guidedClimbsTab',
          title: 'Guided Climbs tab',
          type: 'object',
          fields: [
            defineField({name: 'label', title: 'Tab label', type: 'string', validation: (rule) => rule.required()}),
            defineField({name: 'heading', title: 'Heading', type: 'string', validation: (rule) => rule.required()}),
            defineField({name: 'intro', title: 'Intro', type: 'richText', validation: (rule) => rule.required()}),
            defineField({
              name: 'faqs',
              title: 'FAQs',
              type: 'array',
              of: [defineArrayMember({type: 'faqItem'})],
              validation: (rule) => rule.min(1),
            }),
            defineField({name: 'closingNote', title: 'Closing note', type: 'richText', validation: (rule) => rule.required()}),
            defineField({name: 'ctaLabel', title: 'CTA label', type: 'string', validation: (rule) => rule.required()}),
            defineField({name: 'ctaHref', title: 'CTA link', type: 'string', validation: (rule) => rule.required()}),
          ],
          preview: {select: {title: 'label'}},
        }),
      ],
      validation: (rule) => rule.min(1),
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
