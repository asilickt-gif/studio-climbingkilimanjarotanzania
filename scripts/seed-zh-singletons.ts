/**
 * Simplified Chinese: seed homePage-zh, climbingKilimanjaroPage-zh,
 * siteSettings-zh. Mirrors seed-it-singletons.ts / seed-de-singletons.ts's
 * structure exactly; these 3 are singletons (fixed `<type>-zh` id, no
 * translation.metadata needed).
 *
 * Run from the studio folder:
 *   npx sanity exec scripts/seed-zh-singletons.ts --with-user-token
 */
import {getCliClient} from 'sanity/cli'

import {homeData} from '../../climbingkilimanjarotanzania/content/home'
import {climbingKilimanjaroPageData} from '../../climbingkilimanjarotanzania/content/climbing-kilimanjaro-page'
import {siteFooter, siteInfo, siteNav} from '../../climbingkilimanjarotanzania/content/site'
import {key, segmentParagraphsToPt, segmentsToRichText, stringToPt} from './lib/pt'
import {uploadImage} from './lib/assets'

const client = getCliClient({apiVersion: '2026-07-01'})

const navLink = (link: {label: string; href: string}, label: string) => ({
  _type: 'navLink' as const,
  _key: key(),
  label,
  href: link.href,
})

// ---------- homePage-zh ----------

async function seedHomeZh() {
  const d = homeData

  const destinationsZh = [
    {
      ...d.hero.destinations[0],
      eyebrow: '乞力马扎罗山',
      heading: '非洲屋脊',
      body: '挑战一场毕生难忘的徒步之旅，登上世界最高独立山峰之巅。',
      stats: [
        {label: '体验类型', value: '高山徒步'},
        {label: '行程天数', value: '6 至 9 天'},
        {label: '海拔高度', value: '5,895 米'},
      ],
    },
    {
      ...d.hero.destinations[1],
      eyebrow: '坦桑尼亚野生动物园',
      heading: '非洲的狂野之心',
      body: '探索塞伦盖蒂、恩戈罗恩戈罗火山口与塔兰吉雷，追寻非洲五大兽与壮观的动物大迁徙。',
      stats: [
        {label: '体验类型', value: '摄影野生动物园'},
        {label: '行程天数', value: '5 至 9 天'},
        {label: '野生动物', value: '非洲五大兽'},
      ],
    },
    {
      ...d.hero.destinations[2],
      eyebrow: '桑给巴尔群岛',
      heading: '热带天堂',
      body: '在洁白细腻的沙滩上尽情放松，潜入湛蓝的珊瑚礁，漫步于历史悠久、香料气息弥漫的石头城小巷。',
      stats: [
        {label: '体验类型', value: '海滩与文化'},
        {label: '行程天数', value: '3 至 6 天'},
        {label: '海岸', value: '印度洋'},
      ],
    },
  ]
  const posterAltZh = ['攀登乞力马扎罗山', '塞伦盖蒂摄影野生动物园', '桑给巴尔海滩与碧绿海洋']
  const thumbnailAltZh = ['乞力马扎罗山乌呼鲁峰标志牌', '塞伦盖蒂国家公园', '桑给巴尔帕杰海滩']

  const destinations = []
  for (let i = 0; i < d.hero.destinations.length; i++) {
    const dest = d.hero.destinations[i]
    const zh = destinationsZh[i]
    destinations.push({
      _type: 'heroDestination',
      _key: key(),
      key: dest.key,
      eyebrow: zh.eyebrow,
      heading: zh.heading,
      body: zh.body,
      stats: zh.stats.map((stat) => ({_type: 'heroStat', _key: key(), label: stat.label, value: stat.value})),
      mediaType: dest.media.type,
      ...(dest.media.type === 'video'
        ? {videoSrc: dest.media.src, poster: await uploadImage(client, {src: dest.media.poster.src, alt: posterAltZh[i]})}
        : {image: await uploadImage(client, dest.media.image)}),
      thumbnail: await uploadImage(client, {src: dest.thumbnail.src, alt: thumbnailAltZh[i]}),
      ctaHref: dest.ctaHref,
    })
  }

  const featuresZh = [
    {
      title: '本地经营，本地拥有',
      description: '作为一家坦桑尼亚本土公司，我们对这片土地、这里的人民和这座山的了解无人能及。您不只是与向导同行，更是与一个家庭同行。',
    },
    {
      title: '经验丰富的登山向导',
      description: '我们所有向导均持证上岗、经验丰富，并接受过高海拔徒步专业培训。您的安全与成功登顶始终是我们的首要任务。',
    },
    {
      title: '量身定制的行程',
      description: '无论您是徒步新手还是资深探险者，我们都能根据您的节奏、目标与时间安排，为您量身定制乞力马扎罗行程。',
    },
  ]

  const introBodyZh: {text: string; bold?: boolean; href?: string}[][] = [
    [
      {text: '攀登乞力马扎罗山', bold: true, href: '/climbing-mount-kilimanjaro/'},
      {text: '绝非普通徒步——这是一场改变人生的探险。在 '},
      {text: 'Climbing Kilimanjaro Tanzania', bold: true},
      {text: '，我们精心打理每一处细节，确保您在攀登'},
      {text: '非洲最高峰', bold: true},
      {text: '的旅程中顺利、安全，收获真正难忘的体验。'},
    ],
    [
      {text: '从我们在'},
      {text: '机场迎接您', bold: true},
      {text: '的那一刻起，到装备准备、沿途专业向导陪伴，直至登顶庆祝，我们全程与您同在。大多数徒步者会根据适应高原所需的时间、沿途风景以及登顶成功率，来选择自己的'},
      {text: '乞力马扎罗路线', bold: true},
      {text: '。'},
    ],
    [
      {text: '无论您偏好'},
      {text: '经典热门路线', bold: true},
      {text: '，还是更安静、人迹罕至的体验，我们都能为您提供理想的'},
      {text: '乞力马扎罗徒步之旅', bold: true},
      {text: '。我们所有的'},
      {text: '套餐', bold: true},
      {text: '均提供灵活的出发日期，私人徒步团可在任意日期出发。更长的'},
      {text: '行程', bold: true},
      {text: '能让身体更好地适应高原，大幅提高您登顶成功的机会。'},
    ],
    [
      {text: '在'},
      {text: '私人攀登', bold: true},
      {text: '行程中，您的团队将由一支专属的专业'},
      {text: '向导', bold: true},
      {text: '、背夫及私人厨师团队陪同，餐食在私人餐帐中供应。虽然沿途步道与营地会与其他徒步团共享，但您的整体体验依然舒适、贴心，且全程有专人悉心照料。'},
    ],
    [
      {text: '我们很自豪能成为攀登'},
      {text: '乞力马扎罗山', bold: true},
      {text: '的领先本地公司之一，致力于为您带来安全、难忘且充满成就感的登顶体验。'},
    ],
  ]

  const introFeaturesZh = [
    {title: '温暖的本地团队', description: '我们在乞力马扎罗山的怀抱中土生土长，对这座山的了解如同了解自己的家人。'},
    {title: '安全且节奏适宜的徒步', description: '我们遵循“pole pole”（慢慢来）的原则。全程细致引导攀登，定期进行体感检查，并提供全方位支持。'},
    {title: '真挚的情谊，而非单纯的旅行团', description: '您带回家的将远不止登顶照片——还有历久弥新的友谊和值得讲述一生的故事。'},
  ]

  const routeGuideItemsZh = [
    {name: 'Lemosho / Shira 路线（7–9 天）：', detail: '提供极佳的高原适应过程、壮丽的风景以及很高的登顶成功率。'},
    {name: 'Machame 路线（6–8 天）：', detail: '极受欢迎且风景优美；常被称为“威士忌路线”。'},
    {name: 'Rongai 路线（6–7 天）：', detail: '一条更安静、气候更干燥的路线，非常适合雨季出行。'},
    {name: 'Marangu 路线（5–6 天）：', detail: '最短的路线，以路径简单直接、住宿小屋而闻名。'},
  ]

  const kiliCardTitlesZh = [
    'Lemosho 路线 9 天 – 火山口露营体验',
    '乞力马扎罗山徒步 – Machame 路线 6 天',
    '乞力马扎罗山徒步 – Lemosho 路线 8 天',
    '乞力马扎罗山徒步 – Machame 路线 7 天',
    '乞力马扎罗山徒步 – Marangu 路线 6 天',
    '乞力马扎罗山徒步 – Rongai 路线 6 天',
  ]
  const kiliCardTourTypeZh = ['小团 / 基础', '私人定制 • 基础', '私人定制 • 基础', '私人定制 • 基础', '私人定制 • 基础', '私人定制 • 基础']
  const kiliCardLocationZh = [
    '阿鲁沙 › Machame › 乞力马扎罗山',
    '阿鲁沙 › 乞力马扎罗山',
    '阿鲁沙 › 乞力马扎罗山',
    '阿鲁沙 › 乞力马扎罗山',
    '阿鲁沙 › 乞力马扎罗山',
    '阿鲁沙 › 乞力马扎罗山',
  ]

  const safariCardTitlesZh = [
    '马拉河动物大迁徙野生动物园 - 07 天',
    '辛巴野生动物园 - 05 天',
    '坦桑尼亚经典之旅 - 07 天',
    '坦桑尼亚舒适体验之旅 - 07 天',
    '坦桑尼亚豪华帐篷野生动物园体验 - 05 天',
    '角马大迁徙野生动物园 - 09 天',
  ]
  const safariCardTourTypeZh = ['私人定制 • 舒适型', '私人定制 • 舒适型', '私人定制 • 舒适型', '私人定制 • 舒适型', '私人定制 • 舒适型', '私人定制 • 舒适升级型']
  const safariCardLocationZh = [
    '阿鲁沙 › 塞伦盖蒂中部 › 恩戈罗恩戈罗火山口',
    '塞伦盖蒂国家公园 › 恩戈罗恩戈罗 › 恩戈罗恩戈罗火山口',
    '阿鲁沙 › 马尼亚拉湖 › 塞伦盖蒂 › 塞伦盖蒂中部 › 恩戈罗恩戈罗',
    '阿鲁沙 › 塔兰吉雷国家公园 › 塞伦盖蒂 › 恩戈罗恩戈罗',
    '阿鲁沙 › 塔兰吉雷国家公园 › 塞伦盖蒂 › 恩戈罗恩戈罗',
    '阿鲁沙 › 马尼亚拉湖 › 塞伦盖蒂 › 恩戈罗恩戈罗 › 塔兰吉雷',
  ]

  const zanzibarCardTitlesZh = [
    '桑给巴尔印度洋之旅 - 06 天',
    '桑给巴尔印度洋 - 06 天',
    '坦桑尼亚桑给巴尔岛之旅 - 05 天',
    '桑给巴尔蜜月之旅 - 06 天',
    '探索桑给巴尔岛 - 03 天',
    '探索印度洋 - 06 天',
  ]
  const zanzibarCardTourTypeZh = ['私人定制 • 豪华型', '私人定制 • 舒适型', '私人定制 • 豪华型', '私人定制 • 基础型', '私人定制 • 基础型', '私人定制 • 基础型']
  const zanzibarCardLocationZh = [
    '桑给巴尔石头城 › 桑给巴尔',
    '桑给巴尔石头城 › 桑给巴尔',
    '桑给巴尔石头城 › 桑给巴尔',
    '桑给巴尔石头城 › 桑给巴尔',
    '阿贝德·阿马尼·卡鲁姆国际机场 › 桑给巴尔 › 桑给巴尔石头城',
    '桑给巴尔 › 桑给巴尔石头城',
  ]

  const routeOptionsZh = [
    {
      title: 'Marangu 路线 5 天',
      summary: '通过著名的 Marangu 路线，用五天时间登上非洲最高峰。沿途风光多样……',
      duration: '5 天 / 4 晚徒步 + 2 晚酒店住宿',
      prices: ['单人出行 - 每人 $2,008', '两人同行 - 每人 $1,783', '3–4 人同行 - 每人 $1,678'],
    },
    {
      title: 'Marangu 路线 6 天',
      summary: '通过著名的 Marangu 路线，用六天时间登上非洲最高峰。沿途风光多样……',
      duration: '6 天 / 5 晚徒步 + 2 晚酒店住宿',
      prices: ['单人出行 - 每人 $2,308', '两人同行 - 每人 $1,928', '3–4 人同行 - 每人 $1,678'],
    },
    {
      title: 'Machame 或 Umbwe 路线 6 天',
      summary: 'Umbwe 路线以其陡峭而富有挑战性的攀登过程，以及壮美却鲜有人涉足的小径而闻名。',
      duration: '6 天 / 5 晚徒步 + 2 晚酒店住宿',
      prices: ['单人出行 - 每人 $2,308', '两人同行 - 每人 $2,058', '3–4 人同行 - 每人 $2,058'],
    },
    {
      title: 'Machame 或 Umbwe 路线 7 天',
      summary: '走一趟人气极高的 Machame 路线，全程七天，为您留出更充裕的高原适应时间',
      duration: '7 天 / 6 晚徒步 + 2 晚酒店住宿',
      prices: ['单人出行 - 每人 $2,608', '两人同行 - 每人 $2,608', '3–4 人同行 - 每人 $2,348'],
    },
    {
      title: '6 天 / 5 晚徒步 + 2 晚酒店住宿',
      summary: '通过著名的 Marangu 路线，用六天时间登上非洲最高峰。沿途风光多样……',
      duration: '6 天 / 5 晚徒步 + 2 晚酒店住宿',
      prices: ['单人出行 - 每人 $2,648', '两人同行 - 每人 $2,648', '3–4 人同行 - 每人 $2,063'],
    },
    {
      title: 'Shira、Lemosho 或 Rongai 路线 7 天',
      summary: '从北侧出发，这条路线为您呈现独特的乞力马扎罗山视角，非常适合……',
      duration: '7 天 / 6 晚徒步 + 2 晚酒店住宿',
      prices: ['单人出行 - 每人 $2,938', '两人同行 - 每人 $2,938', '3–4 人同行 - 每人 $2,313'],
    },
    {
      title: 'Shira、Lemosho 或 Rongai 路线 8 天',
      summary: '从北侧出发，这条路线为您呈现独特的乞力马扎罗山视角，非常适合……',
      duration: '8 天 / 7 晚徒步 + 2 晚酒店住宿',
      prices: ['单人出行 - 每人 $3,228', '两人同行 - 每人 $2,773', '3–4 人同行 - 每人 $2,568'],
    },
    {
      title: '8 天 / 7 晚徒步 + 2 晚酒店住宿',
      summary: '走一趟人气极高的 Machame 路线，全程七天，为您留出更充裕的高原适应时间',
      duration: '8 天 / 7 晚徒步 + 2 晚酒店住宿',
      prices: ['单人出行 - 每人 $3,588', '两人同行 - 每人 $2,938', '3–4 人同行 - 每人 $2,938'],
    },
    {
      title: 'Northern Circuit 路线 9 天，含移动厕所租赁',
      summary: '最新、最长的路线，提供 360 度全景视野，登顶成功率也是最高的。',
      duration: '9 天 / 8 晚徒步 + 2 晚酒店住宿',
      prices: ['单人出行 - 每人 $3,918', '两人同行 - 每人 $3,228', '3–4 人同行 - 每人 $3,228'],
    },
  ]

  const whyUsCardsZh = [
    {
      title: '100% 本地经营',
      description: '我们不是境外旅行运营商——我们在乞力马扎罗山脚下的莫希市土生土长。选择与 Asili 一同登山，您直接支持了当地家庭与社区，并透过最了解这座山的人的视角来体验它。',
    },
    {
      title: '最高安全标准',
      description: '我们随身携带应急氧气瓶与血氧仪，并每日进行两次健康检查。我们的向导训练有素，能够及时发现并处理高原反应。您的安全，永远是我们的第一优先。',
    },
    {
      title: '私人攀登、灵活日期与定制选项',
      description: '想独自攀登，或与伴侣、一小群朋友同行？我们提供可根据您日程灵活安排的私人出发团。您的节奏，您的路线，专属于您的乞力马扎罗之旅。',
    },
    {
      title: '经过验证的登顶成功率',
      description: '得益于我们注重高原适应的策略、适宜的行进节奏以及经验丰富的团队，我们的长线行程登顶成功率超过 95%。当您把梦想托付给我们，我们必竭尽全力助您梦想成真。',
    },
    {
      title: '机场接送、酒店预订与全程支持',
      description: '从您降落乞力马扎罗机场的那一刻，到您抵达乌呼鲁峰，我们始终陪伴左右。机场接送、装备检查、酒店预订与后勤支持——这一切都是 Asili 体验的一部分。',
    },
    {
      title: '公平且合乎道德的徒步实践',
      description: '我们自豪地支持乞力马扎罗背夫援助项目（KPAP），确保每一位背夫都获得公平报酬、充足饮食以及优质装备。选择与 Asili 同行，就是选择诚信同行。',
    },
  ]

  const comboTilesZh = [
    {title: '乞力马扎罗山与野生动物园', subtitle: '坦桑尼亚 12 天之旅'},
    {title: '乞力马扎罗山与野生动物园', subtitle: '坦桑尼亚 10 天之旅'},
    {title: '乞力马扎罗山、塞伦盖蒂与恩戈罗恩戈罗', subtitle: '坦桑尼亚 12 天之旅'},
    {title: '乞力马扎罗山、塔兰吉雷与马尼亚拉湖', subtitle: '10 天乞力马扎罗攀登与野生动物园'},
  ]

  const testimonialsZh = [
    {timeAgo: '9 个月前', quote: '这家公司帮我实现了攀登乞力马扎罗山的梦想！全程陪伴周到，山上的餐食也非常美味，还有……'},
    {timeAgo: '9 个月前', quote: '强烈推荐给任何计划攀登非洲最高峰的人。团队非常给力，食物……'},
  ]

  const faqQ = {
    q1: '攀登乞力马扎罗山需要多长时间？',
    a1: '所需时间取决于您选择的路线。大多数乞力马扎罗攀登行程为 6 至 9 天。更长的行程能提供更多高原适应时间，从而提高您成功登顶的几率。',
    q2: '我需要有登山经验吗？',
    a2: '无需任何技术性登山经验。不过，良好的体能与心理准备至关重要，因为乞力马扎罗山是高海拔徒步，而非技术性攀岩。',
    q3: '攀登乞力马扎罗山的最佳时间是什么时候？',
    a3: '最佳攀登月份为 1 月至 3 月以及 6 月至 10 月，此时天气通常较为干燥，能见度也最佳。',
    q4: '攀登期间提供什么样的住宿？',
    a4: '住宿方式因路线而异。大多数路线使用舒适的高山帐篷，而 Marangu 路线沿途则提供小屋住宿。',
    q5: '攀登时我需要携带什么？',
    a5: '您需要准备一双好的徒步靴、保暖衣物、睡袋、防水装备以及必要的个人用品。我们会为您提供详细清单，帮助您做好行前准备。',
    q6: '在乞力马扎罗山上高原反应常见吗？',
    a6: '是的，无论体能水平如何，任何人都可能出现高原反应。我们的向导训练有素，会密切监测您的身体状况，确保循序渐进、安全地攀登，以获得更好的高原适应效果。',
    q7: '为什么要选择 Climbing Kilimanjaro Tanzania 预订？',
    a7: '我们是一家本地且经验丰富的旅行运营商，拥有专业的登山向导、优质的装备以及个性化的服务，致力于确保您的攀登安全、愉快且难忘。',
  }
  const faqItem = (q: string, a: string) => ({_type: 'faqItem', _key: key(), question: q, answer: a})

  await client.createOrReplace({
    _id: 'homePage-zh',
    _type: 'homePage',
    language: 'zh',
    hero: {
      exploreLabel: '探索',
      primaryCtaLabel: '查看套餐',
      secondaryCtaLabel: '定制您的行程',
      secondaryCtaHref: d.hero.secondaryCtaHref,
      destinations,
    },
    features: featuresZh.map((item) => ({_type: 'featureItem', _key: key(), title: item.title, description: item.description})),
    intro: {
      heading: '从抵达到登顶——一切细节，我们为您安排妥当。',
      body: segmentParagraphsToPt(introBodyZh),
      ctaLabel: '了解更多关于我们',
      ctaHref: d.intro.ctaHref,
      image: await uploadImage(client, {src: d.intro.image.src, alt: '乞力马扎罗山上的徒步者'}),
    },
    introFeatures: introFeaturesZh.map((item) => ({_type: 'introFeature', _key: key(), title: item.title, description: item.description})),
    routeGuide: {
      eyebrow: '选择您的路线，以自己的方式攀登。附有价格与预订建议的完整本地向导指南',
      heading: '坦桑尼亚探险指南：野生动物园、乞力马扎罗山与桑给巴尔度假',
      items: routeGuideItemsZh.map((item) => ({_type: 'routeGuideItem', _key: key(), name: item.name, detail: item.detail})),
    },
    kilimanjaroPackages: {
      heading: '乞力马扎罗山旅游套餐',
      viewAllHref: d.kilimanjaroPackages.viewAllHref,
      cards: await Promise.all(
        d.kilimanjaroPackages.cards.map(async (card, i) => ({
          _type: 'tourCard',
          _key: key(),
          title: kiliCardTitlesZh[i],
          href: card.href,
          image: await uploadImage(client, card.image),
          tourType: kiliCardTourTypeZh[i],
          tourId: card.tourId,
          price: card.price,
          location: kiliCardLocationZh[i],
        })),
      ),
    },
    safariPackages: {
      heading: '野生动物园与旅游套餐',
      viewAllHref: d.safariPackages.viewAllHref,
      cards: await Promise.all(
        d.safariPackages.cards.map(async (card, i) => ({
          _type: 'tourCard',
          _key: key(),
          title: safariCardTitlesZh[i],
          href: card.href,
          image: await uploadImage(client, card.image),
          tourType: safariCardTourTypeZh[i],
          tourId: card.tourId,
          price: card.price,
          location: safariCardLocationZh[i],
        })),
      ),
    },
    zanzibarPackages: {
      heading: '桑给巴尔旅游套餐',
      viewAllHref: d.zanzibarPackages.viewAllHref,
      cards: await Promise.all(
        d.zanzibarPackages.cards.map(async (card, i) => ({
          _type: 'tourCard',
          _key: key(),
          title: zanzibarCardTitlesZh[i],
          href: card.href,
          image: await uploadImage(client, card.image),
          tourType: zanzibarCardTourTypeZh[i],
          tourId: card.tourId,
          price: card.price,
          location: zanzibarCardLocationZh[i],
        })),
      ),
    },
    routeOptions: {
      heading: '选择您的路线：在本地向导的帮助下，比较所有乞力马扎罗套餐与行程',
      cards: await Promise.all(
        d.routeOptions.cards.map(async (card, i) => ({
          _type: 'routeOptionCard',
          _key: key(),
          title: routeOptionsZh[i].title,
          href: card.href,
          image: await uploadImage(client, card.image),
          summary: routeOptionsZh[i].summary,
          duration: routeOptionsZh[i].duration,
          prices: routeOptionsZh[i].prices,
        })),
      ),
    },
    notSureBand: {
      heading: '不确定哪条路线适合您？',
      body: '我们提供多条乞力马扎罗路线，可根据您的体能状况、时间安排与徒步风格进行选择。无论您追求壮丽风景、较少人流，还是最高的成功率，我们都能帮您找到通往顶峰的理想路线。',
      ctaLabel: '立即致电',
      ctaHref: d.notSureBand.ctaHref,
    },
    whyUs: {
      heading: '为什么选择与我们一起攀登乞力马扎罗山？',
      body: '选择合适的团队，能让一次普通的徒步变成一场改变人生的探险。',
      cards: whyUsCardsZh.map((card, i) => ({
        _type: 'whyUsCard',
        _key: key(),
        title: card.title,
        description: card.description,
        icon: d.whyUs.cards[i].icon,
      })),
    },
    comboExperience: {
      heading: '乞力马扎罗攀登与野生动物园体验',
      body: '让您的坦桑尼亚之旅真正难忘：登上雄伟的乞力马扎罗山，然后探索非洲最具代表性的野生动物园。选择 Asili，您的攀登与野生动物园行程将无缝衔接，由深谙每一条小径、每一处风景与每一个值得体验的时刻的本地专家全程带领。',
      cardTitle: '登得更高，探索更狂野，体验一场难忘的旅程',
      cardBody: '登上世界最高独立山峰的顶端，然后沉浸在坦桑尼亚令人惊叹的荒野之中。通过我们的乞力马扎罗 + 野生动物园套餐，尽享完美的探险组合：先征服乞力马扎罗山，再探索塞伦盖蒂、恩戈罗恩戈罗火山口与塔兰吉雷国家公园的奇观。',
      ctaLabel: '开始规划',
      ctaHref: d.comboExperience.ctaHref,
      tiles: await Promise.all(
        d.comboExperience.tiles.map(async (tile, i) => ({
          _type: 'comboTile',
          _key: key(),
          title: comboTilesZh[i].title,
          subtitle: comboTilesZh[i].subtitle,
          href: tile.href,
          image: await uploadImage(client, tile.image),
        })),
      ),
      body2: '登上世界最高独立山峰的顶端，然后沉浸在坦桑尼亚令人惊叹的荒野之中。通过我们的乞力马扎罗 + 野生动物园套餐，尽享完美的探险组合：先征服乞力马扎罗山，再探索塞伦盖蒂、恩戈罗恩戈罗火山口与塔兰吉雷国家公园的奇观。',
      viewToursLabel: '查看更多行程',
      viewToursHref: d.comboExperience.viewToursHref,
    },
    testimonials: {
      heading: '满意登山客户的真实评价',
      items: d.testimonials.items.map((item, i) => ({
        _type: 'testimonial',
        _key: key(),
        name: item.name,
        timeAgo: testimonialsZh[i].timeAgo,
        rating: item.rating,
        quote: testimonialsZh[i].quote,
      })),
    },
    faq: {
      heading: '常见问题',
      tabs: [
        {
          _type: 'faqTab',
          _key: key(),
          label: '所有问题',
          faqs: [
            faqItem(faqQ.q1, faqQ.a1),
            faqItem(faqQ.q2, faqQ.a2),
            faqItem(faqQ.q3, faqQ.a3),
            faqItem(faqQ.q4, faqQ.a4),
            faqItem(faqQ.q5, faqQ.a5),
            faqItem(faqQ.q6, faqQ.a6),
            faqItem(faqQ.q7, faqQ.a7),
          ],
        },
        {
          _type: 'faqTab',
          _key: key(),
          label: '攀登时间',
          faqs: [faqItem(faqQ.q1, faqQ.a1), faqItem(faqQ.q2, faqQ.a2), faqItem(faqQ.q3, faqQ.a3)],
        },
        {
          _type: 'faqTab',
          _key: key(),
          label: '住宿',
          faqs: [faqItem(faqQ.q1, faqQ.a1), faqItem(faqQ.q2, faqQ.a2), faqItem(faqQ.q6, faqQ.a6), faqItem(faqQ.q7, faqQ.a7)],
        },
        {
          _type: 'faqTab',
          _key: key(),
          label: '预订',
          faqs: [faqItem(faqQ.q1, faqQ.a1), faqItem(faqQ.q2, faqQ.a2)],
        },
      ],
    },
  })
  console.log('homePage-zh created/replaced')
}

// ---------- climbingKilimanjaroPage-zh ----------

async function seedClimbZh() {
  const d = climbingKilimanjaroPageData

  await client.createOrReplace({
    _id: 'climbingKilimanjaroPage-zh',
    _type: 'climbingKilimanjaroPage',
    language: 'zh',
    trustBadges: {
      heading: '乞力马扎罗山攀登套餐',
      badges: [
        {
          _type: 'trustBadge',
          _key: key(),
          title: 'TripAdvisor 首选推荐',
          description: '凭借数百条优质评价，我们对品质与客户满意度的专注，在众多乞力马扎罗旅行运营商中脱颖而出。',
        },
        {
          _type: 'trustBadge',
          _key: key(),
          title: '值得信赖，经验丰富',
          description: '我们经验丰富的向导团队全程悉心保障登山安全，坚持道德徒步理念，助您顺利登顶。',
        },
        {
          _type: 'trustBadge',
          _key: key(),
          title: '扎根坦桑尼亚',
          description: '我们提供定制化的乞力马扎罗徒步体验，从经济型攀登到豪华探险应有尽有，始终坚持负责任且合乎道德的登山方式。',
        },
      ],
    },
    challengeBand: {
      heading: '准备好迎接乞力马扎罗的挑战了吗？',
      body: '通往非洲屋脊的旅程，从这里开始。无论您追求的是一生难忘的冒险，还是想突破自我、勇登顶峰，我们都将全程为您引路。',
      backgroundImage: await uploadImage(client, d.challengeBand.backgroundImage),
      primaryCtaLabel: '登顶挑战',
      secondaryCtaLabel: '开始攀登',
    },
    routeSelector: {
      heading: '乞力马扎罗山路线与攀登地图',
      tabs: await Promise.all([
        {
          name: 'Machame 路线',
          body: '被称为“威士忌路线”，Machame 是乞力马扎罗山最受欢迎的路线，沿途风景壮丽、地形多变。虽然路径陡峭、以帐篷露营为主，颇具挑战性，但它能为寻求更短却同样值得的行程的徒步者提供极佳的高原适应过程。',
          map: d.routeSelector.tabs[0].map,
        },
        {
          name: 'Lemosho 路线',
          body: '乞力马扎罗山最富景致的路线之一，Lemosho 路线从偏远的 Londorossi 大门出发，穿越壮丽的 Shira 高原。归根结底，每一位渴望体验攀登乞力马扎罗山探险的人，都能找到属于自己的路线。',
          map: d.routeSelector.tabs[1].map,
        },
        {
          name: 'Rongai 路线',
          body: '作为乞力马扎罗山唯一的北线路线，Rongai 路线人流较少、坡度更为平缓，非常适合偏好平稳、从容攀登的旅行者。这条路线降水较少，非常适合在雨季出行，并能带来一段穿越原始荒野的愉悦徒步体验。',
          map: d.routeSelector.tabs[2].map,
        },
        {
          name: 'Northern Circuit 路线',
          body: '最长也最富景致的路线，Northern Circuit 通过逐步环绕乞力马扎罗山，提供最佳的高原适应效果。凭借全景视野与较高的成功率，这条路线带来一段宁静而深度沉浸的徒步体验。',
          map: d.routeSelector.tabs[3].map,
        },
      ].map(async (tab) => ({_type: 'routeTab', _key: key(), name: tab.name, body: tab.body, map: await uploadImage(client, tab.map)}))),
    },
    conquerBand: {
      heading: '征服乞力马扎罗山，体验非凡探险',
      body: '突破自我极限，站上非洲最高点。迎接乞力马扎罗的挑战，让您的梦想成真！',
      backgroundImage: await uploadImage(client, d.conquerBand.backgroundImage),
      primaryCtaLabel: '征服非洲',
      secondaryCtaLabel: '开启您的攀登之旅',
      primaryCtaHref: d.conquerBand.primaryCtaHref,
      secondaryCtaHref: d.conquerBand.secondaryCtaHref,
    },
    promoStrip: {
      heading: '征服乞力马扎罗山，体验非凡探险',
      cards: await Promise.all([
        {
          title: '📖 查看我们的乞力马扎罗指南',
          body: '获取筹备攀登所需的全部关键信息。我们的指南涵盖从路线选择到安全建议的方方面面，助您顺利成功登顶。',
          linkLabel: '继续阅读',
          href: d.promoStrip.cards[0].href,
          backgroundImage: d.promoStrip.cards[0].backgroundImage,
        },
        {
          title: '🎯 专家为您的攀登支招',
          body: '虽然乞力马扎罗山欢迎各个经验水平的徒步者，但谨慎徒步至关重要。我们经验丰富的向导会全程监测您的健康状况，为您提供全方位支持，确保旅程安全愉快。',
          linkLabel: '继续阅读',
          href: d.promoStrip.cards[1].href,
          backgroundImage: d.promoStrip.cards[1].backgroundImage,
        },
        {
          title: '🎒 您的乞力马扎罗装备清单',
          body: '借助我们详尽的装备清单，做好充分准备——清单详细列出了舒适且成功登顶所需的每一件必备装备。',
          linkLabel: '查看装备清单',
          href: d.promoStrip.cards[2].href,
          backgroundImage: d.promoStrip.cards[2].backgroundImage,
        },
      ].map(async (card) => ({
        _type: 'promoCard',
        _key: key(),
        title: card.title,
        body: card.body,
        linkLabel: card.linkLabel,
        href: card.href,
        backgroundImage: await uploadImage(client, card.backgroundImage),
      }))),
    },
    infoTabs: [
      {
        _type: 'routeChoicesTab',
        _key: key(),
        label: '路线选择',
        heading: '乞力马扎罗山有哪些可选路线？',
        intro: segmentParagraphsToPt([
          [
            {
              text: '乞力马扎罗山提供多条路线，适合各种水平、偏好与徒步风格的登山者。每条路线都提供独特的体验，从轻松惬意到更具挑战性的探险应有尽有，住宿方式也从露营到更为舒适的设施不等。',
            },
          ],
          [
            {text: '在 '},
            {text: 'Asili Explorer African Safaris', bold: true},
            {text: '，我们专注于乞力马扎罗山四条最受欢迎的路线：'},
            {text: 'Rongai 路线、Lemosho 路线、Northern Circuit 路线与 Machame 路线。', bold: true},
            {text: '我们的向导攀登团确保安全、充分的高原适应，以及一段难忘的登顶之旅。'},
          ],
        ]),
        faqCards: [
          {
            question: '乞力马扎罗山哪条路线人流最少？',
            answer: [
              {text: ''},
              {text: 'Northern Circuit 路线', accent: true},
              {text: '人流最少，能带来宁静、僻静的徒步体验。'},
            ],
          },
          {
            question: '攀登乞力马扎罗山哪条路线最容易？',
            answer: [
              {text: ''},
              {text: 'Rongai 路线', accent: true},
              {text: '因坡度平缓、攀登路径直接，被认为是最容易的一条路线。'},
            ],
          },
          {
            question: '乞力马扎罗山哪条路线风景最美？',
            answer: [
              {text: ''},
              {text: 'Lemosho 路线', accent: true},
              {text: '常被认为是风景最美的一条路线，拥有壮丽的景观、多样的生态系统与全景视野。'},
            ],
          },
        ].map((card) => ({_type: 'richFaqCard', _key: key(), question: card.question, answer: segmentsToRichText(card.answer)})),
        closingNote: segmentsToRichText([
          {text: '归根结底，每一位渴望体验'},
          {text: '攀登乞力马扎罗山', bold: true},
          {text: '探险的人，都能找到属于自己的路线。'},
        ]),
      },
      {
        _type: 'routesComparisonTab',
        _key: key(),
        label: '路线对比',
        heading: '乞力马扎罗山各路线之间有何区别？',
        table: {
          _type: 'dataTable',
          columns: ['路线名称', '难度等级', '长度（公里）', '天数', '人流量', '价格（美元）', '成功率（%）'],
          rows: [{_type: 'tableRow', _key: key(), cells: ['Northern Circuit', '中等到困难', '90', '9–10', '较低', '$2,500–3,500', '95']}],
        },
        noteLabel: '注：',
        noteBody: '以上价格与成功率仅供参考，可能因团队人数、高原适应情况及天气条件等因素而有所不同。',
      },
      {
        _type: 'bestTimeTab',
        _key: key(),
        label: '最佳攀登时间',
        heading: '什么时候攀登乞力马扎罗山最合适？',
        intro: segmentParagraphsToPt([
          [
            {text: '攀登乞力马扎罗山的最佳时间为'},
            {text: '6 月至次年 3 月', accent: true},
            {text: '。不过，由于天气条件不断变化，实际情况可能有所不同。'},
          ],
          [
            {text: '在此期间，天气通常更为干燥、稳定，天空也更为晴朗，攀登条件更佳。这能降低降雨、降雪与低能见度的风险，从而提升旅程的安全性与舒适度。'},
          ],
        ]),
        cards: [
          {
            title: '气温须知：',
            bullets: [
              [
                {text: '低海拔地区白天气温在 '},
                {text: '20°C 至 27°C', accent: true},
                {text: ' 之间，但高海拔地区气温会降至冰点以下，夜间尤为明显。'},
              ],
              [
                {text: '分层穿衣', accent: true},
                {text: '对于适应整个攀登过程中的温度变化至关重要。'},
              ],
            ],
          },
          {
            title: '植被与风景：',
            bullets: [
              [{text: '旱季能带来更清晰的视野、盛开的野花以及沿途郁郁葱葱的森林景观。'}],
              [{text: '较为潮湿的季节可能会出现多雾天气与浓厚的云层覆盖。'}],
            ],
          },
          {
            title: '人流水平：',
            bullets: [
              [
                {text: '旺季', accent: true},
                {text: '（1 月至 2 月及 7 月至 9 月）会吸引更多徒步者。'},
              ],
              [
                {text: '平季', accent: true},
                {text: '（3 月底至 5 月，以及 11 月至 12 月初）则能带来更为宁静的体验。'},
              ],
            ],
          },
          {
            title: '个人偏好与目标：',
            bullets: [
              [{text: '徒步者在规划攀登时，应综合考虑天气条件、个人气温偏好、人流水平以及自身的日程安排。'}],
              [{text: '观赏野生动物的机会以及对风景的偏好，同样也会影响出行时间的选择。'}],
            ],
          },
        ].map((card) => ({
          _type: 'bestTimeCard',
          _key: key(),
          title: card.title,
          bullets: card.bullets.map((bullet) => ({_type: 'bulletItem', _key: key(), body: segmentsToRichText(bullet)})),
        })),
        closingNote: segmentsToRichText([
          {text: '如需根据您的目标获取个性化的最佳出行时间建议，欢迎咨询 '},
          {text: 'Asili Explorer African Safaris', accent: true},
          {text: ' 我们经验丰富的乞力马扎罗向导团队。'},
        ]),
      },
      {
        _type: 'climbCostTab',
        _key: key(),
        label: '攀登费用',
        heading: '攀登乞力马扎罗山需要多少费用？',
        intro: segmentsToRichText([
          {text: '攀登乞力马扎罗山的费用在 '},
          {text: '2,500 美元至 4,000 美元', accent: true},
          {text: ' 之间不等，具体取决于：'},
        ]),
        items: ['所选择的路线', '攀登所需的天数', '团队人数', '服务等级（经典型或尊享型）', '套餐中包含或不包含的内容'],
        closingNote: segmentsToRichText([
          {text: '虽然预算固然重要，但在选择攀登运营商时，'},
          {text: '安全与品质', bold: true},
          {text: ' 必须始终是首要考量。在 '},
          {text: 'Asili Explorer African Safaris', accent: true},
          {text: '，我们承诺提供训练有素的向导、极高的安全标准，以及卓越的整体体验。'},
        ]),
      },
      {
        _type: 'climbingInsightsTab',
        _key: key(),
        label: '攀登建议',
        heading: '成功登顶的重要建议',
        intro: segmentsToRichText([
          {text: '登上世界最高独立山峰之巅绝非易事。'},
          {text: '充分的准备至关重要。', bold: true},
          {text: ' 以下是一些关键建议：'},
        ]),
        tips: [
          {label: '放慢脚步：', description: '稳定的节奏能降低高原反应与体力透支的风险。'},
          {label: '及时补水：', description: '多喝水有助于身体适应高海拔环境。'},
          {label: '准备合适的装备：', description: '在分层保暖衣物、坚固耐用的徒步靴以及优质装备上多加投入。'},
          {label: '做好身心准备：', description: '有氧运动与力量训练能增强您的体能，而坚定的意志力则能支撑您坚持到底。'},
          {label: '享受过程，结交伙伴：', description: '与其他徒步者建立联系，能让这段旅程更加充实难忘。'},
        ].map((tip) => ({_type: 'tip', _key: key(), label: tip.label, description: tip.description})),
        closingNote: '遵循以上建议，将最大限度地提高您成功登顶的机会，同时尽情享受攀登过程中的每一步。',
      },
      {
        _type: 'guidedClimbsTab',
        _key: key(),
        label: '向导陪同攀登',
        heading: '攀登乞力马扎罗山需要向导吗？',
        intro: segmentsToRichText([
          {text: '是的！未经持证向导陪同攀登乞力马扎罗山是'},
          {text: '不被允许的。', bold: true},
        ]),
        faqs: [
          {
            question: '为什么我需要一位向导？',
            answer: '向导凭借其专业知识，全程监测您的健康状况、保障您的安全，并帮助您应对乞力马扎罗山复杂多变的地形。',
          },
          {
            question: '经验丰富的登山者可以不请向导吗？',
            answer: '即使是经验丰富的登山者，也必须由向导陪同。高海拔环境与难以预测的天气状况，使得专业陪同不可或缺。',
          },
          {
            question: '向导如何提升攀登安全性？',
            answer: '向导会监测高原适应情况、提供急救处理、评估天气状况，并针对攀登成功做出关键决策。',
          },
        ].map((faq) => ({_type: 'faqItem', _key: key(), question: faq.question, answer: faq.answer})),
        closingNote: segmentsToRichText([
          {text: '在 '},
          {text: 'Asili Explorer African Safaris', accent: true},
          {text: '，我们提供经验丰富、持证上岗的向导，确保您的乞力马扎罗探险安全、井然有序且令人难忘。'},
        ]),
        ctaLabel: '查看乞力马扎罗指南',
        ctaHref: d.infoTabs.guidedClimbs.ctaHref,
      },
    ],
    reviews: {
      tripAdvisor: {
        heading: '在 TripAdvisor 留下评价',
        cardHeading: 'TripAdvisor 盛赞 Asili Climbing Kilimanjaro',
        cardBody: '凭借超过 779 条持续增长的评价，95% 的评价为“极佳”，5% 为“非常好”，充分证明了我们致力于打造难忘野生动物园与徒步体验的用心。',
        cards: [
          {
            name: 'Pastacieo',
            date: '2024 年 8 月',
            title: '一生难忘的攀登！',
            quote: '我们与 Asili Climbing Kilimanjaro 一起攀登乞力马扎罗山的经历真的非凡卓越！从始至终，团队都确保了难忘的体验，让我们通往顶峰的旅程顺利、安全且令人难忘。',
          },
          {
            name: 'Danny G',
            date: '2023 年 9 月',
            title: '一次与众不同的远足',
            quote: 'Asili Climbing Kilimanjaro 能保持五星口碑绝非偶然。他们的专业能力、职业素养以及对客户满意度的用心，使其脱颖而出。如果您正在寻找最出色的乞力马扎罗徒步运营商，那就不必再找了！',
          },
          {
            name: 'Christian R',
            date: '2024 年 9 月',
            title: '强烈推荐的乞力马扎罗徒步之旅',
            quote: '2023 年 10 月，我们与 Asili Climbing Kilimanjaro 一起进行了为期六天的乞力马扎罗登顶徒步。这次体验令人震撼，我强烈推荐给任何正在考虑这场探险的人。',
          },
        ].map((card) => ({_type: 'reviewCard', _key: key(), name: card.name, date: card.date, title: card.title, quote: card.quote})),
      },
      google: {
        cardHeading: 'Google 评价盛赞我们的服务',
        cardBody: '凭借超过 99 条五星好评，Asili Climbing Kilimanjaro 持续超越客户期待，提供一流服务、专家带队的旅程以及独一无二的探险体验。',
      },
    },
  })
  console.log('climbingKilimanjaroPage-zh created/replaced')
}

// ---------- siteSettings-zh ----------

async function seedSiteSettingsZh() {
  const navGroupLabelsZh = ['乞力马扎罗与野生动物园', '乞力马扎罗山路线', '为何选择我们']
  const navGroupLinkLabelsZh = [
    ['乞力马扎罗与野生动物园 9 天', '乞力马扎罗与野生动物园 10 天', '乞力马扎罗与野生动物园 11 天', '乞力马扎罗与野生动物园 12 天'],
    [
      'Marangu 路线 5 天',
      'Machame 路线 6 天',
      'Marangu 路线 6 天',
      'Umbwe 路线 6 天',
      'Lemosho 路线 7 天',
      'Machame 路线 7 天',
      'Rongai 路线 7 天',
      'Lemosho 路线 8 天',
      'Northern Circuit 路线 9 天',
    ],
    ['野生动物园'],
  ]
  const topLinkLabelsZh = ['博客', '联系我们']

  const columnHeadingsZh = ['攀登', '公司', '帮助', '快速链接']
  const columnLinkLabelsZh = [
    ['乞力马扎罗山', '乞力马扎罗山路线', '乞力马扎罗山套餐', '组合套餐', '乞力马扎罗指南', '装备清单', '拼团出发', '私人徒步', '豪华旅程', '桑给巴尔旅游'],
    ['关于 CKT', '为何选择我们', '条款与条件', '登山向导', '客户评价', '野生动物园司机向导', '核心价值观', '野生动物园车辆', '联系我们'],
    ['乞力马扎罗旅行须知', '野生动物园旅行须知', '付款方式', '隐私政策', '旅行建议'],
    ['非洲旅行日历', '认识我们的团队', '客户评价', '我们的旅行博客', '荣誉奖项'],
  ]
  const legalLinkLabelsZh = ['隐私政策', '条款与条件', 'Cookie 政策']

  await client.createOrReplace({
    _id: 'siteSettings-zh',
    _type: 'siteSettings',
    language: 'zh',
    info: {
      name: siteInfo.name,
      tagline: '乞力马扎罗山攀登首选旅行社 - Asili Climbing Kilimanjaro',
      phone: siteInfo.phone,
      email: siteInfo.email,
    },
    nav: {
      groups: siteNav.groups.map((group, gi) => ({
        _type: 'navGroup',
        _key: key(),
        label: navGroupLabelsZh[gi],
        ...(group.href ? {href: group.href} : {}),
        links: group.links.map((link, li) => navLink(link, navGroupLinkLabelsZh[gi][li])),
      })),
      links: siteNav.links.map((link, i) => navLink(link, topLinkLabelsZh[i])),
    },
    footer: {
      newsletterHeading: '还在寻找理想的旅程吗？',
      newsletterSubheading: '每周将灵感直接送达您的邮箱！',
      columns: siteFooter.columns.map((column, ci) => ({
        _type: 'footerColumn',
        _key: key(),
        heading: columnHeadingsZh[ci],
        links: column.links.map((link, li) => navLink(link, columnLinkLabelsZh[ci][li])),
      })),
      contact: {
        phone: siteFooter.contact.phone,
        email: siteFooter.contact.email,
        address: siteFooter.contact.address,
      },
      copyright: '© Copyright 2026 Asili Climbing Kilimanjaro. 保留所有权利。',
      legalLinks: siteFooter.legalLinks.map((link, i) => navLink(link, legalLinkLabelsZh[i])),
    },
  })
  console.log('siteSettings-zh created/replaced')
}

async function run() {
  await seedHomeZh()
  await seedClimbZh()
  await seedSiteSettingsZh()
  console.log('done')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
