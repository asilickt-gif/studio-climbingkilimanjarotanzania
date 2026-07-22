/**
 * Phase 6 (Chinese): the 3 legal standardPage docs (privacy-policy,
 * terms-and-conditions, cookies-policy). why-travel-with-us was already
 * seeded in seed-zh-bespoke-pages.ts.
 *
 * Run from the studio folder:
 *   npx sanity exec scripts/seed-zh-legal.ts --with-user-token
 */
import {getCliClient} from 'sanity/cli'
import {key, paragraphBlock, bulletBlock} from './lib/pt'
import {findEnId, upsertTranslatedDoc, linkTranslationMetadata} from './lib/i18n'

const client = getCliClient({apiVersion: '2026-07-01'})

interface ZhBlock {
  type: 'paragraph' | 'list'
  text?: string
  items?: string[]
}

interface ZhLegalPage {
  slug: string
  seoTitle: string
  seoDescription: string
  pageTitle: string
  intro: string
  sections: {heading: string; blocks: ZhBlock[]}[]
}

const pages: ZhLegalPage[] = [
  {
    slug: 'privacy-policy',
    seoTitle: '隐私政策 | Asili Climbing Kilimanjaro',
    seoDescription: '请查阅 Climbing Kilimanjaro Tanzania 的隐私政策，了解我们如何收集、使用、保存及保护您的个人信息。',
    pageTitle: '隐私政策',
    intro:
      '在 Climbing Kilimanjaro Tanzania，我们非常重视您的隐私。本隐私政策说明了当您使用我们的网站或服务时，我们如何收集、使用、保存及保护您的个人信息。',
    sections: [
      {
        heading: '我们收集哪些信息',
        blocks: [
          {type: 'paragraph', text: '我们可能会收集以下类型的个人信息：'},
          {
            type: 'list',
            items: [
              '个人资料：姓名、电子邮箱、电话号码、国籍、护照信息（用于预订）。',
              '预订信息：出行日期、住宿偏好、饮食需求、紧急联系人。',
              '支付信息：账单地址及支付方式（注意：我们不会保存信用卡数据）。',
              '网站使用数据：IP地址、浏览器类型、访问页面及其他分析数据。',
            ],
          },
        ],
      },
      {
        heading: '我们如何使用您的信息',
        blocks: [
          {type: 'paragraph', text: '我们将您的信息用于以下目的：'},
          {
            type: 'list',
            items: [
              '回复咨询请求',
              '处理并管理您的预订',
              '个性化您的体验，并推荐合适的行程',
              '改善我们的网站与服务',
              '履行我们的法律义务',
            ],
          },
          {
            type: 'paragraph',
            text: '我们绝不会出于营销目的将您的个人数据出售、出租或分享给第三方。',
          },
        ],
      },
      {
        heading: '谁可以访问您的数据',
        blocks: [
          {
            type: 'paragraph',
            text: '只有 Climbing Kilimanjaro 的授权员工，以及参与安排您行程的可信合作方（如野生动物园旅馆、酒店或运输公司）才能访问您的个人数据。这些合作方均有义务对您的信息保密并妥善保护。',
          },
        ],
      },
      {
        heading: 'Cookie 与追踪技术',
        blocks: [
          {type: 'paragraph', text: '我们的网站使用 Cookie，用途包括：'},
          {
            type: 'list',
            items: [
              '记住您的偏好设置',
              '了解用户与我们内容的互动方式',
              '提升网站的性能与功能',
            ],
          },
          {
            type: 'paragraph',
            text: '您可以通过浏览器设置调整 Cookie 设置，或将其完全禁用。',
          },
        ],
      },
      {
        heading: '数据安全',
        blocks: [
          {
            type: 'paragraph',
            text: '我们采取一切合理措施，通过安全服务器、加密工具及有限的访问权限来保护您的个人信息。尽管我们遵循最佳实践，但请注意，互联网上没有任何数据传输方式是百分之百安全的。',
          },
        ],
      },
      {
        heading: '您的权利',
        blocks: [
          {type: 'paragraph', text: '您有权：'},
          {
            type: 'list',
            items: [
              '访问我们所持有的关于您的个人数据',
              '要求更正或更新',
              '撤回同意，或要求删除您的数据',
              '如有需要，向数据保护机构提出投诉',
            ],
          },
          {type: 'paragraph', text: '如需行使您的权利，请与我们联系。'},
        ],
      },
      {
        heading: '第三方链接',
        blocks: [
          {
            type: 'paragraph',
            text: '我们的网站可能包含指向外部网站的链接。我们对这些第三方网站的隐私实践或内容不承担任何责任。',
          },
        ],
      },
      {
        heading: '本政策的更改',
        blocks: [
          {
            type: 'paragraph',
            text: '我们可能会不时更新本隐私政策。任何更改都将在本页面发布，并附有更新后的「生效日期」。我们建议您定期查阅本政策，以了解最新信息。',
          },
        ],
      },
      {
        heading: '联系我们',
        blocks: [
          {
            type: 'paragraph',
            text: '如果您对我们的隐私政策或数据处理方式有任何疑问或担忧，请与我们联系。',
          },
          {type: 'paragraph', text: '电话：+255 767 140 150。总部：坦桑尼亚阿鲁沙。'},
        ],
      },
    ],
  },
  {
    slug: 'terms-and-conditions',
    seoTitle: '条款与条件 | Asili Climbing Kilimanjaro',
    seoDescription: '请查阅适用于 Asili Climbing Kilimanjaro 所有徒步、野生动物园及组合套餐的条款与条件。',
    pageTitle: '条款与条件',
    intro:
      '通过预订 Asili Climbing Kilimanjaro 的行程，即表示您接受以下所述的条款与条件。这些条款适用于我们所有的徒步、野生动物园及组合套餐。',
    sections: [
      {
        heading: '1. 预订与确认',
        blocks: [
          {
            type: 'list',
            items: [
              '只有在收到定金及 Asili Climbing Kilimanjaro 的书面确认后，预订方可生效。',
              '所有旅行者必须提供准确的个人信息，包括全名（须与护照一致）、出行日期，以及任何医疗或饮食方面的特殊需求。',
              '以团队名义进行预订，即表示您接受对该团队所有成员承担相应责任。',
            ],
          },
        ],
      },
      {
        heading: '2. 付款',
        blocks: [
          {
            type: 'list',
            items: [
              '预订时需支付30%的定金。',
              '余款必须在行程开始前至少30天付清。',
              '可通过银行转账、信用卡或其他安全方式付款（可能产生手续费）。',
              '任何付款延迟都可能导致预订被取消且不予退款。',
            ],
          },
        ],
      },
      {
        heading: '3. 取消与退款',
        blocks: [
          {type: 'paragraph', text: '客户方取消：'},
          {
            type: 'list',
            items: [
              '出发前60天或更早：退还90%',
              '出发前30至59天：退还50%',
              '出发前不足30天：不予退款',
            ],
          },
          {type: 'paragraph', text: 'Asili Climbing Kilimanjaro 方取消：'},
          {
            type: 'list',
            items: [
              '我们保留因安全、天气或不可预见事件而取消任何行程的权利。在此情况下，您将获得全额退款，或获安排替代日期。',
            ],
          },
        ],
      },
      {
        heading: '4. 变更',
        blocks: [
          {
            type: 'list',
            items: [
              '客户要求的行程变更需视具体可用情况而定，且可能产生额外费用。',
              '姓名变更须在出行前15天内完成。',
              'Asili Climbing Kilimanjaro 保留因当地情况对行程做出微小调整的权利。',
            ],
          },
        ],
      },
      {
        heading: '5. 旅行保险',
        blocks: [
          {
            type: 'list',
            items: [
              '所有参与者必须持有有效的旅行保险，涵盖高海拔徒步（针对乞力马扎罗）',
              '紧急撤离',
              '医疗费用',
              '行程取消及中断',
            ],
          },
          {type: 'paragraph', text: '出行前可能需要提供保险证明。'},
        ],
      },
      {
        heading: '6. 健康与体能要求',
        blocks: [
          {
            type: 'list',
            items: [
              '攀登乞力马扎罗及参加野生动物园需要良好的身体与心理准备。',
              '参与者必须申报任何既往病史。',
              'Asili Climbing Kilimanjaro 对行程期间发生的医疗问题不承担责任。',
            ],
          },
        ],
      },
      {
        heading: '7. 签证与入境要求',
        blocks: [
          {
            type: 'list',
            items: [
              '旅行者有责任在抵达前获得有效的坦桑尼亚签证。',
              '护照有效期须自出行之日起至少六（6）个月。',
            ],
          },
        ],
      },
      {
        heading: '8. 责任限制',
        blocks: [
          {
            type: 'list',
            items: [
              '我们致力于保障您的安全，但参与探险旅行本身存在固有风险。',
              'Asili Climbing Kilimanjaro 对个人财物的丢失或损坏不承担责任',
              '伤害或疾病',
              '因天气、航班问题或政府决定所导致的延误或变更',
            ],
          },
          {
            type: 'paragraph',
            text: '尽管如此，我们承诺以专业态度行事，并尽最大努力降低风险。',
          },
        ],
      },
      {
        heading: '9. 行为规范',
        blocks: [
          {
            type: 'list',
            items: [
              '我们期望参与者尊重向导、工作人员、当地社区及其他旅行者。',
              '任何被视为危险或冒犯的行为，都可能导致被取消行程资格，且不予退款。',
            ],
          },
        ],
      },
      {
        heading: '10. 照片及推荐语的使用',
        blocks: [
          {
            type: 'list',
            items: [
              '除非您以书面形式另行要求，否则我们可能会将客户分享的照片及评价用于宣传推广。',
            ],
          },
        ],
      },
      {
        heading: '11. 适用法律',
        blocks: [
          {
            type: 'paragraph',
            text: '本条款受坦桑尼亚法律管辖。任何争议将在坦桑尼亚阿鲁沙的当地法院解决。',
          },
        ],
      },
      {
        heading: '12. 联系方式',
        blocks: [
          {type: 'paragraph', text: '如对本条款有任何疑问，请联系我们：'},
          {
            type: 'paragraph',
            text: 'Asili Climbing Kilimanjaro。邮箱：info@asiliclimbingkilimanjaro.com。电话：+255 767 140 150。总部：坦桑尼亚阿鲁沙。',
          },
        ],
      },
    ],
  },
  {
    slug: 'cookies-policy',
    seoTitle: 'Cookie 政策 | Asili Climbing Kilimanjaro',
    seoDescription: '了解 Asili Climbing Kilimanjaro 在您访问我们网站期间如何使用 Cookie。',
    pageTitle: 'Cookie 政策',
    intro:
      '本 Cookie 政策说明了 Asili Climbing Kilimanjaro 在您访问我们网站期间如何使用 Cookie 及类似技术。继续浏览我们的网站，即表示您接受我们按以下方式使用 Cookie。',
    sections: [
      {
        heading: '1. 什么是 Cookie？',
        blocks: [
          {
            type: 'paragraph',
            text: 'Cookie 是当您访问网站时，存放在您的设备（电脑、平板或智能手机）上的小型文本文件。它们有助于网站正常运行，提升用户体验，并收集有助于网站性能优化与营销的有用数据。',
          },
        ],
      },
      {
        heading: '2. 我们如何使用 Cookie',
        blocks: [
          {type: 'paragraph', text: '我们使用 Cookie 用于：'},
          {
            type: 'list',
            items: [
              '记住您的偏好与设置',
              '提升网站速度与性能',
              '分析访客与我们内容的互动方式',
              '启用预订功能',
              '根据您的兴趣展示相关广告及内容（如适用）',
            ],
          },
        ],
      },
      {
        heading: '3. 我们使用的 Cookie 类型',
        blocks: [
          {
            type: 'list',
            items: [
              '必要性 Cookie——网站基本运作所必需，例如浏览及访问受保护区域。',
              '性能与分析 Cookie——帮助我们了解访客如何使用我们的网站（访问页面、停留时长、跳出率），以优化用户体验。',
              '功能性 Cookie——记住您所做的选择，如语言或地区偏好，以提供更加个性化的体验。',
              '广告 Cookie（如适用）——可用于在 Google 或 Facebook 等平台上向您展示相关广告。您可以随时拒绝定向广告。',
            ],
          },
        ],
      },
      {
        heading: '4. 第三方 Cookie',
        blocks: [
          {type: 'paragraph', text: '我们可能会使用值得信赖的第三方工具，例如：'},
          {
            type: 'list',
            items: [
              'Google Analytics（用于监测网站使用情况）',
              'Facebook Pixel（用于营销及广告效果分析）',
              'TripAdvisor 或 Booking 小组件（用于展示评价或可预订情况）',
            ],
          },
          {
            type: 'paragraph',
            text: '这些服务可能会在您的设备上放置各自的 Cookie。建议您查阅相关服务的政策以了解更多详情。',
          },
        ],
      },
      {
        heading: '5. 管理与控制 Cookie',
        blocks: [
          {type: 'paragraph', text: '您可以通过浏览器设置来控制 Cookie。大多数浏览器允许您：'},
          {
            type: 'list',
            items: [
              '查看并删除现有 Cookie',
              '屏蔽第三方 Cookie',
              '针对特定网站设置偏好',
              '禁用所有 Cookie（不建议这样做，因为这可能影响网站的正常运行）',
            ],
          },
        ],
      },
      {
        heading: '6. 本政策的更新',
        blocks: [
          {
            type: 'paragraph',
            text: '如有需要，我们可能会更新本 Cookie 政策。更改内容将发布于本页面，并附有新的生效日期。',
          },
        ],
      },
      {
        heading: '7. 联系我们',
        blocks: [
          {type: 'paragraph', text: '如果您对我们使用 Cookie 的方式有任何疑问或担忧，请联系：'},
          {
            type: 'paragraph',
            text: 'Asili Climbing Kilimanjaro。邮箱：info@asiliclimbingkilimanjaro.com。电话：+255 767 140 150。总部：坦桑尼亚阿鲁沙。',
          },
        ],
      },
    ],
  },
]

async function run() {
  for (const page of pages) {
    const enId = await findEnId(client, 'standardPage', page.slug)
    if (!enId) {
      console.log(`SKIP ${page.slug}: no en source found`)
      continue
    }
    const fields = {
      seo: {_type: 'seo', title: page.seoTitle, description: page.seoDescription},
      hero: {heading: page.pageTitle},
      intro: page.intro,
      sections: page.sections.map((section) => ({
        _type: 'pageSection',
        _key: key(),
        heading: section.heading,
        body: section.blocks.flatMap((block) =>
          block.type === 'paragraph' ? [paragraphBlock(block.text as string)] : (block.items as string[]).map(bulletBlock),
        ),
      })),
    }
    const zhId = await upsertTranslatedDoc(client, 'standardPage', page.slug, 'zh', fields)
    await linkTranslationMetadata(client, 'standardPage', [
      {language: 'en', id: enId},
      {language: 'zh', id: zhId},
    ])
    console.log(`${page.slug}-zh done (${zhId})`)
  }
  console.log('done')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
