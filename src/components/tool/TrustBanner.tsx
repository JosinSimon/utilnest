import { ShieldCheck } from "lucide-react"
import { site } from "@/data/site"
import { cn } from "@/lib/utils"

export function TrustBanner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800",
        className,
      )}
    >
      <ShieldCheck className="size-4 shrink-0" aria-hidden="true" />
      <p>
        <strong>{site.trustLine}</strong>{" "}
        <span className="text-emerald-700">
          All processing happens on your device. No uploads, ever.
        </span>
      </p>
    </div>
  )
}