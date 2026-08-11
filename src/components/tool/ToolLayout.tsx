import { Link } from "react-router-dom"
import { Calendar, Layers } from "lucide-react"
import type { ToolDefinition } from "@/data/types"
import { categoryBySlug } from "@/data/categories"
import { getRelatedTools, getToolsByCategory } from "@/data/registry"
import { categoryPath } from "@/data/derive"
import { Breadcrumbs } from "@/components/Breadcrumbs"
import { ToolWidget } from "@/features/tools/ToolWidget"
import { TrustBanner } from "./TrustBanner"
import { AdSlot } from "@/components/ads/AdSlot"
import { Seo } from "@/components/seo/Seo"
import { ToolCard } from "@/components/ToolCard"
import { toolSeoData } from "@/components/seo/seo-data"
import { toolBreadcrumbs } from "@/data/derive"
import { formatDate } from "@/lib/format"

interface ToolLayoutProps {
  tool: ToolDefinition
}

export function ToolLayout({ tool }: ToolLayoutProps) {
  const category = categoryBySlug(tool.category)
  const related = getRelatedTools(tool)
  const categoryTools = getToolsByCategory(tool.category)
    .filter((t) => t.id !== tool.id)
    .slice(0, 6)

  const seoData = toolSeoData(tool)
  const breadcrumbs = toolBreadcrumbs(tool)

  return (
    <>
      <Seo data={seoData} />

      <article className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          <Breadcrumbs items={breadcrumbs.map((b) => ({ label: b.label, path: b.href }))} />
        </div>

        <header className="mt-3">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl text-foreground">
            {tool.name}
          </h1>
          <p className="mt-3 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">
            {tool.longDescription}
          </p>
        </header>

        <div className="mt-8">
          <ToolWidget tool={tool} />
        </div>

        {tool.privacyNote === "client" && <TrustBanner className="mt-6" />}

        {/* Policy-safe responsive AdSlot placeholder */}
        <AdSlot slotType="rectangle" className="mt-8" />

        {tool.howTo && tool.howTo.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              How to use {tool.name}
            </h2>
            <ol className="mt-4 space-y-3">
              {tool.howTo.map((step, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-foreground text-sm sm:text-base">{step.title}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        )}

        {tool.sections.map((section) => (
          <section key={section.heading} className="mt-10">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              {section.heading}
            </h2>
            <div className="mt-3 text-muted-foreground text-sm sm:text-base leading-relaxed">
              {section.body.split("\n\n").map((para, i) => (
                <p key={i} className="mt-3 first:mt-0">
                  {para}
                </p>
              ))}
            </div>
          </section>
        ))}

        {tool.examples && tool.examples.length > 0 && (
          <section className="mt-10">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">Examples</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {tool.examples.map((ex) => (
                <div key={ex.title} className="rounded-xl border bg-card p-5">
                  <p className="font-semibold text-foreground">{ex.title}</p>
                  <dl className="mt-3 space-y-2 text-sm">
                    <div>
                      <dt className="text-muted-foreground">Input</dt>
                      <dd className="font-mono text-foreground">{ex.input}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Output</dt>
                      <dd className="font-mono font-medium text-emerald-600">
                        {ex.output}
                      </dd>
                    </div>
                  </dl>
                </div>
              ))}
            </div>
          </section>
        )}

        {tool.faq && tool.faq.length > 0 && (
          <section className="mt-10">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              Frequently asked questions
            </h2>
            <div className="mt-4 space-y-3">
              {tool.faq.map((f) => (
                <details key={f.question} className="group rounded-xl border border-border/70 bg-card p-4 transition-all">
                  <summary className="cursor-pointer font-semibold text-foreground">
                    {f.question}
                  </summary>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed pt-2 border-t border-border/40">{f.answer}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        <section className="mt-12">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Layers className="size-4" aria-hidden="true" />
            <span>
              Category:{" "}
              {category && (
                <Link
                  to={categoryPath(category.slug)}
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  {category.name}
                </Link>
              )}
            </span>
          </div>
          {categoryTools.length > 0 && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold tracking-tight text-foreground">
                More {category?.name.toLowerCase() ?? "tools"} tools
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {categoryTools.map((t) => (
                  <ToolCard key={t.id} tool={t} />
                ))}
              </div>
            </div>
          )}
        </section>

        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">Related tools</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((t) => (
                <ToolCard key={t.id} tool={t} />
              ))}
            </div>
          </section>
        )}

        <p className="mt-12 flex items-center gap-2 border-t pt-6 text-sm text-muted-foreground">
          <Calendar className="size-4" aria-hidden="true" />
          Last updated {formatDate(tool.lastUpdated)}
        </p>
      </article>
    </>
  )
}