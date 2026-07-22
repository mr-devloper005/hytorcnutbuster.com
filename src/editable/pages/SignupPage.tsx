import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, BookmarkPlus, Users } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { EditableLocalSignupForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/signup',
    title: 'Become a curator',
    description: pagesContent.auth.signup.metadataDescription,
  })
}

export default function SignupPage() {
  return (
    <EditableSiteShell>
      <main className="bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section
          className={`${dc.shell.section} grid min-h-[calc(100vh-12rem)] items-center gap-16 py-[clamp(64px,10vw,120px)] lg:grid-cols-[0.95fr_1.05fr]`}
        >
          <EditableReveal>
            <div className={`${dc.surface.feature} p-8 sm:p-10`}>
              <h1 className="editable-display text-[26px] font-medium tracking-[-0.02em]">
                {pagesContent.auth.signup.formTitle}
              </h1>
              <EditableLocalSignupForm />
              <p className="mt-6 text-sm text-[var(--slot4-muted-text)]">
                Already keeping a shelf?{' '}
                <Link
                  href="/login"
                  className="editable-link-underline font-medium text-[var(--slot4-accent)]"
                >
                  {pagesContent.auth.signup.loginCta} <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </p>
            </div>
          </EditableReveal>

          <EditableReveal index={1}>
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-accent)]">
              {pagesContent.auth.signup.badge}
            </p>
            <h2 className="editable-display mt-6 max-w-lg text-balance text-[clamp(2.25rem,5vw,3.75rem)] font-medium leading-[1.05] tracking-[-0.03em]">
              {pagesContent.auth.signup.title}
            </h2>
            <p className="mt-8 max-w-md text-[1.0625rem] leading-[1.6] text-[var(--slot4-muted-text)]">
              {pagesContent.auth.signup.description}
            </p>
            <div className="mt-12 grid gap-4">
              <ProofRow
                icon={BookmarkPlus}
                title="Start a shelf in under a minute"
                body="Name the theme, keep the first find, invite the world to follow."
              />
              <ProofRow
                icon={Users}
                title="A community of curators, not likers"
                body="Reputation moves with what you keep — not what you click."
              />
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
  icon: typeof BookmarkPlus
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
