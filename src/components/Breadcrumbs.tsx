import { Link } from "react-router-dom"
import { ChevronRight } from "lucide-react"
import type { Breadcrumb } from "@/data/derive"

export function Breadcrumbs({ items }: { items: Breadcrumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, i) => {
          const isLast = i === items.length - 1
          return (
            <li key={item.href + item.label} className="flex items-center gap-1.5">
              {i > 0 && (
                <ChevronRight className="size-3.5 text-muted-foreground/60" aria-hidden="true" />
              )}
              {isLast ? (
                <span aria-current="page" className="text-foreground">
                  {item.label}
                </span>
              ) : (
                <Link to={item.href} className="transition-colors hover:text-foreground">
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