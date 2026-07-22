'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  ArrowUpRight,
  BookmarkPlus,
  ChevronDown,
  Menu,
  Search,
  Sparkles,
  X,
} from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { CATEGORY_OPTIONS } from '@/lib/categories'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

const staticLinks = globalContent.nav.primaryLinks
const FEATURED_SHELVES = CATEGORY_OPTIONS.slice(0, 6)

export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [shelvesOpen, setShelvesOpen] = useState(false)
  const [progress, setProgress] = useState(0)
  const pathname = usePathname()
  const { session, logout } = useEditableLocalAuthSession()

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 12)
      const doc = document.documentElement
      const height = doc.scrollHeight - window.innerHeight
      setProgress(height > 0 ? Math.min(100, Math.max(0, (y / height) * 100)) : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close any mobile / mega panels when navigating.
  useEffect(() => {
    setOpen(false)
    setShelvesOpen(false)
  }, [pathname])

  return (
    <header
      className={`sticky top-0 z-50 transition-[background,box-shadow,border-color] duration-[var(--editable-duration-medium)] ${
        scrolled
          ? 'border-b border-[var(--editable-border)] bg-[color-mix(in_oklab,var(--slot4-page-bg)_92%,transparent)] shadow-[0_8px_28px_-24px_rgba(33,12,0,0.28)] backdrop-blur-md'
          : 'border-b border-transparent bg-[color-mix(in_oklab,var(--slot4-page-bg)_82%,transparent)] backdrop-blur-md'
      }`}
    >
      {/* Announcement band */}
      <div className="hidden bg-[var(--slot4-dark-bg)] text-[var(--slot4-dark-text)] md:block">
        <div className="mx-auto flex h-9 w-full max-w-[var(--editable-container)] items-center justify-between gap-4 px-5 text-[12px] sm:px-8 lg:px-10">
          <p className="flex items-center gap-2 text-[color-mix(in_oklab,var(--slot4-dark-text)_86%,transparent)]">
            <Sparkles className="h-3.5 w-3.5 text-[var(--slot4-accent-secondary)]" />
            <span className="font-medium">This week&apos;s find:</span>
            <span className="text-[color-mix(in_oklab,var(--slot4-dark-text)_66%,transparent)]">
              Editorial calendar templates the whole library is keeping.
            </span>
          </p>
          <div className="flex items-center gap-5">
            <Link
              href="/sbm"
              className="editable-link-underline font-medium text-[color-mix(in_oklab,var(--slot4-dark-text)_92%,transparent)] hover:text-[var(--slot4-dark-text)]"
            >
              Open the Library
              <ArrowUpRight className="ml-1 inline h-3 w-3" />
            </Link>
            <Link
              href="/contact"
              className="editable-link-underline font-medium text-[color-mix(in_oklab,var(--slot4-dark-text)_70%,transparent)] hover:text-[var(--slot4-dark-text)]"
            >
              Submit a find
            </Link>
          </div>
        </div>
      </div>

      {/* Main navigation row */}
      <nav
        className={`mx-auto flex w-full max-w-[var(--editable-container)] items-center gap-6 px-5 transition-[min-height] duration-[var(--editable-duration-medium)] sm:px-8 lg:px-10 ${
          scrolled ? 'min-h-[68px]' : 'min-h-[84px]'
        }`}
      >
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-3"
          aria-label={`${SITE_CONFIG.name} home`}
        >
          <span className="relative flex h-11 w-11 items-center justify-center rounded-full border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] transition duration-[var(--editable-duration-medium)] group-hover:border-[var(--slot4-accent)]">
            <img src="/favicon.png?v=20260413" alt="" className="h-11 w-11 object-contain" />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -inset-1 rounded-full border border-[var(--slot4-accent)]/0 transition duration-[var(--editable-duration-slow)] group-hover:border-[var(--slot4-accent)]/25"
            />
          </span>
          <span className="hidden min-w-0 flex-col sm:flex">
            <span className="editable-display text-[19px] font-medium leading-none tracking-[-0.02em] text-[var(--slot4-page-text)]">
              {SITE_CONFIG.name}
            </span>
            <span className="mt-1.5 text-[10px] font-medium uppercase tracking-[0.24em] text-[var(--slot4-soft-muted-text)]">
              {globalContent.nav.tagline}
            </span>
          </span>
        </Link>

        <div className="ml-8 hidden items-center gap-1 md:flex">
          <MegaShelves
            open={shelvesOpen}
            onToggle={() => setShelvesOpen((value) => !value)}
            onClose={() => setShelvesOpen(false)}
          />
          {staticLinks.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`editable-link-underline rounded-full px-3 py-1.5 text-[14px] font-medium tracking-[-0.01em] transition duration-[var(--editable-duration-medium)] ${
                  active
                    ? 'text-[var(--slot4-accent)]'
                    : 'text-[var(--slot4-page-text)] hover:text-[var(--slot4-accent)]'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2.5">
          <Link
            href="/search"
            aria-label="Search the library"
            className="group inline-flex h-10 items-center gap-2 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-4 text-[13px] font-medium text-[var(--slot4-soft-muted-text)] transition duration-[var(--editable-duration-medium)] hover:-translate-y-[1px] hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)] sm:pr-14"
          >
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Search shelves</span>
            <span className="ml-2 hidden shrink-0 rounded-full border border-[var(--editable-border)] px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] group-hover:border-[var(--slot4-accent)]/40 sm:inline">
              /
            </span>
          </Link>

          {session ? (
            <div className="hidden items-center gap-2 sm:flex">
              <span className="inline-flex h-10 items-center gap-2 rounded-full border border-[var(--editable-border-soft)] bg-[var(--slot4-warm)] pl-1.5 pr-4 text-[13px] font-medium text-[var(--slot4-page-text)]">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--slot4-accent-soft)] text-[11px] font-semibold uppercase text-[var(--slot4-accent)]">
                  {session.name?.[0] || 'C'}
                </span>
                <span className="max-w-[110px] truncate">{session.name}</span>
              </span>
              <button
                type="button"
                onClick={logout}
                className="inline-flex h-10 items-center rounded-full border border-[var(--editable-border)] px-4 text-[13px] font-medium text-[var(--slot4-page-text)] transition duration-[var(--editable-duration-medium)] hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)]"
              >
                Sign out
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden h-10 items-center rounded-full border border-[var(--editable-border)] px-4 text-[13px] font-medium text-[var(--slot4-page-text)] transition duration-[var(--editable-duration-medium)] hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)] sm:inline-flex"
            >
              Sign in
            </Link>
          )}

          <Link
            href={session ? '/create' : '/signup'}
            className="hidden h-10 items-center gap-1.5 rounded-full bg-[var(--editable-cta-bg)] px-5 text-[13px] font-medium text-[var(--editable-cta-text)] shadow-[0_10px_28px_-14px_rgba(33,12,0,0.6)] transition duration-[var(--editable-duration-medium)] hover:-translate-y-[1px] hover:bg-[var(--slot4-accent)] sm:inline-flex"
          >
            <BookmarkPlus className="h-3.5 w-3.5" />
            {session ? 'Curate a find' : 'Become a curator'}
          </Link>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-label="Toggle menu"
            aria-expanded={open}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] transition duration-[var(--editable-duration-medium)] hover:border-[var(--slot4-accent)] md:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {/* Reading-progress hairline */}
      <div
        aria-hidden="true"
        className="pointer-events-none h-[2px] w-full origin-left bg-[linear-gradient(90deg,var(--slot4-accent)_0%,var(--slot4-accent-secondary)_60%,transparent_100%)] transition-transform duration-150 ease-linear"
        style={{ transform: `scaleX(${progress / 100})` }}
      />

      {/* Mobile panel */}
      <div
        className={`grid overflow-hidden border-t border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] transition-[grid-template-rows] duration-[var(--editable-duration-medium)] md:hidden ${
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="min-h-0">
          <div className="grid gap-2 px-5 py-6">
            <Link
              href="/sbm"
              className="flex items-center justify-between rounded-2xl bg-[var(--slot4-page-text)] px-4 py-3.5 text-[15px] font-medium text-[var(--slot4-cream)]"
            >
              <span className="flex items-center gap-2">
                <BookmarkPlus className="h-4 w-4" /> Open the Library
              </span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            {staticLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-2xl px-4 py-3 text-[15px] font-medium text-[var(--slot4-page-text)] transition duration-[var(--editable-duration-medium)] hover:bg-[var(--slot4-warm)]"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/search"
              className="flex items-center gap-2 rounded-2xl px-4 py-3 text-[15px] font-medium text-[var(--slot4-page-text)] hover:bg-[var(--slot4-warm)]"
            >
              <Search className="h-4 w-4 text-[var(--slot4-accent)]" /> Search shelves
            </Link>
          </div>
          <div className="border-t border-[var(--editable-border)] px-5 py-4">
            <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-[var(--slot4-soft-muted-text)]">
              Featured shelves
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {FEATURED_SHELVES.map((shelf) => (
                <Link
                  key={shelf.slug}
                  href={`/sbm?category=${shelf.slug}`}
                  className="rounded-full border border-[var(--editable-border)] px-3 py-1 text-[12px] font-medium text-[var(--slot4-muted-text)]"
                >
                  {shelf.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="grid gap-2 border-t border-[var(--editable-border)] bg-[var(--slot4-warm)] px-5 py-5">
            {session ? (
              <>
                <Link
                  href="/create"
                  className="rounded-2xl bg-[var(--editable-cta-bg)] px-4 py-3 text-center text-[15px] font-medium text-[var(--editable-cta-text)]"
                >
                  Curate a find
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="rounded-2xl border border-[var(--editable-border)] px-4 py-3 text-left text-[15px] font-medium"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/signup"
                  className="rounded-2xl bg-[var(--editable-cta-bg)] px-4 py-3 text-center text-[15px] font-medium text-[var(--editable-cta-text)]"
                >
                  Become a curator
                </Link>
                <Link
                  href="/login"
                  className="rounded-2xl border border-[var(--editable-border)] px-4 py-3 text-[15px] font-medium"
                >
                  Sign in
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

function MegaShelves({
  open,
  onToggle,
  onClose,
}: {
  open: boolean
  onToggle: () => void
  onClose: () => void
}) {
  return (
    <div
      className="relative"
      onMouseEnter={() => (open ? null : onToggle())}
      onMouseLeave={onClose}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className={`editable-link-underline inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[14px] font-medium tracking-[-0.01em] transition duration-[var(--editable-duration-medium)] ${
          open ? 'text-[var(--slot4-accent)]' : 'text-[var(--slot4-page-text)] hover:text-[var(--slot4-accent)]'
        }`}
      >
        Library
        <ChevronDown className={`h-3.5 w-3.5 transition duration-[var(--editable-duration-medium)] ${open ? 'rotate-180' : ''}`} />
      </button>

      <div
        className={`absolute left-0 top-full pt-3 transition-[opacity,transform] duration-[var(--editable-duration-medium)] ${
          open
            ? 'pointer-events-auto translate-y-0 opacity-100'
            : 'pointer-events-none -translate-y-1 opacity-0'
        }`}
      >
        <div className="w-[520px] overflow-hidden rounded-[var(--editable-radius-lg)] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] shadow-[0_28px_60px_-24px_rgba(33,12,0,0.28)]">
          <div className="grid grid-cols-2 gap-8 p-6">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-[var(--slot4-accent)]">
                Shelves
              </p>
              <div className="mt-4 grid gap-2.5">
                {FEATURED_SHELVES.map((shelf) => (
                  <Link
                    key={shelf.slug}
                    href={`/sbm?category=${shelf.slug}`}
                    onClick={onClose}
                    className="group flex items-center justify-between text-[14px] font-medium text-[var(--slot4-page-text)] transition duration-[var(--editable-duration-medium)] hover:text-[var(--slot4-accent)]"
                  >
                    <span>{shelf.name}</span>
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition duration-[var(--editable-duration-medium)] group-hover:opacity-100" />
                  </Link>
                ))}
              </div>
            </div>
            <div className="rounded-[var(--editable-radius-md)] bg-[var(--slot4-warm)] p-5">
              <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-[var(--slot4-accent)]">
                Editor&apos;s keep
              </p>
              <p className="editable-display mt-4 text-[17px] font-medium leading-[1.25] tracking-[-0.02em]">
                A weekly digest of the shelves worth opening.
              </p>
              <Link
                href="/sbm"
                onClick={onClose}
                className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-[var(--slot4-page-text)] px-4 py-2 text-[12px] font-medium text-[var(--slot4-cream)] transition duration-[var(--editable-duration-medium)] hover:-translate-y-[1px] hover:bg-[var(--slot4-accent)]"
              >
                Open the Library <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
