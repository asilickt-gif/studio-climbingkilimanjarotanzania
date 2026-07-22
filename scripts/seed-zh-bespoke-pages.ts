/**
 * Phase 6 (Chinese): the 6 bespoke page singletons (aboutPage, contactPage,
 * requestQuotePage, zanzibarPage, tanzaniaSafariPage, safariToursPage).
 * Mirrors seed-it-bespoke-pages.ts's structure but with Chinese text.
 *
 * Run from the studio folder:
 *   npx sanity exec scripts/seed-zh-bespoke-pages.ts --with-user-token
 */
import {getCliClient} from 'sanity/cli'
import {key, segmentsToBlock} from './lib/pt'
import {uploadImage} from './lib/assets'

const client = getCliClient({apiVersion: '2026-07-01'})

async function seedAboutZh() {
  await client.createOrReplace({
    _id: 'aboutPage-zh',
    _type: 'aboutPage',
    language: 'zh',
    seo: {
      _type: 'seo',
      title: '关于 Asili Climbing Kilimanjaro | 最佳乞力马扎罗旅行社',
      description:
        '了解 Asili Climbing Kilimanjaro——一家深耕本地、经验丰富、对非洲探险充满热情的坦桑尼亚精品旅行社。',
    },
    hero: {
      heading: '最佳乞力马扎罗旅行社',
      backgroundImage: await uploadImage(client, {
        src: '/images/about-asili-explorer/hero.webp',
        alt: '一列徒步者穿越石楠植被前往乞力马扎罗山',
      }),
    },
    intro: {
      eyebrow: '关于我们 - Climbing Kilimanjaro Tanzania',
      sections: [
        {
          body: '我们根据您的预算与喜好，为每一次野生动物园体验量身定制，确保为您专属打造完美行程。从您的首次咨询到最后的机场送机，我们承诺在每一个环节都提供卓越的客户服务。',
        },
        {
          body: '就野生动物园体验而言，坦桑尼亚出色的野生动物资源，以及众多壮丽的国家公园与自然保护区，使其成为非洲进行野生动物园之旅的理想之地。无论您更喜欢乘坐车辆探险，还是尝试更具冒险精神的活动，如向导徒步甚至皮划艇，您都能拥有丰富多样的选择。',
        },
        {
          body: '坦桑尼亚的国家公园，如 Lake Manyara、Ngorongoro、Tarangire 及著名的塞伦盖蒂，让您有机会观赏传说中的非洲五霸，以及众多其他动物、鸟类与昆虫，这些物种在世界其他地方几乎难以见到。',
        },
        {
          body: '坦桑尼亚同时也是马赛部落的故乡，若不与这个民族相遇，并前往人类摇篮 Olduvai 峡谷参观，便称不上完整的坦桑尼亚之旅。对于喜爱冒险的旅行者而言，攀登传奇的乞力马扎罗山，或规模较小却同样壮丽的梅鲁山，也是不错的选择。而热爱阳光、沙滩与放松的旅行者，则可以造访壮丽的桑给巴尔——这座岛屿避风港，其文化遗产与海滩、热带雨林一样引人入胜。',
        },
        {
          body: '在 Asili Climbing Kilimanjaro，我们将野生动物园探险提升至全新的探索与卓越水准。我们的愿景是提供难忘且高品质的探险体验，充分展现非洲的自然壮丽。我们注重品质与细节，力求在野生动物园领域追求卓越，带来非凡的野生动物邂逅与令人铭记的旅行体验。我们秉持环境保护、文化敏感度及社区赋能的理念，致力于负责任的旅游业发展。',
        },
        {
          body: 'Asili Climbing Kilimanjaro 的每一位员工都对非洲拥有丰富的知识，并怀有由衷的热情。从我们的本地员工到国际代理，团队中每一位成员都堪称野生动物园专家。我们亲身走访酒店、探索公园，并与航空公司进行谈判，只为让您获得最优惠的价格与最佳的体验。',
        },
        {
          heading: '您的向导就是您与非洲的连接',
          body: 'Asili Climbing Kilimanjaro 只聘用最友善、最富经验的司机。我们所有的向导都能说英语，并对非洲的野生动物、鸟类及植物怀有真挚的热爱。他们无所不知，并乐于解答您的任何疑问！我们的向导不仅每天为您驾车，更是您通往所游览公园、所遇见野生动物、所结识人们乃至更多精彩体验的关键所在。无论是 Dickson、Bashiru、Lomayani、Alex，还是我们其他技艺精湛的司机，您都能获得妥善的照顾。我们也可根据要求，安排能说德语、西班牙语、意大利语、法语、中文、韩语等其他语言的向导。',
        },
        {
          body: 'Asili Climbing Kilimanjaro 专注于打造满足您一切需求的私人定制野生动物园之旅。无论您梦想着通过经济实惠的露营徒步之旅重新与自然连接，还是希望以极致奢华的方式体验非洲，我们都将全程陪伴您，共同打造终极行程。我们自豪于提供世界级的客户服务，满足客户的每一项需求。',
        },
        {
          body: '尽管大多数其他野生动物园公司会对摄影游猎设置行驶里程或油量限制，我们却在您入住的每一天，提供从早上6点到晚上6点不受限制的摄影游猎服务。您可以完全掌控自己的一天。想要整天游猎并在塞伦盖蒂野餐？完全没问题！想要睡到很晚，享受悠闲的早晨，再出发参加日落摄影游猎？同样没有问题！一切由您决定！',
        },
      ].map((section) => ({
        _type: 'aboutSection',
        _key: key(),
        ...(section.heading ? {heading: section.heading} : {}),
        body: section.body,
      })),
    },
    bodyImage: await uploadImage(client, {
      src: '/images/about-asili-explorer/about-photo.jpg',
      alt: '一对情侣在坦桑尼亚稀树草原的金合欢树下享用日落晚餐',
    }),
    fleetSection: {
      heading: '我们的车队与舒适的车内体验',
      body:
        'Asili Climbing Kilimanjaro 专门设计的车队，是体验非洲野生动物园的理想方式。我们的丰田陆地巡洋舰4x4车辆经过专门改装，配备可开启车顶、滑动车门及加长车身，确保为您带来360度全景视野，尽览所有精彩瞬间，让您在舒适与安全中尽享旅程。我们的所有车辆在每次野生动物园之旅结束后都会进行维护保养，并每年进行一次全面检修，以确保高标准的安全性与舒适度。此外，我们所有的车辆都配备充电站、急救箱、冰箱及WiFi（仅限坦桑尼亚境内）。\n\n「野生动物园午餐盒」在业内的口碑一直不算出色。尽管每家旅馆都尽力让这一环节令人愉悦，但某种程度的重复性依然难以避免。我们从第一天起便聘请了专业厨师负责准备午餐盒，品质上的差异十分显著。既然能享用热腾腾的餐食、新鲜制作的食材，再配上一杯现磨咖啡，何必满足于袋子里干巴巴的三明治和薄脆片呢？\n\n出于以上及其他诸多原因，我们是助您实现梦想中非洲野生动物园之旅的理想团队。\n\n如果您尚未行动，欢迎随时联系我们，开始规划您理想的野生动物园之旅。',
    },
    quote:
      '「一个人鲜活精神的真正根基，在于他对冒险的热情。生命的喜悦源自我们与新体验的相遇，因此再没有比拥有一个不断变化的地平线更大的喜悦了——每一天都有一个崭新而不同的太阳」',
    ctaHeading: '让我们帮助您',
  })
  console.log('aboutPage-zh created/replaced')
}

async function seedContactZh() {
  await client.createOrReplace({
    _id: 'contactPage-zh',
    _type: 'contactPage',
    language: 'zh',
    seo: {
      _type: 'seo',
      title: '联系 Asili | Climbing Kilimanjaro Tanzania',
      description:
        '准备好征服乞力马扎罗了吗？立即联系 Climbing Kilimanjaro Tanzania，让我们的专家团队协助您规划登山之旅。',
    },
    pageTitle: '联系 Asili',
    hero: {
      backgroundImage: await uploadImage(client, {
        src: '/images/contact/hero.webp',
        alt: '乞力马扎罗山耸立于非洲稀树草原的金合欢树之上',
      }),
      heading: '联系我们',
      subheading: '准备好征服乞力马扎罗了吗？让我们一起实现它！',
    },
    intro: {
      heading: '与 Climbing Kilimanjaro Tanzania 一起开启您的登山之旅',
      body: '无论您是在规划人生第一次登顶，还是再次回归开启新的探险，我们都将在每一步为您悉心引导。立即联系我们——我们的专家团队随时准备解答您的问题，为您的徒步之旅量身定制，并协助您准备这场一生难忘的旅程。',
      contactLabel: '联系 Climbing Kilimanjaro Tanzania',
      location: '阿鲁沙 – 坦桑尼亚',
      imageLeft: await uploadImage(client, {src: '/images/contact/camp.jpg', alt: '乞力马扎罗山顶下方的营地帐篷'}),
      imageRight: await uploadImage(client, {src: '/images/contact/summit.webp', alt: '一名登山者在 Uhuru Peak 山顶标志前庆祝'}),
    },
    form: {
      eyebrow: '联系我们',
      heading: '我们的专家将很快与您联系。',
      routeOptions: [
        'Marangu 路线 5 天',
        'Machame 路线 6 天',
        'Marangu 路线 6 天',
        'Umbwe 路线 6 天',
        'Lemosho 路线 7 天',
        'Machame 路线 7 天',
        'Rongai 路线 7 天',
        'Lemosho 路线 8 天',
        'Northern Circuit 路线 9 天',
        '尚未确定',
      ],
    },
  })
  console.log('contactPage-zh created/replaced')
}

async function seedRequestQuoteZh() {
  await client.createOrReplace({
    _id: 'requestQuotePage-zh',
    _type: 'requestQuotePage',
    language: 'zh',
    seo: {
      _type: 'seo',
      title: '索取报价 | Asili Climbing Kilimanjaro',
      description:
        '在 Asili Climbing Kilimanjaro，为您的坦桑尼亚野生动物园之旅或乞力马扎罗登山之旅获取免费个性化报价。告诉我们您的出行日期与需求，其余交给我们处理。',
    },
    hero: {
      heading: '索取坦桑尼亚野生动物园报价',
      subheading: '立即获取您坦桑尼亚野生动物园之旅的免费报价',
    },
    contactInfo: {
      address: 'Sakina, 阿鲁沙',
      officeHours: '周一至周日：全天24小时，每周7天',
      whatsappHref: 'https://wa.me/255767140150',
    },
    intro:
      '准备好规划您梦想中的坦桑尼亚之旅了吗？您的探险从这里开始——通过我们的行程咨询板块，探索符合您兴趣的定制化旅程。',
    howToHeading: '如何索取个性化报价',
    howToBody: [
      segmentsToBlock([
        {text: '联系我们的野生动物园与'},
        {text: '乞力马扎罗', bold: true, href: '/climbing-mount-kilimanjaro/'},
        {
          text: '专家团队。我们已帮助数千名旅行者，在符合预算的前提下，实现坦桑尼亚愿望清单上的每一项目标，无需承受自行规划一切的压力。今天就带着您的坦桑尼亚心愿清单联系我们，让我们携手打造属于您的终极野生动物园与徒步探险之旅。',
        },
      ]),
    ],
  })
  console.log('requestQuotePage-zh created/replaced')
}

async function seedZanzibarZh() {
  const cards = [
    {
      title: '桑给巴尔蜜月之旅 - 6天',
      price: '每人875美元',
      location: '桑给巴尔石头城 > 桑给巴尔',
      image: {src: '/images/zanzibar/honeymoon.jpg', alt: '浪漫的海滩布置，双人餐桌上用玫瑰花瓣拼出LOVE字样'},
    },
    {
      title: '探索桑给巴尔岛 - 3天',
      price: '每人528美元',
      location: 'Abeid Amani Karume 国际机场 > 桑给巴尔 > 桑给巴尔石头城',
      image: {src: '/images/zanzibar/island-3.webp', alt: '桑给巴尔一座郁郁葱葱的小岛航拍图，拥有白沙滩与木质码头'},
    },
    {
      title: '探索印度洋 - 6天',
      price: '每人890美元',
      location: '桑给巴尔 > 桑给巴尔石头城',
      image: {src: '/images/zanzibar/rock-restaurant.jpg', alt: 'The Rock 餐厅坐落于桑给巴尔近海碧绿水域中的一处珊瑚礁上'},
    },
    {
      title: '桑给巴尔印度洋之旅 - 6天',
      price: '每人1918美元',
      location: '桑给巴尔石头城 > 桑给巴尔',
      image: {src: '/images/zanzibar/zanzibar5.jpg', alt: '一对情侣躺在沙滩椅上欣赏印度洋日落'},
    },
    {
      title: '桑给巴尔印度洋风光 - 6天',
      price: '每人1146美元',
      location: '桑给巴尔石头城 > 桑给巴尔',
      image: {src: '/images/zanzibar/paje-beach.jpg', alt: '白沙滩沿岸的棕榈树与草编遮阳伞，海水呈碧绿色'},
    },
    {
      title: '坦桑尼亚桑给巴尔岛之旅 - 5天',
      price: '每人1439美元',
      location: '桑给巴尔石头城 > 桑给巴尔',
      image: {src: '/images/zanzibar/hero.webp', alt: '潜水员在桑给巴尔近海清澈水域探索绚丽的珊瑚礁'},
    },
  ]
  await client.createOrReplace({
    _id: 'zanzibarPage-zh',
    _type: 'zanzibarPage',
    language: 'zh',
    seo: {
      _type: 'seo',
      title: '桑给巴尔旅游 | Asili Climbing Kilimanjaro',
      description:
        '与 Asili Climbing Kilimanjaro 一起探索桑给巴尔——白沙滩、石头城文化及印度洋探险，与您的坦桑尼亚之旅完美衔接。',
    },
    hero: {
      heading: '桑给巴尔',
      backgroundImage: await uploadImage(client, {src: '/images/zanzibar/hero.webp', alt: '潜水员在桑给巴尔近海清澈水域探索绚丽的珊瑚礁'}),
    },
    cards: await Promise.all(
      cards.map(async (card) => ({
        _type: 'zanzibarCard',
        _key: key(),
        title: card.title,
        price: card.price,
        location: card.location,
        image: await uploadImage(client, card.image),
      })),
    ),
  })
  console.log('zanzibarPage-zh created/replaced')
}

async function seedTanzaniaSafariZh() {
  const cards = [
    {
      title: 'Mara 河大迁徙野生动物园 - 7天',
      price: '每人4692美元',
      image: {src: '/images/tanzania-safari-tours/luxury.webp', alt: '拥有无边泳池的豪华旅馆，可俯瞰暮色下的塞伦盖蒂'},
    },
    {
      title: 'Simba 野生动物园 - 5天',
      price: '每人2422美元',
      image: {src: '/images/tanzania-safari-tours/elephant.jpg', alt: '两头大象在坦桑尼亚用象鼻互相问候'},
    },
    {
      title: '坦桑尼亚经典之旅 - 7天',
      price: '每人3273美元',
      image: {src: '/images/destinations/serengeti.webp', alt: '一头母狮与两只幼崽在塞伦盖蒂草原上休息'},
    },
    {
      title: '坦桑尼亚舒适体验 - 7天',
      price: '每人3326美元',
      image: {src: '/images/tanzania-safari-tours/comfort.webp', alt: '掩映于林冠之下的雅致帐篷营地'},
    },
    {
      title: '坦桑尼亚豪华露营野生动物园体验 - 5天',
      price: '每人2383美元',
      image: {src: '/images/tanzania-safari-tours/mid-range.webp', alt: '傍晚时分拥有泳池与郁郁葱葱花园的旅馆'},
    },
    {
      title: '角马大迁徙野生动物园 - 9天',
      price: '每人6239美元',
      image: {src: '/images/destinations/ngorongoro.webp', alt: '两头白犀牛在 Ngorongoro 火山口的草地上相对而立'},
    },
  ]
  await client.createOrReplace({
    _id: 'tanzaniaSafariPage-zh',
    _type: 'tanzaniaSafariPage',
    language: 'zh',
    seo: {
      _type: 'seo',
      title: '坦桑尼亚野生动物园套餐 | Asili Climbing Kilimanjaro',
      description:
        '浏览 Asili Climbing Kilimanjaro 最受欢迎的坦桑尼亚野生动物园套餐——大迁徙野生动物园、经典观赏之旅、豪华露营及舒适型体验。',
    },
    hero: {
      eyebrow: '行程类型：坦桑尼亚野生动物园',
      heading: '坦桑尼亚野生动物园套餐',
      backgroundImage: await uploadImage(client, {src: '/images/tanzania-safari-tours/hero.webp', alt: '一头狮子与一只幼崽在坦桑尼亚一同在岩石上休息'}),
    },
    cards: await Promise.all(
      cards.map(async (card) => ({
        _type: 'safariCard',
        _key: key(),
        title: card.title,
        price: card.price,
        image: await uploadImage(client, card.image),
      })),
    ),
  })
  console.log('tanzaniaSafariPage-zh created/replaced')
}

async function seedSafariToursZh() {
  await client.createOrReplace({
    _id: 'safariToursPage-zh',
    _type: 'safariToursPage',
    language: 'zh',
    seo: {
      _type: 'seo',
      title: '坦桑尼亚野生动物园之旅 | Asili Climbing Kilimanjaro',
      description:
        '探索非洲最壮观的野生动物盛景。与 Asili Climbing Kilimanjaro 一起，穿越塞伦盖蒂、Ngorongoro 火山口及更多目的地，展开坦桑尼亚野生动物园之旅。',
    },
    hero: {
      eyebrow: '坦桑尼亚野生动物园',
      heading: '坦桑尼亚野生动物园之旅',
      backgroundImage: await uploadImage(client, {src: '/images/tanzania-safari-tours/hero.webp', alt: '一头狮子与一只幼崽在坦桑尼亚一同在岩石上休息'}),
    },
    intro: {
      title: '坦桑尼亚野生动物园：探索非洲最壮观的野生动物盛景',
      body: '坦桑尼亚不仅仅是一个旅行目的地——它是一份邀请，邀您领略非洲野性而壮丽的全部风采。凭借广袤的稀树草原、遍布野生动物的生态、标志性的国家公园以及真实的文化交流，坦桑尼亚的野生动物园之旅堪称世界上独一无二的体验。无论您是初次尝试野生动物园的新手，还是经验丰富的探险家，坦桑尼亚每一天都能为您带来难忘的时刻。\n\n从传奇的塞伦盖蒂草原，到世界上最大且完整无缺的火山破火山口——Ngorongoro 火山口，坦桑尼亚承诺让您近距离邂逅非洲五霸、角马大迁徙、古老的猴面包树，以及无尽的金色日落。',
    },
    whereToGo: {
      eyebrow: '关于坦桑尼亚您需要了解的一切',
      heading: '坦桑尼亚该去哪里',
      body: '坦桑尼亚是一片充满震撼对比的土地——从乞力马扎罗雪覆的山巅，到塞伦盖蒂的金色草原，再到桑给巴尔郁郁葱葱的热带海滩，以及 Ngorongoro 深邃而野生动物繁盛的火山口。无论您追求冒险、野生动物、文化，还是放松身心，Asili Climbing Kilimanjaro 都能凭借经验丰富的本地向导与量身定制的行程，助您比任何人都更深入地探索坦桑尼亚。',
      image: await uploadImage(client, {src: '/images/tanzania-safari-tours/elephant.jpg', alt: '两头大象在坦桑尼亚用象鼻互相问候'}),
    },
    tourStyles: {
      eyebrow: '探索野生动物园之旅',
      heading: '坦桑尼亚热门野生动物园风格',
      styles: await Promise.all(
        [
          {label: '坦桑尼亚豪华野生动物园', image: {src: '/images/tanzania-safari-tours/luxury.webp', alt: '拥有无边泳池的豪华旅馆，可俯瞰暮色下的塞伦盖蒂'}},
          {label: '坦桑尼亚舒适型野生动物园', image: {src: '/images/tanzania-safari-tours/comfort.webp', alt: '掩映于林冠之下的雅致帐篷营地'}},
          {label: '坦桑尼亚中端野生动物园', image: {src: '/images/tanzania-safari-tours/mid-range.webp', alt: '傍晚时分拥有泳池与郁郁葱葱花园的中端旅馆'}},
          {label: '坦桑尼亚经济型露营野生动物园', image: {src: '/images/tanzania-safari-tours/luxury.webp', alt: '为露营野生动物园搭建于树下的帆布野营帐篷'}},
        ].map(async (style) => ({_type: 'tourStyle', _key: key(), label: style.label, image: await uploadImage(client, style.image)})),
      ),
    },
    seasons: {
      eyebrow: '坦桑尼亚季节概览',
      heading: '游览坦桑尼亚的最佳月份是什么时候？',
      intro:
        '坦桑尼亚野生动物园之旅并没有放之四海皆准的方案。您希望根据自己的心愿获得最佳体验。请浏览各个月份，了解您在游览期间会遇到的情况。',
      months: [
        {month: '1月', body: '此时正是领略坦桑尼亚自然之美的绝佳时机，色彩缤纷、生机盎然。早在1月，您就能欣赏到郁郁葱葱的风光及绝佳的摄影机会，令人叹为观止！'},
        {month: '2月', body: '坦桑尼亚的2月是观赏幼崽在稀树草原上迈出人生第一步的绝佳时机。最佳观赏地是 Ndutu，数百万只角马在这个被称为「产仔季」的短暂时期聚集并产下幼崽。尽管午后可能出现雷雨，但降雨也会带来风光的转变。'},
        {month: '3月', body: '3月常被人们忽视，认为不是游览坦桑尼亚的最佳时机。然而，这个月却拥有众多观赏机会，观鸟体验绝佳，且人流稀少！尽管天气有时炎热（且潮湿），但在这段时间，您可以观察到各种各样的野生动物——包括它们的幼崽！'},
        {month: '4月', body: '4月的坦桑尼亚是摄影师的天堂。绿意盎然、风景如画，幼崽与色彩斑斓的鸟类沿路可见，迎接此时到访的旅行者！4月的天气可能变化无常，但观赏体验与风光绝对物超所值。'},
        {month: '5月', body: '如果您想在旱季来临之前探索坦桑尼亚国家公园的生机，这是您最后的机会。5月时，您可以欣赏到郁郁葱葱的森林与广阔野生的草原，幼崽随处可见，而这一切即将随着景观的转变而消失。'},
        {month: '6月', body: '6月是游览及探索坦桑尼亚干燥风光的绝佳时机。这个月，动物会聚集在水源周围，游客将有众多观赏野生动物的机会。天气凉爽却阳光充沛，湿度适中，既不像后期那样过于潮湿，也不会像年末多风时那样尘土飞扬。'},
        {month: '7月', body: '如果您想体验真正意义上的野生动物园之旅，我们强烈建议在7月游览坦桑尼亚。随着干燥土地日渐稀少，动物们聚集在水源附近，在干旱的景观中格外容易被发现。'},
        {month: '8月', body: '漫长的旱季已经结束，动物们也有时间恢复体力。8月的坦桑尼亚为您提供了一个难得的机会——近距离观赏野生动物的绝佳时机！'},
        {month: '9月', body: '9月是游览坦桑尼亚的最佳时段之一，此时能见度更佳，阳光明媚。漫长旱季的结束意味着动物们正拼命寻找食物，这也提高了您在野生动物园中目睹精彩场面的机会！'},
        {month: '10月', body: '10月标志着坦桑尼亚漫长旱季的结束，这意味着动物活动达到了顶峰！无论是一日游还是在同一地点的长时间停留，都能看到密集的动物群体。由于这几个月车流量极少，您可以畅通无阻地穿越各个公园，无需担心被其他车辆堵住。如果您追求坦桑尼亚原汁原味的野生动物园氛围，这是完美的选择。'},
        {month: '11月', body: '11月的坦桑尼亚风光有望格外壮丽，短暂的雨季让大自然重新焕发生机。河流水量上涨，动物们四处觅食活跃异常，这预示着不容错过的绝佳野生动物观赏机会！'},
        {month: '12月', body: '12月是游览坦桑尼亚、欣赏这个壮丽国度自然之美的理想时节。历经一整年的离去后，鸟类将随着年度迁徙归来，展现其绚丽的风采！在12月造访坦桑尼亚，在温暖、舒适与自然之美中，为您的一年画上圆满的结尾。'},
      ].map((month) => ({_type: 'seasonMonth', _key: key(), month: month.month, body: month.body})),
    },
    whyTravelWithUs: {
      heading: '为什么选择与我们同行？',
      intro: '与 Asili Climbing Kilimanjaro 一起探索真实的非洲——每一段旅程都倾注了热情与专业。',
      features: [
        {description: '在我们专业且经验丰富的向导陪同下，尽享一段顺畅的探险之旅，确保为您带来充实丰富的旅行体验。'},
        {description: '作为一家本地公司，我们提供真实的视角，为您揭示隐藏的瑰宝与文化内涵，带来真正身临其境的旅行体验。'},
      ].map((feature) => ({_type: 'safariFeature', _key: key(), description: feature.description})),
    },
  })
  console.log('safariToursPage-zh created/replaced')
}

async function run() {
  await seedAboutZh()
  await seedContactZh()
  await seedRequestQuoteZh()
  await seedZanzibarZh()
  await seedTanzaniaSafariZh()
  await seedSafariToursZh()
  console.log('done')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
