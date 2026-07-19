import {defineArrayMember, defineField, defineType} from 'sanity'
import {HomeIcon} from '@sanity/icons/Home'

const featureFields = [
  defineField({name: 'title', title: 'Title', type: 'string', validation: (rule: any) => rule.required()}),
  defineField({name: 'description', title: 'Description', type: 'text', rows: 2, validation: (rule: any) => rule.required()}),
]

const tourCardMember = defineArrayMember({
  name: 'tourCard',
  title: 'Tour card',
  type: 'object',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'href', title: 'Link', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'image', title: 'Image', type: 'siteImage', validation: (rule) => rule.required()}),
    defineField({name: 'tourType', title: 'Tour type', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'tourId', title: 'Tour id', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'price', title: 'Price', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'location', title: 'Location', type: 'string', validation: (rule) => rule.required()}),
  ],
  preview: {select: {title: 'title', subtitle: 'price', media: 'image'}},
})

const packagesGroupFields = [
  defineField({name: 'heading', title: 'Heading', type: 'string', validation: (rule: any) => rule.required()}),
  defineField({name: 'viewAllHref', title: 'View-all link', type: 'string', validation: (rule: any) => rule.required()}),
  defineField({name: 'cards', title: 'Cards', type: 'array', of: [tourCardMember], validation: (rule: any) => rule.min(1)}),
]

/** Singleton (id: "homePage"): the homepage. */
export const homePageType = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  icon: HomeIcon,
  fields: [
    defineField({name: 'language', type: 'string', readOnly: true, hidden: true}),
    defineField({
      name: 'hero',
      title: 'Hero',
      type: 'object',
      fields: [
        defineField({name: 'exploreLabel', title: 'Explore label', type: 'string', validation: (rule) => rule.required()}),
        defineField({name: 'primaryCtaLabel', title: 'Primary CTA label', type: 'string', validation: (rule) => rule.required()}),
        defineField({name: 'secondaryCtaLabel', title: 'Secondary CTA label', type: 'string', validation: (rule) => rule.required()}),
        defineField({name: 'secondaryCtaHref', title: 'Secondary CTA link', type: 'string', validation: (rule) => rule.required()}),
        defineField({
          name: 'destinations',
          title: 'Destinations',
          type: 'array',
          of: [
            defineArrayMember({
              name: 'heroDestination',
              title: 'Destination',
              type: 'object',
              fields: [
                defineField({name: 'key', title: 'Key', type: 'string', description: 'Stable id, e.g. "kilimanjaro"', validation: (rule) => rule.required()}),
                defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string', validation: (rule) => rule.required()}),
                defineField({name: 'heading', title: 'Heading', type: 'string', validation: (rule) => rule.required()}),
                defineField({name: 'body', title: 'Body', type: 'text', rows: 3, validation: (rule) => rule.required()}),
                defineField({
                  name: 'stats',
                  title: 'Stats',
                  type: 'array',
                  of: [
                    defineArrayMember({
                      name: 'heroStat',
                      title: 'Stat',
                      type: 'object',
                      fields: [
                        defineField({name: 'label', title: 'Label', type: 'string', validation: (rule) => rule.required()}),
                        defineField({name: 'value', title: 'Value', type: 'string', validation: (rule) => rule.required()}),
                      ],
                      preview: {select: {title: 'label', subtitle: 'value'}},
                    }),
                  ],
                }),
                defineField({
                  name: 'mediaType',
                  title: 'Media type',
                  type: 'string',
                  options: {list: [{title: 'Video', value: 'video'}, {title: 'Image', value: 'image'}], layout: 'radio'},
                  validation: (rule) => rule.required(),
                }),
                defineField({
                  name: 'videoSrc',
                  title: 'Video file path',
                  type: 'string',
                  description: 'Self-hosted path under public/, e.g. /videos/hero.mp4',
                  hidden: ({parent}) => parent?.mediaType !== 'video',
                }),
                defineField({
                  name: 'poster',
                  title: 'Video poster',
                  type: 'siteImage',
                  hidden: ({parent}) => parent?.mediaType !== 'video',
                }),
                defineField({
                  name: 'image',
                  title: 'Image',
                  type: 'siteImage',
                  hidden: ({parent}) => parent?.mediaType !== 'image',
                }),
                defineField({name: 'thumbnail', title: 'Thumbnail', type: 'siteImage', validation: (rule) => rule.required()}),
                defineField({name: 'ctaHref', title: 'CTA link', type: 'string', validation: (rule) => rule.required()}),
              ],
              preview: {select: {title: 'heading', media: 'thumbnail'}},
            }),
          ],
          validation: (rule) => rule.min(1),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'features',
      title: 'Feature strip',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'featureItem',
          title: 'Feature',
          type: 'object',
          fields: featureFields,
          preview: {select: {title: 'title'}},
        }),
      ],
    }),
    defineField({
      name: 'intro',
      title: 'Intro split',
      type: 'object',
      fields: [
        defineField({name: 'heading', title: 'Heading', type: 'string', validation: (rule) => rule.required()}),
        defineField({name: 'body', title: 'Body', type: 'richText', validation: (rule) => rule.required()}),
        defineField({name: 'ctaLabel', title: 'CTA label', type: 'string', validation: (rule) => rule.required()}),
        defineField({name: 'ctaHref', title: 'CTA link', type: 'string', validation: (rule) => rule.required()}),
        defineField({name: 'image', title: 'Image', type: 'siteImage', validation: (rule) => rule.required()}),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'introFeatures',
      title: 'Intro features',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'introFeature',
          title: 'Feature',
          type: 'object',
          fields: featureFields,
          preview: {select: {title: 'title'}},
        }),
      ],
    }),
    defineField({
      name: 'routeGuide',
      title: 'Route guide banner',
      type: 'object',
      fields: [
        defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string', validation: (rule) => rule.required()}),
        defineField({name: 'heading', title: 'Heading', type: 'string', validation: (rule) => rule.required()}),
        defineField({
          name: 'items',
          title: 'Items',
          type: 'array',
          of: [
            defineArrayMember({
              name: 'routeGuideItem',
              title: 'Item',
              type: 'object',
              fields: [
                defineField({name: 'name', title: 'Name', type: 'string', validation: (rule) => rule.required()}),
                defineField({name: 'detail', title: 'Detail', type: 'string', validation: (rule) => rule.required()}),
              ],
              preview: {select: {title: 'name', subtitle: 'detail'}},
            }),
          ],
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'kilimanjaroPackages', title: 'Kilimanjaro packages carousel', type: 'object', fields: packagesGroupFields, validation: (rule) => rule.required()}),
    defineField({name: 'safariPackages', title: 'Safari packages carousel', type: 'object', fields: packagesGroupFields, validation: (rule) => rule.required()}),
    defineField({name: 'zanzibarPackages', title: 'Zanzibar packages carousel', type: 'object', fields: packagesGroupFields, validation: (rule) => rule.required()}),
    defineField({
      name: 'routeOptions',
      title: 'Route options grid',
      type: 'object',
      fields: [
        defineField({name: 'heading', title: 'Heading', type: 'string', validation: (rule) => rule.required()}),
        defineField({
          name: 'cards',
          title: 'Cards',
          type: 'array',
          of: [
            defineArrayMember({
              name: 'routeOptionCard',
              title: 'Card',
              type: 'object',
              fields: [
                defineField({name: 'title', title: 'Title', type: 'string', validation: (rule) => rule.required()}),
                defineField({name: 'href', title: 'Link', type: 'string', validation: (rule) => rule.required()}),
                defineField({name: 'image', title: 'Image', type: 'siteImage', validation: (rule) => rule.required()}),
                defineField({name: 'summary', title: 'Summary', type: 'text', rows: 3, validation: (rule) => rule.required()}),
                defineField({name: 'duration', title: 'Duration', type: 'string', validation: (rule) => rule.required()}),
                defineField({name: 'prices', title: 'Prices', type: 'array', of: [defineArrayMember({type: 'string'})]}),
              ],
              preview: {select: {title: 'title', media: 'image'}},
            }),
          ],
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'notSureBand',
      title: 'Not-sure CTA band',
      type: 'object',
      fields: [
        defineField({name: 'heading', title: 'Heading', type: 'string', validation: (rule) => rule.required()}),
        defineField({name: 'body', title: 'Body', type: 'text', rows: 3, validation: (rule) => rule.required()}),
        defineField({name: 'ctaLabel', title: 'CTA label', type: 'string', validation: (rule) => rule.required()}),
        defineField({name: 'ctaHref', title: 'CTA link', type: 'string', validation: (rule) => rule.required()}),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'whyUs',
      title: 'Why us',
      type: 'object',
      fields: [
        defineField({name: 'heading', title: 'Heading', type: 'string', validation: (rule) => rule.required()}),
        defineField({name: 'body', title: 'Body', type: 'text', rows: 3, validation: (rule) => rule.required()}),
        defineField({
          name: 'cards',
          title: 'Cards',
          type: 'array',
          of: [
            defineArrayMember({
              name: 'whyUsCard',
              title: 'Card',
              type: 'object',
              fields: [
                defineField({name: 'title', title: 'Title', type: 'string', validation: (rule) => rule.required()}),
                defineField({name: 'description', title: 'Description', type: 'text', rows: 3, validation: (rule) => rule.required()}),
                defineField({
                  name: 'icon',
                  title: 'Icon',
                  type: 'string',
                  options: {
                    list: ['store', 'clinic', 'hiking', 'handshake', 'gift', 'thumbsUp'].map((v) => ({title: v, value: v})),
                  },
                  validation: (rule) => rule.required(),
                }),
              ],
              preview: {select: {title: 'title', subtitle: 'icon'}},
            }),
          ],
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'comboExperience',
      title: 'Combo experience',
      type: 'object',
      fields: [
        defineField({name: 'heading', title: 'Heading', type: 'string', validation: (rule) => rule.required()}),
        defineField({name: 'body', title: 'Body', type: 'text', rows: 3, validation: (rule) => rule.required()}),
        defineField({name: 'cardTitle', title: 'Card title', type: 'string', validation: (rule) => rule.required()}),
        defineField({name: 'cardBody', title: 'Card body', type: 'text', rows: 3, validation: (rule) => rule.required()}),
        defineField({name: 'ctaLabel', title: 'CTA label', type: 'string', validation: (rule) => rule.required()}),
        defineField({name: 'ctaHref', title: 'CTA link', type: 'string', validation: (rule) => rule.required()}),
        defineField({
          name: 'tiles',
          title: 'Tiles',
          type: 'array',
          of: [
            defineArrayMember({
              name: 'comboTile',
              title: 'Tile',
              type: 'object',
              fields: [
                defineField({name: 'title', title: 'Title', type: 'string', validation: (rule) => rule.required()}),
                defineField({name: 'subtitle', title: 'Subtitle', type: 'string', validation: (rule) => rule.required()}),
                defineField({name: 'href', title: 'Link', type: 'string', validation: (rule) => rule.required()}),
                defineField({name: 'image', title: 'Image', type: 'siteImage', validation: (rule) => rule.required()}),
              ],
              preview: {select: {title: 'title', media: 'image'}},
            }),
          ],
        }),
        defineField({name: 'body2', title: 'Second body', type: 'text', rows: 3, validation: (rule) => rule.required()}),
        defineField({name: 'viewToursLabel', title: 'View tours label', type: 'string', validation: (rule) => rule.required()}),
        defineField({name: 'viewToursHref', title: 'View tours link', type: 'string', validation: (rule) => rule.required()}),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'testimonials',
      title: 'Testimonials',
      type: 'object',
      fields: [
        defineField({name: 'heading', title: 'Heading', type: 'string', validation: (rule) => rule.required()}),
        defineField({
          name: 'items',
          title: 'Items',
          type: 'array',
          of: [
            defineArrayMember({
              name: 'testimonial',
              title: 'Testimonial',
              type: 'object',
              fields: [
                defineField({name: 'name', title: 'Name', type: 'string', validation: (rule) => rule.required()}),
                defineField({name: 'timeAgo', title: 'Time ago', type: 'string', validation: (rule) => rule.required()}),
                defineField({name: 'rating', title: 'Rating', type: 'number', validation: (rule) => rule.required().min(1).max(5)}),
                defineField({name: 'quote', title: 'Quote', type: 'text', rows: 4, validation: (rule) => rule.required()}),
              ],
              preview: {select: {title: 'name', subtitle: 'quote'}},
            }),
          ],
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'faq',
      title: 'FAQ',
      type: 'object',
      fields: [
        defineField({name: 'heading', title: 'Heading', type: 'string', validation: (rule) => rule.required()}),
        defineField({
          name: 'tabs',
          title: 'Tabs',
          type: 'array',
          of: [
            defineArrayMember({
              name: 'faqTab',
              title: 'Tab',
              type: 'object',
              fields: [
                defineField({name: 'label', title: 'Label', type: 'string', validation: (rule) => rule.required()}),
                defineField({name: 'faqs', title: 'FAQs', type: 'array', of: [defineArrayMember({type: 'faqItem'})]}),
              ],
              preview: {select: {title: 'label'}},
            }),
          ],
        }),
      ],
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Home Page'}
    },
  },
})
