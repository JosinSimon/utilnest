import { useMemo, useState } from "react"
import type { ToolDefinition } from "@/data/types"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { SegmentedControl } from "@/components/ui/segmented"
import { cn } from "@/lib/utils"
import { formatINR } from "@/lib/utils"
import { calculateGst, GstRates } from "./engine"

type Mode = "exclusive" | "inclusive"
type Split = "intra" | "inter"

export default function GstCalculator({ tool }: { tool: ToolDefinition }) {
  const [amount, setAmount] = useState("10000")
  const [rate, setRate] = useState(18)
  const [mode, setMode] = useState<Mode>("exclusive")
  const [split, setSplit] = useState<Split>("intra")

  const inclusive = mode === "inclusive"
  const interState = split === "inter"

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
                {inclusive
                  ? "this amount already includes GST"
                  : "before GST is added"}
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
            <Label>What do you want to do?</Label>
            <SegmentedControl<Mode>
              name="gst-mode"
              value={mode}
              onChange={setMode}
              options={[
                {
                  value: "exclusive",
                  label: "Add GST",
                  sub: "Exclusive — tax added to your amount",
                },
                {
                  value: "inclusive",
                  label: "Remove GST",
                  sub: "Inclusive — tax already included",
                },
              ]}
            />
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

        <div className="mt-5 space-y-2">
          <Label>Sale type</Label>
          <SegmentedControl<Split>
            name="gst-split"
            value={split}
            onChange={setSplit}
            options={[
              { value: "intra", label: "Intra-state", sub: "CGST + SGST" },
              { value: "inter", label: "Inter-state", sub: "IGST" },
            ]}
          />
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

              <dl className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="flex flex-col gap-1 rounded-lg border bg-card p-4">
                  <dt className="text-xs text-muted-foreground">
                    Amount before GST
                  </dt>
                  <dd className="text-lg font-semibold tabular-nums">
                    {formatINR(result.base)}
                  </dd>
                </div>
                <div className="flex flex-col gap-1 rounded-lg border bg-card p-4">
                  <dt className="text-xs text-muted-foreground">GST amount</dt>
                  <dd className="text-lg font-semibold tabular-nums">
                    {formatINR(result.gstAmount)}
                    <span className="ml-1 text-xs font-normal text-muted-foreground">
                      at {result.rate}%
                    </span>
                  </dd>
                </div>
                <div className="flex flex-col gap-1 rounded-lg border bg-card p-4">
                  <dt className="text-xs text-muted-foreground">
                    Total including GST
                  </dt>
                  <dd className="text-lg font-semibold tabular-nums">
                    {formatINR(result.total)}
                  </dd>
                </div>
                <div className="flex flex-col gap-1 rounded-lg border bg-card p-4 sm:col-span-3">
                  <dt className="text-xs text-muted-foreground">
                    {interState
                      ? "IGST"
                      : "Tax split — CGST + SGST"}
                    {!interState && (
                      <span className="ml-1 font-normal">
                        (odd paisa to SGST)
                      </span>
                    )}
                  </dt>
                  <dd className="flex flex-wrap gap-x-6 gap-y-1 text-lg font-semibold tabular-nums">
                    {interState ? (
                      <span>{formatINR(result.igst)}</span>
                    ) : (
                      <>
                        <span>
                          CGST {formatINR(result.cgst)}
                        </span>
                        <span>
                          SGST {formatINR(result.sgst)}
                        </span>
                      </>
                    )}
                  </dd>
                </div>
              </dl>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Enter a valid amount to see results.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}