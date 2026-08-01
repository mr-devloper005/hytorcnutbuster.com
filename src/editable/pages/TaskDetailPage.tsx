import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookmarkPlus,
  CheckCircle2,
  Compass,
  ExternalLink,
  FileText,
  Globe2,
  Layers,
  Link2,
  Mail,
  Quote,
  ShieldCheck,
  Sparkles,
  Star,
  UserRound,
} from 'lucide-react'
import { buildPostMetadata, buildTaskMetadata } from '@/lib/seo'
import { fetchArticleComments, fetchTaskPostBySlug, fetchTaskPosts } from '@/lib/task-data'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableArticleComments } from '@/editable/components/EditableArticleComments'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { taskThemeStyle } from '@/editable/theme/task-themes'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { getTaskDisplayLabel, isUiHiddenTask } from '@/editable/content/global.content'
import { Ads, getSlotSizes } from '@/lib/ads'

const pickRandom = (sizes: string[]) => sizes[Math.floor(Math.random() * sizes.length)]

export const revalidate = 3

export async function generateEditableDetailMetadata(
  task: TaskKey,
  params: Promise<{ slug?: string; username?: string }>
) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  return post ? await buildPostMetadata(task, post) : await buildTaskMetadata(task)
}

export async function EditableTaskDetailRoute({
  task,
  params,
}: {
  task: TaskKey
  params: Promise<{ slug?: string; username?: string }>
}) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  if (!post) notFound()
  // Grab a wider slice so prev/next inside the same shelf reads meaningfully.
  const shelf = await fetchTaskPosts(task, 24)
  const related = shelf.filter((item) => item.slug !== post.slug).slice(0, 4)
  const comments = task === 'article' ? await fetchArticleComments(post.slug, 50) : []
  return (
    <TaskDetailView
      task={task}
      post={post}
      related={related}
      comments={comments}
      shelf={shelf}
    />
  )
}

const getContent = (post: SitePost) =>
  post.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
const asText = (value: unknown) => (typeof value === 'string' ? value.trim() : '')
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media)
    ? post.media
        .map((item) => item?.url)
        .filter((url): url is string => typeof url === 'string' && isUrl(url))
    : []
  const images = Array.isArray(content.images)
    ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url))
    : []
  const singleImages = ['image', 'featuredImage', 'thumbnail', 'logo', 'avatar']
    .map((key) => asText(content[key]))
    .filter((url) => url && isUrl(url))
  return [...media, ...images, ...singleImages].filter(Boolean).slice(0, 12)
}

const getBody = (post: SitePost) => {
  const content = getContent(post)
  return (
    asText(content.body) ||
    asText(content.description) ||
    asText(content.details) ||
    post.summary ||
    'Details will appear here once available.'
  )
}

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const safeUrl = (value: string) => (/^https?:\/\//i.test(value) ? value : '#')

const linkifyMarkdown = (value: string) =>
  value.replace(
    /\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/gi,
    (_match, label, url) =>
      `<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${label}</a>`
  )

const linkifyText = (value: string) =>
  linkifyMarkdown(value).replace(
    /(^|[\s(>])((https?:\/\/)[^\s<)]+)/gi,
    (_match, prefix, url) =>
      `${prefix}<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${url}</a>`
  )

const hardenLinks = (html: string) =>
  html.replace(/<a\s+([^>]*href=["'][^"']+["'][^>]*)>/gi, (_match, attrs) => {
    let next = String(attrs).replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    if (!/\starget=/i.test(next)) next += ' target="_blank"'
    if (!/\srel=/i.test(next)) next += ' rel="nofollow noopener noreferrer"'
    return `<a ${next}>`
  })

const sanitizeHtml = (html: string) =>
  hardenLinks(
    html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<(iframe|object|embed)[^>]*>[\s\S]*?<\/\1>/gi, '')
      .replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
      .replace(/(href|src)=(['"])javascript:[\s\S]*?\2/gi, '$1="#"')
  )

const formatPlainText = (raw: string) => {
  const value = raw.trim()
  if (!value) return ''
  if (/<[a-z][\s\S]*>/i.test(value)) return sanitizeHtml(linkifyMarkdown(value))
  return value
    .split(/\n{2,}/)
    .map(
      (part) => `<p>${linkifyText(escapeHtml(part).replace(/\n/g, '<br />'))}</p>`
    )
    .join('')
}

const summaryText = (post: SitePost) =>
  post.summary ||
  asText(getContent(post).description) ||
  asText(getContent(post).excerpt) ||
  ''

const stripHtml = (value: string) =>
  value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()

const leadText = (post: SitePost) => {
  const summary = summaryText(post)
  if (!summary) return ''
  const lead = stripHtml(summary)
  return lead && lead !== stripHtml(getBody(post)) ? lead : ''
}

const categoryOf = (post: SitePost, fallback: string) =>
  asText(getContent(post).category) || post.tags?.[0] || fallback

const cleanDomain = (value: string) => {
  if (!value) return ''
  try {
    const parsed = new URL(value.startsWith('http') ? value : `https://${value}`)
    return parsed.hostname.replace(/^www\./, '')
  } catch {
    return value.replace(/^https?:\/\//, '').replace(/\/.*$/, '')
  }
}

const urlPath = (value: string) => {
  if (!value) return ''
  try {
    const parsed = new URL(value.startsWith('http') ? value : `https://${value}`)
    const path = `${parsed.pathname}${parsed.search}`.replace(/\/$/, '')
    return path && path !== '/' ? path : ''
  } catch {
    return ''
  }
}

const getTags = (post: SitePost) => {
  const tags = Array.isArray(post.tags) ? post.tags.filter((tag) => typeof tag === 'string' && tag) : []
  return tags.slice(0, 6)
}

export function TaskDetailView({
  task,
  post,
  related,
  comments = [],
  shelf = [],
}: {
  task: TaskKey
  post: SitePost
  related: SitePost[]
  comments?: Array<{ id: string; name: string; comment: string; createdAt: string }>
  shelf?: SitePost[]
}) {
  return (
    <EditableSiteShell>
      <main
        style={taskThemeStyle(task)}
        className="min-h-screen bg-[var(--tk-bg)] text-[var(--tk-text)]"
      >
        {task === 'sbm' ? <BookmarkDetail post={post} related={related} shelf={shelf} /> : null}
        {task === 'profile' ? <ProfileDetail post={post} related={related} /> : null}
        {task === 'article' ? (
          <ArticleDetail post={post} related={related} comments={comments} />
        ) : null}
        {task === 'listing' || task === 'classified' || task === 'image' || task === 'pdf' ? (
          <GenericResourceDetail task={task} post={post} related={related} />
        ) : null}
      </main>
    </EditableSiteShell>
  )
}

/* ---------- Bookmark / resource detail ---------- */
function BookmarkDetail({
  post,
  related,
  shelf = [],
}: {
  post: SitePost
  related: SitePost[]
  shelf?: SitePost[]
}) {
  const website = getField(post, ['website', 'url', 'link'])
  const domain = cleanDomain(website)
  const category = categoryOf(post, 'Collection')
  const curator = getField(post, ['author', 'curator', 'submittedBy']) || SITE_CONFIG.name
  const verified = Boolean(website)
  const tags = getTags(post)
  const curatorInitial = (curator.trim()[0] || 'C').toUpperCase()
  const pathBits = urlPath(website)
  const shelfCount = shelf.length
  const index = shelf.findIndex((item) => item.slug === post.slug)
  const prev = index > 0 ? shelf[index - 1] : shelf[shelfCount - 1] || null
  const next = index >= 0 && index < shelfCount - 1 ? shelf[index + 1] : shelf[0] || null

  return (
    <>
      {/* Editorial hero band */}
      <section className="relative overflow-hidden border-b border-[var(--tk-line)] bg-[var(--tk-surface)]">
        <div className="pointer-events-none absolute inset-x-0 -top-32 h-80 bg-[radial-gradient(60%_60%_at_50%_0%,var(--tk-glow),transparent_70%)]" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, var(--tk-text) 0 1px, transparent 1px 14px)',
          }}
        />
        <div className={`${dc.shell.section} relative py-[clamp(72px,10vw,140px)]`}>
          <EditableReveal>
            {/* Breadcrumb + shelf chip */}
            <div className="flex flex-wrap items-center gap-3 text-[12px] font-medium text-[var(--tk-muted)]">
              <Link
                href="/sbm"
                className="editable-link-underline inline-flex items-center gap-1 text-[var(--tk-accent)]"
              >
                <Layers className="h-3 w-3" /> The Library
              </Link>
              <span className="text-[var(--tk-muted)]/50">/</span>
              <Link
                href={`/sbm?category=${category.toLowerCase()}`}
                className="editable-link-underline"
              >
                {category}
              </Link>
              <span className="text-[var(--tk-muted)]/50">/</span>
              <span className="truncate">{post.title}</span>
            </div>

            <h1 className="editable-display mt-8 max-w-4xl text-balance text-[clamp(2.5rem,6vw,4.5rem)] font-medium leading-[1.02] tracking-[-0.03em]">
              {post.title}
            </h1>

            {leadText(post) ? (
              <p className="mt-8 max-w-2xl text-[1.25rem] leading-[1.55] text-[var(--tk-muted)]">
                {leadText(post)}
              </p>
            ) : null}

            {/* Curator + share strip */}
            <div className="mt-12 flex flex-wrap items-center gap-6 border-t border-[var(--tk-line)] pt-8">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--tk-accent-soft)] text-[15px] font-semibold text-[var(--tk-accent)]">
                  {curatorInitial}
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--tk-muted)]">
                    Kept by
                  </p>
                  <p className="mt-1 text-[14px] font-medium text-[var(--tk-text)]">{curator}</p>
                </div>
              </div>
              <span className="hidden h-8 w-px bg-[var(--tk-line)] sm:inline" />
              <div className="flex flex-wrap items-center gap-2">
                {website ? (
                  <a
                    href={website}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="inline-flex items-center gap-2 rounded-full bg-[var(--tk-accent)] px-5 py-2.5 text-[13px] font-medium text-[var(--tk-on-accent)] shadow-[0_10px_28px_-14px_rgba(33,12,0,0.55)] transition duration-[var(--editable-duration-medium)] hover:-translate-y-[1px]"
                  >
                    Visit resource <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                ) : null}
                <Link
                  href="/sbm"
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--tk-line)] px-4 py-2.5 text-[13px] font-medium text-[var(--tk-text)] transition duration-[var(--editable-duration-medium)] hover:-translate-y-[1px] hover:border-[var(--tk-accent)]"
                >
                  <BookmarkPlus className="h-3.5 w-3.5" /> Keep to my shelf
                </Link>
              </div>
            </div>
          </EditableReveal>
        </div>
      </section>

      {/* Quick facts strip */}
      <section className="border-b border-[var(--tk-line)] bg-[var(--tk-bg)]">
        <div className={`${dc.shell.section} grid gap-6 py-7 sm:grid-cols-3`}>
          <QuickFact label="Shelf" value={category} icon={Layers} />
          <QuickFact
            label={verified ? 'Verified curator' : 'Curator'}
            value={curator}
            icon={verified ? ShieldCheck : UserRound}
          />
          <QuickFact
            label="On the shelf"
            value={index >= 0 && shelfCount > 0 ? `No. ${index + 1} of ${shelfCount}` : 'Fresh keep'}
            icon={Sparkles}
          />
        </div>
      </section>

      {/* Domain preview card */}
      {website ? (
        <section className={`${dc.shell.section} pt-[clamp(56px,7vw,96px)]`}>
          <EditableReveal>
            <a
              href={website}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="group flex flex-col gap-4 rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-6 shadow-[0_18px_44px_-30px_rgba(33,12,0,0.35)] transition duration-[var(--editable-duration-medium)] hover:-translate-y-[2px] hover:border-[var(--tk-accent)] sm:flex-row sm:items-center sm:gap-6 sm:p-7"
            >
              <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-[16px] border border-[var(--tk-line)] bg-[var(--tk-bg)]">
                {domain ? (
                  <img
                    src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
                    alt=""
                    className="h-8 w-8 object-contain"
                    loading="lazy"
                  />
                ) : (
                  <Globe2 className="h-5 w-5 text-[var(--tk-accent)]" />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--tk-muted)]">
                  Resource · opens in new tab
                </p>
                <p className="editable-display mt-1.5 truncate text-[22px] font-medium tracking-[-0.02em]">
                  {domain || 'External resource'}
                </p>
                {pathBits ? (
                  <p className="mt-1.5 truncate font-mono text-[12px] text-[var(--tk-muted)]">
                    {pathBits}
                  </p>
                ) : null}
              </div>
              <span className="inline-flex items-center gap-2 self-start rounded-full bg-[var(--tk-accent)] px-5 py-2.5 text-[13px] font-medium text-[var(--tk-on-accent)] transition duration-[var(--editable-duration-medium)] group-hover:-translate-y-[1px] sm:self-center">
                Visit resource <ExternalLink className="h-3.5 w-3.5" />
              </span>
            </a>
          </EditableReveal>
        </section>
      ) : null}

      {/* Body + sidebar */}
      <section className={`${dc.shell.section} py-[clamp(56px,8vw,120px)]`}>
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_360px]">
          <article className="min-w-0">
            <EditableReveal>
              {leadText(post) ? (
                <figure className="mb-10 rounded-[var(--tk-radius)] border-l-2 border-[var(--tk-accent)] bg-[var(--tk-surface)]/60 p-6 sm:p-8">
                  <Quote className="h-5 w-5 text-[var(--tk-accent)]" />
                  <blockquote className="editable-display mt-4 text-[22px] font-normal italic leading-[1.35] tracking-[-0.02em] text-[var(--tk-text)] sm:text-[26px]">
                    &ldquo;{leadText(post)}&rdquo;
                  </blockquote>
                  <figcaption className="mt-5 text-[12px] font-medium uppercase tracking-[0.2em] text-[var(--tk-muted)]">
                    — a note from the curator
                  </figcaption>
                </figure>
              ) : null}
              <BodyContent post={post} />

              {tags.length ? (
                <div className="mt-14 border-t border-[var(--tk-line)] pt-8">
                  <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--tk-muted)]">
                    Also filed under
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/search?q=${encodeURIComponent(tag)}`}
                        className="rounded-full border border-[var(--tk-line)] bg-[var(--tk-surface)] px-3.5 py-1.5 text-[12px] font-medium text-[var(--tk-muted)] transition duration-[var(--editable-duration-medium)] hover:border-[var(--tk-accent)] hover:text-[var(--tk-accent)]"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* Prev / next inside the shelf */}
              {(prev || next) && shelfCount > 1 ? (
                <nav className="mt-14 grid gap-4 border-t border-[var(--tk-line)] pt-8 sm:grid-cols-2">
                  {prev ? (
                    <ShelfSiblingLink
                      post={prev}
                      label="Previous on this shelf"
                      direction="prev"
                    />
                  ) : (
                    <span />
                  )}
                  {next ? (
                    <ShelfSiblingLink
                      post={next}
                      label="Next on this shelf"
                      direction="next"
                    />
                  ) : (
                    <span />
                  )}
                </nav>
              ) : null}
            </EditableReveal>
          </article>

          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <EditableReveal index={1}>
              <div className="rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-bg)] p-7">
                <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--tk-muted)]">
                  Why it earned the shelf
                </p>
                <ul className="mt-5 grid gap-3 text-[14px] leading-[1.55] text-[var(--tk-text)]">
                  <TrustRow label="Kept by a real curator" />
                  <TrustRow label="Live domain — checked at publish" />
                  <TrustRow label="Categorised on a themed shelf" />
                </ul>
              </div>
            </EditableReveal>

            <EditableReveal index={2}>
              <div className="rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-7">
                <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--tk-muted)]">
                  On this shelf
                </p>
                <p className="editable-display mt-4 text-[24px] font-medium tracking-[-0.02em]">
                  {category}
                </p>
                <p className="mt-2 text-[13px] leading-[1.55] text-[var(--tk-muted)]">
                  {shelfCount > 0
                    ? `${shelfCount} finds and counting — every one hand-picked.`
                    : 'A living index of curated finds.'}
                </p>
                <Link
                  href={`/sbm?category=${category.toLowerCase()}`}
                  className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--tk-accent)]"
                >
                  Open the shelf <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </EditableReveal>

            <EditableReveal index={3}>
              <Ads
                slot="sidebar"
                size={pickRandom(getSlotSizes('sidebar'))}
                showLabel
                className="mx-auto w-full"
              />
            </EditableReveal>
          </aside>
        </div>
      </section>

      {related.length ? (
        <MoreFromShelf task="sbm" related={related} category={category} />
      ) : null}
    </>
  )
}

function ShelfSiblingLink({
  post,
  label,
  direction,
}: {
  post: SitePost
  label: string
  direction: 'prev' | 'next'
}) {
  return (
    <Link
      href={`/sbm/${post.slug}`}
      className={`group flex flex-col gap-3 rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-5 transition duration-[var(--editable-duration-medium)] hover:-translate-y-[2px] hover:border-[var(--tk-accent)] ${
        direction === 'next' ? 'sm:text-right' : ''
      }`}
    >
      <span
        className={`inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--tk-accent)] ${
          direction === 'next' ? 'sm:justify-end' : ''
        }`}
      >
        {direction === 'prev' ? <ArrowLeft className="h-3 w-3" /> : null}
        {label}
        {direction === 'next' ? <ArrowRight className="h-3 w-3" /> : null}
      </span>
      <p className="editable-display line-clamp-2 text-[17px] font-medium leading-[1.2] tracking-[-0.02em] text-[var(--tk-text)] transition duration-[var(--editable-duration-medium)] group-hover:text-[var(--tk-accent)]">
        {post.title}
      </p>
    </Link>
  )
}

function TrustRow({ label }: { label: string }) {
  return (
    <li className="flex items-start gap-2.5">
      <CheckCircle2 className="mt-[3px] h-4 w-4 shrink-0 text-[var(--tk-accent)]" />
      <span>{label}</span>
    </li>
  )
}

function QuickFact({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: string
  icon: typeof Layers
}) {
  return (
    <div className="flex items-center gap-4">
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--tk-line)] bg-[var(--tk-surface)] text-[var(--tk-accent)]">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--tk-muted)]">
          {label}
        </p>
        <p className="mt-1 truncate text-[15px] font-medium text-[var(--tk-text)]">{value}</p>
      </div>
    </div>
  )
}

/* ---------- Profile detail (hidden but functional) ---------- */
function ProfileDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const avatar = images[0]
  const role = getField(post, ['role', 'designation', 'title'])
  const location = getField(post, ['location', 'city'])
  const website = getField(post, ['website', 'url'])
  const email = getField(post, ['email'])
  const twitter = getField(post, ['twitter', 'x'])
  const company = getField(post, ['company', 'organisation', 'organization'])
  const bioLead = leadText(post)
  const expertise = getTags(post)
  const initials = post.title
    .split(/\s+/)
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
  const keptCount = related.length

  return (
    <>
      {/* Cover band */}
      <section className="relative border-b border-[var(--tk-line)]">
        <div
          className="relative h-64 w-full overflow-hidden sm:h-80"
          style={{
            background:
              'linear-gradient(135deg, color-mix(in oklab, var(--tk-accent) 26%, transparent) 0%, color-mix(in oklab, var(--tk-accent) 8%, transparent) 60%, transparent 100%)',
          }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.09]"
            style={{
              backgroundImage:
                'repeating-linear-gradient(45deg, var(--tk-text) 0 1px, transparent 1px 14px)',
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(180deg,transparent,var(--tk-bg))]"
          />
          {/* Signature mark stamp */}
          <div className="pointer-events-none absolute right-6 top-6 hidden items-center gap-2 rounded-full border border-[var(--tk-line)] bg-[var(--tk-bg)]/85 px-3.5 py-1.5 text-[11px] font-medium text-[var(--tk-muted)] backdrop-blur-sm sm:inline-flex">
            <ShieldCheck className="h-3.5 w-3.5 text-[var(--tk-accent)]" /> Verified curator
          </div>
        </div>

        <div className={`${dc.shell.section} relative pb-14`}>
          <EditableReveal>
            <div className="-mt-24 flex flex-col items-start gap-8 sm:-mt-28 sm:flex-row sm:items-end">
              <div className="relative">
                <div className="flex h-44 w-44 shrink-0 items-center justify-center overflow-hidden rounded-[40px] border-[6px] border-[var(--tk-bg)] bg-[var(--tk-raised)] shadow-[0_28px_72px_-28px_rgba(33,12,0,0.45)]">
                  {avatar ? (
                    <img src={avatar} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <span className="editable-display text-6xl font-medium text-[var(--tk-accent)]">
                      {initials || 'C'}
                    </span>
                  )}
                </div>
                <span className="absolute -bottom-2 -right-2 inline-flex h-9 w-9 items-center justify-center rounded-full border-[3px] border-[var(--tk-bg)] bg-[var(--tk-accent)] text-[var(--tk-on-accent)] shadow-[0_10px_24px_-12px_rgba(33,12,0,0.55)]">
                  <BookmarkPlus className="h-4 w-4" />
                </span>
              </div>

              <div className="min-w-0 flex-1 pb-2">
                <p className="text-[11px] font-medium uppercase tracking-[0.26em] text-[var(--tk-accent)]">
                  Curator
                </p>
                <h1 className="editable-display mt-4 text-balance text-[clamp(2.25rem,5.5vw,4rem)] font-medium leading-[1.02] tracking-[-0.03em]">
                  {post.title}
                </h1>
                <p className="mt-3 text-[16px] text-[var(--tk-muted)]">
                  {[role, company, location].filter(Boolean).join(' · ') || 'Independent curator, at large.'}
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-2">
                  {website ? (
                    <a
                      href={website}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="inline-flex items-center gap-2 rounded-full bg-[var(--tk-accent)] px-5 py-2.5 text-[13px] font-medium text-[var(--tk-on-accent)] shadow-[0_10px_28px_-14px_rgba(33,12,0,0.55)] transition duration-[var(--editable-duration-medium)] hover:-translate-y-[1px]"
                    >
                      Visit their site <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  ) : null}
                  {email ? (
                    <a
                      href={`mailto:${email}`}
                      className="inline-flex items-center gap-2 rounded-full border border-[var(--tk-line)] px-4 py-2.5 text-[13px] font-medium text-[var(--tk-text)] transition duration-[var(--editable-duration-medium)] hover:-translate-y-[1px] hover:border-[var(--tk-accent)]"
                    >
                      <Mail className="h-3.5 w-3.5" /> Write to them
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          </EditableReveal>
        </div>
      </section>

      {/* Curator stats strip */}
      <section className="border-b border-[var(--tk-line)] bg-[var(--tk-surface)]">
        <div className={`${dc.shell.section} grid gap-6 py-7 sm:grid-cols-3`}>
          <CuratorStat label="Finds kept" value={String(keptCount)} icon={BookmarkPlus} />
          <CuratorStat label="Shelves tended" value={String(new Set(related.map((item) => categoryOf(item, ''))).size || 1)} icon={Layers} />
          <CuratorStat label="Curator standing" value="In good standing" icon={Star} />
        </div>
      </section>

      {/* Body + sidebar */}
      <section className={`${dc.shell.section} py-[clamp(64px,8vw,120px)]`}>
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_360px]">
          <article className="min-w-0">
            <EditableReveal>
              {bioLead ? (
                <figure className="mb-10 rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-8">
                  <Quote className="h-6 w-6 text-[var(--tk-accent)]" />
                  <blockquote className="editable-display mt-5 text-[24px] font-normal italic leading-[1.35] tracking-[-0.02em] text-[var(--tk-text)] sm:text-[28px]">
                    &ldquo;{bioLead}&rdquo;
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--tk-accent-soft)] text-[13px] font-semibold text-[var(--tk-accent)]">
                      {initials || 'C'}
                    </span>
                    <div>
                      <p className="text-[13px] font-medium text-[var(--tk-text)]">{post.title}</p>
                      <p className="text-[12px] uppercase tracking-[0.18em] text-[var(--tk-muted)]">
                        Curator manifesto
                      </p>
                    </div>
                  </figcaption>
                </figure>
              ) : null}

              <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--tk-muted)]">
                Bio
              </p>
              <BodyContent post={post} />

              {expertise.length ? (
                <div className="mt-14 border-t border-[var(--tk-line)] pt-8">
                  <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--tk-muted)]">
                    Curates around
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {expertise.map((tag) => (
                      <Link
                        key={tag}
                        href={`/sbm?category=${tag.toLowerCase()}`}
                        className="inline-flex items-center gap-1.5 rounded-full border border-[var(--tk-line)] bg-[var(--tk-surface)] px-3.5 py-1.5 text-[12px] font-medium text-[var(--tk-muted)] transition duration-[var(--editable-duration-medium)] hover:border-[var(--tk-accent)] hover:text-[var(--tk-accent)]"
                      >
                        <Compass className="h-3 w-3 text-[var(--tk-accent)]" /> {tag}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}
            </EditableReveal>

            {related.length ? (
              <EditableReveal index={1} className="mt-16">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--tk-accent)]">
                      Their kept finds
                    </p>
                    <h2 className="editable-display mt-3 text-[clamp(1.75rem,3vw,2.5rem)] font-medium tracking-[-0.02em]">
                      What&apos;s on their shelves
                    </h2>
                  </div>
                  <Link
                    href="/sbm"
                    className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--tk-accent)]"
                  >
                    Open the Library <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
                <div className="mt-8 grid gap-5 sm:grid-cols-2">
                  {related.map((item, index) => (
                    <ProfileContentCard
                      key={item.id || item.slug}
                      post={item}
                      index={index}
                    />
                  ))}
                </div>
              </EditableReveal>
            ) : null}
          </article>

          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <EditableReveal>
              <div className="rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-7">
                <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--tk-muted)]">
                  Identity
                </p>
                <dl className="mt-5 grid gap-4 text-[14px]">
                  <IdentityRow label="Name" value={post.title} />
                  {role ? <IdentityRow label="Role" value={role} /> : null}
                  {company ? <IdentityRow label="With" value={company} /> : null}
                  {location ? <IdentityRow label="Based in" value={location} /> : null}
                </dl>
              </div>
            </EditableReveal>

            <EditableReveal index={1}>
              <div className="rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-bg)] p-7">
                <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--tk-muted)]">
                  Reach
                </p>
                <div className="mt-5 grid gap-3">
                  {website ? (
                    <ContactRow icon={Link2} label={cleanDomain(website) || 'Website'} href={website} />
                  ) : null}
                  {email ? (
                    <ContactRow icon={Mail} label={email} href={`mailto:${email}`} />
                  ) : null}
                  {twitter ? (
                    <ContactRow
                      icon={ExternalLink}
                      label={`@${twitter.replace('@', '')}`}
                      href={`https://twitter.com/${twitter.replace('@', '')}`}
                    />
                  ) : null}
                  {!website && !email && !twitter ? (
                    <p className="text-[13px] text-[var(--tk-muted)]">
                      Curator prefers to be reached through the library.
                    </p>
                  ) : null}
                </div>
              </div>
            </EditableReveal>

            <EditableReveal index={2}>
              <div className="rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-7">
                <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--tk-muted)]">
                  Curator ethos
                </p>
                <ul className="mt-5 grid gap-3 text-[14px] leading-[1.55] text-[var(--tk-text)]">
                  <TrustRow label="Every keep opens at the source" />
                  <TrustRow label="Reputation moves with the resource" />
                  <TrustRow label="Kept, not liked" />
                </ul>
              </div>
            </EditableReveal>
          </aside>
        </div>
      </section>
    </>
  )
}

function CuratorStat({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: string
  icon: typeof Layers
}) {
  return (
    <div className="flex items-center gap-4">
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--tk-line)] bg-[var(--tk-bg)] text-[var(--tk-accent)]">
        <Icon className="h-4 w-4" />
      </span>
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--tk-muted)]">
          {label}
        </p>
        <p className="editable-display mt-1 text-[22px] font-medium tracking-[-0.02em] text-[var(--tk-text)]">
          {value}
        </p>
      </div>
    </div>
  )
}

function IdentityRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-[12px] font-medium uppercase tracking-[0.16em] text-[var(--tk-muted)]">{label}</dt>
      <dd className="text-right text-[14px] font-medium text-[var(--tk-text)]">{value}</dd>
    </div>
  )
}

function ContactRow({
  icon: Icon,
  label,
  href,
}: {
  icon: typeof Link2
  label: string
  href: string
}) {
  return (
    <a
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel="noopener noreferrer nofollow"
      className="editable-link-underline inline-flex items-center gap-2 text-[14px] font-medium text-[var(--tk-text)] hover:text-[var(--tk-accent)]"
    >
      <Icon className="h-3.5 w-3.5 text-[var(--tk-accent)]" /> {label}
    </a>
  )
}

function ProfileContentCard({ post, index = 0 }: { post: SitePost; index?: number }) {
  // Route back through /sbm so profile-linked resources stay on the library.
  const href = `/sbm/${post.slug}`
  const domain = cleanDomain(getField(post, ['website', 'url', 'link']))
  return (
    <Link
      href={href}
      className="group flex h-full flex-col gap-4 rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-6 transition duration-[var(--editable-duration-medium)] hover:-translate-y-[3px] hover:border-[var(--tk-accent)] hover:shadow-[0_24px_60px_-32px_rgba(33,12,0,0.35)]"
    >
      <div className="flex items-center justify-between text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--tk-accent)]">
        <span>{categoryOf(post, 'Kept resource')}</span>
        <span className="text-[var(--tk-muted)]">No. {String(index + 1).padStart(2, '0')}</span>
      </div>
      <h3 className="editable-display line-clamp-3 flex-1 text-[19px] font-medium leading-[1.2] tracking-[-0.02em] text-[var(--tk-text)] transition duration-[var(--editable-duration-medium)] group-hover:text-[var(--tk-accent)]">
        {post.title}
      </h3>
      <p className="line-clamp-2 text-[13px] leading-[1.55] text-[var(--tk-muted)]">
        {stripHtml(summaryText(post))}
      </p>
      <div className="mt-1 flex items-center justify-between border-t border-[var(--tk-line)] pt-4 text-[12px] font-medium">
        <span className="inline-flex items-center gap-1.5 text-[var(--tk-muted)]">
          <Globe2 className="h-3 w-3 text-[var(--tk-accent)]" /> {domain || 'Curated resource'}
        </span>
        <span className="inline-flex items-center gap-1 text-[var(--tk-accent)]">
          Open <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  )
}

/* ---------- Article, generic resource, more strip ---------- */
function ArticleDetail({
  post,
  related,
  comments,
}: {
  post: SitePost
  related: SitePost[]
  comments: Array<{ id: string; name: string; comment: string; createdAt: string }>
}) {
  const images = getImages(post)
  return (
    <>
      <article className="mx-auto max-w-3xl px-6 py-14 sm:py-20">
        <EditableReveal>
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--tk-accent)]">
            {categoryOf(post, 'Field notes')}
          </p>
          <h1 className="editable-display mt-6 text-balance text-[clamp(2.25rem,5vw,3.5rem)] font-medium leading-[1.06] tracking-[-0.03em]">
            {post.title}
          </h1>
          {images[0] ? (
            <img
              src={images[0]}
              alt=""
              className="mt-10 aspect-[16/9] w-full rounded-[var(--tk-radius)] border border-[var(--tk-line)] object-cover"
            />
          ) : null}
          <BodyContent post={post} />
          <EditableArticleComments slug={post.slug} comments={comments} />
        </EditableReveal>
      </article>
      {related.length && !isUiHiddenTask('article') ? (
        <MoreFromShelf task="article" related={related} />
      ) : null}
    </>
  )
}

function GenericResourceDetail({
  task,
  post,
  related,
}: {
  task: TaskKey
  post: SitePost
  related: SitePost[]
}) {
  const website = getField(post, ['website', 'url', 'link'])
  const domain = cleanDomain(website)
  const category = categoryOf(post, 'Resource')
  return (
    <>
      <section className={`${dc.shell.section} py-[clamp(56px,7vw,120px)]`}>
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_360px]">
          <article className="min-w-0">
            <EditableReveal>
              <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--tk-accent)]">
                {category}
              </p>
              <h1 className="editable-display mt-6 text-balance text-[clamp(2rem,4.5vw,3.25rem)] font-medium leading-[1.05] tracking-[-0.03em]">
                {post.title}
              </h1>
              <BodyContent post={post} />
            </EditableReveal>
          </article>
          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <EditableReveal>
              <div className="rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-7">
                <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--tk-muted)]">
                  About this find
                </p>
                <dl className="mt-4 grid gap-3 text-[13px]">
                  <IdentityRow label="Shelf" value={category} />
                  {domain ? <IdentityRow label="Domain" value={domain} /> : null}
                </dl>
                {website ? (
                  <a
                    href={website}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--tk-accent)] px-5 py-3 text-sm font-medium text-[var(--tk-on-accent)] transition duration-[var(--editable-duration-medium)] hover:-translate-y-[1px]"
                  >
                    Open resource <ExternalLink className="h-4 w-4" />
                  </a>
                ) : null}
              </div>
            </EditableReveal>
          </aside>
        </div>
      </section>
      {related.length && !isUiHiddenTask(task) ? (
        <MoreFromShelf task={task} related={related} />
      ) : null}
    </>
  )
}

function MoreFromShelf({
  task,
  related,
  category,
}: {
  task: TaskKey
  related: SitePost[]
  category?: string
}) {
  const taskConfig = getTaskConfig(task)
  const label = taskConfig ? getTaskDisplayLabel(taskConfig) : task
  return (
    <section className="border-t border-[var(--tk-line)] bg-[var(--tk-surface)]">
      <div className={`${dc.shell.section} py-[clamp(64px,8vw,120px)]`}>
        <EditableReveal>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--tk-accent)]">
                From this shelf
              </p>
              <h2 className="editable-display mt-4 text-[clamp(1.75rem,3vw,2.5rem)] font-medium tracking-[-0.02em]">
                More {category ? `in ${category}` : `from ${label}`}
              </h2>
            </div>
            <Link
              href={taskConfig?.route || '/'}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--tk-accent)]"
            >
              Open shelf <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </EditableReveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((item, index) => (
            <EditableReveal key={item.id || item.slug} index={index}>
              <RelatedCard task={task} post={item} />
            </EditableReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function RelatedCard({ task, post }: { task: TaskKey; post: SitePost }) {
  const image = getImages(post)[0]
  const href = `${getTaskConfig(task)?.route || `/${task}`}/${post.slug}`
  return (
    <Link
      href={href}
      className="group block h-full overflow-hidden rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-bg)] transition duration-[var(--editable-duration-medium)] hover:-translate-y-[3px]"
    >
      <div className="aspect-[16/10] overflow-hidden bg-[var(--tk-raised)]">
        {image ? (
          <img
            src={image}
            alt=""
            className="h-full w-full object-cover transition duration-[var(--editable-duration-slow)] group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <FileText className="h-6 w-6 text-[var(--tk-muted)]" />
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="editable-display line-clamp-3 text-[17px] font-medium leading-[1.15] tracking-[-0.02em]">
          {post.title}
        </h3>
        <p className="mt-3 line-clamp-2 text-[13px] leading-[1.55] text-[var(--tk-muted)]">{stripHtml(summaryText(post))}</p>
      </div>
    </Link>
  )
}

function BodyContent({ post, compact = false }: { post: SitePost; compact?: boolean }) {
  return (
    <div
      className={`article-content mt-10 max-w-none text-[var(--tk-text)] ${
        compact ? 'text-[15px] leading-[1.65]' : 'text-[1.0625rem] leading-[1.75]'
      }`}
      dangerouslySetInnerHTML={{ __html: formatPlainText(getBody(post)) }}
    />
  )
}
