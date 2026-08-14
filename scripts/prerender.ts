import { createServer } from "vite"
import { mkdir, readFile, writeFile } from "node:fs/promises"
import { resolve, dirname } from "node:path"

/**
 * Static Site Generation step.
 *
 * 1. `vite build` produces the client bundle in dist/ (hashed CSS/JS assets).
 * 2. This script loads the app through Vite's SSR module graph and renders
 *    every registered route to static HTML.
 * 3. It preserves Vite's hashed asset tags from the built index.html and
 *    injects a complete SEO head (title, meta, canonical, OG, JSON-LD) plus
 *    the pre-rendered body.
 * 4. Each route becomes dist/<path>/index.html, served by Vercel.
 */

function extractAssets(template: string): {
  headLinks: string
  bodyScripts: string
  rootMarker: string
} {
  const styleLinks = template.match(/<link rel="stylesheet"[^>]*>/g) ?? []
  const modulepreloads = template.match(/<link rel="modulepreload"[^>]*>/g) ?? []
  const scripts = template.match(/<script[^>]*><\/script>|<script[^>]*>[\s\S]*?<\/script>/g) ?? []
  const rootMatch = template.match(/<div id="root"><\/div>|<div id="root"[\s\S]*?<\/div>/)

  return {
    headLinks: [...styleLinks, ...modulepreloads].join("\n    "),
    bodyScripts: scripts.join("\n    "),
    rootMarker: rootMatch?.[0] ?? '<div id="root"></div>',
  }
}

function buildDocument(
  head: string,
  body: string,
  assets: { headLinks: string; bodyScripts: string },
): string {
  return `<!doctype html>
<html lang="en-IN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <!-- Google Analytics (GA4) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-2CT0YQ1VHW"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-2CT0YQ1VHW');
    </script>
    <!-- Favicons & Google Search Icon -->
    <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    <link rel="shortcut icon" href="/favicon.ico" />
    <link rel="manifest" href="/manifest.json" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    ${head}
    ${assets.headLinks}
  </head>
  <body>
    <div id="root">${body}</div>
    ${assets.bodyScripts}
  </body>
</html>`
}

async function main() {
  const root = resolve(process.cwd())
  const outDir = resolve(root, "dist")

  const template = await readFile(resolve(outDir, "index.html"), "utf8")
  const assets = extractAssets(template)

  const server = await createServer({
    root,
    server: { middlewareMode: true },
    appType: "custom",
    logLevel: "error",
  })

  try {
    const [{ staticRoutes }, { headForRoute }, { renderRoute }] =
      await Promise.all([
        server.ssrLoadModule("/src/app/static-routes.ts"),
        server.ssrLoadModule("/src/app/prerender-head.ts"),
        server.ssrLoadModule("/src/app/prerender.tsx"),
      ])

    console.log(`[prerender] rendering ${staticRoutes.length} routes…`)

    for (const route of staticRoutes) {
      const path = route.path.replace(/^\//, "")
      const head = headForRoute(route)
      const body = renderRoute(route.path)
      const html = buildDocument(head, body, assets)

      const filePath = resolve(outDir, path, "index.html")
      await mkdir(dirname(filePath), { recursive: true })
      await writeFile(filePath, html, "utf8")
      console.log(`[prerender] ✓ ${route.path}`)
    }

    console.log("[prerender] done.")
  } finally {
    await server.close()
  }
}

main().catch((err) => {
  console.error("[prerender] failed:", err)
  process.exit(1)
})