import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, Filter, Search } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { fetchSiteFeed } from '@/lib/site-connector'
import { getPostTaskKey } from '@/lib/task-data'
import { getMockPostsForTask } from '@/lib/mock-posts'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { toPlainText, getEditableDomain, getEditablePostImage } from '@/editable/cards/PostCards'
import { pagesContent } from '@/editable/content/pages.content'
import {
  isUiHiddenTask,
  getTaskDisplayLabel,
} from '@/editable/content/global.content'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { Ads, getSlotSizes } from '@/lib/ads'

const pickRandom = (sizes: string[]) => sizes[Math.floor(Math.random() * sizes.length)]

export const revalidate = 3

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/search',
    title: pagesContent.search.metadata.title,
    description: pagesContent.search.metadata.description,
  })
}

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ')
const compactText = (value: unknown) =>
  typeof value === 'string' ? stripHtml(value).replace(/\s+/g, ' ').trim().toLowerCase() : ''
const getContent = (post: SitePost) =>
  post.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
const compactRaw = (value: unknown) => (typeof value === 'string' ? value.trim() : '')
const summaryOf = (post: SitePost) => {
  const content = getContent(post)
  return toPlainText(
    (typeof post.summary === 'string' && post.summary) ||
      compactRaw(content.description) ||
      compactRaw(content.excerpt) ||
      compactRaw(content.body) ||
      ''
  )
}

const matches = (post: SitePost, query: string, category: string, task: string) => {
  const content = getContent(post)
  const typeText = compactText(content.type)
  if (typeText === 'comment') return false
  const derivedTask = getPostTaskKey(post) || typeText
  if (derivedTask && isUiHiddenTask(String(derivedTask))) return false
  if (task && derivedTask !== task) return false
  const categoryText = compactText(content.category)
  const tagsText = compactText(Array.isArray(post.tags) ? post.tags.join(' ') : '')
  if (category && !(categoryText || tagsText).includes(category)) return false
  if (!query) return true
  return [
    post.title,
    post.summary,
    content.description,
    content.body,
    content.excerpt,
    content.category,
    Array.isArray(post.tags) ? post.tags.join(' ') : '',
  ].some((value) => compactText(value).includes(query))
}

function SearchResultCard({ post }: { post: SitePost }) {
  const task = getPostTaskKey(post) as TaskKey | null
  const taskConfig = task ? SITE_CONFIG.tasks.find((item) => item.key === task) : null
  const taskRoute = taskConfig?.route
  const href = `${taskRoute || `/${task || 'sbm'}`}/${post.slug}`
  const image = getEditablePostImage(post)
  const summary = summaryOf(post)
  const label = taskConfig ? getTaskDisplayLabel(taskConfig) : 'Find'
  const domain = getEditableDomain(post)

  return (
    <Link
      href={href}
      className="group grid h-full min-w-0 gap-6 overflow-hidden rounded-[var(--editable-radius-md)] border border-[var(--editable-border-soft)] bg-[var(--slot4-surface-bg)] p-5 transition duration-[var(--editable-duration-medium)] hover:-translate-y-[3px] hover:shadow-[0_28px_60px_-30px_rgba(33,12,0,0.35)] sm:grid-cols-[220px_minmax(0,1fr)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--editable-radius-md)] bg-[var(--slot4-media-bg)] sm:aspect-auto sm:min-h-[160px]">
        {image ? (
          <img
            src={image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover transition duration-[var(--editable-duration-slow)] group-hover:scale-[1.03]"
            loading="lazy"
          />
        ) : null}
      </div>
      <div className="flex min-w-0 flex-col py-2 sm:py-4 sm:pr-6">
        <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--slot4-accent)]">
          {label}
        </p>
        <h2 className="editable-display mt-4 line-clamp-3 text-[22px] font-medium leading-[1.15] tracking-[-0.02em]">
          {post.title}
        </h2>
        {summary ? (
          <p className="mt-3 line-clamp-2 text-[15px] leading-[1.6] text-[var(--slot4-muted-text)]">{summary}</p>
        ) : null}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          {domain ? (
            <span className="rounded-full border border-[var(--editable-border-soft)] px-3 py-1 text-[12px] font-medium text-[var(--slot4-muted-text)]">
              {domain}
            </span>
          ) : <span />}
          <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--slot4-accent)]">
            Open <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  )
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string; category?: string; task?: string; master?: string }>
}) {
  const resolved = (await searchParams) || {}
  const query = (resolved.q || '').trim()
  const normalized = query.toLowerCase()
  const category = (resolved.category || '').trim().toLowerCase()
  const task = (resolved.task || '').trim().toLowerCase()
  // Filter results down to non-hidden tasks in the request too.
  const requestedTask = task && !isUiHiddenTask(task) ? task : ''
  const useMaster = resolved.master !== '0'
  const feed = await fetchSiteFeed(
    useMaster ? 1000 : 300,
    useMaster
      ? { fresh: true, category: category || undefined, task: requestedTask || undefined }
      : undefined
  )
  const posts = feed?.posts?.length
    ? feed.posts
    : useMaster
    ? []
    : SITE_CONFIG.tasks
        .filter((item) => item.enabled && !isUiHiddenTask(item.key))
        .flatMap((item) => getMockPostsForTask(item.key))
  const results = posts
    .filter((post) => matches(post, normalized, category, requestedTask))
    .slice(0, normalized ? 80 : 36)
  const enabledTasks = SITE_CONFIG.tasks.filter(
    (item) => item.enabled && !isUiHiddenTask(item.key)
  )

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className={`${dc.shell.section} py-[clamp(64px,10vw,120px)]`}>
          <EditableReveal>
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-accent)]">
                  {pagesContent.search.hero.badge}
                </p>
                <h1 className="editable-display mt-6 text-balance text-[clamp(2.5rem,6vw,4.5rem)] font-medium leading-[1.02] tracking-[-0.03em]">
                  {pagesContent.search.hero.title}
                </h1>
                <p className="mt-8 max-w-xl text-[1.125rem] leading-[1.55] text-[var(--slot4-muted-text)]">
                  {pagesContent.search.hero.description}
                </p>
              </div>
              <form
                action="/search"
                className="grid gap-3 rounded-[var(--editable-radius-lg)] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-5 sm:p-6"
              >
                <input type="hidden" name="master" value="1" />
                <label className="flex items-center gap-3 rounded-full border border-[var(--editable-border-soft)] bg-[var(--slot4-page-bg)] px-5 py-3">
                  <Search className="h-4 w-4 text-[var(--slot4-accent)]" />
                  <input
                    name="q"
                    defaultValue={query}
                    placeholder={pagesContent.search.hero.placeholder}
                    className="min-w-0 flex-1 bg-transparent text-[15px] font-medium text-[var(--slot4-page-text)] outline-none placeholder:text-[var(--slot4-soft-muted-text)]"
                  />
                </label>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="flex items-center gap-2 rounded-full border border-[var(--editable-border-soft)] bg-[var(--slot4-page-bg)] px-4 py-3">
                    <Filter className="h-4 w-4 text-[var(--slot4-accent)]" />
                    <input
                      name="category"
                      defaultValue={category}
                      placeholder="Shelf or tag"
                      className="min-w-0 flex-1 bg-transparent text-[14px] font-medium outline-none placeholder:text-[var(--slot4-soft-muted-text)]"
                    />
                  </label>
                  <select
                    name="task"
                    defaultValue={requestedTask}
                    className="rounded-full border border-[var(--editable-border-soft)] bg-[var(--slot4-page-bg)] px-4 py-3 text-[14px] font-medium outline-none"
                  >
                    <option value="">Every collection</option>
                    {enabledTasks.map((item) => (
                      <option key={item.key} value={item.key}>
                        {getTaskDisplayLabel(item)}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  className="inline-flex h-12 w-full items-center justify-center rounded-full bg-[var(--editable-cta-bg)] px-6 text-sm font-medium text-[var(--editable-cta-text)] transition duration-[var(--editable-duration-medium)] hover:-translate-y-[1px]"
                >
                  Search the library
                </button>
              </form>
            </div>
          </EditableReveal>

          <EditableReveal index={1} className="mt-16 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--slot4-accent)]">
                {results.length} finds
              </p>
              <h2 className="editable-display mt-4 text-[clamp(1.75rem,3vw,2.5rem)] font-medium tracking-[-0.02em]">
                {query ? `Results for “${query}”` : pagesContent.search.resultsTitle}
              </h2>
            </div>
            <Link
              href="/sbm"
              className={dc.button.secondary}
            >
              Open the Library <ArrowUpRight className="h-4 w-4" />
            </Link>
          </EditableReveal>

          {results.length ? (
            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              {results.map((post, index) => (
                <EditableReveal key={post.id || post.slug} index={index}>
                  <SearchResultCard post={post} />
                </EditableReveal>
              ))}
            </div>
          ) : (
            <div className="mt-12 rounded-[var(--editable-radius-lg)] border border-dashed border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-12 text-center">
              <p className="editable-display text-[24px] font-medium tracking-[-0.02em]">Nothing matched.</p>
              <p className="mt-3 text-[15px] text-[var(--slot4-muted-text)]">
                Try another keyword, or pick a shelf from the collections.
              </p>
            </div>
          )}

          <EditableReveal index={2} className="mt-16">
            <Ads
              slot="footer"
              size={pickRandom(getSlotSizes('footer'))}
              showLabel
              className="mx-auto w-full"
            />
          </EditableReveal>
        </section>
      </main>
    </EditableSiteShell>
  )
}
