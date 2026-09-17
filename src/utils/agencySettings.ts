import { AgencySettings } from '../types';

export const DEFAULT_AGENCY_SETTINGS: AgencySettings = {
  primaryWhatsapp: '+91 7004166377',
  backupWhatsapp: '',
  contactRoutingMode: 'both',
  telegramHandle: 'PREMGUPTA2M',
  telegramChannelLink: 'https://t.me/PREMGUPTA2M',
  email: 'pk4030794@gmail.com',
  phone: '+91 7004166377',
  address: 'Katihar, Bihar - 854101',
  brandName: 'Prime Ads Agency',
  heroHeadline: 'Scale Your Brand, Telegram Channels & Platforms Fast',
  heroSubtitle: 'Professional, high-impact promotion services for businesses, Telegram groups, gambling networks, and specialized platforms with guaranteed reach.',
  cpcHighlight: 'CPC Under ₹2',
  activeClientsCount: '20,000+',
  successRate: '99.8%',
  campaignsCount: '45,000+',
};

const STORAGE_KEY = 'prime_ads_agency_settings';

export function loadAgencySettings(): AgencySettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_AGENCY_SETTINGS, ...parsed };
    }
  } catch {
    // fallback
  }
  return { ...DEFAULT_AGENCY_SETTINGS };
}

export function saveAgencySettings(settings: AgencySettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save agency settings:', err);
  }
}

export function cleanPhoneForWhatsApp(phoneStr: string): string {
  if (!phoneStr) return '';
  // Remove spaces, dashes, brackets, plus sign
  const digits = phoneStr.replace(/\D/g, '');
  // If user entered 10 digits without 91, prepend 91 for India
  if (digits.length === 10) {
    return `91${digits}`;
  }
  return digits;
}

export function getEffectiveWhatsappNumber(settings: AgencySettings): string {
  if (settings.contactRoutingMode === 'backup_whatsapp' && settings.backupWhatsapp) {
    return settings.backupWhatsapp;
  }
  return settings.primaryWhatsapp || settings.backupWhatsapp || '';
}

export function buildWhatsAppLink(settings: AgencySettings, prefilledMessage?: string): string {
  const number = getEffectiveWhatsappNumber(settings);
  const cleanNum = cleanPhoneForWhatsApp(number);
  const textParam = prefilledMessage ? `?text=${encodeURIComponent(prefilledMessage)}` : '';
  if (!cleanNum) {
    // If no number, fallback to Telegram
    return buildTelegramLink(settings);
  }
  return `https://wa.me/${cleanNum}${textParam}`;
}

export function buildTelegramLink(settings: AgencySettings): string {
  const handle = settings.telegramHandle.replace('@', '').trim();
  if (!handle) return 'https://t.me/PREMGUPTA2M';
  return `https://t.me/${handle}`;
}
