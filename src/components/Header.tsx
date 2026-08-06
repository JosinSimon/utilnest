import { Link, NavLink } from "react-router-dom"
import { Wind, LayoutGrid } from "lucide-react"
import { site } from "@/data/site"
import { categories } from "@/data/categories"
import { CommandPalette } from "@/features/search/CommandPalette"
import { cn } from "@/lib/utils"

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2" aria-label={site.name}>
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Wind className="size-4" aria-hidden="true" />
          </span>
          <span className="hidden text-lg font-semibold tracking-tight sm:block">
            {site.name}
          </span>
        </Link>

        <nav className="hidden md:block" aria-label="Primary">
          <ul className="flex items-center gap-1">
            <NavItem to="/tools" label="All tools" />
            {categories.slice(0, 5).map((c) => (
              <NavItem key={c.slug} to={`/category/${c.slug}`} label={c.name} />
            ))}
          </ul>
        </nav>

        <div className="ml-auto w-full max-w-xs">
          <CommandPalette />
        </div>

        <a
          href="#all-categories"
          className="inline-flex items-center gap-1.5 rounded-lg border border-input bg-card px-3 py-2 text-sm font-medium hover:bg-accent md:hidden"
          aria-label="All categories"
        >
          <LayoutGrid className="size-4" aria-hidden="true" />
        </a>
      </div>
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
              ? "bg-accent text-foreground"
              : "text-muted-foreground hover:text-foreground",
          )
        }
      >
        {label}
      </NavLink>
    </li>
  )
}