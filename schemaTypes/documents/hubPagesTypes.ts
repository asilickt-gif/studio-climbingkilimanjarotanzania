import {defineArrayMember, defineField, defineType} from 'sanity'
import {ThLargeIcon} from '@sanity/icons/ThLarge'

/** Singleton (id: "routesHubPage"): /kilimanjaro-routes/. */
export const routesHubPageType = defineType({
  name: 'routesHubPage',
  title: 'Routes Hub Page',
  type: 'document',
  icon: ThLargeIcon,
  fields: [
    defineField({name: 'seo', title: 'SEO', type: 'seo', validation: (rule) => rule.required()}),
    defineField({
      name: 'hero',
      title: 'Hero',
      type: 'object',
      fields: [
        defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string', validation: (rule) => rule.required()}),
        defineField({name: 'heading', title: 'Heading', type: 'string', validation: (rule) => rule.required()}),
        defineField({name: 'locationPill', title: 'Location pill', type: 'string', validation: (rule) => rule.required()}),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'ctaBandButtons',
      title: 'CTA band buttons',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'ctaButton',
          title: 'Button',
          type: 'object',
          fields: [
            defineField({name: 'label', title: 'Label', type: 'string', validation: (rule) => rule.required()}),
            defineField({name: 'href', title: 'Link', type: 'string', validation: (rule) => rule.required()}),
            defineField({
              name: 'variant',
              title: 'Variant',
              type: 'string',
              options: {list: ['solid', 'outline'], layout: 'radio'},
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {select: {title: 'label', subtitle: 'variant'}},
        }),
      ],
    }),
    defineField({
      name: 'promoSection',
      title: 'Promo section',
      type: 'object',
      fields: [
        defineField({name: 'heading', title: 'Heading', type: 'string', validation: (rule) => rule.required()}),
        defineField({name: 'exploreLabel', title: 'Explore label', type: 'string', validation: (rule) => rule.required()}),
        defineField({name: 'exploreHref', title: 'Explore link', type: 'string', validation: (rule) => rule.required()}),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'tabsHeading', title: 'Tabs heading', type: 'string', validation: (rule) => rule.required()}),
    defineField({
      name: 'cards',
      title: 'Route cards',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'routeHubCard',
          title: 'Card',
          type: 'object',
          fields: [
            defineField({name: 'title', title: 'Title', type: 'string', validation: (rule) => rule.required()}),
            defineField({name: 'routeSlug', title: 'Route slug', type: 'string', description: 'e.g. machame-route', validation: (rule) => rule.required()}),
            defineField({name: 'summary', title: 'Summary', type: 'text', rows: 4, validation: (rule) => rule.required()}),
            defineField({name: 'image', title: 'Image', type: 'siteImage', validation: (rule) => rule.required()}),
          ],
          preview: {select: {title: 'title', media: 'image'}},
        }),
      ],
    }),
    defineField({
      name: 'testimonials',
      title: 'Hub testimonials',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'hubTestimonial',
          title: 'Testimonial',
          type: 'object',
          fields: [
            defineField({name: 'name', title: 'Name', type: 'string', validation: (rule) => rule.required()}),
            defineField({name: 'date', title: 'Date', type: 'string', validation: (rule) => rule.required()}),
            defineField({name: 'quote', title: 'Quote', type: 'text', rows: 4, validation: (rule) => rule.required()}),
          ],
          preview: {select: {title: 'name'}},
        }),
      ],
    }),
    defineField({name: 'faqHeading', title: 'FAQ heading', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'faqSubheading', title: 'FAQ subheading', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'faqIntro', title: 'FAQ intro', type: 'text', rows: 3, validation: (rule) => rule.required()}),
    defineField({name: 'faqs', title: 'FAQs', type: 'array', of: [defineArrayMember({type: 'faqItem'})]}),
  ],
  preview: {
    prepare() {
      return {title: 'Routes Hub Page'}
    },
  },
})

/** Singleton (id: "packagesHubPage"): /kilimanjaro-packages/. */
export const packagesHubPageType = defineType({
  name: 'packagesHubPage',
  title: 'Packages Hub Page',
  type: 'document',
  icon: ThLargeIcon,
  fields: [
    defineField({
      name: 'hero',
      title: 'Hero',
      type: 'object',
      fields: [
        defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string', validation: (rule) => rule.required()}),
        defineField({name: 'heading', title: 'Heading', type: 'string', validation: (rule) => rule.required()}),
        defineField({name: 'locationPill', title: 'Location pill', type: 'string', validation: (rule) => rule.required()}),
        defineField({name: 'tagline', title: 'Tagline', type: 'string', validation: (rule) => rule.required()}),
        defineField({name: 'introHeading', title: 'Intro heading', type: 'string', validation: (rule) => rule.required()}),
        defineField({name: 'intro', title: 'Intro', type: 'text', rows: 4, validation: (rule) => rule.required()}),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'cards',
      title: 'Package cards',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'packageHubCard',
          title: 'Card',
          type: 'object',
          fields: [
            defineField({name: 'title', title: 'Title', type: 'string', validation: (rule) => rule.required()}),
            defineField({name: 'packageSlug', title: 'Package slug', type: 'string', description: 'e.g. 7-days-machame-route', validation: (rule) => rule.required()}),
            defineField({name: 'nights', title: 'Nights label', type: 'string', validation: (rule) => rule.required()}),
            defineField({name: 'summary', title: 'Summary', type: 'text', rows: 3, validation: (rule) => rule.required()}),
            defineField({name: 'image', title: 'Image', type: 'siteImage', validation: (rule) => rule.required()}),
          ],
          preview: {select: {title: 'title', media: 'image'}},
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Packages Hub Page'}
    },
  },
})

/** Singleton (id: "comboHubPage"): /combo/. */
export const comboHubPageType = defineType({
  name: 'comboHubPage',
  title: 'Combo Hub Page',
  type: 'document',
  icon: ThLargeIcon,
  fields: [
    defineField({
      name: 'intro',
      title: 'Intro',
      type: 'object',
      fields: [
        defineField({name: 'heading', title: 'Heading', type: 'string', validation: (rule) => rule.required()}),
        defineField({name: 'body', title: 'Body', type: 'richText', validation: (rule) => rule.required()}),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'cards',
      title: 'Combo cards',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'comboHubCard',
          title: 'Card',
          type: 'object',
          fields: [
            defineField({name: 'title', title: 'Title', type: 'string', validation: (rule) => rule.required()}),
            defineField({name: 'href', title: 'Link', type: 'string', description: 'Leave empty for cards without a page (they link to contact)'}),
            defineField({name: 'nights', title: 'Nights label', type: 'string', validation: (rule) => rule.required()}),
            defineField({name: 'summary', title: 'Summary', type: 'text', rows: 3, validation: (rule) => rule.required()}),
            defineField({name: 'image', title: 'Image', type: 'siteImage', validation: (rule) => rule.required()}),
          ],
          preview: {select: {title: 'title', media: 'image'}},
        }),
      ],
    }),
    defineField({
      name: 'cta',
      title: 'Bottom CTA',
      type: 'object',
      fields: [
        defineField({name: 'label', title: 'Label', type: 'string', validation: (rule) => rule.required()}),
        defineField({name: 'href', title: 'Link', type: 'string', validation: (rule) => rule.required()}),
      ],
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Combo Hub Page'}
    },
  },
})
