import {defineArrayMember, defineField, defineType} from 'sanity'
import {EditIcon} from '@sanity/icons/Edit'
import {isSlugUniquePerLanguage} from '../lib/localizedSlug'

export const blogPostType = defineType({
  name: 'blogPost',
  title: 'Blog Post',
  type: 'document',
  icon: EditIcon,
  fields: [
    defineField({name: 'language', type: 'string', readOnly: true, hidden: true}),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'URL path segment — posts live at the site root, e.g. /my-post-slug/',
      options: {isUnique: isSlugUniquePerLanguage},
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'seo', title: 'SEO', type: 'seo', validation: (rule) => rule.required()}),
    defineField({name: 'title', title: 'Title', type: 'string', validation: (rule) => rule.required()}),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      description: 'Shown on the blog index card',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'publishedDate',
      title: 'Published date',
      type: 'date',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover image',
      type: 'siteImage',
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'intro', title: 'Intro paragraph', type: 'text', rows: 4}),
    defineField({
      name: 'sections',
      title: 'Sections',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'postSection',
          title: 'Section',
          type: 'object',
          fields: [
            defineField({name: 'heading', title: 'Heading', type: 'string'}),
            defineField({name: 'body', title: 'Body', type: 'richText', validation: (rule) => rule.required()}),
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
  orderings: [
    {
      title: 'Published date, newest first',
      name: 'publishedDateDesc',
      by: [{field: 'publishedDate', direction: 'desc'}],
    },
  ],
  preview: {
    select: {title: 'title', subtitle: 'publishedDate', media: 'coverImage'},
  },
})
