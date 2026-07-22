import Link from 'next/link'
import { ArrowUpRight, BookmarkPlus, Globe2 } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { TaskKey } from '@/lib/site-config'
import {
  editableDesignContract as dc,
  editablePalette as pal,
} from '@/editable/layouts/design-contract'

export function getEditablePostImage(post?: SitePost | null) {
  const media = Array.isArray(post?.media) ? post?.media : []
  const mediaUrl = media.find((item) => typeof item?.url === 'string' && item.url)?.url
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  const images = Array.isArray(content.images) ? content.images : []
  const contentImage = images.find((url): url is string => typeof url === 'string' && Boolean(url))
  const logo = typeof content.logo === 'string' ? content.logo : ''
  return mediaUrl || contentImage || logo || '/placeholder.svg?height=900&width=1400'
}

export function toPlainText(value: unknown): string {
  if (typeof value !== 'string') return ''
  return value
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#0?39;|&apos;/gi, "'")
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function getEditableExcerpt(post?: SitePost | null, limit = 150) {
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  const raw =
    (typeof content.description === 'string' && content.description) ||
    (typeof content.summary === 'string' && content.summary) ||
    (typeof post?.summary === 'string' && post.summary) ||
    (typeof content.body === 'string' && content.body) ||
    (typeof content.excerpt === 'string' && content.excerpt) ||
    ''
  const clean = toPlainText(raw)
  return clean.length > limit ? `${clean.slice(0, limit).trim()}...` : clean
}

export function getEditableCategory(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || 'Collection'
}

export function getEditableDomain(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  const raw =
    (typeof content.website === 'string' && content.website) ||
    (typeof content.url === 'string' && content.url) ||
    (typeof content.link === 'string' && content.link) ||
    ''
  if (!raw) return ''
  try {
    const parsed = new URL(raw.startsWith('http') ? raw : `https://${raw}`)
    return parsed.hostname.replace(/^www\./, '')
  } catch {
    return raw.replace(/^https?:\/\//, '').replace(/\/.*$/, '')
  }
}

export function postHref(task: TaskKey, post: SitePost, route = `/${task}`) {
  return `${route}/${post.slug}`
}

/* ---------------- Feature card (large hero on home) ---------------- */
export function EditorialFeatureCard({
  post,
  href,
  label = 'Featured shelf',
}: {
  post: SitePost
  href: string
  label?: string
}) {
  const image = getEditablePostImage(post)
  const category = getEditableCategory(post)
  const domain = getEditableDomain(post)
  return (
    <Link
      href={href}
      className={`group relative block overflow-hidden ${dc.surface.feature} ${dc.motion.lift}`}
    >
      <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
        <div className={`${dc.media.frame} rounded-none aspect-[5/4] lg:aspect-auto lg:min-h-[460px]`}>
          <img
            src={image}
            alt=""
            loading="lazy"
            className={`absolute inset-0 h-full w-full object-cover ${dc.motion.scale}`}
          />
          <span className="absolute left-5 top-5 inline-flex items-center gap-1.5 rounded-full bg-[var(--slot4-cream)]/95 px-3 py-1 text-[11px] font-medium tracking-[-0.01em] text-[var(--slot4-page-text)] shadow-[0_2px_10px_rgba(33,12,0,0.08)]">
            <BookmarkPlus className="h-3 w-3 text-[var(--slot4-accent)]" /> {category}
          </span>
        </div>
        <div className="flex flex-col justify-between gap-8 p-8 lg:p-12">
          <div>
            <p className={dc.type.eyebrow}>{label}</p>
            <h3 className="editable-display mt-5 max-w-xl text-[clamp(1.75rem,3vw,2.5rem)] font-medium leading-[1.1] tracking-[-0.03em] text-[var(--slot4-page-text)]">
              {post.title}
            </h3>
            <p className="mt-5 max-w-lg text-[15px] leading-[1.65] text-[var(--slot4-muted-text)]">
              {getEditableExcerpt(post, 190)}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--slot4-soft-muted-text)]">
              <Globe2 className="h-3.5 w-3.5 text-[var(--slot4-accent)]" /> {domain || 'Curated resource'}
            </span>
            <span className={dc.button.primary}>
              Open resource <ArrowUpRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

/* ---------------- Rail card (dense horizontal scroll) ---------------- */
export function RailPostCard({
  post,
  href,
  index,
}: {
  post: SitePost
  href: string
  index: number
}) {
  const image = getEditablePostImage(post)
  const category = getEditableCategory(post)
  const domain = getEditableDomain(post)
  return (
    <Link href={href} className={`group ${dc.layout.minRailCard} block overflow-hidden ${dc.surface.card} ${dc.motion.lift}`}>
      <div className={`${dc.media.frame} aspect-[4/3]`}>
        <img src={image} alt="" loading="lazy" className={`absolute inset-0 h-full w-full object-cover ${dc.motion.scale}`} />
        <span className="absolute left-4 top-4 rounded-full bg-[var(--slot4-cream)]/95 px-3 py-1 text-[11px] font-medium text-[var(--slot4-page-text)]">
          {String(index + 1).padStart(2, '0')} · {category}
        </span>
      </div>
      <div className="flex flex-col gap-4 p-6">
        <h3 className="editable-display line-clamp-3 text-[22px] font-medium leading-[1.15] tracking-[-0.02em] text-[var(--slot4-page-text)]">
          {post.title}
        </h3>
        <p className="line-clamp-2 text-[14px] leading-[1.55] text-[var(--slot4-muted-text)]">
          {getEditableExcerpt(post, 130)}
        </p>
        {domain ? (
          <p className="flex items-center gap-1.5 text-[12px] font-medium text-[var(--slot4-soft-muted-text)]">
            <Globe2 className="h-3 w-3 text-[var(--slot4-accent)]" /> {domain}
          </p>
        ) : null}
      </div>
    </Link>
  )
}

/* ---------------- Compact index card (grid of finds) ---------------- */
export function CompactIndexCard({
  post,
  href,
  index,
}: {
  post: SitePost
  href: string
  index: number
}) {
  const category = getEditableCategory(post)
  const domain = getEditableDomain(post)
  return (
    <Link href={href} className={`group block h-full min-w-0 ${dc.surface.card} p-6 ${dc.motion.lift}`}>
      <div className="flex items-center justify-between text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--slot4-accent)]">
        <span>{category}</span>
        <span className="text-[var(--slot4-soft-muted-text)]">No. {String(index + 1).padStart(2, '0')}</span>
      </div>
      <h3 className="editable-display mt-5 line-clamp-3 text-[20px] font-medium leading-[1.15] tracking-[-0.02em] text-[var(--slot4-page-text)]">
        {post.title}
      </h3>
      <p className="mt-3 line-clamp-2 text-[14px] leading-[1.55] text-[var(--slot4-muted-text)]">
        {getEditableExcerpt(post, 120)}
      </p>
      <div className="mt-6 flex items-center justify-between border-t border-[var(--editable-border-soft)] pt-4 text-[12px] font-medium">
        <span className="flex items-center gap-1.5 text-[var(--slot4-soft-muted-text)]">
          <Globe2 className="h-3 w-3 text-[var(--slot4-accent)]" /> {domain || 'Saved find'}
        </span>
        <span className="flex items-center gap-1 text-[var(--slot4-accent)]">
          Open <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  )
}

/* ---------------- List row card (rich layout for shelf pages) ---------------- */
export function ArticleListCard({
  post,
  href,
  index,
}: {
  post: SitePost
  href: string
  index: number
}) {
  const image = getEditablePostImage(post)
  const category = getEditableCategory(post)
  const domain = getEditableDomain(post)
  return (
    <Link
      href={href}
      className={`group grid min-w-0 gap-6 overflow-hidden ${dc.surface.card} p-5 ${dc.motion.lift} sm:grid-cols-[260px_minmax(0,1fr)]`}
    >
      <div className={`${dc.media.frame} aspect-[4/3] sm:aspect-auto sm:min-h-[200px]`}>
        <img src={image} alt="" loading="lazy" className={`absolute inset-0 h-full w-full object-cover ${dc.motion.scale}`} />
      </div>
      <div className="min-w-0 py-2 pr-2 sm:py-5 sm:pr-6">
        <p className={dc.type.eyebrow}>{category} · No. {String(index + 1).padStart(2, '0')}</p>
        <h2 className="editable-display mt-4 line-clamp-3 text-[26px] font-medium leading-[1.12] tracking-[-0.03em] text-[var(--slot4-page-text)] sm:text-[30px]">
          {post.title}
        </h2>
        <p className="mt-4 line-clamp-3 text-[15px] leading-[1.65] text-[var(--slot4-muted-text)]">
          {getEditableExcerpt(post, 200)}
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          {domain ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--editable-border-soft)] px-3 py-1 text-[12px] font-medium text-[var(--slot4-muted-text)]">
              <Globe2 className="h-3 w-3 text-[var(--slot4-accent)]" /> {domain}
            </span>
          ) : <span />}
          <span className={`inline-flex items-center gap-1.5 text-[13px] font-medium ${pal.accentText}`}>
            Open resource <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  )
}
