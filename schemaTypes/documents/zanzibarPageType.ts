import {defineArrayMember, defineField, defineType} from 'sanity'
import {SunIcon} from '@sanity/icons/Sun'

/** Singleton (id: "zanzibarPage"): /zanzibar/ — hero + tour card grid. */
export const zanzibarPageType = defineType({
  name: 'zanzibarPage',
  title: 'Zanzibar Page',
  type: 'document',
  icon: SunIcon,
  fields: [
    defineField({name: 'seo', title: 'SEO', type: 'seo', validation: (rule) => rule.required()}),
    defineField({
      name: 'hero',
      title: 'Hero',
      type: 'object',
      fields: [
        defineField({name: 'heading', title: 'Heading', type: 'string', validation: (rule) => rule.required()}),
        defineField({name: 'backgroundImage', title: 'Background image', type: 'siteImage', validation: (rule) => rule.required()}),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'cards',
      title: 'Tour cards',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'zanzibarCard',
          title: 'Card',
          type: 'object',
          fields: [
            defineField({name: 'title', title: 'Title', type: 'string', validation: (rule) => rule.required()}),
            defineField({name: 'price', title: 'Price', type: 'string', validation: (rule) => rule.required()}),
            defineField({name: 'location', title: 'Location', type: 'string', validation: (rule) => rule.required()}),
            defineField({name: 'image', title: 'Image', type: 'siteImage', validation: (rule) => rule.required()}),
          ],
          preview: {select: {title: 'title', subtitle: 'price', media: 'image'}},
        }),
      ],
      validation: (rule) => rule.min(1),
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Zanzibar Page'}
    },
  },
})
