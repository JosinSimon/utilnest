export const SITE_URL = "https://toolsonway.in"

export const site = {
  name: "ToolsOnway",
  domain: "toolsonway.in",
  url: SITE_URL,
  tagline: "Free online tools that run in your browser",
  description:
    "Hundreds of free online utilities for students, professionals and businesses. Calculators, converters, image tools, PDF tools and more. Your files never leave your device.",
  locale: "en_IN",
  defaultLanguage: "en-IN",
  trustLine: "Your files never leave your device.",
  noIndex: false,
  // Analytics — replace with your GA4 / GTM / Clarity IDs.
  gtmId: "",
  gaId: "",
  clarityId: "",
  legalEmail: "support@toolsonway.in",
} as const

export const toolPrefix = "Free Online" as const
export const domain = new URL(SITE_URL).hostname