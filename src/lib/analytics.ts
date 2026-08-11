/**
 * Non-PII Event Analytics Dispatcher for UtilNest.
 * Compliant with Google Analytics (GA4), GTM, and Privacy Regulations.
 * Strictly NO PII, user inputs, passwords, or file contents are captured.
 */

export interface AnalyticsEvent {
  name: "tool_viewed" | "tool_used" | "download_file" | "copy_output" | "search_performed" | "category_viewed"
  category?: string
  toolId?: string
  action?: string
  label?: string
}

export function trackEvent({ name, category, toolId, action, label }: AnalyticsEvent): void {
  if (typeof window === "undefined") return

  try {
    // Send to Google Analytics (gtag) if present
    if (typeof (window as unknown as Record<string, unknown>).gtag === "function") {
      const gtag = (window as unknown as { gtag: (...args: unknown[]) => void }).gtag
      gtag("event", name, {
        event_category: category || "engagement",
        event_label: label || toolId,
        action: action,
      })
    }

    // Send to dataLayer for GTM if present
    if (Array.isArray((window as unknown as Record<string, unknown>).dataLayer)) {
      const dataLayer = (window as unknown as { dataLayer: unknown[] }).dataLayer
      dataLayer.push({
        event: name,
        event_category: category,
        tool_id: toolId,
        action: action,
      })
    }
  } catch {
    // Graceful silent fallback
  }
}
