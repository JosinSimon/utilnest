import { cn } from "@/lib/utils"

const heights = {
  banner: "h-[90px]",
  rect: "h-[250px]",
  skyscraper: "h-[600px]",
}

interface AdPlaceholderProps {
  slot: "banner" | "rect" | "skyscraper"
  className?: string
  label?: string
}

/**
 * Reserved, fixed-size ad slot. Keeps its height whether or not an ad is
 * served, so there is zero layout shift (Core Web Vitals CLS = 0).
 */
export function AdPlaceholder({ slot, className, label }: AdPlaceholderProps) {
  return (
    <div
      role="complementary"
      aria-hidden="true"
      className={cn(
        "relative flex w-full items-center justify-center overflow-hidden rounded-xl border border-dashed border-border bg-secondary/50",
        heights[slot],
        className,
      )}
    >
      <span className="text-xs text-muted-foreground/70">
        {label ?? "Advertisement"}
      </span>
    </div>
  )
}