import { siteIdentity } from '@/config/site.identity'
import { getFactoryState } from '@/design/factory/get-factory-state'
import { getProductKind } from '@/design/factory/get-product-kind'

const { recipe } = getFactoryState()
const productKind = getProductKind(recipe)

// Warm editorial palette — main-brand rust, primary orange, olive accents on
// a cream base. Every visible token is derived from these in design-contract.
export const slot4BrandConfig = {
  siteName: siteIdentity.name,
  tagline: siteIdentity.tagline,
  domain: siteIdentity.domain,
  baseUrl: siteIdentity.url,
  productKind,
  ogImage: siteIdentity.ogImage,
  accents: {
    primary: '#a63a00',
    surface: '#fff7e5',
  },
  sbmLabel: 'The Library',
  sbmContributorLabel: 'Curators',
} as const
