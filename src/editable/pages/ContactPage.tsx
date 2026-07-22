'use client'

import Link from 'next/link'
import { ArrowUpRight, BookmarkPlus, HeartHandshake, Mail, Sparkles } from 'lucide-react'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableContactLeadForm } from '@/editable/components/EditableContactLeadForm'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'

const lanes = [
  {
    icon: BookmarkPlus,
    title: 'Suggest a find',
    body: 'Share a link, tool or piece worth a place on the shelves. We read every submission.',
  },
  {
    icon: HeartHandshake,
    title: 'Partner on a shelf',
    body: 'Curate together, sponsor a shelf, or bring a collection you already tend into the library.',
  },
  {
    icon: Sparkles,
    title: 'Curator support',
    body: 'Need help organising your own shelves, editing an entry, or connecting an existing collection?',
  },
]

export default function ContactPage() {
  return (
    <EditableSiteShell>
      <main className="bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className={`${dc.shell.section} pb-16 pt-[clamp(72px,10vw,140px)]`}>
          <EditableReveal>
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-accent)]">
              {pagesContent.contact.eyebrow}
            </p>
            <h1 className="editable-display mt-6 max-w-4xl text-balance text-[clamp(2.25rem,5.5vw,4rem)] font-medium leading-[1.04] tracking-[-0.03em]">
              {pagesContent.contact.title}
            </h1>
            <p className="mt-8 max-w-2xl text-[1.125rem] leading-[1.55] text-[var(--slot4-muted-text)]">
              {pagesContent.contact.description}
            </p>
          </EditableReveal>
        </section>

        <section className={`${dc.shell.section} pb-[clamp(80px,10vw,140px)]`}>
          <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <div className="grid gap-4">
                {lanes.map((lane, index) => (
                  <EditableReveal key={lane.title} index={index}>
                    <div className={`${dc.surface.card} p-7`}>
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]">
                        <lane.icon className="h-4 w-4" />
                      </span>
                      <h2 className="editable-display mt-5 text-[20px] font-medium leading-[1.2] tracking-[-0.02em]">
                        {lane.title}
                      </h2>
                      <p className="mt-3 text-[14px] leading-[1.6] text-[var(--slot4-muted-text)]">
                        {lane.body}
                      </p>
                    </div>
                  </EditableReveal>
                ))}
                <EditableReveal index={lanes.length}>
                  <div className={`${dc.surface.soft} p-7`}>
                    <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--slot4-accent)]">
                      Prefer email?
                    </p>
                    <p className="editable-display mt-4 text-[20px] font-medium tracking-[-0.02em]">
                      Write to the library
                    </p>
                    <p className="mt-3 text-[14px] leading-[1.6] text-[var(--slot4-muted-text)]">
                      Every message reaches a real curator, usually within a business day.
                    </p>
                    <Link
                      href="/about"
                      className="editable-link-underline mt-5 inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--slot4-accent)]"
                    >
                      About the library <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </EditableReveal>
              </div>
            </div>

            <EditableReveal>
              <div className={`${dc.surface.feature} p-8 sm:p-12`}>
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]">
                    <Mail className="h-4 w-4" />
                  </span>
                  <h2 className="editable-display text-[24px] font-medium tracking-[-0.02em]">
                    {pagesContent.contact.formTitle}
                  </h2>
                </div>
                <EditableContactLeadForm />
              </div>
            </EditableReveal>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
