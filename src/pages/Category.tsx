import { Navigate, useParams } from "react-router-dom"
import { categoryBySlug } from "@/data/categories"
import { getToolsByCategory, getPopularTools } from "@/data/registry"
import { ToolCard } from "@/components/ToolCard"
import { Breadcrumbs } from "@/components/Breadcrumbs"
import { Seo } from "@/components/seo/Seo"
import { categorySeoData } from "@/components/seo/seo-data"
import { categoryBreadcrumbs } from "@/data/derive"
import { getIcon } from "@/components/icons"
import { AdSlot } from "@/components/ads/AdSlot"
import { ShieldCheck, ChevronRight } from "lucide-react"
import { categoryFaqs } from "@/data/category-faqs"
import { categorySections } from "@/data/category-sections"

function uniqueTools<T extends { id: string }>(items: T[]): T[] {
  const seen = new Set<string>()
  return items.filter((item) => {
    if (seen.has(item.id)) return false
    seen.add(item.id)
    return true
  })
}

export function CategoryPage() {
  const { categorySlug } = useParams<{ categorySlug: string }>()
  const category = categorySlug ? categoryBySlug(categorySlug) : undefined

  if (!category) return <Navigate to="/404" replace />

  const tools = getToolsByCategory(category.slug)
  const popular = getPopularTools(4)
  const breadcrumbs = categoryBreadcrumbs(category.name)
  const Icon = getIcon(category.icon)
  const sections = categorySections[category.slug]
  const toolsById = new Map(tools.map((tool) => [tool.id, tool]))

  const categoryFaqsForPage = categoryFaqs(category)

  const colorClass = category.color || "from-primary/10 to-primary/5 text-primary border-border"

  return (
    <>
      <Seo data={categorySeoData(category, categoryFaqsForPage)} />

      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          <Breadcrumbs items={breadcrumbs.map((b) => ({ label: b.label, path: b.href }))} />
        </div>

        {/* Category Hero */}
        <header className="mt-2 rounded-3xl border border-border/80 bg-gradient-to-br from-card via-muted/20 to-card p-6 sm:p-10 shadow-sm">
          <div className="flex items-center gap-4">
            <span className={`flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br border shadow-sm ${colorClass}`}>
              <Icon className="size-7" aria-hidden="true" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground bg-muted px-2.5 py-0.5 rounded-full">
                  {tools.length} {tools.length === 1 ? "Tool" : "Tools"} Available
                </span>
                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1 hidden sm:flex">
                  <ShieldCheck className="size-3.5" /> 100% Client-Side
                </span>
              </div>
              <h1 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-4xl text-foreground">
                {category.name} Tools
              </h1>
            </div>
          </div>

          <p className="mt-4 max-w-3xl text-sm sm:text-base text-muted-foreground leading-relaxed">
            {category.description}
          </p>

          {/* Preview Tags */}
          {category.previewTags && category.previewTags.length > 0 && (
            <div className="mt-5 flex flex-wrap items-center gap-1.5 pt-4 border-t border-border/50">
              <span className="text-xs font-semibold text-muted-foreground mr-1">Includes:</span>
              {category.previewTags.map((tag) => (
                <span key={tag} className="text-xs font-medium text-foreground bg-card border border-border/80 px-2.5 py-1 rounded-lg">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Responsive AdSlot */}
        <AdSlot slotType="leaderboard" className="mt-6" />

        {/* Curated Tools Sections */}
        <section className="mt-8">
          {tools.length === 0 ? (
            <div className="rounded-2xl border border-dashed bg-card p-10 text-center">
              <p className="font-medium text-foreground">Tools coming soon</p>
              <p className="mt-1 text-sm text-muted-foreground">
                We're building {category.name} tools right now.
              </p>
            </div>
          ) : sections?.length ? (
            <div className="space-y-10">
              {sections.map((section) => {
                const sectionTools = uniqueTools(
                  section.toolIds.map((id) => toolsById.get(id)).filter((tool): tool is (typeof tools)[number] => Boolean(tool)),
                )
                if (sectionTools.length === 0) return null

                return (
                  <section key={section.id} aria-labelledby={`${category.slug}-${section.id}-heading`}>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        {section.badge && (
                          <span className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                            {section.badge}
                          </span>
                        )}
                        <h2 id={`${category.slug}-${section.id}-heading`} className="mt-2 text-xl font-bold tracking-tight text-foreground">
                          {section.title}
                        </h2>
                        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                          {section.description}
                        </p>
                      </div>
                    </div>

                    <div
                      className={
                        section.layout === "featured"
                          ? "mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
                          : "mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                      }
                    >
                      {sectionTools.map((t) => (
                        <ToolCard key={`${section.id}-${t.id}`} tool={t} />
                      ))}
                    </div>
                  </section>
                )
              })}
            </div>
          ) : (
            <>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold tracking-tight text-foreground">All {category.name} Tools</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {tools.map((t) => (
                  <ToolCard key={t.id} tool={t} />
                ))}
              </div>
            </>
          )}
        </section>

        {/* Popular Tools Cross-Link */}
        <section className="mt-14">
          <h2 className="text-xl font-bold tracking-tight text-foreground">Popular Across UtilNest</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {popular.map((t) => (
              <ToolCard key={t.id} tool={t} />
            ))}
          </div>
        </section>

        {/* Category Info & FAQ Accordion */}
        <section className="mt-14 max-w-3xl">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            About {category.name.toLowerCase()} tools on UtilNest
          </h2>
          <div className="mt-3 text-sm text-muted-foreground leading-relaxed">
            <p>
              All {category.name.toLowerCase()} tools on UtilNest are free, run
              instantly inside your web browser memory, and never upload your sensitive data. Whether
              you're a student, professional, or business owner in India, you can rely on
              accurate results with no sign-up required.
            </p>
          </div>

          <div className="mt-6 space-y-3">
            {categoryFaqsForPage.map((f) => (
              <details key={f.question} className="group rounded-xl border border-border/70 bg-card p-4 transition-all">
                <summary className="cursor-pointer font-semibold text-foreground flex items-center justify-between text-sm sm:text-base list-none">
                  <span>{f.question}</span>
                  <ChevronRight className="size-4 transition-transform group-open:rotate-90 text-muted-foreground" />
                </summary>
                <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed pt-2 border-t border-border/40">{f.answer}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}