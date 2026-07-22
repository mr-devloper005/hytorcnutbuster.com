'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  ArrowUpRight,
  BookmarkPlus,
  CheckCircle2,
  Mail,
  Sparkles,
} from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { CATEGORY_OPTIONS } from '@/lib/categories'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

const COLLECTIONS = CATEGORY_OPTIONS.slice(0, 8)

const DISCOVER_LINKS = [
  { label: 'Open the Library', href: '/sbm' },
  { label: 'Search finds', href: '/search' },
  { label: 'This week&apos;s digest', href: '/sbm' },
  { label: 'Featured curators', href: '/sbm' },
]

const LIBRARY_LINKS = [
  { label: 'About the library', href: '/about' },
  { label: 'Submit a find', href: '/contact' },
  { label: 'Become a curator', href: '/signup' },
  { label: 'Curator ethos', href: '/about' },
]



export function EditableFooter() {
  const { session, logout } = useEditableLocalAuthSession()
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const year = new Date().getFullYear()
  const libraryHref = '/sbm'

  const handleSubscribe = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!email.trim()) return
    setSubscribed(true)
    setEmail('')
    window.setTimeout(() => setSubscribed(false), 4000)
  }

  return (
    <footer className="relative mt-28 overflow-hidden bg-[var(--editable-footer-bg)] text-[var(--editable-footer-text)]">
      {/* Warm decorative glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[900px] -translate-x-1/2 bg-[radial-gradient(60%_60%_at_50%_0%,color-mix(in_oklab,var(--slot4-accent)_28%,transparent),transparent_70%)] opacity-40"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, var(--editable-footer-text) 0 1px, transparent 1px 12px)',
        }}
      />

      <div className="relative mx-auto w-full max-w-[var(--editable-container)] px-5 sm:px-8 lg:px-10">
        {/* Newsletter band */}
        <section className="grid gap-10 border-b border-[color-mix(in_oklab,var(--editable-footer-text)_16%,transparent)] py-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:py-20">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-[color-mix(in_oklab,var(--editable-footer-text)_22%,transparent)] px-3 py-1.5 text-[12px] font-medium text-[color-mix(in_oklab,var(--editable-footer-text)_78%,transparent)]">
              <Sparkles className="h-3 w-3 text-[var(--slot4-accent-secondary)]" />
              Kept-fresh weekly
            </p>
            <h2 className="editable-display mt-6 max-w-xl text-balance text-[clamp(2rem,4.4vw,3.5rem)] font-medium leading-[1.05] tracking-[-0.03em]">
              A quiet note from the library, once a week.
            </h2>
            <p className="mt-6 max-w-lg text-[16px] leading-[1.6] text-[color-mix(in_oklab,var(--editable-footer-text)_70%,transparent)]">
              Five new keeps. One shelf worth opening. Zero noise. Unsubscribe with a click.
            </p>
          </div>

          <form
            onSubmit={handleSubscribe}
            className="rounded-[var(--editable-radius-lg)] border border-[color-mix(in_oklab,var(--editable-footer-text)_18%,transparent)] bg-[color-mix(in_oklab,var(--editable-footer-text)_6%,transparent)] p-6 backdrop-blur-sm"
          >
            <label className="flex items-center gap-3 rounded-full border border-[color-mix(in_oklab,var(--editable-footer-text)_20%,transparent)] bg-[color-mix(in_oklab,var(--editable-footer-text)_10%,transparent)] px-5 py-3">
              <Mail className="h-4 w-4 text-[var(--slot4-accent-secondary)]" />
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@somewhere-good.com"
                className="min-w-0 flex-1 bg-transparent text-[14px] font-medium text-[var(--editable-footer-text)] outline-none placeholder:text-[color-mix(in_oklab,var(--editable-footer-text)_50%,transparent)]"
              />
            </label>
            <button
              type="submit"
              className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[var(--slot4-accent)] px-5 text-[13px] font-medium text-[var(--slot4-on-accent)] transition duration-[var(--editable-duration-medium)] hover:-translate-y-[1px] hover:bg-[var(--slot4-accent-strong)]"
            >
              Keep me in the loop <ArrowRight className="h-4 w-4" />
            </button>
            <p
              className={`mt-3 flex items-center gap-2 text-[12px] transition duration-[var(--editable-duration-medium)] ${
                subscribed ? 'text-[color-mix(in_oklab,var(--slot4-cream)_92%,transparent)]' : 'text-[color-mix(in_oklab,var(--editable-footer-text)_56%,transparent)]'
              }`}
            >
              {subscribed ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5 text-[var(--slot4-accent-secondary)]" /> Welcome to the library. First digest lands Sunday.
                </>
              ) : (
                <>
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--slot4-accent-secondary)]" /> Curated by real curators. No trackers, no drip funnels.
                </>
              )}
            </p>
          </form>
        </section>

        {/* Sitemap band */}
        <section className="grid gap-14 py-16 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          {/* Brand column */}
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[color-mix(in_oklab,var(--editable-footer-text)_28%,transparent)] bg-transparent">
                <img src="/favicon.png?v=20260413" alt="" className="h-11 w-11 object-contain" />
              </span>
              <span className="flex flex-col">
                <span className="editable-display text-[26px] font-medium leading-none tracking-[-0.02em]">
                  {SITE_CONFIG.name}
                </span>
                <span className="mt-1.5 text-[10px] font-medium uppercase tracking-[0.24em] text-[color-mix(in_oklab,var(--editable-footer-text)_56%,transparent)]">
                  {globalContent.nav.tagline}
                </span>
              </span>
            </Link>
            <p className="mt-6 max-w-sm text-[15px] leading-[1.65] text-[color-mix(in_oklab,var(--editable-footer-text)_72%,transparent)]">
              {globalContent.footer.description}
            </p>
            <Link
              href={libraryHref}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent)] px-5 py-2.5 text-[13px] font-medium text-[var(--slot4-on-accent)] transition duration-[var(--editable-duration-medium)] hover:-translate-y-[1px] hover:bg-[var(--slot4-accent-strong)]"
            >
              <BookmarkPlus className="h-3.5 w-3.5" />
              Open the Library <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>

            {/* Social */}
           
          </div>

          <FooterColumn title={globalContent.collectionsColumn.title}>
            {COLLECTIONS.map((item) => (
              <FooterLink key={item.slug} href={`${libraryHref}?category=${item.slug}`}>
                {item.name}
              </FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title="Discover">
            {DISCOVER_LINKS.map((item) => (
              <FooterLink key={item.href + item.label} href={item.href}>
                {item.label.replace('&apos;', '’')}
              </FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title="The library">
            {LIBRARY_LINKS.map((item) => (
              <FooterLink key={item.label} href={item.href}>
                {item.label}
              </FooterLink>
            ))}
            {session ? (
              <button
                type="button"
                onClick={logout}
                className="editable-link-underline text-left text-[14px] font-medium text-[color-mix(in_oklab,var(--editable-footer-text)_78%,transparent)] transition duration-[var(--editable-duration-medium)] hover:text-[var(--editable-footer-text)]"
              >
                Sign out
              </button>
            ) : (
              <FooterLink href="/login">Sign in</FooterLink>
            )}
          </FooterColumn>
        </section>

        {/* Editorial mark band */}
        <section className="grid gap-8 border-t border-[color-mix(in_oklab,var(--editable-footer-text)_16%,transparent)] py-14 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <p className="editable-display text-balance text-[clamp(2.5rem,7vw,5rem)] font-normal italic leading-[1] tracking-[-0.03em] text-[color-mix(in_oklab,var(--editable-footer-text)_92%,transparent)]">
            Kept, not liked.
          </p>
          <div className="text-[13px] leading-[1.7] text-[color-mix(in_oklab,var(--editable-footer-text)_68%,transparent)]">
            <p>
              A hand-tended library of {SITE_CONFIG.name}. Every shelf carries the curator who
              built it — reputation moves with the resource, not the algorithm.
            </p>
          </div>
        </section>

        {/* Credit row */}
        <section className="flex flex-col gap-4 border-t border-[color-mix(in_oklab,var(--editable-footer-text)_14%,transparent)] py-7 text-[12px] text-[color-mix(in_oklab,var(--editable-footer-text)_58%,transparent)] sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-3">
            <span className="inline-flex h-2 w-2 rounded-full bg-[var(--slot4-accent-secondary)]" />
            © {year} {SITE_CONFIG.name}. {globalContent.footer.bottomNote}
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          
            <span className="hidden text-[color-mix(in_oklab,var(--editable-footer-text)_28%,transparent)] sm:inline">·</span>
            <span className="editable-display italic tracking-[-0.01em] text-[color-mix(in_oklab,var(--editable-footer-text)_74%,transparent)]">
              {globalContent.footer.tagline}
            </span>
          </div>
        </section>
      </div>
    </footer>
  )
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-[10px] font-medium uppercase tracking-[0.24em] text-[color-mix(in_oklab,var(--editable-footer-text)_56%,transparent)]">
        {title}
      </h3>
      <div className="mt-5 grid gap-3">{children}</div>
    </div>
  )
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="editable-link-underline text-[14px] font-medium text-[color-mix(in_oklab,var(--editable-footer-text)_78%,transparent)] transition duration-[var(--editable-duration-medium)] hover:text-[var(--editable-footer-text)]"
    >
      {children}
    </Link>
  )
}
