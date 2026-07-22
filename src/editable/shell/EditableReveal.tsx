'use client'

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

type Props = {
  children: ReactNode
  index?: number
  delay?: number
  className?: string
  as?: 'div' | 'section' | 'article' | 'aside' | 'header' | 'footer'
  style?: CSSProperties
  once?: boolean
}

/*
  Fade + slide + soft blur reveal used across every editable page.

  - The hidden state is only applied after mount so JS-disabled and reduced-
    motion users still see full content immediately.
  - `index` produces a stagger that composes cleanly inside grids and lists.
  - Reduced motion is honoured via the `editable-reveal` CSS rules.
*/
export function EditableReveal({
  children,
  index = 0,
  delay,
  className = '',
  as = 'div',
  style,
  once = true,
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [hydrated, setHydrated] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setHydrated(true)
    const node = ref.current
    if (!node) return
    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setVisible(true)
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true)
            if (once) observer.disconnect()
          } else if (!once) {
            setVisible(false)
          }
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.08 }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [once])

  const Tag = as as 'div'
  const effectiveDelay = typeof delay === 'number' ? delay : Math.min(index, 10) * 90
  const merged: CSSProperties = {
    ...style,
    // Kept as CSS var for the animation delay
    ['--editable-reveal-delay' as string]: `${effectiveDelay}ms`,
  }

  const classes = [
    'editable-reveal',
    hydrated ? 'is-hydrated' : '',
    visible ? 'is-visible' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <Tag ref={ref as never} className={classes} style={merged}>
      {children}
    </Tag>
  )
}
