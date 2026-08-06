import { Navigate, useParams } from "react-router-dom"
import { categoryBySlug } from "@/data/categories"
import { getToolsByCategory, getPopularTools } from "@/data/registry"
import { ToolCard } from "@/components/ToolCard"
import { Breadcrumbs } from "@/components/Breadcrumbs"
import { Seo } from "@/components/seo/Seo"
import { categorySeoData, breadcrumbJsonLd } from "@/components/seo/seo-data"
import { categoryBreadcrumbs } from "@/data/derive"

export function CategoryPage() {
  const { categorySlug } = useParams<{ categorySlug: string }>()
  const category = categorySlug ? categoryBySlug(categorySlug) : undefined

  if (!category) return <Navigate to="/404" replace />

  const tools = getToolsByCategory(category.slug)
  const popular = getPopularTools(4)
  const breadcrumbs = categoryBreadcrumbs(category.name)

  return (
    <>
      <Seo
        data={{
          ...categorySeoData(category),
          jsonLd: breadcrumbJsonLd(
            breadcrumbs.map((b) => ({ label: b.label, url: `https://toolsonway.in${b.href}` })),
          ),
        }}
      />

      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          <Breadcrumbs items={breadcrumbs} />
        </div>

        <header className="mt-3 max-w-3xl">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {category.name} Tools
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            {category.description}
          </p>
        </header>

        <section className="mt-10">
          {tools.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {tools.map((t) => (
                <ToolCard key={t.id} tool={t} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed bg-card p-10 text-center">
              <p className="font-medium">Tools coming soon</p>
              <p className="mt-1 text-sm text-muted-foreground">
                We're building {category.name} tools right now.
              </p>
            </div>
          )}
        </section>

        <section className="mt-14">
          <h2 className="text-xl font-semibold tracking-tight">Popular tools</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {popular.map((t) => (
              <ToolCard key={t.id} tool={t} />
            ))}
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-xl font-semibold tracking-tight">
            About {category.name.toLowerCase()} tools
          </h2>
          <div className="mt-3 max-w-3xl space-y-3 text-muted-foreground">
            <p>
              All {category.name.toLowerCase()} tools on this site are free, run
              instantly in your browser, and never upload your data. Whether
              you're a student, professional or business owner, you can rely on
              accurate results with no sign-up required.
            </p>
          </div>
        </section>
      </div>
    </>
  )
}