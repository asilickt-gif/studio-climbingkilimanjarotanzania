import {defineArrayMember, defineField, defineType} from 'sanity'
import {CalendarIcon} from '@sanity/icons/Calendar'

/**
 * One itinerary day, shared by every trip category. Unifies the legacy
 * shapes: packages/combos used plain string paragraphs + fixed lodges,
 * safaris used rich-text paragraphs + accommodation tiers. Fields not
 * relevant to a category are simply left empty.
 */
export const itineraryDayType = defineType({
  name: 'itineraryDay',
  title: 'Itinerary day',
  type: 'object',
  icon: CalendarIcon,
  fields: [
    defineField({
      name: 'day',
      title: 'Day number',
      type: 'number',
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      description: 'e.g. "Machame Gate to Machame Camp"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Location line',
      type: 'string',
      description: 'e.g. "Machame Gate 1,800m → Machame Camp 3,000m"',
    }),
    defineField({
      name: 'meta',
      title: 'Meta lines',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      description: 'Short facts shown under the label (elevation gain, distance, habitat…)',
    }),
    defineField({name: 'body', title: 'Description', type: 'richText'}),
    defineField({name: 'overnightStay', title: 'Overnight stay', type: 'string'}),
    defineField({name: 'image', title: 'Photo', type: 'siteImage'}),
    defineField({name: 'secondImage', title: 'Second photo (overnight stay)', type: 'siteImage'}),
    defineField({
      name: 'lodgeOptions',
      title: 'Lodge options',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'lodgeOption',
          title: 'Lodge option',
          type: 'object',
          fields: [
            defineField({name: 'name', title: 'Name', type: 'string', validation: (rule) => rule.required()}),
            defineField({name: 'image', title: 'Photo', type: 'siteImage', validation: (rule) => rule.required()}),
          ],
          preview: {select: {title: 'name', media: 'image'}},
        }),
      ],
      description: 'Packages/combos: named lodge choices for this night',
    }),
    defineField({
      name: 'accommodationTiers',
      title: 'Accommodation tiers',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      description: 'Safaris: Budget / Mid-range / Luxury options for this night',
    }),
  ],
  preview: {
    select: {day: 'day', title: 'label', media: 'image'},
    prepare({day, title, media}) {
      return {title: `Day ${day}: ${title}`, media}
    },
  },
})
