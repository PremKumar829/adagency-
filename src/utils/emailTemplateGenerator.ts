import { ClientInquiry, AgencySettings } from '../types';

export interface EmailTemplateResult {
  recipient: string;
  subject: string;
  body: string;
  category: string;
  deliverables: string[];
  timeline: string;
}

export const AVAILABLE_SERVICE_CATEGORIES = [
  'Telegram Channel & Group Growth',
  'Gambling & Gaming Ads',
  'Crypto & Web3 Marketing',
  'Social Media Growth & Meta Ads',
  'Agency Wholesale / Reseller',
  'Custom Brand & Mobile App Installs',
] as const;

export function detectServiceCategory(categoryStr: string): string {
  const lower = (categoryStr || '').toLowerCase();
  if (lower.includes('telegram') || lower.includes('channel') || lower.includes('group')) {
    return 'Telegram Channel & Group Growth';
  }
  if (lower.includes('gambling') || lower.includes('casino') || lower.includes('betting') || lower.includes('gaming')) {
    return 'Gambling & Gaming Ads';
  }
  if (lower.includes('crypto') || lower.includes('web3') || lower.includes('token') || lower.includes('dex')) {
    return 'Crypto & Web3 Marketing';
  }
  if (lower.includes('social') || lower.includes('meta') || lower.includes('youtube') || lower.includes('instagram')) {
    return 'Social Media Growth & Meta Ads';
  }
  if (lower.includes('reseller') || lower.includes('wholesale') || lower.includes('agency')) {
    return 'Agency Wholesale / Reseller';
  }
  return 'Custom Brand & Mobile App Installs';
}

export function extractEmailAddress(contact: string): string {
  if (!contact) return '';
  const trimmed = contact.trim();
  // Simple check for email format
  const emailMatch = trimmed.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  return emailMatch ? emailMatch[0] : '';
}

export function generateInquiryEmailTemplate(params: {
  inquiry: ClientInquiry;
  selectedCategory?: string;
  agencySettings: AgencySettings;
}): EmailTemplateResult {
  const { inquiry, agencySettings } = params;
  const category = params.selectedCategory || detectServiceCategory(inquiry.category);
  const clientName = inquiry.name?.trim() || 'Valued Client';
  const brandName = agencySettings.brandName || 'Prime Ads Agency';
  const whatsapp = agencySettings.primaryWhatsapp || '+91 7004166377';
  const telegram = agencySettings.telegramHandle ? `@${agencySettings.telegramHandle.replace('@', '')}` : '@PREMGUPTA2M';
  const recipient = extractEmailAddress(inquiry.contact);
  const budget = inquiry.budget || 'Custom Budget';

  let subject = '';
  let deliverables: string[] = [];
  let timeline = '';
  let strategicHighlights = '';

  switch (category) {
    case 'Telegram Channel & Group Growth':
      subject = `Strategic Growth Proposal: Telegram Scaling Blueprint for ${clientName} | ${brandName}`;
      timeline = '24 - 48 hours deployment (initial wave active within 12 hours)';
      deliverables = [
        'Targeted Real Members: Filtered by niche (crypto, betting, trading, entertainment, or custom GEO)',
        '30-Day Retention Guarantee: 100% replacement warranty against natural drops',
        'Activity Booster: Synchronized post views and initial reaction multipliers for high social proof',
        'Broadcast Exposure: Direct promotional forwards across high-engagement affiliate channels',
        'Full Transparency: Live join-link tracking and analytics log',
      ];
      strategicHighlights = `For your Telegram initiative, our primary focus is driving genuine, niche-interested members rather than dead numbers. We employ proprietary invite distribution channels to ensure your post-view ratios and member retention remain exceptionally healthy.`;
      break;

    case 'Gambling & Gaming Ads':
      subject = `Direct Player Acquisition Campaign: Proposal for ${clientName} | ${brandName}`;
      timeline = 'Campaign launch within 24 hours of creative approval';
      deliverables = [
        'High-Intent FTD Traffic: Geotargeted player acquisition (Tier-1, LatAm, India Tier-2/3)',
        'Compliant Cloaking & Direct Funnels: Zero account bans with resilient landing architecture',
        'Premium Placements: Exclusive casino banners, Telegram gaming channels & high-CTR popunder slots',
        'Performance Attribution: Real-time CPL/CPA tracking with postback integration support',
        'Dedicated Creative Optimization: A/B tested promotional copy and high-converting hooks',
      ];
      strategicHighlights = `In the iGaming & gambling sector, conversion to First Time Deposit (FTD) is the only metric that matters. We route verified, high-roller and casual betting audiences directly to your registration and deposit funnels.`;
      break;

    case 'Crypto & Web3 Marketing':
      subject = `DexScreener Trending & Investor Push: Roadmap for ${clientName} | ${brandName}`;
      timeline = 'Immediate execution aligned with your liquidity launch or trending window';
      deliverables = [
        'DexScreener & DEXTools Trending: Fast-track Top 1-5 rank visibility with volume simulation',
        'Alpha Call Channel Shoutouts: Direct promotion across vetted Tier-1 whale and caller groups',
        'Community Raid Squads: 24/7 active shillers and engagement drivers on Telegram & X/Twitter',
        'CMC & CoinGecko Fast Track: Priority queue review and fast listing support',
        'Multi-Chain Coverage: Native support for Solana, Ethereum, BNB Chain, and Base projects',
      ];
      strategicHighlights = `For Web3 and token growth, momentum and volume velocity determine virality. Our targeted multi-channel push triggers algorithmic trending while bringing genuine holders and liquidity providers into your community.`;
      break;

    case 'Social Media Growth & Meta Ads':
      subject = `Brand Scaling & High-ROI Ads Blueprint for ${clientName} | ${brandName}`;
      timeline = 'Creative pipeline and setup in 24 hours; scaling over 7 - 14 days';
      deliverables = [
        'Whitelisted Meta Ad Infrastructure: High-trust Facebook & Instagram accounts for uninterrupted spend',
        'Viral Reels & Short Video Seeding: Algorithmic distribution through niche creator networks',
        'YouTube Watch Time & Subscribers: High-retention monetized view surges with real human engagement',
        'Precision Audience Retargeting: Custom pixel audience building to lower your effective cost-per-click',
        'Weekly Performance Audits: Transparent reporting on CTR, CPM, and conversion metrics',
      ];
      strategicHighlights = `We structure paid acquisition to keep your blended acquisition cost (CAC) well under industry averages, leveraging dark ad frameworks and viral video syndication.`;
      break;

    case 'Agency Wholesale / Reseller':
      subject = `White-Label Reseller Program & Wholesale API Access for ${clientName} | ${brandName}`;
      timeline = 'Immediate reseller dashboard and API key activation';
      deliverables = [
        'Tiered Wholesale Pricing: Up to 40% margin discount off our standard retail rates',
        'Automated API & Bulk Panel: Seamless order integration directly from your portal or CRM',
        'Unbranded White-Label Reports: Client-ready PDF and link deliverables carrying your own agency watermark',
        'Priority Server Queue: Your client orders receive Level-1 execution priority',
        'Dedicated VIP Account Manager: 24/7 direct Telegram line for rapid adjustments and custom quotes',
      ];
      strategicHighlights = `Our reseller infrastructure empowers high-volume agencies to resell Telegram, gambling, and social promotion seamlessly under your own brand identity without managing server infrastructure.`;
      break;

    default: // Custom Brand & Mobile App Installs
      subject = `Bespoke Growth Blueprint: Custom Campaign for ${clientName} | ${brandName}`;
      timeline = 'Custom onboarding & launch within 24 to 48 hours';
      deliverables = [
        'High-Retention Mobile App Installs: Verified downloads with Day-1 to Day-7 retention incentives',
        'Direct WhatsApp Lead Generation: Click-to-chat traffic sequences with qualified lead screening',
        'Hyper-Local Geotargeted Push: Targeted ad delivery tailored to your specific regional demographics',
        'Conversion Rate Optimization (CRO): Full audit of your landing page, channel or download funnel',
        'End-to-End Campaign Dashboard: Real-time visibility into impressions, clicks, and acquired leads',
      ];
      strategicHighlights = `We design custom growth architectures engineered specifically around your project's economics, ensuring every dollar invested produces measurable, quantifiable returns.`;
      break;
  }

  const clientNotesSection = inquiry.message?.trim()
    ? `\nRegarding your specific requirements: "${inquiry.message.trim()}"\nWe have incorporated these exact criteria into the operational plan below.\n`
    : '';

  const deliverablesFormatted = deliverables.map((item, idx) => `  ${idx + 1}. ${item}`).join('\n');

  const body = `Dear ${clientName},

Thank you for reaching out to ${brandName}. We have reviewed your project details regarding our ${category} solutions.
${clientNotesSection}
🎯 EXECUTIVE CAMPAIGN ROADMAP:
${deliverablesFormatted}

⏱️ ESTIMATED LAUNCH & DELIVERY TIMELINE:
  • ${timeline}

💰 ALLOCATED BUDGET & SCOPE:
  • Target Budget: ${budget}
  • Based on your indicated budget, we have structured a high-velocity package calibrated to provide maximum volume, retention, and conversion ROI.

💡 STRATEGIC HIGHLIGHT:
${strategicHighlights}

👉 NEXT STEPS TO INITIATE CAMPAIGN:
To lock in your schedule and begin asset preparation:
  1. Simply reply to this email with your target links/channels and preferred GEO focus.
  2. For immediate 5-minute setup, connect directly with our Head of Operations via:
     • WhatsApp: ${whatsapp}
     • Telegram: ${telegram}

We look forward to partnering with you and scaling your reach.

Warm regards,

Client Success & Operations Team
${brandName}
──────────────────────────────────────
Direct Desk WhatsApp: ${whatsapp}
Direct Desk Telegram: ${telegram}
Official Support Email: ${agencySettings.email || 'support@primeads.agency'}
Official Website: ${typeof window !== 'undefined' ? window.location.origin : 'https://primeads.agency'}
`;

  return {
    recipient,
    subject,
    body,
    category,
    deliverables,
    timeline,
  };
}
