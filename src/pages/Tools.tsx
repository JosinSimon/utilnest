import { Link } from "react-router-dom"
import { allTools } from "@/data/registry"
import { categories } from "@/data/categories"
import { ToolCard } from "@/components/ToolCard"
import { Seo } from "@/components/seo/Seo"
import { site } from "@/data/site"
import { categoryPath } from "@/data/derive"
import { getIcon } from "@/components/icons"

export function ToolsPage() {
  return (
    <>
      <Seo
        data={{
          title: `All Tools - ${allTools.length} Free Online Tools | ${site.name}`,
          description:
            "Browse every free online tool. Calculators, converters, image tools and PDF tools — all free, fast and private.",
          canonical: `${site.url}/tools`,
          robots: "index, follow",
          og: {
            type: "website",
            title: `All Tools | ${site.name}`,
            description: "Browse every free online tool.",
            image: `${site.url}/og/tools.png`,
            url: `${site.url}/tools`,
          },
        }}
      />

      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="py-10">
          <h1 className="text-3xl font-semibold tracking-tight">
            All tools
          </h1>
          <p className="mt-2 text-muted-foreground">
            {allTools.length} free online tools, organised by category.
          </p>
        </div>

        {categories.map((cat) => {
          const tools = allTools.filter((t) => t.category === cat.slug)
          if (tools.length === 0) return null
          const Icon = getIcon(cat.icon)
          return (
            <section key={cat.slug} className="py-6">
              <Link
                to={categoryPath(cat.slug)}
                className="flex items-center gap-2 text-xl font-semibold tracking-tight hover:underline"
              >
                <span className="flex size-8 items-center justify-center rounded-lg bg-secondary text-primary">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                {cat.name}
              </Link>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {tools.map((t) => (
                  <ToolCard key={t.id} tool={t} />
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </>
  )
}