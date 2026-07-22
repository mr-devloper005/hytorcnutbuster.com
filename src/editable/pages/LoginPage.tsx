import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, BookOpen, Sparkles } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { EditableLocalLoginForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/login',
    title: 'Sign in',
    description: pagesContent.auth.login.metadataDescription,
  })
}

export default function LoginPage() {
  return (
    <EditableSiteShell>
      <main className="bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section
          className={`${dc.shell.section} grid min-h-[calc(100vh-12rem)] items-center gap-16 py-[clamp(64px,10vw,120px)] lg:grid-cols-[1.05fr_0.95fr]`}
        >
          <EditableReveal>
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-accent)]">
              {pagesContent.auth.login.badge}
            </p>
            <h1 className="editable-display mt-6 max-w-lg text-balance text-[clamp(2.25rem,5vw,3.75rem)] font-medium leading-[1.05] tracking-[-0.03em]">
              {pagesContent.auth.login.title}
            </h1>
            <p className="mt-8 max-w-md text-[1.0625rem] leading-[1.6] text-[var(--slot4-muted-text)]">
              {pagesContent.auth.login.description}
            </p>
            <div className="mt-12 grid gap-4">
              <ProofRow icon={BookOpen} title="Your shelves, ready when you are" body="Pick up where you left the last find." />
              <ProofRow icon={Sparkles} title="Follow the curators you trust" body="Their new keeps land in your feed the moment they hit the shelf." />
            </div>
          </EditableReveal>

          <EditableReveal index={1}>
            <div className={`${dc.surface.feature} p-8 sm:p-10`}>
              <h2 className="editable-display text-[26px] font-medium tracking-[-0.02em]">
                {pagesContent.auth.login.formTitle}
              </h2>
              <EditableLocalLoginForm />
              <p className="mt-6 text-sm text-[var(--slot4-muted-text)]">
                New to the library?{' '}
                <Link
                  href="/signup"
                  className="editable-link-underline font-medium text-[var(--slot4-accent)]"
                >
                  {pagesContent.auth.login.createCta} <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </p>
            </div>
          </EditableReveal>
        </section>
      </main>
    </EditableSiteShell>
  )
}

function ProofRow({
  icon: Icon,
  title,
  body,
}: {
  icon: typeof BookOpen
  title: string
  body: string
}) {
  return (
    <div className="flex items-start gap-4 rounded-[var(--editable-radius-md)] border border-[var(--editable-border-soft)] bg-[var(--slot4-surface-bg)] p-5">
      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]">
        <Icon className="h-4 w-4" />
      </span>
      <div>
        <p className="editable-display text-[16px] font-medium tracking-[-0.02em]">{title}</p>
        <p className="mt-1 text-[14px] leading-[1.55] text-[var(--slot4-muted-text)]">{body}</p>
      </div>
    </div>
  )
}
