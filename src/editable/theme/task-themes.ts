import type { CSSProperties } from 'react'
import type { TaskKey } from '@/lib/site-config'

/*
  Warm editorial task surfaces.

  Every task inherits one cohesive palette derived from the reference
  (cream surface, rust brand, olive accent, warm dividers). Only the eyebrow
  kicker and mood note vary per task. Tokens ship as `--tk-*` for downstream
  components; per-page themes never override the shell shell colors.
*/

export type TaskTheme = {
  kicker: string
  note: string
  dark: boolean
  fontDisplay: string
  fontBody: string
  bg: string
  surface: string
  raised: string
  text: string
  muted: string
  line: string
  accent: string
  accentSoft: string
  onAccent: string
  glow: string
  radius: string
}

const DISPLAY_FONT =
  "'Literata', 'Iowan Old Style', 'Georgia', 'Times New Roman', serif"
const BODY_FONT =
  "'Geist', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"

const base = {
  dark: false,
  fontDisplay: DISPLAY_FONT,
  fontBody: BODY_FONT,
  bg: '#fff7e5',
  surface: '#fffdf7',
  raised: '#faf7ed',
  text: '#110600',
  muted: '#625a53',
  line: '#e9d1be',
  accent: '#a63a00',
  accentSoft: '#fbe6d3',
  onAccent: '#fff7e5',
  glow: 'rgba(166, 58, 0, 0.10)',
  radius: '20px',
} satisfies Omit<TaskTheme, 'kicker' | 'note'>

export const taskThemes: Record<TaskKey, TaskTheme> = {
  article: { ...base, kicker: 'Field notes', note: 'Long-form reads that shape how curators think.' },
  listing: { ...base, kicker: 'Directory', note: 'Places, studios and services worth knowing about.' },
  classified: { ...base, kicker: 'Ledger', note: 'Time-boxed opportunities and open calls.' },
  image: { ...base, kicker: 'Plates', note: 'A visual journal of finds and moodboards.' },
  sbm: { ...base, kicker: 'The Library', note: 'Curated collections of links, resources and finds.' },
  pdf: { ...base, kicker: 'Papers', note: 'Downloadable guides and reference material.' },
  profile: { ...base, kicker: 'Curator', note: 'The person behind the collection.' },
}

export function getTaskTheme(task: TaskKey): TaskTheme {
  return taskThemes[task] || taskThemes.sbm
}

/** Deliver every `--tk-*` token + font overrides for a task surface. */
export function taskThemeStyle(task: TaskKey): CSSProperties {
  const t = getTaskTheme(task)
  return {
    '--tk-bg': t.bg,
    '--tk-surface': t.surface,
    '--tk-raised': t.raised,
    '--tk-text': t.text,
    '--tk-muted': t.muted,
    '--tk-line': t.line,
    '--tk-accent': t.accent,
    '--tk-accent-soft': t.accentSoft,
    '--tk-on-accent': t.onAccent,
    '--tk-glow': t.glow,
    '--tk-radius': t.radius,
    '--slot4-accent': t.accent,
    '--slot4-accent-fill': t.accent,
    '--editable-font-display': t.fontDisplay,
    '--editable-font-body': t.fontBody,
    fontFamily: t.fontBody,
  } as CSSProperties
}
