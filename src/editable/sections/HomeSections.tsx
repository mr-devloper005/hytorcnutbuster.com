'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowUpRight,
  BookmarkPlus,
  Check,
  ChevronDown,
  Globe2,
  Library,
  Quote,
  Search,
  Sparkles,
  Star,
  Users,
} from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { CATEGORY_OPTIONS } from '@/lib/categories'
import {
  getEditablePostImage,
  postHref,
  toPlainText,
  getEditableCategory,
  getEditableDomain,
  EditorialFeatureCard,
  CompactIndexCard,
  RailPostCard,
} from '@/editable/cards/PostCards'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import {
  editableDesignContract as dc,
  editablePalette as pal,
} from '@/editable/layouts/design-contract'
import { pagesContent } from '@/editable/content/pages.content'

/* --------------------------- shared helpers --------------------------- */

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

function getExcerpt(post?: SitePost | null, limit = 150) {
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  const raw =
    (typeof content.description === 'string' && content.description) ||
    (typeof content.summary === 'string' && content.summary) ||
    (typeof post?.summary === 'string' && post.summary) ||
    (typeof content.body === 'string' && content.body) ||
    ''
  const clean = toPlainText(raw)
  return clean.length > limit ? `${clean.slice(0, limit).trim()}...` : clean
}

function dedupePosts(posts: SitePost[]) {
  const seen = new Set<string>()
  const out: SitePost[] = []
  for (const post of posts) {
    const key = post.slug || post.id || post.title
    if (!key || seen.has(key)) continue
    seen.add(key)
    out.push(post)
  }
  return out
}

/* ------------------------------ HERO ------------------------------ */
export function EditableHomeHero({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)])
  const featured = pool.slice(0, 3)
  const totalCurated = pool.length || 24
  const collectionsCount = new Set(pool.map((post) => getEditableCategory(post))).size || 12
  const trustPoints = [
    { value: `${totalCurated}+`, label: 'Finds kept' },
    { value: String(collectionsCount), label: 'Live shelves' },
    { value: 'Since 2019', label: 'Quietly at it' },
    { value: 'Ad-lite', label: 'By design' },
  ]

  return (
    <section className="relative overflow-hidden bg-[var(--slot4-page-bg)]">
      {/* Editorial atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-40 -z-0 h-[560px] bg-[radial-gradient(52%_60%_at_50%_0%,color-mix(in_oklab,var(--slot4-accent)_22%,transparent),transparent_72%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-full opacity-[0.045]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, var(--slot4-page-text) 0 1px, transparent 1px 14px)',
        }}
      />

      <div
        className={`${dc.shell.section} relative z-10 pb-[clamp(56px,7vw,120px)] pt-[clamp(72px,10vw,160px)]`}
      >
        {/* Wordmark rail */}
        <EditableReveal>
          <div className="flex flex-wrap items-center justify-between gap-4 text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-soft-muted-text)]">
            <span className="inline-flex items-center gap-2">
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-[var(--slot4-accent)]" />
              Est. by curators, tended by hand
            </span>
            <span className="hidden items-center gap-2 md:inline-flex">
              A slow catalogue
              <span className="inline-flex h-px w-8 bg-[var(--editable-border)]" />
              Vol. {new Date().getFullYear()}
            </span>
          </div>
        </EditableReveal>

        {/* Display headline row */}
        <EditableReveal index={1} className="mt-10 grid gap-14 lg:mt-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <h1 className="editable-display max-w-[18ch] text-balance text-[clamp(3rem,8vw,6.5rem)] font-medium leading-[0.98] tracking-[-0.035em] text-[var(--slot4-page-text)]">
              A quieter home for
              <span className="mx-3 inline-flex h-[0.75em] w-[0.75em] translate-y-[0.05em] items-center justify-center rounded-full bg-[var(--slot4-accent)] align-middle text-[0.28em] text-[var(--slot4-cream)]">
                <ArrowUpRight className="h-[42%] w-[42%]" />
              </span>
              <br />
              the finds worth{' '}
              <em className="font-normal italic text-[var(--slot4-accent)]">keeping</em>.
            </h1>
          </div>

          <div className="lg:pb-4">
            <p className="max-w-md text-[1.125rem] leading-[1.6] text-[var(--slot4-muted-text)]">
              A slow catalogue of the internet&apos;s better corners — chosen with care,
              gathered into shelves, and always opened at the source.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href={primaryRoute} className={dc.button.primary}>
                Start exploring <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link href="/search" className={dc.button.secondary}>
                <Search className="h-4 w-4" /> Search finds
              </Link>
            </div>
          </div>
        </EditableReveal>

        {/* Product visual — layered shelf preview */}
        <EditableReveal index={2} className="mt-[clamp(56px,8vw,120px)]">
          <div className="relative grid gap-6 lg:grid-cols-12">
            {/* Primary preview card */}
            <div
              className={`relative overflow-hidden rounded-[var(--editable-radius-lg)] border ${pal.borderSoft} ${pal.surfaceBg} lg:col-span-8 ${pal.shadowStrong}`}
            >
              <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="relative aspect-[5/4] w-full overflow-hidden bg-[var(--slot4-media-bg)] lg:aspect-auto lg:min-h-[440px]">
                  {featured[0] ? (
                    <img
                      src={getEditablePostImage(featured[0])}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover"
                      loading="eager"
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_35%,rgba(33,12,0,0.55))]" />
                  <div className="absolute inset-x-6 top-6 flex items-center justify-between text-[var(--slot4-cream)]">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--slot4-cream)]/95 px-3 py-1 text-[11px] font-medium tracking-[-0.01em] text-[var(--slot4-page-text)]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[var(--slot4-accent)]" />
                      Live shelf
                    </span>
                    <span className="editable-display text-[13px] italic tracking-[-0.01em] text-[color-mix(in_oklab,var(--slot4-cream)_88%,transparent)]">
                      No. 01
                    </span>
                  </div>
                  <div className="absolute inset-x-6 bottom-6 text-[var(--slot4-cream)]">
                    <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[color-mix(in_oklab,var(--slot4-cream)_78%,transparent)]">
                      {featured[0] ? getEditableCategory(featured[0]) : 'On the shelf today'}
                    </p>
                    <h2 className="editable-display mt-3 line-clamp-2 max-w-md text-[26px] font-medium leading-[1.15] tracking-[-0.02em]">
                      {featured[0]?.title || 'The shelf refreshes daily with new finds.'}
                    </h2>
                  </div>
                </div>
                <div className="flex flex-col justify-between gap-8 p-8 lg:p-10">
                  <div>
                    <p className={dc.type.eyebrow}>Editor&apos;s keep</p>
                    <p className="mt-5 text-[15px] leading-[1.65] text-[var(--slot4-muted-text)]">
                      Every entry is a small commitment: the curator vouches for it, opens it at
                      the source, and leaves a short note for anyone who follows.
                    </p>
                  </div>
                  <div className="flex items-center justify-between border-t border-[var(--editable-border-soft)] pt-6">
                    <span className="flex items-center gap-1.5 text-[13px] font-medium text-[var(--slot4-soft-muted-text)]">
                      <Globe2 className="h-3.5 w-3.5 text-[var(--slot4-accent)]" />
                      {featured[0] ? getEditableDomain(featured[0]) || 'Curated resource' : 'A slow feed'}
                    </span>
                    <Link
                      href={featured[0] ? postHref(primaryTask, featured[0], primaryRoute) : primaryRoute}
                      className="inline-flex items-center gap-1.5 rounded-full bg-[var(--editable-cta-bg)] px-4 py-2 text-[12px] font-medium text-[var(--editable-cta-text)] transition duration-[var(--editable-duration-medium)] hover:-translate-y-[1px] hover:bg-[var(--slot4-accent)]"
                    >
                      Open
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Secondary preview stack */}
            <div className="grid gap-4 lg:col-span-4">
              {featured.slice(1, 3).map((post, idx) => (
                <MiniFeatureCard
                  key={post.id || post.slug || idx}
                  post={post}
                  href={postHref(primaryTask, post, primaryRoute)}
                />
              ))}
              {featured.length < 3
                ? Array.from({ length: 2 - Math.max(0, featured.length - 1) }).map((_, idx) => (
                    <PlaceholderMiniCard key={`ph-${idx}`} />
                  ))
                : null}

              {/* Ambient note card */}
              <div className={`rounded-[var(--editable-radius-lg)] border ${pal.borderSoft} bg-[var(--slot4-warm)] p-6`}>
                <p className={dc.type.eyebrow}>Ambient signal</p>
                <p className="editable-display mt-4 text-[18px] font-normal italic leading-[1.3] tracking-[-0.02em]">
                  &ldquo;Kept, not liked — the way a librarian keeps a shelf.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </EditableReveal>

        {/* Trust strip */}
        <EditableReveal index={3} className="mt-[clamp(56px,7vw,100px)]">
          <div className="flex flex-col gap-6 border-t border-[var(--editable-border)] pt-8 md:flex-row md:items-center md:justify-between">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-soft-muted-text)]">
              Quiet numbers, honest ones
            </p>
            <div className="grid grid-cols-2 gap-x-10 gap-y-4 md:flex md:items-center md:gap-10">
              {trustPoints.map((point) => (
                <div key={point.label} className="flex flex-col">
                  <span className="editable-display text-[22px] font-medium tracking-[-0.02em] text-[var(--slot4-page-text)]">
                    {point.value}
                  </span>
                  <span className="mt-1 text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--slot4-soft-muted-text)]">
                    {point.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </EditableReveal>
      </div>
    </section>
  )
}

function MiniFeatureCard({ post, href }: { post: SitePost; href: string }) {
  return (
    <Link href={href} className={`group flex gap-5 p-5 ${dc.surface.card} ${dc.motion.lift}`}>
      <div className={`${dc.media.frame} aspect-square h-24 w-24 shrink-0`}>
        <img src={getEditablePostImage(post)} alt="" className={`absolute inset-0 h-full w-full object-cover ${dc.motion.scale}`} loading="lazy" />
      </div>
      <div className="min-w-0 flex-1">
        <p className={dc.type.eyebrow}>{getEditableCategory(post)}</p>
        <h3 className="editable-display mt-2 line-clamp-2 text-[18px] font-medium leading-[1.2] tracking-[-0.02em]">
          {post.title}
        </h3>
        <p className="mt-2 line-clamp-1 text-[13px] text-[var(--slot4-muted-text)]">
          <Globe2 className="mr-1 inline-block h-3 w-3 text-[var(--slot4-accent)]" />
          {getEditableDomain(post) || 'Curated resource'}
        </p>
      </div>
    </Link>
  )
}

function PlaceholderMiniCard() {
  return (
    <div className={`flex gap-5 p-5 ${dc.surface.soft} opacity-60`}>
      <div className={`${dc.media.frame} aspect-square h-24 w-24 shrink-0 bg-[var(--slot4-panel-bg)]`} />
      <div className="min-w-0 flex-1">
        <p className={dc.type.eyebrow}>Fresh shelf</p>
        <p className="editable-display mt-2 text-[17px] leading-[1.2] tracking-[-0.02em] text-[var(--slot4-muted-text)]">
          New finds appear here each week.
        </p>
      </div>
    </div>
  )
}

/* --------------------------- MARQUEE ---------------------------- */
export function EditableCollectionsMarquee() {
  const collections = CATEGORY_OPTIONS.slice(0, 12)
  const doubled = [...collections, ...collections]
  return (
    <section className="border-y border-[var(--editable-border)] bg-[var(--slot4-warm)] py-10">
      <EditableReveal>
        <div className="mb-6 flex items-center justify-between gap-4 px-5 sm:px-8 lg:px-10">
          <p className={dc.type.eyebrow}>Shelves in rotation</p>
          <Link href="/sbm" className={dc.button.ghost}>
            Browse all <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </EditableReveal>
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-[linear-gradient(90deg,var(--slot4-warm),transparent)]" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-[linear-gradient(-90deg,var(--slot4-warm),transparent)]" />
        <div className="editable-marquee-track flex w-max gap-4">
          {doubled.map((item, index) => (
            <Link
              key={`${item.slug}-${index}`}
              href={`/sbm?category=${item.slug}`}
              className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-5 py-3 text-[15px] font-medium text-[var(--slot4-page-text)] transition duration-[var(--editable-duration-medium)] hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)]"
            >
              <BookmarkPlus className="h-3.5 w-3.5 text-[var(--slot4-accent)]" />
              {item.name}
              <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition duration-[var(--editable-duration-medium)] group-hover:opacity-100" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ----------------- ALTERNATING FEATURE BLOCKS ------------------- */
const featureLoopItems = [
  {
    eyebrow: 'For readers',
    title: 'A shelf you can trust because a human put it there.',
    description:
      'Every link on the Library was tried, read and kept by a curator you can name. No algorithmic churn, no dashboard chasing.',
    points: [
      'Hand-picked collections around a single idea, not a category',
      'Every resource opens with domain, curator and a short brief',
      'Save what fits, share what should be seen',
    ],
    label: 'What you get from the shelves',
  },
  {
    eyebrow: 'For curators',
    title: 'Somewhere your bookmarks actually get read.',
    description:
      'Publish a shelf, keep it living, and let it find the readers who need it. Curator pages stay clean; the resource is always the star.',
    points: [
      'Post a find in under a minute — one link, one brief',
      'Group finds into shelves anyone can subscribe to',
      'Your curator page follows every resource you keep',
    ],
    label: 'What the workspace unlocks',
    reverse: true,
  },
]

export function EditableFeatureLoop() {
  return (
    <section className={`${dc.shell.section} py-[clamp(80px,10vw,140px)]`}>
      <EditableReveal>
        <div className="max-w-2xl">
          <p className={dc.type.eyebrow}>Why the library exists</p>
          <h2 className="editable-display mt-5 text-[clamp(2rem,4vw,3.25rem)] font-medium leading-[1.08] tracking-[-0.03em]">
            The internet forgot bookmarks were personal. We didn&apos;t.
          </h2>
        </div>
      </EditableReveal>

      <div className="mt-16 grid gap-16">
        {featureLoopItems.map((item, index) => (
          <EditableReveal key={item.title} index={index}>
            <div
              className={`grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center ${
                item.reverse ? 'lg:[&>div:first-child]:order-2' : ''
              }`}
            >
              <div>
                <p className={dc.type.eyebrow}>{item.eyebrow}</p>
                <h3 className="editable-display mt-5 text-[clamp(1.75rem,3.2vw,2.75rem)] font-medium leading-[1.1] tracking-[-0.03em]">
                  {item.title}
                </h3>
                <p className="mt-6 max-w-xl text-[17px] leading-[1.6] text-[var(--slot4-muted-text)]">
                  {item.description}
                </p>
                <ul className="mt-8 grid gap-3">
                  {item.points.map((point) => (
                    <li key={point} className="flex items-start gap-3 text-[15px] leading-[1.55] text-[var(--slot4-page-text)]">
                      <span className="mt-[3px] inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--slot4-olive-soft)]">
                        <Check className="h-3 w-3 text-[var(--slot4-olive)]" />
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
              <div className={`${dc.surface.feature} overflow-hidden p-6 sm:p-8`}>
                <p className={dc.type.eyebrow}>{item.label}</p>
                <div className="mt-5 grid gap-4">
                  {item.points.map((point, i) => (
                    <div
                      key={point}
                      className="flex items-start gap-3 rounded-2xl bg-[var(--slot4-warm)] p-4"
                    >
                      <span className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${pal.accentBg} text-[13px] font-medium text-[var(--slot4-on-accent)]`}>
                        {i + 1}
                      </span>
                      <p className="text-[14px] leading-[1.5] text-[var(--slot4-muted-text)]">{point}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </EditableReveal>
        ))}
      </div>
    </section>
  )
}

/* --------------- CURATOR / VALUE PROP GRID ---------------- */
const gridCards = [
  {
    icon: Library,
    title: 'Shelves around ideas',
    body: 'Collections aren’t folders. Each shelf begins with a thesis and gathers the finds that support it.',
  },
  {
    icon: BookmarkPlus,
    title: 'One-tap keep',
    body: 'Save a find to your own shelf in a single tap. It stays with you across the library.',
  },
  {
    icon: Users,
    title: 'Curators you can follow',
    body: 'Every resource carries the curator who kept it. Follow the ones whose taste keeps landing.',
  },
  {
    icon: Sparkles,
    title: 'Slow, on purpose',
    body: 'No infinite feed. Fresh finds land in daily digests you can read in a sitting.',
  },
  {
    icon: Globe2,
    title: 'Everything opens at the source',
    body: 'The resource is the star, not us. Every find links straight to the domain that made it.',
  },
  {
    icon: Star,
    title: 'Kept, not liked',
    body: 'Signals aren’t social. A resource earns its place when a curator keeps it, not clicks it.',
  },
]

export function EditableCuratorGrid() {
  return (
    <section className={`${dc.shell.section} py-[clamp(80px,10vw,140px)]`}>
      <EditableReveal>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className={dc.type.eyebrow}>How the library works</p>
            <h2 className="editable-display mt-5 text-[clamp(2rem,4vw,3.25rem)] font-medium leading-[1.08] tracking-[-0.03em]">
              Six habits that keep the shelves worth returning to.
            </h2>
          </div>
          <Link href="/about" className={dc.button.secondary}>
            The full ethos <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </EditableReveal>

      <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {gridCards.map((card, index) => (
          <EditableReveal key={card.title} index={index}>
            <div className={`h-full p-8 ${dc.surface.card} ${dc.motion.lift}`}>
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]">
                <card.icon className="h-5 w-5" />
              </span>
              <h3 className="editable-display mt-6 text-[22px] font-medium leading-[1.15] tracking-[-0.02em]">
                {card.title}
              </h3>
              <p className="mt-4 text-[15px] leading-[1.6] text-[var(--slot4-muted-text)]">
                {card.body}
              </p>
            </div>
          </EditableReveal>
        ))}
      </div>
    </section>
  )
}

/* ---------------- FEATURED FINDS + STATS ----------------- */
export function EditableFeaturedFinds({
  primaryTask,
  primaryRoute,
  posts,
}: {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
}) {
  const feature = posts[0]
  const rail = posts.slice(1, 6)
  if (!feature) return null
  const collections = new Set(posts.map((post) => getEditableCategory(post))).size || 12
  const domains = new Set(posts.map((post) => getEditableDomain(post) || 'unknown')).size || 40

  return (
    <section className={`bg-[var(--slot4-warm)] py-[clamp(80px,10vw,140px)]`}>
      <div className={dc.shell.section}>
        <EditableReveal>
          <div className="grid gap-6 md:grid-cols-[1.05fr_0.95fr] md:items-end">
            <div>
              <p className={dc.type.eyebrow}>On the shelf</p>
              <h2 className="editable-display mt-5 text-[clamp(2rem,4vw,3.25rem)] font-medium leading-[1.08] tracking-[-0.03em]">
                A find worth stopping for, and the shelf it opens.
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <StatTile value={String(posts.length)} label="Live finds" />
              <StatTile value={String(collections)} label="Shelves" />
              <StatTile value={String(domains)} label="Domains" />
            </div>
          </div>
        </EditableReveal>

        <EditableReveal index={1} className="mt-14">
          <EditorialFeatureCard
            post={feature}
            href={postHref(primaryTask, feature, primaryRoute)}
            label="Editor’s keep"
          />
        </EditableReveal>

        {rail.length ? (
          <EditableReveal index={2} className="mt-12">
            <div className="flex items-center justify-between">
              <h3 className="editable-display text-[22px] font-medium tracking-[-0.02em]">Fresh keeps this week</h3>
              <Link href={primaryRoute} className={dc.button.ghost}>
                Every keep <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className={`${dc.layout.rail} mt-8`}>
              {rail.map((post, index) => (
                <RailPostCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />
              ))}
            </div>
          </EditableReveal>
        ) : null}
      </div>
    </section>
  )
}

function StatTile({ value, label }: { value: string; label: string }) {
  return (
    <div className={`${dc.surface.card} p-5 text-left`}>
      <p className="editable-display text-[28px] font-medium tracking-[-0.02em] text-[var(--slot4-page-text)]">{value}</p>
      <p className="mt-1 text-[12px] font-medium uppercase tracking-[0.2em] text-[var(--slot4-soft-muted-text)]">{label}</p>
    </div>
  )
}

/* ------------------ TIME COLLECTIONS ------------------ */
const sectionCopy: Record<string, { eyebrow: string; title: string; note: string }> = {
  spotlight: { eyebrow: 'Fresh this week', title: 'Kept in the last seven days', note: 'The most recent finds our curators would not let pass.' },
  browse: { eyebrow: 'On loop', title: 'Most-opened this month', note: 'The shelves people keep sending each other.' },
  index: { eyebrow: 'From the stacks', title: 'Evergreens worth revisiting', note: 'Older finds that still earn a place on the shelf.' },
}

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const sections =
    timeSections.length > 0
      ? timeSections
      : ([
          { key: 'spotlight', posts: posts.slice(0, 8), href: primaryRoute },
          { key: 'browse', posts: posts.slice(8, 16), href: primaryRoute },
          { key: 'index', posts: posts.slice(16, 24), href: primaryRoute },
        ] as Pick<HomeTimeSection, 'key' | 'posts' | 'href'>[])

  const visible = sections.filter((section) => section.posts.length)
  if (!visible.length) return null

  return (
    <>
      {visible.map((section, index) => {
        const copy = sectionCopy[section.key] || { eyebrow: 'On the shelf', title: 'More to keep', note: '' }
        return (
          <section
            key={section.key}
            className={`${index % 2 === 0 ? 'bg-[var(--slot4-page-bg)]' : 'bg-[var(--slot4-warm)]'} py-[clamp(72px,9vw,120px)]`}
          >
            <div className={dc.shell.section}>
              <EditableReveal>
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                  <div className="max-w-xl">
                    <p className={dc.type.eyebrow}>{copy.eyebrow}</p>
                    <h2 className="editable-display mt-5 text-[clamp(1.75rem,3.2vw,2.75rem)] font-medium leading-[1.1] tracking-[-0.03em]">
                      {copy.title}
                    </h2>
                    {copy.note ? <p className="mt-4 text-[16px] leading-[1.6] text-[var(--slot4-muted-text)]">{copy.note}</p> : null}
                  </div>
                  <Link href={section.href || primaryRoute} className={dc.button.secondary}>
                    Open shelf <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </EditableReveal>

              <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {section.posts.slice(0, 8).map((post, cardIndex) => (
                  <EditableReveal key={post.id || post.slug} index={cardIndex}>
                    <CompactIndexCard post={post} href={postHref(primaryTask, post, primaryRoute)} index={cardIndex} />
                  </EditableReveal>
                ))}
              </div>
            </div>
          </section>
        )
      })}
    </>
  )
}

/* ---------------- SOCIAL PROOF ---------------- */
const testimonials = [
  {
    quote:
      'The Library is the only bookmark site where I trust the shelf before I trust the algorithm. Every keep feels considered.',
    author: 'Ada Okonkwo',
    role: 'Editor, Sidebars',
  },
  {
    quote:
      'I used to lose finds in a notes app. Now my shelf lives here — and the readers who need it actually see it.',
    author: 'Miro Delacroix',
    role: 'Curator · Field Studies',
  },
  {
    quote:
      'It reads like a good newsletter, but it’s a library. That’s the trick.',
    author: 'Priya Anand',
    role: 'Research lead',
  },
]

export function EditableSocialProofBand() {
  return (
    <section className={`bg-[var(--slot4-dark-bg)] py-[clamp(80px,10vw,140px)] text-[var(--slot4-dark-text)]`}>
      <div className={dc.shell.section}>
        <EditableReveal>
          <div className="max-w-2xl">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[color-mix(in_oklab,var(--slot4-dark-text)_65%,transparent)]">
              What curators say
            </p>
            <h2 className="editable-display mt-5 text-[clamp(2rem,4vw,3rem)] font-medium leading-[1.1] tracking-[-0.03em]">
              A quiet room the internet keeps sending people to.
            </h2>
          </div>
        </EditableReveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {testimonials.map((item, index) => (
            <EditableReveal key={item.author} index={index}>
              <figure className="flex h-full flex-col rounded-[var(--editable-radius-lg)] border border-white/10 bg-white/[0.03] p-8">
                <Quote className="h-6 w-6 text-[color-mix(in_oklab,var(--slot4-accent)_78%,white)]" />
                <blockquote className="editable-display mt-6 flex-1 text-[19px] font-normal leading-[1.4] tracking-[-0.02em]">
                  &ldquo;{item.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-8 border-t border-white/10 pt-5 text-[13px]">
                  <p className="font-medium">{item.author}</p>
                  <p className="text-[color-mix(in_oklab,var(--slot4-dark-text)_60%,transparent)]">{item.role}</p>
                </figcaption>
              </figure>
            </EditableReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------------- FAQ ACCORDION ---------------- */
const faqItems = [
  {
    q: 'What actually goes on a shelf?',
    a: 'Any resource a curator would send a friend — an essay, tool, dataset, calculator, video, thread, or field guide. If it belongs on a shelf worth revisiting, it belongs here.',
  },
  {
    q: 'How is this different from a bookmark app?',
    a: 'Bookmark apps store what you saved. The Library keeps what curators think you should read. It’s the difference between a drawer and a bookshelf.',
  },
  {
    q: 'Can I add my own shelf?',
    a: 'Yes — become a curator and start a shelf around any idea. Every find you keep sits on the shelf and the shelf lives in the public library.',
  },
  {
    q: 'Do you show ads?',
    a: 'A single sponsored placement on the pages that need to stay funded. Ads never appear on shelves that would compromise them.',
  },
  {
    q: 'Who decides what stays on the shelf?',
    a: 'Curators do. Every find carries the person who kept it — reputation moves with the resource, not the algorithm.',
  },
]

export function EditableFaqAccordion() {
  return (
    <section className={`${dc.shell.section} py-[clamp(80px,10vw,140px)]`}>
      <div className="grid gap-16 lg:grid-cols-[0.85fr_1.15fr]">
        <EditableReveal>
          <div>
            <p className={dc.type.eyebrow}>Common questions</p>
            <h2 className="editable-display mt-5 text-[clamp(2rem,4vw,3rem)] font-medium leading-[1.1] tracking-[-0.03em]">
              Everything a first-time curator asks.
            </h2>
            <p className="mt-6 text-[16px] leading-[1.65] text-[var(--slot4-muted-text)]">
              Still uncertain? Write us — every message reaches a real curator, not a queue.
            </p>
            <Link href="/contact" className={`${dc.button.secondary} mt-8`}>
              Ask a curator <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </EditableReveal>
        <div className="grid gap-3">
          {faqItems.map((item, index) => (
            <EditableReveal key={item.q} index={index}>
              <FaqRow question={item.q} answer={item.a} defaultOpen={index === 0} />
            </EditableReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function FaqRow({ question, answer, defaultOpen = false }: { question: string; answer: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className={`${dc.surface.card} overflow-hidden`}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-6 p-6 text-left transition duration-[var(--editable-duration-medium)] hover:bg-[var(--slot4-warm)]"
      >
        <span className="editable-display text-[18px] font-medium leading-[1.3] tracking-[-0.02em] text-[var(--slot4-page-text)]">
          {question}
        </span>
        <span className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--editable-border)] text-[var(--slot4-page-text)] transition duration-[var(--editable-duration-medium)] ${open ? 'rotate-180 bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]' : ''}`}>
          <ChevronDown className="h-4 w-4" />
        </span>
      </button>
      <div
        className={`grid overflow-hidden transition-[grid-template-rows] duration-[var(--editable-duration-medium)] ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
      >
        <div className="min-h-0">
          <p className="px-6 pb-6 text-[15px] leading-[1.7] text-[var(--slot4-muted-text)]">
            {answer}
          </p>
        </div>
      </div>
    </div>
  )
}

/* ---------------- FINAL CTA ---------------- */
export function EditableHomeCta() {
  return (
    <section className={`${dc.shell.section} py-[clamp(80px,10vw,140px)]`}>
      <EditableReveal>
        <div
          className="overflow-hidden rounded-[var(--editable-radius-lg)] border p-10 sm:p-16 lg:p-20"
          style={{ background: 'var(--slot4-accent)', borderColor: 'transparent' }}
        >
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="text-[var(--slot4-on-accent)]">
              <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[color-mix(in_oklab,var(--slot4-on-accent)_78%,transparent)]">
                {pagesContent.home.cta.badge}
              </p>
              <h2 className="editable-display mt-5 text-[clamp(2rem,4.5vw,3.75rem)] font-medium leading-[1.06] tracking-[-0.03em]">
                {pagesContent.home.cta.title}
              </h2>
              <p className="mt-6 max-w-lg text-[16px] leading-[1.65] text-[color-mix(in_oklab,var(--slot4-on-accent)_86%,transparent)]">
                {pagesContent.home.cta.description}
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <Link
                  href={pagesContent.home.cta.primaryCta.href}
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-cream)] px-6 py-3 text-sm font-medium text-[var(--slot4-page-text)] transition duration-[var(--editable-duration-medium)] hover:-translate-y-[1px]"
                >
                  {pagesContent.home.cta.primaryCta.label} <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link
                  href={pagesContent.home.cta.secondaryCta.href}
                  className="inline-flex items-center gap-2 rounded-full border border-[color-mix(in_oklab,var(--slot4-on-accent)_40%,transparent)] px-6 py-3 text-sm font-medium text-[var(--slot4-on-accent)] transition duration-[var(--editable-duration-medium)] hover:-translate-y-[1px] hover:bg-white/10"
                >
                  {pagesContent.home.cta.secondaryCta.label}
                </Link>
              </div>
            </div>
            <div className="grid gap-4 text-[var(--slot4-on-accent)]">
              {[
                { title: 'Start your shelf', body: 'A minute to name it. A lifetime to keep it worth returning to.' },
                { title: 'Follow a curator', body: 'Their new keeps land in your feed the moment they hit the shelf.' },
                { title: 'Read the digest', body: 'A weekly note from the library — the shelves worth opening.' },
              ].map((row) => (
                <div key={row.title} className="rounded-[var(--editable-radius-md)] border border-white/20 bg-white/5 p-5 backdrop-blur-sm">
                  <p className="editable-display text-[18px] font-medium tracking-[-0.02em]">{row.title}</p>
                  <p className="mt-2 text-[14px] leading-[1.55] text-[color-mix(in_oklab,var(--slot4-on-accent)_86%,transparent)]">
                    {row.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </EditableReveal>
    </section>
  )
}

/* ---------------- legacy re-exports (kept for internal imports) ---------------- */
export const EditableStoryRail = EditableCollectionsMarquee
export const EditableMagazineSplit = EditableCuratorGrid

// Silence unused import warnings when future variants reintroduce them.
export const __unusedExcerpt = getExcerpt
