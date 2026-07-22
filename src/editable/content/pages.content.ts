import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const pagesContent = {
  home: {
    metadata: {
      title: `${slot4BrandConfig.siteName} — A library of curated bookmarks and collections`,
      description:
        'A quiet, hand-tended library of curated bookmarks, collections and resources — kept by real curators, not algorithms.',
      openGraphTitle: `${slot4BrandConfig.siteName} — bookmarks worth keeping`,
      openGraphDescription:
        'Follow the shelves the curators actually reach for. Save what fits, share what should be seen.',
      keywords: [
        'curated bookmarks',
        'collections',
        'resources library',
        'link curation',
        'internet library',
        'reading list',
      ],
    },
    hero: {
      badge: 'A quiet library, kept by hand',
      title: [
        'Bookmarks worth keeping.',
        'Collections worth revisiting.',
      ],
      description:
        'Follow the shelves our curators actually reach for. No feed to chase, only resources worth sitting with.',
      primaryCta: { label: 'Open the Library', href: '/sbm' },
      secondaryCta: { label: 'Search finds', href: '/search' },
      searchPlaceholder: 'Search shelves, curators, or a link you can’t place',
      focusLabel: 'On the shelf',
      featureCardBadge: 'On the shelf',
      featureCardTitle: 'Fresh keeps land daily.',
      featureCardDescription:
        'Every curator’s latest finds arrive here without pushing the whole shelf out of view.',
    },
    intro: {
      badge: 'What the library is',
      title: 'A place bookmarks come to be read, not just stored.',
      paragraphs: [
        'The library gathers the links, papers and tools our curators keep sending each other, arranged into shelves anyone can follow.',
        'Every find carries the curator who kept it. Every shelf is written like a note to a friend — short, honest, and worth opening.',
        'There’s no algorithm, no ranking games, no infinite scroll. Just the resources that earned a place.',
      ],
      sideBadge: 'At a glance',
      sidePoints: [
        'Hand-picked collections around a single idea',
        'Every resource opens with domain, curator and a short brief',
        'Save what fits your own shelf in one tap',
        'Weekly digest — the shelves worth opening',
      ],
      primaryLink: { label: 'Open the Library', href: '/sbm' },
      secondaryLink: { label: 'Meet the curators', href: '/about' },
    },
    cta: {
      badge: 'Start your shelf',
      title: 'Keep a shelf worth returning to.',
      description:
        'Curate around one idea, gather the finds that support it, and let the library carry it to the readers who need it most.',
      primaryCta: { label: 'Become a curator', href: '/signup' },
      secondaryCta: { label: 'Talk with a curator', href: '/contact' },
    },
    taskSection: {
      heading: 'Fresh from {label}',
      descriptionSuffix: 'The most recent finds our curators would not let pass.',
    },
  },
  about: {
    badge: 'About the library',
    title: 'A quieter way to keep the internet.',
    description: `${slot4BrandConfig.siteName} is a library of curated collections — links, resources and finds our curators keep, share and revisit. Small on purpose, tended by hand, and always outward-linked.`,
    paragraphs: [
      'The library began as a private group of curators trading the resources they actually returned to. It stayed small because that’s what made it good.',
      'Every shelf is written the way a librarian would write it — with intent, with a point of view, and with the resource itself as the centre.',
      'We don’t rank. We don’t recommend. We keep, and we share what we kept.',
    ],
    values: [
      {
        title: 'Kept, not liked',
        description:
          'A find earns its place because a person put it there — not because it climbed a chart or hit a metric.',
      },
      {
        title: 'The source is the star',
        description:
          'We link outward. What matters is that the resource, the maker and the reader find each other.',
      },
      {
        title: 'Small on purpose',
        description:
          'Fewer shelves, tended more carefully. Growth means better collections, not more of them.',
      },
    ],
  },
  contact: {
    eyebrow: 'Write to the library',
    title: 'Send us a find, a shelf idea, or a question a curator can answer.',
    description:
      'Every message reaches a real curator — no support queue, no ticket system. If it belongs on a shelf, we’ll get back to you about how it lands there.',
    formTitle: 'Send a message',
  },
  search: {
    metadata: {
      title: 'Search the library',
      description:
        'Search curated bookmarks, collections and resources kept across the library.',
    },
    hero: {
      badge: 'Search the library',
      title: 'Find a resource, a shelf, or the curator who keeps it.',
      description:
        'Search by keyword, domain, tag or shelf. Results stay grounded in what curators have actually kept.',
      placeholder: 'Search a title, a domain, or a shelf name',
    },
    resultsTitle: 'Fresh from the library',
  },
  create: {
    metadata: {
      title: 'Curate a new find',
      description: 'Add a resource to the library.',
    },
    locked: {
      badge: 'Curator access',
      title: 'Sign in to add to the library.',
      description:
        'The publishing workspace is for signed-in curators. Sign in, or become one — it takes about a minute.',
    },
    hero: {
      badge: 'Publishing workspace',
      title: 'Keep a new find on the shelf.',
      description:
        'Choose the shelf, add the resource, and write the one-line brief a friend would want. That’s the whole workflow.',
    },
    formTitle: 'The find',
    submitLabel: 'Keep this find',
    successTitle: 'Find kept.',
  },
  auth: {
    login: {
      metadataDescription: 'Sign in to your curator account.',
      badge: 'Curator sign in',
      title: 'Welcome back to the library.',
      description:
        'Sign in to open your shelves, follow other curators, and keep new finds without losing your place.',
      formTitle: 'Sign in',
      submitLabel: 'Continue',
      noAccount: 'No account matched those details. Create one first, then sign in.',
      success: 'Signed in. Taking you back to the library…',
      createCta: 'Become a curator',
    },
    signup: {
      metadataDescription: 'Become a curator on the library.',
      badge: 'Become a curator',
      title: 'Start a shelf worth following.',
      description:
        'Curators keep the library alive. Name your first shelf, keep the first find, and let the library carry it to the readers who need it.',
      formTitle: 'Create your curator account',
      submitLabel: 'Become a curator',
      passwordShort: 'Use at least 4 characters for the password.',
      success: 'Welcome to the library. Setting up your shelf…',
      loginCta: 'Sign in',
    },
  },
  detailPages: {
    article: {
      relatedTitle: 'From the same field',
      fallbackTitle: 'Field notes',
    },
    listing: {
      relatedTitle: 'From this directory',
      fallbackTitle: 'Listing details',
    },
    image: {
      relatedTitle: 'From the same plate',
      fallbackTitle: 'Visual notes',
    },
    profile: {
      relatedTitle: 'Their kept finds',
      fallbackDescription: 'Curator details land here once available.',
      visitButton: 'Visit their site',
    },
  },
} as const
