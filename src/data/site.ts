export const SITE_URL = "https://utilnest.in"

export const site = {
  name: "UtilNest",
  domain: "utilnest.in",
  url: SITE_URL,
  tagline: "Free online tools that run in your browser",
  description:
    "Free everyday online tools and utilities for students, professionals, and businesses. Calculators, converters, PDF tools, image resizers, GST invoices, and more. 100% private, fast, and local.",
  locale: "en_IN",
  defaultLanguage: "en-IN",
  trustLine: "Your files never leave your device.",
  noIndex: false,
  // Analytics — replace with your GA4 / GTM / Clarity IDs.
  gtmId: "",
  gaId: "",
  clarityId: "",
  legalEmail: "support@utilnest.in",
} as const

export const toolPrefix = "Free Online" as const
export const domain = new URL(SITE_URL).hostname