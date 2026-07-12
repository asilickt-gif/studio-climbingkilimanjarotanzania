/**
 * Seed the unified `article` documents from the web app's three legacy
 * article content files plus mount-kilimanjaro:
 *  - content/articles.ts        (13 "detail" articles: hero background image)
 *  - content/mount-kilimanjaro.ts (1 detail article)
 *  - content/guide-articles.ts  (7 "guide" articles: inline top image)
 *  - content/simple-articles.ts (2 text-only articles)
 * Idempotent: upserts by slug; image uploads dedupe by path/content hash.
 *
 * Run from the studio folder:
 *   npx sanity exec scripts/seed-articles.ts --with-user-token
 */
import {getCliClient} from 'sanity/cli'

import {articlePages} from '../../climbingkilimanjarotanzania/content/articles'
import {mountKilimanjaroData} from '../../climbingkilimanjarotanzania/content/mount-kilimanjaro'
import {guideArticlePages} from '../../climbingkilimanjarotanzania/content/guide-articles'
import {simpleArticlePages} from '../../climbingkilimanjarotanzania/content/simple-articles'
import type {ArticleDetailData} from '../../climbingkilimanjarotanzania/types/article'
import type {GuideArticleData} from '../../climbingkilimanjarotanzania/types/guide-article'
import type {SimpleArticleData} from '../../climbingkilimanjarotanzania/types/simple-article'
import {key, segmentParagraphsToPt, stringToPt} from './lib/pt'
import {uploadImage} from './lib/assets'

const client = getCliClient({apiVersion: '2026-07-01'})

function tableToDoc(table?: {columns: string[]; rows: string[][]}) {
  if (!table) return undefined
  return {
    _type: 'dataTable',
    columns: table.columns,
    rows: table.rows.map((cells) => ({_type: 'tableRow', _key: key(), cells})),
  }
}

function faqsToDoc(faqs?: {question: string; answer: string}[]) {
  if (!faqs || faqs.length === 0) return undefined
  return faqs.map((faq) => ({
    _type: 'faqItem',
    _key: key(),
    question: faq.question,
    answer: faq.answer,
  }))
}

async function detailToFields(data: ArticleDetailData) {
  return {
    seo: {_type: 'seo', title: data.seo.title, description: data.seo.description},
    heading: data.hero.title,
    heroBackgroundImage: await uploadImage(client, data.hero.backgroundImage),
    intro: data.intro,
    sections: await Promise.all(
      data.sections.map(async (section) => ({
        _type: 'articleSection',
        _key: key(),
        heading: section.heading,
        body: stringToPt(section.body),
        ...(tableToDoc(section.table) ? {table: tableToDoc(section.table)} : {}),
        ...(section.image ? {image: await uploadImage(client, section.image)} : {}),
      })),
    ),
  }
}

async function guideToFields(data: GuideArticleData) {
  return {
    seo: {_type: 'seo', title: data.seo.title, description: data.seo.description},
    heading: data.heading,
    ...(data.heroImage ? {topImage: await uploadImage(client, data.heroImage)} : {}),
    intro: data.intro,
    sections: data.sections.map((section) => ({
      _type: 'articleSection',
      _key: key(),
      heading: section.heading,
      ...(section.body ? {body: stringToPt(section.body)} : {}),
      ...(tableToDoc(section.table) ? {table: tableToDoc(section.table)} : {}),
    })),
    ...(data.faqHeading ? {faqHeading: data.faqHeading} : {}),
    ...(faqsToDoc(data.faqs) ? {faqs: faqsToDoc(data.faqs)} : {}),
  }
}

function simpleToFields(data: SimpleArticleData) {
  return {
    seo: {_type: 'seo', title: data.seo.title, description: data.seo.description},
    heading: data.heading,
    ...(data.subheading ? {subheading: data.subheading} : {}),
    sections: [
      {
        _type: 'articleSection',
        _key: key(),
        body: segmentParagraphsToPt(data.paragraphs),
      },
    ],
  }
}

async function upsertArticle(slug: string, fields: Record<string, unknown>) {
  const existingId = await client.fetch<string | null>(
    '*[_type == "article" && slug.current == $slug && !(_id in path("drafts.**"))][0]._id',
    {slug},
  )
  if (existingId) {
    await client.patch(existingId).set(fields).commit()
    console.log(`updated ${slug} (${existingId})`)
  } else {
    const created = await client.create({
      _type: 'article',
      slug: {_type: 'slug', current: slug},
      ...fields,
    })
    console.log(`created ${slug} (${created._id})`)
  }
}

async function run() {
  for (const data of [...articlePages, mountKilimanjaroData]) {
    await upsertArticle(data.slug, await detailToFields(data))
  }
  for (const data of guideArticlePages) {
    await upsertArticle(data.slug, await guideToFields(data))
  }
  for (const data of simpleArticlePages) {
    await upsertArticle(data.slug, simpleToFields(data))
  }
  console.log('done')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
