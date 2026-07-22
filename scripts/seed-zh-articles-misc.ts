/**
 * Phase 6 (Chinese): the mount-kilimanjaro detail article and the 2 simple
 * (text-only) articles. Mirrors seed-it-articles-misc.ts's structure.
 *
 * Run from the studio folder:
 *   npx sanity exec scripts/seed-zh-articles-misc.ts --with-user-token
 */
import {getCliClient} from 'sanity/cli'
import {key, stringToPt, segmentParagraphsToPt} from './lib/pt'
import {uploadImage} from './lib/assets'
import {findEnId, upsertTranslatedDoc, linkTranslationMetadata} from './lib/i18n'

const client = getCliClient({apiVersion: '2026-07-01'})

async function seedMountKilimanjaroZh() {
  const slug = 'mount-kilimanjaro'
  const enId = await findEnId(client, 'article', slug)
  if (!enId) {
    console.log(`SKIP ${slug}: no en source found`)
    return
  }
  const fields = {
    seo: {_type: 'seo', title: '乞力马扎罗山 | Climbing Kilimanjaro Tanzania', description: '乞力马扎罗山概览——非洲最高峰——包括其位置、海拔、路线及攀登的最佳时间。'},
    heading: '乞力马扎罗山',
    heroBackgroundImage: await uploadImage(client, {src: '/images/routes/hub/hero-kilimanjaro.jpg', alt: '乞力马扎罗山白雪覆盖的山顶'}),
    intro:
      '乞力马扎罗山是非洲最高峰，也是世界上最高的独立山峰——这座休眠火山直接从坦桑尼亚平原拔地而起，高达5,895米。它同时也是世界上最容易攀登的高海拔山峰之一：无需任何技术性攀登技巧或专业装备，只需良好的体能、恰当的节奏，以及足够的时间在山上充分适应高原环境。',
    sections: [
      {
        heading: '乞力马扎罗山位于何处？',
        body: '乞力马扎罗山位于坦桑尼亚北部，靠近肯尼亚边境，坐落在乞力马扎罗国家公园内——这是一处联合国教科文组织世界遗产地。最近的城镇是莫希与阿鲁沙，两者都是登山的常规出发地，而乞力马扎罗国际机场（JRO）则是国际游客抵达的主要门户。',
      },
      {
        heading: '乞力马扎罗山的海拔是多少？',
        body: '山顶 Uhuru Peak 海拔高达5,895米——这是非洲的最高点，也是著名的「七大洲最高峰」之一，即每个大洲的最高山峰。乞力马扎罗由三座火山锥组成：基博峰（最高峰，Uhuru Peak 所在地）、马文济峰及 Shira 峰。基博峰处于休眠状态，而非死火山，尽管在有记载的历史中并未发生过喷发。',
      },
      {
        heading: '登山路线',
        body: '通往山顶有多条成熟路线，各自在长度、难度及风光上各不相同——从拥有小屋住宿、广受欢迎的 Marangu 路线，到能提供更多高原适应天数、风景秀丽的 Lemosho 及 Northern Circuit 路线。请查阅我们对每条路线的完整概览，或浏览各路线现成的逐日行程套餐。',
      },
      {
        heading: '攀登的最佳时间',
        body: '理论上乞力马扎罗全年皆可攀登，但两个旱季——6月末至10月，以及1月至3月中旬——能带来最晴朗的天空及最佳的登顶成功率。大雨季（4月至5月）及小雨季（11月）则会带来更潮湿的步道及能见度降低的情况，尽管部分经验丰富的徒步者依然偏爱这些更为清静、绿意盎然的月份。',
      },
      {
        heading: '难度如何？',
        body: '攀登乞力马扎罗无需绳索、安全带或攀登经验——这是一段漫长的高海拔徒步，而非技术性攀登。真正的挑战在于海拔：选择拥有更多高原适应天数的较长路线，能显著提高您舒适且成功登顶的机会。良好的基础体能、优质的装备及经验丰富的向导团队，将带来决定性的差异。',
      },
    ].map((section) => ({_type: 'articleSection', _key: key(), heading: section.heading, body: stringToPt(section.body)})),
  }
  const zhId = await upsertTranslatedDoc(client, 'article', slug, 'zh', fields)
  await linkTranslationMetadata(client, 'article', [
    {language: 'en', id: enId},
    {language: 'zh', id: zhId},
  ])
  console.log(`${slug}-zh done (${zhId})`)
}

async function seedSimpleArticleZh(
  slug: string,
  seoTitle: string,
  seoDescription: string,
  heading: string,
  subheading: string | undefined,
  paragraphs: {text: string; bold?: boolean}[][],
) {
  const enId = await findEnId(client, 'article', slug)
  if (!enId) {
    console.log(`SKIP ${slug}: no en source found`)
    return
  }
  const fields = {
    seo: {_type: 'seo', title: seoTitle, description: seoDescription},
    heading,
    ...(subheading ? {subheading} : {}),
    sections: [{_type: 'articleSection', _key: key(), body: segmentParagraphsToPt(paragraphs)}],
  }
  const zhId = await upsertTranslatedDoc(client, 'article', slug, 'zh', fields)
  await linkTranslationMetadata(client, 'article', [
    {language: 'en', id: enId},
    {language: 'zh', id: zhId},
  ])
  console.log(`${slug}-zh done (${zhId})`)
}

async function run() {
  await seedMountKilimanjaroZh()

  await seedSimpleArticleZh(
    'best-time-to-climb-mount-kilimanjaro',
    '攀登乞力马扎罗的最佳时间',
    '一年中攀登乞力马扎罗的最佳时间是什么时候？推荐的时段是旱季。',
    '攀登乞力马扎罗的最佳时间',
    '一年中攀登乞力马扎罗的最佳时间是什么时候',
    [
      [
        {
          text: '攀登乞力马扎罗的推荐时段是旱季，即12月至3月中旬，以及6月末至10月。最理想的月份是1月、2月、7月、8月、9月及10月。在这些月份，天气条件最为理想。晴空万里，视野绝佳，几乎不降雨，阳光充沛。',
        },
      ],
      [{text: '不过，无论季节如何，天气都始终存在剧烈变化的可能性。'}],
      [
        {
          text: '您可以在一年中的任何时候攀登乞力马扎罗，但某些月份会比其他月份更为理想。我们建议在较为干燥的月份攀登乞力马扎罗。请避开4月与11月，这两个月是主要雨季，会使步道更加危险。',
        },
      ],
    ],
  )

  await seedSimpleArticleZh(
    'kilimanjaro-climbling-routes',
    '乞力马扎罗登山路线：概览',
    '快速了解适合您目标的乞力马扎罗路线：初学者、风光、预算、中等水平徒步者、专家及成功率。',
    '乞力马扎罗登山路线：概览',
    undefined,
    [
      [{text: '最适合初学者', bold: true}, {text: '——Marangu 或 Machame 路线'}],
      [{text: '壮丽的风光', bold: true}, {text: '——Lemosho 或 Machame 路线'}],
      [{text: '预算有限的初学者', bold: true}, {text: '——Marangu 路线'}],
      [{text: '适合中等水平的徒步者', bold: true}, {text: '——Machame 或 Lemosho 路线'}],
      [{text: '经验丰富的徒步者', bold: true}, {text: '——Umbwe 路线'}],
      [{text: '乞力马扎罗最受欢迎的路线', bold: true}, {text: '——Machame 路线'}],
      [{text: '乞力马扎罗最长的路线', bold: true}, {text: '——Northern Circuit'}],
      [{text: '雨季期间', bold: true}, {text: '——Rongai 路线'}],
      [{text: '最佳成功率？', bold: true}, {text: '——Lemosho 路线8天或 Northern Circuit 9天'}],
    ],
  )

  console.log('done')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
