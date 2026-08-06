import { useMemo, useState } from "react"
import type { ToolDefinition } from "@/data/types"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { formatINR } from "@/lib/utils"
import { calculateGst, GstRates } from "./engine"

export default function GstCalculator({ tool }: { tool: ToolDefinition }) {
  const [amount, setAmount] = useState("10000")
  const [rate, setRate] = useState(18)
  const [inclusive, setInclusive] = useState(false)
  const [interState, setInterState] = useState(false)

  const result = useMemo(() => {
    const parsed = Number(amount)
    if (!Number.isFinite(parsed) || parsed < 0) return null
    return calculateGst({ amount: parsed, rate, inclusive, interState })
  }, [amount, rate, inclusive, interState])

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">
            {tool.name}
          </p>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            100% private · in-browser
          </span>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="gst-amount">
              Amount (₹)
              <span className="ml-1 text-xs font-normal text-muted-foreground">
                {inclusive ? "this amount already includes GST" : "before GST is added"}
              </span>
            </Label>
            <Input
              id="gst-amount"
              type="number"
              min="0"
              step="any"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
            />
          </div>

          <div className="space-y-2">
            <Label>GST mode</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={inclusive ? "outline" : "default"}
                onClick={() => setInclusive(false)}
                aria-pressed={!inclusive}
              >
                Exclusive
              </Button>
              <Button
                type="button"
                variant={inclusive ? "default" : "outline"}
                onClick={() => setInclusive(true)}
                aria-pressed={inclusive}
              >
                Inclusive
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Exclusive adds GST · Inclusive extracts GST from the total
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-2">
          <Label>GST rate</Label>
          <div className="flex flex-wrap gap-2">
            {GstRates.map((r) => (
              <Button
                key={r}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setRate(r)}
                aria-pressed={rate === r}
                className={cn(
                  "min-w-14",
                  rate === r && "border-primary bg-primary/10 text-primary",
                )}
              >
                {r}%
              </Button>
            ))}
          </div>
        </div>

        <div className="mt-5 flex items-center gap-2">
          <button
            type="button"
            role="switch"
            aria-checked={interState}
            onClick={() => setInterState((v) => !v)}
            className={cn(
              "relative h-6 w-11 rounded-full transition-colors",
              interState ? "bg-primary" : "bg-muted",
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 size-5 rounded-full bg-white shadow transition-transform",
                interState ? "translate-x-5" : "translate-x-0.5",
              )}
            />
          </button>
          <span className="text-sm">
            Inter-state sale{" "}
            <span className="text-muted-foreground">(charges IGST)</span>
          </span>
        </div>

        <div className="mt-6 rounded-xl border bg-secondary/40 p-5">
          {result ? (
            <div>
              <div className="flex items-baseline justify-between rounded-lg bg-primary px-4 py-3 text-primary-foreground">
                <dt className="text-sm font-medium">
                  {inclusive ? "Amount before GST" : "Total including GST"}
                </dt>
                <dd className="text-2xl font-semibold tabular-nums">
                  {formatINR(inclusive ? result.base : result.total)}
                </dd>
              </div>

              <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="flex items-baseline justify-between gap-2">
                  <dt className="text-sm text-muted-foreground">Amount before GST</dt>
                  <dd className="font-semibold tabular-nums">{formatINR(result.base)}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-2">
                  <dt className="text-sm text-muted-foreground">GST amount</dt>
                  <dd className="font-semibold tabular-nums">
                    {formatINR(result.gstAmount)}
                    <span className="ml-1 text-xs font-normal text-muted-foreground">
                      at {result.rate}%
                    </span>
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-2">
                  <dt className="text-sm text-muted-foreground">Total including GST</dt>
                  <dd className="font-semibold tabular-nums">{formatINR(result.total)}</dd>
                </div>
                {interState ? (
                  <div className="flex items-baseline justify-between gap-2">
                    <dt className="text-sm text-muted-foreground">IGST</dt>
                    <dd className="font-semibold tabular-nums">{formatINR(result.igst)}</dd>
                  </div>
                ) : (
                  <div className="flex items-baseline justify-between gap-2 sm:col-span-1">
                    <dt className="text-sm text-muted-foreground">
                      CGST <span className="text-xs">(half)</span>
                    </dt>
                    <dd className="font-semibold tabular-nums">{formatINR(result.cgst)}</dd>
                    <dt className="ml-auto pl-2 text-sm text-muted-foreground">
                      SGST <span className="text-xs">(half)</span>
                    </dt>
                    <dd className="font-semibold tabular-nums">{formatINR(result.sgst)}</dd>
                  </div>
                )}
              </dl>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Enter a valid amount to see results.</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}