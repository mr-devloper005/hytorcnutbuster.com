import Link from 'next/link'
import { ArrowUpRight, Compass, HeartHandshake, Sparkles } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'

const principles = [
  {
    icon: Compass,
    title: 'Kept, not liked',
    body: 'Every entry earns its place because a person put it there — no ranking games, no engagement loops.',
  },
  {
    icon: HeartHandshake,
    title: 'The source is the star',
    body: 'We link outward. What matters is that the resource, the maker and the reader find each other.',
  },
  {
    icon: Sparkles,
    title: 'Small on purpose',
    body: 'Fewer places, tended more carefully. Growth means better shelves, not more of them.',
  },
]

export default function AboutPage() {
  return (
    <EditableSiteShell>
      <main className="bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className={`${dc.shell.section} pb-16 pt-[clamp(72px,10vw,140px)]`}>
          <EditableReveal>
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-accent)]">
              About {SITE_CONFIG.name}
            </p>
            <h1 className="editable-display mt-6 max-w-4xl text-balance text-[clamp(2.5rem,6vw,5rem)] font-medium leading-[1.02] tracking-[-0.03em]">
              {pagesContent.about.title}
            </h1>
            <p className="mt-8 max-w-2xl text-[1.125rem] leading-[1.55] text-[var(--slot4-muted-text)]">
              {pagesContent.about.description}
            </p>
          </EditableReveal>
        </section>

        <section className={`${dc.shell.section} pb-24`}>
          <div className="grid gap-16 lg:grid-cols-[1.15fr_0.85fr]">
            <EditableReveal>
              <article className={`${dc.surface.feature} p-8 sm:p-12`}>
                <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--slot4-accent)]">
                  The story
                </p>
                <div className="mt-8 grid gap-5 text-[16px] leading-[1.75] text-[var(--slot4-muted-text)]">
                  {pagesContent.about.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
                <Link href="/contact" className={`${dc.button.primary} mt-10`}>
                  Talk with a curator <ArrowUpRight className="h-4 w-4" />
                </Link>
              </article>
            </EditableReveal>

            <div className="grid gap-6">
              {principles.map((principle, index) => (
                <EditableReveal key={principle.title} index={index}>
                  <div className={`${dc.surface.card} p-7`}>
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]">
                      <principle.icon className="h-5 w-5" />
                    </span>
                    <h2 className="editable-display mt-6 text-[22px] font-medium leading-[1.15] tracking-[-0.02em]">
                      {principle.title}
                    </h2>
                    <p className="mt-4 text-[15px] leading-[1.65] text-[var(--slot4-muted-text)]">
                      {principle.body}
                    </p>
                  </div>
                </EditableReveal>
              ))}
            </div>
          </div>
        </section>

        <section className={`${dc.shell.section} pb-[clamp(80px,10vw,140px)]`}>
          <EditableReveal>
            <div className="grid gap-10 rounded-[var(--editable-radius-lg)] border border-[var(--editable-border)] bg-[var(--slot4-warm)] p-10 sm:p-16 lg:grid-cols-3">
              {pagesContent.about.values.map((value) => (
                <div key={value.title}>
                  <p className="editable-display text-[24px] font-medium leading-[1.2] tracking-[-0.02em]">
                    {value.title}
                  </p>
                  <p className="mt-4 text-[15px] leading-[1.65] text-[var(--slot4-muted-text)]">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </EditableReveal>
        </section>
      </main>
    </EditableSiteShell>
  )
}
