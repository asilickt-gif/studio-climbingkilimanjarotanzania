/**
 * Seed blog content: the blogIndexPage singleton and all blogPost documents
 * from the web app's content/blog.ts. Idempotent.
 *
 * Run from the studio folder:
 *   npx sanity exec scripts/seed-blog.ts --with-user-token
 */
import {getCliClient} from 'sanity/cli'

import {blogIndexData, blogPosts} from '../../climbingkilimanjarotanzania/content/blog'
import type {BlogPostData} from '../../climbingkilimanjarotanzania/types/blog'
import {key, stringToPt} from './lib/pt'
import {uploadImage} from './lib/assets'

const client = getCliClient({apiVersion: '2026-07-01'})

async function postToFields(post: BlogPostData) {
  return {
    seo: {_type: 'seo', title: post.seo.title, description: post.seo.description},
    title: post.title,
    excerpt: post.excerpt,
    publishedDate: post.publishedDate,
    coverImage: await uploadImage(client, post.coverImage),
    intro: post.intro,
    sections: post.sections.map((section) => ({
      _type: 'postSection',
      _key: key(),
      ...(section.heading ? {heading: section.heading} : {}),
      body: stringToPt(section.body),
    })),
    ...(post.faqHeading ? {faqHeading: post.faqHeading} : {}),
    ...(post.faqs && post.faqs.length > 0
      ? {
          faqs: post.faqs.map((faq) => ({
            _type: 'faqItem',
            _key: key(),
            question: faq.question,
            answer: faq.answer,
          })),
        }
      : {}),
  }
}

async function run() {
  await client.createOrReplace({
    _id: 'blogIndexPage',
    _type: 'blogIndexPage',
    seo: {_type: 'seo', title: blogIndexData.seo.title, description: blogIndexData.seo.description},
    heading: blogIndexData.heading,
    intro: blogIndexData.intro,
  })
  console.log('blogIndexPage created/replaced')

  for (const post of blogPosts) {
    const fields = await postToFields(post)
    const existingId = await client.fetch<string | null>(
      '*[_type == "blogPost" && slug.current == $slug && !(_id in path("drafts.**"))][0]._id',
      {slug: post.slug},
    )
    if (existingId) {
      await client.patch(existingId).set(fields).commit()
      console.log(`updated ${post.slug} (${existingId})`)
    } else {
      const created = await client.create({
        _type: 'blogPost',
        slug: {_type: 'slug', current: post.slug},
        ...fields,
      })
      console.log(`created ${post.slug} (${created._id})`)
    }
  }
  console.log('done')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
