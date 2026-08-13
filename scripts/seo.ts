import { mkdir, writeFile } from "node:fs/promises"
import { resolve } from "node:path"
import { createServer } from "vite"

/** Generates robots.txt + sitemap.xml from the registry into dist/. */
async function main() {
  const root = resolve(process.cwd())
  const outDir = resolve(root, "dist")
  const server = await createServer({
    root,
    server: { middlewareMode: true },
    appType: "custom",
    logLevel: "error",
  })

  try {
    const { sitemapRoutes } = await server.ssrLoadModule("/src/app/static-routes.ts")
    const { site } = await server.ssrLoadModule("/src/data/site.ts")
    const { getToolBySlug } = await server.ssrLoadModule("/src/data/registry.ts")

    const todayIso = new Date().toISOString().split("T")[0]

    const lastmodForRoute = (r: { kind: string; toolSlug?: string }) => {
      if (r.kind === "tool" && r.toolSlug) {
        const tool = getToolBySlug(r.toolSlug)
        return tool?.lastUpdated ?? todayIso
      }
      return todayIso
    }

    const metaForRoute = (kind: string): { changefreq: string; priority: string } => {
      switch (kind) {
        case "home": return { changefreq: "daily", priority: "1.0" }
        case "tools": return { changefreq: "weekly", priority: "0.9" }
        case "category": return { changefreq: "weekly", priority: "0.8" }
        case "tool": return { changefreq: "monthly", priority: "0.7" }
        case "legal": return { changefreq: "yearly", priority: "0.3" }
        default: return { changefreq: "monthly", priority: "0.5" }
      }
    }

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapRoutes
  .map(
    (r: { path: string; kind: string; toolSlug?: string }) => {
      const meta = metaForRoute(r.kind)
      return `  <url>
    <loc>${site.url}${r.path === "/" ? "" : r.path}</loc>
    <lastmod>${lastmodForRoute(r)}</lastmod>
    <changefreq>${meta.changefreq}</changefreq>
    <priority>${meta.priority}</priority>
  </url>`
    },
  )
  .join("\n")}
</urlset>`

    const robots = `User-agent: *
Allow: /
Disallow: /search

User-agent: GPTBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: CCBot
Disallow: /

Sitemap: ${site.url}/sitemap.xml
`

    await mkdir(outDir, { recursive: true })
    await writeFile(resolve(outDir, "sitemap.xml"), sitemap, "utf8")
    await writeFile(resolve(outDir, "robots.txt"), robots, "utf8")
    console.log("[seo] sitemap.xml + robots.txt written")
  } finally {
    await server.close()
  }
}

main().catch((err) => {
  console.error("[seo] failed:", err)
  process.exit(1)
})