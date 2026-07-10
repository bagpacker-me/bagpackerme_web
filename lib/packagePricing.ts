import { Package, PackageMarket } from '@/types';

const INR_FORMATTER = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const USD_FORMATTER = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function hasPackagePrice(price: number | null | undefined): price is number {
  return typeof price === 'number' && Number.isFinite(price);
}

export function formatPackagePriceInr(price: Package['priceInr']) {
  return hasPackagePrice(price) ? INR_FORMATTER.format(price) : 'ON REQUEST';
}

export function formatPackagePriceUsd(price: Package['priceUsd']) {
  return hasPackagePrice(price) ? USD_FORMATTER.format(price) : 'ON REQUEST';
}

export function getPackageMarket(pkg: Pick<Package, 'market'>): PackageMarket {
  return pkg.market === 'global' ? 'global' : 'india';
}

export function getPackagePrimaryPrice(
  pkg: Pick<Package, 'market' | 'priceInr' | 'priceUsd'>,
  market: PackageMarket = getPackageMarket(pkg)
) {
  if (market === 'global') {
    return hasPackagePrice(pkg.priceUsd)
      ? { amount: pkg.priceUsd, currency: 'USD' as const, label: formatPackagePriceUsd(pkg.priceUsd) }
      : { amount: pkg.priceInr, currency: 'INR' as const, label: formatPackagePriceInr(pkg.priceInr) };
  }

  return hasPackagePrice(pkg.priceInr)
    ? { amount: pkg.priceInr, currency: 'INR' as const, label: formatPackagePriceInr(pkg.priceInr) }
    : { amount: pkg.priceUsd, currency: 'USD' as const, label: formatPackagePriceUsd(pkg.priceUsd) };
}

export function hasPackageMarketPrice(
  pkg: Pick<Package, 'market' | 'priceInr' | 'priceUsd'>,
  market?: PackageMarket
) {
  return hasPackagePrice(getPackagePrimaryPrice(pkg, market).amount);
}
