import {defineArrayMember, defineField, defineType} from 'sanity'
import {EnvelopeIcon} from '@sanity/icons/Envelope'

/** Singleton (id: "contactPage"): /contact-us/. Form field structure is
 * code-owned; only its heading strip and route dropdown options live here. */
export const contactPageType = defineType({
  name: 'contactPage',
  title: 'Contact Page',
  type: 'document',
  icon: EnvelopeIcon,
  fields: [
    defineField({name: 'language', type: 'string', readOnly: true, hidden: true}),
    defineField({name: 'seo', title: 'SEO', type: 'seo', validation: (rule) => rule.required()}),
    defineField({name: 'pageTitle', title: 'Page title', type: 'string', validation: (rule) => rule.required()}),
    defineField({
      name: 'hero',
      title: 'Hero',
      type: 'object',
      fields: [
        defineField({name: 'backgroundImage', title: 'Background image', type: 'siteImage', validation: (rule) => rule.required()}),
        defineField({name: 'heading', title: 'Heading', type: 'string', validation: (rule) => rule.required()}),
        defineField({name: 'subheading', title: 'Subheading', type: 'string', validation: (rule) => rule.required()}),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'intro',
      title: 'Intro',
      type: 'object',
      fields: [
        defineField({name: 'heading', title: 'Heading', type: 'string', validation: (rule) => rule.required()}),
        defineField({name: 'body', title: 'Body', type: 'text', rows: 5, validation: (rule) => rule.required()}),
        defineField({name: 'contactLabel', title: 'Contact label', type: 'string', validation: (rule) => rule.required()}),
        defineField({name: 'location', title: 'Location', type: 'string', validation: (rule) => rule.required()}),
        defineField({name: 'imageLeft', title: 'Left image', type: 'siteImage', validation: (rule) => rule.required()}),
        defineField({name: 'imageRight', title: 'Right image', type: 'siteImage', validation: (rule) => rule.required()}),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'form',
      title: 'Enquiry form strip',
      type: 'object',
      fields: [
        defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string', validation: (rule) => rule.required()}),
        defineField({name: 'heading', title: 'Heading', type: 'string', validation: (rule) => rule.required()}),
        defineField({
          name: 'routeOptions',
          title: 'Route dropdown options',
          type: 'array',
          of: [defineArrayMember({type: 'string'})],
          validation: (rule) => rule.min(1),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Contact Page'}
    },
  },
})
