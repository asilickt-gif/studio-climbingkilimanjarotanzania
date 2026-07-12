import {defineArrayMember, defineField, defineType} from 'sanity'
import {StackIcon} from '@sanity/icons/Stack'

const ctaFields = [
  defineField({name: 'heading', title: 'Heading', type: 'string', validation: (rule: any) => rule.required()}),
  defineField({name: 'body', title: 'Body', type: 'text', rows: 3, validation: (rule: any) => rule.required()}),
  defineField({name: 'ctaLabel', title: 'CTA label', type: 'string', validation: (rule: any) => rule.required()}),
]

const badgeMember = (name: string) =>
  defineArrayMember({
    name,
    title: 'Badge',
    type: 'object',
    fields: [
      defineField({name: 'title', title: 'Title', type: 'string', validation: (rule) => rule.required()}),
      defineField({name: 'description', title: 'Description', type: 'string', validation: (rule) => rule.required()}),
    ],
    preview: {select: {title: 'title', subtitle: 'description'}},
  })

/**
 * Singleton (id: "sharedTripContent"): promotional strips shared across the
 * routes / packages / combo / safari page groups — trust badges, CTA bands,
 * guide promos, review stats, testimonials, and hero images. Anchor-nav ids,
 * form options, and tier-image keys stay code-owned (editing them requires
 * code changes).
 */
export const sharedTripContentType = defineType({
  name: 'sharedTripContent',
  title: 'Shared Trip Content',
  type: 'document',
  icon: StackIcon,
  fields: [
    defineField({
      name: 'routeTrustBadges',
      title: 'Route trust badges',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'routeTrustBadge',
          title: 'Badge',
          type: 'object',
          fields: [
            defineField({name: 'title', title: 'Title', type: 'string', validation: (rule) => rule.required()}),
            defineField({name: 'subtitle', title: 'Subtitle', type: 'string', validation: (rule) => rule.required()}),
            defineField({name: 'description', title: 'Description', type: 'text', rows: 3, validation: (rule) => rule.required()}),
          ],
          preview: {select: {title: 'title', subtitle: 'subtitle'}},
        }),
      ],
    }),
    defineField({
      name: 'routeCtaBand',
      title: 'Route CTA band',
      type: 'object',
      fields: [
        defineField({name: 'heading', title: 'Heading', type: 'string', validation: (rule) => rule.required()}),
        defineField({name: 'body', title: 'Body', type: 'text', rows: 3, validation: (rule) => rule.required()}),
        defineField({
          name: 'buttons',
          title: 'Buttons',
          type: 'array',
          of: [
            defineArrayMember({
              name: 'ctaButton',
              title: 'Button',
              type: 'object',
              fields: [
                defineField({name: 'label', title: 'Label', type: 'string', validation: (rule) => rule.required()}),
                defineField({name: 'href', title: 'Link', type: 'string', validation: (rule) => rule.required()}),
                defineField({
                  name: 'variant',
                  title: 'Variant',
                  type: 'string',
                  options: {list: ['solid', 'outline'], layout: 'radio'},
                  validation: (rule) => rule.required(),
                }),
              ],
              preview: {select: {title: 'label', subtitle: 'variant'}},
            }),
          ],
        }),
        defineField({name: 'image', title: 'Background image', type: 'siteImage', validation: (rule) => rule.required()}),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'hubCtaBandImage', title: 'Hub CTA band image', type: 'siteImage', validation: (rule) => rule.required()}),
    defineField({
      name: 'routeGuidePromos',
      title: 'Route guide promos',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'guidePromo',
          title: 'Promo',
          type: 'object',
          fields: [
            defineField({
              name: 'color',
              title: 'Card color',
              type: 'string',
              options: {
                list: [
                  {title: 'Teal (primary)', value: 'bg-primary'},
                  {title: 'Orange (secondary)', value: 'bg-secondary'},
                  {title: 'Clay', value: 'bg-[#a05a52]'},
                ],
              },
              validation: (rule) => rule.required(),
            }),
            defineField({name: 'heading', title: 'Heading', type: 'string', validation: (rule) => rule.required()}),
            defineField({name: 'body', title: 'Body', type: 'text', rows: 3, validation: (rule) => rule.required()}),
            defineField({name: 'ctaLabel', title: 'CTA label', type: 'string', validation: (rule) => rule.required()}),
            defineField({name: 'href', title: 'Link', type: 'string', validation: (rule) => rule.required()}),
          ],
          preview: {select: {title: 'heading'}},
        }),
      ],
    }),
    defineField({
      name: 'routeRelatedGuides',
      title: 'Route related guides',
      type: 'array',
      of: [defineArrayMember({type: 'navLink'})],
    }),
    defineField({
      name: 'routeReviewStats',
      title: 'Route review stats',
      type: 'object',
      fields: [
        defineField({
          name: 'tripAdvisor',
          title: 'TripAdvisor',
          type: 'object',
          fields: [
            defineField({name: 'heading', title: 'Heading', type: 'string', validation: (rule) => rule.required()}),
            defineField({name: 'subheading', title: 'Subheading', type: 'string', validation: (rule) => rule.required()}),
            defineField({name: 'body', title: 'Body', type: 'text', rows: 3, validation: (rule) => rule.required()}),
          ],
        }),
        defineField({
          name: 'google',
          title: 'Google',
          type: 'object',
          fields: [
            defineField({name: 'subheading', title: 'Subheading', type: 'string', validation: (rule) => rule.required()}),
            defineField({name: 'body', title: 'Body', type: 'text', rows: 3, validation: (rule) => rule.required()}),
          ],
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'routeTestimonials',
      title: 'Route testimonials',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'routeTestimonial',
          title: 'Testimonial',
          type: 'object',
          fields: [
            defineField({name: 'name', title: 'Name', type: 'string', validation: (rule) => rule.required()}),
            defineField({name: 'timeAgo', title: 'Time ago', type: 'string', validation: (rule) => rule.required()}),
            defineField({name: 'heading', title: 'Heading', type: 'string', validation: (rule) => rule.required()}),
            defineField({name: 'quote', title: 'Quote', type: 'richText', validation: (rule) => rule.required()}),
          ],
          preview: {select: {title: 'name', subtitle: 'heading'}},
        }),
      ],
    }),
    defineField({
      name: 'routeGuestReviews',
      title: 'Route guest reviews',
      type: 'object',
      fields: [
        defineField({name: 'heading', title: 'Heading', type: 'string', validation: (rule) => rule.required()}),
        defineField({
          name: 'items',
          title: 'Reviews',
          type: 'array',
          of: [
            defineArrayMember({
              name: 'guestReview',
              title: 'Review',
              type: 'object',
              fields: [
                defineField({name: 'name', title: 'Name', type: 'string', validation: (rule) => rule.required()}),
                defineField({name: 'summitDate', title: 'Summit date line', type: 'string', validation: (rule) => rule.required()}),
                defineField({name: 'heading', title: 'Heading', type: 'string', validation: (rule) => rule.required()}),
                defineField({name: 'quote', title: 'Quote', type: 'text', rows: 4, validation: (rule) => rule.required()}),
              ],
              preview: {select: {title: 'name', subtitle: 'heading'}},
            }),
          ],
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'routePackagesCta',
      title: 'Route packages CTA',
      type: 'object',
      fields: [
        ...ctaFields,
        defineField({name: 'href', title: 'Link', type: 'string', validation: (rule) => rule.required()}),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'packageTrustBadges', title: 'Package trust badges', type: 'array', of: [badgeMember('packageBadge')]}),
    defineField({name: 'packageStandardIntro', title: 'Package standard intro', type: 'text', rows: 3, validation: (rule) => rule.required()}),
    defineField({name: 'packageInterestedCta', title: 'Package "interested" CTA', type: 'object', fields: ctaFields, validation: (rule) => rule.required()}),
    defineField({name: 'packageExpertCta', title: 'Package "expert" CTA', type: 'object', fields: ctaFields, validation: (rule) => rule.required()}),
    defineField({name: 'packageHeroImage', title: 'Package hero image', type: 'siteImage', validation: (rule) => rule.required()}),
    defineField({name: 'comboTrustBadges', title: 'Combo trust badges', type: 'array', of: [badgeMember('comboBadge')]}),
    defineField({name: 'comboPriceDisclaimer', title: 'Combo price disclaimer', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'comboStandardIntro', title: 'Combo standard intro', type: 'text', rows: 3, validation: (rule) => rule.required()}),
    defineField({name: 'comboHeroImage', title: 'Combo hero image', type: 'siteImage', validation: (rule) => rule.required()}),
    defineField({name: 'safariTrustBadges', title: 'Safari trust badges', type: 'array', of: [badgeMember('safariBadge')]}),
    defineField({name: 'safariInterestedCta', title: 'Safari "interested" CTA', type: 'object', fields: ctaFields, validation: (rule) => rule.required()}),
  ],
  preview: {
    prepare() {
      return {title: 'Shared Trip Content'}
    },
  },
})
