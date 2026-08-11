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

    const todayIso = new Date().toISOString().split("T")[0]

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapRoutes
  .map(
    (r) => `  <url>
    <loc>${site.url}${r.path === "/" ? "" : r.path}</loc>
    <lastmod>${todayIso}</lastmod>
  </url>`,
  )
  .join("\n")}
</urlset>`

    const robots = `User-agent: *
Allow: /
Disallow: /search

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