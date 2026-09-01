import { Package, PackageMarket } from '@/types';

const INR_FORMATTER = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export const USD_TO_INR_RATE = 100;

export function hasPackagePrice(price: number | null | undefined): price is number {
  return typeof price === 'number' && Number.isFinite(price);
}

export function formatPackagePriceInr(price: Package['priceInr']) {
  return hasPackagePrice(price) ? INR_FORMATTER.format(price) : 'ON REQUEST';
}

export function convertUsdToInr(price: Package['priceUsd']) {
  return hasPackagePrice(price) ? price * USD_TO_INR_RATE : null;
}

export function getPackageMarket(pkg: Pick<Package, 'market'>): PackageMarket {
  return pkg.market === 'global' ? 'global' : 'india';
}

export function getPackagePrimaryPrice(
  pkg: Pick<Package, 'market' | 'priceInr' | 'priceUsd'>,
  market: PackageMarket = getPackageMarket(pkg)
) {
  const convertedUsdPrice = convertUsdToInr(pkg.priceUsd);

  if (market === 'global') {
    return hasPackagePrice(convertedUsdPrice)
      ? { amount: convertedUsdPrice, currency: 'INR' as const, label: formatPackagePriceInr(convertedUsdPrice) }
      : { amount: pkg.priceInr, currency: 'INR' as const, label: formatPackagePriceInr(pkg.priceInr) };
  }

  return hasPackagePrice(pkg.priceInr)
    ? { amount: pkg.priceInr, currency: 'INR' as const, label: formatPackagePriceInr(pkg.priceInr) }
    : { amount: convertedUsdPrice, currency: 'INR' as const, label: formatPackagePriceInr(convertedUsdPrice) };
}

export function hasPackageMarketPrice(
  pkg: Pick<Package, 'market' | 'priceInr' | 'priceUsd'>,
  market?: PackageMarket
) {
  return hasPackagePrice(getPackagePrimaryPrice(pkg, market).amount);
}
