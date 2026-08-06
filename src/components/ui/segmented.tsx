import { cn } from "@/lib/utils"

export interface SegmentedOption<T extends string> {
  value: T
  label: string
  sub?: string
}

interface SegmentedControlProps<T extends string> {
  options: SegmentedOption<T>[]
  value: T
  onChange: (value: T) => void
  name?: string
  className?: string
}

/**
 * Accessible segmented control (radio-group behaviour). Used for binary or
 * disjoint choices where each option is equally visible — e.g. GST modes and
 * intra/inter-state tax split.
 */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  name,
  className,
}: SegmentedControlProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={name}
      className={cn("grid w-full grid-cols-2 gap-1 rounded-lg bg-secondary p-1", className)}
    >
      {options.map((option) => {
        const active = value === option.value
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            name={name}
            onClick={() => onChange(option.value)}
            className={cn(
              "rounded-md px-3 py-2 text-center text-sm font-medium transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              active
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <span className="block leading-tight">{option.label}</span>
            {option.sub && (
              <span
                className={cn(
                  "mt-0.5 block text-[11px] leading-tight",
                  active ? "text-muted-foreground" : "opacity-70",
                )}
              >
                {option.sub}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}