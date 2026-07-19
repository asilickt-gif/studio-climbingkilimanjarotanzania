import {defineArrayMember, defineField, defineType} from 'sanity'
import {EarthGlobeIcon} from '@sanity/icons/EarthGlobe'
import {isSlugUniquePerLanguage} from '../lib/localizedSlug'

/**
 * A Kilimanjaro climbing route (Machame, Lemosho, …) — the legacy
 * RouteDetailData shape: hero, camp-by-camp itinerary stops (no day
 * numbers/photos, unlike trips), tabbed info blocks with pricing tables,
 * secondary banner, and numbered FAQs. Routes render at
 * /kilimanjaro-routes/<slug>/.
 */
export const routeType = defineType({
  name: 'route',
  title: 'Route',
  type: 'document',
  icon: EarthGlobeIcon,
  fields: [
    defineField({name: 'language', type: 'string', readOnly: true, hidden: true}),
    defineField({name: 'slug', title: 'Slug', type: 'slug', options: {isUnique: isSlugUniquePerLanguage}, validation: (rule) => rule.required()}),
    defineField({name: 'seo', title: 'SEO', type: 'seo', validation: (rule) => rule.required()}),
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'e.g. "Machame Route"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'hero',
      title: 'Hero',
      type: 'object',
      fields: [
        defineField({name: 'heading', title: 'Heading', type: 'string', validation: (rule) => rule.required()}),
        defineField({name: 'tagline', title: 'Tagline', type: 'string', validation: (rule) => rule.required()}),
        defineField({name: 'body', title: 'Body', type: 'richText', validation: (rule) => rule.required()}),
        defineField({name: 'image', title: 'Image', type: 'siteImage', validation: (rule) => rule.required()}),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'itinerary',
      title: 'Itinerary',
      type: 'object',
      fields: [
        defineField({name: 'heading', title: 'Heading', type: 'string', validation: (rule) => rule.required()}),
        defineField({name: 'subheading', title: 'Subheading', type: 'string', validation: (rule) => rule.required()}),
        defineField({name: 'daysLabel', title: 'Days label', type: 'string', description: 'e.g. "6-7 Days"', validation: (rule) => rule.required()}),
        defineField({
          name: 'stops',
          title: 'Stops',
          type: 'array',
          of: [
            defineArrayMember({
              name: 'routeStop',
              title: 'Stop',
              type: 'object',
              fields: [
                defineField({name: 'label', title: 'Label', type: 'string', validation: (rule) => rule.required()}),
                defineField({
                  name: 'meta',
                  title: 'Meta lines',
                  type: 'array',
                  of: [defineArrayMember({type: 'string'})],
                }),
                defineField({name: 'body', title: 'Body', type: 'richText', validation: (rule) => rule.required()}),
              ],
              preview: {select: {title: 'label'}},
            }),
          ],
          validation: (rule) => rule.min(1),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'infoTabs',
      title: 'Info tabs',
      type: 'object',
      fields: [
        defineField({name: 'heading', title: 'Heading', type: 'string', validation: (rule) => rule.required()}),
        defineField({
          name: 'tabs',
          title: 'Tabs',
          type: 'array',
          of: [
            defineArrayMember({
              name: 'routeInfoTab',
              title: 'Tab',
              type: 'object',
              fields: [
                defineField({name: 'tabId', title: 'Tab id', type: 'string', description: 'Stable id used for tab switching, e.g. "overview"', validation: (rule) => rule.required()}),
                defineField({name: 'label', title: 'Label', type: 'string', validation: (rule) => rule.required()}),
                defineField({
                  name: 'blocks',
                  title: 'Blocks',
                  type: 'array',
                  of: [
                    defineArrayMember({
                      name: 'routeInfoBlock',
                      title: 'Block',
                      type: 'object',
                      fields: [
                        defineField({name: 'heading', title: 'Heading', type: 'string', validation: (rule) => rule.required()}),
                        defineField({name: 'paragraphs', title: 'Paragraphs', type: 'richText'}),
                        defineField({
                          name: 'bullets',
                          title: 'Bullets',
                          type: 'array',
                          of: [defineArrayMember({type: 'string'})],
                        }),
                        defineField({
                          name: 'pricingTable',
                          title: 'Pricing table',
                          type: 'object',
                          fields: [
                            defineField({
                              name: 'columns',
                              title: 'Column headings',
                              type: 'array',
                              of: [defineArrayMember({type: 'string'})],
                            }),
                            defineField({
                              name: 'rows',
                              title: 'Rows',
                              type: 'array',
                              of: [
                                defineArrayMember({
                                  name: 'pricingRow',
                                  title: 'Row',
                                  type: 'object',
                                  fields: [
                                    defineField({name: 'label', title: 'Row label', type: 'string', validation: (rule) => rule.required()}),
                                    defineField({
                                      name: 'values',
                                      title: 'Values',
                                      type: 'array',
                                      of: [defineArrayMember({type: 'string'})],
                                    }),
                                  ],
                                  preview: {select: {title: 'label'}},
                                }),
                              ],
                            }),
                          ],
                        }),
                      ],
                      preview: {select: {title: 'heading'}},
                    }),
                  ],
                }),
              ],
              preview: {select: {title: 'label'}},
            }),
          ],
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'secondaryBanner',
      title: 'Secondary banner',
      type: 'object',
      fields: [
        defineField({name: 'heading', title: 'Heading', type: 'string', validation: (rule) => rule.required()}),
        defineField({name: 'tagline', title: 'Tagline', type: 'string', validation: (rule) => rule.required()}),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'faqHeading', title: 'FAQ heading', type: 'string', validation: (rule) => rule.required()}),
    defineField({
      name: 'faqs',
      title: 'FAQs',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'numberedFaq',
          title: 'FAQ',
          type: 'object',
          fields: [
            defineField({name: 'number', title: 'Number', type: 'number', validation: (rule) => rule.required()}),
            defineField({name: 'question', title: 'Question', type: 'string', validation: (rule) => rule.required()}),
            defineField({name: 'answer', title: 'Answer', type: 'text', rows: 4, validation: (rule) => rule.required()}),
          ],
          preview: {
            select: {number: 'number', title: 'question'},
            prepare({number, title}) {
              return {title: `${number}. ${title}`}
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'name', subtitle: 'slug.current', media: 'hero.image'},
  },
})
