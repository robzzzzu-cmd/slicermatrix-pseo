export const SITE_URL =
  import.meta.env.SITE_URL ||
  process.env.SITE_URL ||
  'https://slicermatrix.pages.dev';

export const PUBLIC_AMAZON_AFFILIATE_TAG =
  import.meta.env.PUBLIC_AMAZON_AFFILIATE_TAG ||
  process.env.PUBLIC_AMAZON_AFFILIATE_TAG ||
  'yourtag-20';

export const SITE_NAME = 'SlicerMatrix';
export const SITE_TAGLINE = 'Precision 3D Printer × Filament OrcaSlicer Profile Database';

export function buildAmazonSearchUrl(query: string, tag: string = PUBLIC_AMAZON_AFFILIATE_TAG): string {
  return `https://www.amazon.com/s?k=${encodeURIComponent(query)}&tag=${encodeURIComponent(tag)}`;
}
