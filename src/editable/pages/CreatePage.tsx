'use client'

import { FormEvent, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  ArrowUpRight,
  BookmarkPlus,
  CheckCircle2,
  Globe2,
  Layers,
  Lock,
  Send,
} from 'lucide-react'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'
import {
  getTaskDisplayLabel,
  isUiHiddenTask,
} from '@/editable/content/global.content'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'

type DraftPost = {
  id: string
  task: TaskKey
  title: string
  category: string
  summary: string
  url: string
  image: string
  body: string
  createdAt: string
}

const STORE_KEY = 'slot4:created-posts'

const fieldClass =
  'w-full rounded-2xl border border-[var(--editable-border-soft)] bg-[var(--slot4-surface-bg)] px-4 py-3 text-[15px] font-medium text-[var(--slot4-page-text)] outline-none transition duration-[var(--editable-duration-medium)] placeholder:text-[var(--slot4-soft-muted-text)] focus:border-[var(--slot4-accent)]'

const saveDraft = (draft: DraftPost) => {
  try {
    const existing = JSON.parse(window.localStorage.getItem(STORE_KEY) || '[]')
    const list = Array.isArray(existing) ? existing : []
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft, ...list].slice(0, 50)))
  } catch {
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft]))
  }
}

export default function CreatePage() {
  const { session } = useEditableLocalAuthSession()
  const enabledTasks = useMemo(
    () => SITE_CONFIG.tasks.filter((task) => task.enabled && !isUiHiddenTask(task.key)),
    []
  )
  const [task, setTask] = useState<TaskKey>((enabledTasks[0]?.key || 'sbm') as TaskKey)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [summary, setSummary] = useState('')
  const [url, setUrl] = useState('')
  const [image, setImage] = useState('')
  const [body, setBody] = useState('')
  const [created, setCreated] = useState<DraftPost | null>(null)

  const activeTask = enabledTasks.find((item) => item.key === task) || enabledTasks[0]
  const activeLabel = activeTask ? getTaskDisplayLabel(activeTask) : 'find'

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const draft: DraftPost = {
      id: `draft-${Date.now()}`,
      task,
      title: title.trim(),
      category: category.trim() || 'uncategorized',
      summary: summary.trim(),
      url: url.trim(),
      image: image.trim(),
      body: body.trim(),
      createdAt: new Date().toISOString(),
    }
    saveDraft(draft)
    setCreated(draft)
    setTitle('')
    setCategory('')
    setSummary('')
    setUrl('')
    setImage('')
    setBody('')
  }

  if (!session) {
    return (
      <EditableSiteShell>
        <main className="bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
          <section className={`${dc.shell.section} py-[clamp(72px,10vw,140px)]`}>
            <EditableReveal>
              <div
                className={`${dc.surface.feature} grid gap-10 overflow-hidden p-10 sm:p-14 md:grid-cols-[0.9fr_1.1fr]`}
              >
                <div className="flex min-h-56 items-center justify-center rounded-[var(--editable-radius-lg)] bg-[var(--slot4-dark-bg)] text-[var(--slot4-dark-text)]">
                  <Lock className="h-16 w-16 opacity-80" />
                </div>
                <div className="self-center">
                  <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-accent)]">
                    {pagesContent.create.locked.badge}
                  </p>
                  <h1 className="editable-display mt-6 text-balance text-[clamp(2rem,4.5vw,3.5rem)] font-medium leading-[1.05] tracking-[-0.03em]">
                    {pagesContent.create.locked.title}
                  </h1>
                  <p className="mt-6 max-w-xl text-[16px] leading-[1.65] text-[var(--slot4-muted-text)]">
                    {pagesContent.create.locked.description}
                  </p>
                  <div className="mt-10 flex flex-wrap gap-3">
                    <Link href="/login" className={dc.button.primary}>
                      Sign in <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link href="/signup" className={dc.button.secondary}>
                      Become a curator
                    </Link>
                  </div>
                </div>
              </div>
            </EditableReveal>
          </section>
        </main>
      </EditableSiteShell>
    )
  }

  return (
    <EditableSiteShell>
      <main className="bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className={`${dc.shell.section} py-[clamp(64px,10vw,120px)]`}>
          <EditableReveal>
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-accent)]">
              {pagesContent.create.hero.badge}
            </p>
            <h1 className="editable-display mt-6 max-w-3xl text-balance text-[clamp(2.25rem,5vw,3.75rem)] font-medium leading-[1.04] tracking-[-0.03em]">
              {pagesContent.create.hero.title}
            </h1>
            <p className="mt-6 max-w-2xl text-[1.0625rem] leading-[1.55] text-[var(--slot4-muted-text)]">
              {pagesContent.create.hero.description}
            </p>
          </EditableReveal>

          <div className="mt-14 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <EditableReveal>
              <div className={`${dc.surface.feature} p-8`}>
                <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--slot4-accent)]">
                  What are you keeping?
                </p>
                <div className="mt-6 grid gap-3">
                  {enabledTasks.map((item) => {
                    const active = item.key === task
                    return (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => setTask(item.key)}
                        className={`rounded-[var(--editable-radius-md)] border p-5 text-left transition duration-[var(--editable-duration-medium)] ${
                          active
                            ? 'border-transparent bg-[var(--slot4-page-text)] text-[var(--slot4-cream)] shadow-[0_18px_44px_-24px_rgba(33,12,0,0.55)]'
                            : 'border-[var(--editable-border-soft)] bg-[var(--slot4-surface-bg)] hover:-translate-y-[1px]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`inline-flex h-9 w-9 items-center justify-center rounded-full ${active ? 'bg-white/10 text-[var(--slot4-cream)]' : 'bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]'}`}>
                            <BookmarkPlus className="h-4 w-4" />
                          </span>
                          <p className={`editable-display text-[17px] font-medium tracking-[-0.02em] ${active ? '' : 'text-[var(--slot4-page-text)]'}`}>
                            {getTaskDisplayLabel(item)}
                          </p>
                        </div>
                        <p
                          className={`mt-4 text-[13px] leading-[1.55] ${
                            active ? 'text-[color-mix(in_oklab,var(--slot4-cream)_82%,transparent)]' : 'text-[var(--slot4-muted-text)]'
                          }`}
                        >
                          {item.description}
                        </p>
                      </button>
                    )
                  })}
                </div>
              </div>
            </EditableReveal>

            <EditableReveal index={1}>
              <form onSubmit={submit} className={`${dc.surface.feature} p-8`}>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--slot4-accent)]">
                      Keep a new {activeLabel}
                    </p>
                    <h2 className="editable-display mt-3 text-[24px] font-medium tracking-[-0.02em]">
                      {pagesContent.create.formTitle}
                    </h2>
                  </div>
                  <span className="rounded-full border border-[var(--editable-border-soft)] bg-[var(--slot4-warm)] px-3.5 py-1.5 text-[11px] font-medium text-[var(--slot4-muted-text)]">
                    {session.name}
                  </span>
                </div>

                <div className="mt-8 grid gap-4">
                  <FieldLabel label="Title">
                    <input
                      className={fieldClass}
                      value={title}
                      onChange={(event) => setTitle(event.target.value)}
                      placeholder="Give this find a name curators will remember"
                      required
                    />
                  </FieldLabel>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FieldLabel label="Shelf">
                      <div className="relative">
                        <Layers className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--slot4-accent)]" />
                        <input
                          className={`${fieldClass} pl-11`}
                          value={category}
                          onChange={(event) => setCategory(event.target.value)}
                          placeholder="Which shelf does it live on?"
                        />
                      </div>
                    </FieldLabel>
                    <FieldLabel label="Resource URL">
                      <div className="relative">
                        <Globe2 className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--slot4-accent)]" />
                        <input
                          className={`${fieldClass} pl-11`}
                          value={url}
                          onChange={(event) => setUrl(event.target.value)}
                          placeholder="https://…"
                        />
                      </div>
                    </FieldLabel>
                  </div>
                  <FieldLabel label="Featured image URL">
                    <input
                      className={fieldClass}
                      value={image}
                      onChange={(event) => setImage(event.target.value)}
                      placeholder="Optional — cover image that anchors the card"
                    />
                  </FieldLabel>
                  <FieldLabel label="One-line brief">
                    <textarea
                      className={`${fieldClass} min-h-24 resize-y`}
                      value={summary}
                      onChange={(event) => setSummary(event.target.value)}
                      placeholder="What would you tell a friend before they open the link?"
                      required
                    />
                  </FieldLabel>
                  <FieldLabel label="The full brief">
                    <textarea
                      className={`${fieldClass} min-h-48 resize-y`}
                      value={body}
                      onChange={(event) => setBody(event.target.value)}
                      placeholder="Add context, notes, and why it earned the shelf."
                      required
                    />
                  </FieldLabel>
                </div>

                {created ? (
                  <div className="mt-6 flex items-start gap-3 rounded-[var(--editable-radius-md)] border border-[color-mix(in_oklab,var(--slot4-verified)_40%,var(--slot4-warm))] bg-[color-mix(in_oklab,var(--slot4-verified)_10%,var(--slot4-warm))] p-4 text-[14px] leading-[1.55] text-[var(--slot4-page-text)]">
                    <CheckCircle2 className="mt-[3px] h-4 w-4 shrink-0 text-[var(--slot4-verified)]" />
                    <div>
                      <p className="font-medium">{pagesContent.create.successTitle}</p>
                      <p className="mt-1 text-[var(--slot4-muted-text)]">
                        &ldquo;{created.title}&rdquo; kept locally — a curator will review it shortly.
                      </p>
                    </div>
                  </div>
                ) : null}

                <button
                  type="submit"
                  className={`${dc.button.primary} mt-8 w-full justify-center`}
                >
                  <Send className="h-4 w-4" /> {pagesContent.create.submitLabel}
                </button>

                <p className="mt-4 flex items-center gap-1.5 text-[12px] text-[var(--slot4-soft-muted-text)]">
                  <ArrowUpRight className="h-3 w-3" /> Drafts stay in your browser until a curator picks them up.
                </p>
              </form>
            </EditableReveal>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}

function FieldLabel({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2 text-[12px] font-medium uppercase tracking-[0.18em] text-[var(--slot4-muted-text)]">
      {label}
      {children}
    </label>
  )
}
