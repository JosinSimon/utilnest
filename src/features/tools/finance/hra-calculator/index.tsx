import { useMemo, useState } from "react"
import type { ToolDefinition } from "@/data/types"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { SegmentedControl } from "@/components/ui/segmented"
import { formatINR } from "@/lib/utils"
import { calculateHra } from "./engine"

type City = "metro" | "non-metro"

export default function HraCalculator({ tool }: { tool: ToolDefinition }) {
  const [basic, setBasic] = useState("50000")
  const [hra, setHra] = useState("20000")
  const [rent, setRent] = useState("18000")
  const [city, setCity] = useState<City>("metro")

  const result = useMemo(() => {
    const b = Number(basic)
    const h = Number(hra)
    const r = Number(rent)
    if (!Number.isFinite(b) || b < 0 || !Number.isFinite(h) || h < 0 || !Number.isFinite(r) || r < 0) {
      return null
    }
    return calculateHra({ basicSalary: b, hraReceived: h, rentPaid: r, metro: city === "metro" })
  }, [basic, hra, rent, city])

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">{tool.name}</p>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            100% private · in-browser
          </span>
        </div>

        <div className="mt-5 space-y-2">
          <Label>City type</Label>
          <SegmentedControl<City>
            name="hra-city"
            value={city}
            onChange={setCity}
            options={[
              { value: "metro", label: "Metro", sub: "Delhi, Mumbai, Kolkata, Chennai" },
              { value: "non-metro", label: "Non-metro", sub: "all other cities" },
            ]}
          />
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="hra-basic">Basic salary (₹/month)</Label>
            <Input
              id="hra-basic"
              type="number"
              min="0"
              step="any"
              inputMode="decimal"
              value={basic}
              onChange={(e) => setBasic(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hra-received">HRA received (₹/month)</Label>
            <Input
              id="hra-received"
              type="number"
              min="0"
              step="any"
              inputMode="decimal"
              value={hra}
              onChange={(e) => setHra(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hra-rent">Rent paid (₹/month)</Label>
            <Input
              id="hra-rent"
              type="number"
              min="0"
              step="any"
              inputMode="decimal"
              value={rent}
              onChange={(e) => setRent(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-6 rounded-xl border bg-secondary/40 p-5">
          {result ? (
            <div>
              <div className="flex items-baseline justify-between rounded-lg bg-primary px-4 py-3 text-primary-foreground">
                <dt className="text-sm font-medium">HRA exemption (per month)</dt>
                <dd className="text-2xl font-semibold tabular-nums">
                  {formatINR(result.exemption)}
                </dd>
              </div>

              <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="flex flex-col gap-1 rounded-lg border bg-card p-4">
                  <dt className="text-xs text-muted-foreground">Taxable HRA</dt>
                  <dd className="text-lg font-semibold tabular-nums">
                    {formatINR(result.taxableHra)}
                  </dd>
                </div>
                <div className="flex flex-col gap-1 rounded-lg border bg-card p-4">
                  <dt className="text-xs text-muted-foreground">Actual HRA received</dt>
                  <dd className="text-lg font-semibold tabular-nums">
                    {formatINR(result.actualHra)}
                  </dd>
                </div>
                <div className="flex flex-col gap-1 rounded-lg border bg-card p-4">
                  <dt className="text-xs text-muted-foreground">Rent − 10% of basic</dt>
                  <dd className="text-lg font-semibold tabular-nums">
                    {formatINR(result.rentMinus10Percent)}
                  </dd>
                </div>
                <div className="flex flex-col gap-1 rounded-lg border bg-card p-4">
                  <dt className="text-xs text-muted-foreground">
                    {city === "metro" ? "50%" : "40%"} of basic
                  </dt>
                  <dd className="text-lg font-semibold tabular-nums">
                    {formatINR(result.halfOfBasic)}
                  </dd>
                </div>
              </dl>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Enter your basic salary, HRA and rent above to see the exemption.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}