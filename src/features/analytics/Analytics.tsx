import { useEffect } from "react"
import { site } from "@/data/site"

/**
 * Injects GA4, GTM and Microsoft Clarity scripts once.
 * All IDs come from site config; empty IDs are skipped.
 */
export function Analytics() {
  useEffect(() => {
    if (!site.gtmId && !site.gaId && !site.clarityId) return

    window.dataLayer = window.dataLayer || []

    if (site.gtmId) {
      const s = document.createElement("script")
      s.src = `https://www.googletagmanager.com/gtm.js?id=${site.gtmId}`
      s.async = true
      document.head.appendChild(s)
      window.dataLayer.push({ "gtm.start": new Date().getTime() })
    }

    if (site.gaId) {
      const s = document.createElement("script")
      s.async = true
      s.src = `https://www.googletagmanager.com/gtag/js?id=${site.gaId}`
      document.head.appendChild(s)
      window.gtag = window.gtag || function gtag() {
        window.dataLayer.push(arguments)
      }
      window.gtag("js", new Date())
      window.gtag("config", site.gaId)
    }

    if (site.clarityId) {
      const s = document.createElement("script")
      s.async = true
      s.src = `https://www.clarity.ms/tag/${site.clarityId}`
      document.head.appendChild(s)
    }
  }, [])

  return null
}