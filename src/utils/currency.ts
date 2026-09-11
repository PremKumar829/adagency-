import { Currency, CurrencyRate } from '../types';

export const CURRENCY_CONFIG: Record<Currency, CurrencyRate> = {
  USD: {
    symbol: '$',
    rate: 1,
    label: 'USD ($)',
  },
  INR: {
    symbol: '₹',
    rate: 87,
    label: 'INR (₹)',
  },
  USDT: {
    symbol: '₮',
    rate: 1,
    label: 'USDT (₮)',
  },
};

export function formatPrice(amountInUsd: number, currency: Currency): string {
  const config = CURRENCY_CONFIG[currency] || CURRENCY_CONFIG.USD;
  const converted = amountInUsd * config.rate;

  if (currency === 'INR') {
    return `₹${Math.round(converted).toLocaleString('en-IN')}`;
  } else if (currency === 'USDT') {
    return `${converted >= 100 ? Math.round(converted).toLocaleString() : converted.toFixed(1)} ₮`;
  }
  return `$${Math.round(converted).toLocaleString('en-US')}`;
}
