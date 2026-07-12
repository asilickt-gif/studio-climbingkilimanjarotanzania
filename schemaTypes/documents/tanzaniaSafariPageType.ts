import {defineArrayMember, defineField, defineType} from 'sanity'
import {StarIcon} from '@sanity/icons/Star'

/** Singleton (id: "tanzaniaSafariPage"): /tanzania-safari/ — hero + tour cards. */
export const tanzaniaSafariPageType = defineType({
  name: 'tanzaniaSafariPage',
  title: 'Tanzania Safari Page',
  type: 'document',
  icon: StarIcon,
  fields: [
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
      name: 'cards',
      title: 'Tour cards',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'safariCard',
          title: 'Card',
          type: 'object',
          fields: [
            defineField({name: 'title', title: 'Title', type: 'string', validation: (rule) => rule.required()}),
            defineField({name: 'price', title: 'Price', type: 'string', validation: (rule) => rule.required()}),
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
      return {title: 'Tanzania Safari Page'}
    },
  },
})
