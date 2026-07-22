import type { CSSProperties } from 'react'

/*
  Design contract.

  All visible tokens the editable UI consumes are declared here — colors,
  container width, section rhythm, radii, buttons, cards, motion. Everything
  else references `--slot4-*` or the class strings this file exports so the
  entire site can be reskinned in one place without touching JSX.
*/

export const editableRootStyle = {
  // ---- surface + copy palette (warm editorial) ----
  '--slot4-page-bg': '#fff7e5',
  '--slot4-page-text': '#110600',
  '--slot4-panel-bg': '#faf7ed',
  '--slot4-surface-bg': '#fffdf7',
  '--slot4-product-bg': '#fcfaf4',
  '--slot4-muted-text': '#625a53',
  '--slot4-soft-muted-text': '#92867b',
  '--slot4-accent': '#a63a00',
  '--slot4-accent-fill': '#a63a00',
  '--slot4-accent-strong': '#7a2a00',
  '--slot4-accent-soft': '#fbe6d3',
  '--slot4-accent-secondary': '#e77b2a',
  '--slot4-on-accent': '#fff7e5',
  '--slot4-olive': '#57772e',
  '--slot4-olive-soft': '#e5eddc',
  '--slot4-dark-bg': '#210c00',
  '--slot4-dark-text': '#fff7e5',
  '--slot4-media-bg': '#f1e6d3',
  '--slot4-cream': '#fff7e5',
  '--slot4-warm': '#faf7ed',
  '--slot4-lavender': '#f4ecda',
  '--slot4-gray': '#f6f5f4',
  '--slot4-body-gradient': 'none',
  '--slot4-verified': '#27ae60',
  // ---- editable aliases (used across components) ----
  '--editable-page-bg': '#fff7e5',
  '--editable-page-text': '#110600',
  '--editable-container': '1360px',
  '--editable-container-narrow': '900px',
  '--editable-border': '#e9d1be',
  '--editable-border-soft': '#f1dfc9',
  '--editable-divider': '#e9d1be',
  '--editable-nav-bg': '#fff7e5',
  '--editable-nav-text': '#110600',
  '--editable-nav-active': '#a63a00',
  '--editable-nav-active-text': '#fff7e5',
  '--editable-cta-bg': '#210c00',
  '--editable-cta-text': '#fff7e5',
  '--editable-search-bg': '#fffdf7',
  '--editable-footer-bg': '#210c00',
  '--editable-footer-text': '#fff7e5',
  // ---- section rhythm + radii ----
  '--editable-radius-sm': '10px',
  '--editable-radius-md': '20px',
  '--editable-radius-lg': '28px',
  '--editable-radius-xl': '40px',
  '--editable-radius-pill': '999px',
  '--editable-section-y': 'clamp(72px, 9vw, 140px)',
  '--editable-section-y-tight': 'clamp(56px, 7vw, 96px)',
  // ---- motion ----
  '--editable-ease': 'cubic-bezier(0.22, 1, 0.36, 1)',
  '--editable-duration-fast': '240ms',
  '--editable-duration-medium': '360ms',
  '--editable-duration-slow': '560ms',
} as CSSProperties

export const editablePalette = {
  pageBg: 'bg-[var(--slot4-page-bg)]',
  pageText: 'text-[var(--slot4-page-text)]',
  panelBg: 'bg-[var(--slot4-panel-bg)]',
  panelText: 'text-[var(--slot4-page-text)]',
  surfaceBg: 'bg-[var(--slot4-surface-bg)]',
  surfaceText: 'text-[var(--slot4-page-text)]',
  productBg: 'bg-[var(--slot4-product-bg)]',
  mutedText: 'text-[var(--slot4-muted-text)]',
  softMutedText: 'text-[var(--slot4-soft-muted-text)]',
  accentText: 'text-[var(--slot4-accent)]',
  accentBg: 'bg-[var(--slot4-accent-fill)]',
  accentSoftBg: 'bg-[var(--slot4-accent-soft)]',
  accentSoftText: 'text-[var(--slot4-accent-soft)]',
  accentSecondaryText: 'text-[var(--slot4-accent-secondary)]',
  onAccentText: 'text-[var(--slot4-on-accent)]',
  darkBg: 'bg-[var(--slot4-dark-bg)]',
  darkText: 'text-[var(--slot4-dark-text)]',
  mediaBg: 'bg-[var(--slot4-media-bg)]',
  creamBg: 'bg-[var(--slot4-cream)]',
  warmBg: 'bg-[var(--slot4-warm)]',
  lavenderBg: 'bg-[var(--slot4-lavender)]',
  grayBg: 'bg-[var(--slot4-gray)]',
  oliveText: 'text-[var(--slot4-olive)]',
  oliveBg: 'bg-[var(--slot4-olive-soft)]',
  verifiedText: 'text-[var(--slot4-verified)]',
  border: 'border-[var(--editable-border)]',
  borderSoft: 'border-[var(--editable-border-soft)]',
  darkBorder: 'border-white/10',
  shadow: 'shadow-[0_1px_2px_rgba(33,12,0,0.04),0_10px_30px_-16px_rgba(33,12,0,0.16)]',
  shadowStrong: 'shadow-[0_18px_60px_-24px_rgba(33,12,0,0.35)]',
  overlay: 'bg-[linear-gradient(180deg,rgba(33,12,0,0.02),rgba(33,12,0,0.68))]',
} as const

export const editableDesignContract = {
  shell: {
    page: `min-h-screen ${editablePalette.pageBg} ${editablePalette.pageText}`,
    section: 'mx-auto w-full max-w-[var(--editable-container)] px-5 sm:px-8 lg:px-10',
    sectionNarrow: 'mx-auto w-full max-w-[var(--editable-container-narrow)] px-5 sm:px-8',
    sectionY: 'py-[clamp(72px,9vw,140px)]',
    sectionYTight: 'py-[clamp(56px,7vw,96px)]',
  },
  layout: {
    safeGrid: 'grid gap-8 md:grid-cols-2 xl:grid-cols-3',
    featureGrid: 'grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center',
    rail: 'flex snap-x gap-6 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
    minRailCard: 'w-[280px] shrink-0 snap-start sm:w-[320px]',
  },
  type: {
    eyebrow:
      'text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-accent)]',
    displayTitle:
      'editable-display text-[clamp(2.75rem,7vw,5.5rem)] font-medium leading-[1.02] tracking-[-0.03em]',
    heroTitle:
      'editable-display text-[clamp(2.5rem,5.5vw,4rem)] font-medium leading-[1.06] tracking-[-0.03em]',
    sectionTitle:
      'editable-display text-[clamp(2rem,3.6vw,3rem)] font-medium leading-[1.1] tracking-[-0.03em]',
    lead: 'text-[1.125rem] leading-[1.55] text-[var(--slot4-muted-text)]',
    body: 'text-[1rem] leading-[1.65] text-[var(--slot4-muted-text)]',
    caption: 'text-[13px] font-medium text-[var(--slot4-soft-muted-text)]',
  },
  surface: {
    card: `rounded-[var(--editable-radius-md)] border ${editablePalette.borderSoft} ${editablePalette.surfaceBg} ${editablePalette.shadow}`,
    soft: `rounded-[var(--editable-radius-md)] border ${editablePalette.borderSoft} ${editablePalette.panelBg}`,
    warm: `rounded-[var(--editable-radius-md)] border ${editablePalette.borderSoft} ${editablePalette.warmBg}`,
    dark: `rounded-[var(--editable-radius-md)] ${editablePalette.darkBg} ${editablePalette.darkText} ${editablePalette.shadowStrong}`,
    feature: `rounded-[var(--editable-radius-lg)] border ${editablePalette.border} ${editablePalette.surfaceBg}`,
  },
  button: {
    primary:
      'inline-flex items-center justify-center gap-2 rounded-[var(--editable-radius-pill)] bg-[var(--editable-cta-bg)] px-6 py-3 text-sm font-medium tracking-[-0.01em] text-[var(--editable-cta-text)] transition duration-[var(--editable-duration-medium)] hover:-translate-y-[1px] hover:bg-[var(--slot4-accent)] active:translate-y-0',
    secondary:
      'inline-flex items-center justify-center gap-2 rounded-[var(--editable-radius-pill)] border border-[var(--editable-border)] bg-transparent px-6 py-3 text-sm font-medium tracking-[-0.01em] text-[var(--slot4-page-text)] transition duration-[var(--editable-duration-medium)] hover:-translate-y-[1px] hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)]',
    accent:
      'inline-flex items-center justify-center gap-2 rounded-[var(--editable-radius-pill)] bg-[var(--slot4-accent-fill)] px-6 py-3 text-sm font-medium tracking-[-0.01em] text-[var(--slot4-on-accent)] transition duration-[var(--editable-duration-medium)] hover:-translate-y-[1px] hover:bg-[var(--slot4-accent-strong)]',
    ghost:
      'inline-flex items-center gap-1.5 text-sm font-medium text-[var(--slot4-page-text)] transition duration-[var(--editable-duration-medium)] hover:text-[var(--slot4-accent)]',
  },
  media: {
    frame: `relative overflow-hidden rounded-[var(--editable-radius-md)] ${editablePalette.mediaBg}`,
    ratio: 'aspect-[4/5]',
  },
  motion: {
    lift: 'transition duration-[var(--editable-duration-medium)] hover:-translate-y-[3px] hover:shadow-[0_28px_60px_-30px_rgba(33,12,0,0.35)]',
    scale: 'transition duration-[var(--editable-duration-slow)] group-hover:scale-[1.03]',
    fade: 'transition duration-[var(--editable-duration-medium)] hover:opacity-90',
  },
  chip: 'inline-flex items-center gap-2 rounded-[var(--editable-radius-pill)] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-3.5 py-1.5 text-[12px] font-medium text-[var(--slot4-muted-text)] transition duration-[var(--editable-duration-medium)] hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)]',
} as const

export const aiLayoutRules = [
  'Change the site palette here; every section consumes these CSS variables.',
  'Use editableDesignContract for shell, type, surface, button, motion tokens — do not hardcode colors, radii, or duration.',
  'Preserve dynamic data-fetching calls; only JSX / classNames / copy change.',
  'Wrap section content in EditableReveal so entry motion stays consistent.',
] as const
