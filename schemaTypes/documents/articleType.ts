import {defineArrayMember, defineField, defineType} from 'sanity'
import {DocumentTextIcon} from '@sanity/icons/DocumentText'

/**
 * Unified article type covering the site's three drifted article templates:
 * - "Detail" articles (full-height hero background image) — set heroBackgroundImage
 * - "Guide" articles (inline top image under the heading) — set topImage
 * - "Simple" articles (text only) — set neither image
 * The frontend picks the template per route; fields not used by a template
 * are simply ignored there.
 */
export const articleType = defineType({
  name: 'article',
  title: 'Article',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'URL path segment, e.g. "kilimanjaro-packing-list" for /kilimanjaro-packing-list/',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      description: 'Page H1 (also the hero title on detail articles)',
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'subheading', title: 'Subheading', type: 'string'}),
    defineField({
      name: 'heroBackgroundImage',
      title: 'Hero background image',
      type: 'siteImage',
      description: 'Detail-article template: full-height hero behind the heading',
    }),
    defineField({
      name: 'topImage',
      title: 'Top image',
      type: 'siteImage',
      description: 'Guide-article template: inline image between heading and body',
    }),
    defineField({name: 'intro', title: 'Intro paragraph', type: 'text', rows: 4}),
    defineField({
      name: 'sections',
      title: 'Sections',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'articleSection',
          title: 'Section',
          type: 'object',
          fields: [
            defineField({name: 'heading', title: 'Heading', type: 'string'}),
            defineField({name: 'body', title: 'Body', type: 'richText'}),
            defineField({name: 'table', title: 'Table', type: 'dataTable'}),
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
    defineField({name: 'faqHeading', title: 'FAQ heading', type: 'string'}),
    defineField({
      name: 'faqs',
      title: 'FAQs',
      type: 'array',
      of: [defineArrayMember({type: 'faqItem'})],
    }),
  ],
  preview: {
    select: {title: 'heading', subtitle: 'slug.current', media: 'heroBackgroundImage'},
  },
})
