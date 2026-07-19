import {defineField, defineType} from 'sanity'
import {CommentIcon} from '@sanity/icons/Comment'

/** Singleton (id: "requestQuotePage"): /request-a-quote-tanzania-safari/. */
export const requestQuotePageType = defineType({
  name: 'requestQuotePage',
  title: 'Request a Quote Page',
  type: 'document',
  icon: CommentIcon,
  fields: [
    defineField({name: 'language', type: 'string', readOnly: true, hidden: true}),
    defineField({name: 'seo', title: 'SEO', type: 'seo', validation: (rule) => rule.required()}),
    defineField({
      name: 'hero',
      title: 'Hero',
      type: 'object',
      fields: [
        defineField({name: 'heading', title: 'Heading', type: 'string', validation: (rule) => rule.required()}),
        defineField({name: 'subheading', title: 'Subheading', type: 'string', validation: (rule) => rule.required()}),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'contactInfo',
      title: 'Contact info cards',
      type: 'object',
      fields: [
        defineField({name: 'address', title: 'Address', type: 'string', validation: (rule) => rule.required()}),
        defineField({name: 'officeHours', title: 'Office hours', type: 'string', validation: (rule) => rule.required()}),
        defineField({
          name: 'whatsappHref',
          title: 'WhatsApp link',
          type: 'string',
          description: 'e.g. https://wa.me/255767140150',
          validation: (rule) => rule.required(),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'intro', title: 'Intro paragraph', type: 'text', rows: 4, validation: (rule) => rule.required()}),
    defineField({name: 'howToHeading', title: '"How to" heading', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'howToBody', title: '"How to" body', type: 'richText', validation: (rule) => rule.required()}),
  ],
  preview: {
    prepare() {
      return {title: 'Request a Quote Page'}
    },
  },
})
