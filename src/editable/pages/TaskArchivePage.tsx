import Link from 'next/link'
import {
  ArrowUpRight,
  BookmarkPlus,
  ChevronDown,
  Globe2,
  Layers,
  Search,
} from 'lucide-react'
import { buildTaskMetadata } from '@/lib/seo'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'
import { fetchPaginatedTaskPosts, buildPostUrl } from '@/lib/task-data'
import { getTaskConfig, type TaskKey } from '@/lib/site-config'
import type { SiteFeedPagination, SitePost } from '@/lib/site-connector'
import { taskPageMetadata } from '@/config/site.content'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { getTaskTheme, taskThemeStyle } from '@/editable/theme/task-themes'
import {
  editableDesignContract as dc,
} from '@/editable/layouts/design-contract'
import { getTaskDisplayLabel } from '@/editable/content/global.content'
import { Ads, getSlotSizes } from '@/lib/ads'

const pickRandom = (sizes: string[]) => sizes[Math.floor(Math.random() * sizes.length)]

export const revalidate = 3

export const taskMetadata = (task: TaskKey, path: string) =>
  buildTaskMetadata(task, {
    path,
    title: taskPageMetadata[task]?.title,
    description: taskPageMetadata[task]?.description,
  })

const getContent = (post: SitePost) =>
  post.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
const asText = (value: unknown) => (typeof value === 'string' ? value.trim() : '')
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media)
    ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url))
    : []
  const images = Array.isArray(content.images)
    ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url))
    : []
  const image = asText(content.image) || asText(content.featuredImage) || asText(content.thumbnail)
  const logo = asText(content.logo)
  return [...media, ...images, ...(isUrl(image) ? [image] : []), ...(isUrl(logo) ? [logo] : [])]
    .filter(Boolean)
    .slice(0, 8)
}

const placeholder = '/placeholder.svg?height=900&width=1200'
const getImage = (post: SitePost) => getImages(post)[0] || placeholder
const getCategory = (post: SitePost, fallback: string) =>
  asText(getContent(post).category) || post.tags?.[0] || fallback
const stripHtml = (value: string) =>
  value
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
const getSummary = (post: SitePost) =>
  stripHtml(
    post.summary ||
      asText(getContent(post).description) ||
      asText(getContent(post).excerpt) ||
      asText(getContent(post).body)
  )
const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}
const cleanDomain = (value: string) => {
  if (!value) return ''
  try {
    const parsed = new URL(value.startsWith('http') ? value : `https://${value}`)
    return parsed.hostname.replace(/^www\./, '')
  } catch {
    return value.replace(/^https?:\/\//, '').replace(/\/.*$/, '')
  }
}

function pageHref(basePath: string, category: string, page: number) {
  const params = new URLSearchParams()
  if (category && category !== 'all') params.set('category', category)
  if (page > 1) params.set('page', String(page))
  const query = params.toString()
  return query ? `${basePath}?${query}` : basePath
}

export async function EditableTaskArchiveRoute({
  task,
  searchParams,
  basePath,
}: {
  task: TaskKey
  searchParams?: Promise<{ category?: string; page?: string }>
  basePath?: string
}) {
  const resolved = (await searchParams) || {}
  const page = Math.max(1, Math.floor(Number(resolved.page) || 1))
  const category = resolved.category ? normalizeCategory(resolved.category) : 'all'
  const taskConfig = getTaskConfig(task)
  const { posts, pagination } = await fetchPaginatedTaskPosts(task, { page, limit: 24, category })
  return (
    <TaskArchiveView
      task={task}
      posts={posts}
      pagination={pagination}
      category={category}
      basePath={basePath || taskConfig?.route || `/${task}`}
    />
  )
}

export function TaskArchiveView({
  task,
  posts,
  pagination,
  category,
  basePath,
}: {
  task: TaskKey
  posts: SitePost[]
  pagination: SiteFeedPagination
  category: string
  basePath: string
}) {
  const taskConfig = getTaskConfig(task)
  const voice = taskPageVoices[task]
  const theme = getTaskTheme(task)
  const page = pagination.page || 1
  const label = taskConfig ? getTaskDisplayLabel(taskConfig) : task
  const categoryLabel =
    category === 'all'
      ? 'Every shelf'
      : CATEGORY_OPTIONS.find((item) => item.slug === category)?.name || category
  const showAd = task === 'sbm'
  const adInsertAt = 6
  const feedItems = showAd && posts.length > adInsertAt ? [...posts.slice(0, adInsertAt), 'ad' as const, ...posts.slice(adInsertAt)] : posts

  return (
    <EditableSiteShell>
      <main style={taskThemeStyle(task)} className="min-h-screen bg-[var(--tk-bg)] text-[var(--tk-text)]">
        <header className="relative overflow-hidden border-b border-[var(--tk-line)]">
          <div className="pointer-events-none absolute inset-x-0 -top-40 h-96 bg-[radial-gradient(60%_60%_at_50%_0%,var(--tk-glow),transparent_70%)]" />
          <div className={`relative ${dc.shell.section} py-[clamp(72px,10vw,140px)]`}>
            <EditableReveal>
              <div className="flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--tk-accent)]">
                <span>{theme.kicker}</span>
                <span className="h-1 w-1 rounded-full bg-[var(--tk-accent)] opacity-60" />
                <span className="text-[var(--tk-muted)]">{label}</span>
              </div>
              <h1 className="editable-display mt-6 max-w-4xl text-balance text-[clamp(2.5rem,6vw,4.5rem)] font-medium leading-[1.02] tracking-[-0.03em]">
                {task === 'sbm'
                  ? 'The shelves the library keeps returning to.'
                  : voice?.headline || `Browse ${label}`}
              </h1>
              <p className="mt-8 max-w-2xl text-[1.125rem] leading-[1.55] text-[var(--tk-muted)]">
                {task === 'sbm'
                  ? 'A living index of curated collections — each shelf gathers the finds our curators trust, keep and revisit.'
                  : voice?.description || theme.note}
              </p>
              {voice?.chips?.length ? (
                <div className="mt-8 flex flex-wrap gap-2">
                  {voice.chips.map((chip) => (
                    <span
                      key={chip}
                      className="rounded-full border border-[var(--tk-line)] bg-[var(--tk-surface)] px-3.5 py-1.5 text-[12px] font-medium text-[var(--tk-muted)]"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              ) : null}
            </EditableReveal>

            <EditableReveal index={1} className="mt-14 flex flex-col gap-6 border-t border-[var(--tk-line)] pt-8 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3 text-[13px] text-[var(--tk-muted)]">
                <Layers className="h-4 w-4 text-[var(--tk-accent)]" />
                <span>
                  <span className="font-medium text-[var(--tk-text)]">{posts.length}</span> keeps · {categoryLabel}
                </span>
              </div>
              <form action={basePath} className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <select
                    name="category"
                    defaultValue={category}
                    aria-label={voice?.filterLabel || 'Filter category'}
                    className="h-11 appearance-none rounded-full border border-[var(--tk-line)] bg-[var(--tk-surface)] pl-4 pr-11 text-sm font-medium text-[var(--tk-text)] outline-none transition duration-[var(--editable-duration-medium)] focus:border-[var(--tk-accent)]"
                  >
                    <option value="all">Every shelf</option>
                    {CATEGORY_OPTIONS.map((item) => (
                      <option key={item.slug} value={item.slug}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--tk-muted)]" />
                </div>
                <button className="inline-flex h-11 items-center rounded-full bg-[var(--tk-accent)] px-5 text-sm font-medium text-[var(--tk-on-accent)] transition duration-[var(--editable-duration-medium)] hover:-translate-y-[1px]">
                  Apply
                </button>
              </form>
            </EditableReveal>
          </div>
        </header>

        <section className={`${dc.shell.section} py-[clamp(64px,8vw,120px)]`}>
          {posts.length ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {feedItems.map((entry, index) => {
                if (entry === 'ad') {
                  return (
                    <div
                      key="feed-ad"
                      className="md:col-span-2 xl:col-span-3 flex items-center justify-center rounded-[var(--tk-radius)] border border-dashed border-[var(--tk-line)] bg-[var(--tk-surface)] p-3"
                    >
                      <Ads
                        slot="in-feed"
                        size={pickRandom(getSlotSizes('in-feed'))}
                        showLabel
                        className="mx-auto w-full"
                      />
                    </div>
                  )
                }
                const post = entry
                const href = `${basePath}/${post.slug}` || buildPostUrl(task, post.slug)
                if (task === 'sbm') {
                  return (
                    <EditableReveal key={post.id || post.slug} index={index}>
                      <BookmarkShelfCard post={post} href={href} index={index} />
                    </EditableReveal>
                  )
                }
                if (task === 'profile') {
                  return (
                    <EditableReveal key={post.id || post.slug} index={index}>
                      <ProfileArchiveCard post={post} href={href} />
                    </EditableReveal>
                  )
                }
                return (
                  <EditableReveal key={post.id || post.slug} index={index}>
                    <GenericArchiveCard post={post} href={href} index={index} />
                  </EditableReveal>
                )
              })}
            </div>
          ) : (
            <div className="mx-auto max-w-xl rounded-[var(--tk-radius)] border border-dashed border-[var(--tk-line)] bg-[var(--tk-surface)] px-8 py-16 text-center">
              <Search className="mx-auto h-7 w-7 text-[var(--tk-muted)]" />
              <h2 className="editable-display mt-5 text-2xl font-medium tracking-[-0.02em]">This shelf is quiet</h2>
              <p className="mt-3 text-[15px] leading-[1.55] text-[var(--tk-muted)]">
                Nothing keeps here yet in this category. Try another shelf, or check back once new finds land.
              </p>
            </div>
          )}

          {posts.length ? (
            <nav className="mt-16 flex items-center justify-center gap-3 text-sm">
              {pagination.hasPrevPage ? (
                <Link
                  href={pageHref(basePath, category, page - 1)}
                  className="rounded-full border border-[var(--tk-line)] px-5 py-2.5 font-medium transition duration-[var(--editable-duration-medium)] hover:border-[var(--tk-accent)]"
                >
                  Previous
                </Link>
              ) : null}
              <span className="rounded-full border border-[var(--tk-line)] bg-[var(--tk-surface)] px-5 py-2.5 font-medium text-[var(--tk-muted)]">
                Page {page} of {pagination.totalPages || 1}
              </span>
              {pagination.hasNextPage ? (
                <Link
                  href={pageHref(basePath, category, page + 1)}
                  className="rounded-full border border-[var(--tk-line)] px-5 py-2.5 font-medium transition duration-[var(--editable-duration-medium)] hover:border-[var(--tk-accent)]"
                >
                  Next
                </Link>
              ) : null}
            </nav>
          ) : null}
        </section>
      </main>
    </EditableSiteShell>
  )
}

function BookmarkShelfCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const image = getImage(post)
  const domain = cleanDomain(getField(post, ['website', 'url', 'link']))
  const category = getCategory(post, 'Collection')
  return (
    <Link
      href={href}
      className="group flex h-full flex-col overflow-hidden rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] transition duration-[var(--editable-duration-medium)] hover:-translate-y-[3px] hover:shadow-[0_28px_60px_-30px_rgba(33,12,0,0.35)]"
    >
      <div className="relative aspect-[5/3] overflow-hidden bg-[var(--tk-raised)]">
        <img
          src={image}
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition duration-[var(--editable-duration-slow)] group-hover:scale-[1.03]"
        />
        <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-[var(--tk-bg)]/95 px-3 py-1 text-[11px] font-medium text-[var(--tk-text)]">
          <BookmarkPlus className="h-3 w-3 text-[var(--tk-accent)]" /> {category}
        </span>
        <span className="absolute right-4 top-4 rounded-full bg-[var(--tk-bg)]/95 px-3 py-1 text-[11px] font-medium text-[var(--tk-muted)]">
          No. {String(index + 1).padStart(2, '0')}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-7">
        <h2 className="editable-display line-clamp-3 text-[22px] font-medium leading-[1.15] tracking-[-0.02em]">
          {post.title}
        </h2>
        <p className="mt-3 line-clamp-3 flex-1 text-[15px] leading-[1.6] text-[var(--tk-muted)]">
          {getSummary(post)}
        </p>
        <div className="mt-6 flex items-center justify-between border-t border-[var(--tk-line)] pt-4 text-[12px]">
          <span className="flex items-center gap-1.5 font-medium text-[var(--tk-muted)]">
            <Globe2 className="h-3 w-3 text-[var(--tk-accent)]" /> {domain || 'Curated'}
          </span>
          <span className="inline-flex items-center gap-1 font-medium text-[var(--tk-accent)]">
            Open resource <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Link>
  )
}

function GenericArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const image = getImage(post)
  const category = getCategory(post, 'Field notes')
  return (
    <Link
      href={href}
      className="group flex h-full flex-col overflow-hidden rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] transition duration-[var(--editable-duration-medium)] hover:-translate-y-[3px] hover:shadow-[0_28px_60px_-30px_rgba(33,12,0,0.35)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-[var(--tk-raised)]">
        <img
          src={image}
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition duration-[var(--editable-duration-slow)] group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-1 flex-col p-7">
        <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--tk-accent)]">
          {category} · No. {String(index + 1).padStart(2, '0')}
        </p>
        <h2 className="editable-display mt-4 line-clamp-3 text-[22px] font-medium leading-[1.15] tracking-[-0.02em]">
          {post.title}
        </h2>
        <p className="mt-3 line-clamp-3 flex-1 text-[15px] leading-[1.6] text-[var(--tk-muted)]">
          {getSummary(post)}
        </p>
        <span className="mt-6 inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--tk-accent)]">
          Continue reading <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  )
}

function ProfileArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const avatar = getImages(post)[0]
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  return (
    <Link
      href={href}
      className="group flex h-full flex-col items-center rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-8 text-center transition duration-[var(--editable-duration-medium)] hover:-translate-y-[3px]"
    >
      <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-[var(--tk-line)] bg-[var(--tk-raised)]">
        {avatar ? <img src={avatar} alt="" className="h-full w-full object-cover" /> : null}
      </div>
      <h2 className="editable-display mt-6 text-[20px] font-medium tracking-[-0.02em]">{post.title}</h2>
      {role ? <p className="mt-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--tk-accent)]">{role}</p> : null}
      <p className="mt-4 line-clamp-2 text-[14px] leading-[1.55] text-[var(--tk-muted)]">{getSummary(post)}</p>
    </Link>
  )
}
