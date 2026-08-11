import { useState } from "react"
import { Link, NavLink } from "react-router-dom"
import { Wind, Menu, X, Sparkles, ChevronRight } from "lucide-react"
import { site } from "@/data/site"
import { categories } from "@/data/categories"
import { CommandPalette } from "@/features/search/CommandPalette"
import { cn } from "@/lib/utils"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        {/* Brand Logo & Name */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0" aria-label={site.name}>
          <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-sm">
            <Wind className="size-5" aria-hidden="true" />
          </span>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-foreground leading-none">
              {site.name}
            </span>
            <span className="text-[10px] font-medium text-muted-foreground tracking-wider uppercase hidden sm:block">
              Free Browser Utilities
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:block" aria-label="Primary">
          <ul className="flex items-center gap-1 text-sm font-medium">
            <NavItem to="/tools" label="All Tools" />
            {categories.slice(0, 5).map((c) => (
              <NavItem key={c.slug} to={`/category/${c.slug}`} label={c.name} />
            ))}
          </ul>
        </nav>

        {/* Search Bar & Mobile Menu Trigger */}
        <div className="flex items-center gap-2 ml-auto sm:ml-0">
          <div className="w-40 sm:w-64 md:w-72">
            <CommandPalette />
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex size-9 items-center justify-center rounded-xl border border-input bg-card text-muted-foreground hover:text-foreground hover:bg-accent lg:hidden"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div className="border-b bg-card/95 px-4 py-4 backdrop-blur-lg lg:hidden shadow-lg animate-in slide-in-from-top-2">
          <div className="flex items-center justify-between pb-3 mb-2 border-b text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <span>Browse Categories</span>
            <span className="flex items-center gap-1 text-primary">
              <Sparkles className="size-3" /> 7 Categories
            </span>
          </div>

          <div className="grid grid-cols-1 gap-1">
            <Link
              to="/tools"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-semibold text-primary bg-primary/10"
            >
              <span>Explore All Tools</span>
              <ChevronRight className="size-4" />
            </Link>

            {categories.map((c) => (
              <Link
                key={c.slug}
                to={`/category/${c.slug}`}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-accent transition-colors"
              >
                <span>{c.name}</span>
                <span className="text-xs text-muted-foreground">{c.tagline}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}

function NavItem({ to, label }: { to: string; label: string }) {
  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
          cn(
            "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            isActive
              ? "bg-accent text-foreground font-semibold"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
          )
        }
      >
        {label}
      </NavLink>
    </li>
  )
}