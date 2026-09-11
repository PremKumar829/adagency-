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

