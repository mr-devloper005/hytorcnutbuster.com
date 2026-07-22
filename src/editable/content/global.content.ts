import type { TaskKey } from '@/lib/site-config'
import { slot4BrandConfig } from '@/editable/theme/brand.config'

/*
  Global editable content.

  `uiHiddenTaskKeys` lists tasks whose backends stay functional (direct URLs,
  data fetching, SEO) but which must NEVER appear in the public UI. Filter with
  `isUiHiddenTask` in every surface that renders a task (nav, footer, home,
  search, create, stats). Profile is hidden — collections/library discovery is
  what the public UI centers on.
*/

export const uiHiddenTaskKeys = ['profile'] as const
export const isUiHiddenTask = (key: string) =>
  (uiHiddenTaskKeys as readonly string[]).includes(key)

const TASK_LABEL_OVERRIDES: Partial<Record<TaskKey, string>> = {
  sbm: slot4BrandConfig.sbmLabel,
}

/** Public-facing label for a task. Falls back to the SITE_CONFIG label. */
export const getTaskDisplayLabel = (task: { key: TaskKey; label: string }) =>
  TASK_LABEL_OVERRIDES[task.key] || task.label

/** Contributor label (e.g. Curators for The Library). */
export const getTaskContributorLabel = (task: { key: TaskKey }) =>
  task.key === 'sbm' ? slot4BrandConfig.sbmContributorLabel : 'Contributors'

export const globalContent = {
  site: {
    name: slot4BrandConfig.siteName,
    tagline: slot4BrandConfig.tagline || 'Curated bookmarks and collections',
    domain: slot4BrandConfig.domain,
    baseUrl: slot4BrandConfig.baseUrl,
  },
  nav: {
    tagline: 'Curated collections and resources',
    // No task links — collections discovery lives on home + footer.
    primaryLinks: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
    actions: {
      primary: { label: 'Open the Library', href: '/sbm' },
      secondary: { label: 'Submit a find', href: '/contact' },
    },
  },
  footer: {
    tagline: 'Curated collections, resources and links you can trust.',
    description:
      'A hand-tended library of the collections curators actually reach for. Follow the shelves, save what fits, share what should be seen.',
    // The visible footer builds its columns from CATEGORY_OPTIONS + these
    // static links. Kept as an array so the content contract stays intact.
    columns: [
      {
        title: 'Discover',
        links: [
          { label: 'Open the Library', href: '/sbm' },
          { label: 'Search finds', href: '/search' },
          { label: 'About the library', href: '/about' },
          { label: 'Submit a find', href: '/contact' },
        ],
      },
    ],
    bottomNote: 'Built for readers who bookmark on purpose.',
  },
  collectionsColumn: {
    title: 'Collections',
    fallbackLabel: 'Browse categories',
  },
  commonLabels: {
    readMore: 'Open resource',
    viewAll: 'Open shelf',
    explore: 'Browse',
    latest: 'Fresh finds',
    related: 'From this shelf',
    published: 'Curated',
    saved: 'Saved',
    visit: 'Visit resource',
    domain: 'Domain',
    verified: 'Verified curator',
  },
} as const
