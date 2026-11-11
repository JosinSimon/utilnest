import { site } from "@/data/site"
import { categoryBySlug } from "@/data/categories"
import { getToolBySlug } from "@/data/registry"
import type { StaticRoute } from "./static-routes"
import {
  toolSeoData,
  categorySeoData,
  websiteJsonLd,
  organizationJsonLd,
  faqJsonLd,
} from "@/components/seo/seo-data"
import { headHtml } from "@/components/seo/headHtml"
import { categoryFaqs } from "@/data/category-faqs"
import { HOME_FAQ_SCHEMA } from "@/data/home-faqs"

/**
 * Returns the full <head> HTML string for a static route during pre-render.
 * This is the single source for the static document head, keeping the SEO
 * that search engines read in sync with the rendered page.
 */
export function headForRoute(route: StaticRoute): string {
  switch (route.kind) {
    case "home":
      return headHtml(
        {
          title: `${site.name} - Free Online Tools India | PDF, Image, EMI Calculator & More`,
          description: site.description,
          canonical: site.url,
          robots: "index, follow",
          keywords: ["free online tools", "online calculator", "tools"],
          og: {
            type: "website",
            title: site.name,
            description: site.description,
            image: site.defaultOgImage,
            url: site.url,
          },
        },
        [websiteJsonLd(), organizationJsonLd(), faqJsonLd(HOME_FAQ_SCHEMA)].filter(
          (x): x is Record<string, unknown> => Boolean(x),
        ),
      )

    case "tools":
      return headHtml({
        title: `Free Online Tools | ${site.name}`,
        description: "Browse every free online tool — calculators, converters, image and PDF tools.",
        canonical: `${site.url}/tools`,
        robots: "index, follow",
        og: {
          type: "website",
          title: `Free Online Tools | ${site.name}`,
          description: "Browse every free online tool.",
          image: site.defaultOgImage,
          url: `${site.url}/tools`,
        },
      })

    case "search":
      return headHtml({
        title: `Search Tools | ${site.name}`,
        description: "Search every free online tool instantly.",
        canonical: `${site.url}/search`,
        robots: "noindex, follow",
        og: {
          type: "website",
          title: `Search Tools | ${site.name}`,
          description: "Search every free online tool.",
          image: site.defaultOgImage,
          url: `${site.url}/search`,
        },
      })

    case "category": {
      const category = route.categorySlug ? categoryBySlug(route.categorySlug) : undefined
      if (!category) return headJsonLdOnly(route)
      const data = categorySeoData(category, categoryFaqs(category))
      return headHtml(data)
    }

    case "tool": {
      const tool = route.toolSlug ? getToolBySlug(route.toolSlug) : undefined
      if (!tool) return headJsonOnly(route)
      const data = toolSeoData(tool)
      return headHtml(data)
    }

    case "legal":
      return headForLegal(route.path)
  }
}

function headForLegal(path: string): string {
  const labels: Record<string, { title: string; desc: string }> = {
    "/about": {
      title: `About ${site.name} - Free, Private Online Tools for India`,
      desc: `${site.name} is a free collection of calculators, PDF, image and audio tools that run in your browser. Learn how the tools work and how we check them.`,
    },
    "/privacy": {
      title: `Privacy Policy | ${site.name}`,
      desc: `How ${site.name} handles your data: files and numbers you enter stay on your device; we use anonymous analytics and may show Google ads.`,
    },
    "/terms": {
      title: `Terms of Use | ${site.name}`,
      desc: `The terms for using ${site.name}'s free online calculators, converters, PDF, image and audio tools.`,
    },
    "/contact": {
      title: `Contact ${site.name} - Report a Bug, Request a Tool`,
      desc: `Contact ${site.name} to report a bug, request a new tool, correct an exam photo size or ask about privacy. Email ${site.legalEmail}.`,
    },
  }
  const item = labels[path] ?? labels["/about"]
  return headHtml({
    title: item.title,
    description: item.desc,
    canonical: `${site.url}${path}`,
    robots: "index, follow",
    og: {
      type: "website",
      title: item.title,
      description: item.desc,
      image: site.defaultOgImage,
      url: `${site.url}${path}`,
    },
  })
}

function headJsonOnly(route: StaticRoute): string {
  return headHtml({
    title: `${site.name}`,
    description: site.description,
    canonical: `${site.url}${route.path}`,
    robots: "noindex, nofollow",
    og: {
      type: "website",
      title: site.name,
      description: site.description,
      image: site.defaultOgImage,
      url: `${site.url}${route.path}`,
    },
  })
}

function headJsonLdOnly(_route: StaticRoute): string {
  return headJsonOnly(_route)
}