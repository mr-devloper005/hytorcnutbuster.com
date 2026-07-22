import type { TaskKey } from '@/lib/site-config'

export type TaskPageVoice = {
  eyebrow: string
  headline: string
  description: string
  filterLabel: string
  secondaryNote: string
  chips: string[]
}

/*
  Only `sbm` is enabled in the public UI (profile stays functional but hidden).
  Voices for other tasks are kept in place so direct URLs stay coherent, but
  the public UI never surfaces those archives.
*/
export const taskPageVoices = {
  article: {
    eyebrow: 'Field notes',
    headline: 'Long-form reads that shape how curators think.',
    description:
      'Essays and reference pieces kept by curators for the ideas they keep returning to.',
    filterLabel: 'Filter by shelf',
    secondaryNote: 'Longer reads sit best with room to breathe.',
    chips: ['Editorial pacing', 'Curator-picked', 'Long reads worth the time'],
  },
  classified: {
    eyebrow: 'Ledger',
    headline: 'Time-boxed opportunities from the library.',
    description:
      'Open calls, submissions, and deadlines the curators want on your radar.',
    filterLabel: 'Filter by lane',
    secondaryNote: 'Ledger entries drop off automatically when they close.',
    chips: ['Time-boxed', 'Curator-picked', 'Open now'],
  },
  sbm: {
    eyebrow: 'The Library',
    headline: 'The shelves the library keeps returning to.',
    description:
      'A living index of curated collections. Every shelf gathers the finds our curators trust, keep and revisit.',
    filterLabel: 'Choose a shelf',
    secondaryNote: 'Every find opens to the domain, curator and shelf that keeps it.',
    chips: ['Curator-kept', 'One-tap open', 'Living shelves'],
  },
  profile: {
    eyebrow: 'Curator',
    headline: 'The curator behind the shelf.',
    description:
      'Everything you need to know about who kept the resource and why it earned the shelf.',
    filterLabel: 'Filter curators',
    secondaryNote: 'Curator pages are direct-link only — they are not promoted in the library.',
    chips: ['Identity first', 'Curator record', 'Kept finds'],
  },
  pdf: {
    eyebrow: 'Papers',
    headline: 'Downloadable references worth keeping close.',
    description:
      'Guides, briefs and papers the library keeps ready to open.',
    filterLabel: 'Filter by paper',
    secondaryNote: 'Papers stay downloadable so curators can annotate offline.',
    chips: ['Downloadable', 'Reference material', 'Curator-kept'],
  },
  listing: {
    eyebrow: 'Directory',
    headline: 'Studios, services and places the library trusts.',
    description:
      'A slim directory of the places curators recommend when asked.',
    filterLabel: 'Filter by field',
    secondaryNote: 'Directory entries carry the curator who added them.',
    chips: ['Curator-vouched', 'Compare quickly', 'Direct outreach'],
  },
  image: {
    eyebrow: 'Plates',
    headline: 'A visual journal of finds and moodboards.',
    description:
      'Image-led shelves for the visual references curators keep coming back to.',
    filterLabel: 'Filter by plate',
    secondaryNote: 'Every plate opens with the curator who assembled it.',
    chips: ['Visual-first', 'Moodboard-ready', 'Curator-kept'],
  },
} satisfies Record<TaskKey, TaskPageVoice>
