import {defineArrayMember, defineField, defineType} from 'sanity'
import {UsersIcon} from '@sanity/icons/Users'

/** Singleton (id: "aboutPage"): /about-asili-explorer/. */
export const aboutPageType = defineType({
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  icon: UsersIcon,
  fields: [
    defineField({name: 'language', type: 'string', readOnly: true, hidden: true}),
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
      name: 'intro',
      title: 'Intro',
      type: 'object',
      fields: [
        defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string', validation: (rule) => rule.required()}),
        defineField({
          name: 'sections',
          title: 'Sections',
          type: 'array',
          of: [
            defineArrayMember({
              name: 'aboutSection',
              title: 'Section',
              type: 'object',
              fields: [
                defineField({name: 'heading', title: 'Heading', type: 'string'}),
                defineField({name: 'body', title: 'Body', type: 'text', rows: 6, validation: (rule) => rule.required()}),
              ],
              preview: {
                select: {title: 'heading'},
                prepare({title}) {
                  return {title: title || '(no heading)'}
                },
              },
            }),
          ],
          validation: (rule) => rule.min(1),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'bodyImage', title: 'Body image', type: 'siteImage', validation: (rule) => rule.required()}),
    defineField({
      name: 'fleetSection',
      title: 'Fleet section',
      type: 'object',
      fields: [
        defineField({name: 'heading', title: 'Heading', type: 'string'}),
        defineField({name: 'body', title: 'Body', type: 'text', rows: 6, validation: (rule) => rule.required()}),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'quote', title: 'Closing quote', type: 'text', rows: 3, validation: (rule) => rule.required()}),
    defineField({name: 'ctaHeading', title: 'CTA heading', type: 'string', validation: (rule) => rule.required()}),
  ],
  preview: {
    prepare() {
      return {title: 'About Page'}
    },
  },
})
