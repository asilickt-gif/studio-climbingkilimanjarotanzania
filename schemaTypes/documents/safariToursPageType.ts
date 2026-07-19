import {defineArrayMember, defineField, defineType} from 'sanity'
import {SparklesIcon} from '@sanity/icons/Sparkles'

/** Singleton (id: "safariToursPage"): /tanzania-safari-tours/ — the safari
 * hub with tour styles, 12-month season guide, and why-us features. */
export const safariToursPageType = defineType({
  name: 'safariToursPage',
  title: 'Safari Tours Page',
  type: 'document',
  icon: SparklesIcon,
  fields: [
    defineField({name: 'language', type: 'string', readOnly: true, hidden: true}),
    defineField({name: 'seo', title: 'SEO', type: 'seo', validation: (rule) => rule.required()}),
    defineField({
      name: 'hero',
      title: 'Hero',
      type: 'object',
      fields: [
        defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string', validation: (rule) => rule.required()}),
        defineField({name: 'heading', title: 'Heading', type: 'string', validation: (rule) => rule.required()}),
        defineField({name: 'backgroundImage', title: 'Background image', type: 'siteImage', validation: (rule) => rule.required()}),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'intro',
      title: 'Intro',
      type: 'object',
      fields: [
        defineField({name: 'title', title: 'Title', type: 'string', validation: (rule) => rule.required()}),
        defineField({name: 'body', title: 'Body', type: 'text', rows: 5, validation: (rule) => rule.required()}),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'whereToGo',
      title: 'Where to go',
      type: 'object',
      fields: [
        defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string', validation: (rule) => rule.required()}),
        defineField({name: 'heading', title: 'Heading', type: 'string', validation: (rule) => rule.required()}),
        defineField({name: 'body', title: 'Body', type: 'text', rows: 5, validation: (rule) => rule.required()}),
        defineField({name: 'image', title: 'Image', type: 'siteImage', validation: (rule) => rule.required()}),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tourStyles',
      title: 'Tour styles',
      type: 'object',
      fields: [
        defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string', validation: (rule) => rule.required()}),
        defineField({name: 'heading', title: 'Heading', type: 'string', validation: (rule) => rule.required()}),
        defineField({
          name: 'styles',
          title: 'Styles',
          type: 'array',
          of: [
            defineArrayMember({
              name: 'tourStyle',
              title: 'Style',
              type: 'object',
              fields: [
                defineField({name: 'label', title: 'Label', type: 'string', validation: (rule) => rule.required()}),
                defineField({name: 'image', title: 'Image', type: 'siteImage', validation: (rule) => rule.required()}),
              ],
              preview: {select: {title: 'label', media: 'image'}},
            }),
          ],
          validation: (rule) => rule.min(1),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'seasons',
      title: 'Season guide',
      type: 'object',
      fields: [
        defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string', validation: (rule) => rule.required()}),
        defineField({name: 'heading', title: 'Heading', type: 'string', validation: (rule) => rule.required()}),
        defineField({name: 'intro', title: 'Intro', type: 'text', rows: 3, validation: (rule) => rule.required()}),
        defineField({
          name: 'months',
          title: 'Months',
          type: 'array',
          of: [
            defineArrayMember({
              name: 'seasonMonth',
              title: 'Month',
              type: 'object',
              fields: [
                defineField({name: 'month', title: 'Month', type: 'string', validation: (rule) => rule.required()}),
                defineField({name: 'body', title: 'Body', type: 'text', rows: 4, validation: (rule) => rule.required()}),
              ],
              preview: {select: {title: 'month'}},
            }),
          ],
          validation: (rule) => rule.length(12),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'whyTravelWithUs',
      title: 'Why travel with us',
      type: 'object',
      fields: [
        defineField({name: 'heading', title: 'Heading', type: 'string', validation: (rule) => rule.required()}),
        defineField({name: 'intro', title: 'Intro', type: 'text', rows: 3, validation: (rule) => rule.required()}),
        defineField({
          name: 'features',
          title: 'Features',
          type: 'array',
          of: [
            defineArrayMember({
              name: 'safariFeature',
              title: 'Feature',
              type: 'object',
              fields: [
                defineField({name: 'description', title: 'Description', type: 'text', rows: 3, validation: (rule) => rule.required()}),
              ],
              preview: {select: {title: 'description'}},
            }),
          ],
          validation: (rule) => rule.min(1),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Safari Tours Page'}
    },
  },
})
