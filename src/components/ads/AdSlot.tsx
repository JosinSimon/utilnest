import { cn } from "@/lib/utils"

export interface AdSlotProps {
  slotType?: "leaderboard" | "rectangle" | "inArticle"
  className?: string
}

export function AdSlot({ slotType = "rectangle", className }: AdSlotProps) {
  // Height reservations to prevent Cumulative Layout Shift (CLS)
  const slotStyles = {
    leaderboard: "min-h-[60px] sm:min-h-[90px] w-full max-w-4xl mx-auto",
    rectangle: "min-h-[120px] sm:min-h-[250px] max-w-xl mx-auto w-full",
    inArticle: "min-h-[100px] sm:min-h-[200px] w-full my-6",
  }

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center rounded-xl border border-dashed border-border/50 bg-muted/20 p-2 text-center text-xs text-muted-foreground/60 transition-all select-none overflow-hidden my-6",
        slotStyles[slotType],
        className,
      )}
      aria-hidden="true"
    >
      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/40 bg-muted/60 px-2 py-0.5 rounded">
        Advertisement
      </span>
      {/* Placeholder reserved space for AdSense script initialization */}
    </div>
  )
}
