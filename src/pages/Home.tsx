import { Link } from "react-router-dom"
import { ArrowRight, ShieldCheck } from "lucide-react"
import { site } from "@/data/site"
import { categories } from "@/data/categories"
import {
  getPopularTools,
  getTrendingTools,
  getRecentlyAddedTools,
  getFeaturedTools,
  getToolsByCategory,
} from "@/data/registry"
import type { CategorySlug } from "@/data/types"
import { ToolCard } from "@/components/ToolCard"
import { getIcon } from "@/components/icons"
import { Seo } from "@/components/seo/Seo"
import { websiteJsonLd, organizationJsonLd } from "@/components/seo/seo-data"
import { CommandPalette } from "@/features/search/CommandPalette"

export function HomePage() {
  const popular = getPopularTools(8)
  const trending = getTrendingTools(8)
  const recent = getRecentlyAddedTools(6)
  const featured = getFeaturedTools(6)

  return (
    <>
      <Seo
        data={{
          title: `${site.name} - ${site.tagline} | ${categories.length} Tool Categories`,
          description: site.description,
          canonical: site.url,
          robots: "index, follow",
          og: {
            type: "website",
            title: site.name,
            description: site.description,
            image: `${site.url}/og/home.png`,
            url: site.url,
          },
          jsonLd: [websiteJsonLd(), organizationJsonLd()].filter(
            (x): x is Record<string, unknown> => Boolean(x),
          ),
        }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden border-b bg-grid">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 sm:py-24 lg:px-8">
          <p className="text-sm font-medium text-primary">Free · Fast · Private</p>
          <h1 className="mx-auto mt-3 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
            Every online tool you need, in one place
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            {site.description}
          </p>
          <div className="mx-auto mt-8 max-w-xl">
            <CommandPalette />
          </div>
          <p className="mt-4 inline-flex items-center gap-1.5 text-sm text-emerald-700">
            <ShieldCheck className="size-4" aria-hidden="true" />
            {site.trustLine}
          </p>
        </div>
      </section>

      {/* Categories */}
      <section id="all-categories" className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">Browse by category</h2>
          <Link
            to="/tools"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary"
          >
            All tools <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map((c) => (
            <CategoryCard key={c.slug} slug={c.slug} name={c.name} tagline={c.tagline} icon={c.icon} />
          ))}
        </div>
      </section>

      {/* Popular */}
      <FacetedSection
        id="popular"
        title="Popular tools"
        subtitle="The tools millions of people reach for every day."
      >
        {popular.map((t) => (
          <ToolCard key={t.id} tool={t} />
        ))}
      </FacetedSection>

      {/* Trending */}
      {trending.length > 0 && (
        <FacetedSection
          id="trending"
          title="Trending now"
          subtitle="Fastest-growing tools this month."
        >
          {trending.map((t) => (
            <ToolCard key={t.id} tool={t} />
          ))}
        </FacetedSection>
      )}

      {/* Featured */}
      {featured.length > 0 && (
        <FacetedSection
          id="featured"
          title="Featured tools"
          subtitle="Hand-picked tools our team recommends."
        >
          {featured.map((t) => (
            <ToolCard key={t.id} tool={t} />
          ))}
        </FacetedSection>
      )}

      {/* Recently added */}
      {recent.length > 0 && (
        <FacetedSection id="recent" title="Recently added" subtitle="Fresh tools, just shipped.">
          {recent.map((t) => (
            <ToolCard key={t.id} tool={t} />
          ))}
        </FacetedSection>
      )}

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-center text-2xl font-semibold tracking-tight">
          Frequently asked questions
        </h2>
        <div className="mt-6 space-y-3">
          {HOME_FAQS.map((f) => (
            <details key={f.q} className="group rounded-xl border bg-card p-5">
              <summary className="cursor-pointer font-medium">{f.q}</summary>
              <p className="mt-2 text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-primary px-6 py-12 text-center text-primary-foreground">
          <h2 className="text-2xl font-semibold tracking-tight">
            Can't find the tool you need?
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-primary-foreground/80">
            We're adding new tools every week. Tell us what you need and we'll build it.
          </p>
          <Link
            to="/contact"
            className="mt-6 inline-flex h-11 items-center rounded-lg bg-primary-foreground px-6 text-sm font-medium text-primary transition-opacity hover:opacity-90"
          >
            Request a tool
          </Link>
        </div>
      </section>
    </>
  )
}

function CategoryCard({ slug, name, tagline, icon }: { slug: string; name: string; tagline: string; icon: string }) {
  const Icon = getIcon(icon)
  const count = getToolsByCategory(slug as CategorySlug).length
  return (
    <Link
      to={`/category/${slug}`}
      className="group rounded-2xl border bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-md"
    >
      <span className="flex size-10 items-center justify-center rounded-xl bg-secondary text-primary">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <span className="mt-3 block font-medium">{name}</span>
      <span className="mt-1 block text-xs text-muted-foreground">
        {count > 0 ? `${count} tools · ` : ""}
        {tagline}
      </span>
    </Link>
  )
}

function FacetedSection({
  id,
  title,
  subtitle,
  children,
}: {
  id: string
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      {subtitle && <p className="mt-1 text-muted-foreground">{subtitle}</p>}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {children}
      </div>
    </section>
  )
}

const HOME_FAQS = [
  {
    q: "Are these tools really free?",
    a: "Yes. Every tool on " + site.name + " is completely free to use, with no sign-up and no hidden limits.",
  },
  {
    q: "Do you store my files or personal data?",
    a: "No. All processing happens in your browser. Your files and data never leave your device.",
  },
  {
    q: "Which tools are most popular right now?",
    a: "GST and EMI calculators, image compressors, and government photo resizers are among our most-used tools.",
  },
]