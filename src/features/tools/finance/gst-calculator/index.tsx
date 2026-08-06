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

  const result = useMemo(() => {
    const parsed = Number(amount)
    if (!Number.isFinite(parsed) || parsed < 0) return null
    return calculateGst({ amount: parsed, rate, inclusive })
  }, [amount, rate, inclusive])

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
            <Label htmlFor="gst-amount">Amount (₹)</Label>
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
            <Label htmlFor="gst-mode">GST mode</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={inclusive ? "outline" : "default"}
                onClick={() => setInclusive(false)}
                className={cn(!inclusive && "bg-primary text-primary-foreground")}
              >
                Exclusive
              </Button>
              <Button
                type="button"
                variant={inclusive ? "default" : "outline"}
                onClick={() => setInclusive(true)}
                className={cn(inclusive && "bg-primary text-primary-foreground")}
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

        <div className="mt-6 rounded-xl border bg-secondary/40 p-5">
          {result ? (
            <dl className="grid gap-3 sm:grid-cols-2">
              {[
                {
                  label: inclusive ? "Total (incl. GST)" : "Base amount",
                  value: inclusive ? result.total : result.base,
                },
                {
                  label: "GST amount",
                  value: result.gstAmount,
                  note: `at ${result.rate * 100}%`,
                },
                { label: "CGST", value: result.cgst },
                { label: "SGST", value: result.sgst },
              ].map((row) => (
                <div key={row.label} className="flex items-baseline justify-between gap-2">
                  <dt className="text-sm text-muted-foreground">{row.label}</dt>
                  <dd className="font-semibold tabular-nums">
                    {formatINR(row.value)}
                    {row.note && (
                      <span className="ml-1 text-xs font-normal text-muted-foreground">
                        {row.note}
                      </span>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="text-sm text-muted-foreground">Enter a valid amount to see results.</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}