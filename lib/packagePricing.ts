import { Package } from '@/types';

const INR_FORMATTER = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function hasPackagePrice(price: Package['priceInr']): price is number {
  return typeof price === 'number' && Number.isFinite(price);
}

export function formatPackagePriceInr(price: Package['priceInr']) {
  return hasPackagePrice(price) ? INR_FORMATTER.format(price) : 'ON REQUEST';
}
