import { useMemo } from "react"
import { useSearchParams } from "react-router-dom"
import { searchTools, getPopularSearches } from "@/features/search/search-index"
import { ToolCard } from "@/components/ToolCard"
import { Seo } from "@/components/seo/Seo"
import { site } from "@/data/site"
import { CommandPalette } from "@/features/search/CommandPalette"

export function SearchPage() {
  const [params] = useSearchParams()
  const query = params.get("q") ?? ""

  const results = useMemo(() => searchTools(query, 24), [query])
  const popular = useMemo(() => getPopularSearches(6), [])

  const seoData = query
    ? {
        title: `Search results for "${query}" | ${site.name}`,
        canonical: `${site.url}/search?q=${encodeURIComponent(query)}`,
        description: `Free tools matching "${query}".`,
      }
    : {
        title: `Search Tools | ${site.name}`,
        canonical: `${site.url}/search`,
        description: "Search every free online tool.",
      }

  return (
    <>
      <Seo
        data={{
          ...seoData,
          robots: "noindex, follow",
          og: {
            type: "website",
            title: seoData.title,
            description: seoData.description,
            image: site.defaultOgImage,
            url: seoData.canonical,
          },
        }}
      />

      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="py-10">
          <h1 className="text-3xl font-semibold tracking-tight">
            {query ? `Results for "${query}"` : "Search tools"}
          </h1>

          <div className="mt-6 max-w-xl">
            <CommandPalette />
          </div>
        </div>

        {!query && (
          <section className="pb-6">
            <p className="text-sm font-medium text-muted-foreground">
              Popular searches
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {popular.map((p) => (
                <a
                  key={p}
                  href={`/search?q=${encodeURIComponent(p)}`}
                  className="rounded-full border bg-card px-3 py-1 text-sm hover:bg-accent"
                >
                  {p}
                </a>
              ))}
            </div>
          </section>
        )}

        <section className="py-6">
          {query ? (
            results.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {results.map(({ tool }) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            ) : (
              <p className="rounded-2xl border border-dashed bg-card p-10 text-center text-muted-foreground">
                No tools match "{query}". Try a different search.
              </p>
            )
          ) : (
            <p className="text-muted-foreground">
              Use the search box above or press{" "}
              <kbd className="rounded border border-border bg-secondary px-1.5 py-0.5 text-xs">
                Cmd/Ctrl + K
              </kbd>{" "}
              anywhere on the site.
            </p>
          )}
        </section>
      </div>
    </>
  )
}