import {defineArrayMember, defineField, defineType} from 'sanity'

/**
 * Body copy: Portable Text deliberately restricted to what the site's
 * RichText renderer supports — normal paragraphs, bullet lists, bold,
 * and inline links. Keep this in sync with the web app's PT adapters
 * (lib/sanity/adapters.ts), which round-trip it to legacy prop shapes.
 */
export const richTextType = defineType({
  name: 'richText',
  title: 'Rich text',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [{title: 'Normal', value: 'normal'}],
      lists: [{title: 'Bullet', value: 'bullet'}],
      marks: {
        decorators: [
          {title: 'Bold', value: 'strong'},
          {title: 'Accent (brand color)', value: 'accent'},
        ],
        annotations: [
          defineArrayMember({
            name: 'link',
            title: 'Link',
            type: 'object',
            fields: [
              defineField({
                name: 'href',
                title: 'URL',
                type: 'string',
                description: 'Absolute (https://…) or site-relative (/contact-us/) URL',
                validation: (rule) => rule.required(),
              }),
            ],
          }),
        ],
      },
    }),
  ],
})
