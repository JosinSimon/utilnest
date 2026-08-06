import { Link } from "react-router-dom"
import { Seo } from "@/components/seo/Seo"
import { site } from "@/data/site"
import { getPopularTools } from "@/data/registry"
import { ToolCard } from "@/components/ToolCard"

export function NotFoundPage() {
  const popular = getPopularTools(4)
  return (
    <>
      <Seo
        data={{
          title: `Page not found | ${site.name}`,
          description: "The page you're looking for doesn't exist.",
          canonical: `${site.url}/404`,
          robots: "noindex, nofollow",
          og: {
            type: "website",
            title: "Page not found",
            description: "The page you're looking for doesn't exist.",
            image: `${site.url}/og/404.png`,
            url: `${site.url}/404`,
          },
        }}
      />
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center px-4 py-24 text-center sm:px-6">
        <p className="text-6xl font-semibold text-muted-foreground/40">404</p>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight">
          This page doesn't exist
        </h1>
        <p className="mt-2 max-w-md text-muted-foreground">
          The link may be broken, or the tool may have moved. Try searching for
          what you need.
        </p>
        <div className="mt-6 flex gap-3">
          <Link
            to="/"
            className="inline-flex h-10 items-center rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground"
          >
            Go home
          </Link>
          <Link
            to="/tools"
            className="inline-flex h-10 items-center rounded-lg border bg-card px-5 text-sm font-medium hover:bg-accent"
          >
            Browse all tools
          </Link>
        </div>
        {popular.length > 0 && (
          <div className="mt-12 w-full max-w-2xl">
            <p className="text-sm font-medium text-muted-foreground">
              Popular tools
            </p>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              {popular.map((t) => (
                <ToolCard key={t.id} tool={t} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}