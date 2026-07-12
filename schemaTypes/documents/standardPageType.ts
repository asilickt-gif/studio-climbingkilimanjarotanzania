import {defineArrayMember, defineField, defineType} from 'sanity'
import {DocumentIcon} from '@sanity/icons/Document'

/**
 * Simple heading + sections pages: the three legal pages and
 * why-travel-with-us. Legal pages map pageTitle -> hero.heading and use
 * the intro field; why-travel-with-us uses the hero background image.
 */
export const standardPageType = defineType({
  name: 'standardPage',
  title: 'Standard Page',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'URL path segment, e.g. "privacy-policy" for /privacy-policy/',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'hero',
      title: 'Hero',
      type: 'object',
      fields: [
        defineField({
          name: 'heading',
          title: 'Heading',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
        defineField({name: 'subheading', title: 'Subheading', type: 'string'}),
        defineField({name: 'backgroundImage', title: 'Background image', type: 'siteImage'}),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'intro',
      title: 'Intro paragraph',
      type: 'text',
      rows: 4,
      description: 'Optional intro shown above the sections (used by the legal pages)',
    }),
    defineField({
      name: 'sections',
      title: 'Sections',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'pageSection',
          title: 'Section',
          type: 'object',
          fields: [
            defineField({name: 'heading', title: 'Heading', type: 'string'}),
            defineField({
              name: 'body',
              title: 'Body',
              type: 'richText',
              validation: (rule) => rule.required(),
            }),
            defineField({name: 'image', title: 'Image', type: 'siteImage'}),
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
  preview: {
    select: {title: 'hero.heading', subtitle: 'slug.current'},
  },
})
