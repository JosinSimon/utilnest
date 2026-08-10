import { useState, useMemo } from "react"
import { Calendar, Cake, Clock } from "lucide-react"
import type { ToolDefinition } from "@/data/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { calculateAge } from "./engine"

export default function AgeCalculator({ tool: _tool }: { tool: ToolDefinition }) {
  const todayStr = new Date().toISOString().split("T")[0]
  const [birthDate, setBirthDate] = useState<string>("2000-01-01")
  const [targetDate, setTargetDate] = useState<string>(todayStr)

  const result = useMemo(() => {
    return calculateAge(birthDate, targetDate)
  }, [birthDate, targetDate])

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" /> Age Calculator Details
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Date of Birth</Label>
            <Input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="font-mono"
            />
          </div>

          <div className="space-y-2">
            <Label>Calculate Age On</Label>
            <Input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="font-mono"
            />
          </div>
        </CardContent>
      </Card>

      {!result.isValid ? (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="p-6 text-center text-destructive font-medium">
            {result.errorMessage || "Please enter valid dates."}
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Main Primary Age Hero Card */}
          <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20">
            <CardContent className="p-8 flex flex-col items-center text-center gap-4">
              <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Your Exact Age
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

              {result.isFeb29LeapBaby && (
                <p className="text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 px-3 py-1 rounded-full font-medium">
                  🎉 Feb 29 Leap Year Birthday!
                </p>
              )}
            </CardContent>
          </Card>

          {/* Next Birthday & Lifetime Stats Grid */}
          <div className="grid gap-6 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Cake className="h-4 w-4 text-pink-500" /> Next Birthday
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-2xl font-bold font-mono">
                    {result.nextBirthday.daysRemaining}{" "}
                    <span className="text-sm font-normal text-muted-foreground">days remaining</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {result.nextBirthday.dateFormatted} ({result.nextBirthday.dayOfWeek})
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-500" /> Lifetime Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Total Months</p>
                  <p className="text-lg font-bold font-mono">{result.totalMonths.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Weeks</p>
                  <p className="text-lg font-bold font-mono">{result.totalWeeks.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Days</p>
                  <p className="text-lg font-bold font-mono">{result.totalDays.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Hours</p>
                  <p className="text-lg font-bold font-mono">{result.totalHours.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
