import { site } from "@/data/site"
import { categories, categoryBySlug } from "@/data/categories"
import { getToolBySlug } from "@/data/registry"
import type { StaticRoute } from "./static-routes"
import {
  toolSeoData,
  categorySeoData,
  websiteJsonLd,
  organizationJsonLd,
} from "@/components/seo/seo-data"
import { headHtml } from "@/components/seo/headHtml"

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
          title: `${site.name} - ${site.tagline} | ${categories.length} Tool Categories`,
          description: site.description,
          canonical: site.url,
          robots: "index, follow",
          keywords: ["free online tools", "online calculator", "tools"],
          og: {
            type: "website",
            title: site.name,
            description: site.description,
            image: `${site.url}/og/home.png`,
            url: site.url,
          },
        },
        [websiteJsonLd(), organizationJsonLd()],
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
          image: `${site.url}/og/tools.png`,
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
          image: `${site.url}/og/search.png`,
          url: `${site.url}/search`,
        },
      })

    case "category": {
      const category = route.categorySlug ? categoryBySlug(route.categorySlug) : undefined
      if (!category) return headJsonLdOnly(route)
      const data = categorySeoData(category)
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
    "/about": { title: `About | ${site.name}`, desc: "Learn about our free online tools platform." },
    "/privacy": { title: `Privacy Policy | ${site.name}`, desc: "How we protect your privacy." },
    "/terms": { title: `Terms of Use | ${site.name}`, desc: "Terms for using our tools." },
    "/contact": { title: `Contact | ${site.name}`, desc: "Get in touch with us." },
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
      image: `${site.url}/og/about.png`,
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
      image: `${site.url}/og/about.png`,
      url: `${site.url}${route.path}`,
    },
  })
}

function headJsonLdOnly(_route: StaticRoute): string {
  return headJsonOnly(_route)
}