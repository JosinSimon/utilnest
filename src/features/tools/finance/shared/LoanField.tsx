import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

/** Labelled numeric input used by the home loan calculators. */
export function LoanField({
  id,
  label,
  value,
  onChange,
  hint,
  placeholder,
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  hint?: string
  placeholder?: string
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="number"
        min="0"
        step="any"
        inputMode="decimal"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}

/** Small result tile. */
export function Stat({ label, value, tone }: { label: string; value: string; tone?: "good" }) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border bg-card p-4">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className={`text-lg font-semibold tabular-nums ${tone === "good" ? "text-emerald-600" : ""}`}>{value}</dd>
    </div>
  )
}

export function num(value: string): number {
  const n = Number(value)
  return Number.isFinite(n) && n >= 0 ? n : NaN
}

/** 199 months → "16 years 7 months". */
export function formatTenure(months: number): string {
  const y = Math.floor(months / 12)
  const m = months % 12
  const parts = []
  if (y) parts.push(`${y} year${y === 1 ? "" : "s"}`)
  if (m) parts.push(`${m} month${m === 1 ? "" : "s"}`)
  return parts.join(" ") || "0 months"
}
