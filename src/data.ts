import type { Department, Metric, QuickWin, Phase, Prompt } from './types';

export const DEPARTMENTS: Department[] = [
  {
    id: 'design',
    name: 'Design & Product Development',
    shortName: 'Design',
    icon: 'Palette',
    color: '#C9A84C',
    bgPattern: 'radial-gradient(circle at 80% 20%, rgba(201,168,76,0.08) 0%, transparent 60%)',
    description: 'AI clears space for the designer to design — accelerating research, structuring inputs, translating vendor communication.',
    useCases: [
      'Trend and market synthesis — compress runway notes into one-page category briefs',
      'Color and material research — palette stories, fiber notes, supplier shortlists',
      'Tech pack and BOM drafting — sketch + voice notes → structured tech pack draft',
      'Vendor and factory communication — translate fit notes, draft factory replies',
      'Line plan and assortment review — surface gaps in price architecture and SKU mix',
      'Sample tracking and critical path summaries — weekly development calendar reads',
      'Care, content, and compliance copy — draft care instructions and content labels',
    ],
    workflows: [
      {
        title: 'From Sketch to First Tech Pack',
        timeBefore: '3 days',
        timeAfter: 'Same day',
        steps: [
          'Designer uploads sketch, reference images, and a voice memo of construction notes',
          'Claude transcribes the voice memo and produces a structured tech pack draft in the team template, flagging ambiguities as explicit questions',
          'Designer answers the questions in a single pass',
          'Claude finalizes the tech pack and produces a vendor-ready RFQ email in the appropriate language',
          'Designer reviews, edits, and sends — tech pack lands with the factory the same day',
        ],
      },
    ],
    prompts: [],
    guardrails: [
      'Do not generate finished product imagery using public models trained on copyrighted work',
      'Do not replace in-person fit sessions, fabric handfeel review, or factory site visits',
      'Never auto-approve tech packs or send factory communication without designer review',
    ],
  },
  {
    id: 'marketing',
    name: 'Marketing & Content',
    shortName: 'Marketing',
    icon: 'Megaphone',
    color: '#8B5CF6',
    bgPattern: 'radial-gradient(circle at 20% 80%, rgba(139,92,246,0.08) 0%, transparent 60%)',
    description: 'Marketing at a 25-person multi-category brand is a content factory — AI delivers the most visible weekly time savings here.',
    useCases: [
      'Product page copy at scale — structured PDPs in voice from tech pack inputs',
      'Email campaign drafting — subject lines, preview text, hero copy, CTA matrix',
      'Social copy variants — platform-appropriate copy for IG, TikTok, Pinterest, SMS',
      'SEO-aware editorial — blog posts, gift guides, category landing copy',
      'Influencer and press briefs — personalized outreach and gifting notes',
      'Lookbook and campaign concepting — casting briefs, location moodboards, shot lists',
      'Customer journey sequencing — welcome, cart, post-purchase, win-back, VIP flows',
      'Localization — first-pass translation for international markets',
    ],
    workflows: [
      {
        title: 'Weekly Newsletter in 45 Minutes',
        timeBefore: '2–3 hours',
        timeAfter: '30–45 minutes',
        steps: [
          'Marketing lead drops a one-paragraph brief with 2–3 product priorities and a tone note',
          'Claude pulls in the brand voice document and produces three subject-line directions with two preview-text options each, plus a full draft',
          'Marketing lead picks a direction, lightly edits, and swaps in final imagery',
        ],
      },
    ],
    prompts: [],
    guardrails: [],
  },
  {
    id: 'sales',
    name: 'Sales & Wholesale',
    shortName: 'Sales',
    icon: 'TrendingUp',
    color: '#10B981',
    bgPattern: 'radial-gradient(circle at 80% 80%, rgba(16,185,129,0.08) 0%, transparent 60%)',
    description: 'Wholesale is where AI most directly recovers selling time — linesheet copy, recap emails, account-specific market prep.',
    useCases: [
      'Linesheet copy and merchandising notes — consistent style descriptions across hundreds of SKUs',
      'Pre-market account briefs — one-page per account with last orders, sell-through, pitch order',
      'Post-appointment recaps and follow-ups — dictated notes → polished recap email same day',
      'Reorder and replenishment nudges — warm, specific outreach from sell-through reports',
      'Showroom and rep enablement — talking points, FAQ, objection handling, training materials',
      'Buyer and rep CRM hygiene — synthesize meeting notes and order history into clean records',
      'Sell-through synthesis by category and door — plain-language reads with clear actions',
    ],
    workflows: [
      {
        title: 'Market Prep at Half the Time',
        timeBefore: 'Full day',
        timeAfter: 'Half day',
        steps: [
          'Sales lead exports account list and last-12-months order data',
          'Claude generates one-page briefs per account, ranked by priority, each with a recommended pitch order across categories',
          'Sales lead annotates the briefs in 15 minutes and shares with the team',
          'Market arrives — appointments open faster, conversation is sharper, recaps go out same day',
        ],
      },
    ],
    prompts: [],
    guardrails: [],
  },
  {
    id: 'planning',
    name: 'Planning & Finance',
    shortName: 'Planning',
    icon: 'BarChart2',
    color: '#3B82F6',
    bgPattern: 'radial-gradient(circle at 20% 20%, rgba(59,130,246,0.08) 0%, transparent 60%)',
    description: 'Planning and finance at this scale is starved for analytic bandwidth — AI widens the surface area that human judgment is applied to.',
    useCases: [
      'Sell-through and inventory turn analysis — weekly performance synthesis by category',
      'Open-to-buy scenario narratives — written read on the OTB plan, risks, and trade-offs',
      'Budget vs actuals variance commentary — monthly variance explanations from finance exports',
      'Markdown and promotion strategy — cadence proposals by category with sell-through math',
      'Cash flow narrative — 13-week model translated into a one-page read for stakeholders',
      'Vendor cost and FOB analysis — compare structures, flag anomalies, surface negotiation angles',
      'Bookings and wholesale demand synthesis — momentum by account, region, and category',
    ],
    workflows: [
      {
        title: 'Monday Morning Trade Meeting',
        timeBefore: '45 minutes',
        timeAfter: '15 minutes',
        steps: [
          'Planner drops weekly sell-through, on-hand, and on-order exports into a working file',
          'Claude produces a one-page trade narrative: top movers, slow movers, in-stock risks, suggested actions',
          'Planner reviews, adjusts, and walks the team through it in 15 minutes',
          'Decisions on reorders, markdowns, and shipment hold/release are made earlier in the week',
        ],
      },
    ],
    prompts: [],
    guardrails: [],
  },
  {
    id: 'operations',
    name: 'Operations & Back-Office',
    shortName: 'Operations',
    icon: 'Settings2',
    color: '#F59E0B',
    bgPattern: 'radial-gradient(circle at 80% 50%, rgba(245,158,11,0.08) 0%, transparent 60%)',
    description: 'Back-office is the most underrated AI opportunity — high-volume, low-creativity work where AI delivers immediate, measurable hours back.',
    useCases: [
      'Customer service first drafts — draft polite, on-brand responses from customer message and order data',
      'Returns and exchange pattern analysis — weekly themes from return reasons by category',
      'Logistics issue summarization — carrier exceptions and delays summarized into daily action list',
      'Vendor communication translation — factory emails translated and clarified with draft replies',
      'Internal SOPs and HR templates — handbook updates, onboarding docs, role descriptions',
      'Meeting documentation — call recordings or rough notes → clear action items with owners',
      'Internal knowledge base — Simon Miller wiki of brand voice, processes, vendor contacts',
    ],
    workflows: [
      {
        title: 'Customer Service Queue Triage',
        timeBefore: '5 min per ticket',
        timeAfter: '2 min per ticket',
        steps: [
          'Incoming customer messages are pulled with relevant order and product context',
          'Claude drafts a tagged, prioritized response for each, categorized by type (WISMO, sizing, return, complaint, VIP, press)',
          'CS lead reviews, edits where needed, and approves — complex or sensitive cases escalate to a human entirely',
          'Average handle time falls 40–60% on routine tickets without sacrificing tone',
        ],
      },
    ],
    prompts: [],
    guardrails: [
      'Never auto-send customer replies — human review required before sending',
      'Flag angry, hostile, or press/legal messages for human handling — do not draft',
    ],
  },
  {
    id: 'ecommerce',
    name: 'E-Commerce (DTC)',
    shortName: 'E-Com',
    icon: 'ShoppingBag',
    color: '#EC4899',
    bgPattern: 'radial-gradient(circle at 50% 80%, rgba(236,72,153,0.08) 0%, transparent 60%)',
    description: 'The ecommerce store has the highest density of repeatable structured tasks — every one is a clean AI workflow with quick compound gains.',
    useCases: [
      'PDP enrichment beyond launch — story refreshes for restocks, A/B test variants, underperformer optimization',
      'Category page curation and copy — merchandising story, product order, landing copy',
      'On-site search query analysis — what customers want vs. what we surface; taxonomy fixes',
      'Reviews synthesis — themes by category fed to design, planning, and PDP teams monthly',
      'Lifecycle email and SMS programs — welcome, cart, browse abandonment, post-purchase, win-back, VIP',
      'Paid social ad copy variants — Meta, TikTok, Pinterest copy per concept',
      'SEO content pipeline — landing pages, gift guides, journal posts in voice',
      'A/B test hypothesis writing — experiment briefs with hypothesis, variant copy, and success metric',
      'Site UX copy — form fields, error messages, FAQ, checkout reassurance in voice',
      'Pre-purchase chat assistant — Claude-powered chat on PDP data, sizing, and policies',
      'Multi-region adaptation — first-pass copy for international markets with local nuance',
    ],
    workflows: [
      {
        title: 'Peak-Period Content Kit in a Half-Day',
        timeBefore: 'Full week',
        timeAfter: 'Half day',
        steps: [
          'Ecom lead drops promotional structure, hero priorities, and inventory exposure into a working doc',
          'Claude produces a full content kit: 5 email drafts with subject/preview variants, 12 social copy variants across IG/TikTok/Pinterest, 6 paid ad copy variants per platform, homepage hero copy, and 3 SMS variants for VIPs',
          'Ecom and marketing leads review, edit, and sequence in the ESP and ad platforms',
        ],
      },
    ],
    prompts: [],
    guardrails: [
      'Never auto-publish PDPs, emails, or paid creative without a human reviewer',
      'Do not replace merchandising team judgment on hero placement or drop sequencing',
      'Process customer PII only within the correct Claude tier with privacy controls',
    ],
  },
  {
    id: 'retail',
    name: 'Retail (Own Stores)',
    shortName: 'Retail',
    icon: 'Store',
    color: '#06B6D4',
    bgPattern: 'radial-gradient(circle at 20% 50%, rgba(6,182,212,0.08) 0%, transparent 60%)',
    description: 'AI gives the store team the leverage of a larger support staff — personalized clienteling, sharper sell-through reads, faster onboarding.',
    useCases: [
      'Clienteling outreach drafts — personalized texts from purchase history; associate personalizes final 20%',
      'Daily and weekly store sales narratives — what sold, what didn\'t, what to push tomorrow',
      'Product knowledge briefs per drop — story, fit, talking points, objections, cross-sell logic',
      'Visual merchandising direction — text briefs for floor sets, windows, fitting-room edits',
      'New hire onboarding kit — handbook, brand voice, drop history, SOPs, clienteling guidelines',
      'Event planning — trunk shows, designer appearances, invite copy, run-of-show',
      'Local market context briefs — per-store cultural moment briefs for associate conversations',
      'Inventory transfer recommendations — store on-hand, velocity, DC position → transfer logic',
      'Mystery shop and customer feedback synthesis — patterns by store surfaced monthly',
      'KPI commentary by store — conversion, UPT, AOV, traffic narratives for weekly retail call',
      'In-store signage and POS copy — POP signs, fitting-room cards, hangtag copy in voice',
      'Clienteling intelligence — per-client one-pager: bought, asked about, coming in their size',
    ],
    workflows: [
      {
        title: 'Monday Retail Standup in 20 Minutes',
        timeBefore: '60+ minutes',
        timeAfter: '20 minutes',
        steps: [
          'Each store manager exports prior week\'s sales and KPIs into a shared doc on Sunday evening',
          'Claude produces a one-page weekly read per store: what sold, what didn\'t, highlights for associates, suggested transfers, clienteling priorities by tier',
          'Retail director reviews and runs the Monday standup with sharper inputs and less prep time',
          'Each store manager walks out with the day\'s huddle script already drafted, ready to deliver',
        ],
      },
    ],
    prompts: [],
    guardrails: [
      'AI drafts clienteling; the associate personalizes and sends — a templated text is worse than none',
      'Never send any client-facing message without associate review and approval',
      'Do not replace the floor manager\'s read of the day, the customer, or the team',
    ],
  },
];

export const ALL_PROMPTS: Prompt[] = [
  // Design prompts
  {
    id: 'design-trend-brief',
    title: 'Weekly Trend Brief by Category',
    department: 'Design & Product Development',
    departmentId: 'design',
    type: 'workflow',
    description: 'Compress runway notes, trade publications, and social trend signals into a one-page synthesized brief for the design lead.',
    timeEstimate: '5 min',
    timeSaved: '3 hours',
    variables: ['CATEGORY', 'PASTE INPUTS'],
    prompt: `You are a research analyst for Simon Miller, a contemporary, design-led brand offering RTW, bags, shoes, swim, and jewelry. Our customer is a confident woman, 28-45, who collects pieces with personality and longevity. We avoid trend-chasing; we look for shapes, colors, and ideas that feel current but won't read dated in 18 months.

Below is a dump of links, screenshots, and notes I collected this week:
[PASTE INPUTS]

Produce a one-page brief for the [CATEGORY] design lead with:
1. Three signal stories worth our attention (what, why, how it shows up).
2. Two ideas we should explicitly avoid (and why they read as generic).
3. Five concrete questions the designer should answer before our next development meeting.
4. A short list of color/material/silhouette directions worth a sample swatch or sketch test.

Keep the voice declarative and specific. No filler adjectives.`,
  },
  {
    id: 'design-construction-notes',
    title: 'Construction Note Translator',
    department: 'Design & Product Development',
    departmentId: 'design',
    type: 'appendix',
    description: 'Translate vendor sample comments into clear, unambiguous designer direction and translate back to factory language.',
    timeEstimate: '3 min',
    timeSaved: '45 min',
    variables: ['LANGUAGE', 'PASTE'],
    prompt: `Below is a sample comment thread between our [LANGUAGE] factory and our design team. Some of the construction language is ambiguous.
[PASTE]

Produce a clean rewrite in English with:
1. The specific construction issue, stated once, unambiguously.
2. The exact change requested, with measurement or callout where relevant.
3. Any open question the designer must resolve before the factory can act.

Then translate the rewrite back into [LANGUAGE] for the factory.`,
  },
  // Marketing prompts
  {
    id: 'marketing-pdp',
    title: 'Product Page Draft in Simon Miller Voice',
    department: 'Marketing & Content',
    departmentId: 'marketing',
    type: 'workflow',
    description: 'Generate a complete, on-brand PDP from tech pack inputs — headline, hook, story, fabrication, care, and SEO meta.',
    timeEstimate: '8 min',
    timeSaved: '2 hours',
    variables: ['STYLE NAME', 'RTW / Bag / Shoe / Swim / Jewelry', 'FABRICATION', 'CONSTRUCTION DETAILS', 'FIT/SILHOUETTE', 'STORY/INSPIRATION', 'CARE'],
    prompt: `You are writing for Simon Miller. Use the attached brand voice document as the only source of truth for tone. The brand voice is: confident, specific, dryly warm, never breathless.

We never use the words "effortless," "elevated," or "must-have." Sentences are short and earn their adjectives.

Product inputs:
- Name: [STYLE NAME]
- Category: [RTW / Bag / Shoe / Swim / Jewelry]
- Fabrication: [FABRICATION]
- Construction details: [CONSTRUCTION DETAILS]
- Fit notes / silhouette: [FIT/SILHOUETTE]
- Story / inspiration: [STORY/INSPIRATION]
- Care: [CARE]

Produce, in this order:
1. A 4-6 word headline.
2. A 1-sentence hook (under 18 words).
3. A 2-3 sentence story paragraph (no clichés).
4. A bulleted fabrication and fit block in our standard format.
5. Care line.
6. Three SEO meta-description options (155 characters max each).

If any input is missing or contradictory, ask one clarifying question before drafting.`,
  },
  {
    id: 'marketing-email-subjects',
    title: 'Email Subject Line Generator',
    department: 'Marketing & Content',
    departmentId: 'marketing',
    type: 'appendix',
    description: 'Five subject-line directions with three variants each — plus a top pick with reasoning.',
    timeEstimate: '5 min',
    timeSaved: '1 hour',
    variables: ['CAMPAIGN BRIEF', 'HERO PRODUCT OR STORY'],
    prompt: `Campaign brief: [CAMPAIGN BRIEF]
Hero product or story: [HERO PRODUCT OR STORY]
Voice rules: confident, specific, dryly warm, never breathless. Banned: "effortless", "elevated", "must-have".

Produce 5 subject-line directions. For each direction, give 3 variants of 7 words or fewer.
For each variant, write one sentence explaining the angle and why it fits a Simon Miller customer.
Then recommend a single top pick with reasoning.`,
  },
  // Sales prompts
  {
    id: 'sales-account-brief',
    title: 'Account Brief for Market',
    department: 'Sales & Wholesale',
    departmentId: 'sales',
    type: 'workflow',
    description: 'One-page pre-market brief per account with identity read, best styles to lead, styles to deprioritize, conversation starters, and target order shape.',
    timeEstimate: '10 min',
    timeSaved: '2 hours',
    variables: ['ACCOUNT NAME', 'SEASON', 'LAST 4 SEASONS ORDERS', 'SELL-THROUGH', 'DOORS/REGION', 'LAST MARKET NOTES', 'KEY STORIES', 'TOP STYLES'],
    prompt: `You are preparing me for a buying appointment with [ACCOUNT NAME] for [SEASON].

Account data:
- Last 4 seasons of orders by category: [LAST 4 SEASONS ORDERS]
- Sell-through highlights: [SELL-THROUGH]
- Doors / region: [DOORS/REGION]
- Notes from last market: [LAST MARKET NOTES]

Line context:
- This season's key stories: [KEY STORIES]
- Top styles by sell-in expectation: [TOP STYLES]

Produce a one-page brief with:
1. A 2-sentence read on this account's identity and what they buy us for.
2. The 3 best styles to lead with, by category, with the specific reason each one fits this buyer.
3. 2 styles to deprioritize and why.
4. 3 conversation starters drawn from their last market notes or current line.
5. A target order shape (categories, depth, key items).`,
  },
  {
    id: 'sales-recap',
    title: 'Post-Market Recap Drafter',
    department: 'Sales & Wholesale',
    departmentId: 'sales',
    type: 'appendix',
    description: 'Convert raw appointment notes into a polished recap email with next steps and draft order summary.',
    timeEstimate: '5 min',
    timeSaved: '45 min',
    variables: ['ACCOUNT NAME', 'MEETING NOTES', 'ORDER INTENT'],
    prompt: `Account: [ACCOUNT NAME]
Meeting notes (transcribed or typed):
[MEETING NOTES]

Order intent captured in the meeting:
[ORDER INTENT]

Produce:
1. A 1-2 paragraph recap email in our voice. Warm, specific, no filler.
2. A bulleted next-steps block.
3. A draft order summary in our standard format.

Flag any ambiguous quantities or styles as questions instead of assumptions.`,
  },
  // Planning prompts
  {
    id: 'planning-trade',
    title: 'Weekly Trade Synthesis',
    department: 'Planning & Finance',
    departmentId: 'planning',
    type: 'workflow',
    description: 'One-page Monday trade read — top movers, slow movers, in-stock risks, reorder recommendations, markdown candidates.',
    timeEstimate: '10 min',
    timeSaved: '90 min',
    variables: ['WEEK', 'SKU DATA CSV'],
    prompt: `You are a merchandise planner for Simon Miller analyzing week [WEEK] performance.

Inputs (CSV pasted below):
- SKU-level sell-through last 1, 4, and 12 weeks
- On-hand and on-order by SKU
- Price and category
- Planned weekly run rate

[SKU DATA CSV]

Produce a one-page trade read with:
1. Top 5 styles by velocity and the read (color, size, story).
2. Bottom 10 styles with diagnosis (price, story, exposure, photography, or true demand issue).
3. Categories tracking above and below plan with magnitude.
4. 3 reorder recommendations with rationale and quantity range.
5. 3 markdown / promotional candidates with timing and expected sell-through.
6. 2 questions only a human can answer that I should resolve this week.

Be specific. No hedging. Show the math when you make a quantity recommendation.`,
  },
  {
    id: 'planning-reorder',
    title: 'Reorder Recommendation',
    department: 'Planning & Finance',
    departmentId: 'planning',
    type: 'appendix',
    description: 'Reorder recommendation with confidence band, math, key assumptions, and velocity red flags.',
    timeEstimate: '4 min',
    timeSaved: '30 min',
    variables: ['STYLE NAME', 'SKU', 'SELL-THROUGH DATA', 'ON-HAND', 'ON-ORDER', 'LEAD TIME', 'WEEKS OF SUPPLY TARGET'],
    prompt: `Style: [STYLE NAME], SKU: [SKU]
Sell-through last 1, 4, 12 weeks: [SELL-THROUGH DATA]
On-hand: [ON-HAND]
On-order: [ON-ORDER]
Lead time: [LEAD TIME] weeks
Weeks of supply target: [WEEKS OF SUPPLY TARGET]

Produce:
1. Recommended reorder quantity (range, not point estimate).
2. The math behind it.
3. The 2-3 assumptions most worth testing.
4. A red flag check: is there any signal that velocity is artificial (promo, single account, photography boost)?`,
  },
  // Operations prompts
  {
    id: 'ops-cs-draft',
    title: 'Customer Service First Draft',
    department: 'Operations & Back-Office',
    departmentId: 'operations',
    type: 'workflow',
    description: 'Draft a polite, on-brand customer service reply with recommended next step and a human-review confidence note.',
    timeEstimate: '2 min',
    timeSaved: '5 min',
    variables: ['CUSTOMER MESSAGE', 'ORDER AND ACCOUNT CONTEXT', 'POLICY EXCERPT'],
    prompt: `You are drafting a customer service reply for Simon Miller. Voice: warm, specific, never apologetic in a generic way. We solve problems clearly and quickly.

Customer message:
[CUSTOMER MESSAGE]

Order and account context:
[ORDER AND ACCOUNT CONTEXT]

Policy reference:
[POLICY EXCERPT]

Produce:
1. A draft reply, ready to edit and send. No corporate filler. Address the specific issue first.
2. The recommended next operational step (refund, label, replacement, escalate).
3. A confidence note: where you are sure and where a human should double-check before sending.

If the message is angry, hostile, or involves a press/legal risk, do not draft a reply — flag for human handling.`,
  },
  {
    id: 'ops-returns',
    title: 'Returns Theme Synthesis',
    department: 'Operations & Back-Office',
    departmentId: 'operations',
    type: 'appendix',
    description: 'Monthly returns themes by category — top reasons, specific styles, suggested actions for design/planning/PDP.',
    timeEstimate: '5 min',
    timeSaved: '2 hours',
    variables: ['MONTH', 'RETURN DATA CSV'],
    prompt: `Return data for [MONTH] (CSV pasted):
[RETURN DATA CSV]

Produce a one-page read with:
1. The top 3 return reasons by category (RTW, bags, shoes, swim, jewelry).
2. Specific styles driving outsized return rates.
3. Suggested actions for design, planning, PDP, or photography teams.
4. Any pattern that warrants a deeper investigation, with the question that would unlock it.`,
  },
  {
    id: 'ops-weekly-business',
    title: 'Weekly Business Read',
    department: 'Operations & Back-Office',
    departmentId: 'operations',
    type: 'appendix',
    description: 'Friday 10-minute read for founders — what\'s working, what\'s not, the single most important decision, and one question per function lead.',
    timeEstimate: '8 min',
    timeSaved: '1 hour',
    variables: ['DTC WEEKLY SALES', 'WHOLESALE BOOKINGS', 'INVENTORY AND OTB', 'MARKETING PERFORMANCE', 'OPEN OPS ISSUES'],
    prompt: `Inputs:
- DTC weekly sales by category: [DTC WEEKLY SALES]
- Wholesale bookings update: [WHOLESALE BOOKINGS]
- Inventory and OTB position: [INVENTORY AND OTB]
- Marketing performance: [MARKETING PERFORMANCE]
- Open ops issues: [OPEN OPS ISSUES]

Produce a one-page Friday brief I can read in 10 minutes. Voice: direct, no hedging.
1. What's working this week (3 bullets).
2. What's not working this week (3 bullets).
3. The single most important decision in front of me next week.
4. One question I should ask each function lead at Monday's standup.`,
  },
  // E-commerce prompts
  {
    id: 'ecom-reviews',
    title: 'Reviews to Action Items',
    department: 'E-Commerce (DTC)',
    departmentId: 'ecommerce',
    type: 'workflow',
    description: 'Monthly review synthesis — positive themes, issues by type, PDP updates, design/planning flags, and deep-dive questions.',
    timeEstimate: '8 min',
    timeSaved: '3 hours',
    variables: ['MONTH', 'REVIEW DATA CSV'],
    prompt: `You are reading customer reviews for Simon Miller across all categories for [MONTH].

Inputs (pasted CSV):
- Product, category, rating, review text, verified buyer flag, date.
[REVIEW DATA CSV]

Produce a one-page synthesis with:
1. The top three positive themes by category and the styles driving them.
2. The top three issues by category — separating fit, fabrication, photography, and expectation-setting issues.
3. Specific PDP updates worth making (suggested copy edits).
4. Specific design or planning flags (fit grading, color saturation, fabric weight, restock priorities).
5. The two themes that warrant a deeper look and the question that would unlock each.

Voice: declarative, no hedging. Cite specific styles by name.`,
  },
  {
    id: 'ecom-search',
    title: 'Site Search Query Gap Analysis',
    department: 'E-Commerce (DTC)',
    departmentId: 'ecommerce',
    type: 'workflow',
    description: 'Translate raw search-query exports into intent reads, merchandising language fixes, and taxonomy corrections.',
    timeEstimate: '10 min',
    timeSaved: '4 hours',
    variables: ['QUERY DATA', 'TAXONOMY', 'NEW ARRIVALS'],
    prompt: `You are analyzing on-site search data for Simon Miller.

Inputs:
- Top 200 search queries last 30 days with: count, click-through rate, conversion rate.
- Current category taxonomy: [TAXONOMY]
- New arrivals this month: [NEW ARRIVALS]

[QUERY DATA]

Produce:
1. The top 10 high-intent queries with low CTR or low conversion — and the likely cause for each (missing synonym, wrong taxonomy, missing product, photography, sold out).
2. Five queries that suggest we should change merchandising or PDP language.
3. Three queries that suggest a product opportunity (something customers are asking for that we don't make).
4. A prioritized list of taxonomy fixes (synonyms, tags, redirects).`,
  },
  {
    id: 'ecom-cart',
    title: 'Abandoned Cart Email Sequence',
    department: 'E-Commerce (DTC)',
    departmentId: 'ecommerce',
    type: 'appendix',
    description: 'Three-email abandoned cart sequence (T+1h, T+24h, T+72h) with tonal escalation and a non-discount variant.',
    timeEstimate: '12 min',
    timeSaved: '4 hours',
    variables: ['CART CONTENTS', 'CART VALUE', 'FIRST-TIME OR RETURNING', 'SESSION SIGNALS'],
    prompt: `You are drafting a three-email abandoned cart sequence for Simon Miller. Voice: we are not pushy. We are useful.

Customer context (anonymized):
- Cart contents (category, style name, color, size, price): [CART CONTENTS]
- Cart value: [CART VALUE]
- First-time or returning: [FIRST-TIME OR RETURNING]
- Any sizing or fit signals from session behavior: [SESSION SIGNALS]

Produce a three-email sequence (T+1 hour, T+24 hours, T+72 hours) with:
1. For each email: subject (3 variants), preview text (2 variants), hero copy (under 60 words), CTA.
2. Tonal escalation across the sequence from helpful nudge to gentle final reminder. Never desperate.
3. One variant of email 3 that offers something useful that is NOT a discount (styling note, fit guidance, content-led reminder of value).`,
  },
  // Retail prompts
  {
    id: 'retail-clienteling',
    title: 'Clienteling Outreach Draft',
    department: 'Retail (Own Stores)',
    departmentId: 'retail',
    type: 'workflow',
    description: 'Personalized clienteling text and email from purchase history and associate notes — associate personalizes final 20%.',
    timeEstimate: '3 min',
    timeSaved: '15 min per client',
    variables: ['CLIENT NAME AND TIER', 'LAST 6 PURCHASES', 'FIT PREFERENCES', 'ASSOCIATE NOTES', 'NEW ARRIVALS', 'LAST CONTACT'],
    prompt: `You are drafting a clienteling text from a Simon Miller associate to a top client. Voice: warm, specific, never templated. Short. Like a friend who happens to know what she would love.

Associate inputs:
- Client name and tier: [CLIENT NAME AND TIER]
- Last 6 purchases with date, style, color, size: [LAST 6 PURCHASES]
- Sizing and fit preferences: [FIT PREFERENCES]
- Notes from associate (style preferences, life context, prior conversations): [ASSOCIATE NOTES]
- New arrivals to consider: [NEW ARRIVALS]
- Last contact date and channel: [LAST CONTACT]

Produce:
1. A draft text (3-5 sentences). Reference something specific she has bought or said. Suggest 1-2 new pieces with a specific reason each is for her.
2. An alternate, shorter version (1-2 sentences) for a lighter check-in.
3. A note flagging anything in the data that suggests we should NOT reach out this week (recent return, complaint, dormant cycle reason).

Do not invent details. If a piece of context is thin, write something that works without it rather than making something up.`,
  },
  {
    id: 'retail-store-read',
    title: 'Weekly Store Read for the Monday Standup',
    department: 'Retail (Own Stores)',
    departmentId: 'retail',
    type: 'workflow',
    description: 'One-page weekly retail read — styles to push, styles to pull, transfer recommendations, clienteling priorities, and daily huddle script.',
    timeEstimate: '8 min',
    timeSaved: '1 hour',
    variables: ['STORE NAME', 'SALES DATA CSV', 'PROMOTIONAL CONTEXT', 'LOCAL CONTEXT'],
    prompt: `You are a retail analyst for Simon Miller producing the Monday read for [STORE NAME].

Inputs (CSV):
- Last 1 / 4 / 12 weeks sales by category and SKU.
- Conversion, UPT, AOV, traffic by day.
- On-hand by SKU.
- Promotional context: [PROMOTIONAL CONTEXT]
- Local context (weather, events, calendar): [LOCAL CONTEXT]

[SALES DATA CSV]

Produce a one-page read with:
1. The three styles to push hard this week and why (right product, right inventory, right moment).
2. The three styles to deprioritize or pull off the floor.
3. Suggested transfers in/out and why.
4. Two clienteling pushes by client tier: VIPs to call, top-100 to email.
5. Three lines for the daily huddle script: today's focus, today's KPI target, today's brand story.`,
  },
  {
    id: 'retail-floor-brief',
    title: 'New-Drop Floor Brief',
    department: 'Retail (Own Stores)',
    departmentId: 'retail',
    type: 'appendix',
    description: 'One-page floor brief per category per drop — 60-second story, talking points, objection handling, cross-sell logic.',
    timeEstimate: '6 min',
    timeSaved: '2 hours',
    variables: ['DROP NAME', 'CATEGORY', 'STORE', 'TECH PACK HIGHLIGHTS', 'STORY', 'PRICE ARCHITECTURE', 'FIT GUIDANCE', 'CROSS-SELL', 'ANTICIPATED QUESTIONS'],
    prompt: `You are writing the floor brief for [DROP NAME] for the [CATEGORY] team at [STORE].

Inputs:
- Tech pack highlights and fabrication: [TECH PACK HIGHLIGHTS]
- Story / inspiration: [STORY]
- Price architecture: [PRICE ARCHITECTURE]
- Sizing and fit guidance: [FIT GUIDANCE]
- Cross-sell opportunities (other categories): [CROSS-SELL]
- Anticipated customer questions: [ANTICIPATED QUESTIONS]

Produce a one-page brief in voice with:
1. The 60-second story an associate can deliver on the floor.
2. Three fit and fabrication talking points worth memorizing.
3. Three common objections and how to address each.
4. Two cross-sell suggestions with a specific reason for each pairing.
5. The single most important thing to highlight to a first-time Simon Miller customer.

Keep it scannable. Short sentences. No marketing-speak.`,
  },

  // B.9 — Press pitch drafter
  {
    id: 'marketing-press-pitch',
    title: 'Press Pitch Drafter',
    department: 'Marketing & Content',
    departmentId: 'marketing',
    type: 'appendix',
    description: 'Personalized press pitch for a specific editor or outlet — lead story, product pull, and follow-up cadence.',
    timeEstimate: '6 min',
    timeSaved: '90 min',
    variables: ['EDITOR NAME', 'OUTLET', 'BEAT / SECTION', 'PREVIOUS COVERAGE NOTES', 'PITCH STORY', 'PRODUCT NAMES AND PRICES', 'EMBARGO OR TIMING'],
    prompt: `You are writing a press pitch from the Simon Miller communications team to [EDITOR NAME] at [OUTLET].

Context on this editor:
- Beat / section: [BEAT / SECTION]
- Previous coverage or connection notes: [PREVIOUS COVERAGE NOTES]

Pitch story:
[PITCH STORY]

Products to pull:
[PRODUCT NAMES AND PRICES]

Timing or embargo: [EMBARGO OR TIMING]

Produce:
1. A subject line. Short, specific, not a headline — what an editor actually opens.
2. The pitch itself (under 150 words). Open on the story angle that fits this outlet, not our product. Get to the product by the second paragraph. Be specific about why this is relevant to this editor's readers right now.
3. A two-sentence follow-up for 5 business days out if no reply.
4. A flag: is there anything in this editor's beat or recent coverage that should make us reconsider this pitch or angle?

Voice: direct, professional, not fawning. We don't say "I am a huge fan of your work." We pitch the story.`,
  },

  // B.10 — Lookbook concept brainstorm
  {
    id: 'marketing-lookbook-brainstorm',
    title: 'Lookbook Concept Brainstorm',
    department: 'Marketing & Content',
    departmentId: 'marketing',
    type: 'appendix',
    description: 'Three distinct campaign directions with casting brief, location notes, shot-list skeleton, and a short \'why this fits Simon Miller now\' for each.',
    timeEstimate: '10 min',
    timeSaved: '3 hours',
    variables: ['SEASON', 'COLLECTION THEMES', 'KEY STYLES', 'PRICE ARCHITECTURE', 'BRAND GUARDRAILS', 'PAST CAMPAIGNS TO AVOID REPEATING'],
    prompt: `You are the creative director at Simon Miller brainstorming lookbook directions for [SEASON].

Collection context:
- Key themes or reference points in the collection: [COLLECTION THEMES]
- Hero styles to feature: [KEY STYLES]
- Price architecture (entry / mid / statement): [PRICE ARCHITECTURE]
- Brand guardrails: [BRAND GUARDRAILS]
- Past campaign territory to avoid: [PAST CAMPAIGNS TO AVOID REPEATING]

Produce three distinct campaign concepts. For each concept:
1. A working title (2-4 words — internal shorthand only).
2. A 2-sentence concept premise. What world does this shoot live in? What is it definitely not?
3. Casting brief: body type, age range, energy, one specific reference (real person, not a type).
4. Location and set direction: one primary setting, lighting reference, palette note.
5. Shot-list skeleton: four mandatory frames (the looks) plus two unexpected frames that sell the concept.
6. One sentence on why this concept fits where Simon Miller is right now.

No concept should repeat the territory of the others. Each should be genuinely distinct in energy and execution.`,
  },

  // B.11 — TikTok hook generator
  {
    id: 'marketing-tiktok-hooks',
    title: 'TikTok Hook Generator',
    department: 'Marketing & Content',
    departmentId: 'marketing',
    type: 'appendix',
    description: 'Ten TikTok opening hooks for a product or story — five verbal, five visual — with format notes and a strongest-pick rationale.',
    timeEstimate: '4 min',
    timeSaved: '45 min',
    variables: ['PRODUCT OR STORY', 'TARGET MOMENT (new drop / seasonal / editorial)', 'ACCOUNT ENERGY (deadpan / warm / editorial)', 'WHAT TO AVOID'],
    prompt: `You are writing TikTok hooks for Simon Miller. The brand voice on TikTok is: specific, dry, never trying too hard. We don't hype. We let the product do the work.

Product or story: [PRODUCT OR STORY]
Target moment: [TARGET MOMENT (new drop / seasonal / editorial)]
Account energy to match: [ACCOUNT ENERGY (deadpan / warm / editorial)]
What to avoid: [WHAT TO AVOID]

Produce 10 hooks in total:
— Five verbal hooks: the first spoken sentence (under 8 words) that makes a viewer stay.
— Five visual hooks: the first frame or action that makes a viewer stay (describe it in one sentence).

For each hook, add a format note: what kind of video format does this hook set up? (GRWM, styling demo, B-roll product moment, POV, talking head, etc.)

Then recommend your single strongest hook with a one-sentence rationale.

No "effortless." No "must-have." No exclamation points. The brand is confident, not enthusiastic.`,
  },

  // B.12 — Wholesale prospecting outreach drafter
  {
    id: 'sales-prospecting',
    title: 'Wholesale Prospecting Outreach',
    department: 'Sales & Wholesale',
    departmentId: 'sales',
    type: 'appendix',
    description: 'Cold outreach email to a prospective wholesale account — one that fits our distribution strategy and hasn\'t carried us before.',
    timeEstimate: '5 min',
    timeSaved: '45 min',
    variables: ['ACCOUNT NAME', 'BUYER NAME', 'DOORS AND REGIONS', 'WHAT THEY CURRENTLY CARRY', 'WHY WE FIT THEM', 'SEASON AND TIMING', 'HERO STYLES TO MENTION'],
    prompt: `You are writing a prospecting email from Simon Miller's wholesale team to a buyer we have never worked with.

Account: [ACCOUNT NAME]
Buyer name: [BUYER NAME]
Doors and regions: [DOORS AND REGIONS]
What they currently carry (competitive set): [WHAT THEY CURRENTLY CARRY]
Why Simon Miller fits this retailer: [WHY WE FIT THEM]
Season and timing context: [SEASON AND TIMING]
Hero styles to reference: [HERO STYLES TO MENTION]

Produce:
1. A subject line (under 8 words — not a pitch, a specific reason to open).
2. The outreach email (under 120 words). Open with the specific fit between this account and our brand — not a generic intro. Get to the ask in the second paragraph. Be clear about the meeting or sample request, not vague about "exploring a partnership."
3. A follow-up email for 7 days out if no reply (under 60 words — different angle, not a repeat).
4. One flag: is there anything about their current assortment or distribution tier that might make us the wrong fit?

Voice: direct, confident, not deferential. We are clear about why we are right for them specifically.`,
  },

  // B.13 — HR onboarding checklist builder
  {
    id: 'ops-hr-onboarding',
    title: 'HR Onboarding Checklist Builder',
    department: 'Operations & Back-Office',
    departmentId: 'operations',
    type: 'appendix',
    description: 'Role-specific 30/60/90-day onboarding checklist with systems access, training milestones, key relationships, and first deliverables.',
    timeEstimate: '8 min',
    timeSaved: '2 hours',
    variables: ['ROLE TITLE', 'DEPARTMENT', 'MANAGER', 'START DATE', 'KEY SYSTEMS AND TOOLS', 'FIRST PROJECT OR DELIVERABLE', 'KEY INTERNAL RELATIONSHIPS'],
    prompt: `You are building a 30/60/90-day onboarding checklist for a new Simon Miller hire.

Role: [ROLE TITLE]
Department: [DEPARTMENT]
Manager: [MANAGER]
Start date: [START DATE]
Systems and tools they will need access to: [KEY SYSTEMS AND TOOLS]
First major project or deliverable: [FIRST PROJECT OR DELIVERABLE]
Key internal relationships to establish: [KEY INTERNAL RELATIONSHIPS]

Produce a structured checklist in three sections (Week 1, Day 30, Day 60, Day 90) with:
1. **Week 1**: Systems access checklist, introductions to schedule, documents to read (brand voice, AI use policy, team norms), and their first small visible contribution.
2. **Day 30**: Knowledge milestones (can they explain our customer, our distribution, our brand voice?), first deliverable due, and a manager check-in prompt.
3. **Day 60**: Active workflow contribution — what they should be producing independently by now. Peer feedback moment.
4. **Day 90**: First performance conversation prompt — what does success look like? What's the question they should be able to answer?

Keep every item specific and actionable. No filler items like "get familiar with company culture." If you can't make it concrete, skip it.`,
  },

  // B.14 — Meeting notes to action items
  {
    id: 'ops-meeting-notes',
    title: 'Meeting Notes to Action Items',
    department: 'Operations & Back-Office',
    departmentId: 'operations',
    type: 'appendix',
    description: 'Convert raw meeting notes or transcript into a clean decision log, action item list, and follow-up email in under 3 minutes.',
    timeEstimate: '3 min',
    timeSaved: '30 min',
    variables: ['MEETING TYPE', 'ATTENDEES', 'DATE', 'RAW NOTES OR TRANSCRIPT'],
    prompt: `Convert the following meeting notes into a clean record. No filler. No summary of what was discussed — only what was decided and what happens next.

Meeting type: [MEETING TYPE]
Attendees: [ATTENDEES]
Date: [DATE]

Raw notes / transcript:
[RAW NOTES OR TRANSCRIPT]

Produce three outputs:

**1. Decision log** — list only firm decisions made. Format: Decision | Owner | By when. If a decision was deferred, note it as "Deferred: reason."

**2. Action items** — bulleted, one per line. Format: Action | Owner | Due date. If a due date was not stated, mark it [DATE NEEDED].

**3. Follow-up email** — under 80 words, ready to send. Cover the key decisions and action items only. Subject line included. Voice: direct, warm, no corporate filler.

If the notes are ambiguous about who owns something, mark the owner as [CLARIFY] rather than guessing.`,
  },

  // B.14b — In-store event run-of-show builder
  {
    id: 'retail-event-ros',
    title: 'In-Store Event Run-of-Show',
    department: 'Retail (Own Stores)',
    departmentId: 'retail',
    type: 'appendix',
    description: 'Minute-by-minute run-of-show for a retail event — staff assignments, guest flow, talking points, and contingency notes.',
    timeEstimate: '10 min',
    timeSaved: '3 hours',
    variables: ['EVENT NAME', 'STORE', 'DATE AND TIME', 'EXPECTED GUEST COUNT', 'FORMAT (cocktail / trunk show / private shopping / launch)', 'STAFF ON FLOOR', 'KEY PRODUCTS OR STORIES TO FEATURE', 'CATERING AND LOGISTICS NOTES'],
    prompt: `You are building the run-of-show for a Simon Miller in-store event.

Event: [EVENT NAME]
Store: [STORE]
Date and time: [DATE AND TIME]
Expected guests: [EXPECTED GUEST COUNT]
Format: [FORMAT (cocktail / trunk show / private shopping / launch)]
Staff on floor: [STAFF ON FLOOR]
Products / stories to feature: [KEY PRODUCTS OR STORIES TO FEATURE]
Catering and logistics: [CATERING AND LOGISTICS NOTES]

Produce:

**1. Minute-by-minute run-of-show** (from 60 minutes pre-doors to event close). Format: Time | What's happening | Who owns it.

**2. Staff assignment card** — one paragraph per staff member: their zone, their role, their priority guest interactions, their one non-negotiable for the night.

**3. Guest flow map** (in words) — what does a guest experience from arrival to departure? Where do they linger? What's the designed moment of discovery?

**4. Clienteling brief for the event** — top-tier clients expected, what they've bought, what to show them, who is their assigned associate.

**5. Contingency notes** — three scenarios (low turnout, high volume, a VIP arrives unannounced) with a one-sentence protocol for each.

Voice: operational and clear. This document is for the team, not the guest.`,
  },
];

export const METRICS: Metric[] = [
  {
    id: 'hours-saved',
    name: 'Hours Saved / Role / Week',
    definition: 'Self-reported time returned by workflow, sampled monthly',
    target: '6-10 hrs (non-design); 3-5 hrs (design)',
    current: 7.2,
    targetValue: 8,
    unit: 'hrs/wk',
    category: 'efficiency',
    trend: 'up',
    history: [0, 1.5, 3.2, 4.8, 5.5, 6.1, 7.2],
  },
  {
    id: 'pdp-turnaround',
    name: 'PDP Turnaround Time',
    definition: 'Days from final tech pack + photography to live PDP',
    target: '30-50% reduction',
    current: 38,
    targetValue: 50,
    unit: '% reduction',
    category: 'efficiency',
    trend: 'up',
    history: [0, 8, 15, 22, 28, 33, 38],
  },
  {
    id: 'email-cycle',
    name: 'Email Campaign Cycle Time',
    definition: 'Hours from brief to ready-to-send draft',
    target: '40-60% reduction',
    current: 52,
    targetValue: 55,
    unit: '% reduction',
    category: 'efficiency',
    trend: 'up',
    history: [0, 10, 20, 32, 40, 47, 52],
  },
  {
    id: 'wholesale-followup',
    name: 'Wholesale Follow-Up Cycle',
    definition: 'Hours from appointment to recap + order summary out',
    target: 'Same-day on 90% of accounts',
    current: 76,
    targetValue: 90,
    unit: '% same-day',
    category: 'efficiency',
    trend: 'up',
    history: [0, 20, 35, 50, 60, 70, 76],
  },
  {
    id: 'cs-handle-time',
    name: 'Customer Service Handle Time',
    definition: 'Average minutes per ticket on routine categories',
    target: '30-50% reduction',
    current: 44,
    targetValue: 45,
    unit: '% reduction',
    category: 'efficiency',
    trend: 'stable',
    history: [0, 12, 22, 30, 36, 41, 44],
  },
  {
    id: 'prompt-adoption',
    name: 'Prompt Library Adoption',
    definition: 'Share of customer-facing copy produced from a shared prompt',
    target: '70% by end of year',
    current: 52,
    targetValue: 70,
    unit: '%',
    category: 'compliance',
    trend: 'up',
    history: [0, 8, 18, 28, 36, 44, 52],
  },
  {
    id: 'brand-voice',
    name: 'Brand Voice Consistency',
    definition: 'Quarterly creative-lead audit score on a 1-5 rubric',
    target: 'Maintain or improve baseline',
    current: 4.2,
    targetValue: 4.5,
    unit: '/ 5',
    category: 'compliance',
    trend: 'up',
    history: [4.0, 4.0, 4.1, 4.1, 4.2, 4.2, 4.2],
  },
  {
    id: 'markdown-rate',
    name: 'Markdown Rate by Category',
    definition: 'Markdown $ as % of gross sales by category',
    target: 'Baseline -1 to -3 pts',
    current: -1.8,
    targetValue: -2,
    unit: 'pts vs baseline',
    category: 'revenue',
    trend: 'up',
    history: [0, -0.2, -0.6, -1.0, -1.3, -1.6, -1.8],
  },
  {
    id: 'inventory-turn',
    name: 'Inventory Turn',
    definition: 'Annual turn by category',
    target: 'Baseline +0.2 to +0.5 turns',
    current: 0.28,
    targetValue: 0.4,
    unit: 'turns added',
    category: 'revenue',
    trend: 'up',
    history: [0, 0.03, 0.07, 0.13, 0.18, 0.23, 0.28],
  },
  {
    id: 'policy-compliance',
    name: 'AI Use Policy Compliance',
    definition: 'Quarterly self-attestation by function',
    target: '100%',
    current: 96,
    targetValue: 100,
    unit: '%',
    category: 'compliance',
    trend: 'up',
    history: [0, 60, 72, 80, 88, 92, 96],
  },
  {
    id: 'email-engagement',
    name: 'Lifecycle Email Engagement',
    definition: 'Open and click rates on the refreshed lifecycle flows',
    target: '+15-25% opens, +10-20% clicks',
    current: 19,
    targetValue: 22,
    unit: '% open lift',
    category: 'engagement',
    trend: 'up',
    history: [0, 4, 8, 12, 15, 17, 19],
  },
  {
    id: 'pdp-conversion',
    name: 'PDP Conversion Rate',
    definition: 'Conversion on PDPs touched by AI workflow vs. control',
    target: 'Baseline +5-10%',
    current: 7.3,
    targetValue: 8,
    unit: '% lift',
    category: 'revenue',
    trend: 'up',
    history: [0, 1.2, 2.5, 3.8, 5.0, 6.2, 7.3],
  },
  {
    id: 'search-conversion',
    name: 'On-Site Search Conversion',
    definition: 'Conversion on search sessions after taxonomy and synonym fixes',
    target: 'Baseline +10-20%',
    current: 13.5,
    targetValue: 17,
    unit: '% lift',
    category: 'engagement',
    trend: 'up',
    history: [0, 2, 5, 7.5, 9.5, 11.5, 13.5],
  },
  {
    id: 'clienteling-response',
    name: 'Clienteling Response Rate',
    definition: 'Share of AI-drafted, associate-personalized outreach receiving a reply or visit',
    target: '30%+ on top-tier clients',
    current: 34,
    targetValue: 35,
    unit: '% response',
    category: 'engagement',
    trend: 'stable',
    history: [0, 8, 15, 22, 27, 31, 34],
  },
  {
    id: 'retail-prep',
    name: 'Retail Prep Time',
    definition: 'Minutes spent producing the Monday store read per store',
    target: '75% reduction',
    current: 71,
    targetValue: 75,
    unit: '% reduction',
    category: 'efficiency',
    trend: 'up',
    history: [0, 20, 35, 48, 58, 65, 71],
  },
];

export const QUICK_WINS: QuickWin[] = [
  { id: 1, title: 'Brand Voice Document v1', owner: 'Creative Lead', output: 'Live 4-8 page artifact loaded into every customer-facing prompt', timeToShip: 'Weeks 1-2', status: 'done', priority: 'high', week: '1-2' },
  { id: 2, title: 'AI Use Policy v1', owner: 'Founder + Ops', output: 'One-page policy, posted internally', timeToShip: 'Week 2', status: 'done', priority: 'high', week: '2' },
  { id: 3, title: 'Team-Tier Claude Rollout', owner: 'Ops', output: 'All 25 seats on a tier with training opt-out', timeToShip: 'Week 2', status: 'done', priority: 'high', week: '2' },
  { id: 4, title: 'PDP Writing Workflow', owner: 'Marketing', output: 'Standardized prompt + shared Project; 80% of new PDPs drafted in voice', timeToShip: 'Weeks 3-6', status: 'in-progress', priority: 'high', week: '3-6' },
  { id: 5, title: 'Weekly Trade Synthesis', owner: 'Planning', output: 'One-page Monday read from weekly exports', timeToShip: 'Weeks 3-6', status: 'in-progress', priority: 'high', week: '3-6' },
  { id: 6, title: 'Market Account Brief Builder', owner: 'Sales', output: 'One-page per account before next market', timeToShip: 'Weeks 4-8', status: 'in-progress', priority: 'medium', week: '4-8' },
  { id: 7, title: 'CS First-Draft Pilot', owner: 'Ops / CS', output: '60-80% of routine tickets drafted by AI, human reviewed', timeToShip: 'Weeks 4-10', status: 'not-started', priority: 'high', week: '4-10' },
  { id: 8, title: 'Prompt Library v1', owner: 'AI Champion Network', output: '10-15 versioned prompts in Notion, each with example', timeToShip: 'Weeks 6-10', status: 'not-started', priority: 'medium', week: '6-10' },
  { id: 9, title: 'Monthly AI Office Hour', owner: 'Founder-Sponsored', output: 'Recurring 45-minute team session', timeToShip: 'Week 6 onward', status: 'not-started', priority: 'medium', week: '6+' },
  { id: 10, title: 'Tech Pack Draft Workflow', owner: 'Design Ops', output: 'Sketch + notes → first-draft tech pack in template', timeToShip: 'Weeks 8-12', status: 'not-started', priority: 'medium', week: '8-12' },
  { id: 11, title: 'Lifecycle Email Refresh', owner: 'E-Commerce', output: 'Welcome, cart, post-purchase, win-back flows redrafted in voice', timeToShip: 'Weeks 5-10', status: 'not-started', priority: 'high', week: '5-10' },
  { id: 12, title: 'Clienteling Outreach Drafts', owner: 'Retail', output: 'Top-tier clients receive AI-drafted, associate-personalized outreach weekly', timeToShip: 'Weeks 6-12', status: 'not-started', priority: 'medium', week: '6-12' },
];

export const PHASES: Phase[] = [
  {
    number: 1,
    name: 'Foundations',
    months: 'Months 1-3',
    goal: 'Establish the artifacts, tier, and norms. Three visible quick wins live in the business.',
    status: 'active',
    items: [
      'Brand Voice document, AI Use Policy, Claude Team tier',
      'Three foundational workflows: PDP writing, weekly trade synthesis, customer service first drafts',
      'Prompt library structure created with first 10 entries',
      'AI champions named in each function',
    ],
  },
  {
    number: 2,
    name: 'Scale',
    months: 'Months 4-6',
    goal: 'Expand workflows across all seven functions and connect Claude to internal systems.',
    status: 'upcoming',
    items: [
      'Market account brief builder live for the next market cycle',
      'Tech pack draft workflow in pilot with one or two designers',
      'Email campaign workflow producing 80%+ of routine sends',
      'Retail clienteling workflow live in every store, weekly outreach for top-tier clients',
      'MCP connectors enabled: Google Drive, Slack, e-commerce platform, ESP, POS',
      'First monthly metrics review: hours saved, PDP turnaround, lifecycle email engagement',
    ],
  },
  {
    number: 3,
    name: 'Compound',
    months: 'Months 7-9',
    goal: 'Move from workflows to custom skills and agents the team invokes the same way every time.',
    status: 'upcoming',
    items: [
      'Custom skills built for the team\'s top 5 repeating workflows',
      'Wholesale follow-up agent: post-market recaps drafted automatically from CRM + notes',
      'Returns and exchange pattern analysis running monthly, feeding design and PDP teams',
      'Inventory and OTB narrative agent: weekly read on category health for the trade meeting',
      'Localization workflow active for the brand\'s top international market',
    ],
  },
  {
    number: 4,
    name: 'Leverage',
    months: 'Months 10-12',
    goal: 'Tighten the system, measure outcomes, and reinvest saved hours into what grows the brand.',
    status: 'upcoming',
    items: [
      'Quarterly Brand Voice refresh based on where AI drift was observed',
      'Prompt library audit: deprecate weak prompts, promote proven ones',
      'Annual AI Use Policy review',
      'Formal time-savings report: hours returned across all functions',
      '12-month revenue and margin impact read: PDP conversion, email performance, markdown rate, inventory turn',
    ],
  },
];

export const STRATEGIC_PRINCIPLES = [
  {
    number: '01',
    title: 'Brand voice is the non-negotiable input',
    body: 'Claude can imitate any voice it is shown well. It cannot invent the Simon Miller voice unprompted. Every customer-facing workflow begins with the brand voice document loaded as context.',
  },
  {
    number: '02',
    title: 'Human-in-the-loop on anything customer-facing',
    body: 'AI drafts; a human edits and approves. The time savings come from a fast first draft — not from removing human judgment.',
  },
  {
    number: '03',
    title: 'Start internal, then move customer-facing',
    body: 'The fastest wins and lowest risk live in internal workflows: meeting notes, reports, vendor emails, market prep, sell-through synthesis.',
  },
  {
    number: '04',
    title: 'Confidentiality of unreleased product is sacred',
    body: 'Tech packs, line plans, vendor cost sheets, and sample photos of unreleased styles go only into the Claude Team/Enterprise tier with training opt-out.',
  },
  {
    number: '05',
    title: 'Compound knowledge over individual hacks',
    body: 'A prompt in one designer\'s Notes app is a hack. The same prompt, refined and stored in a shared library with brand voice attached, is an asset.',
  },
  {
    number: '06',
    title: 'Measure time saved and revenue moved, not prompts run',
    body: 'Adoption is measured by outcomes: hours returned, turnaround time on PDPs, wholesale follow-up cycle, markdown rate, inventory turn.',
  },
  {
    number: '07',
    title: 'Small, reversible bets first',
    body: 'Every pilot can be killed in a week with no contractual or workflow debris. The team should feel that experimenting with AI is cheap, safe, and encouraged.',
  },
];

export const DEFAULT_BRAND_VOICE = {
  whoWeAre: 'Simon Miller is a contemporary, design-led brand that makes pieces with personality and longevity across five categories: ready-to-wear, bags, shoes, swim, and jewelry. We operate with the creative ambition of a much larger house and the precision of a small one. We make things that feel specific — not generic, not safe, not for everyone.',
  whoWeServe: 'She is a confident woman, 28–45, who has moved past aspirational dressing. She collects pieces, not outfits. Her wardrobe has restraint and wit. She knows what flatters her body and what bores her. She reads the room and then ignores it.\n\nShe rejects: fast fashion, logo-heavy branding, trend reports, and anything that tries too hard. She is not impressed by luxury for its own sake.\n\nShe is drawn to: unexpected proportions, interesting texture, a garment with a clear point of view, and brands that don\'t explain themselves too much.',
  voiceParagraph: 'The Simon Miller voice is confident without being arrogant, specific without being cold, and occasionally dry without being distant. We speak in complete thoughts, not fragments. We earn our adjectives. We don\'t say something is beautiful — we describe what makes it that way. We are not breathless. We do not hype.',
  voiceRules: [
    { yes: 'The leg cuts wide through the thigh.', no: 'An effortlessly relaxed wide-leg silhouette.' },
    { yes: 'Cotton canvas. Unlined. Gets better with wear.', no: 'Luxurious, elevated cotton canvas that stands the test of time.' },
    { yes: 'Made in Portugal. Takes dye in a way Italian mills can\'t match.', no: 'Sustainably and ethically crafted with the finest global materials.' },
    { yes: 'Wear it. The leather will go where you go.', no: 'A must-have addition to your wardrobe.' },
    { yes: 'Sits low on the hip. Not low-rise — just enough.', no: 'An effortlessly cool, barely-there waistband placement.' },
  ],
  bannedWords: ['effortless', 'elevated', 'must-have', 'luxurious', 'timeless', 'curated', 'chic', 'sophisticated', 'versatile', 'stunning', 'iconic', 'statement piece', 'wardrobe essential', 'fashion-forward', 'on-trend'],
  categoryNuance: {
    RTW: 'RTW copy lives in the body — proportion, fit, how the garment moves. Lead with construction. The story comes second.',
    Bags: 'Bags are about material and structure. Name the leather, describe the hardware, tell us how it wears over time.',
    Shoes: 'Shoes are about the last and the heel. Be precise about height, toe shape, and how it sits on the foot.',
    Swim: 'Swim copy earns permission to be a little warmer. It\'s the most personal category we make. Body language matters.',
    Jewelry: 'Jewelry copy is the most minimal. The piece is small; the description should match. One image. One detail. One fact.',
  },
  channelNuance: {
    PDP: 'Product descriptions are permanent. No time pressure or trending moment — write for someone discovering this piece in two years.',
    Email: 'Email has permission to be more immediate and conversational. Subject lines earn the open; hero copy earns the click.',
    Instagram: 'Instagram is where we show, not tell. When we do caption, it\'s short, unexpected, and doesn\'t explain the image.',
    TikTok: 'TikTok is where we can be slightly more irreverent. One specific thought. No brand polish. Real language.',
    Press: 'Press materials are factual and specific. Include production details, category context, and pricing. No superlatives.',
    'Customer Service': 'CS voice is warm and direct. We solve the problem in the first sentence. We don\'t apologize generically — we fix specifically.',
  },
  examples: {
    pdps: [
      'The seam runs straight through the center front — a deliberate choice that makes the trouser read longer. Topstitched in contrasting thread. Italian wool-cotton blend. Dry clean.',
      'Heavyweight canvas. Structured enough to hold its shape, but it breaks in over time. Single interior pocket. Brass fittings. Made in Spain.',
    ],
    emails: [
      'New swim. No announcements.',
      'The coat that started the whole thing.',
      'Five bags. One decision.',
    ],
    social: [
      'The leg is the point.',
      'Canvas, brass, and about three years from now.',
      'It holds your keys and a dinner reservation.',
    ],
    cs: [
      'I can see the delay on your order — it\'s in transit and will arrive by Thursday. If it doesn\'t, reach back out and I\'ll prioritize getting you a replacement.',
      'The sizing on this style runs long in the torso. If you\'re usually between sizes, I\'d go with your standard size. Happy to help if you want to talk through it.',
    ],
  },
};
