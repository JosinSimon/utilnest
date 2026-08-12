import { Link } from "react-router-dom"
import { ArrowRight, ShieldCheck, Zap, HeartHandshake, Sparkles, ChevronRight } from "lucide-react"
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

  const quickActionChips = [
    { label: "📄 PDF Tools", path: "/category/pdf" },
    { label: "🧮 GST & EMI", path: "/category/finance" },
    { label: "📷 Govt Exam Photos", path: "/category/government" },
    { label: "📱 QR Code", path: "/category/utilities/qr-code-generator" },
    { label: "🔐 Passwords", path: "/category/utilities/password-generator" },
    { label: "💼 GST Invoice", path: "/category/business/invoice-generator" },
  ]

  return (
    <>
      <Seo
        data={{
          title: `${site.name} - ${site.tagline} | ${categories.length} Utility Categories`,
          description: site.description,
          canonical: site.url,
          robots: "index, follow",
          og: {
            type: "website",
            title: site.name,
            description: site.description,
            image: site.defaultOgImage,
            url: site.url,
          },
          jsonLd: [websiteJsonLd(), organizationJsonLd()].filter(
            (x): x is Record<string, unknown> => Boolean(x),
          ),
        }}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b bg-gradient-to-b from-background via-muted/30 to-background py-12 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
          
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary shadow-sm mb-4">
            <Sparkles className="size-3.5 text-primary animate-pulse" />
            <span>100% Free · 100% Private · Zero Server Uploads</span>
          </div>

          <h1 className="mx-auto max-w-4xl text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-tight">
            Every Online Tool You Need, <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-primary via-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Directly In Your Browser
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base text-muted-foreground leading-relaxed">
            Instant calculators, PDF converters, image resizers, GST invoices, QR generators, and everyday utilities. Your files never leave your device.
          </p>

          {/* Search Command Palette */}
          <div className="mx-auto mt-6 max-w-xl shadow-lg rounded-2xl">
            <CommandPalette />
          </div>

          {/* Quick Action Chips (Mobile-ready tap chips) */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mr-1">Quick Jump:</span>
            {quickActionChips.map((chip) => (
              <Link
                key={chip.label}
                to={chip.path}
                className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:border-primary/50 hover:bg-accent transition-all active:scale-95 shadow-sm"
              >
                {chip.label}
              </Link>
            ))}
          </div>

          {/* Privacy Guarantee Pill */}
          <div className="mt-8 flex items-center justify-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="size-4 shrink-0" />
            <span>{site.trustLine}</span>
          </div>
        </div>
      </section>

      {/* Why UtilNest? Feature Banner */}
      <section className="border-b bg-card py-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            
            <div className="flex items-start gap-3.5 p-4 rounded-xl bg-muted/40 border border-border/50">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="size-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-foreground">100% Private & Local</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">All processing happens directly inside your browser. No server uploads or data tracking.</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-4 rounded-xl bg-muted/40 border border-border/50">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Zap className="size-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-foreground">Zero Delay & Offline</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">No queues or waiting times. Tools load instantly even on slow 3G/4G connections.</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-4 rounded-xl bg-muted/40 border border-border/50">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                <HeartHandshake className="size-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-foreground">Built for India</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">SSC/UPSC photo resizers, GST, EMI, HRA, UPI QR code generator, and Indian business invoicing.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Category Grid Section */}
      <section id="all-categories" className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">Browse by Category</h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Explore {categories.length} top-level categories</p>
          </div>
          <Link
            to="/tools"
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-primary hover:underline"
          >
            All tools <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((c) => (
            <CategoryCard key={c.slug} category={c} />
          ))}
        </div>
      </section>

      {/* Popular Tools */}
      <FacetedSection
        id="popular"
        title="Popular Tools"
        subtitle="The tools millions reach for every day."
      >
        {popular.map((t) => (
          <ToolCard key={t.id} tool={t} />
        ))}
      </FacetedSection>

      {/* Trending Tools */}
      {trending.length > 0 && (
        <FacetedSection
          id="trending"
          title="Trending Now"
          subtitle="Fastest-growing tools this month."
        >
          {trending.map((t) => (
            <ToolCard key={t.id} tool={t} />
          ))}
        </FacetedSection>
      )}

      {/* Featured Tools */}
      {featured.length > 0 && (
        <FacetedSection
          id="featured"
          title="Featured Utilities"
          subtitle="Hand-picked tools for daily use."
        >
          {featured.map((t) => (
            <ToolCard key={t.id} tool={t} />
          ))}
        </FacetedSection>
      )}

      {/* Recently Added */}
      {recent.length > 0 && (
        <FacetedSection id="recent" title="Recently Shipped" subtitle="Fresh tools added recently.">
          {recent.map((t) => (
            <ToolCard key={t.id} tool={t} />
          ))}
        </FacetedSection>
      )}

      {/* FAQ Section */}
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 border-t">
        <h2 className="text-center text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          Frequently Asked Questions
        </h2>
        <div className="mt-6 space-y-3">
          {HOME_FAQS.map((f) => (
            <details key={f.q} className="group rounded-xl border border-border/70 bg-card p-4 transition-all">
              <summary className="cursor-pointer font-semibold text-sm sm:text-base text-foreground list-none flex items-center justify-between">
                <span>{f.q}</span>
                <ChevronRight className="size-4 transition-transform group-open:rotate-90 text-muted-foreground" />
              </summary>
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed pt-2 border-t border-border/40">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Request Tool Callout CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-indigo-700 px-6 py-10 text-center text-primary-foreground shadow-xl">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Can't find the tool you need?
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-xs sm:text-sm text-primary-foreground/90 leading-relaxed">
            We build and add new client-side tools regularly. Let us know what tool you want and we'll build it for you.
          </p>
          <Link
            to="/contact"
            className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-background px-6 text-sm font-bold text-primary shadow-md transition-all hover:bg-accent active:scale-95"
          >
            <span>Request a Custom Tool</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </>
  )
}

function CategoryCard({ category }: { category: (typeof categories)[0] }) {
  const Icon = getIcon(category.icon)
  const count = getToolsByCategory(category.slug as CategorySlug).length
  const colorClass = category.color || "from-primary/10 to-primary/5 text-primary border-border"

  return (
    <Link
      to={`/category/${category.slug}`}
      className="group flex flex-col justify-between rounded-2xl border border-border/70 bg-card p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-primary/40 active:scale-[0.99]"
    >
      <div>
        <div className="flex items-center justify-between">
          <span className={`flex size-11 items-center justify-center rounded-xl bg-gradient-to-br border ${colorClass}`}>
            <Icon className="size-5" aria-hidden="true" />
          </span>
          <span className="text-xs font-semibold text-muted-foreground bg-muted/80 px-2.5 py-1 rounded-full">
            {count} {count === 1 ? "tool" : "tools"}
          </span>
        </div>

        <h3 className="mt-4 font-bold text-base text-foreground group-hover:text-primary transition-colors">
          {category.name}
        </h3>
        <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
          {category.tagline}
        </p>
      </div>

      {/* Preview Tags */}
      {category.previewTags && category.previewTags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1 pt-3 border-t border-border/40">
          {category.previewTags.map((tag) => (
            <span key={tag} className="text-[10px] font-medium text-muted-foreground bg-muted/60 px-2 py-0.5 rounded">
              {tag}
            </span>
          ))}
        </div>
      )}
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
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">{title}</h2>
          {subtitle && <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {children}
      </div>
    </section>
  )
}

const HOME_FAQS = [
  {
    q: "Are all tools on UtilNest really 100% free?",
    a: "Yes! Every single tool on UtilNest is completely free with no registration, no subscription, and no hidden usage limits.",
  },
  {
    q: "Do you store my uploaded images, PDFs, or financial data?",
    a: "Never. All calculations, PDF conversions, image compression, and QR code generations happen locally inside your browser memory using client-side JavaScript. Your data never touches any server.",
  },
  {
    q: "Can I use UtilNest tools offline or on mobile?",
    a: "Yes! UtilNest is fully mobile-responsive and works smoothly on smartphones, tablets, and desktops. Once loaded, tools work offline as well.",
  },
]