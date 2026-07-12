import {defineField, defineType} from 'sanity'
import {LinkIcon} from '@sanity/icons/Link'

export const navLinkType = defineType({
  name: 'navLink',
  title: 'Link',
  type: 'object',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'href',
      title: 'URL',
      type: 'string',
      description: 'Site-relative (/contact-us/) or absolute (https://…) URL',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {title: 'label', subtitle: 'href'},
  },
})
