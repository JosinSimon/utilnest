import { Link } from "react-router-dom"
import { ShieldCheck } from "lucide-react"
import { site } from "@/data/site"
import { categories } from "@/data/categories"
import { getPopularTools, allTools } from "@/data/registry"
import { categoryPath, toolPath } from "@/data/derive"

export function Footer() {
  const popular = getPopularTools(8)
  return (
    <footer className="mt-16 border-t bg-card">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-sm text-emerald-700">
          <ShieldCheck className="size-4" aria-hidden="true" />
          <strong>{site.trustLine}</strong>
          <span className="text-muted-foreground">
            All processing happens on your device.
          </span>
        </div>

        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-sm font-semibold">Categories</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link
                    to={categoryPath(c.slug)}
                    className="transition-colors hover:text-foreground"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold">Popular tools</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {popular.map((t) => (
                <li key={t.id}>
                  <Link
                    to={toolPath(t.category, t.slug)}
                    className="transition-colors hover:text-foreground"
                  >
                    {t.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold">Company</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/about" className="transition-colors hover:text-foreground">
                  About
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="transition-colors hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="transition-colors hover:text-foreground">
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link to="/contact" className="transition-colors hover:text-foreground">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold">{site.name}</p>
            <p className="mt-3 text-sm text-muted-foreground">
              Free online tools for students, professionals and businesses.{" "}
              {allTools.length} tools and growing.
            </p>
            <p className="mt-4 text-xs text-muted-foreground">
              © {new Date().getFullYear()} {site.name}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}