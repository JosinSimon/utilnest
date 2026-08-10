import { useState, useMemo } from "react"
import { CalendarDays } from "lucide-react"
import type { ToolDefinition } from "@/data/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { SegmentedControl } from "@/components/ui/segmented"
import { calculateDateDiff, type DateCalcMode } from "./engine"

export default function DateDifferenceCalculator({ tool: _tool }: { tool: ToolDefinition }) {
  const todayStr = new Date().toISOString().split("T")[0]
  const [mode, setMode] = useState<DateCalcMode>("diff")

  // Diff mode state
  const [startDate, setStartDate] = useState<string>("2026-01-01")
  const [endDate, setEndDate] = useState<string>(todayStr)
  const [includeEndDate, setIncludeEndDate] = useState<boolean>(false)

  // Add/Subtract mode state
  const [baseDate, setBaseDate] = useState<string>(todayStr)
  const [operation, setOperation] = useState<"add" | "subtract">("add")
  const [amount, setAmount] = useState<number>(30)
  const [unit, setUnit] = useState<"days" | "weeks" | "months" | "years">("days")

  const result = useMemo(() => {
    return calculateDateDiff({
      mode,
      startDate,
      endDate,
      includeEndDate,
      baseDate,
      operation,
      amount,
      unit,
    })
  }, [mode, startDate, endDate, includeEndDate, baseDate, operation, amount, unit])

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-primary" /> Date Calculator Mode
          </CardTitle>
          <SegmentedControl
            options={[
              { label: "Difference Between Dates", value: "diff" },
              { label: "Add / Subtract Time", value: "add_subtract" },
            ]}
            value={mode}
            onChange={(val) => setMode(val as DateCalcMode)}
          />
        </CardHeader>
        <CardContent>
          {mode === "diff" ? (
            <div className="flex flex-col gap-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 border p-3 rounded-lg bg-muted/20">
                <input
                  type="checkbox"
                  id="includeEnd"
                  checked={includeEndDate}
                  onChange={(e) => setIncludeEndDate(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="includeEnd" className="text-sm font-medium cursor-pointer">
                  Include end date in calculation (+1 day)
                </label>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-4">
              <div className="space-y-2 sm:col-span-2">
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={baseDate}
                  onChange={(e) => setBaseDate(e.target.value)}
                  className="font-mono"
                />
              </div>

              <div className="space-y-2">
                <Label>Operation</Label>
                <select
                  value={operation}
                  onChange={(e) => setOperation(e.target.value as "add" | "subtract")}
                  className="w-full px-3 py-2 text-sm border rounded-md bg-background"
                >
                  <option value="add">Add (+)</option>
                  <option value="subtract">Subtract (-)</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label>Quantity</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    min="1"
                    value={amount}
                    onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
                    className="font-mono w-24"
                  />
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value as "days" | "weeks" | "months" | "years")}
                    className="w-full px-2 py-2 text-sm border rounded-md bg-background"
                  >
                    <option value="days">Days</option>
                    <option value="weeks">Weeks</option>
                    <option value="months">Months</option>
                    <option value="years">Years</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {!result.isValid ? (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="p-6 text-center text-destructive font-medium">
            {result.errorMessage || "Please enter valid dates."}
          </CardContent>
        </Card>
      ) : mode === "diff" ? (
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20">
            <CardContent className="p-8 flex flex-col items-center text-center gap-4">
              <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Date Difference {result.includeEndDate ? "(Inclusive)" : "(Exclusive)"}
              </p>

              <div className="flex flex-wrap justify-center items-baseline gap-3">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl sm:text-5xl font-extrabold font-mono text-primary">
                    {result.years}
                  </span>
                  <span className="text-sm font-medium text-muted-foreground">years</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl sm:text-5xl font-extrabold font-mono text-primary">
                    {result.months}
                  </span>
                  <span className="text-sm font-medium text-muted-foreground">months</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl sm:text-5xl font-extrabold font-mono text-primary">
                    {result.days}
                  </span>
                  <span className="text-sm font-medium text-muted-foreground">days</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xs text-muted-foreground">Total Months</p>
                <p className="text-xl font-bold font-mono">{result.totalMonths?.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Weeks</p>
                <p className="text-xl font-bold font-mono">{result.totalWeeks?.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Days</p>
                <p className="text-xl font-bold font-mono">{result.totalDays?.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20">
          <CardContent className="p-8 flex flex-col items-center text-center gap-2">
            <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Calculated Date
            </p>
            <p className="text-3xl sm:text-4xl font-extrabold font-mono text-primary">
              {result.targetDateFormatted}
            </p>
            <p className="text-base font-medium text-muted-foreground">
              {result.targetDayOfWeek} ({result.targetIsoDate})
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
