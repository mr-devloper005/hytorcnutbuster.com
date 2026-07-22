// ✏️ EDITABLE — theme the ads to match this site. Devs own this file.
// You control the LOOK here (radius, border, shadow, background, label color).
// You CANNOT change the ad's shape/fit from here — that stays locked in
// src/lib/ad-slots.ts, so the ad always displays correctly no matter what.

import type { AdSkin } from '@/lib/ads/ad-frame'

// Site-wide default skin — tuned to the warm editorial palette.
export const adSkin: AdSkin = {
  radius: '20px',
  border: '1px solid #e9d1be',
  shadow: '0 12px 40px -18px rgba(33,12,0,0.18)',
  background: '#fffdf7',
  labelClassName: 'bg-[#a63a00] text-[#fff7e5]',
}

// Per-slot overrides — only where the surface calls for a different treatment.
export const adSkinBySlot: Partial<Record<string, AdSkin>> = {
  sidebar: {
    radius: '16px',
    shadow: '0 8px 24px -14px rgba(33,12,0,0.14)',
    border: '1px solid #f1dfc9',
    background: '#faf7ed',
  },
  header: { radius: '24px', background: '#faf7ed' },
  'in-feed': { radius: '20px', background: '#fffdf7' },
  footer: { radius: '20px', background: '#faf7ed' },
  rail: { radius: '18px' },
  feature: { radius: '24px' },
  popup: { radius: '28px' },
  interstitial: { radius: '24px', shadow: '0 24px 60px rgba(0,0,0,0.45)' },
  anchor: { radius: '14px', shadow: '0 12px 30px rgba(33,12,0,0.22)' },
}

/** Merge site default + per-slot override for a slot. */
export function skinFor(slot: string): AdSkin {
  return { ...adSkin, ...(adSkinBySlot[slot] ?? {}) }
}
