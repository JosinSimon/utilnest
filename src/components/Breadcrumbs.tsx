import { Link } from "react-router-dom"
import { ChevronRight, Home } from "lucide-react"

export interface BreadcrumbItem {
  label: string
  path: string
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
        <li>
          <Link
            to="/"
            className="flex items-center gap-1 hover:text-foreground transition-colors"
            aria-label="Home"
          >
            <Home className="size-3.5 text-muted-foreground/80" />
            <span>Home</span>
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li key={`${item.path}-${index}`} className="flex items-center gap-1.5">
              <ChevronRight className="size-3 text-muted-foreground/60 shrink-0" />
              {isLast ? (
                <span className="font-semibold text-foreground truncate max-w-[200px] sm:max-w-none" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.path}
                  className="hover:text-foreground transition-colors truncate max-w-[150px] sm:max-w-none"
                >
                  {item.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}