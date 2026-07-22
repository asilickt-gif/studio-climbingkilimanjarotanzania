/**
 * Phase 6 (Chinese): sharedTripContent singleton and the two remaining hub-page
 * singletons (packagesHubPage, comboHubPage). routesHubPage-zh is seeded in
 * seed-zh-routes.ts. Mirrors seed-it-shared-hubs.ts's structure.
 *
 * Run from the studio folder:
 *   npx sanity exec scripts/seed-zh-shared-hubs.ts --with-user-token
 */
import {getCliClient} from 'sanity/cli'
import {key, paragraphBlock, segmentsToBlock} from './lib/pt'
import {uploadImage} from './lib/assets'

const client = getCliClient({apiVersion: '2026-07-01'})

const badges = (typeName: string, items: {title: string; description: string}[]) =>
  items.map((b) => ({_type: typeName, _key: key(), title: b.title, description: b.description}))

async function seedSharedZh() {
  await client.createOrReplace({
    _id: 'sharedTripContent-zh',
    _type: 'sharedTripContent',
    language: 'zh',
    routeTrustBadges: [
      {title: 'TripAdvisor 最佳之选', subtitle: '深受旅行者好评', description: '凭借数百条卓越评价，我们对品质与客户满意度的坚持，使我们在乞力马扎罗众多运营商中脱颖而出。'},
      {title: '值得信赖、经验丰富', subtitle: '以诚信为本的陪伴', description: '我们技艺精湛的向导确保您的登山之旅得到妥善照顾，始终将安全、符合道德标准的徒步方式及顺畅的登顶之路放在首位。'},
      {title: '扎根坦桑尼亚', subtitle: '本地专家，专属行程', description: '我们精心安排乞力马扎罗定制徒步体验，从经济实惠的登山到豪华探险，皆秉承负责任且符合道德标准的登山理念。'},
    ].map((b) => ({_type: 'routeTrustBadge', _key: key(), title: b.title, subtitle: b.subtitle, description: b.description})),
    routeCtaBand: {
      heading: '准备好迎接乞力马扎罗的挑战了吗？',
      body: '您通往非洲之巅的旅程，从这里开始。无论您追求的是一生难忘的探险，还是希望突破自我极限、直至登顶，我们都将在每一步为您悉心引导。',
      buttons: [
        {_type: 'ctaButton', _key: key(), label: '登顶挑战', href: '/contact-us/', variant: 'outline'},
        {_type: 'ctaButton', _key: key(), label: '开始登山', href: '/contact-us/', variant: 'solid'},
      ],
      image: await uploadImage(client, {src: '/images/routes/shared/section-bg.webp', alt: '乞力马扎罗火山口岩石在朝阳下熠熠生辉'}),
    },
    hubCtaBandImage: await uploadImage(client, {src: '/images/routes/hub/hero-kilimanjaro.jpg', alt: '一名徒步者的剪影，正从乞力马扎罗山上观赏日出'}),
    routeGuidePromos: [
      {color: 'bg-primary', heading: '查阅我们的乞力马扎罗指南', body: '获取为登山做准备所需的全部关键信息。我们的指南涵盖从路线选择到安全建议的方方面面，助您顺利完成一次成功的登山之旅。', ctaLabel: '继续阅读', href: '/kilimanjaro-climbing-guide/'},
      {color: 'bg-secondary', heading: '登山专家建议', body: '尽管乞力马扎罗欢迎各个水平的登山者，但谨慎徒步至关重要。我们经验丰富的向导会监测您的健康状况，为您提供全面支持，确保旅程安全愉快。', ctaLabel: '继续阅读', href: '/kilimanjaro-climbing-guide/'},
      {color: 'bg-[#a05a52]', heading: '您的乞力马扎罗装备清单', body: '借助我们完整的装备清单，为登山做好最佳准备，清单详细列出了成功、舒适登山所需的一切必备物品。', ctaLabel: '继续阅读', href: '/kilimanjaro-packing-list/'},
    ].map((p) => ({_type: 'guidePromo', _key: key(), color: p.color, heading: p.heading, body: p.body, ctaLabel: p.ctaLabel, href: p.href})),
    routeRelatedGuides: [
      {label: '攀登乞力马扎罗的最佳时间', href: '/best-time-to-climb-kilimanjaro/'},
      {label: '攀登乞力马扎罗的费用', href: '/kilimanjaro-climb-cost/'},
      {label: '乞力马扎罗装备清单', href: '/kilimanjaro-packing-list/'},
      {label: '独自攀登乞力马扎罗', href: '/solo-kilimanjaro-climb/'},
      {label: '攀登乞力马扎罗山安全吗？', href: '/is-climbing-kilimanjaro-safe/'},
      {label: '乞力马扎罗背夫', href: '/kilimanjaro-porters/'},
      {label: '乞力马扎罗的饮食', href: '/kilimanjaro-food/'},
      {label: '乞力马扎罗高原反应', href: '/kilimanjaro-altitude-sickness/'},
      {label: '乞力马扎罗满月登山', href: '/kilimanjaro-fullmoon-climb/'},
      {label: '乞力马扎罗的典型一天', href: '/typical-day-on-kilimanjaro/'},
      {label: '乞力马扎罗野生动物园', href: '/kilimanjaro-safaris/'},
      {label: '乞力马扎罗山的趣闻', href: '/mount-kilimanjaro-facts/'},
      {label: '如何前往乞力马扎罗', href: '/getting-to-kilimanjaro/'},
    ].map((g) => ({_type: 'navLink', _key: key(), label: g.label, href: g.href})),
    routeReviewStats: {
      tripAdvisor: {
        heading: '在 TripAdvisor 上留下评价',
        subheading: 'TripAdvisor 盛赞 Asili Explorer African Safaris',
        body: '凭借超过779条持续增长的评价，95% 的用户给予「极佳」评价，5% 给予「非常好」评价，充分证明了我们致力于打造难忘野生动物园与徒步体验的承诺。',
      },
      google: {
        subheading: 'Google 评价盛赞我们的服务',
        body: '凭借超过99条五星评价，Asili Explorer African Safaris 持续超越客户期望，提供一流服务、专家带领的行程及独特的探险体验。',
      },
    },
    routeTestimonials: [
      {
        name: 'Pastacieo',
        timeAgo: '2024年8月',
        heading: '一生难忘的登山之旅！',
        quote: [{text: '我们与'}, {text: 'Asili Explorer African Safaris', bold: true}, {text: '一起进行的乞力马扎罗登山之旅真的非凡出色！从头到尾，团队都确保了一段难忘的体验，让我们的登顶之旅顺利、安全且值得铭记。'}],
      },
      {
        name: 'Danny G',
        timeAgo: '2023年9月',
        heading: '一次非凡的徒步之旅',
        quote: [{text: 'Asili Explorer African Safaris 保持'}, {text: '五星口碑', bold: true}, {text: '一点也不令人意外。他们的专业知识、职业素养以及对客户满意度的承诺使其脱颖而出。如果您正在寻找最好的乞力马扎罗徒步公司，不必再看别处！'}],
      },
      {
        name: 'Christian R',
        timeAgo: '2024年9月',
        heading: '强烈推荐的乞力马扎罗徒步之旅',
        quote: [{text: '2023年10月，我们与 Asili Explorer African Safaris 一起进行了'}, {text: '为期六天的乞力马扎罗登顶徒步', bold: true}, {text: '。这次体验非凡出色，我强烈推荐给任何正在考虑这场探险的人。'}],
      },
    ].map((t) => ({_type: 'routeTestimonial', _key: key(), name: t.name, timeAgo: t.timeAgo, heading: t.heading, quote: [segmentsToBlock(t.quote)]})),
    routeGuestReviews: {
      heading: '我们客户的评价',
      items: [
        {name: 'Chelsea H', summitDate: '登顶日期：2024年1月27日', heading: '一次难以置信的体验', quote: '我们通过乞力马扎罗背夫援助项目发现了 Asili Explorer African Safaris，因为我们希望支持一家善待背夫的公司……'},
        {name: 'Fabiola N', summitDate: '登顶日期：2024年8月30日', heading: '难以置信的蜜月之旅！', quote: '我们与 Asili Explorer African Safaris 的体验简直棒极了！从规划伊始，我们就知道自己得到了妥善的照顾。Albin 非常细致地……'},
        {name: 'Adeline P', summitDate: '登顶日期：2024年9月29日', heading: '有史以来最棒的假期', quote: '我和朋友与 Asili Explorer African Safaris 一同度过了一段绝对令人难以置信的体验！从头到尾，每一个细节都得到了细致周到的处理……'},
        {name: 'Anastasia F', summitDate: '登顶日期：2024年8月10日', heading: '一生难忘的登山之旅！', quote: '我们与 Asili Explorer African Safaris 一起进行的乞力马扎罗登山之旅真的非凡出色！我们的向导 Godwin 表现得非常出色——他渊博的知识……'},
      ].map((r) => ({_type: 'guestReview', _key: key(), name: r.name, summitDate: r.summitDate, heading: r.heading, quote: r.quote})),
    },
    routePackagesCta: {
      heading: '乞力马扎罗登山套餐',
      body: '从我们精心设计的乞力马扎罗登山套餐中挑选，每一款都旨在根据您的喜好、体能状况及理想路线，为您带来最佳体验。无论您追求一次快速登山，还是希望体验一段更长、风景更秀丽的徒步之旅，我们都能为您提供完美的路线选择。',
      ctaLabel: '查看套餐',
      href: '/kilimanjaro-packages/',
    },
    packageTrustBadges: badges('packageBadge', [
      {title: '最佳服务保障', description: '持证登山向导、厨师及背夫'},
      {title: '快速响应', description: '全天候24/7支持'},
    ]),
    packageStandardIntro:
      '在 Asili Climbing Kilimanjaro，我们相信每一位徒步者都是独一无二的。因此，我们所有的行程都具有灵活性，可根据您的节奏、喜好及目标进行调整。让我们协助您打造一段独一无二、一生难忘的登山探险。',
    packageInterestedCta: {
      heading: '对这条路线感兴趣吗？',
      body: '如果这条路线让您心动，不要再等待！立即预订您的名额，为一段充满非凡体验的难忘旅程做好准备。今天就预订您的行程，让探险就此启程！',
      ctaLabel: '预订这条路线',
    },
    packageExpertCta: {
      heading: '与坦桑尼亚专家携手，让您的梦想假期成为现实。',
      body: '在坦桑尼亚专家的协助下，您可以个性化定制您的探险之旅。我们建议的行程可根据您的喜好进行调整。我们的专业顾问将与您携手合作，为您打造完美的旅程！',
      ctaLabel: '立即索取报价',
    },
    packageHeroImage: await uploadImage(client, {src: '/images/packages/shared/hero-night.jpg', alt: '乞力马扎罗山脚下银河下的帐篷'}),
    comboTrustBadges: badges('comboBadge', [
      {title: '最佳价格与服务保障', description: '最优秀的野生动物园向导兼司机'},
      {title: '快速响应', description: '全天候24/7支持'},
    ]),
    comboPriceDisclaimer: '*每人价格，包含向导、野生动物园车辆、酒店及公园门票，不含国际航班（以六人成行为基础计算）',
    comboStandardIntro:
      '与 Asili Climbing Kilimanjaro 一起，实现您梦想中的旅程。在 Asili Explorer Tanzania Safari，您可以个性化定制自己的行程。我们提供的示例行程可根据您的喜好进行调整。',
    comboHeroImage: await uploadImage(client, {src: '/images/packages/shared/hero-night.jpg', alt: '乞力马扎罗山脚下银河下的帐篷'}),
    safariTrustBadges: badges('safariBadge', [
      {title: '最佳价格与服务保障', description: '最优秀的野生动物园向导兼司机'},
      {title: '快速响应', description: '全天候24/7支持'},
    ]),
    safariInterestedCta: {
      heading: '对这条路线感兴趣吗？',
      body: '如果这条路线让您心动，不要再等待！立即预订您的名额，为一段充满非凡体验的难忘旅程做好准备。今天就预订您的行程，让探险就此启程！',
      ctaLabel: '预订这条路线',
    },
  })
  console.log('sharedTripContent-zh created/replaced')
}

async function seedPackagesHubZh() {
  const cards = [
    {title: 'Lemosho 路线 8 天', slug: '8-days-lemosho-route', nights: '7晚', summary: '通过8天的行程安排，您在 Lemosho 路线上的乞力马扎罗徒步时间比其他选择更长。', image: {src: '/images/packages/hub/card-8-days-lemosho.webp', alt: 'Lemosho 路线 8 天'}},
    {title: 'Machame 路线 7 天', slug: '7-days-machame-route', nights: '6晚', summary: '踏上著名的 Machame 路线，全程7天的行程，为您带来更充裕的高原适应时间', image: {src: '/images/packages/hub/card-7-days-machame.webp', alt: 'Machame 路线 7 天'}},
    {title: 'Marangu 路线 6 天', slug: '6-days-marangu-route', nights: '5晚', summary: '通过著名的 Marangu 路线，用6天时间登顶非洲最高峰。沿途将欣赏到多样的风光……', image: {src: '/images/packages/hub/card-6-days-marangu.webp', alt: 'Marangu 路线 6 天'}},
    {title: 'Umbwe 路线 6 天', slug: '6-days-umbwe-route', nights: '5晚', summary: 'Umbwe 路线以其陡峭而富有挑战性的攀登过程，以及壮美却鲜有人涉足的小径而闻名。', image: {src: '/images/packages/hub/card-6-days-umbwe.webp', alt: 'Umbwe 路线 6 天'}},
    {title: 'Northern Circuit 9 天', slug: '9-days-northern-circuit-route', nights: '8晚', summary: '最新、最长的路线，提供360度全景视野，登顶成功率也是最高的。', image: {src: '/images/packages/hub/card-9-days-northern-circuit.webp', alt: 'Northern Circuit 9 天'}},
    {title: 'Rongai 路线 7 天', slug: '7-days-rongai-route', nights: '6晚', summary: '从北侧展开的这条路线，为您呈现乞力马扎罗独特的视角，非常适合……', image: {src: '/images/packages/hub/card-7-days-rongai.webp', alt: 'Rongai 路线 7 天'}},
  ]
  await client.createOrReplace({
    _id: 'packagesHubPage-zh',
    _type: 'packagesHubPage',
    language: 'zh',
    hero: {
      eyebrow: '非洲之巅。',
      heading: '乞力马扎罗登山套餐',
      locationPill: '坦桑尼亚北部',
      tagline: '选择您的路线。以您的方式登顶。',
      introHeading: '乞力马扎罗登山套餐',
      intro: '浏览我们的乞力马扎罗套餐系列，每一款都旨在契合您的探险风格、体能状况及行程安排。无论您追求热门路线，还是更为清静、人迹罕至的登山体验，我们都能为您提供完美之选。',
    },
    cards: await Promise.all(
      cards.map(async (card) => ({_type: 'packageHubCard', _key: key(), title: card.title, packageSlug: card.slug, nights: card.nights, summary: card.summary, image: await uploadImage(client, card.image)})),
    ),
  })
  console.log('packagesHubPage-zh created/replaced')
}

async function seedComboHubZh() {
  const cards = [
    {title: '乞力马扎罗与野生动物园 9 天', href: '/combo/9-days-kilimanjaro-safari/', nights: '8晚', summary: '非常适合时间有限的探险者。以6天路线登顶乞力马扎罗山，随后享受为期3天的短途野生动物园，游览 Ngorongoro 与 Tarangire 等坦桑尼亚著名公园。', image: {src: '/images/combo/9-days-kilimanjaro-safari/8-days-lemosho-route.webp', alt: '乞力马扎罗与野生动物园 9 天'}},
    {title: '乞力马扎罗与野生动物园 10 天', href: '/combo/10-days-kilimanjaro-and-safari/', nights: '9晚', summary: '一段均衡的探险之旅，将7天的乞力马扎罗登顶（如 Machame 路线）与3天的野生动物游猎相结合——是同时领略高山与草原精华的理想之选。', image: {src: '/images/combo/shared/7-days-machame-route.webp', alt: '乞力马扎罗与野生动物园 10 天'}},
    {title: '乞力马扎罗与野生动物园 11 天', href: '/combo/11-days-kilimanjaro-safari/', nights: '10晚', summary: '这一方案让您有充分时间在7天的登顶行程中彻底适应高原，随后于4天的野生动物园中放松身心，游览塞伦盖蒂、Ngorongoro 及其他不容错过的公园。', image: {src: '/images/combo/shared/6-days-marangu-route.webp', alt: '乞力马扎罗与野生动物园 11 天'}},
    {title: '乞力马扎罗与野生动物园 12 天', href: '/combo/12-days-kilimanjaro-safari/', nights: '11晚', summary: '为自然爱好者打造的完整体验。用8天时间登顶非洲最高峰（如 Lemosho 路线），随后享受4天令人难忘的野生动物观赏之旅。', image: {src: '/images/combo/shared/6-days-umbwe-route.webp', alt: '乞力马扎罗与野生动物园 12 天'}},
    {title: '乞力马扎罗与野生动物园 13 天', nights: '12晚', summary: '专为希望从容不迫的旅行者设计。行程包含更长的乞力马扎罗登山之旅及深度野生动物园体验，兼顾节奏合理的徒步与身临其境的摄影游猎。', image: {src: '/images/combo/shared/9-days-northern-circuit-1.webp', alt: '乞力马扎罗与野生动物园 13 天'}},
    {title: '乞力马扎罗与野生动物园 14 天', nights: '13晚', summary: '终极的坦桑尼亚两周之旅。从风景秀丽、人流稀少的乞力马扎罗路线开始，随后沉浸于涵盖塞伦盖蒂、Ngorongoro、Tarangire 等地的完整野生动物园环线之中。', image: {src: '/images/combo/shared/7-days-rongai-routes-1.webp', alt: '乞力马扎罗与野生动物园 14 天'}},
  ]
  await client.createOrReplace({
    _id: 'comboHubPage-zh',
    _type: 'comboHubPage',
    language: 'zh',
    intro: {
      heading: '组合套餐',
      body: [
        '登顶非洲之巅，随后在荒野中尽情放松。一次旅程，两段难忘体验。',
        '在 Asili Climbing Kilimanjaro，我们坚信，终极的坦桑尼亚探险不应局限于单一目的地。我们的乞力马扎罗与野生动物园组合套餐，专为渴望鱼与熊掌兼得的旅行者打造——将攀登乞力马扎罗的挑战，与经典非洲野生动物园的刺激完美结合。这些精心设计的行程，将两段不容错过的体验融为一次流畅而收获满满的旅程。',
        '无论您选择标志性的 Lemosho 路线，还是征服风景秀丽的 Marangu 路线，您的登山之旅都能顺畅衔接，转变为一场穿越坦桑尼亚最富传奇色彩的国家公园的精彩野生动物园之旅——塞伦盖蒂、Ngorongoro 火山口、Tarangire、Lake Manyara 等等。',
      ].map(paragraphBlock),
    },
    cards: await Promise.all(
      cards.map(async (card) => ({
        _type: 'comboHubCard',
        _key: key(),
        title: card.title,
        ...(card.href ? {href: card.href} : {}),
        nights: card.nights,
        summary: card.summary,
        image: await uploadImage(client, card.image),
      })),
    ),
    cta: {label: '准备好迎接挑战了吗？', href: '/contact-us/'},
  })
  console.log('comboHubPage-zh created/replaced')
}

async function run() {
  await seedSharedZh()
  await seedPackagesHubZh()
  await seedComboHubZh()
  console.log('done')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
