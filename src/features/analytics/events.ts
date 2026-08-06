declare global {
  interface Window {
    dataLayer: unknown[]
    clarity: (method: string, ...args: unknown[]) => void
    gtag: (method: string, ...args: unknown[]) => void
  }
}

export interface TrackEvent {
  name: string
  props?: Record<string, unknown>
}

/**
 * Lightweight event bus. Pushes to GTM/GA4 dataLayer and Clarity when present.
 * Fails silently if analytics are not configured — analytics must never
 * block or break the app.
 */
export function track({ name, props = {} }: TrackEvent): void {
  const win = typeof window === "undefined" ? undefined : window
  if (!win) return

  const event = {
    event: name,
    ...props,
  }

  try {
    win.dataLayer?.push(event)
  } catch {
    /* noop */
  }

  try {
    win.clarity?.("event", name)
  } catch {
    /* noop */
  }
}

export function trackToolViewed(toolId: string): void {
  track({ name: "tool_viewed", props: { toolId } })
}

export function trackDownload(toolId: string, bytes: number): void {
  track({ name: "download", props: { toolId, bytes } })
}