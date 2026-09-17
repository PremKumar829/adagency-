export type Language = 'en' | 'hi';

export type Currency = 'INR' | 'USD' | 'USDT';

export interface CurrencyRate {
  symbol: string;
  rate: number; // relative to USD as base 1
  label: string;
}

export interface ServiceItem {
  id: string;
  category: 'telegram' | 'gambling' | 'social' | 'crypto' | 'custom';
  icon: string;
  title: string;
  shortDesc: string;
  features: string[];
  metrics: string;
  startingPriceUsd: number;
  badge?: string;
  popular?: boolean;
}

export interface CaseStudy {
  id: string;
  title: string;
  category: string;
  clientType: string;
  duration: string;
  beforeStat: string;
  afterStat: string;
  growthPercentage: string;
  roi: string;
  description: string;
  chartPoints: number[];
}

export interface LedgerOrder {
  id: string;
  timestamp: string;
  clientMask: string;
  serviceCategory: string;
  packageName: string;
  volume: string;
  amountUsd: number;
  status: 'Completed' | 'Delivering' | 'In Queue' | 'Active';
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface ClientInquiry {
  id: string;
  name: string;
  contact: string;
  category: string;
  budget: string;
  message: string;
  timestamp: string;
  status: 'New' | 'Contacted' | 'In Progress' | 'Completed';
}

export interface GoalMessageConfig {
  clientName: string;
  selectedGoal: string;
  budget: string;
  targetHandleOrUrl: string;
}

export type ContactRoutingMode = 'both' | 'telegram_only' | 'whatsapp_only' | 'backup_whatsapp';

export interface AgencySettings {
  // Contact Channels
  primaryWhatsapp: string;
  backupWhatsapp: string;
  contactRoutingMode: ContactRoutingMode;
  telegramHandle: string;
  telegramChannelLink: string;
  email: string;
  phone: string;
  address: string;

  // Site Content & Headlines
  brandName: string;
  heroHeadline: string;
  heroSubtitle: string;
  heroSubheadline?: string;
  cpcHighlight: string;
  activeClientsCount: string;
  successRate: string;
  campaignsCount: string;

  // Announcement bar
  announcementText?: string;
  isAnnouncementVisible?: boolean;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface CustomInvoice {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  category: string;
  clientName: string;
  clientCompany?: string;
  clientContact: string;
  clientAddress?: string;
  agencyName: string;
  agencyAddress: string;
  agencyPhone: string;
  agencyEmail: string;
  agencyWebsite: string;
  ceoName: string; // Prem Gupta
  ceoDesignation: string; // Founder & CEO
  includeDigitalSignature: boolean;
  signatureDate: string;
  digitalStampCode: string;
  currency: 'INR' | 'USD' | 'USDT';
  items: InvoiceItem[];
  subtotal: number;
  taxPercent: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  paymentMode: 'UPI' | 'Bank Transfer' | 'Crypto (USDT)' | 'Card' | 'Cash';
  transactionId: string;
  paymentStatus: 'Paid' | 'Pending' | 'Partially Paid';
  paymentDate?: string;
  notes?: string;
}



